package com.e106.demolition_king.admin.controller;

import com.e106.demolition_king.admin.service.AdminUserService;
import com.e106.demolition_king.admin.vo.out.AdminUserListItemVo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    // 1) 회원 리스트 (검색/페이징)
    @GetMapping
    public ResponseEntity<Page<AdminUserListItemVo>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(adminUserService.list(keyword, pageable));
    }

    // 2) 회원 강제 추방
    @DeleteMapping("/{userUuid}")
    public ResponseEntity<Void> forceDelete(@PathVariable String userUuid) {
        adminUserService.forceDelete(userUuid);
        return ResponseEntity.noContent().build();
    }
}