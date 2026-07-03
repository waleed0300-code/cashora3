<?php
/**
 * Cashora - Registration Screen
 * PHP 8 / InfinityFree compatible
 */
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/classes/User.php';

$userObj = new User($pdo);
$error = '';
$success = false;

if (isset($_SESSION['user_id'])) {
    if ($_SESSION['user_role'] === 'admin') {
        header('Location: admin.php');
    } else {
        header('Location: dashboard.php');
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (check_csrf($_POST['csrf_token'] ?? '')) {
        $name = sanitize($_POST['name'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $password = sanitize($_POST['password'] ?? '');
        $confirm_password = sanitize($_POST['confirm_password'] ?? '');

        $registerResult = $userObj->register($name, $email, $password, $confirm_password);
        if ($registerResult === true) {
            $success = true;
        } else {
            $error = $registerResult;
        }
    } else {
        $error = "CSRF Token validation failed.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Cashora</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts (Inter) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.08) 90%), #0F172A;
            color: #F8FAFC;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .glass-card {
            background: rgba(30, 41, 59, 0.75);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            width: 100%;
            max-width: 480px;
        }
        .btn-gradient-green {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            border: none;
            color: white;
            font-weight: 600;
            padding: 12px;
            border-radius: 8px;
            transition: all 0.2s;
        }
        .btn-gradient-green:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }
    </style>
</head>
<body>

<div class="container p-3 d-flex justify-content-center">
    <div class="glass-card p-4 p-md-5">
        <div class="text-center mb-4">
            <a href="index.php" class="text-decoration-none d-flex align-items-center justify-content-center mb-2">
                <i class="fa-solid fa-wallet text-success fs-2 me-2"></i>
                <h3 class="fw-extrabold text-white mb-0">Cashora</h3>
            </a>
            <span class="text-secondary">Create your account and claim PKR 150 bonus!</span>
        </div>

        <?php if ($success): ?>
            <div class="alert alert-success bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-4 text-center">
                <i class="fa-solid fa-circle-check fs-2 d-block mb-2"></i>
                <strong>Registration Completed Successfully.</strong><br>
                <span class="small">Your PKR 150 Signup Bonus has been credited.</span>
                <a href="login.php" class="btn btn-success btn-sm w-100 mt-3 py-2">Proceed to Login</a>
            </div>
        <?php else: ?>

            <?php if (!empty($error)): ?>
                <div class="alert alert-danger bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 mb-4 text-center small">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form action="register.php" method="POST">
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                
                <div class="mb-3">
                    <label class="text-white small mb-2">Full Name</label>
                    <input type="text" name="name" class="form-control bg-dark border-secondary text-white py-2 px-3" placeholder="John Doe" required style="border-radius: 8px;" value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>">
                </div>

                <div class="mb-3">
                    <label class="text-white small mb-2">Email Address</label>
                    <input type="email" name="email" class="form-control bg-dark border-secondary text-white py-2 px-3" placeholder="john@example.com" required style="border-radius: 8px;" value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                </div>

                <div class="mb-3">
                    <label class="text-white small mb-2">Password</label>
                    <input type="password" name="password" class="form-control bg-dark border-secondary text-white py-2 px-3" placeholder="At least 6 characters" required style="border-radius: 8px;">
                </div>

                <div class="mb-4">
                    <label class="text-white small mb-2">Confirm Password</label>
                    <input type="password" name="confirm_password" class="form-control bg-dark border-secondary text-white py-2 px-3" placeholder="Confirm password" required style="border-radius: 8px;">
                </div>

                <button type="submit" class="btn btn-gradient-green w-100 py-3 mb-4">
                    Create Free Account
                </button>

                <div class="text-center">
                    <span class="text-secondary small">Already have an account? <a href="login.php" class="text-success text-decoration-none fw-semibold">Sign in</a></span>
                </div>
            </form>
        <?php endif; ?>
    </div>
</div>

</body>
</html>
