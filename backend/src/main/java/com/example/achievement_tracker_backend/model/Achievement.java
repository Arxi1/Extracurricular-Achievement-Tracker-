package com.example.achievement_tracker_backend.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "achievements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String department;
    private String eventName;
    private String eventCategory;
    private String level;
    private String awardType;
    private LocalDate date;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String certificateUrl;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String status; // "pending", "approved", "rejected"
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private String approvedBy;
    private LocalDateTime approvedAt;
    
    private String rejectionReason;
}
