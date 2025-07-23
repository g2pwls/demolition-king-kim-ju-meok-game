package com.e106.demolition_king.friend.entity;

import com.e106.demolition_king.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitelist")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InviteList {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitelist_seq")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InviteStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_uuid", nullable = false)
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_uuid", nullable = false)
    private User toUser;
}
