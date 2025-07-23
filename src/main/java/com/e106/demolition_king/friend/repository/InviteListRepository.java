package com.e106.demolition_king.friend.repository;


import com.e106.demolition_king.friend.entity.InviteList;
import com.e106.demolition_king.friend.entity.InviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InviteListRepository extends JpaRepository<InviteList, Long> {
    //fromUser → toUser 로 이미 PENDING 상태인 신청이 있는지 확인
    Optional<InviteList> findByFromUserUserUuidAndToUserUserUuidAndStatus(String from, String to, InviteStatus status);

    //toUser 기준, 특정 상태인 모든 신청 목록 조회
    List<InviteList> findAllByToUserUserUuidAndStatus(String toUserUuid, InviteStatus status);
}
