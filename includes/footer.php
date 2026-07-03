<?php
/**
 * Cashora - Common Footer with Glassmorphism theme
 */
require_once __DIR__ . '/../classes/Settings.php';

$settingsObj = new Settings($pdo);
$siteSettings = $settingsObj->get_settings();
$siteName = $siteSettings['website_name'] ?? 'Cashora';
$footerText = $siteSettings['footer_text'] ?? '© 2026 Cashora. All Rights Reserved.';
?>
</main>

<footer class="mt-auto py-5" style="background: #090D1A; border-top: 1px solid rgba(255, 255, 255, 0.05);">
    <div class="container">
        <div class="row g-4 justify-content-between">
            <div class="col-lg-4">
                <a class="navbar-brand d-flex align-items-center mb-3" href="index.php">
                    <i class="fa-solid fa-wallet text-gradient-green-blue me-2"></i>
                    <span class="text-white"><?php echo htmlspecialchars($siteName); ?></span>
                </a>
                <p class="text-secondary small">
                    Cashora is a modern and premium high-yield investment platform. Start growing your passive earnings today. Fully compliant, with fast payments to mobile wallets.
                </p>
                <div class="d-flex gap-3 mt-4">
                    <a href="#" class="text-secondary hover:text-white fs-5"><i class="fa-brands fa-facebook"></i></a>
                    <a href="#" class="text-secondary hover:text-white fs-5"><i class="fa-brands fa-twitter"></i></a>
                    <a href="#" class="text-secondary hover:text-white fs-5"><i class="fa-brands fa-telegram"></i></a>
                    <a href="#" class="text-secondary hover:text-white fs-5"><i class="fa-brands fa-whatsapp"></i></a>
                </div>
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <h6 class="text-white mb-3 fw-bold">Platform</h6>
                <ul class="list-unstyled d-flex flex-column gap-2 small">
                    <li><a href="index.php" class="text-secondary text-decoration-none hover:text-white">Home</a></li>
                    <li><a href="index.php#packages" class="text-secondary text-decoration-none hover:text-white">Investment Plans</a></li>
                    <li><a href="index.php#about" class="text-secondary text-decoration-none hover:text-white">About Us</a></li>
                    <li><a href="index.php#faq" class="text-secondary text-decoration-none hover:text-white">FAQ</a></li>
                </ul>
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <h6 class="text-white mb-3 fw-bold">Legal</h6>
                <ul class="list-unstyled d-flex flex-column gap-2 small">
                    <li><a href="#" class="text-secondary text-decoration-none hover:text-white">Privacy Policy</a></li>
                    <li><a href="#" class="text-secondary text-decoration-none hover:text-white">Terms of Service</a></li>
                    <li><a href="#" class="text-secondary text-decoration-none hover:text-white">Refund Policy</a></li>
                </ul>
            </div>
            <div class="col-md-4 col-lg-3">
                <h6 class="text-white mb-3 fw-bold">Contact</h6>
                <ul class="list-unstyled d-flex flex-column gap-2 small text-secondary">
                    <li><i class="fa-solid fa-envelope me-2"></i>support@cashora.com</li>
                    <li><i class="fa-solid fa-phone me-2"></i>+92 300 1234567</li>
                    <li><i class="fa-solid fa-location-dot me-2"></i>Karachi, Pakistan</li>
                </ul>
            </div>
        </div>
        <hr class="my-4 border-secondary opacity-25">
        <div class="row align-items-center justify-content-between small text-secondary">
            <div class="col-md-6 text-center text-md-start">
                <?php echo htmlspecialchars($footerText); ?>
            </div>
            <div class="col-md-6 text-center text-md-end mt-2 mt-md-0">
                <span>Designed with <i class="fa-solid fa-heart text-danger"></i> for InfinityFree</span>
            </div>
        </div>
    </div>
</footer>

<!-- Bootstrap 5 Bundle JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- Custom scripting / AJAX helpers if any -->
</body>
</html>
