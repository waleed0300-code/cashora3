<?php
/**
 * Transaction class - Logs all financial actions and histories
 */

class Transaction {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function log_transaction($user_id, $type, $amount, $description) {
        $stmt = $this->db->prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)");
        return $stmt->execute([$user_id, $type, $amount, $description]);
    }

    public function get_user_transactions($user_id, $type = null, $status = null) {
        $query = "SELECT * FROM transactions WHERE user_id = ?";
        $params = [$user_id];

        if ($type) {
            $query .= " AND type = ?";
            $params[] = $type;
        }

        $query .= " ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function get_all_transactions() {
        $stmt = $this->db->prepare("SELECT t.*, u.name as user_name, u.email as user_email 
                                    FROM transactions t 
                                    JOIN users u ON t.user_id = u.id 
                                    ORDER BY t.created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>
