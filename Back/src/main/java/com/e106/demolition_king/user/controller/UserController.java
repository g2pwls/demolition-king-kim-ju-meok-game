package com.e106.demolition_king.user.controller;

import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.common.base.BaseResponseStatus;
import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.dto.VerifyPasswordRequestDto;
import com.e106.demolition_king.user.service.UserServiceImpl;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.user.vo.in.NicknameCheckRequestVo;
import com.e106.demolition_king.user.vo.in.ResetPasswordRequestVo;
import com.e106.demolition_king.user.vo.in.WithdrawRequestVo;
import com.e106.demolition_king.user.vo.out.*;
import com.e106.demolition_king.util.JwtUtil;
import com.fasterxml.jackson.databind.ser.Serializers;
import io.swagger.v3.oas.annotations.Parameter;import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/api/user/auth")
@RequiredArgsConstructor
@Tag(name = "회원&권한", description = "회원&권한 인증 관련 API")
public class UserController {
    private final UserServiceImpl userService;
    private final JwtUtil jwtUtil;

    @Operation(
            summary = "회원 가입",
            description = "사용자의 회원 가입을 진행합니다.",
            tags = {"회원&권한"}
    )
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@ParameterObject SignupRequestDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok("Signup success");
    }

    @Operation(
            summary = "닉네임 중복 검사",
            description = "회원가입 시 입력한 닉네임의 중복 여부를 확인합니다.",
            tags = {"회원&권한"}
    )

    @PostMapping("/signup/nickname/check")
    public BaseResponse<NicknameCheckResponseVo> checkNickname(
            @RequestBody NicknameCheckRequestVo requestVo
    ) {
        NicknameCheckResponseVo result = userService.checkNickname(requestVo.getNickname());
        return BaseResponse.of(result);
    }
    @Operation(
            summary = "닉네임 변경",
            description = "마이페이지에서 인증된 유저의 닉네임을 변경합니다.",
            tags = {"회원&권한"}
    )
    @PutMapping("/nickname")
    public BaseResponse<Void> changeNickname(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody NicknameCheckRequestVo req
    ) {
        // 1) Authorization 헤더 검사
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return BaseResponse.error(BaseResponseStatus.INVALID_AUTH_HEADER);
        }
        String token = authorizationHeader.substring(7);
        // 2) JWT 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            return BaseResponse.error(BaseResponseStatus.TOKEN_NOT_VALID);
        }
        String userUuid = jwtUtil.getUserUuid(token);
        // 4) 닉네임 변경
        userService.updateNickname(userUuid, req.getNickname());
        // 5) 성공 응답
        return BaseResponse.ok();
    }

    @Operation(
            summary = "로그인",
            description = "로그인으로 사용자의 엑세스 & 리프레쉬 토큰을 발급받습니다.",
            tags = {"회원&권한"}
    )
    @PostMapping("/login")
    public BaseResponse<TokenResponseVo> login(@ParameterObject LoginRequestVo vo) {
        return BaseResponse.of(userService.login(vo));
    }
    @Operation(
            summary = "비밀번호 검증",
            description = "올바른 비밀번호를 입력했는지 검증합니다."
    )
    @PostMapping("/password/verify")
    public BaseResponse<Void> verifyPassword(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody VerifyPasswordRequestDto dto
    ) {
        // 1. Bearer 토큰 파싱
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization 헤더가 잘못되었습니다.");
        }
        String token = authorizationHeader.substring(7); // "Bearer " 제거
        // 2. 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        String userUuid = jwtUtil.getUserUuid(token);

        if (!userService.isCurrentPasswordValid(userUuid, dto.getCurrentPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }
        return BaseResponse.ok();
    }


    @Operation(
            summary = "비밀번호 변경",
            description = "인증 완료된 이메일에 대해 새 비밀번호를 입력받아 변경합니다."
    )
    @PostMapping("/password/reset")
    public BaseResponse<PasswordResponseVo> resetPassword(
            @RequestBody ResetPasswordRequestVo requestVo) {
        PasswordResponseVo result = userService.resetPassword(requestVo);
        return BaseResponse.of(result);
    }


    @Operation(
            summary = "리프레쉬 토큰 갱신",
            description = "리프레쉬 토큰을 이용하여 토근 재발급",
            tags = {"회원&권한"}
    )
    @PostMapping("/tokenrefresh")
    public BaseResponse<TokenResponseVo> tokenrefresh(
            @Parameter(
                    name = "RefreshToken",
                    description = "쿠키 {리프레시 토큰}",
                    required = true,
                    example = "쿠키에 있는 리프레시 토큰을 가져오기"
            )
            @CookieValue("refreshToken") String refreshToken ) {
        return BaseResponse.of(userService.tokenRefresh(refreshToken));
    }

    @DeleteMapping("/withdraw")
    @Operation(summary = "회원 탈퇴", description = "비밀번호 확인 후 회원 탈퇴 처리")
    public BaseResponse<SimpleMessageResponseVo> withdraw(
            @ParameterObject WithdrawRequestVo vo,
            Authentication authentication
    ) {
        // authentication.getName() 으로 userUuid 조회
        userService.withdraw(authentication.getName(), vo.getPassword());
        return BaseResponse.of(SimpleMessageResponseVo.builder()
                .message("Withdraw success")
                .build());
    }

    @Operation(
            summary = "회원 조회",
            description = "회원 uuid로 회원 조회합니다.",
            tags = {"회원&권한"}
    )
    @GetMapping("/getUserInfo")
    public BaseResponse<GetUserInfoResponseVo> getUserInfo(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        // 1. Bearer 토큰 파싱
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

        // 4. 서비스 호출
        return BaseResponse.of(userService.getUserByUuid(userUuid));
    }






}