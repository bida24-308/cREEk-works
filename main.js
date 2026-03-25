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
