package com.bazaar.backend.dto.auth;

import com.bazaar.backend.entity.Role;
import com.bazaar.backend.entity.User;

import java.util.UUID;

public record UserSummary(
        UUID id,
        String name,
        String email,
        Role role
) {
    public static UserSummary from(User user) {
        return new UserSummary(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
