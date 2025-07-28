package com.e106.demolition_king.game.vo.out;

import com.e106.demolition_king.game.dto.ReportDto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReportResponseVo {

    private Long reportSeq;
    private Integer singleTopBuilding;
    private Integer multiTopBuilding;
    private Integer goldMedal;
    private Integer silverMedal;
    private Integer bronzeMedal;
    private LocalDateTime createdAt;
    private Integer playCnt;

    public static ReportResponseVo fromDto(ReportDto dto) {
        return ReportResponseVo.builder()
                .reportSeq(dto.getReportSeq())
                .singleTopBuilding(dto.getSingleTopBuilding())
                .multiTopBuilding(dto.getMultiTopBuilding())
                .goldMedal(dto.getGoldMedal())
                .silverMedal(dto.getSilverMedal())
                .bronzeMedal(dto.getBronzeMedal())
                .createdAt(dto.getCreatedAt())
                .playCnt(dto.getPlayCnt())
                .build();
    }
}