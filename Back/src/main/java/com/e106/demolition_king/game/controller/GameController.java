package com.e106.demolition_king.game.controller;


import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.friend.service.FriendService;
import com.e106.demolition_king.friend.vo.out.FriendResponseVo;
import com.e106.demolition_king.game.service.GameService;
import com.e106.demolition_king.game.service.GameServiceImpl;
import com.e106.demolition_king.game.vo.in.ReportUpdateRequestVo;
import com.e106.demolition_king.game.vo.out.ReportResponseVo;
import com.e106.demolition_king.game.vo.out.ReportUpdateResponseVo;
import com.e106.demolition_king.user.vo.in.EmailVerificationReRequestVo;
import com.e106.demolition_king.user.vo.out.EmailVerificationReResponseVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Game", description = "게임 동작 API")
@RestController
@RequestMapping("/api/users/games")
@RequiredArgsConstructor
public class GameController {

    private final GameServiceImpl gameService;

    @Operation(summary = "사용자 리포트 조회", description = "특정 사용자의 리포트 정보를 반환합니다.")
    @GetMapping("/{userUuid}/reports")
    public List<ReportResponseVo> getUserReports(@PathVariable String userUuid) {
        return gameService.getUserReport(userUuid)
                .stream()
                .map(ReportResponseVo::fromDto)
                .collect(Collectors.toList());
    }

    @Operation(summary = "사용자 리포트 정보 갱신", description = "특정 사용자의 리포트 정보를 갱신합니다.")
    @PatchMapping("/reportUpdates")
    public BaseResponse<String> updateUserReports(
            @ParameterObject ReportUpdateRequestVo requestvo) {
        System.out.println("requestvo = " + requestvo);
        gameService.updateUserReport(requestvo.toDto(requestvo));
        return BaseResponse.of(" ");
    }

}
