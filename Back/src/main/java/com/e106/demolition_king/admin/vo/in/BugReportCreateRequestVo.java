package com.e106.demolition_king.admin.vo.in;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class BugReportCreateRequestVo {
    private String content; // 작성 내용
}