package com.e106.demolition_king.admin.repository;

import com.e106.demolition_king.admin.entity.BugReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BugReportRepository extends JpaRepository<BugReport, Integer> {
}
