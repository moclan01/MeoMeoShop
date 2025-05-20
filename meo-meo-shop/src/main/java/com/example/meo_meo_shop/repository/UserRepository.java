package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
