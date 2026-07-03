<?php
/**
 * Notification class - Manages user in-app notifications
 */

class Notification {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function create_notification($user_id, $title, $message) {
        $stmt = $this->db->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
        return $stmt->execute([$user_id, $title, $message]);
    }

    public function get_user_notifications($user_id) {
        $stmt = $this->db->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll();
    }

    public function get_unread_count($user_id) {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND status = 'unread'");
        $stmt->execute([$user_id]);
        $row = $stmt->fetch();
        return $row['count'] ?? 0;
    }

    public function mark_as_read($user_id, $notification_id) {
        $stmt = $this->db->prepare("UPDATE notifications SET status = 'read' WHERE id = ? AND user_id = ?");
        return $stmt->execute([$notification_id, $user_id]);
    }

    public function mark_all_as_read($user_id) {
        $stmt = $this->db->prepare("UPDATE notifications SET status = 'read' WHERE user_id = ?");
        return $stmt->execute([$user_id]);
    }
}
?>
