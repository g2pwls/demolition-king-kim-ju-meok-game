package com.e106.demolition_king.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class User {
    @Id
    @Column(name = "user_uuid", length = 36, nullable = false)
    private String userUuid;

    @Column(length = 50, unique = true, nullable = false)
    private String userEmail;

    @Column(name = "password", length = 100)
    private String password;
    @Column(name = "user_nickname", length = 50, unique = true)
    private String userNickname;
    @Column(name = "kakao_access_token", length = 500, unique = true)
    private String kakaoAccessToken;
    @Column(name = "google_access", length = 500, unique = true)
    private String googleAccess;

    @ManyToOne
    @JoinColumn(name = "profile_seq")
    private Profile profile;

    private Timestamp createdAt;
    private Timestamp updatedAt;

}
