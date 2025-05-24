package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.dto.UserRegistrationDTO;
import com.example.meo_meo_shop.entity.User;
import com.example.meo_meo_shop.service.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserServiceImpl userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserServiceImpl userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        if (id == null || id.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<User> user = userService.getById(id);
        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserRegistrationDTO registrationDTO) {
        // Kiểm tra dữ liệu đầu vào từ DTO
        if (registrationDTO == null || registrationDTO.getEmail() == null || registrationDTO.getEmail().trim().isEmpty() ||
                registrationDTO.getPassword() == null || registrationDTO.getPassword().trim().isEmpty() ||
                registrationDTO.getName() == null || registrationDTO.getName().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra email đã tồn tại
        if (userService.existsByEmail(registrationDTO.getEmail())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        // Tạo entity User từ DTO và gán vai trò mặc định
        User user = new User();
        user.setName(registrationDTO.getName());
        user.setEmail(registrationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword())); // Mã hóa mật khẩu
        user.setPhone(registrationDTO.getPhone());
        user.setAddress(registrationDTO.getAddress());
        user.setRole("USER"); // Gán vai trò mặc định

        User createdUser = userService.create(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        // Kiểm tra dữ liệu đầu vào
        if (id == null || id.trim().isEmpty() || updatedUser == null ||
                (updatedUser.getName() != null && updatedUser.getName().trim().isEmpty())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            User updated = userService.update(id, updatedUser);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (id == null || id.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<User> user = userService.getById(id);
        if (user.isPresent()) {
            userService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/by-email")
    public ResponseEntity<User> findUserByEmail(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<User> user = userService.findByEmail(email);
        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam String email, @RequestParam String password) {
        try {
            User user = userService.authenticate(email, password);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<Void> changePassword(@PathVariable String userId,
                                               @RequestParam String oldPassword,
                                               @RequestParam String newPassword) {
        if (userId == null || userId.trim().isEmpty() ||
                oldPassword == null || oldPassword.trim().isEmpty() ||
                newPassword == null || newPassword.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        userService.changePassword(userId, oldPassword, newPassword);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
