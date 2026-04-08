package com.example.achievement_tracker_backend.config;

import com.example.achievement_tracker_backend.model.Achievement;
import com.example.achievement_tracker_backend.model.User;
import com.example.achievement_tracker_backend.repository.AchievementRepository;
import com.example.achievement_tracker_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, AchievementRepository achievementRepository, org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE achievements MODIFY certificate_url LONGTEXT");
            } catch (Exception e) {
                System.out.println("Alter table failed or already applied: " + e.getMessage());
            }

            userRepository.findAll().forEach(user -> {
                if (user.getPassword() == null) {
                    if ("admin".equals(user.getRole())) user.setPassword("admin123");
                    else user.setPassword("student123");
                    userRepository.save(user);
                }
            });

            if (userRepository.count() == 0) {
                userRepository.save(new User(null, "Admin User", "admin@achievetrack.com", "admin123", "admin", null, null));
                userRepository.save(new User(null, "John Doe", "john@student.com", "student123", "student", "CS2021001", "Computer Science"));
                userRepository.save(new User(null, "Jane Smith", "jane@student.com", "student123", "student", "EC2021015", "Electronics"));
                userRepository.save(new User(null, "Mike Johnson", "mike@student.com", "student123", "student", "ME2021032", "Mechanical"));

                achievementRepository.save(new Achievement(null, 2L, "John Doe", "CS2021001", "Computer Science", 
                    "National Hackathon 2026", "Technical", "National", "First Prize", 
                    LocalDate.parse("2026-01-15"), "https://example.com/cert1.pdf", 
                    "Won first prize in national level hackathon for developing an AI-based solution", 
                    "approved", LocalDateTime.parse("2026-01-16T10:00:00"), 
                    "Admin User", LocalDateTime.parse("2026-01-17T14:30:00"), null));

                achievementRepository.save(new Achievement(null, 3L, "Jane Smith", "EC2021015", "Electronics", 
                    "International Robotics Challenge", "Technical", "International", "Participation", 
                    LocalDate.parse("2026-02-10"), "https://example.com/cert3.pdf", 
                    "Participated in international robotics competition", 
                    "pending", LocalDateTime.parse("2026-02-11T15:00:00"), 
                    null, null, null));
                    
                System.out.println("Mock data initialized in H2 database.");
            }
        };
    }
}
