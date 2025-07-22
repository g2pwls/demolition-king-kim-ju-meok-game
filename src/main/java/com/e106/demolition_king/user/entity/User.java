package com.e106.demolition_king.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class User {
    @Id
    private String userUuid;

    @Column(length = 50, unique = true, nullable = false)
    private String userEmail;

    private String password;
    private String userNickname;
    private String kakaoAccessToken;
    private String googleAccess;

    @ManyToOne
    @JoinColumn(name = "profile_seq")
    private Profile profile;

    private Timestamp createdAt;
    private Timestamp updatedAt;
}
