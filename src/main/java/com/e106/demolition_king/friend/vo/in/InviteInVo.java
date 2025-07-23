package com.e106.demolition_king.friend.vo.in;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InviteInVo {
    /** 신청자 UUID */
    private String fromUserUuid;
    /** 대상자 UUID */
    private String toUserUuid;
}
