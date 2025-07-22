package com.e106.demolition_king.user.service;

import com.e106.demolition_king.user.dto.SignupRequest;
import com.e106.demolition_king.user.entity.Profile;
import com.e106.demolition_king.user.entity.User;
import com.e106.demolition_king.user.repository.ProfileRepository;
import com.e106.demolition_king.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void signup(SignupRequest request) {
        if (userRepository.findByUserEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("이미 등록된 이메일입니다.");
        }

        if (userRepository.findByUserNickname(request.getUserNickname()).isPresent()) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        Profile profile = profileRepository.findById(request.getProfileSeq())
                .orElseThrow(() -> new RuntimeException("프로필이 존재하지 않습니다."));

        User user = new User();
        user.setUserUuid(UUID.randomUUID().toString());
        user.setUserEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserNickname(request.getUserNickname());
        user.setProfile(profile);
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        userRepository.save(user);
    }
}
