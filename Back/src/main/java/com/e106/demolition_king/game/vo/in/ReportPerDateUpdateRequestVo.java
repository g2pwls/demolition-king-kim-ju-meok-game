package com.e106.demolition_king.game.vo.in;

import com.e106.demolition_king.game.dto.ReportDto;
import com.e106.demolition_king.game.dto.ReportPerDateRequestDto;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class ReportPerDateUpdateRequestVo {
    private String userUuid;
    private Integer kcal;
    private BigDecimal playTimeDate;

    public ReportPerDateRequestDto toDto(ReportPerDateUpdateRequestVo vo) {
        return ReportPerDateRequestDto.builder()
                .userUuid(vo.getUserUuid())
                .kcal(vo.getKcal())
                .playDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .playTimeDate(vo.getPlayTimeDate())
                .build();
    }
}