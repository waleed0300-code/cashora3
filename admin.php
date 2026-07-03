<?php
/**
 * Cashora - Administrator Dashboard
 * PHP 8 / InfinityFree compatible
 */
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/classes/User.php';
require_once __DIR__ . '/classes/Package.php';
require_once __DIR__ . '/classes/Deposit.php';
require_once __DIR__ . '/classes/Withdrawal.php';
require_once __DIR__ . '/classes/Transaction.php';
require_once __DIR__ . '/classes/Settings.php';
require_once __DIR__ . '/classes/Contact.php';

// Auth Guard - Admin Only
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: login.php');
    exit;
}

$adminId = $_SESSION['user_id'];

// Instantiate Models
$userObj = new User($pdo);
$packageObj = new Package($pdo);
$depositObj = new Deposit($pdo);
$withdrawalObj = new Withdrawal($pdo);
$txObj = new Transaction($pdo);
$settingsObj = new Settings($pdo);
$contactObj = new Contact($pdo);

$successMsg = '';
$errorMsg = '';

// Actions Router
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!check_csrf($_POST['csrf_token'] ?? '')) {
        $errorMsg = "CSRF Token mismatch.";
    } else {
        // 1. Approve Deposit
        if (isset($_POST['action_approve_deposit'])) {
            $depId = intval($_POST['deposit_id'] ?? 0);
            $result = $depositObj->approve_deposit($depId);
            if ($result === true) {
                $successMsg = "Deposit request approved successfully. Balance updated.";
            } else {
                $errorMsg = $result;
            }
        }

        // 2. Reject Deposit
        if (isset($_POST['action_reject_deposit'])) {
            $depId = intval($_POST['deposit_id'] ?? 0);
            $result = $depositObj->reject_deposit($depId);
            if ($result === true) {
                $successMsg = "Deposit request rejected.";
            } else {
                $errorMsg = $result;
            }
        }

        // 3. Approve Withdrawal
        if (isset($_POST['action_approve_withdrawal'])) {
            $wthId = intval($_POST['withdrawal_id'] ?? 0);
            $result = $withdrawalObj->approve_withdrawal($wthId);
            if ($result === true) {
                $successMsg = "Withdrawal request processed and approved.";
            } else {
                $errorMsg = $result;
            }
        }

        // 4. Reject Withdrawal
        if (isset($_POST['action_reject_withdrawal'])) {
            $wthId = intval($_POST['withdrawal_id'] ?? 0);
            $result = $withdrawalObj->reject_withdrawal($wthId);
            if ($result === true) {
                $successMsg = "Withdrawal request rejected. Funds returned to user balance.";
            } else {
                $errorMsg = $result;
            }
        }

        // 5. Update Payment Settings
        if (isset($_POST['action_payment_settings'])) {
            $easypaisa = sanitize($_POST['easypaisa_number'] ?? '');
            $jazzcash = sanitize($_POST['jazzcash_number'] ?? '');
            $bank = sanitize($_POST['bank_account'] ?? '');
            $title = sanitize($_POST['account_title'] ?? '');

            if ($settingsObj->update_payment_settings($easypaisa, $jazzcash, $bank, $title)) {
                $successMsg = "Gateway details and payout coordinates updated successfully.";
            } else {
                $errorMsg = "Failed to save gateway changes.";
            }
        }

        // 6. Update Website Branding Settings
        if (isset($_POST['action_website_settings'])) {
            $site_name = sanitize($_POST['website_name'] ?? '');
            $banner_title = sanitize($_POST['banner_title'] ?? '');
            $banner_sub = sanitize($_POST['banner_subtitle'] ?? '');
            $footer = sanitize($_POST['footer_text'] ?? '');

            if ($settingsObj->update_website_settings($site_name, $banner_title, $banner_sub, $footer)) {
                $successMsg = "Branding details saved successfully.";
            } else {
                $errorMsg = "Failed to update website settings.";
            }
        }

        // 7. Add / Deduct Balance
        if (isset($_POST['action_adjust_balance'])) {
            $targetUserId = intval($_POST['target_user_id'] ?? 0);
            $amount = floatval($_POST['adjust_amount'] ?? 0);
            $type = sanitize($_POST['adjust_type'] ?? '');
            $desc = sanitize($_POST['adjust_description'] ?? 'Admin Balance adjustment');

            if ($amount > 0) {
                if ($type === 'add') {
                    if ($userObj->add_balance($targetUserId, $amount, $desc)) {
                        $successMsg = "Balance PKR " . number_format($amount) . " credited successfully.";
                    } else {
                        $errorMsg = "Failed to credit balance.";
                    }
                } else if ($type === 'deduct') {
                    if ($userObj->deduct_balance($targetUserId, $amount, $desc)) {
                        $successMsg = "Balance PKR " . number_format($amount) . " deducted successfully.";
                    } else {
                        $errorMsg = "Failed to deduct balance.";
                    }
                }
            } else {
                $errorMsg = "Please enter a valid non-zero adjustment amount.";
            }
        }

        // 8. Freeze / Unfreeze User
        if (isset($_POST['action_toggle_user_freeze'])) {
            $targetUserId = intval($_POST['target_user_id'] ?? 0);
            $currentStatus = sanitize($_POST['current_status'] ?? 'active');
            $newStatus = ($currentStatus === 'active') ? 'frozen' : 'active';

            if ($userObj->update_status($targetUserId, $newStatus)) {
                $successMsg = "User status changed to " . strtoupper($newStatus) . ".";
            } else {
                $errorMsg = "Failed to modify user status.";
            }
        }

        // 9. Reply to Support Message
        if (isset($_POST['action_reply_message'])) {
            $msgId = intval($_POST['message_id'] ?? 0);
            $replyText = sanitize($_POST['reply_text'] ?? '');

            $result = $contactObj->reply_to_message($msgId, $replyText);
            if ($result === true) {
                $successMsg = "Reply successfully logged in system logs.";
            } else {
                $errorMsg = $result;
            }
        }

        // 10. Create Package
        if (isset($_POST['action_create_package'])) {
            $title = sanitize($_POST['pkg_title'] ?? '');
            $cost = floatval($_POST['pkg_cost'] ?? 0);
            $profit = floatval($_POST['pkg_profit'] ?? 0);

            $result = $packageObj->create_package($title, $cost, $profit);
            if ($result === true) {
                $successMsg = "New package " . htmlspecialchars($title) . " launched successfully.";
            } else {
                $errorMsg = $result;
            }
        }

        // 11. Delete Package
        if (isset($_POST['action_delete_package'])) {
            $id = intval($_POST['package_id'] ?? 0);
            if ($packageObj->delete_package($id)) {
                $successMsg = "Package deleted successfully.";
            } else {
                $errorMsg = "Failed to delete package.";
            }
        }
    }
}

// Fetch lists
$usersList = $userObj->get_all_users();
$packagesList = $packageObj->get_all_packages();
$pendingDeposits = $depositObj->get_pending_deposits();
$pendingWithdrawals = $withdrawalObj->get_pending_withdrawals();
$contactMessages = $contactObj->get_all_messages();
$siteSettings = $settingsObj->get_settings();

// Admin Statistics calculation
$totalUsers = count($usersList);
$activeUsers = 0;
foreach ($usersList as $u) {
    if ($u['status'] === 'active') $activeUsers++;
}
$totalDepositsSum = $depositObj->get_total_deposits_sum();
$totalWithdrawalsSum = $withdrawalObj->get_total_withdrawals_sum();
$activePackagesCount = $packageObj->get_total_active_packages_count();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Cashora</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
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
            background: radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.04) 90%), #0F172A;
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
            background: rgba(15, 23, 42, 0.95);
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
        <!-- Sidebar -->
        <nav class="col-md-3 col-lg-2 sidebar p-4 d-none d-md-block">
            <a href="index.php" class="text-decoration-none d-flex align-items-center mb-5">
                <i class="fa-solid fa-wallet text-success fs-3 me-2"></i>
                <h4 class="fw-bold text-white mb-0">Cashora Admin</h4>
            </a>
            
            <div class="mb-4">
                <span class="text-secondary uppercase small tracking-widest d-block mb-3">ADMIN HUB</span>
                <a href="#overview" class="nav-link-side active" onclick="showSection('overview')">
                    <i class="fa-solid fa-gauge-high me-3"></i>Overview
                </a>
                <a href="#users" class="nav-link-side" onclick="showSection('users')">
                    <i class="fa-solid fa-users me-3"></i>Manage Users
                </a>
                <a href="#deposits" class="nav-link-side" onclick="showSection('deposits')">
                    <i class="fa-solid fa-arrow-down-to-square me-3"></i>Deposits
                    <?php if (count($pendingDeposits) > 0): ?>
                        <span class="badge bg-danger ms-auto rounded-pill"><?php echo count($pendingDeposits); ?></span>
                    <?php endif; ?>
                </a>
                <a href="#withdrawals" class="nav-link-side" onclick="showSection('withdrawals')">
                    <i class="fa-solid fa-arrow-up-from-square me-3"></i>Withdrawals
                    <?php if (count($pendingWithdrawals) > 0): ?>
                        <span class="badge bg-warning ms-auto rounded-pill text-dark"><?php echo count($pendingWithdrawals); ?></span>
                    <?php endif; ?>
                </a>
            </div>

            <div class="mb-4">
                <span class="text-secondary uppercase small tracking-widest d-block mb-3">Branding & configs</span>
                <a href="#package-manager" class="nav-link-side" onclick="showSection('package-manager')">
                    <i class="fa-solid fa-box-open me-3"></i>Packages
                </a>
                <a href="#configs" class="nav-link-side" onclick="showSection('configs')">
                    <i class="fa-solid fa-screwdriver-wrench me-3"></i>Settings
                </a>
                <a href="#messages" class="nav-link-side" onclick="showSection('messages')">
                    <i class="fa-solid fa-envelope me-3"></i>Inbox
                </a>
            </div>

            <div class="mt-5">
                <a href="login.php?logout=1" class="btn btn-outline-danger w-100 py-2" style="border-radius: 8px;">
                    <i class="fa-solid fa-right-from-bracket me-2"></i>Logout
                </a>
            </div>
        </nav>

        <!-- Workspace -->
        <main class="col-12 col-md-9 col-lg-10 ms-sm-auto p-4 p-md-5">
            <!-- Header Row -->
            <header class="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary border-opacity-10">
                <div>
                    <span class="text-secondary small">System Console</span>
                    <h3 class="fw-bold text-white mb-0">Management Center</h3>
                </div>
                
                <div class="d-flex align-items-center gap-3">
                    <a href="dashboard.php" class="btn btn-sm btn-outline-success px-3" style="border-radius: 8px;">
                        <i class="fa-solid fa-user me-2"></i>My User Profile
                    </a>
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

            <!-- OVERVIEW SECTION -->
            <div id="section-overview" class="admin-section">
                <!-- Stat Cards -->
                <div class="row g-4 mb-5">
                    <div class="col-sm-6 col-lg-3">
                        <div class="glass-card p-4">
                            <span class="text-secondary small d-block mb-1">Total Users</span>
                            <h2 class="fw-extrabold text-white"><?php echo $totalUsers; ?> Registered</h2>
                            <span class="text-success small"><i class="fa-solid fa-circle-check"></i> <?php echo $activeUsers; ?> Active</span>
                        </div>
                    </div>
                    
                    <div class="col-sm-6 col-lg-3">
                        <div class="glass-card p-4">
                            <span class="text-secondary small d-block mb-1">Total Approved Deposits</span>
                            <h2 class="fw-extrabold text-success">PKR <?php echo number_format($totalDepositsSum, 2); ?></h2>
                            <span class="text-secondary small"><?php echo count($pendingDeposits); ?> Pending verification</span>
                        </div>
                    </div>

                    <div class="col-sm-6 col-lg-3">
                        <div class="glass-card p-4">
                            <span class="text-secondary small d-block mb-1">Total Approved Payouts</span>
                            <h2 class="fw-extrabold text-primary">PKR <?php echo number_format($totalWithdrawalsSum, 2); ?></h2>
                            <span class="text-secondary small"><?php echo count($pendingWithdrawals); ?> Pending payouts</span>
                        </div>
                    </div>

                    <div class="col-sm-6 col-lg-3">
                        <div class="glass-card p-4">
                            <span class="text-secondary small d-block mb-1">Active Investments</span>
                            <h2 class="fw-extrabold text-white"><?php echo $activePackagesCount; ?> Subscriptions</h2>
                            <span class="text-success small"><i class="fa-solid fa-circle"></i> Yield engine live</span>
                        </div>
                    </div>
                </div>

                <!-- Fast Approval Action Tables -->
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="glass-card p-4 h-100">
                            <div class="d-flex justify-content-between mb-4">
                                <h5 class="fw-bold text-white mb-0">Pending Deposits</h5>
                                <span class="badge bg-danger rounded-pill"><?php echo count($pendingDeposits); ?> Needs Action</span>
                            </div>
                            <?php if (empty($pendingDeposits)): ?>
                                <p class="text-center text-secondary py-5 my-0">No pending deposit requests.</p>
                            <?php else: ?>
                                <div class="table-responsive">
                                    <table class="table table-dark table-borderless align-middle mb-0 small">
                                        <thead>
                                            <tr class="text-secondary small border-bottom border-secondary border-opacity-10">
                                                <th>User</th>
                                                <th>Amount</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($pendingDeposits as $pDep): ?>
                                                <tr>
                                                    <td>
                                                        <strong class="text-white d-block"><?php echo htmlspecialchars($pDep['user_name']); ?></strong>
                                                        <span class="text-secondary small d-block"><?php echo htmlspecialchars($pDep['user_email']); ?></span>
                                                    </td>
                                                    <td class="text-success fw-bold">PKR <?php echo number_format($pDep['amount']); ?></td>
                                                    <td>
                                                        <div class="d-flex gap-2">
                                                            <form action="admin.php#overview" method="POST" class="d-inline">
                                                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                                <input type="hidden" name="deposit_id" value="<?php echo $pDep['id']; ?>">
                                                                <button type="submit" name="action_approve_deposit" class="btn btn-sm btn-success px-2 py-1"><i class="fa-solid fa-check"></i></button>
                                                            </form>
                                                            <form action="admin.php#overview" method="POST" class="d-inline">
                                                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                                <input type="hidden" name="deposit_id" value="<?php echo $pDep['id']; ?>">
                                                                <button type="submit" name="action_reject_deposit" class="btn btn-sm btn-danger px-2 py-1"><i class="fa-solid fa-xmark"></i></button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="glass-card p-4 h-100">
                            <div class="d-flex justify-content-between mb-4">
                                <h5 class="fw-bold text-white mb-0">Pending Payouts</h5>
                                <span class="badge bg-warning text-dark rounded-pill"><?php echo count($pendingWithdrawals); ?> Needs Action</span>
                            </div>
                            <?php if (empty($pendingWithdrawals)): ?>
                                <p class="text-center text-secondary py-5 my-0">No pending withdrawals.</p>
                            <?php else: ?>
                                <div class="table-responsive">
                                    <table class="table table-dark table-borderless align-middle mb-0 small">
                                        <thead>
                                            <tr class="text-secondary small border-bottom border-secondary border-opacity-10">
                                                <th>User</th>
                                                <th>Amount/Gateway</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($pendingWithdrawals as $pWth): ?>
                                                <tr>
                                                    <td>
                                                        <strong class="text-white d-block"><?php echo htmlspecialchars($pWth['user_name']); ?></strong>
                                                        <span class="text-secondary small font-monospace d-block"><?php echo htmlspecialchars($pWth['account_number']); ?></span>
                                                    </td>
                                                    <td>
                                                        <strong class="text-white d-block">PKR <?php echo number_format($pWth['amount']); ?></strong>
                                                        <span class="text-blue small d-block"><?php echo htmlspecialchars($pWth['method']); ?></span>
                                                    </td>
                                                    <td>
                                                        <div class="d-flex gap-2">
                                                            <form action="admin.php#overview" method="POST" class="d-inline">
                                                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                                <input type="hidden" name="withdrawal_id" value="<?php echo $pWth['id']; ?>">
                                                                <button type="submit" name="action_approve_withdrawal" class="btn btn-sm btn-success px-2 py-1"><i class="fa-solid fa-check"></i></button>
                                                            </form>
                                                            <form action="admin.php#overview" method="POST" class="d-inline">
                                                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                                <input type="hidden" name="withdrawal_id" value="<?php echo $pWth['id']; ?>">
                                                                <button type="submit" name="action_reject_withdrawal" class="btn btn-sm btn-danger px-2 py-1"><i class="fa-solid fa-xmark"></i></button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- USERS SECTION -->
            <div id="section-users" class="admin-section d-none">
                <div class="glass-card p-4">
                    <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-users text-success me-2"></i>User Directory</h5>
                    <div class="table-responsive">
                        <table class="table table-dark table-borderless align-middle mb-0 small">
                            <thead>
                                <tr class="text-secondary border-bottom border-secondary border-opacity-10">
                                    <th>User</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Referral Code</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($usersList as $usr): ?>
                                    <tr>
                                        <td>
                                            <strong class="text-white d-block"><?php echo htmlspecialchars($usr['name']); ?></strong>
                                            <span class="text-secondary small d-block"><?php echo htmlspecialchars($usr['email']); ?></span>
                                        </td>
                                        <td class="text-white fw-bold">PKR <?php echo number_format($usr['balance'], 2); ?></td>
                                        <td>
                                            <span class="badge rounded-pill px-3 py-1 <?php echo ($usr['status'] === 'active') ? 'bg-success bg-opacity-15 text-success' : 'bg-danger bg-opacity-15 text-danger'; ?>">
                                                <?php echo strtoupper($usr['status']); ?>
                                            </span>
                                        </td>
                                        <td class="font-monospace text-secondary"><?php echo htmlspecialchars($usr['referral_code']); ?></td>
                                        <td>
                                            <div class="dropdown">
                                                <button class="btn btn-sm btn-outline-light border-0" type="button" data-bs-toggle="dropdown">
                                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                                </button>
                                                <ul class="dropdown-menu dropdown-menu-end glass-card border-0 p-2 text-white" style="width: 250px;">
                                                    <div class="p-2 border-bottom border-secondary border-opacity-10 mb-2">
                                                        <span class="fw-bold small">Wallet / Account Actions</span>
                                                    </div>
                                                    
                                                    <!-- Balance Adjuster Form inside dropdown -->
                                                    <form action="admin.php#users" method="POST" class="p-2">
                                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                        <input type="hidden" name="target_user_id" value="<?php echo $usr['id']; ?>">
                                                        <div class="mb-2">
                                                            <input type="number" name="adjust_amount" class="form-control form-control-sm bg-dark text-white border-secondary" placeholder="Amount (PKR)" required min="1">
                                                        </div>
                                                        <div class="mb-2">
                                                            <select name="adjust_type" class="form-select form-select-sm bg-dark text-white border-secondary">
                                                                <option value="add">Add Funds</option>
                                                                <option value="deduct">Deduct Funds</option>
                                                            </select>
                                                        </div>
                                                        <div class="mb-2">
                                                            <input type="text" name="adjust_description" class="form-control form-control-sm bg-dark text-white border-secondary" placeholder="Reason/Description">
                                                        </div>
                                                        <button type="submit" name="action_adjust_balance" class="btn btn-sm btn-gradient-green w-100 py-1.5 mb-2">Adjust Balance</button>
                                                    </form>
                                                    <hr class="my-1 border-secondary opacity-25">
                                                    <!-- Freeze Account -->
                                                    <form action="admin.php#users" method="POST" class="px-2 pb-2">
                                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                        <input type="hidden" name="target_user_id" value="<?php echo $usr['id']; ?>">
                                                        <input type="hidden" name="current_status" value="<?php echo $usr['status']; ?>">
                                                        <button type="submit" name="action_toggle_user_freeze" class="btn btn-sm <?php echo ($usr['status'] === 'active') ? 'btn-outline-danger' : 'btn-outline-success'; ?> w-100 py-1.5 mt-2">
                                                            <?php echo ($usr['status'] === 'active') ? 'Freeze Account' : 'Unfreeze Account'; ?>
                                                        </button>
                                                    </form>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- DEPOSITS SECTION -->
            <div id="section-deposits" class="admin-section d-none">
                <div class="glass-card p-4">
                    <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-arrow-down-to-square text-success me-2"></i>Deposits Verification</h5>
                    <?php if (empty($pendingDeposits)): ?>
                        <p class="text-center text-secondary py-5 my-0">All deposits are fully verified and approved.</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-dark table-borderless align-middle mb-0">
                                <thead>
                                    <tr class="text-secondary small border-bottom border-secondary border-opacity-10">
                                        <th>User</th>
                                        <th>Amount</th>
                                        <th>Receipt Image</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($pendingDeposits as $pDep): ?>
                                        <tr>
                                            <td>
                                                <strong class="text-white d-block"><?php echo htmlspecialchars($pDep['user_name']); ?></strong>
                                                <span class="text-secondary small d-block"><?php echo htmlspecialchars($pDep['user_email']); ?></span>
                                            </td>
                                            <td class="text-success fw-bold">PKR <?php echo number_format($pDep['amount']); ?></td>
                                            <td>
                                                <a href="<?php echo htmlspecialchars($pDep['screenshot']); ?>" target="_blank" class="btn btn-sm btn-outline-light px-3 py-1.5" style="border-radius: 8px;">
                                                    <i class="fa-solid fa-image me-1"></i>View Slip
                                                </a>
                                            </td>
                                            <td class="text-secondary small"><?php echo date('M d, Y h:i A', strtotime($pDep['created_at'])); ?></td>
                                            <td>
                                                <div class="d-flex gap-2">
                                                    <form action="admin.php#deposits" method="POST" class="d-inline">
                                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                        <input type="hidden" name="deposit_id" value="<?php echo $pDep['id']; ?>">
                                                        <button type="submit" name="action_approve_deposit" class="btn btn-sm btn-success px-3 py-2">Approve</button>
                                                    </form>
                                                    <form action="admin.php#deposits" method="POST" class="d-inline">
                                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                        <input type="hidden" name="deposit_id" value="<?php echo $pDep['id']; ?>">
                                                        <button type="submit" name="action_reject_deposit" class="btn btn-sm btn-danger px-3 py-2">Reject</button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- WITHDRAWALS SECTION -->
            <div id="section-withdrawals" class="admin-section d-none">
                <div class="glass-card p-4">
                    <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-arrow-up-from-square text-primary me-2"></i>Withdrawals Processing</h5>
                    <?php if (empty($pendingWithdrawals)): ?>
                        <p class="text-center text-secondary py-5 my-0">All pending payouts are processed.</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-dark table-borderless align-middle mb-0">
                                <thead>
                                    <tr class="text-secondary small border-bottom border-secondary border-opacity-10">
                                        <th>User</th>
                                        <th>Amount</th>
                                        <th>Payout Gateway</th>
                                        <th>Account coordinate</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($pendingWithdrawals as $pWth): ?>
                                        <tr>
                                            <td>
                                                <strong class="text-white d-block"><?php echo htmlspecialchars($pWth['user_name']); ?></strong>
                                                <span class="text-secondary small d-block"><?php echo htmlspecialchars($pWth['user_email']); ?></span>
                                            </td>
                                            <td class="text-white fw-bold">PKR <?php echo number_format($pWth['amount']); ?></td>
                                            <td><span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20"><?php echo htmlspecialchars($pWth['method']); ?></span></td>
                                            <td class="font-monospace text-secondary small"><?php echo htmlspecialchars($pWth['account_number']); ?></td>
                                            <td>
                                                <div class="d-flex gap-2">
                                                    <form action="admin.php#withdrawals" method="POST" class="d-inline">
                                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                        <input type="hidden" name="withdrawal_id" value="<?php echo $pWth['id']; ?>">
                                                        <button type="submit" name="action_approve_withdrawal" class="btn btn-sm btn-success px-3 py-2">Approve payout</button>
                                                    </form>
                                                    <form action="admin.php#withdrawals" method="POST" class="d-inline">
                                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                        <input type="hidden" name="withdrawal_id" value="<?php echo $pWth['id']; ?>">
                                                        <button type="submit" name="action_reject_withdrawal" class="btn btn-sm btn-danger px-3 py-2">Reject payout</button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- PACKAGES MANAGER -->
            <div id="section-package-manager" class="admin-section d-none">
                <div class="row g-4">
                    <div class="col-lg-5">
                        <div class="glass-card p-4">
                            <h5 class="fw-bold text-white mb-4">Launch New Package</h5>
                            <form action="admin.php#package-manager" method="POST">
                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                
                                <div class="mb-3">
                                    <label class="text-white small mb-2">Package Title</label>
                                    <input type="text" name="pkg_title" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required placeholder="e.g. Diamond Plan" style="border-radius: 8px;">
                                </div>

                                <div class="mb-3">
                                    <label class="text-white small mb-2">Deposit Required (PKR)</label>
                                    <input type="number" name="pkg_cost" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required min="1" placeholder="3000" style="border-radius: 8px;">
                                </div>

                                <div class="mb-4">
                                    <label class="text-white small mb-2">Daily Profit (PKR)</label>
                                    <input type="number" name="pkg_profit" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required min="1" placeholder="800" style="border-radius: 8px;">
                                </div>

                                <button type="submit" name="action_create_package" class="btn btn-gradient-green w-100 py-3">Launch Yield Plan</button>
                            </form>
                        </div>
                    </div>

                    <div class="col-lg-7">
                        <div class="glass-card p-4">
                            <h5 class="fw-bold text-white mb-4">Active Packages Database</h5>
                            <div class="table-responsive">
                                <table class="table table-dark table-borderless align-middle mb-0 small">
                                    <thead>
                                        <tr class="text-secondary border-bottom border-secondary border-opacity-10">
                                            <th>Title</th>
                                            <th>Investment</th>
                                            <th>Daily Earning</th>
                                            <th>Status</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($packagesList as $pkg): ?>
                                            <tr>
                                                <td class="fw-bold text-white"><?php echo htmlspecialchars($pkg['title']); ?></td>
                                                <td class="text-white">PKR <?php echo number_format($pkg['deposit_amount']); ?></td>
                                                <td class="text-success fw-bold">PKR <?php echo number_format($pkg['profit_amount']); ?></td>
                                                <td><span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">ACTIVE</span></td>
                                                <td>
                                                    <form action="admin.php#package-manager" method="POST">
                                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                        <input type="hidden" name="package_id" value="<?php echo $pkg['id']; ?>">
                                                        <button type="submit" name="action_delete_package" class="btn btn-sm btn-outline-danger border-0"><i class="fa-solid fa-trash-can"></i></button>
                                                    </form>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SETTINGS/CONFIGS SECTION -->
            <div id="section-configs" class="admin-section d-none">
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="glass-card p-4">
                            <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-mobile-screen text-success me-2"></i>Payment Wallet Details</h5>
                            <form action="admin.php#configs" method="POST">
                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                
                                <div class="mb-3">
                                    <label class="text-white small mb-2">Easypaisa Recipient Number</label>
                                    <input type="text" name="easypaisa_number" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($siteSettings['easypaisa_number']); ?>">
                                </div>

                                <div class="mb-3">
                                    <label class="text-white small mb-2">JazzCash Recipient Number</label>
                                    <input type="text" name="jazzcash_number" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($siteSettings['jazzcash_number']); ?>">
                                </div>

                                <div class="mb-3">
                                    <label class="text-white small mb-2">Bank IBAN/Account</label>
                                    <input type="text" name="bank_account" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($siteSettings['bank_account']); ?>">
                                </div>

                                <div class="mb-4">
                                    <label class="text-white small mb-2">Recipient Account Title</label>
                                    <input type="text" name="account_title" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($siteSettings['account_title']); ?>">
                                </div>

                                <button type="submit" name="action_payment_settings" class="btn btn-gradient-green w-100 py-3">Save Gateway details</button>
                            </form>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="glass-card p-4">
                            <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-earth-asia text-blue me-2"></i>Branding & Homepage Config</h5>
                            <form action="admin.php#configs" method="POST">
                                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                
                                <div class="mb-3">
                                    <label class="text-white small mb-2">Platform Name</label>
                                    <input type="text" name="website_name" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($siteSettings['website_name']); ?>">
                                </div>

                                <div class="mb-3">
                                    <label class="text-white small mb-2">Hero Header</label>
                                    <input type="text" name="banner_title" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($siteSettings['banner_title']); ?>">
                                </div>

                                <div class="mb-3">
                                    <label class="text-white small mb-2">Hero Description text</label>
                                    <textarea name="banner_subtitle" rows="3" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;"><?php echo htmlspecialchars($siteSettings['banner_subtitle']); ?></textarea>
                                </div>

                                <div class="mb-4">
                                    <label class="text-white small mb-2">Footer Copyright Notice</label>
                                    <input type="text" name="footer_text" class="form-control bg-dark border-secondary text-white py-2.5 px-3" required style="border-radius: 8px;" value="<?php echo htmlspecialchars($siteSettings['footer_text']); ?>">
                                </div>

                                <button type="submit" name="action_website_settings" class="btn btn-gradient-blue w-100 py-3">Save Branding details</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- INBOX MESSAGES SECTION -->
            <div id="section-messages" class="admin-section d-none">
                <div class="glass-card p-4">
                    <h5 class="fw-bold text-white mb-4"><i class="fa-solid fa-inbox text-success me-2"></i>Customer Support Queries</h5>
                    <?php if (empty($contactMessages)): ?>
                        <p class="text-center text-secondary py-5 my-0">Inbox is empty. No messages received.</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-dark table-borderless align-middle mb-0 small">
                                <thead>
                                    <tr class="text-secondary border-bottom border-secondary border-opacity-10">
                                        <th>Sender</th>
                                        <th>Subject</th>
                                        <th>Message Body</th>
                                        <th>Status / Reply</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($contactMessages as $msg): ?>
                                        <tr>
                                            <td>
                                                <strong class="text-white d-block"><?php echo htmlspecialchars($msg['name']); ?></strong>
                                                <span class="text-secondary small d-block"><?php echo htmlspecialchars($msg['email']); ?></span>
                                            </td>
                                            <td class="text-white fw-bold"><?php echo htmlspecialchars($msg['subject']); ?></td>
                                            <td class="text-secondary" style="max-width: 300px;"><?php echo htmlspecialchars($msg['message']); ?></td>
                                            <td>
                                                <?php if (!empty($msg['reply'])): ?>
                                                    <span class="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill"><i class="fa-solid fa-circle-check"></i> Replied</span>
                                                    <span class="text-secondary small d-block mt-1 font-italic">Reply: "<?php echo htmlspecialchars($msg['reply']); ?>"</span>
                                                <?php else: ?>
                                                    <span class="badge bg-warning text-dark px-3 py-1.5 rounded-pill mb-2"><i class="fa-solid fa-clock"></i> Unread</span>
                                                    <!-- Fast Reply Form -->
                                                    <form action="admin.php#messages" method="POST" class="d-flex gap-2">
                                                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                                                        <input type="hidden" name="message_id" value="<?php echo $msg['id']; ?>">
                                                        <input type="text" name="reply_text" class="form-control form-control-sm bg-dark border-secondary text-white" placeholder="Type quick response" required>
                                                        <button type="submit" name="action_reply_message" class="btn btn-sm btn-gradient-green"><i class="fa-solid fa-paper-plane"></i></button>
                                                    </form>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    function showSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(el => {
            el.classList.add('d-none');
        });
        
        const target = document.getElementById('section-' + sectionId);
        if (target) {
            target.classList.remove('d-none');
        }

        document.querySelectorAll('.nav-link-side').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = Array.from(document.querySelectorAll('.nav-link-side')).find(link => link.getAttribute('href').includes(sectionId));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        }
    });
</script>
</body>
</html>
