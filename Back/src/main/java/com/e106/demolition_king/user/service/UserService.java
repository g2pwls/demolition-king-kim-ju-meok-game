package com.e106.demolition_king.user.service;


import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.user.vo.in.ResetPasswordRequestVo;
import com.e106.demolition_king.user.vo.out.NicknameCheckResponseVo;
import com.e106.demolition_king.user.vo.out.ResetPasswordResponseVo;
import com.e106.demolition_king.user.vo.out.TokenResponseVo;

public interface UserService {
    void signup(SignupRequestDto request);
    public TokenResponseVo login(LoginRequestVo vo);
    TokenResponseVo tokenRefresh(String refreshToken);

    // 추가
    void withdraw(String userUuid, String rawPassword);

    NicknameCheckResponseVo checkNickname(String nickname);

    ResetPasswordResponseVo resetPassword(ResetPasswordRequestVo req);

    }
