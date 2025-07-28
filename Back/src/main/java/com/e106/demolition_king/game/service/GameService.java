package com.e106.demolition_king.game.service;


import com.e106.demolition_king.game.dto.ReportDto;
import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.user.vo.out.TokenResponseVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


public interface GameService {
    public List<ReportDto> getUserReport(String uuid);
}
