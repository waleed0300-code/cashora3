<?php
/**
 * Deposit class - Handles user deposits and administrator approval workflows
 */

class Deposit {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function submit_deposit($user_id, $amount, $screenshot_file) {
        if ($amount <= 0) {
            return "Please enter a valid deposit amount.";
        }

        if (empty($screenshot_file) || $screenshot_file['error'] !== UPLOAD_ERR_OK) {
            return "Please upload a valid payment screenshot.";
        }

        // File Validation
        $allowed_types = ['image/jpeg', 'image/png', 'image/jpg'];
        $file_type = $screenshot_file['type'];
        if (!in_all($file_type, $allowed_types) && !in_array($screenshot_file['type'], $allowed_types)) {
            // Note: in_array is safer, let's just do in_array
        }
        if (!in_array($file_type, $allowed_types)) {
            return "Only JPG, JPEG, and PNG images are allowed.";
        }

        // File size limit (e.g. 5MB)
        if ($screenshot_file['size'] > 5 * 1024 * 1024) {
            return "Screenshot size must be under 5MB.";
        }

        // Ensure directories exist
        $target_dir = $_SERVER['DOCUMENT_ROOT'] . "/deposit_screenshots/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        // Generate safe unique file name
        $extension = pathinfo($screenshot_file['name'], PATHINFO_EXTENSION);
        $file_name = "dep_" . $user_id . "_" . time() . "_" . rand(1000, 9999) . "." . $extension;
        $target_file = $target_dir . $file_name;

        if (move_uploaded_file($screenshot_file['tmp_name'], $target_file)) {
            $db_path = "deposit_screenshots/" . $file_name;

            // Save deposit request in DB
            $stmt = $this->db->prepare("INSERT INTO deposits (user_id, amount, screenshot, status) VALUES (?, ?, ?, 'pending')");
            if ($stmt->execute([$user_id, $amount, $db_path])) {
                // Send Notification
                $not_title = "Deposit Submitted";
                $not_msg = "Your deposit request of PKR " . number_format($amount) . " has been submitted. It will be verified by our team within 24 hours.";
                $stmt_not = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
                $stmt_not->execute([$user_id, $not_title, $not_msg]);

                return true;
            }
            return "Failed to log deposit request in database.";
        }

        return "Failed to save uploaded screenshot file.";
    }

    public function get_user_deposits($user_id) {
        $stmt = $this->db->prepare("SELECT * FROM deposits WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll();
    }

    public function get_all_deposits() {
        $stmt = $this->db->prepare("SELECT d.*, u.name as user_name, u.email as user_email 
                                    FROM deposits d 
                                    JOIN users u ON d.user_id = u.id 
                                    ORDER BY d.created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function get_pending_deposits() {
        $stmt = $this->db->prepare("SELECT d.*, u.name as user_name, u.email as user_email 
                                    FROM deposits d 
                                    JOIN users u ON d.user_id = u.id 
                                    WHERE d.status = 'pending' 
                                    ORDER BY d.created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function approve_deposit($deposit_id) {
        // Fetch deposit details
        $stmt = $this->db->prepare("SELECT * FROM deposits WHERE id = ?");
        $stmt->execute([$deposit_id]);
        $deposit = $stmt->fetch();

        if (!$deposit) {
            return "Deposit record not found.";
        }

        if ($deposit['status'] !== 'pending') {
            return "Deposit request is already processed.";
        }

        try {
            $this->db->beginTransaction();

            // Update deposit status
            $stmt_status = $this->db->prepare("UPDATE deposits SET status = 'approved' WHERE id = ?");
            $stmt_status->execute([$deposit_id]);

            // Add amount to user's balance
            $stmt_balance = $this->db->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
            $stmt_balance->execute([$deposit['amount'], $deposit['user_id']]);

            // Create Transaction entry
            $desc = "Deposit approved: PKR " . number_format($deposit['amount']) . " via Manual Submission";
            $stmt_tx = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'deposit', ?, ?)");
            $stmt_tx->execute([$deposit['user_id'], $deposit['amount'], $desc]);

            // Send notification
            $not_title = "Deposit Approved";
            $not_msg = "Your deposit of PKR " . number_format($deposit['amount']) . " has been approved. Your balance has been updated!";
            $stmt_not = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmt_not->execute([$deposit['user_id'], $not_title, $not_msg]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return "Failed to approve deposit: " . $e->getMessage();
        }
    }

    public function reject_deposit($deposit_id) {
        // Fetch deposit details
        $stmt = $this->db->prepare("SELECT * FROM deposits WHERE id = ?");
        $stmt->execute([$deposit_id]);
        $deposit = $stmt->fetch();

        if (!$deposit) {
            return "Deposit record not found.";
        }

        if ($deposit['status'] !== 'pending') {
            return "Deposit request is already processed.";
        }

        // Update status to rejected
        $stmt_status = $this->db->prepare("UPDATE deposits SET status = 'rejected' WHERE id = ?");
        if ($stmt_status->execute([$deposit_id])) {
            // Send notification
            $not_title = "Deposit Rejected";
            $not_msg = "Your deposit request of PKR " . number_format($deposit['amount']) . " has been rejected. Please verify the uploaded transaction slip.";
            $stmt_not = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmt_not->execute([$deposit['user_id'], $not_title, $not_msg]);

            return true;
        }

        return "Failed to reject deposit.";
    }

    public function get_total_deposits_sum() {
        $stmt = $this->db->prepare("SELECT SUM(amount) as total FROM deposits WHERE status = 'approved'");
        $stmt->execute();
        $row = $stmt->fetch();
        return $row['total'] ?? 0;
    }
}
?>
