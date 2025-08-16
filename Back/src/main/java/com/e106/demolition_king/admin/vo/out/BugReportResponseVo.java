package com.e106.demolition_king.admin.vo.out;

import com.e106.demolition_king.admin.entity.BugReport;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class BugReportResponseVo {
    private Integer bugReportSeq;
    private String userUuid;
    private String content;
    private LocalDateTime createdAt;

    public static BugReportResponseVo fromEntity(BugReport e) {
        return BugReportResponseVo.builder()
                .bugReportSeq(e.getBugReportSeq())
                .userUuid(e.getUserUuid())
                .content(e.getContent())
                .createdAt(e.getCreatedAt())
                .build();
    }
}