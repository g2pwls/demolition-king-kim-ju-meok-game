package com.e106.demolition_king.admin.service;

import com.e106.demolition_king.admin.vo.out.AdminUserListItemVo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    Page<AdminUserListItemVo> list(String keyword, Pageable pageable);
    void forceDelete(String userUuid);
}