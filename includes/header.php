<?php
/**
 * Cashora - Common Header with Glassmorphism theme
 */
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../classes/Settings.php';

$settingsObj = new Settings($pdo);
$siteSettings = $settingsObj->get_settings();
$siteName = $siteSettings['website_name'] ?? 'Cashora';

$isLoggedIn = isset($_SESSION['user_id']);
$userRole = $_SESSION['user_role'] ?? 'user';
$userName = $_SESSION['user_name'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($siteName); ?> - Premium Earning & Investment Platform</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts (Inter) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Custom CSS with Glassmorphism styling -->
    <style>
        :root {
            --primary-green: #10B981;
            --primary-blue: #2563EB;
            --bg-dark: #0F172A;
            --glass-bg: rgba(255, 255, 255, 0.08);
            --glass-border: rgba(255, 255, 255, 0.12);
            --glass-shadow: rgba(0, 0, 0, 0.2);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.1) 90%), #0F172A;
            color: #F8FAFC;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }

        /* Glassmorphism Classes */
        .glass-card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease-in-out;
        }

        .glass-card:hover {
            border-color: rgba(16, 185, 129, 0.3);
            box-shadow: 0 12px 40px 0 rgba(16, 185, 129, 0.15);
        }

        .glass-nav {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            position: sticky;
            top: 0;
            z-index: 1030;
        }

        .btn-gradient-green {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            border: none;
            color: white;
            font-weight: 600;
            padding: 10px 24px;
            border-radius: 8px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-gradient-green:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            color: white;
        }

        .btn-gradient-blue {
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            border: none;
            color: white;
            font-weight: 600;
            padding: 10px 24px;
            border-radius: 8px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-gradient-blue:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
            color: white;
        }

        .text-gradient-green-blue {
            background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .navbar-brand {
            font-weight: 800;
            font-size: 1.5rem;
            letter-spacing: -0.5px;
        }

        .nav-link {
            color: #94A3B8 !important;
            font-weight: 500;
            transition: color 0.2s;
        }

        .nav-link:hover, .nav-link.active {
            color: #F8FAFC !important;
        }

        /* Responsive spacing */
        main {
            flex: 1;
        }
    </style>
</head>
<body>

<!-- Navigation Bar -->
<nav class="navbar navbar-expand-lg navbar-dark glass-nav py-3">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.php">
            <i class="fa-solid fa-wallet text-gradient-green-blue me-2"></i>
            <span class="text-white"><?php echo htmlspecialchars($siteName); ?></span>
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-center gap-2 mt-3 mt-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="index.php">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.php#packages">Packages</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.php#about">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.php#faq">FAQ</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.php#contact">Contact</a>
                </li>
                
                <?php if ($isLoggedIn): ?>
                    <li class="nav-item ms-lg-3">
                        <a href="<?php echo $userRole === 'admin' ? 'admin.php' : 'dashboard.php'; ?>" class="btn btn-gradient-blue">
                            <i class="fa-solid fa-chart-line me-2"></i>Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="login.php?logout=1" class="btn btn-outline-danger border-0">
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </a>
                    </li>
                <?php else: ?>
                    <li class="nav-item ms-lg-3">
                        <a href="login.php" class="btn btn-outline-light px-4 py-2" style="border-radius: 8px;">Login</a>
                    </li>
                    <li class="nav-item">
                        <a href="register.php" class="btn btn-gradient-green">Register</a>
                    </li>
                <?php endif; ?>
            </ul>
        </div>
    </div>
</nav>

<main>
