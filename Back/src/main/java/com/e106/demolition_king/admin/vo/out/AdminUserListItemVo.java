package com.e106.demolition_king.admin.vo.out;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AdminUserListItemVo {
    private String userUuid;
    private String userEmail;
    private String userNickname;
    private Timestamp createdAt;
}