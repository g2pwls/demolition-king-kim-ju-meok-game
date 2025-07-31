package com.e106.demolition_king.skin.repository;

import com.e106.demolition_king.skin.entity.PlayerSkin;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerSkinRepository extends JpaRepository<PlayerSkin, Integer> {

    // 해당 유저의 선택된 스킨 조회
    Optional<PlayerSkin> findByUserUuidAndIsSelect(String userUuid, int isSelect);

    // 해당 유저 + 스킨 키로 조회
    Optional<PlayerSkin> findByUserUuidAndPlayerSkinItemSeq(String userUuid, Integer playerSkinItemSeq);

//    @Query("SELECT ps.playerSkinItem.image FROM PlayerSkin ps WHERE ps.userUuid = :userUuid AND ps.isSelect = 1")
//    String findSelectedImageByUserUuid(@Param("userUuid") String userUuid);
}
