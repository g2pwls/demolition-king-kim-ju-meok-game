package com.e106.demolition_king.game.controller;


import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.friend.service.FriendService;
import com.e106.demolition_king.friend.vo.out.FriendResponseVo;
import com.e106.demolition_king.game.service.GameService;
import com.e106.demolition_king.game.service.GameServiceImpl;
import com.e106.demolition_king.game.vo.in.GoldUpdateRequestVo;
import com.e106.demolition_king.game.vo.in.ReportPerDateUpdateRequestVo;
import com.e106.demolition_king.game.vo.in.ReportUpdateRequestVo;
import com.e106.demolition_king.game.vo.out.ReportResponseVo;
import com.e106.demolition_king.game.vo.out.ReportUpdateResponseVo;
import com.e106.demolition_king.user.vo.in.EmailVerificationReRequestVo;
import com.e106.demolition_king.user.vo.out.EmailVerificationReResponseVo;
import com.e106.demolition_king.util.JwtUtil;
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
    private final JwtUtil jwtUtil;

    @Operation(summary = "사용자 리포트 조회", description = "특정 사용자의 리포트 정보를 반환합니다.")
    @GetMapping("/{userUuid}/reports")
    public List<ReportResponseVo> getUserReports( @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization 헤더가 잘못되었습니다.");
        }

        String token = authorizationHeader.substring(7); // "Bearer " 제거

        // 2. 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        // 3. UUID 추출
        String userUuid = jwtUtil.getUserUuid(token);

        return gameService.getUserReport(userUuid)
                .stream()
                .map(ReportResponseVo::fromDto)
                .collect(Collectors.toList());
    }

    @Operation(summary = "사용자 리포트 정보 갱신", description = "특정 사용자의 리포트 정보를 갱신합니다.")
    @PatchMapping("/reportUpdates")
    public BaseResponse<String> updateUserReports(
            @RequestHeader("Authorization") String authorizationHeader,
            @ParameterObject ReportUpdateRequestVo requestvo) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization 헤더가 잘못되었습니다.");
        }

        String token = authorizationHeader.substring(7); // "Bearer " 제거

        // 2. 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        // 3. UUID 추출
        String userUuid = jwtUtil.getUserUuid(token);

        requestvo.setUserUuid(userUuid);

        System.out.println("requestvo = " + requestvo);
        gameService.updateUserReport(requestvo.toDto(requestvo));
        return BaseResponse.of(" ");
    }

    @Operation(summary = "사용자의 일일 리포트 정보 갱신", description = "특정 사용자의 일일 리포트 정보를 갱신합니다.")
    @PatchMapping("/reportPerDateUpdates")
    public BaseResponse<String> upsertReport(
            @RequestHeader("Authorization") String authorizationHeader,
            @ParameterObject ReportPerDateUpdateRequestVo vo) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization 헤더가 잘못되었습니다.");
        }

        String token = authorizationHeader.substring(7); // "Bearer " 제거

        // 2. 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        // 3. UUID 추출
        String userUuid = jwtUtil.getUserUuid(token);

        vo.setUserUuid(userUuid);

        gameService.upsertReport(vo.toDto(vo));
        return BaseResponse.of("일일 통계 저장 완료");
    }

    @Operation(summary = "게임 종료시 골드 업데이트", description = "게임 종료시 골드 업데이트")
    @PatchMapping("/addGoldCnt")
    public BaseResponse<String> upsertReport(
            @RequestHeader("Authorization") String authorizationHeader,
            @ParameterObject GoldUpdateRequestVo vo) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization 헤더가 잘못되었습니다.");
        }

        String token = authorizationHeader.substring(7); // "Bearer " 제거

        // 2. 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        // 3. UUID 추출
        String userUuid = jwtUtil.getUserUuid(token);

        vo.setUserUuid(userUuid);

        gameService.updateGold(vo.toDto(vo));
        return BaseResponse.of("골드 저장 완료");
    }

    @Operation(summary = "회원 골드 조회", description = "회원의 골드를 조회합니다.")
    @GetMapping("/{userUuid}/getGoldByUuid")
    public BaseResponse<Integer> upsertReport( @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization 헤더가 잘못되었습니다.");
        }

        String token = authorizationHeader.substring(7); // "Bearer " 제거

        // 2. 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        // 3. UUID 추출
        String userUuid = jwtUtil.getUserUuid(token);

        return BaseResponse.of(gameService.getGold(userUuid));
    }

}
