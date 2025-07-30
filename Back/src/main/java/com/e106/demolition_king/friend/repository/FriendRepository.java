package com.e106.demolition_king.friend.repository;


import com.e106.demolition_king.friend.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long> {

    //특정 사용자의 친구 목록 조회
    List<Friend> findAllByUserUserUuid(String userUuid);

    //친구 관계 존재 여부 확인 (중복 신청/등록 방지용)
    boolean existsByUserUserUuidAndFriendUserUuid(String userUuid, String friendUuid);

    //특정 친구 관계 단건 조회
    Optional<Friend> findByUserUserUuidAndFriendUserUuid(String userUuid, String friendUuid);

    boolean existsByUser_UserUuidAndFriend_UserUuidAndStatus(String userUuid, String friendUuid, String status);

    Optional<Friend> findByUser_UserUuidAndFriend_UserUuidAndStatus(String userUuid, String friendUuid, String status);

    Optional<Friend> findByUser_UserUuidAndFriend_UserUuid(String userUuid, String friendUuid);

}