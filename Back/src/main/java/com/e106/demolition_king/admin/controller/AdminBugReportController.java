package com.e106.demolition_king.admin.controller;

import com.e106.demolition_king.admin.service.AdminBugReportService;
import com.e106.demolition_king.admin.vo.in.BugReportCreateRequestVo;
import com.e106.demolition_king.admin.vo.out.BugReportResponseVo;
import com.e106.demolition_king.util.JwtUtil; // 프로젝트에 존재 가정
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/bug-reports")
@RequiredArgsConstructor
public class AdminBugReportController {

    private final AdminBugReportService bugReportService;
    private final JwtUtil jwtUtil; // 토큰에서 UUID 추출

    @PostMapping
    public ResponseEntity<BugReportResponseVo> create(
            HttpServletRequest request,
            @RequestBody BugReportCreateRequestVo vo
    ) {
        // 1) 헤더에서 Bearer 제거된 순수 토큰 추출
        String token = jwtUtil.resolveToken(request);
        if (token == null) {
            return ResponseEntity.status(401).build();
        }

        // 2) 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }

        // 3) subject = userUuid
        String userUuid = jwtUtil.getUserUuid(token);
        if (userUuid == null || userUuid.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        // 4) 내용 검증(선택)
        if (vo.getContent() == null || vo.getContent().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(bugReportService.create(userUuid, vo));
    }


    @GetMapping
    public ResponseEntity<Page<BugReportResponseVo>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bugReportService.list(pageable));
    }
}