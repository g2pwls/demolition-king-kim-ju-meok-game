package com.e106.demolition_king.social.controller;

import com.e106.demolition_king.social.service.UserOnboardingService;
import com.e106.demolition_king.user.entity.User;
import com.e106.demolition_king.user.repository.UserRepository;
import com.e106.demolition_king.user.service.UserServiceImpl;
import com.e106.demolition_king.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserOnboardingService onboardingService;
    private final UserServiceImpl userService;

    public OAuth2SuccessHandler(JwtUtil jwtUtil,
                                UserRepository userRepository,
                                UserOnboardingService onboardingService, UserServiceImpl userService) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.onboardingService = onboardingService;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");
        String sub   = (String) oAuth2User.getAttributes().get("sub");
        String googleName = (String) oAuth2User.getAttributes().get("name");
        String state = request.getParameter("state");

        // OIDC 사용자 (google issuer-uri 사용 시)
        var principal = (org.springframework.security.oauth2.core.oidc.user.OidcUser) authentication.getPrincipal();

        // 최근 인증 시간(auth_time) 확인 (seconds since epoch). 없으면 issuedAt로 대체.
        java.time.Instant now = java.time.Instant.now();
        Object authTimeClaim = principal.getIdToken().getClaim("auth_time");
        java.time.Instant authTime = null;
        if (authTimeClaim instanceof Integer i) {
            authTime = java.time.Instant.ofEpochSecond(i.longValue());
        } else if (authTimeClaim instanceof Long l) {
            authTime = java.time.Instant.ofEpochSecond(l);
        } else {
            authTime = principal.getIdToken().getIssuedAt(); // fallback
        }

        boolean recentAuth = authTime != null && java.time.Duration.between(authTime, now).getSeconds() <= 120;

        if ("delete".equals(state)) {
            // ✅ 회원탈퇴 플로우
            if (!recentAuth) {
                // 재인증이 오래되었으면 다시 시도하게 안내 (원하면 에러 페이지로)
                redirect(response, "/account/delete?error=reauth_required");
                return;
            }
            // 현재 사용자 삭제
            userService.deleteByEmail(email);    // 아래 예시 메서드 구현
            // 토큰/쿠키 제거
            response.setHeader("Set-Cookie", "ACCESS_TOKEN=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None");
            response.addHeader("Set-Cookie", "REFRESH_TOKEN=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None");
            redirect(response, "/account/delete/done");
            return;
        }

        // upsert by email
        User user = userRepository.findByUserEmail(email).orElseGet(() -> onboardingService.createNewUserWithDefaults(email, sub, googleName));

        if (user.getGoogleSub() == null) {
            user.setGoogleSub(sub);
            user.setUpdatedAt(Timestamp.from(Instant.now()));
            userRepository.save(user);
        }

        // roles가 없으면 빈 리스트로
        String access  = jwtUtil.createAccessToken(user.getUserEmail(), List.of());
        String refresh = jwtUtil.createRefreshToken(user.getUserEmail());

        // HttpOnly + Secure + SameSite=None
        ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", access)
                .httpOnly(true).secure(true).sameSite("None").path("/")
                .maxAge(10 * 60) // 10분
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refresh)
                .httpOnly(true).secure(true).sameSite("None").path("/")
                .maxAge(7 * 24 * 60 * 60) // 7일
                .build();

        response.addHeader("Set-Cookie", accessCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        // 성공 후 원하는 경로로 리디렉트
        try {
            response.sendRedirect("https://i13e106.p.ssafy.io/main");
        } catch (Exception ignored) { }
    }

    private void redirect(HttpServletResponse response, String path) {
        try {
            response.sendRedirect(path);
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
    }
}
