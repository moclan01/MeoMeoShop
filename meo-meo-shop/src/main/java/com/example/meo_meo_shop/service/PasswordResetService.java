package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.PasswordResetToken;
import com.example.meo_meo_shop.entity.User;
import com.example.meo_meo_shop.repository.PasswordResetTokenRepository;
import com.example.meo_meo_shop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.EntityManager;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public void createPasswordResetTokenForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Check if a token already exists for this user
        Optional<PasswordResetToken> existingTokenOptional = tokenRepository.findByUser_UserId(user.getUserId());

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken;

        if (existingTokenOptional.isPresent()) {
            // If a token exists, update the existing one
            resetToken = existingTokenOptional.get();
            resetToken.setToken(token);
            resetToken.setExpiryDate(calculateExpiryDate()); // Update expiry date
            resetToken.setUsed(false); // Mark as not used

        } else {
            // If no token exists, create a new one
            resetToken = new PasswordResetToken(token, user);
            resetToken.setExpiryDate(calculateExpiryDate()); // Set expiry date
        }

        // Save (either updated existing or new) token
        tokenRepository.save(resetToken);

        // Send email
        String resetLink = "http://localhost:3000/reset-password/" + token; // Use the generated token
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link below:\n\n" + resetLink +
                       "\n\nThis link will expire in 24 hours.\n\n" +
                       "If you did not request a password reset, please ignore this email.");
        mailSender.send(message);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Token has expired");
        }

        if (resetToken.isUsed()) {
            throw new RuntimeException("Token has already been used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }

    // Helper method to calculate expiry date (e.g., 24 hours from now)
    private Date calculateExpiryDate() {
        return Date.from(Instant.now().plus(24, ChronoUnit.HOURS));
    }
} 