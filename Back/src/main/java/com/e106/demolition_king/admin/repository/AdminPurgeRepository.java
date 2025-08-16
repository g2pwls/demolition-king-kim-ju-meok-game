package com.e106.demolition_king.admin.repository;

import com.e106.demolition_king.user.entity.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AdminPurgeRepository extends JpaRepository<User, String> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM friend WHERE user_uuid = :uuid OR friend_uuid = :uuid", nativeQuery = true)
    int purgeFriends(@Param("uuid") String uuid);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM playerskin WHERE user_uuid = :uuid", nativeQuery = true)
    int purgePlayerSkins(@Param("uuid") String uuid);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM user_constructure WHERE user_uuid = :uuid", nativeQuery = true)
    int purgeUserConstructures(@Param("uuid") String uuid);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM gold WHERE user_uuid = :uuid", nativeQuery = true)
    int purgeGold(@Param("uuid") String uuid);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM report WHERE user_uuid = :uuid", nativeQuery = true)
    int purgeReport(@Param("uuid") String uuid);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM report_per_date WHERE user_uuid = :uuid", nativeQuery = true)
    int purgeReportPerDate(@Param("uuid") String uuid);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM bug_report WHERE user_uuid = :uuid", nativeQuery = true)
    int purgeBugReport(@Param("uuid") String uuid);
}