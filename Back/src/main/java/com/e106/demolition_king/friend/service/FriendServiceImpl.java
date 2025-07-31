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
    public List<FriendStatusVo> getInvitableFriends(String userUuid) {
        return friendRepository.findAllByUserUserUuidAndStatus(userUuid, "FRIEND").stream()
                .filter(friend -> {
                    String targetUuid = friend.getFriend().getUserUuid();
                    return presenceService.isOnline(targetUuid);
                })
                .map(friend -> {
                    String targetUuid = friend.getFriend().getUserUuid();

                    FriendDto dto = FriendDto.builder()
                            .id(friend.getId())
                            .userUuid(friend.getUser().getUserUuid())
                            .friendUuid(targetUuid)
                            .friendNickname(friend.getFriend().getUserNickname())
                            .createdAt(friend.getCreatedAt())
                            .updatedAt(friend.getUpdatedAt())
                            .build();

                    return FriendStatusVo.fromDto(dto, "online");
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<FriendStatusVo> getPendingRequestList(String myUuid) {
        return friendRepository.findAllByFriendUserUuidAndStatus(myUuid, "PENDING").stream()
                .map(f -> {
                    String requesterUuid = f.getUser().getUserUuid();
                    boolean isOnline = presenceService.isOnline(requesterUuid);
                    String status = isOnline ? "online" : "offline";

                    FriendDto dto = FriendDto.builder()
                            .id(f.getId())
                            .userUuid(requesterUuid)
                            .friendUuid(f.getFriend().getUserUuid())
                            .friendNickname(f.getUser().getUserNickname())  // 요청 보낸 사람
                            .createdAt(f.getCreatedAt())
                            .updatedAt(f.getUpdatedAt())
                            .build();

                    return FriendStatusVo.fromDto(dto, status);
                })
                .collect(Collectors.toList());
    }



    @Override
    public List<FriendStatusVo> getFriendListWithStatus(String userUuid) {
        return friendRepository.findAllByUserUserUuidAndStatus(userUuid,"FRIEND").stream()
                .map(f -> {
                    String friendUuid = f.getFriend().getUserUuid();
                    boolean isOnline = presenceService.isOnline(friendUuid);
                    String status = isOnline ? "online" : "offline";

                    FriendDto dto = FriendDto.builder()
                            .id(f.getId())
                            .userUuid(f.getUser().getUserUuid())
                            .friendUuid(friendUuid)
                            .friendNickname(f.getFriend().getUserNickname())
                            .createdAt(f.getCreatedAt())
                            .updatedAt(f.getUpdatedAt())
                            .build();

                    return FriendStatusVo.fromDto(dto, status);
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


    @Transactional
    @Override
    public void acceptFriendRequest(String receiverUuid, String requesterUuid) {
        Friend request = friendRepository.findByUser_UserUuidAndFriend_UserUuidAndStatus(
                requesterUuid, receiverUuid, "PENDING"
        ).orElseThrow(() -> new RuntimeException("친구 요청이 존재하지 않습니다."));

        request.setStatus("FRIEND");
        friendRepository.save(request);

        // 필요 시 양방향 관계 추가도 가능
        Friend reverse = Friend.builder()
                .user(request.getFriend())  // 수락자
                .friend(request.getUser())  // 요청자
                .status("FRIEND")
                .build();
        friendRepository.save(reverse);
    }

    @Transactional
    @Override
    public void rejectFriendRequest(String receiverUuid, String requesterUuid) {
        Friend request = friendRepository.findByUser_UserUuidAndFriend_UserUuidAndStatus(
                requesterUuid, receiverUuid, "PENDING"
        ).orElseThrow(() -> new RuntimeException("친구 요청이 존재하지 않습니다."));

        friendRepository.delete(request);
    }

    @Transactional
    @Override
    public void deleteFriend(String userUuid, String friendUuid) {
        // 한쪽 방향
        friendRepository.findByUser_UserUuidAndFriend_UserUuid(userUuid, friendUuid)
                .ifPresent(friendRepository::delete);

        // 반대 방향
        friendRepository.findByUser_UserUuidAndFriend_UserUuid(friendUuid, userUuid)
                .ifPresent(friendRepository::delete);
    }

}
