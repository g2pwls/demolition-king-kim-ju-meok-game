package com.e106.demolition_king.friend.dto;


import lombok.*;
import com.e106.demolition_king.friend.entity.InviteStatus;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InviteDto {
    /** PK */
    private Long id;

    /** 신청자 UUID */
    private String fromUserUuid;

    /** 수신자(UUID) */
    private String toUserUuid;

    /** 신청 상태 (PENDING, ACCEPTED, REJECTED) */
    private InviteStatus status;

    /** 생성 시각 */
    private LocalDateTime createdAt;

    /** 수정 시각 */
    private LocalDateTime updatedAt;
}
