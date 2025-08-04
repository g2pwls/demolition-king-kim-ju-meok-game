package com.e106.demolition_king.game.service;


import com.e106.demolition_king.game.dto.GoldDto;
import com.e106.demolition_king.game.dto.ReportDto;
import com.e106.demolition_king.game.dto.ReportPerDateRequestDto;
import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.user.vo.out.TokenResponseVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


public interface GameService {
    public List<ReportDto> getUserReport(String uuid);

    public void updateUserReport(ReportDto newData);

    void upsertReport(ReportPerDateRequestDto dto);

    public void updateGold(GoldDto dto);

    public int getGold(String userUuid);

    public String payGold(String userUuid, Integer spendGold);
}
