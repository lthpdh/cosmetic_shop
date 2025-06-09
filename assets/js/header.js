// Cập nhật số lượng giỏ hàng từ localStorage
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = count;
}

// Quản lý menu Account
function initAccountMenu() {
    // Đợi elements được load
    const accountMenu = document.querySelector('.account');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (!accountMenu || !dropdownMenu) {
        console.log('Account menu elements not found');
        return;
    }

    const loginItems = dropdownMenu.querySelectorAll('a:not(.logged-in)');
    const loggedInItems = dropdownMenu.querySelectorAll('.logged-in');

    function checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem('user'));
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        return user && isLoggedIn === 'true';
    }

    function updateMenu() {
        const user = JSON.parse(localStorage.getItem('user'));
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        // Chọn đúng selector
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (!dropdownMenu) return;
        const loginItems = dropdownMenu.querySelectorAll('.not-logged-in');
        const loggedInItems = dropdownMenu.querySelectorAll('.logged-in');
        const phoneDisplay = dropdownMenu.querySelector('.user-phone');

        if (user && isLoggedIn) {
            loginItems.forEach(item => item.style.display = 'none');
            loggedInItems.forEach(item => item.style.display = 'block');
            if (phoneDisplay) phoneDisplay.textContent = user.phone || '';
        } else {
            loginItems.forEach(item => item.style.display = 'block');
            loggedInItems.forEach(item => item.style.display = 'none');
            if (phoneDisplay) phoneDisplay.textContent = '';
        }
    }

    // Thêm listener cho nút đăng xuất
    const logoutBtn = dropdownMenu.querySelector('a[href="/cosmetic_shop/account/logout.html"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginType');
            localStorage.removeItem('loginPhone');
            updateMenu();
            window.location.href = '/cosmetic_shop/index.html';
        });
    }

    // Thêm listener cho localStorage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'user' || e.key === 'isLoggedIn') {
            console.log('Storage changed:', e.key);
            updateMenu();
        }
    });

    // Update menu khi page load
    document.addEventListener('DOMContentLoaded', () => {
        updateMenu();
    });

    // Update menu ngay lập tức
    updateMenu();
}




// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initAccountMenu();
});

// Export function cho các file khác sử dụng
window.updateCartCount = updateCartCount;

// Khởi tạo với retry mechanism
function initWithRetry(maxAttempts = 3) {
    let attempts = 0;
    
    function tryInit() {
        if (attempts >= maxAttempts) {
            console.error('Failed to initialize header after', maxAttempts, 'attempts');
            return;
        }
        
        try {
            updateCartCount();
            initAccountMenu();
        } catch (e) {
            console.log('Init attempt failed, retrying...', e);
            attempts++;
            setTimeout(tryInit, 500);
        }
    }
    
    tryInit();
}

// Start initialization
document.addEventListener('DOMContentLoaded', () => {
    initWithRetry();
});
