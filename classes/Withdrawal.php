<?php
/**
 * Withdrawal class - Handles user payout requests and admin processing
 */

class Withdrawal {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function submit_withdrawal($user_id, $amount, $method, $account_number) {
        if ($amount <= 0) {
            return "Please enter a valid withdrawal amount.";
        }

        if (empty($method) || empty($account_number)) {
            return "Payment method and account number are required.";
        }

        // Fetch user balance
        $stmt = $this->db->prepare("SELECT balance FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();

        if (!$user) {
            return "User not found.";
        }

        if ($user['balance'] < $amount) {
            return "Insufficient balance to perform this withdrawal.";
        }

        try {
            $this->db->beginTransaction();

            // Deduct balance to prevent double spending
            $stmt_deduct = $this->db->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
            $stmt_deduct->execute([$amount, $user_id]);

            // Save withdrawal request in DB as pending
            $stmt_wth = $this->db->prepare("INSERT INTO withdrawals (user_id, amount, method, account_number, status) VALUES (?, ?, ?, ?, 'pending')");
            $stmt_wth->execute([$user_id, $amount, $method, $account_number]);
            $withdrawal_id = $this->db->lastInsertId();

            // Log Transaction (Temporary deduction)
            $desc = "Withdrawal Requested: PKR " . number_format($amount) . " to " . $method . " (" . $account_number . ")";
            $stmt_tx = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'withdrawal', ?, ?)");
            $stmt_tx->execute([$user_id, $amount, $desc]);

            // Add notification
            $not_title = "Withdrawal Submitted";
            $not_msg = "Your withdrawal request for PKR " . number_format($amount) . " has been received. It will be processed within 24 hours.";
            $stmt_not = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmt_not->execute([$user_id, $not_title, $not_msg]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return "Failed to submit withdrawal request: " . $e->getMessage();
        }
    }

    public function get_user_withdrawals($user_id) {
        $stmt = $this->db->prepare("SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll();
    }

    public function get_all_withdrawals() {
        $stmt = $this->db->prepare("SELECT w.*, u.name as user_name, u.email as user_email 
                                    FROM withdrawals w 
                                    JOIN users u ON w.user_id = u.id 
                                    ORDER BY w.created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function get_pending_withdrawals() {
        $stmt = $this->db->prepare("SELECT w.*, u.name as user_name, u.email as user_email 
                                    FROM withdrawals w 
                                    JOIN users u ON w.user_id = u.id 
                                    WHERE w.status = 'pending' 
                                    ORDER BY w.created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function approve_withdrawal($withdrawal_id) {
        $stmt = $this->db->prepare("SELECT * FROM withdrawals WHERE id = ?");
        $stmt->execute([$withdrawal_id]);
        $withdrawal = $stmt->fetch();

        if (!$withdrawal) {
            return "Withdrawal record not found.";
        }

        if ($withdrawal['status'] !== 'pending') {
            return "Withdrawal is already processed.";
        }

        // Set status to approved
        $stmt_status = $this->db->prepare("UPDATE withdrawals SET status = 'approved' WHERE id = ?");
        if ($stmt_status->execute([$withdrawal_id])) {
            // Log Transaction or Update description if needed (already deducted on submission, so just log success)
            // Send notification
            $not_title = "Withdrawal Approved";
            $not_msg = "Your withdrawal of PKR " . number_format($withdrawal['amount']) . " via " . $withdrawal['method'] . " has been successfully processed.";
            $stmt_not = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmt_not->execute([$withdrawal['user_id'], $not_title, $not_msg]);

            return true;
        }

        return "Failed to approve withdrawal.";
    }

    public function reject_withdrawal($withdrawal_id) {
        $stmt = $this->db->prepare("SELECT * FROM withdrawals WHERE id = ?");
        $stmt->execute([$withdrawal_id]);
        $withdrawal = $stmt->fetch();

        if (!$withdrawal) {
            return "Withdrawal record not found.";
        }

        if ($withdrawal['status'] !== 'pending') {
            return "Withdrawal is already processed.";
        }

        try {
            $this->db->beginTransaction();

            // Set status to rejected
            $stmt_status = $this->db->prepare("UPDATE withdrawals SET status = 'rejected' WHERE id = ?");
            $stmt_status->execute([$withdrawal_id]);

            // Return amount back to user's balance
            $stmt_balance = $this->db->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
            $stmt_balance->execute([$withdrawal['amount'], $withdrawal['user_id']]);

            // Log Transaction (refund)
            $desc = "Refund: Withdrawal rejected (PKR " . number_format($withdrawal['amount']) . ")";
            $stmt_tx = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'bonus', ?, ?)");
            $stmt_tx->execute([$withdrawal['user_id'], $withdrawal['amount'], $desc]);

            // Send notification
            $not_title = "Withdrawal Rejected";
            $not_msg = "Your withdrawal request for PKR " . number_format($withdrawal['amount']) . " has been rejected. The funds have been refunded to your balance.";
            $stmt_not = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmt_not->execute([$withdrawal['user_id'], $not_title, $not_msg]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return "Failed to reject withdrawal: " . $e->getMessage();
        }
    }

    public function get_total_withdrawals_sum() {
        $stmt = $this->db->prepare("SELECT SUM(amount) as total FROM withdrawals WHERE status = 'approved'");
        $stmt->execute();
        $row = $stmt->fetch();
        return $row['total'] ?? 0;
    }
}
?>
