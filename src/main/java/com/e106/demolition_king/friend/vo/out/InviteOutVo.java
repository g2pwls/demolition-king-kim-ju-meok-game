package com.e106.demolition_king.friend.vo.out;


import com.e106.demolition_king.friend.entity.InviteStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//친구 신청 결과 응답용 VO
public class InviteOutVo {

    /** InviteList PK */
    private Long id;
    /** 신청자 UUID */
    private String fromUserUuid;
    /** 대상자 UUID */
    private String toUserUuid;
    /** 신청 상태 */
    private InviteStatus status;
    /** 생성 시각 */
    private LocalDateTime createdAt;
    /** 수정 시각 */
    private LocalDateTime updatedAt;
}
