package com.e106.demolition_king.constructure.repository;

import com.e106.demolition_king.constructure.entity.UserConstructure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserConstructureRepository extends JpaRepository<UserConstructure, Integer> {

    // 특정 유저가 보유한 건물 전체 조회
    List<UserConstructure> findByUserUuid(String userUuid);

    // 특정 유저가 이미 보유한 건물인지 확인 (중복 방지용)
    boolean existsByUserUuidAndConstructureSeq(String userUuid, Integer constructureSeq);
}
