<?php
/**
 * Package class - Handles Investment Package administration and activations
 */

class Package {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function get_active_packages() {
        $stmt = $this->db->prepare("SELECT * FROM packages WHERE status = 'enabled' ORDER BY deposit_amount ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function get_all_packages() {
        $stmt = $this->db->prepare("SELECT * FROM packages ORDER BY deposit_amount ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function get_package_by_id($id) {
        $stmt = $this->db->prepare("SELECT * FROM packages WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create_package($title, $deposit_amount, $profit_amount) {
        if (empty($title) || $deposit_amount <= 0 || $profit_amount <= 0) {
            return "Please provide valid package details.";
        }
        $stmt = $this->db->prepare("INSERT INTO packages (title, deposit_amount, profit_amount, status) VALUES (?, ?, ?, 'enabled')");
        return $stmt->execute([$title, $deposit_amount, $profit_amount]);
    }

    public function update_package($id, $title, $deposit_amount, $profit_amount, $status) {
        $stmt = $this->db->prepare("UPDATE packages SET title = ?, deposit_amount = ?, profit_amount = ?, status = ? WHERE id = ?");
        return $stmt->execute([$title, $deposit_amount, $profit_amount, $status, $id]);
    }

    public function delete_package($id) {
        $stmt = $this->db->prepare("DELETE FROM packages WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function activate_package($user_id, $package_id) {
        // Fetch package
        $package = $this->get_package_by_id($package_id);
        if (!$package) {
            return "Selected package is invalid or disabled.";
        }

        // Fetch user balance
        $stmt = $this->db->prepare("SELECT balance, name FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();
        if (!$user) {
            return "User not found.";
        }

        $cost = $package['deposit_amount'];
        $profit = $package['profit_amount'];

        if ($user['balance'] < $cost) {
            return "Insufficient balance to activate this package. Please deposit funds first.";
        }

        try {
            $this->db->beginTransaction();

            // Deduct balance
            $stmt_deduct = $this->db->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
            $stmt_deduct->execute([$cost, $user_id]);

            // Create active package entry
            $stmt_activate = $this->db->prepare("INSERT INTO user_packages (user_id, package_id, status) VALUES (?, ?, 'active')");
            $stmt_activate->execute([$user_id, $package_id]);

            // Log Transaction
            $description = "Activated Package: " . $package['title'] . " (Cost: PKR " . number_format($cost) . ")";
            $stmt_tx = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'purchase', ?, ?)");
            $stmt_tx->execute([$user_id, $cost, $description]);

            // Add notification
            $not_title = "Package Activated";
            $not_msg = "Your " . $package['title'] . " has been successfully activated. PKR " . number_format($cost) . " has been deducted. You will receive PKR " . number_format($profit) . " daily profit shortly.";
            $stmt_not = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmt_not->execute([$user_id, $not_title, $not_msg]);

            // Auto-Generate Profit (For InfinityFree compatibility since cron is unavailable, we credit profit immediately or log it)
            // In a real production setup, profit is added on log or login, let's credit the profit instantly as a daily yield simulator
            $stmt_profit = $this->db->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
            $stmt_profit->execute([$profit, $user_id]);

            // Log earning transaction
            $profit_desc = "Daily Earning from " . $package['title'];
            $stmt_tx_profit = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'earning', ?, ?)");
            $stmt_tx_profit->execute([$user_id, $profit, $profit_desc]);

            // Add notification for earning
            $not_earn_title = "Daily Earning Credited";
            $not_earn_msg = "PKR " . number_format($profit) . " profit from " . $package['title'] . " has been credited to your balance.";
            $stmt_not_earn = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmt_not_earn->execute([$user_id, $not_earn_title, $not_earn_msg]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return "Activation failed: " . $e->getMessage();
        }
    }

    public function get_user_packages($user_id) {
        $stmt = $this->db->prepare("SELECT up.*, p.title, p.deposit_amount, p.profit_amount 
                                    FROM user_packages up 
                                    JOIN packages p ON up.package_id = p.id 
                                    WHERE up.user_id = ? 
                                    ORDER BY up.created_at DESC");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll();
    }

    public function get_total_active_packages_count() {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM user_packages WHERE status = 'active'");
        $stmt->execute();
        $row = $stmt->fetch();
        return $row['count'] ?? 0;
    }
}
?>
