<?php
/**
 * Cashora - User Dashboard
 * PHP 8 / InfinityFree compatible
 */
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/classes/User.php';
require_once __DIR__ . '/classes/Package.php';
require_once __DIR__ . '/classes/Deposit.php';
require_once __DIR__ . '/classes/Withdrawal.php';
require_once __DIR__ . '/classes/Transaction.php';
require_once __DIR__ . '/classes/Notification.php';
require_once __DIR__ . '/classes/Settings.php';

// Auth Guard
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'user') {
    header('Location: login.php');
    exit;
}

$userId = $_SESSION['user_id'];

// Instantiate Models
$userObj = new User($pdo);
$packageObj = new Package($pdo);
$depositObj = new Deposit($pdo);
$withdrawalObj = new Withdrawal($pdo);
$txObj = new Transaction($pdo);
$notObj = new Notification($pdo);
$settingsObj = new Settings($pdo);

// Fetch data
$userProfile = $userObj->get_profile($userId);
$siteSettings = $settingsObj->get_settings();
$packages = $packageObj->get_active_packages();
$myPackages = $packageObj->get_user_packages($userId);
$myDeposits = $depositObj->get_user_deposits($userId);
$myWithdrawals = $withdrawalObj->get_user_withdrawals($userId);
$myTransactions = $txObj->get_user_transactions($userId);
$myNotifications = $notObj->get_user_notifications($userId);
$unreadNotifCount = $notObj->get_unread_count($userId);

// Messages/Errors
$successMsg = '';
$errorMsg = '';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!check_csrf($_POST['csrf_token'] ?? '')) {
        $errorMsg = "CSRF Verification failed.";
    } else {
        // Handle Deposit Submission
        if (isset($_POST['action_deposit'])) {
            $amount = floatval($_POST['deposit_amount'] ?? 0);
            $screenshot = $_FILES['screenshot'] ?? null;
            
            $result = $depositObj->submit_deposit($userId, $amount, $screenshot);
            if ($result === true) {
                $successMsg = "Your deposit has been submitted successfully. It will be verified within 24 hours.";
                // Refresh list
                $myDeposits = $depositObj->get_user_deposits($userId);
                $myNotifications = $notObj->get_user_notifications($userId);
                $unreadNotifCount = $notObj->get_unread_count($userId);
            } else {
                $errorMsg = $result;
            }
        }
        
        // Handle Withdrawal Submission
        if (isset($_POST['action_withdrawal'])) {
            $amount = floatval($_POST['withdrawal_amount'] ?? 0);
            $method = sanitize($_POST['withdrawal_method'] ?? '');
            $account_number = sanitize($_POST['account_number'] ?? '');
            
            $result = $withdrawalObj->submit_withdrawal($userId, $amount, $method, $account_number);
            if ($result === true) {
                $successMsg = "Your withdrawal request has been received. It will be processed within 24 hours.";
                // Refresh profile/lists
                $userProfile = $userObj->get_profile($userId);
                $myWithdrawals = $withdrawalObj->get_user_withdrawals($userId);
                $myTransactions = $txObj->get_user_transactions($userId);
                $myNotifications = $notObj->get_user_notifications($userId);
                $unreadNotifCount = $notObj->get_unread_count($userId);
            } else {
                $errorMsg = $result;
            }
        }
        
        // Handle Package Activation
        if (isset($_POST['action_activate_package'])) {
            $packageId = sanitize($_POST['package_id'] ?? '');
            
            $result = $packageObj->activate_package($userId, $packageId);
            if ($result === true) {
                $successMsg = "Package activated successfully! Earning credited.";
                // Refresh profile/lists
                $userProfile = $userObj->get_profile($userId);
                $myPackages = $packageObj->get_user_packages($userId);
                $myTransactions = $txObj->get_user_transactions($userId);
                $myNotifications = $notObj->get_user_notifications($userId);
                $unreadNotifCount = $notObj->get_unread_count($userId);
            } else {
                $errorMsg = $result;
            }
        }

        // Handle Profile Update
        if (isset($_POST['action_update_profile'])) {
            $name = sanitize($_POST['profile_name'] ?? '');
            $email = sanitize($_POST['profile_email'] ?? '');
            
            $result = $userObj->update_profile($userId, $name, $email);
            if ($result === true) {
                $successMsg = "Profile updated successfully.";
                $userProfile = $userObj->get_profile($userId);
            } else {
                $errorMsg = $result;
            }
        }

        // Handle Password Change
        if (isset($_POST['action_change_password'])) {
            $current = sanitize($_POST['current_password'] ?? '');
            $new = sanitize($_POST['new_password'] ?? '');
            
            $result = $userObj->change_password($userId, $current, $new);
            if ($result === true) {
                $successMsg = "Password updated successfully.";
            } else {
                $errorMsg = $result;
            }
        }

        // Handle Mark All Read
        if (isset($_POST['action_mark_read'])) {
            $notObj->mark_all_as_read($userId);
            $myNotifications = $notObj->get_user_notifications($userId);
            $unreadNotifCount = $notObj->get_unread_count($userId);
            $successMsg = "Notifications marked as read.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Cashora</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-green: #10B981;
            --primary-blue: #2563EB;
            --bg-dark: #0F172A;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.05) 90%), #0F172A;
            color: #F8FAFC;
            min-height: 100vh;
        }
        .glass-card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.3s;
        }
        .sidebar {
            background: rgba(15, 23, 42, 0.9);
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            min-height: 100vh;
        }
        .nav-link-side {
            display: flex;
            align-items: center;
            padding: 14px 20px;
            color: #94A3B8;
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 5px;
            font-weight: 500;
            transition: all 0.2s;
        }
        .nav-link-side:hover, .nav-link-side.active {
            background: rgba(16, 185, 129, 0.1);
            color: #10B981;
        }
        .btn-gradient-green {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            border: none;
            color: white;
            font-weight: 600;
            border-radius: 8px;
        }
        .btn-gradient-green:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            color: white;
        }
        .btn-gradient-blue {
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            border: none;
            color: white;
            font-weight: 600;
            border-radius: 8px;
        }
        .btn-gradient-blue:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
            color: white;
        }
        .status-badge-pending {
            background: rgba(234, 179, 8, 0.15);
            color: #EAB308;
            border: 1px solid rgba(234, 179, 8, 0.2);
        }
        .status-badge-approved {
            background: rgba(16, 185, 129, 0.15);
            color: #10B981;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .status-badge-rejected {
            background: rgba(239, 68, 68, 0.15);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
    </style>
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <!-- Sidebar Navigation -->
        <nav class="col-md-3 col-lg-2 sidebar p-4 d-none d-md-block">
            <a href="index.php" class="text-decoration-none d-flex align-items-center mb-5">
                <i class="fa-solid fa-wallet text-success fs-3 me-2"></i>
                <h4 class="fw-bold text-white mb-0">Cashora</h4>
            </a>
            
            <div class="mb-4">
                <span class="text-secondary uppercase small tracking-widest d-block mb-3">Core</span>
                <a href="#dashboard" class="nav-link-side active" onclick="showSection('dashboard')">
                    <i class="fa-solid fa-grip-vertical me-3"></i>Dashboard
                </a>
                <a href="#packages" class="nav-link-side" onclick="showSection('packages')">
                    <i class="fa-solid fa-cubes me-3"></i>Packages
                </a>
                <a href="#deposit" class="nav-link-side" onclick="showSection('deposit')">
                    <i class="fa-solid fa-arrow-up-from-bracket me-3"></i>Deposit
                </a>
                <a href="#withdrawal" class="nav-link-side" onclick="showSection('withdrawal')">
                    <i class="fa-solid fa-money-bill-transfer me-3"></i>Withdrawal
                </a>
            </div>

            <div class="mb-4">
                <span class="text-secondary uppercase small tracking-widest d-block mb-3">Logs & settings</span>
                <a href="#transactions" class="nav-link-side" onclick="showSection('transactions')">
                    <i class="fa-solid fa-receipt me-3"></i>History
                </a>
                <a href="#profile" class="nav-link-side" onclick="showSection('profile')">
                    <i class="fa-solid fa-user-gear me-3"></i>My Profile
                </a>
            </div>

            <div class="mt-5 pt-5">
                <a href="login.php?logout=1" class="btn btn-outline-danger w-100 py-2" style="border-radius: 8px;">
                    <i class="fa-solid fa-right-from-bracket me-2"></i>Logout
                </a>
            </div>
        </nav>

        <!-- Main Workspace -->
        <main class="col-12 col-md-9 col-lg-10 ms-sm-auto p-4 p-md-5">
            <!-- Header Row -->
            <header class="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary border-opacity-10">
                <div>
                    <span class="text-secondary small">Welcome Back</span>
                    <h3 class="fw-bold text-white mb-0"><?php echo htmlspecialchars($userProfile['name']); ?></h3>
                </div>
                
                <div class="d-flex align-items-center gap-4">
                    <!-- Notifications -->
                    <div class="dropdown">
                        <button class="btn btn-outline-light border-0 position-relative p-2" type="button" data-bs-toggle="dropdown" style="border-radius: 50%;">
                            <i class="fa-solid fa-bell fs-5"></i>
                            <?php if ($unreadNotifCount > 0): ?>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem;">
                                    <?php echo $unreadNotifCount; ?>
                                </span>
                            <?php endif; ?>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end glass-card p-2 text-white border-0 mt-3" style="width: 320px; max-height: 400px; overflow-y: auto;">
                            <div class="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary border-opacity-10">
                                <span class="fw-bold small">Notifications</span>
                                <form action="dashboard.php" method="POST">
                                    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                    <button type="submit" name="action_mark_read" class="btn btn-link text-success p-0 text-decoration-none small">Mark all read</button>
                                </form>
                            </div>
                            <?php if (empty($myNotifications)): ?>
                                <li class="p-3 text-center text-secondary small">No notifications yet.</li>
                            <?php else: ?>
                                <?php foreach ($myNotifications as $notif): ?>
                                    <li class="p-2 border-bottom border-secondary border-opacity-5">
                                        <div class="d-flex justify-content-between">
                                            <strong class="small text-white d-block"><?php echo htmlspecialchars($notif['title']); ?></strong>
                                            <span class="text-secondary" style="font-size: 0.75rem;"><?php echo date('h:i A', strtotime($notif['created_at'])); ?></span>
                                        </div>
                                        <p class="mb-0 text-secondary small" style="font-size: 0.8rem;"><?php echo htmlspecialchars($notif['message']); ?></p>
                                    </li>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </ul>
                    </div>

                    <!-- Profile Circle -->
                    <div class="d-flex align-items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" alt="Avatar" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #10B981; object-fit: cover;">
                    </div>
                </div>
            </header>

            <!-- Alerts -->
            <?php if (!empty($successMsg)): ?>
                <div class="alert alert-success bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-4 py-3 rounded-4 text-center">
                    <i class="fa-solid fa-circle-check me-2"></i><?php echo htmlspecialchars($successMsg); ?>
                </div>
            <?php endif; ?>
            <?php if (!empty($errorMsg)): ?>
                <div class="alert alert-danger bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 mb-4 py-3 rounded-4 text-center">
                    <i class="fa-solid fa-circle-exclamation me-2"></i><?php echo htmlspecialchars($errorMsg); ?>
                </div>
            <?php endif; ?>

            <!-- DASHBOARD SECTION -->
            <div id="section-dashboard" class="dashboard-section">
                <!-- Balance & Payout Cards Row -->
                <div class="row g-4 mb-5">
                    <div class="col-md-4">
                        <div class="glass-card p-4">
                            <span class="text-secondary small d-block mb-1">Available Balance</span>
                            <h2 class="fw-extrabold text-white mb-2">PKR <?php echo number_format($userProfile['balance'], 2); ?></h2>
                            <div class="d-flex gap-2">
                                <a href="#deposit" class="btn btn-sm btn-gradient-green px-3 py-1.5" onclick="showSection('deposit')">
                                    <i class="fa-solid fa-plus me-1"></i>Deposit
                                </a>
                                <a href="#withdrawal" class="btn btn-sm btn-gradient-blue px-3 py-1.5" onclick="showSection('withdrawal')">
                                    <i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Withdraw
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="glass-card p-4">
                            <span class="text-secondary small d-block mb-1">Signup Welcome Bonus</span>
                            <h2 class="fw-extrabold text-white mb-2">PKR <?php echo number_format($userProfile['signup_bonus'], 2); ?></h2>
                            <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20">🎁 Credited Successfully</span>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="glass-card p-4">
                            <span class="text-secondary small d-block mb-1">Active Investments</span>
                            <h2 class="fw-extrabold text-white mb-2"><?php echo count($myPackages); ?> Plans</h2>
                            <a href="#packages" class="text-success small text-decoration-none fw-semibold" onclick="showSection('packages')">
                                <i class="fa-solid fa-arrow-right me-1"></i>Activate more packages
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Active Packages Grid / Recent Activity -->
                <div class="row g-4">
                    <div class="col-lg-8">
                        <div class="glass-card p-4 mb-4">
                            <h5 class="fw-bold text-white mb-4">My Running Packages</h5>
                            <?php if (empty($myPackages)): ?>
                                <div class="text-center py-5 text-secondary">
                                    <i class="fa-solid fa-chart-line fs-1 mb-3 opacity-20"></i>
                                    <p class="mb-0">No investment plans are active right now.</p>
                                    <button class="btn btn-sm btn-gradient-green mt-3 px-4 py-2" onclick="showSection('packages')">Browse Plans</button>
                                </div>
                            <?php else: ?>
                                <div class="table-responsive">
                                    <table class="table table-dark table-borderless align-middle mb-0">
                                        <thead>
                                            <tr class="text-secondary small border-bottom border-secondary border-opacity-10">
                                                <th>Plan Title</th>
                                                <th>Invested</th>
                                                <th>Daily Profit</th>
                                                <th>Status</th>
                                                <th>Activated On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($myPackages as $myPkg): ?>
                                                <tr>
                                                    <td class="fw-bold text-white"><?php echo htmlspecialchars($myPkg['title']); ?></td>
                                                    <td class="text-white">PKR <?php echo number_format($myPkg['deposit_amount']); ?></td>
                                                    <td class="text-success">PKR <?php echo number_format($myPkg['profit_amount']); ?></td>
                                                    <td><span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">ACTIVE</span></td>
                                                    <td class="text-secondary small"><?php echo date('M d, Y h:i A', strtotime($myPkg['created_at'])); ?></td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="glass-card p-4">
                            <h5 class="fw-bold text-white mb-4">Quick Referral</h5>
                            <p class="text-secondary small mb-3">Share your custom referral code to invite friends and earn commissions directly credited to your wallet balance.</p>
                            <div class="input-group">
                                <input type="text" class="form-control bg-dark border-secondary text-white font-monospace" value="<?php echo htmlspecialchars($userProfile['referral_code']); ?>" readonly id="refCodeField" style="border-radius: 8px 0 0 8px;">
                                <button class="btn btn-gradient-green" onclick="copyReferralCode()" style="border-radius: 0 8px 8px 0;"><i class="fa-regular fa-copy"></i></button>
                            </div>
                            <span id="copyFeedback" class="text-success small mt-2 d-none">Referral code copied successfully!</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PACKAGES SECTION -->
            <div id="section-packages" class="dashboard-section d-none">
                <div class="text-center mb-5">
                    <h3 class="fw-bold text-white">Investment Packages</h3>
                    <p class="text-secondary">Activate a plan to yield high returns automatically added to your wallet balance.</p>
                </div>
                
                <div class="row g-4 justify-content-center">
                    <?php if (empty($packages)): ?>
                        <p class="text-center text-secondary col-12">No investment packages currently enabled.</p>
                    <?php else: ?>
                        <?php foreach ($packages as $pkg): ?>
                            <div class="col-md-6 col-lg-4">
                                <div class="glass-card p-4 text-center position-relative h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <h4 class="text-white fw-bold mb-3"><?php echo htmlspecialchars($pkg['title']); ?></h4>
                                        <div class="py-4 border-top border-bottom border-secondary border-opacity-10 my-4">
                                            <span class="text-secondary d-block small mb-1">Deposit Required</span>
                                            <h2 class="fw-extrabold text-success mb-0">PKR <?php echo number_format($pkg['deposit_amount']); ?></h2>
                                        </div>
                                        <ul class="list-unstyled d-flex flex-column gap-3 text-secondary text-start mb-4">
                                            <li class="d-flex justify-content-between">
                                                <span>Daily Earning:</span>
                                                <strong class="text-white">PKR <?php echo number_format($pkg['profit_amount']); ?></strong>
                                            </li>
                                            <li class="d-flex justify-content-between">
                                                <span>Validity:</span>
                                                <strong class="text-white">Lifetime Profit</strong>
                                            </li>
                                        </ul>
                                    </div>
                                    <form action="dashboard.php#packages" method="POST">
                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                        <input type="hidden" name="package_id" value="<?php echo $pkg['id']; ?>">
                                        <button type="submit" name="action_activate_package" class="btn btn-gradient-green w-100 py-2.5">
                                            <i class="fa-solid fa-check me-2"></i>Activate Now
                                        </button>
                                    </form>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>

            <!-- DEPOSIT SECTION -->
            <div id="section-deposit" class="dashboard-section d-none">
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="glass-card p-4 mb-4">
                            <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-wallet text-success me-2"></i>Instructions</h5>
                            <p class="text-secondary small mb-4">Please make your manual payment transfer to any of the verified wallets listed below. Note the recipient name must match the official account title.</p>
                            
                            <ul class="list-unstyled d-flex flex-column gap-3 mb-4">
                                <li class="p-3 bg-dark rounded-3">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="text-white fw-bold"><i class="fa-solid fa-mobile-screen text-success me-2"></i>Easypaisa</span>
                                        <span class="badge bg-success-subtle text-success">Active</span>
                                    </div>
                                    <span class="text-secondary small d-block">Number</span>
                                    <strong class="text-white font-monospace"><?php echo htmlspecialchars($siteSettings['easypaisa_number']); ?></strong>
                                </li>
                                <li class="p-3 bg-dark rounded-3">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="text-white fw-bold"><i class="fa-solid fa-mobile-screen text-primary me-2"></i>JazzCash</span>
                                        <span class="badge bg-success-subtle text-success">Active</span>
                                    </div>
                                    <span class="text-secondary small d-block">Number</span>
                                    <strong class="text-white font-monospace"><?php echo htmlspecialchars($siteSettings['jazzcash_number']); ?></strong>
                                </li>
                                <li class="p-3 bg-dark rounded-3">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="text-white fw-bold"><i class="fa-solid fa-building-columns text-info me-2"></i>Bank Transfer</span>
                                        <span class="badge bg-success-subtle text-success">Active</span>
                                    </div>
                                    <span class="text-secondary small d-block">IBAN/Account</span>
                                    <strong class="text-white font-monospace"><?php echo htmlspecialchars($siteSettings['bank_account']); ?></strong>
                                </li>
                            </ul>
                            
                            <div class="p-3 bg-success bg-opacity-10 border border-success border-opacity-15 rounded-3">
                                <strong class="text-white d-block small mb-1">Account Title</strong>
                                <span class="text-success"><?php echo htmlspecialchars($siteSettings['account_title']); ?></span>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="glass-card p-4 mb-4">
                            <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-circle-arrow-up text-success me-2"></i>Submit Request</h5>
                            <form action="dashboard.php#deposit" method="POST" enctype="multipart/form-data">
                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                
                                <div class="mb-3">
                                    <label class="text-white small mb-2">Deposit Amount (PKR)</label>
                                    <input type="number" name="deposit_amount" min="1" class="form-control bg-dark border-secondary text-white py-3 px-3" placeholder="Enter amount" required style="border-radius: 8px;">
                                </div>

                                <div class="mb-4">
                                    <label class="text-white small mb-2">Upload Screenshot (JPEG, JPG, PNG)</label>
                                    <input type="file" name="screenshot" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;">
                                    <span class="text-secondary small d-block mt-2">Upload payment verification slip. Max size 5MB.</span>
                                </div>

                                <button type="submit" name="action_deposit" class="btn btn-gradient-green w-100 py-3">
                                    <i class="fa-solid fa-paper-plane me-2"></i>Submit Screenshot
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- History of Deposits -->
                <div class="glass-card p-4">
                    <h5 class="fw-bold text-white mb-4">My Deposit Logs</h5>
                    <?php if (empty($myDeposits)): ?>
                        <p class="text-center text-secondary py-4 mb-0">No deposits requested yet.</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-dark table-borderless align-middle mb-0">
                                <thead>
                                    <tr class="text-secondary small border-bottom border-secondary border-opacity-10">
                                        <th>Deposit ID</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($myDeposits as $dep): ?>
                                        <tr>
                                            <td class="font-monospace text-secondary">#DEP<?php echo $dep['id']; ?></td>
                                            <td class="text-white fw-bold">PKR <?php echo number_format($dep['amount']); ?></td>
                                            <td>
                                                <span class="badge rounded-pill px-3 py-1 status-badge-<?php echo $dep['status']; ?>">
                                                    <?php echo strtoupper($dep['status']); ?>
                                                </span>
                                            </td>
                                            <td class="text-secondary small"><?php echo date('M d, Y h:i A', strtotime($dep['created_at'])); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- WITHDRAWAL SECTION -->
            <div id="section-withdrawal" class="dashboard-section d-none">
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="glass-card p-4 mb-4">
                            <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-money-bill-wave text-blue me-2"></i>Available Funds</h5>
                            <div class="text-center py-4 mb-3">
                                <span class="text-secondary small d-block">Deductible Wallet Balance</span>
                                <h1 class="display-4 fw-extrabold text-white">PKR <?php echo number_format($userProfile['balance'], 2); ?></h1>
                            </div>
                            <div class="p-3 bg-dark rounded-3">
                                <span class="text-secondary small d-block mb-1">Processing Policy</span>
                                <p class="mb-0 small text-secondary">Withdrawals are securely transferred directly to your given account within 24 hours. Minimal processing margins apply.</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="glass-card p-4 mb-4">
                            <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-wallet text-blue me-2"></i>Withdraw Request</h5>
                            <form action="dashboard.php#withdrawal" method="POST">
                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                
                                <div class="mb-3">
                                    <label class="text-white small mb-2">Withdrawal Amount (PKR)</label>
                                    <input type="number" name="withdrawal_amount" min="100" class="form-control bg-dark border-secondary text-white py-3 px-3" placeholder="Min PKR 100" required style="border-radius: 8px;">
                                </div>

                                <div class="mb-3">
                                    <label class="text-white small mb-2">Payment Method</label>
                                    <select name="withdrawal_method" class="form-select bg-dark border-secondary text-white py-3 px-3" required style="border-radius: 8px;">
                                        <option value="Easypaisa">Easypaisa Mobile Wallet</option>
                                        <option value="JazzCash">JazzCash Mobile Wallet</option>
                                        <option value="Bank Account">Bank Wire Transfer</option>
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <label class="text-white small mb-2">Wallet/Account Number</label>
                                    <input type="text" name="account_number" class="form-control bg-dark border-secondary text-white py-3 px-3" placeholder="e.g., 03001234567" required style="border-radius: 8px;">
                                </div>

                                <button type="submit" name="action_withdrawal" class="btn btn-gradient-blue w-100 py-3">
                                    <i class="fa-solid fa-paper-plane me-2"></i>Submit Payout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- History of Withdrawals -->
                <div class="glass-card p-4">
                    <h5 class="fw-bold text-white mb-4">My Withdrawal Logs</h5>
                    <?php if (empty($myWithdrawals)): ?>
                        <p class="text-center text-secondary py-4 mb-0">No withdrawals requested yet.</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-dark table-borderless align-middle mb-0">
                                <thead>
                                    <tr class="text-secondary small border-bottom border-secondary border-opacity-10">
                                        <th>Payout ID</th>
                                        <th>Amount</th>
                                        <th>Gateway</th>
                                        <th>Account</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($myWithdrawals as $wth): ?>
                                        <tr>
                                            <td class="font-monospace text-secondary">#WTH<?php echo $wth['id']; ?></td>
                                            <td class="text-white fw-bold">PKR <?php echo number_format($wth['amount']); ?></td>
                                            <td><?php echo htmlspecialchars($wth['method']); ?></td>
                                            <td class="font-monospace text-secondary small"><?php echo htmlspecialchars($wth['account_number']); ?></td>
                                            <td>
                                                <span class="badge rounded-pill px-3 py-1 status-badge-<?php echo $wth['status']; ?>">
                                                    <?php echo strtoupper($wth['status']); ?>
                                                </span>
                                            </td>
                                            <td class="text-secondary small"><?php echo date('M d, Y h:i A', strtotime($wth['created_at'])); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- TRANSACTION HISTORY SECTION -->
            <div id="section-transactions" class="dashboard-section d-none">
                <div class="glass-card p-4">
                    <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-list-check text-success me-2"></i>My Comprehensive Statements</h5>
                    <?php if (empty($myTransactions)): ?>
                        <p class="text-center text-secondary py-5">No logs recorded yet.</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-dark table-borderless align-middle mb-0">
                                <thead>
                                    <tr class="text-secondary small border-bottom border-secondary border-opacity-10">
                                        <th>Transaction ID</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Description</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($myTransactions as $tx): ?>
                                        <tr>
                                            <td class="font-monospace text-secondary">#TX<?php echo $tx['id']; ?></td>
                                            <td>
                                                <span class="badge text-uppercase px-2.5 py-1 rounded" style="background: rgba(255,255,255,0.05); color: white;">
                                                    <?php echo $tx['type']; ?>
                                                </span>
                                            </td>
                                            <td class="fw-bold <?php echo in_array($tx['type'], ['deposit', 'bonus', 'earning']) ? 'text-success' : 'text-danger'; ?>">
                                                <?php echo in_array($tx['type'], ['deposit', 'bonus', 'earning']) ? '+' : '-'; ?> PKR <?php echo number_format($tx['amount'], 2); ?>
                                            </td>
                                            <td class="text-secondary small"><?php echo htmlspecialchars($tx['description']); ?></td>
                                            <td class="text-secondary small"><?php echo date('M d, Y h:i A', strtotime($tx['created_at'])); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- MY PROFILE SECTION -->
            <div id="section-profile" class="dashboard-section d-none">
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="glass-card p-4">
                            <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-id-card text-success me-2"></i>General Details</h5>
                            <form action="dashboard.php#profile" method="POST">
                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                
                                <div class="mb-3">
                                    <label class="text-white small mb-2">My Full Name</label>
                                    <input type="text" name="profile_name" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($userProfile['name']); ?>">
                                </div>

                                <div class="mb-4">
                                    <label class="text-white small mb-2">Email Address</label>
                                    <input type="email" name="profile_email" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($userProfile['email']); ?>">
                                </div>

                                <button type="submit" name="action_update_profile" class="btn btn-gradient-green w-100 py-2.5">
                                    Update Details
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="glass-card p-4">
                            <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-key text-blue me-2"></i>Update Password</h5>
                            <form action="dashboard.php#profile" method="POST">
                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                
                                <div class="mb-3">
                                    <label class="text-white small mb-2">Current Password</label>
                                    <input type="password" name="current_password" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;">
                                </div>

                                <div class="mb-4">
                                    <label class="text-white small mb-2">New Password</label>
                                    <input type="password" name="new_password" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;">
                                </div>

                                <button type="submit" name="action_change_password" class="btn btn-gradient-blue w-100 py-2.5">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(el => {
            el.classList.add('d-none');
        });
        
        // Show target section
        const target = document.getElementById('section-' + sectionId);
        if (target) {
            target.classList.remove('d-none');
        }

        // Update active class in side navigation links
        document.querySelectorAll('.nav-link-side').forEach(link => {
            link.classList.remove('active');
        });
        
        // Find links targeting this section ID
        const activeLink = Array.from(document.querySelectorAll('.nav-link-side')).find(link => link.getAttribute('href').includes(sectionId));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Read Hash routing on page load
    window.addEventListener('DOMContentLoaded', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        }
    });

    function copyReferralCode() {
        const copyText = document.getElementById("refCodeField");
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(copyText.value);
        
        const feedback = document.getElementById("copyFeedback");
        feedback.classList.remove('d-none');
        setTimeout(() => {
            feedback.classList.add('d-none');
        }, 3000);
    }
</script>
</body>
</html>
