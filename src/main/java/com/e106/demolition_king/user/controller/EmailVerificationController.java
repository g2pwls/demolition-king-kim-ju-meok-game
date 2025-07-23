package com.e106.demolition_king.user.controller;

import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.user.service.EmailVerificationService;
import com.e106.demolition_king.user.vo.in.EmailVerificationReRequestVo;
import com.e106.demolition_king.user.vo.in.EmailVerificationRequestVo;
import com.e106.demolition_king.user.vo.out.EmailVerificationReResponseVo;
import com.e106.demolition_king.user.vo.out.EmailVerificationResponseVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;


@RestController
@Log4j2
@RequestMapping("/api/v1/user/email")
@RequiredArgsConstructor
@Tag(name = "이메일 인증", description = "이메일 인증 관련 API")
public class EmailVerificationController {
    private final EmailVerificationService service;

    @Operation(
            summary = "인증 코드 전송",
            description = "유저 이메일로 인증 코드를 전송합니다.",
            tags = {"이메일 인증"}
    )
    @PostMapping("/receive")
    public ResponseEntity<BaseResponse<EmailVerificationResponseVo>> sendCode(
            @ParameterObject EmailVerificationRequestVo requestvo) {
        EmailVerificationResponseVo responsevo = service.sendCode(requestvo);
        return ResponseEntity.ok(BaseResponse.of(responsevo));
    }

    @Operation(
            summary = "인증 코드 검증",
            description = "유저 이메일과 인증 코드로 비밀번호 변경화면 넘어가기전 인증합니다.",
            tags = {"이메일 인증"}
    )
    @PostMapping("/send")
    public ResponseEntity<BaseResponse<EmailVerificationReResponseVo>> checkCode(
            @ParameterObject EmailVerificationReRequestVo requestvo) {
        EmailVerificationReResponseVo responsevo = service.checkCode(requestvo);
        return ResponseEntity.ok(BaseResponse.of(responsevo));
    }

}

