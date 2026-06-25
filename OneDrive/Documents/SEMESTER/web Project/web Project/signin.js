const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(email === "" || password === ""){
        alert("Please fill all fields.");
        return;
    }

    // Later connect this to your ASP.NET API
    // Example:
    // fetch("http://localhost:5000/api/login", {...})

    alert("Login Successful!");

    // Redirect to Home Page
    window.location.href = "home.html";

});