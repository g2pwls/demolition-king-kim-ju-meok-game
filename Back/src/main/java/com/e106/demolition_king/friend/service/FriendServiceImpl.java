package com.e106.demolition_king.friend.service;

import com.e106.demolition_king.friend.dto.FriendDto;
import com.e106.demolition_king.friend.dto.FriendRequestDto;
import com.e106.demolition_king.friend.entity.Friend;
import com.e106.demolition_king.friend.repository.FriendRepository;
import com.e106.demolition_king.friend.service.validator.FriendValidator;
import com.e106.demolition_king.friend.vo.out.FriendStatusVo;
import com.e106.demolition_king.friend.websocket.FriendRedisService;
import com.e106.demolition_king.friend.websocket.FriendWebSocketService;
import com.e106.demolition_king.friend.websocket.PresenceService;
import com.e106.demolition_king.user.entity.User;
import com.e106.demolition_king.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendServiceImpl implements FriendService {

    private final PresenceService presenceService;
    private final FriendRepository friendRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final FriendValidator friendValidator;
    private final FriendWebSocketService friendWebSocketService;
    private final FriendRedisService friendRedisService;

    @Override
    public List<FriendDto> getFriends(String userUuid) {
        return friendRepository.findAllByUserUserUuid(userUuid).stream()
                .map(f -> FriendDto.builder()
                        .id(f.getId())
                        .userUuid(f.getUser().getUserUuid())
                        .friendUuid(f.getFriend().getUserUuid())
                        .friendNickname(f.getFriend().getUserNickname())
                        .createdAt(f.getCreatedAt())
                        .updatedAt(f.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<FriendStatusVo> getFriendListWithStatus(String userUuid) {
        List<FriendDto> dtoList = getFriends(userUuid);

        return dtoList.stream()
                .map(dto -> {
                    String friendUuid = dto.getFriendUuid();
                    boolean isOnline = presenceService.isOnline(friendUuid);
                    String status = isOnline ? "online" : "offline";
                    return FriendStatusVo.fromDto(dto, status); // 이 부분이 핵심
                })
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void sendFriendRequest(String senderUuid, FriendRequestDto requestDto) {
        User sender = userRepository.findByUserUuid(senderUuid)
                .orElseThrow(() -> new RuntimeException("보내는 유저가 존재하지 않습니다."));

        User receiver = userRepository.findByUserUuid(requestDto.getFriendUuid())
                .orElseThrow(() -> new RuntimeException("받는 유저가 존재하지 않습니다."));

        // 검증
        friendValidator.validateFriendRequest(sender, receiver);

        // 친구 요청 저장 (status: PENDING)
        Friend friend = Friend.builder()
                .user(sender)
                .friend(receiver)
                .status("PENDING")
                .build();
        friendRepository.save(friend);

        // 다음 단계: 온라인 여부에 따라 STOMP or Redis 알림
        String friendUuid = receiver.getUserUuid();
        if (presenceService.isOnline(friendUuid)) {
            friendWebSocketService.sendFriendRequest(friendUuid, sender.getUserUuid(), sender.getUserNickname());
        } else {
            friendRedisService.savePendingRequest(friendUuid, sender.getUserUuid(), sender.getUserNickname());
        }
    }

}
