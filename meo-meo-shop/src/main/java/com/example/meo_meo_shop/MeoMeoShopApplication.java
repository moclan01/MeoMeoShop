package com.example.meo_meo_shop;

import com.example.meo_meo_shop.entity.User;
import com.example.meo_meo_shop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.meo_meo_shop")
public class MeoMeoShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(MeoMeoShopApplication.class, args);
	}

	@Bean
	public CommandLineRunner createAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Kiểm tra xem tài khoản admin đã tồn tại chưa
			if (userRepository.findByEmail("admin@example.com").isEmpty()) {
				User adminUser = new User();
				// userId sẽ được tạo tự động nếu sử dụng GenerationType.IDENTITY
				// Nếu userId là String và bạn muốn set thủ công, cần generate UUID hoặc logic khác
				// Tạm thời bỏ qua userId ở đây nếu nó là tự động tăng

				adminUser.setName("Admin User");
				adminUser.setEmail("admin@example.com");
				adminUser.setPassword(passwordEncoder.encode("adminpassword")); // Đổi 'adminpassword' thành mật khẩu mạnh hơn
				adminUser.setPhone("0123456789"); // Thông tin tùy chọn
				adminUser.setAddress("Admin Address"); // Thông tin tùy chọn
				adminUser.setRole("ADMIN"); // Gán vai trò ADMIN

				userRepository.save(adminUser);
				System.out.println("Admin user created!");
			}
		};
	}

}
