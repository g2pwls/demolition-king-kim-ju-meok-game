package com.e106.demolition_king.admin.service;

import com.e106.demolition_king.admin.repository.AdminPurgeRepository;
import com.e106.demolition_king.admin.vo.out.AdminUserListItemVo;
import com.e106.demolition_king.user.entity.User; // ← 기존 엔티티 사용 가정
import com.e106.demolition_king.user.repository.UserRepository; // ← 기존 Repo 가정
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final AdminPurgeRepository purgeRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserListItemVo> list(String keyword, Pageable pageable) {
        Page<User> page;
        if (keyword == null || keyword.isBlank()) {
            page = userRepository.findAll(pageable);
        } else {
            // 필드명은 프로젝트 엔티티에 맞게 조정: userEmail/userNickname 등
            page = userRepository.findByUserEmailContainingIgnoreCaseOrUserNicknameContainingIgnoreCase(
                    keyword, keyword, pageable
            );
        }

        return page.map(u -> AdminUserListItemVo.builder()
                .userUuid(u.getUserUuid())
                .userEmail(u.getUserEmail())
                .userNickname(u.getUserNickname())
                .createdAt(u.getCreatedAt())
                .build());
    }

    @Override
    @Transactional
    public void forceDelete(String uuid) {
        // 1) 연관 테이블 수동 정리 (FK 미사용 전제)
        purgeRepository.purgeFriends(uuid);
        purgeRepository.purgePlayerSkins(uuid);
        purgeRepository.purgeUserConstructures(uuid);
        purgeRepository.purgeGold(uuid);
        purgeRepository.purgeReport(uuid);
        purgeRepository.purgeReportPerDate(uuid);
        purgeRepository.purgeBugReport(uuid);

        // 2) 유저 삭제
        userRepository.deleteById(uuid);
    }
}