<?php
/**
 * Contact class - Manages front-facing contact queries and responses in Admin panel
 */

class Contact {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function submit_message($name, $email, $subject, $message) {
        if (empty($name) || empty($email) || empty($subject) || empty($message)) {
            return "All fields are required.";
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return "Invalid email address.";
        }

        $stmt = $this->db->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
        if ($stmt->execute([$name, $email, $subject, $message])) {
            return true;
        }

        return "Failed to send message. Please try again.";
    }

    public function get_all_messages() {
        $stmt = $this->db->prepare("SELECT * FROM contact_messages ORDER BY created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function reply_to_message($message_id, $reply_text) {
        if (empty($reply_text)) {
            return "Reply text cannot be empty.";
        }

        $stmt = $this->db->prepare("UPDATE contact_messages SET reply = ? WHERE id = ?");
        return $stmt->execute([$reply_text, $message_id]);
    }

    public function delete_message($message_id) {
        $stmt = $this->db->prepare("DELETE FROM contact_messages WHERE id = ?");
        return $stmt->execute([$message_id]);
    }
}
?>
