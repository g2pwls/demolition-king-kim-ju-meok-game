package com.e106.demolition_king.friend.controller;


import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.friend.service.FriendService;
import com.e106.demolition_king.friend.vo.out.FriendResponseVo;
import com.e106.demolition_king.friend.vo.out.FriendStatusVo;
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
    public BaseResponse<List<FriendResponseVo>> listFriends(@PathVariable String userUuid) {
        List<FriendResponseVo> friends = friendService.getFriends(userUuid).stream()
                .map(FriendResponseVo::fromDto)
                .collect(Collectors.toList());
        return BaseResponse.of(friends);
    }

    @Operation(summary = "친구 목록 + 온라인 상태 조회", description = "친구 목록과 온라인 상태를 반환합니다.")
    @GetMapping("/status")
    public BaseResponse<List<FriendStatusVo>> listFriendsWithStatus(@PathVariable String userUuid) {
        List<FriendStatusVo> friendStatusList = friendService.getFriendListWithStatus(userUuid);
        return BaseResponse.of(friendStatusList);
    }
}
