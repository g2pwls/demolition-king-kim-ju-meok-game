package com.e106.demolition_king.admin.service;

import com.e106.demolition_king.admin.entity.BugReport;
import com.e106.demolition_king.admin.repository.BugReportRepository;
import com.e106.demolition_king.admin.vo.in.BugReportCreateRequestVo;
import com.e106.demolition_king.admin.vo.out.BugReportResponseVo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminBugReportServiceImpl implements AdminBugReportService {

    private final BugReportRepository bugReportRepository;

    @Override
    @Transactional
    public BugReportResponseVo create(String userUuid, BugReportCreateRequestVo vo) {
        BugReport saved = bugReportRepository.save(
                BugReport.builder()
                        .userUuid(userUuid)
                        .content(vo.getContent())
                        .build()
        );
        return BugReportResponseVo.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BugReportResponseVo> list(Pageable pageable) {
        Page<BugReport> page = bugReportRepository.findAll(
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return page.map(BugReportResponseVo::fromEntity);
    }
}