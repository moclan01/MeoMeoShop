package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.User;
import com.example.meo_meo_shop.repository.UserRepository;

import java.util.Optional;

public class UserServiceImpl extends AServiceImpl<User, String> implements IService<User, String> {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        super(userRepository);
        this.userRepository = userRepository;
    }

    @Override
    public User update(String id, User updatedUser) {
        // Tìm user cũ
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        // Cập nhật các trường cho phép sửa
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setRole(updatedUser.getRole());

        // Lưu lại
        return userRepository.save(existingUser);
    }

    @Override
    public Optional<User> getById(String id) {
        return userRepository.findById(id);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean checkUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.isPresent() && userOpt.get().getPassword().equals(password);
    }
}
