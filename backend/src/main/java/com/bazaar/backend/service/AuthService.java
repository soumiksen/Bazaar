package com.bazaar.backend.service;

import com.bazaar.backend.dto.auth.AuthResponse;
import com.bazaar.backend.dto.auth.RefreshRequest;
import com.bazaar.backend.dto.auth.SigninRequest;
import com.bazaar.backend.dto.auth.SignupRequest;
import com.bazaar.backend.dto.auth.UserSummary;
import com.bazaar.backend.entity.User;
import com.bazaar.backend.exception.EmailAlreadyExistsException;
import com.bazaar.backend.repository.UserRepository;
import com.bazaar.backend.security.JwtService;
import com.bazaar.backend.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new EmailAlreadyExistsException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();

        userRepository.save(user);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse signin(SigninRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
        );

        User user = ((UserPrincipal) authentication.getPrincipal()).getUser();
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        User user = refreshTokenService.validateAndRotate(request.refreshToken());
        return buildAuthResponse(user);
    }

    @Transactional
    public void logout(RefreshRequest request) {
        refreshTokenService.revoke(request.refreshToken());
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = refreshTokenService.issue(user);

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessTokenTtlSeconds(),
                UserSummary.from(user)
        );
    }
}
