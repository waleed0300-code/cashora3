<?php
/**
 * Cashora - Database Connection Configuration
 * InfinityFree Hosting compatible
 */

define('DB_HOST', 'sql306.infinityfree.com'); // Put your InfinityFree DB host here (e.g., sqlXXX.epizy.com or sqlXXX.infinityfree.com)
define('DB_USER', 'if0_3654321_cashora');      // Put your InfinityFree DB username here
define('DB_PASS', 'your_mysql_password');      // Put your InfinityFree DB password here
define('DB_NAME', 'if0_3654321_cashora_db');   // Put your InfinityFree DB name here

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    // If on local development or not configured yet, attempt fallback to localhost
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=cashora;charset=utf8mb4", "root", "", [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $ex) {
        die("Database Connection Failed: " . $ex->getMessage() . " (Please configure /config/db.php with your database credentials)");
    }
}

// Start PHP session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Simple Helper function to clean inputs (XSS Protection)
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// CSRF Token Generation & Validation
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function check_csrf($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
?>
