package com.example.achievement_tracker_backend.repository;

import com.example.achievement_tracker_backend.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByStudentId(Long studentId);
    List<Achievement> findByStatus(String status);
    List<Achievement> findByDepartment(String department);
}
