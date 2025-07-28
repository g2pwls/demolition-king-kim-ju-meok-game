package com.e106.demolition_king.friend.controller;


import com.e106.demolition_king.friend.service.FriendService;
import com.e106.demolition_king.friend.vo.out.FriendResponseVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Friend", description = "친구 목록 조회 API")
@RestController
@RequestMapping("/api/users/{userUuid}/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @Operation(summary = "친구 목록 조회", description = "특정 사용자의 친구 목록을 반환합니다.")
    @GetMapping
    public List<FriendResponseVo> listFriends(@PathVariable String userUuid) {
        return friendService.getFriends(userUuid).stream()
                .map(FriendResponseVo::fromDto)
                .collect(Collectors.toList());
    }
}
