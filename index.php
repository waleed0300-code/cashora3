<?php
/**
 * Cashora - Main Homepage
 * PHP 8 / InfinityFree compatible
 */
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/classes/Package.php';
require_once __DIR__ . '/classes/Contact.php';

$packageObj = new Package($pdo);
$packages = $packageObj->get_active_packages();

$contactObj = new Contact($pdo);
$contactMessage = '';
$contactError = '';

// Handle Contact form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_contact'])) {
    if (check_csrf($_POST['csrf_token'] ?? '')) {
        $name = sanitize($_POST['name'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $subject = sanitize($_POST['subject'] ?? '');
        $msg = sanitize($_POST['message'] ?? '');

        $result = $contactObj->submit_message($name, $email, $subject, $msg);
        if ($result === true) {
            $contactMessage = "Your message has been sent successfully. We will reply to your email shortly.";
        } else {
            $contactError = $result;
        }
    } else {
        $contactError = "CSRF Token Validation Failed.";
    }
}
?>

<!-- Hero Banner -->
<section class="py-5 text-center text-lg-start" style="position: relative; overflow: hidden;">
    <div class="container py-5">
        <div class="row align-items-center g-5">
            <div class="col-lg-6">
                <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill mb-3 fw-semibold">
                    🔥 Platform is Active & Paying
                </span>
                <h1 class="display-3 fw-extrabold text-white mb-4 leading-tight">
                    <?php echo htmlspecialchars($siteSettings['banner_title'] ?? 'Smart Investments, Consistent Earnings'); ?>
                </h1>
                <p class="lead text-secondary mb-5">
                    <?php echo htmlspecialchars($siteSettings['banner_subtitle'] ?? 'Start growing your financial assets with Cashora. Active investment packages give guaranteed high returns with instant PKR withdrawals to Easypaisa and JazzCash.'); ?>
                </p>
                <div class="d-flex flex-column flex-sm-row gap-3">
                    <a href="register.php" class="btn btn-gradient-green btn-lg px-5 py-3 fs-6">
                        <i class="fa-solid fa-rocket me-2"></i>Start Earning Now
                    </a>
                    <a href="#packages" class="btn btn-outline-light btn-lg px-5 py-3 fs-6">
                        <i class="fa-solid fa-circle-info me-2"></i>View Packages
                    </a>
                </div>
                <!-- Mini Stats -->
                <div class="row g-4 mt-5 pt-3 border-top border-secondary border-opacity-25 text-center text-sm-start">
                    <div class="col-4">
                        <h4 class="fw-bold text-white mb-1">5K+</h4>
                        <span class="text-secondary small">Active Users</span>
                    </div>
                    <div class="col-4">
                        <h4 class="fw-bold text-success mb-1">PKR 4M+</h4>
                        <span class="text-secondary small">Total Earnings</span>
                    </div>
                    <div class="col-4">
                        <h4 class="fw-bold text-blue mb-1">99.9%</h4>
                        <span class="text-secondary small">Payout Success</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 text-center">
                <div class="position-relative d-inline-block">
                    <!-- Glassmorphism Preview Card -->
                    <div class="glass-card p-4 p-md-5 text-start" style="max-width: 500px; border-radius: 24px;">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <span class="text-secondary small d-block">Total Balance</span>
                                <h2 class="fw-extrabold text-white mb-0">PKR 15,250.00</h2>
                            </div>
                            <span class="badge bg-success bg-opacity-25 text-success border border-success px-3 py-2 rounded">
                                <i class="fa-solid fa-arrow-trend-up me-1"></i> +25%
                            </span>
                        </div>
                        
                        <div class="mb-4">
                            <span class="text-secondary small d-block mb-2">Active Income Generator</span>
                            <div class="progress" style="height: 8px; background: rgba(255,255,255,0.05);">
                                <div class="progress-bar bg-success" role="progressbar" style="width: 75%; border-radius: 4px;"></div>
                            </div>
                            <div class="d-flex justify-content-between text-secondary small mt-2">
                                <span>Starter Yield Plan</span>
                                <span class="text-white">PKR 500 Daily</span>
                            </div>
                        </div>

                        <div class="d-flex gap-3 justify-content-between">
                            <div class="p-3 bg-white bg-opacity-5 rounded-3 flex-fill text-center">
                                <i class="fa-solid fa-wallet text-success fs-4 mb-2"></i>
                                <span class="text-secondary d-block small">Deposit</span>
                                <strong class="text-white text-xs">PKR 5,000</strong>
                            </div>
                            <div class="p-3 bg-white bg-opacity-5 rounded-3 flex-fill text-center">
                                <i class="fa-solid fa-money-bill-transfer text-blue fs-4 mb-2"></i>
                                <span class="text-secondary d-block small">Withdrawn</span>
                                <strong class="text-white text-xs">PKR 2,400</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-5" style="background: rgba(15, 23, 42, 0.4);">
    <div class="container py-5">
        <div class="text-center mb-5">
            <span class="text-gradient-green-blue fw-bold text-uppercase tracking-wider">Why Cashora</span>
            <h2 class="display-5 fw-extrabold text-white mt-2">Engineered For High Returns</h2>
            <p class="text-secondary col-lg-6 mx-auto mt-3">We provide the safest, easiest, and most responsive high-earning investment engine in Pakistan.</p>
        </div>
        <div class="row g-4">
            <div class="col-md-4">
                <div class="glass-card p-4 h-100">
                    <div class="p-3 bg-success bg-opacity-10 text-success rounded-3 d-inline-block mb-4">
                        <i class="fa-solid fa-gift fs-3"></i>
                    </div>
                    <h4 class="text-white fw-bold mb-3">PKR 150 Signup Bonus</h4>
                    <p class="text-secondary mb-0">Register on our platform and instantly get PKR 150 added to your account wallet. No hidden conditions.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="glass-card p-4 h-100">
                    <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3 d-inline-block mb-4">
                        <i class="fa-solid fa-bolt fs-3"></i>
                    </div>
                    <h4 class="text-white fw-bold mb-3">Instant Mobile Payouts</h4>
                    <p class="text-secondary mb-0">Withdraw your earnings directly to Easypaisa and JazzCash. Withdrawals are processed within 24 hours.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="glass-card p-4 h-100">
                    <div class="p-3 bg-warning bg-opacity-10 text-warning rounded-3 d-inline-block mb-4">
                        <i class="fa-solid fa-shield-halved fs-3"></i>
                    </div>
                    <h4 class="text-white fw-bold mb-3">Secure Investments</h4>
                    <p class="text-secondary mb-0">Our platform utilizes secure SSL, PDO prepared queries, and strict CSRF validations to protect your data and earnings.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Investment Packages -->
<section id="packages" class="py-5">
    <div class="container py-5">
        <div class="text-center mb-5">
            <span class="text-gradient-green-blue fw-bold text-uppercase tracking-wider">Investment Plans</span>
            <h2 class="display-5 fw-extrabold text-white mt-2">Choose Your Earning Power</h2>
            <p class="text-secondary col-lg-6 mx-auto mt-3">Select a plan to activate your passive profit generator. Higher plans yield bigger profits.</p>
        </div>
        <div class="row g-4 justify-content-center">
            <?php if (empty($packages)): ?>
                <p class="text-center text-secondary">No investment packages currently enabled.</p>
            <?php else: ?>
                <?php foreach ($packages as $pkg): ?>
                    <div class="col-md-6 col-lg-4">
                        <div class="glass-card p-4 text-center position-relative h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h4 class="text-white fw-bold mb-3"><?php echo htmlspecialchars($pkg['title']); ?></h4>
                                <div class="py-4 border-top border-bottom border-secondary border-opacity-10 my-4">
                                    <span class="text-secondary d-block small">Deposit Amount</span>
                                    <h2 class="display-6 fw-extrabold text-success mb-0">PKR <?php echo number_format($pkg['deposit_amount']); ?></h2>
                                </div>
                                <ul class="list-unstyled d-flex flex-column gap-3 text-secondary text-start mb-4">
                                    <li class="d-flex justify-content-between">
                                        <span><i class="fa-solid fa-circle-check text-success me-2"></i>Daily Profit:</span>
                                        <strong class="text-white">PKR <?php echo number_format($pkg['profit_amount']); ?></strong>
                                    </li>
                                    <li class="d-flex justify-content-between">
                                        <span><i class="fa-solid fa-circle-check text-success me-2"></i>Validity:</span>
                                        <strong class="text-white">Lifetime Yield</strong>
                                    </li>
                                    <li class="d-flex justify-content-between">
                                        <span><i class="fa-solid fa-circle-check text-success me-2"></i>Payout:</span>
                                        <strong class="text-white">Within 24 Hours</strong>
                                    </li>
                                </ul>
                            </div>
                            <a href="dashboard.php" class="btn btn-gradient-green w-full py-3">
                                Activate Plan
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- How It Works -->
<section class="py-5" style="background: rgba(15, 23, 42, 0.4);">
    <div class="container py-5">
        <div class="text-center mb-5">
            <span class="text-gradient-green-blue fw-bold text-uppercase tracking-wider">Step-by-Step</span>
            <h2 class="display-5 fw-extrabold text-white mt-2">How Cashora Works</h2>
            <p class="text-secondary col-lg-6 mx-auto mt-3">Start your passive income in less than 5 minutes.</p>
        </div>
        <div class="row g-4 text-center">
            <div class="col-md-4">
                <div class="p-4">
                    <div class="fs-1 fw-extrabold text-success opacity-20 mb-3">01</div>
                    <h5 class="text-white fw-bold mb-3">Create Free Account</h5>
                    <p class="text-secondary">Sign up in seconds and immediately get your PKR 150 registration welcome bonus credited.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-4">
                    <div class="fs-1 fw-extrabold text-success opacity-20 mb-3">02</div>
                    <h5 class="text-white fw-bold mb-3">Deposit & Submit Slip</h5>
                    <p class="text-secondary">Send deposit to our Easypaisa or JazzCash accounts, upload screenshot, and get instant balance approval.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-4">
                    <div class="fs-1 fw-extrabold text-success opacity-20 mb-3">03</div>
                    <h5 class="text-white fw-bold mb-3">Activate Plan & Cashout</h5>
                    <p class="text-secondary">Click activate on any package. Earn profit daily and cash out instantly to your phone wallet!</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQs Section -->
<section id="faq" class="py-5">
    <div class="container py-5">
        <div class="text-center mb-5">
            <span class="text-gradient-green-blue fw-bold text-uppercase tracking-wider">Support</span>
            <h2 class="display-5 fw-extrabold text-white mt-2">Frequently Asked Questions</h2>
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="accordion accordion-flush" id="faqAccordion">
                    <div class="accordion-item bg-transparent mb-3 border-0">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed glass-card text-white py-4 px-4" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" style="border-radius: 12px;">
                                What is Cashora?
                            </button>
                        </h2>
                        <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body text-secondary p-4">
                                Cashora is an online earning and investment platform allowing users to generate passive income from small packages. Profits are credited daily and withdrawals are fast.
                            </div>
                        </div>
                    </div>
                    
                    <div class="accordion-item bg-transparent mb-3 border-0">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed glass-card text-white py-4 px-4" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" style="border-radius: 12px;">
                                What is the minimum deposit and withdrawal?
                            </button>
                        </h2>
                        <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body text-secondary p-4">
                                The minimum investment package is PKR 300, which pays PKR 50 profit. Withdrawals can be requested for any amount above PKR 100 directly to Easypaisa or JazzCash.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item bg-transparent mb-3 border-0">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed glass-card text-white py-4 px-4" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" style="border-radius: 12px;">
                                How long do deposits and withdrawals take?
                            </button>
                        </h2>
                        <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body text-secondary p-4">
                                Once you submit your screenshot or transaction ID, deposits are approved within 1 to 12 hours. Withdrawals are processed safely within 24 hours.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Contact Us Form -->
<section id="contact" class="py-5" style="background: rgba(15, 23, 42, 0.4);">
    <div class="container py-5">
        <div class="row align-items-center g-5">
            <div class="col-lg-5">
                <span class="text-gradient-green-blue fw-bold text-uppercase tracking-wider">Get in Touch</span>
                <h2 class="display-5 fw-extrabold text-white mt-2 mb-4">Contact Support</h2>
                <p class="text-secondary mb-4">Do you have questions about custom plans, deposits, or withdrawals? Reach out to our dedicated support team, and we will get back to you inside 12 hours.</p>
                <div class="d-flex flex-column gap-3 text-secondary">
                    <div class="d-flex align-items-center gap-3">
                        <span class="fs-4 text-success"><i class="fa-solid fa-envelope"></i></span>
                        <span>support@cashora.com</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <span class="fs-4 text-primary"><i class="fa-solid fa-phone"></i></span>
                        <span>+92 300 1234567</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-7">
                <div class="glass-card p-4 p-md-5">
                    <?php if (!empty($contactMessage)): ?>
                        <div class="alert alert-success bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-4">
                            <?php echo htmlspecialchars($contactMessage); ?>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($contactError)): ?>
                        <div class="alert alert-danger bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 mb-4">
                            <?php echo htmlspecialchars($contactError); ?>
                        </div>
                    <?php endif; ?>
                    <form action="index.php#contact" method="POST">
                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="text-white small mb-2">Your Name</label>
                                <input type="text" name="name" class="form-control bg-dark border-secondary text-white py-3 px-3" placeholder="Enter full name" required style="border-radius: 8px;">
                            </div>
                            <div class="col-md-6">
                                <label class="text-white small mb-2">Your Email</label>
                                <input type="email" name="email" class="form-control bg-dark border-secondary text-white py-3 px-3" placeholder="Enter email" required style="border-radius: 8px;">
                            </div>
                            <div class="col-12">
                                <label class="text-white small mb-2">Subject</label>
                                <input type="text" name="subject" class="form-control bg-dark border-secondary text-white py-3 px-3" placeholder="Inquiry topic" required style="border-radius: 8px;">
                            </div>
                            <div class="col-12">
                                <label class="text-white small mb-2">Message</label>
                                <textarea name="message" rows="4" class="form-control bg-dark border-secondary text-white py-3 px-3" placeholder="Type your inquiry here..." required style="border-radius: 8px;"></textarea>
                            </div>
                            <div class="col-12 mt-4">
                                <button type="submit" name="submit_contact" class="btn btn-gradient-green w-100 py-3">
                                    <i class="fa-solid fa-paper-plane me-2"></i>Send Message
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
