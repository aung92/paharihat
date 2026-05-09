// js/products.js - সমস্ত প্রোডাক্ট ডাটা এখানে থাকবে

const productsData = {
    preorderProducts: [
        {
            id: 1,
            name: "বান্দরবানের খাঁটি মধু",
            category: "honey",
            source: "বান্দরবান, থানচি",
            estimatePrice: "800-1200",
            actualPrice: null,
            discount: 5,
            image: "https://placehold.co/300x250/2d6a4f/white?text=মধু",
            rating: 4.5,
            reviews: 48,
            deadline: "2026-05-30",
            deliveryDate: "১০-১৫ জুন ২০২৬",
            stock: 50,
            unit: "কেজি",
            status: "active",
            vendorId: 1,
            createdAt: "2026-05-01"
        },
        {
            id: 2,
            name: "পাহাড়ি মিষ্টি কমলা",
            category: "fruits",
            source: "রাঙ্গামাটি, সাজেক",
            estimatePrice: "120-180",
            actualPrice: null,
            discount: 0,
            image: "https://placehold.co/300x250/e76f51/white?text=কমলা",
            rating: 5,
            reviews: 112,
            deadline: "2026-05-25",
            deliveryDate: "৫-১০ জুন ২০২৬",
            stock: 200,
            unit: "কেজি",
            status: "active",
            vendorId: 2,
            createdAt: "2026-05-01"
        }
        // আরও প্রোডাক্ট যোগ করুন
    ],
    
    categories: [
        { id: "fruits", name: "মৌসুমি ফল", icon: "fa-apple-alt", badge: "ফরমালিন ফ্রি" },
        { id: "seafood", name: "সামুদ্রিক মাছ", icon: "fa-fish", badge: "তাজা কোল্ড চেইন" },
        { id: "honey", name: "মধু", icon: "fa-jar", badge: "খাঁটি ১০০%" },
        { id: "meat", name: "মাংস", icon: "fa-drumstick-bite", badge: "কোল্ড চেইন" },
        { id: "spices", name: "মশলা", icon: "fa-mortar-pestle", badge: "পাহাড়ি উৎস" },
        { id: "vegetables", name: "শাক-সবজি", icon: "fa-leaf", badge: "কেমিক্যাল ফ্রি" }
    ]
};

// লোকাল স্টোরেজ থেকে প্রোডাক্ট লোড করা
function loadProductsFromStorage() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (parsed.preorderProducts) {
            return parsed;
        }
    }
    return productsData;
}

// প্রোডাক্ট সেভ করা
function saveProductsToStorage(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// ডাইনামিকভাবে প্রোডাক্ট রেন্ডার করা
function renderProducts() {
    const products = loadProductsFromStorage();
    const productGrid = document.getElementById('preorderProductGrid');
    
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.preorderProducts.forEach(product => {
        if (product.status !== 'active') return;
        
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// প্রোডাক্ট কার্ড তৈরি করা
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    card.setAttribute('data-name', product.name);
    card.setAttribute('data-estimate-price', product.estimatePrice);
    
    card.innerHTML = `
        <div class="product-badge preorder">
            <span>🔵 প্রি-অর্ডার</span>
        </div>
        ${product.discount > 0 ? `<div class="product-discount-badge"><span>-${product.discount}%</span></div>` : ''}
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-content">
            <div class="product-source">
                <i class="fas fa-location-dot"></i> উৎস: ${product.source}
            </div>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">
                ${generateStars(product.rating)}
                <span>(${product.reviews} রিভিউ)</span>
            </div>
            <div class="product-price">
                <span class="estimate-price">৳${product.estimatePrice}</span>
                <span class="price-status-badge estimate-badge">আনুমানিক দাম</span>
                <span class="per-unit">/${product.unit}</span>
            </div>
            <div class="product-preorder-info">
                <div class="countdown-timer" data-deadline="${product.deadline}">
                    <i class="far fa-clock"></i> শেষ হতে: <span class="days">--</span>দিন <span class="hours">--</span>ঘণ্টা
                </div>
                <div class="delivery-date">
                    <i class="far fa-calendar-alt"></i> ডেলিভারি: ${product.deliveryDate}
                </div>
            </div>
            <div class="product-actions">
                <div class="quantity-selector">
                    <button class="qty-minus">-</button>
                    <input type="number" value="1" min="1" max="${product.stock}" step="1">
                    <button class="qty-plus">+</button>
                </div>
                <button class="btn-add-to-cart">প্রি-বুক <i class="fas fa-shopping-cart"></i></button>
            </div>
        </div>
    `;
    
    return card;
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalf) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}