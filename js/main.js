/**
 * ============================================
 * পাহাড়ি হাট - ই-বাজার ওয়েবসাইটের JavaScript
 * ============================================
 */

// ============================================
// 1. কাউন্টডাউন টাইমার (Countdown Timer)
// ============================================
function initCountdownTimers() {
    const timers = document.querySelectorAll('.countdown-timer');
    
    timers.forEach(timer => {
        const deadline = timer.getAttribute('data-deadline');
        if (!deadline) return;
        
        const targetDate = new Date(deadline);
        
        function updateTimer() {
            const now = new Date();
            const diff = targetDate - now;
            
            if (diff <= 0) {
                timer.innerHTML = '<i class="far fa-clock"></i> প্রি-অর্ডার শেষ!';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            const daysSpan = timer.querySelector('.days');
            const hoursSpan = timer.querySelector('.hours');
            
            if (daysSpan) daysSpan.textContent = String(days).padStart(2, '0');
            if (hoursSpan) hoursSpan.textContent = String(hours).padStart(2, '0');
        }
        
        updateTimer();
        setInterval(updateTimer, 3600000);
    });
}

// ============================================
// 2. কার্ট ম্যানেজমেন্ট (Cart Management)
// ============================================
let cart = [];

function addToCart(productId, productName, price, quantity, weight, cutType = null) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity,
            weight: weight,
            cutType: cutType
        });
    }
    
    updateCartUI();
    saveCartToLocalStorage();
    showNotification(`${productName} কার্টে যোগ হয়েছে!`, 'success');
}

function updateCartUI() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background-color: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 2000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// 3. প্রোডাক্ট কার্ডের ইভেন্ট লিসেনার
// ============================================
function initProductCardEvents() {
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productId = productCard.getAttribute('data-id');
            const productName = productCard.querySelector('.product-title')?.textContent;
            const priceText = productCard.querySelector('.current-price')?.textContent;
            const price = parseInt(priceText?.replace('৳', '')) || 0;
            const quantityInput = productCard.querySelector('.quantity-selector input');
            const quantity = parseInt(quantityInput?.value) || 1;
            const weight = productCard.querySelector('.product-price .per-unit')?.textContent || '';
            
            let cutType = null;
            const cutSelect = productCard.querySelector('.cut-select');
            if (cutSelect) {
                cutType = cutSelect.value;
            }
            
            addToCart(productId, productName, price, quantity, weight, cutType);
        });
    });
    
    const minusBtns = document.querySelectorAll('.qty-minus');
    const plusBtns = document.querySelectorAll('.qty-plus');
    
    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        });
    });
    
    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            let value = parseInt(input.value);
            const max = parseInt(input.getAttribute('max')) || 99;
            if (value < max) {
                input.value = value + 1;
            }
        });
    });
}

// ============================================
// 4. FAQ অ্যাকর্ডিয়ন (FAQ Accordion)
// ============================================
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

// ============================================
// 5. রিকুয়েস্ট ফর্ম সাবমিট (Request Form Submit)
// ============================================
function initRequestForm() {
    const form = document.getElementById('productRequestForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productName = document.getElementById('productName')?.value;
            const category = document.getElementById('category')?.value;
            const quantity = document.getElementById('quantity')?.value;
            const deliveryArea = document.getElementById('deliveryArea')?.value;
            const customerMobile = document.getElementById('customerMobile')?.value;
            const comments = document.getElementById('comments')?.value;
            const notRobot = document.getElementById('notRobot')?.checked;
            
            if (!productName || !customerMobile) {
                showNotification('দয়া করে পণ্যের নাম এবং মোবাইল নম্বর দিন!', 'error');
                return;
            }
            
            if (!deliveryArea) {
                showNotification('দয়া করে ডেলিভারি এলাকা নির্বাচন করুন!', 'error');
                return;
            }
            
            if (customerMobile.length !== 11) {
                showNotification('সঠিক মোবাইল নম্বর দিন (০১XXXXXXXXX)', 'error');
                return;
            }
            
            if (!notRobot) {
                showNotification('দয়া করে "আমি রোবট নই" চেকবক্স টিক দিন', 'error');
                return;
            }
            
            console.log('রিকুয়েস্ট ডাটা:', {
                productName, category, quantity, deliveryArea, customerMobile, comments
            });
            
            showNotification('আপনার রিকুয়েস্ট সফলভাবে জমা হয়েছে!', 'success');
            form.reset();
            
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) imagePreview.style.display = 'none';
            
            const productImage = document.getElementById('productImage');
            if (productImage) productImage.value = '';
        });
    }
}

// ============================================
// 6. ছবি আপলোড ও Rename ফাংশন (Image Upload)
// ============================================
function initImageUpload() {
    const uploadBtn = document.getElementById('uploadImageBtn');
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const imageNameInput = document.getElementById('imageName');
    const renameBtn = document.getElementById('renameImageBtn');
    const removeBtn = document.getElementById('removeImageBtn');
    
    let currentFile = null;
    
    if (uploadBtn && imageInput) {
        uploadBtn.addEventListener('click', function() {
            imageInput.click();
        });
        
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showNotification('ছবির সাইজ ২MB এর কম হতে হবে!', 'error');
                    return;
                }
                
                if (!file.type.match('image.*')) {
                    showNotification('শুধু ছবি ফাইল আপলোড করুন!', 'error');
                    return;
                }
                
                currentFile = file;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
                
                let autoName = file.name.replace(/\.[^/.]+$/, "");
                imageNameInput.value = autoName;
                
                imagePreview.style.display = 'block';
            }
        });
        
        if (renameBtn) {
            renameBtn.addEventListener('click', function() {
                const newName = imageNameInput.value.trim();
                if (newName === '') {
                    showNotification('দয়া করে একটি নাম দিন!', 'error');
                } else {
                    showNotification(`ছবির নাম পরিবর্তন করে "${newName}" করা হয়েছে`, 'success');
                }
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                imageInput.value = '';
                currentFile = null;
                imagePreview.style.display = 'none';
                previewImg.src = '#';
                imageNameInput.value = '';
                showNotification('ছবি সরানো হয়েছে', 'info');
            });
        }
    }
}

// ============================================
// 7. ভোটিং সিস্টেম (Voting System)
// ============================================
function initVotingSystem() {
    const voteBtns = document.querySelectorAll('.vote-btn');
    
    voteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const voteSpan = this.parentElement.querySelector('span');
            if (voteSpan) {
                let currentVotes = parseInt(voteSpan.textContent) || 0;
                currentVotes++;
                voteSpan.textContent = currentVotes;
                
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                showNotification('আপনার ভোট দেওয়ার জন্য ধন্যবাদ!', 'success');
            }
        });
    });
}

// ============================================
// 8. স্ক্রোল অ্যানিমেশন (Scroll Animation)
// ============================================
function initScrollAnimation() {
    const elements = document.querySelectorAll('.product-card, .category-card, .step, .district-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}

// ============================================
// 9. ক্যাটাগরি ফিল্টার (Category Filter)
// ============================================
function initCategoryFilter() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                console.log('সিলেক্টেড ক্যাটাগরি:', category);
                showNotification(`${this.querySelector('h3')?.textContent} লোড হচ্ছে...`, 'info');
            }
        });
    });
}

// ============================================
// 10. প্রোডাক্ট সার্চ (Product Search)
// ============================================
function initProductSearch() {
    const searchInputs = document.querySelectorAll('.search-bar input, .mobile-search input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
                const source = card.querySelector('.product-source')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || source.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// 11. স্মুথ স্ক্রোল (Smooth Scroll)
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// 12. প্রি-অর্ডার পণ্যের স্টক চেক (Preorder Stock Check)
// ============================================
function checkPreorderStock() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const stockInfo = card.querySelector('.product-preorder-info');
        if (stockInfo && !stockInfo.querySelector('.stock-info')) {
            const randomStock = Math.floor(Math.random() * 50) + 10;
            const stockHtml = `<div class="stock-info" style="font-size:0.7rem; color:#666; margin-top:5px;">
                <i class="fas fa-box"></i> ${randomStock} কেজি বাকি আছে
            </div>`;
            stockInfo.insertAdjacentHTML('beforeend', stockHtml);
        }
    });
}

// ============================================
// 13. ফরমালিন ফ্রি নীতি মোডাল (Trust Policy Modal)
// ============================================
function initTrustPolicyModal() {
    const modal = document.getElementById('trustPolicyModal');
    const trustLink = document.getElementById('trustPolicyLink');
    const closeBtn = document.querySelector('.trust-modal-close');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    
    if (trustLink && modal) {
        trustLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// ============================================
// 14. পণ্য রিকুয়েস্ট বাটন - স্ক্রল ফাংশন
// ============================================
function initRequestButtonScroll() {
    const requestBtn = document.getElementById('requestProductBtn');
    
    if (requestBtn) {
        requestBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const requestSection = document.getElementById('requestSection');
            
            if (requestSection) {
                requestSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                requestSection.style.transition = 'background-color 0.5s ease';
                requestSection.style.backgroundColor = '#e8f5e9';
                
                setTimeout(() => {
                    requestSection.style.backgroundColor = '';
                }, 1000);
                
                setTimeout(() => {
                    const firstInput = requestSection.querySelector('input:not([type="checkbox"]), select, textarea');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 500);
            }
        });
    }
}

// ============================================
// 15. নেভিগেশন লিংকের জন্য স্মুথ স্ক্রোল
// ============================================
function initSmoothScrollNav() {
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-bottom-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================
// 16. প্রি-অর্ডার বাটনে ক্লিক করলে সেকশনে যাওয়া
// ============================================
function initPreorderButton() {
    const preorderBtn = document.getElementById('preorderNowBtn');
    
    if (preorderBtn) {
        preorderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.getElementById('preorder');
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// ============================================
// 17. অর্ডার ট্র্যাক ফাংশন
// ============================================
function initTrackOrder() {
    const trackBtn = document.getElementById('trackBtn');
    const orderInput = document.getElementById('orderId');
    const trackResult = document.getElementById('trackResult');
    const trackMessage = document.getElementById('trackMessage');
    
    if (trackBtn) {
        trackBtn.addEventListener('click', function() {
            const orderId = orderInput?.value.trim();
            
            if (!orderId) {
                showNotification('দয়া করে অর্ডার আইডি দিন!', 'error');
                return;
            }
            
            showNotification('অর্ডার তথ্য সংগ্রহ করা হচ্ছে...', 'info');
            
            setTimeout(() => {
                if (trackResult) trackResult.style.display = 'block';
                if (trackMessage) {
                    trackMessage.innerHTML = `
                        <p><strong>অর্ডার আইডি:</strong> ${orderId}</p>
                        <p><strong>বর্তমান অবস্থা:</strong> আপনার অর্ডারটি প্রক্রিয়াকরণাধীন রয়েছে।</p>
                        <p><strong>আনুমানিক ডেলিভারি তারিখ:</strong> ${new Date(Date.now() + 10*24*60*60*1000).toLocaleDateString('bn-BD')}</p>
                        <p style="color: #2d6a4f; margin-top: 10px;">🔔 আপডেট পেতে SMS চেক করুন।</p>
                    `;
                }
                showNotification('অর্ডার তথ্য পাওয়া গেছে!', 'success');
            }, 1000);
        });
    }
}

// ============================================
// 18. ইউজার ড্রপডাউন মেনু
// ============================================
function initUserMenu() {
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdownMenu');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            currentUser = JSON.parse(currentUser);
            if (userNameDisplay) userNameDisplay.textContent = currentUser.name || currentUser.mobile || 'User';
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'flex';
        } catch(e) {
            console.log('ইউজার ডাটা পার্স করতে ব্যর্থ');
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
    
    if (userIcon && userDropdown) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
    }
    
    document.addEventListener('click', function(e) {
        if (userDropdown && userIcon) {
            if (!userDropdown.contains(e.target) && !userIcon.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        }
    });
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
            if (userDropdown) userDropdown.classList.remove('show');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            if (userNameDisplay) userNameDisplay.textContent = 'অতিথি';
            if (loginBtn) loginBtn.style.display = 'flex';
            if (logoutBtn) logoutBtn.style.display = 'none';
            showNotification('আপনি লগআউট করেছেন', 'info');
            if (userDropdown) userDropdown.classList.remove('show');
        });
    }
}

// ============================================
// 19. লগইন মোডাল
// ============================================
function showLoginModal() {
    let modal = document.getElementById('loginModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.className = 'login-modal';
        modal.innerHTML = `
            <div class="login-modal-content">
                <span class="login-modal-close">&times;</span>
                <div class="login-modal-header">
                    <i class="fas fa-mountain"></i>
                    <h2>পাহাড়ি হাট</h2>
                    <p>লগইন বা সাইন আপ করুন</p>
                </div>
                <div class="login-modal-body">
                    <div class="login-tabs">
                        <button class="tab-btn active" data-tab="login">লগইন</button>
                        <button class="tab-btn" data-tab="register">সাইন আপ</button>
                    </div>
                    
                    <div id="loginTab" class="tab-content active">
                        <input type="text" id="loginMobile" placeholder="মোবাইল নম্বর" class="login-input">
                        <input type="password" id="loginPassword" placeholder="পাসওয়ার্ড" class="login-input">
                        <button id="doLoginBtn" class="login-submit-btn">লগইন করুন</button>
                    </div>
                    
                    <div id="registerTab" class="tab-content">
                        <input type="text" id="regName" placeholder="আপনার নাম" class="login-input">
                        <input type="text" id="regMobile" placeholder="মোবাইল নম্বর" class="login-input">
                        <input type="password" id="regPassword" placeholder="পাসওয়ার্ড" class="login-input">
                        <input type="password" id="regConfirmPassword" placeholder="পাসওয়ার্ড নিশ্চিত করুন" class="login-input">
                        <button id="doRegisterBtn" class="login-submit-btn">সাইন আপ করুন</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const style = document.createElement('style');
        style.textContent = `
            .login-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            .login-modal-content {
                background: white;
                width: 90%;
                max-width: 400px;
                border-radius: 20px;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }
            .login-modal-header {
                background: linear-gradient(135deg, #2d6a4f, #40916c);
                color: white;
                text-align: center;
                padding: 25px;
            }
            .login-modal-header i { font-size: 2.5rem; margin-bottom: 10px; }
            .login-modal-header h2 { margin: 0; font-size: 1.5rem; }
            .login-modal-header p { margin: 5px 0 0; opacity: 0.8; }
            .login-modal-close {
                float: right;
                font-size: 24px;
                cursor: pointer;
                color: white;
                opacity: 0.8;
            }
            .login-modal-body { padding: 25px; }
            .login-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            .tab-btn {
                flex: 1;
                padding: 10px;
                border: none;
                background: #f0f0f0;
                cursor: pointer;
                border-radius: 8px;
                font-weight: 500;
            }
            .tab-btn.active {
                background: #2d6a4f;
                color: white;
            }
            .tab-content { display: none; }
            .tab-content.active { display: block; }
            .login-input {
                width: 100%;
                padding: 12px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-sizing: border-box;
            }
            .login-submit-btn {
                width: 100%;
                padding: 12px;
                background: #2d6a4f;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
            }
        `;
        document.head.appendChild(style);
        
        const closeBtn = modal.querySelector('.login-modal-close');
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        
        const tabBtns = modal.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const tab = this.getAttribute('data-tab');
                document.getElementById('loginTab').classList.toggle('active', tab === 'login');
                document.getElementById('registerTab').classList.toggle('active', tab === 'register');
            });
        });
        
        document.getElementById('doLoginBtn')?.addEventListener('click', () => {
            const mobile = document.getElementById('loginMobile').value;
            const password = document.getElementById('loginPassword').value;
            if (!mobile || !password) {
                alert('মোবাইল ও পাসওয়ার্ড দিন');
                return;
            }
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.mobile === mobile && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showNotification(`স্বাগতম ${user.name || user.mobile}`, 'success');
                modal.style.display = 'none';
                location.reload();
            } else {
                showNotification('মোবাইল বা পাসওয়ার্ড ভুল', 'error');
            }
        });
        
        document.getElementById('doRegisterBtn')?.addEventListener('click', () => {
            const name = document.getElementById('regName').value;
            const mobile = document.getElementById('regMobile').value;
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            
            if (!name || !mobile || !password) {
                alert('সব তথ্য পূরণ করুন');
                return;
            }
            if (password !== confirm) {
                alert('পাসওয়ার্ড মিলছে না');
                return;
            }
            if (mobile.length !== 11) {
                alert('সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)');
                return;
            }
            
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.mobile === mobile)) {
                alert('এই মোবাইল নম্বর already registered');
                return;
            }
            
            const newUser = { name, mobile, password, createdAt: new Date().toISOString() };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            showNotification('রেজিস্ট্রেশন সফল! স্বাগতম', 'success');
            modal.style.display = 'none';
            location.reload();
        });
    }
    
    modal.style.display = 'flex';
}

// ============================================
// 20. নিউজলেটার সাবস্ক্রাইব অ্যানিমেশন
// ============================================
function initNewsletterAnimation() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const btn = this.querySelector('button');
            
            if (input && input.value) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> সাবস্ক্রাইবিং...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> সাবস্ক্রাইবড!';
                    input.value = '';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 2000);
                    
                    showNotification('সাবস্ক্রিপশন সফল হয়েছে!', 'success');
                }, 1000);
            }
        });
    }
}

// ============================================
// 21. স্ট্যাটাস কাউন্ট আপ অ্যানিমেশন
// ============================================
function initCountUpAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target') || el.textContent);
                let current = 0;
                const increment = target / 50;
                
                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        el.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(updateCount);
                    } else {
                        el.textContent = target + '+';
                    }
                };
                updateCount();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => {
        const text = el.textContent;
        const num = parseInt(text);
        if (!isNaN(num)) {
            el.setAttribute('data-target', num);
            el.textContent = '0+';
            observer.observe(el);
        }
    });
}

// ============================================
// 22. স্ক্রোল রিভিল অ্যানিমেশন
// ============================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.product-card, .category-card, .step, .district-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ============================================
// 23. ইনিশিয়ালাইজেশন (Initialization)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('পাহাড়ি হাট ওয়েবসাইট লোড হয়েছে!');
    
    initCountdownTimers();
    loadCartFromLocalStorage();
    initProductCardEvents();
    initFaqAccordion();
    initRequestForm();
    initImageUpload();
    initVotingSystem();
    initScrollAnimation();
    initCategoryFilter();
    initProductSearch();
    initSmoothScroll();
    checkPreorderStock();
    initTrustPolicyModal();
    initRequestButtonScroll();
    initSmoothScrollNav();
    initPreorderButton();
    initTrackOrder();
    initUserMenu();
    initNewsletterAnimation();
    initCountUpAnimation();
    initScrollReveal();
    
    console.log(`কার্টে ${cart.length}টি আইটেম আছে`);
});

// ============================================
// 24. অ্যাডিশনাল ইউটিলিটি ফাংশন (Utilities)
// ============================================
function calculateDiscount(price, discountPercent) {
    return price - (price * discountPercent / 100);
}

function calculateDeliveryCharge(area) {
    const deliveryCharges = {
        'dhaka': 60,
        'outside_dhaka': 120,
        'remote': 200
    };
    return deliveryCharges[area] || 100;
}

function formatDeliveryDate(daysToAdd = 10) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function filterProductsBySource(source) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const sourceText = card.querySelector('.product-source')?.textContent || '';
        if (source === 'all' || sourceText.includes(source)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

window.pahariHat = {
    cart: cart,
    addToCart: addToCart,
    filterProductsBySource: filterProductsBySource,
    calculateDeliveryCharge: calculateDeliveryCharge
};

// ফিল্টার কাউন্ট আপডেট ফাংশন
function updateFilterCount() {
    const productCards = document.querySelectorAll('.product-card');
    const visibleCount = Array.from(productCards).filter(card => card.style.display !== 'none').length;
    const countSpan = document.getElementById('productCount');
    if (countSpan) {
        countSpan.textContent = visibleCount;
    }
}

// ফিল্টার ইভেন্টে কাউন্ট আপডেট যোগ করুন
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
        setTimeout(updateFilterCount, 100);
    });
}

// ============================================
// বাংলা ক্যালেন্ডার (বাংলা তারিখ কনভার্টার)
// ============================================

const banglaMonths = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];

function toBanglaNumber(number) {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().split('').map(d => banglaDigits[d] || d).join('');
}

function toBanglaDate(englishDate) {
    const date = new Date(englishDate);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    let banglaYear = year - 593;
    let banglaMonth = month;
    let banglaDay = day;
    
    if (month === 3 && day >= 14) banglaMonth = 0;
    else if (month === 3) banglaMonth = 11;
    else if (month < 3) banglaMonth = month + 9;
    else banglaMonth = month - 3;
    
    return `${toBanglaNumber(banglaDay)} ${banglaMonths[banglaMonth]} ${toBanglaNumber(banglaYear)}`;
}

function updateDeliveryDateToBangla() {
    const deliveryDates = document.querySelectorAll('.delivery-date');
    deliveryDates.forEach(el => {
        const dateText = el.textContent;
        const dateMatch = dateText.match(/(\d{1,2})-(\d{1,2})/);
        if (dateMatch) {
            const day = parseInt(dateMatch[1]);
            const month = parseInt(dateMatch[2]) - 1;
            const year = 2026;
            const englishDate = new Date(year, month, day);
            const banglaDate = toBanglaDate(englishDate);
            const banglaSpan = document.createElement('span');
            banglaSpan.className = 'bangla-date';
            banglaSpan.innerHTML = `<i class="fas fa-calendar-alt"></i> বাংলা: ${banglaDate}`;
            el.appendChild(banglaSpan);
        }
    });
}

// ============================================
// সোশ্যাল শেয়ার ফাংশন
// ============================================
function initSocialShare() {
    const currentUrl = encodeURIComponent(window.location.href);
    const currentTitle = encodeURIComponent(document.title);
    
    const fbBtn = document.getElementById('fbShareBtn');
    const waBtn = document.getElementById('waShareBtn');
    const twitterBtn = document.getElementById('twitterShareBtn');
    const copyBtn = document.getElementById('copyLinkBtn');
    
    if (fbBtn) {
        fbBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank', 'width=600,height=400');
        });
    }
    
    if (waBtn) {
        waBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`https://wa.me/?text=${currentTitle} - ${decodeURIComponent(currentUrl)}`, '_blank');
        });
    }
    
    if (twitterBtn) {
        twitterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`https://twitter.com/intent/tweet?text=${currentTitle}&url=${currentUrl}`, '_blank', 'width=600,height=400');
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(window.location.href);
            showNotification('লিংক কপি হয়েছে!', 'success');
        });
    }
}

// ============================================
// হেল্পলাইন / লাইভ চ্যাট সিস্টেম
// ============================================
function initHelpdesk() {
    const helpButton = document.getElementById('helpButton');
    const helpWindow = document.getElementById('helpWindow');
    const helpClose = document.querySelector('.help-close');
    const quickOptions = document.querySelectorAll('.quick-option');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    const answers = {
        'অর্ডার স্ট্যাটাস': 'আপনার অর্ডারের বর্তমান স্ট্যাটাস জানতে "মাই অর্ডার" পেজে গিয়ে অর্ডার আইডি দিয়ে ট্র্যাক করতে পারেন।',
        'প্রোডাক্ট সম্পর্কে': 'আমাদের সব প্রোডাক্টই ১০০% ফরমালিন মুক্ত এবং সরাসরি পাহাড়ি কৃষকদের কাছ থেকে সংগ্রহ করা হয়।',
        'ডেলিভারি সময়': 'আমরা সাধারণত অর্ডার কনফার্মের ৭-১৫ দিনের মধ্যে ডেলিভারি দিয়ে থাকি।',
        'পেমেন্ট সমস্যা': 'পেমেন্ট সংক্রান্ত যেকোনো সমস্যায় আমাদের হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করুন: ০১৯১৮৪৮১২৩২'
    };
    
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `help-message ${isUser ? 'user' : 'support'}`;
        messageDiv.innerHTML = isUser ? `<p>${text}</p>` : `<i class="fas fa-robot"></i><p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    if (helpButton) {
        helpButton.addEventListener('click', () => helpWindow.classList.toggle('active'));
    }
    if (helpClose) {
        helpClose.addEventListener('click', () => helpWindow.classList.remove('active'));
    }
    
    quickOptions.forEach(option => {
        option.addEventListener('click', () => {
            const question = option.getAttribute('data-question');
            addMessage(question, true);
            setTimeout(() => addMessage(answers[question] || 'আমরা খুব শীঘ্রই উত্তর দেব।', false), 500);
        });
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            setTimeout(() => {
                let reply = 'আপনার প্রশ্নের জন্য ধন্যবাদ। আমাদের একজন প্রতিনিধি খুব শীঘ্রই যোগাযোগ করবেন।';
                if (message.includes('মধু')) reply = 'আমাদের মধু ১০০% খাঁটি এবং সরাসরি বান্দরবান থেকে সংগ্রহ করা হয়।';
                else if (message.includes('কমলা')) reply = 'পাহাড়ি মিষ্টি কমলা ১৫০ টাকা প্রতি কেজি। ফরমালিন ফ্রি।';
                else if (message.includes('ডেলিভারি')) reply = 'ঢাকার ভিতরে ডেলিভারি চার্জ ৬০ টাকা। ডেলিভারি হতে ৭-১৫ দিন সময় লাগে।';
                else if (message.includes('পেমেন্ট')) reply = 'বিকাশ/নগদ নম্বর: ০১৯১৮৪৮১২৩২';
                addMessage(reply, false);
            }, 1000);
        }
    }
    
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

// DOM লোডে যোগ করুন
document.addEventListener('DOMContentLoaded', function() {
    updateDeliveryDateToBangla();
    initSocialShare();
    initHelpdesk();
});

// ============================================
// সাপোর্ট নীতি পপআপ ফাংশন
// ============================================
function initPolicyModals() {
    const policyLinks = document.querySelectorAll('.policy-link');
    
    policyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    const closeBtns = document.querySelectorAll('.policy-modal-close, .close-policy-modal');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.policy-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('policy-modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// DOM লোডে কল করুন
document.addEventListener('DOMContentLoaded', function() {
    // ... আপনার অন্যান্য ফাংশন
    initPolicyModals();
});
