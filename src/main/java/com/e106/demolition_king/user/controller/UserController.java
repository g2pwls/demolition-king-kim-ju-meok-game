package com.e106.demolition_king.user.controller;

import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.service.UserServiceImpl;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.user.vo.out.TokenResponseVo;
import io.swagger.v3.oas.annotations.Parameter;import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/api/user/auth")
@RequiredArgsConstructor
@Tag(name = "회원&권한", description = "회원&권한 인증 관련 API")
public class UserController {
    private final UserServiceImpl userService;

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
            summary = "로그인",
            description = "로그인으로 사용자의 엑세스 & 리프레쉬 토큰을 발급받습니다.",
            tags = {"회원&권한"}
    )
    @PostMapping("/login")
    public BaseResponse<TokenResponseVo> login(@ParameterObject LoginRequestVo vo) {
        return BaseResponse.of(userService.login(vo));
    }

    @Operation(
            summary = "리프레쉬 토큰 갱신",
            description = "리프레쉬 토큰을 이용하여 토근 재발급",
            tags = {"회원&권한"}
    )
    @PostMapping("/tokenrefresh")
    public BaseResponse<TokenResponseVo> tokenrefresh(
            @Parameter(
                    name = "Authorization",
                    description = "Bearer {리프레시 토큰}",
                    required = true,
                    example = "여긴 공백 스웨거 우측 상단 권한설정에 값 입력하면 됌"
            )
            @RequestHeader("Authorization") String header) {
        String refreshToken = header.substring(7);

        return BaseResponse.of(userService.tokenRefresh(refreshToken));
    }




}

