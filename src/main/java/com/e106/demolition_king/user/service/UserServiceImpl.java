package com.e106.demolition_king.user.service;

import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.entity.User;
import com.e106.demolition_king.user.repository.LoginResponseDto;
import com.e106.demolition_king.user.repository.UserRepository;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserRepository userRepository;         // ✂️ JPA 레포지토리
    private final PasswordEncoder passwordEncoder;       // ✂️ SecurityConfig에서 주입된 BCrypt 인코더
    private final JwtUtil jwtUtil;                       // ✂️ 토큰 생성·검증 유틸

    /**
     * 회원가입 처리
     */
    @Override
    @Transactional
    public void signup(SignupRequestDto dto) {
        // ✂️ UUID 생성
        User user = User.builder()
                .userUuid(UUID.randomUUID().toString())
                .userEmail(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .userNickname(dto.getUserNickname())
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .updatedAt(new Timestamp(System.currentTimeMillis()))
                .build();

        userRepository.save(user);
    }

    /**
     * 로그인 처리: 이메일/비밀번호 검증 후 Access & Refresh 토큰 발급
     */
    @Override
    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestVo dto) {
        User user = userRepository.findByUserEmail(dto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        // ✂️ 권한은 예시로 USER 하나만 부여
        String accessToken  = jwtUtil.createAccessToken(user.getUserUuid(), List.of("USER"));
        String refreshToken = jwtUtil.createRefreshToken(user.getUserUuid());

        return new LoginResponseDto(accessToken, refreshToken);
    }

    /**
     * Spring Security 인증용: JWT 필터에서 호출됩니다.
     * 여기서는 userUuid를 username으로 사용합니다.
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String userUuid) throws UsernameNotFoundException {
        User user = userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Spring Security 표준 UserDetails 객체 생성
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUserUuid())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }
}
