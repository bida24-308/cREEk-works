/* ================================================
   FRESHBITE - Account Page JavaScript
   Tab management, form handling, and user preferences
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeAccountTabs();
    initializeForms();
    loadAccountData();
    initializeNavigation();
});

// Initialize account tabs
function initializeAccountTabs() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.classList.contains('logout')) return;
        
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            showTab(tabId);
            
            // Update active state
            document.querySelectorAll('.nav-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Show specific tab
function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const tab = document.getElementById(tabId);
    if (tab) {
        tab.classList.add('active');
        FreshBite.Analytics.trackEvent('Account', 'ViewTab', tabId);
    }
}

// Initialize forms
function initializeForms() {
    // Profile form
    const profileForm = document.querySelector('form.account-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Preferences form
    const preferencesForm = document.querySelector('form.preferences-form');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', handlePreferencesSubmit);
    }

    // Contact form
    const contactForm = document.querySelector('form.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Handle profile form submission
function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate
    const validation = FreshBite.FormValidator.validateForm(data);
    if (!validation.isValid) {
        validation.errors.forEach(error => {
            FreshBite.showToast(error, 'error');
        });
        return;
    }
    
    // Save to local storage
    FreshBite.Storage.set('userProfile', data);
    FreshBite.showToast('Profile updated successfully!');
    FreshBite.Analytics.trackEvent('Account', 'UpdateProfile', data.email);
}

// Handle preferences form submission
function handlePreferencesSubmit(e) {
    e.preventDefault();
    
    const dietaryOptions = Array.from(document.querySelectorAll('input[name="dietary"]:checked'))
        .map(cb => cb.nextElementSibling?.textContent || '');
    
    const cuisineOptions = Array.from(document.querySelectorAll('input[name="cuisine"]:checked'))
        .map(cb => cb.nextElementSibling?.textContent || '');
    
    const preferences = {
        dietary: dietaryOptions,
        cuisines: cuisineOptions,
        allergies: document.querySelector('textarea')?.value || '',
        calorieTarget: document.querySelector('select')?.value || '1500-2000'
    };
    
    FreshBite.UserPreferences.set(preferences);
    FreshBite.Analytics.trackEvent('Account', 'UpdatePreferences', preferences.dietary.join(','));
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = Object.fromEntries(formData);
    
    // Validate
    const validation = FreshBite.FormValidator.validateForm(contactData);
    if (!validation.isValid) {
        validation.errors.forEach(error => {
            FreshBite.showToast(error, 'error');
        });
        return;
    }
    
    // Save contact message
    let messages = FreshBite.Storage.get('contactMessages') || [];
    messages.push({
        ...contactData,
        timestamp: new Date(),
        id: Date.now()
    });
    FreshBite.Storage.set('contactMessages', messages);
    
    FreshBite.showToast('Your message has been sent!');
    e.target.reset();
    FreshBite.Analytics.trackEvent('Account', 'ContactSubmit', contactData.subject);
}

// Load account data from storage
function loadAccountData() {
    const userProfile = FreshBite.Storage.get('userProfile');
    if (userProfile) {
        loadProfileData(userProfile);
    }
    
    const preferences = FreshBite.UserPreferences.get();
    loadPreferencesData(preferences);
}

// Load profile data into form
function loadProfileData(profile) {
    const form = document.querySelector('form.account-form');
    if (!form) return;
    
    Object.keys(profile).forEach(key => {
        const input = form.querySelector(`input[name="${key}"], textarea[name="${key}"]`);
        if (input) {
            input.value = profile[key];
        }
    });
}

// Load preferences data into form
function loadPreferencesData(preferences) {
    if (preferences.dietary && preferences.dietary.length > 0) {
        preferences.dietary.forEach(diet => {
            const checkbox = document.querySelector(`input[value="${diet}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    if (preferences.calorieTarget) {
        const select = document.querySelector('select[name="calorieTarget"]');
        if (select) select.value = preferences.calorieTarget;
    }
}

// Initialize navigation
function initializeNavigation() {
    // Logout button
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Account settings links
    document.querySelectorAll('.account-settings-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.dataset.tab;
            const navBtn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
            if (navBtn) navBtn.click();
        });
    });
}

// Handle logout
function handleLogout() {
    // You can optionally clear sensitive user data
    // FreshBite.Storage.remove('userSession');
    FreshBite.showToast('You have been logged out');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// Tab switching for account sections
class AccountTabManager {
    constructor() {
        this.tabs = {};
        this.currentTab = 'dashboard';
    }
    
    registerTab(tabId, content) {
        this.tabs[tabId] = content;
    }
    
    showTab(tabId) {
        // Hide all
        Object.keys(this.tabs).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.remove('active');
        });
        
        // Show selected
        const element = document.getElementById(tabId);
        if (element) {
            element.classList.add('active');
            this.currentTab = tabId;
        }
    }
    
    getCurrentTab() {
        return this.currentTab;
    }
}

const tabManager = new AccountTabManager();

// Dashboard data loader
function updateDashboard() {
    const selectedPlan = FreshBite.Storage.get('selectedPlan');
    if (selectedPlan) {
        const planElement = document.querySelector('.dashboard-card .status-badge');
        if (planElement) {
            planElement.textContent = `Active - ${selectedPlan.name} Plan`;
        }
    }
}

updateDashboard();

// Track page analytics
FreshBite.Analytics.trackEvent('Page', 'ViewAccount', 'UserAccount');

// Periodic data sync (simulate API calls)
setInterval(() => {
    console.log('Syncing account data...');
}, 60000);

console.log('Account.js loaded successfully!');
