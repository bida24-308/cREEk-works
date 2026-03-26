function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}
    
// LOGIN FUNCTION
function login() {
    const username = document.getElementById("username").value;

    if (username === "") {
        alert("Enter your name");
        return;
    }

    localStorage.setItem("user", username);
    showUser();
}

// LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("user");
    location.reload();
}

// SHOW USER IF LOGGED IN
function showUser() {
    const user = localStorage.getItem("user");

    if (user) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("userBox").style.display = "block";
        document.getElementById("userNameDisplay").innerText = user;
    }
}

// RUN WHEN PAGE LOADS
window.onload = function () {
    showUser();
};

// UPDATE NAVBAR NAME
function updateNavbar() {
    const user = localStorage.getItem("user");
    const link = document.getElementById("accountLink");

    if (user && link) {
        link.textContent = "Hello " + user + " 👋";
    }
}

// RUN ON LOAD
window.onload = function () {
    showUser();
    updateNavbar();
};

function selectPlan(plan) {
    localStorage.setItem("selectedPlan", plan);
    document.getElementById("selectedPlanText").innerText = "You selected: " + plan;
    openPopup();
}

function confirmPayment() {
    const plan = localStorage.getItem("selectedPlan");
    localStorage.setItem("userPlan", plan);

    alert("Payment successful for " + plan + " 🎉");

    closePopup();
    location.href = "account.html";
}

function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

let selectedMeals = [];

function selectMeal(mealName, element) {
    if (selectedMeals.includes(mealName)) {
        selectedMeals = selectedMeals.filter(m => m !== mealName);
        element.classList.remove("selected");
    } else {
        selectedMeals.push(mealName);
        element.classList.add("selected");
    }

    localStorage.setItem("meals", JSON.stringify(selectedMeals));
}

function goToSubscription() {
    if (selectedMeals.length === 0) {
        alert("Select at least one meal");
        return;
    }

    location.href = "subscription.html";
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value.trim();
    if(selectedMeals.length === 0){
        showToast("Please select at least one meal!");
        return;
    }
    if(location === "") {
        showToast("Please enter your delivery location!");
        return;
    }
    let summary = selectedMeals.map(m => BWP{m.name} (BWP {m.price})`).join(", ");
    let total = selectedMeals.reduce((sum, m) => sum + m.price, 0);
    showToast(`✅ Your order: BWP{summary}. Total BWP {total}. We’ll deliver to BWP{location} in a few minutes. Pay on delivery!`);

    // Clear selection for new orders
    selectedMeals = [];
    mealItems.forEach(item => item.classList.remove('selected'));
    updateTotal();
    document.getElementById('locationInput').value = "";
});
