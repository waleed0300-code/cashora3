<?php
/**
 * Settings class - Handles website config, payment details, branding and visuals
 */

class Settings {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function get_settings() {
        $stmt = $this->db->prepare("SELECT * FROM settings WHERE id = 1");
        $stmt->execute();
        $settings = $stmt->fetch();

        if (!$settings) {
            // Seed settings if they somehow don't exist
            $this->db->execute("INSERT INTO settings (id, easypaisa_number, jazzcash_number, bank_account, account_title, website_name) VALUES (1, '0300-1234567', '0315-9876543', 'PK99UNIL00000123456789', 'Cashora Private Ltd', 'Cashora')");
            $stmt->execute();
            $settings = $stmt->fetch();
        }

        return $settings;
    }

    public function update_payment_settings($easypaisa, $jazzcash, $bank_account, $account_title) {
        $stmt = $this->db->prepare("UPDATE settings SET easypaisa_number = ?, jazzcash_number = ?, bank_account = ?, account_title = ? WHERE id = 1");
        return $stmt->execute([$easypaisa, $jazzcash, $bank_account, $account_title]);
    }

    public function update_website_settings($website_name, $banner_title, $banner_subtitle, $footer_text, $logo_path = null) {
        if ($logo_path) {
            $stmt = $this->db->prepare("UPDATE settings SET website_name = ?, banner_title = ?, banner_subtitle = ?, footer_text = ?, logo = ? WHERE id = 1");
            return $stmt->execute([$website_name, $banner_title, $banner_subtitle, $footer_text, $logo_path]);
        } else {
            $stmt = $this->db->prepare("UPDATE settings SET website_name = ?, banner_title = ?, banner_subtitle = ?, footer_text = ? WHERE id = 1");
            return $stmt->execute([$website_name, $banner_title, $banner_subtitle, $footer_text]);
        }
    }
}
?>
