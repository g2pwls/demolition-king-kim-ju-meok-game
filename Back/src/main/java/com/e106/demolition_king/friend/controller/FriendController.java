package com.e106.demolition_king.friend.controller;


import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.friend.dto.FriendRequestDto;
import com.e106.demolition_king.friend.service.FriendService;
import com.e106.demolition_king.friend.vo.out.FriendResponseVo;
import com.e106.demolition_king.friend.vo.out.FriendStatusVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Friend", description = "친구 목록 조회 API")
@RestController
@RequestMapping("/api/users/{userUuid}/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;


    @Operation(summary = "초대 가능한 친구 목록 조회", description = "FRIEND 상태이며 현재 온라인 중인 친구만 반환")
    @GetMapping("/invite-targets")
    public BaseResponse<List<FriendStatusVo>> listInvitableFriends(@PathVariable String userUuid) {
        List<FriendStatusVo> inviteTargets = friendService.getInvitableFriends(userUuid);
        return BaseResponse.of(inviteTargets);
    }

    @Operation(summary = "받은 친구 요청 목록 조회")
    @GetMapping("/requests")
    public BaseResponse<List<FriendStatusVo>> listFriendRequests(@PathVariable String userUuid) {
        List<FriendStatusVo> pendingList = friendService.getPendingRequestList(userUuid);
        return BaseResponse.of(pendingList);
    }

    @Operation(summary = "친구 요청 보내기")
    @PostMapping("/invite")
    public ResponseEntity<String> sendFriendRequest(
            @PathVariable String userUuid,
            @RequestParam String friendUuid
    ) {
        FriendRequestDto requestDto = new FriendRequestDto();
        requestDto.setFriendUuid(friendUuid);

        friendService.sendFriendRequest(userUuid, requestDto);
        return ResponseEntity.ok("친구 요청이 전송되었습니다.");
    }

    @Operation(summary = "친구 목록 + 온라인 상태 조회", description = "친구 목록과 온라인 상태를 반환(내uuid를 기준으로 frienduuid 목록을 온라인유무를 반환)")
    @GetMapping("/status")
    public BaseResponse<List<FriendStatusVo>> listFriendsWithStatus(@PathVariable String userUuid) {
        List<FriendStatusVo> friendStatusList = friendService.getFriendListWithStatus(userUuid);
        return BaseResponse.of(friendStatusList);
    }

    @Operation(summary = "친구 요청 수락")
    @PatchMapping("/accept")
    public ResponseEntity<String> acceptFriendRequest(
            @PathVariable String userUuid,
            @RequestParam String friendUuid
    ) {
        friendService.acceptFriendRequest(userUuid, friendUuid);
        return ResponseEntity.ok("친구 요청을 수락했습니다.");
    }

    @Operation(summary = "친구 요청 거절")
    @DeleteMapping("/reject")
    public ResponseEntity<String> rejectFriendRequest(
            @PathVariable String userUuid,
            @RequestParam String friendUuid
    ) {
        friendService.rejectFriendRequest(userUuid, friendUuid);
        return ResponseEntity.ok("친구 요청을 거절했습니다.");
    }

    @Operation(summary = "친구 삭제")
    @DeleteMapping
    public ResponseEntity<String> deleteFriend(
            @PathVariable String userUuid,
            @RequestParam String friendUuid
    ) {
        friendService.deleteFriend(userUuid, friendUuid);
        return ResponseEntity.ok("친구가 삭제되었습니다.");
    }

}
