package com.e106.demolition_king.friend.controller;

import com.e106.demolition_king.friend.service.InviteService;
import com.e106.demolition_king.friend.vo.in.InviteInVo;
import com.e106.demolition_king.friend.vo.out.InviteOutVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Invite", description = "친구 신청 API")
@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
public class InviteController {

    private final InviteService inviteService;

    @Operation(summary = "친구 신청", description = "유저 A가 유저 B에게 친구 신청을 보냅니다.")
    @PostMapping
    public ResponseEntity<InviteOutVo> sendInvite(@RequestBody InviteInVo vo) {
        InviteOutVo out = inviteService.sendInvite(vo);
        return ResponseEntity.status(HttpStatus.CREATED).body(out);
    }

    @Operation(summary = "친구 신청 수락", description = "받은 친구 신청을 수락합니다.")
    @PostMapping("/{inviteId}/accept")
    public ResponseEntity<Void> acceptInvite(@PathVariable Long inviteId) {
        inviteService.acceptInvite(inviteId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "친구 신청 거절", description = "받은 친구 신청을 거절합니다.")
    @PostMapping("/{inviteId}/reject")
    public ResponseEntity<Void> rejectInvite(@PathVariable Long inviteId) {
        inviteService.rejectInvite(inviteId);
        return ResponseEntity.noContent().build();
    }
}