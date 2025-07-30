package com.e106.demolition_king.game.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_per_date")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportPerDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportDateSeq;

    private String userUuid;

    private String playDate; // yyyyMMdd

    private Integer kcal;

    private BigDecimal playTimeDate;

    private LocalDateTime createdAt;

    public void update(int additionalKcal, BigDecimal additionalPlayTime) {
        this.kcal += additionalKcal;
        this.playTimeDate = this.playTimeDate.add(additionalPlayTime);
    }

}