package com.e106.demolition_king.game.repository;



import com.e106.demolition_king.game.entity.ReportPerDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportPerDateRepository extends JpaRepository<ReportPerDate, Integer> {

    Optional<ReportPerDate> findByUserUuidAndPlayDate(String userUuid, String playDate);
}