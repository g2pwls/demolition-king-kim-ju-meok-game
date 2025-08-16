package com.e106.demolition_king.admin.service;

import com.e106.demolition_king.admin.vo.in.BugReportCreateRequestVo;
import com.e106.demolition_king.admin.vo.out.BugReportResponseVo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminBugReportService {
    BugReportResponseVo create(String userUuid, BugReportCreateRequestVo vo);
    Page<BugReportResponseVo> list(Pageable pageable);
}