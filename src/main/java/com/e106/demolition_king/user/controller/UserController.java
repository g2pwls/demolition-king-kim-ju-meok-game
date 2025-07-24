package com.e106.demolition_king.user.controller;

import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.entity.User;
import com.e106.demolition_king.user.repository.LoginResponseDto;
import com.e106.demolition_king.user.repository.UserRepository;
import com.e106.demolition_king.user.service.UserService;
import com.e106.demolition_king.user.service.UserServiceImpl;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequestDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok("Signup success");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestVo dto) {
        return ResponseEntity.ok(userService.login(dto));
    }
}

