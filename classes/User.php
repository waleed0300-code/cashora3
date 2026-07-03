<?php
/**
 * User class - Handles registration, login, and user account actions
 */

class User {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function register($name, $email, $password, $confirm_password) {
        if (empty($name) || empty($email) || empty($password)) {
            return "All fields are required.";
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return "Invalid email address.";
        }

        if ($password !== $confirm_password) {
            return "Passwords do not match.";
        }

        if (strlen($password) < 6) {
            return "Password must be at least 6 characters long.";
        }

        // Check if email already exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            return "Email is already registered.";
        }

        // Generate unique referral code
        $referral_code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));

        // Hash password
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);

        // Insert new user with PKR 150 Signup Bonus
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, balance, signup_bonus, referral_code) VALUES (?, ?, ?, 150.00, 150.00, ?)");
        if ($stmt->execute([$name, $email, $hashed_password, $referral_code])) {
            $user_id = $this->db->lastInsertId();

            // Log Transaction for Signup Bonus
            $stmt_tx = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'bonus', 150.00, 'Signup Bonus Credited')");
            $stmt_tx->execute([$user_id]);

            // Add Notification
            $stmt_not = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, 'Registration Successful', 'Welcome to Cashora! You have received PKR 150 signup bonus.')");
            $stmt_not->execute([$user_id]);

            return true;
        }

        return "Registration failed. Please try again.";
    }

    public function login($email, $password) {
        if (empty($email) || empty($password)) {
            return "All fields are required.";
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            if ($user['status'] === 'frozen') {
                return "Your account has been frozen by the administrator. Please contact support.";
            }

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['role'];

            return true;
        }

        return "Invalid email or password.";
    }

    public function logout() {
        unset($_SESSION['user_id']);
        unset($_SESSION['user_name']);
        unset($_SESSION['user_email']);
        unset($_SESSION['user_role']);
        session_destroy();
        return true;
    }

    public function get_profile($user_id) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        return $stmt->fetch();
    }

    public function update_profile($user_id, $name, $email) {
        if (empty($name) || empty($email)) {
            return "All fields are required.";
        }

        // Check if email is already taken by another user
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->execute([$email, $user_id]);
        if ($stmt->fetch()) {
            return "Email is already taken.";
        }

        $stmt = $this->db->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
        if ($stmt->execute([$name, $email, $user_id])) {
            $_SESSION['user_name'] = $name;
            $_SESSION['user_email'] = $email;
            return true;
        }
        return "Failed to update profile.";
    }

    public function change_password($user_id, $current_password, $new_password) {
        if (empty($current_password) || empty($new_password)) {
            return "All fields are required.";
        }

        $stmt = $this->db->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();

        if ($user && password_verify($current_password, $user['password'])) {
            $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
            $stmt = $this->db->prepare("UPDATE users SET password = ? WHERE id = ?");
            if ($stmt->execute([$hashed_password, $user_id])) {
                return true;
            }
        }
        return "Current password is incorrect.";
    }

    public function add_balance($user_id, $amount, $description = 'Balance Added') {
        $stmt = $this->db->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
        if ($stmt->execute([$amount, $user_id])) {
            $stmt_tx = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'deposit', ?, ?)");
            $stmt_tx->execute([$user_id, $amount, $description]);
            return true;
        }
        return false;
    }

    public function deduct_balance($user_id, $amount, $description = 'Balance Deducted') {
        $stmt = $this->db->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
        if ($stmt->execute([$amount, $user_id])) {
            $stmt_tx = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'withdrawal', ?, ?)");
            $stmt_tx->execute([$user_id, $amount, $description]);
            return true;
        }
        return false;
    }

    public function get_all_users() {
        $stmt = $this->db->prepare("SELECT * FROM users ORDER BY created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function update_status($user_id, $status) {
        $stmt = $this->db->prepare("UPDATE users SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $user_id]);
    }

    public function update_role($user_id, $role) {
        $stmt = $this->db->prepare("UPDATE users SET role = ? WHERE id = ?");
        return $stmt->execute([$role, $user_id]);
    }

    public function delete_user($user_id) {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$user_id]);
    }
}
?>
