package com.e106.demolition_king.friend.service;

import com.e106.demolition_king.friend.dto.FriendDto;
import com.e106.demolition_king.friend.repository.FriendRepository;
import com.e106.demolition_king.friend.vo.out.FriendStatusVo;
import com.e106.demolition_king.friend.websocket.PresenceService;
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
}
