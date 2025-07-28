package com.e106.demolition_king.game.vo.in;

import com.e106.demolition_king.game.dto.ReportDto;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class ReportUpdateRequestVo {
    private String userUuid;
    private Long reportSeq;
    private Integer singleTopBuilding;
    private Integer multiTopBuilding;
    private Integer goldMedal;
    private Integer silverMedal;
    private Integer bronzeMedal;
    private Integer playCnt;
    private BigDecimal playTime;

    public ReportDto toDto(ReportUpdateRequestVo vo) {
        return ReportDto.builder()
                .reportSeq(vo.getReportSeq())
                .userUuid(vo.getUserUuid())
                .singleTopBuilding(vo.getSingleTopBuilding())
                .multiTopBuilding(vo.getMultiTopBuilding())
                .goldMedal(vo.getGoldMedal())
                .silverMedal(vo.getSilverMedal())
                .bronzeMedal(vo.getBronzeMedal())
                .playCnt(vo.getPlayCnt())
                .playTime(vo.getPlayTime())
                .build();
    }
}