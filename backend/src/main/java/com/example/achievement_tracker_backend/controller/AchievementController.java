package com.example.achievement_tracker_backend.controller;

import com.example.achievement_tracker_backend.model.Achievement;
import com.example.achievement_tracker_backend.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementRepository achievementRepository;

    @GetMapping
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Achievement> getStudentAchievements(@PathVariable Long studentId) {
        return achievementRepository.findByStudentId(studentId);
    }

    @PostMapping
    public Achievement addAchievement(@RequestBody Achievement achievement) {
        if (achievement.getStatus() == null) {
            achievement.setStatus("pending");
        }
        return achievementRepository.save(achievement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Achievement> updateAchievement(@PathVariable Long id, @RequestBody Achievement achievementDetails) {
        return achievementRepository.findById(id).map(achievement -> {
            if (achievementDetails.getStatus() != null) achievement.setStatus(achievementDetails.getStatus());
            if (achievementDetails.getApprovedBy() != null) {
                achievement.setApprovedBy(achievementDetails.getApprovedBy());
                achievement.setApprovedAt(LocalDateTime.now());
            }
            if (achievementDetails.getRejectionReason() != null) achievement.setRejectionReason(achievementDetails.getRejectionReason());
            // more fields can be updated if needed
            return ResponseEntity.ok(achievementRepository.save(achievement));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable Long id) {
        return achievementRepository.findById(id).map(achievement -> {
            achievementRepository.delete(achievement);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
