package com.e106.demolition_king.friend.service;

import com.e106.demolition_king.friend.dto.FriendDto;
import com.e106.demolition_king.friend.repository.FriendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendService {

    private final FriendRepository friendRepository;

    //특정 사용자의 친구 목록을 조회
    public List<FriendDto> getFriends(String userUuid) {
        return friendRepository.findAllByUserUserUuid(userUuid).stream()
                .map(f -> FriendDto.builder()
                        .id(f.getId())
                        .userUuid(f.getUser().getUserUuid())
                        .friendUuid(f.getFriend().getUserUuid())
                        .friendNickname(f.getFriend().getUserNickname())
                        .createdAt(f.getCreatedAt())
                        .updatedAt(f.getUpdatedAt())
                        .build()
                )
                .collect(Collectors.toList());
    }

}