-- Cashora Earning & Investment Platform Schema
-- InfinityFree & MySQL Compatible

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `balance` DECIMAL(15, 2) DEFAULT 0.00,
  `signup_bonus` DECIMAL(15, 2) DEFAULT 150.00,
  `status` ENUM('active', 'frozen') DEFAULT 'active',
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `referral_code` VARCHAR(50) UNIQUE NOT NULL,
  `profile_pic` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `deposit_amount` DECIMAL(15, 2) NOT NULL,
  `profit_amount` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('enabled', 'disabled') DEFAULT 'enabled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `package_id` INT NOT NULL,
  `status` ENUM('active', 'completed') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `deposits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `screenshot` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `withdrawals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `method` VARCHAR(100) NOT NULL,
  `account_number` VARCHAR(100) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` ENUM('deposit', 'withdrawal', 'bonus', 'purchase', 'earning') NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `description` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read') DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `easypaisa_number` VARCHAR(100) NOT NULL,
  `jazzcash_number` VARCHAR(100) NOT NULL,
  `bank_account` VARCHAR(100) NOT NULL,
  `account_title` VARCHAR(255) NOT NULL,
  `website_name` VARCHAR(255) DEFAULT 'Cashora',
  `logo` VARCHAR(255) NULL,
  `banner_title` VARCHAR(255) DEFAULT 'Earning & Investment Platform',
  `banner_subtitle` TEXT NULL,
  `footer_text` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `reply` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `balance`, `signup_bonus`, `status`, `role`, `referral_code`)
VALUES ('Cashora Admin', 'admin@cashora.com', '$2y$10$I610F6zZ5yN6gKzXfNqDvevEaor474VvS0m0mfeLqVq8A.VOn/7yG', 0.00, 150.00, 'active', 'admin', 'CASHORA_ADMIN')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Insert default packages
INSERT INTO `packages` (`title`, `deposit_amount`, `profit_amount`, `status`) VALUES
('Starter Package', 300.00, 50.00, 'enabled'),
('Bronze Package', 500.00, 100.00, 'enabled'),
('Silver Package', 1000.00, 250.00, 'enabled'),
('Gold Package', 3000.00, 800.00, 'enabled'),
('Platinum Package', 5000.00, 1500.00, 'enabled')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Insert default settings
INSERT INTO `settings` (`id`, `easypaisa_number`, `jazzcash_number`, `bank_account`, `account_title`, `website_name`, `banner_title`, `banner_subtitle`, `footer_text`)
VALUES (1, '0300-1234567', '0315-9876543', 'PK99UNIL00000123456789', 'Cashora Private Ltd', 'Cashora', 'Smart Investments, Consistent Daily Earnings', 'Join Cashora and start earning money today. High-yield investment plans with guaranteed daily returns and secure fast payouts directly to Easypaisa and JazzCash.', '© 2026 Cashora. All Rights Reserved. Fully Compatible with InfinityFree hosting.')
ON DUPLICATE KEY UPDATE `id`=`id`;
