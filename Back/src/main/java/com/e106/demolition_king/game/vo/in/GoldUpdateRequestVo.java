package com.e106.demolition_king.game.vo.in;

import com.e106.demolition_king.game.dto.GoldDto;
import com.e106.demolition_king.game.dto.ReportDto;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class GoldUpdateRequestVo {
    private String userUuid;
    private Integer goldCnt;

    public GoldDto toDto(GoldUpdateRequestVo vo) {
        return GoldDto.builder()
                .userUuid(vo.getUserUuid())
                .goldCnt(vo.getGoldCnt())
                .build();
    }
}