package com.e106.demolition_king.user.service;


import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.repository.LoginResponseDto;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;

public interface UserService {
    void signup(SignupRequestDto request);
    public LoginResponseDto login(LoginRequestVo dto);
}
