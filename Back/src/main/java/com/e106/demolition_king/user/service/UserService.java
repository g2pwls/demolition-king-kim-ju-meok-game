package com.e106.demolition_king.user.service;


import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.user.vo.in.ResetPasswordRequestVo;
import com.e106.demolition_king.user.vo.out.GetUserInfoResponseVo;
import com.e106.demolition_king.user.vo.out.NicknameCheckResponseVo;
import com.e106.demolition_king.user.vo.out.PasswordResponseVo;
import com.e106.demolition_king.user.vo.out.TokenResponseVo;

public interface UserService {
    void signup(SignupRequestDto request);
    public TokenResponseVo login(LoginRequestVo vo);
    TokenResponseVo tokenRefresh(String refreshToken);

    // 추가
    void withdraw(String userUuid, String rawPassword);

    NicknameCheckResponseVo checkNickname(String nickname);

    void updateNickname(String userUuid, String newNickname);

    PasswordResponseVo resetPassword(ResetPasswordRequestVo req);

    public GetUserInfoResponseVo getUserByUuid(String userUuid);

    boolean isCurrentPasswordValid(String userUuid, String currentPassword);

    void updateProfile(String userUuid, Integer profileSeq);

    }

