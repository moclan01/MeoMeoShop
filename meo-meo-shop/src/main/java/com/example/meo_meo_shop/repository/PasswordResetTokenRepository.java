package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser_UserId(String userId);

    // Use a custom query with @Modifying for explicit deletion by user ID
    @Modifying
    @Query("delete from PasswordResetToken t where t.user.userId = :userId")
    @Transactional
    void deleteByUser_UserId(String userId);
} 