const form = document.getElementById("signupForm");

form.addEventListener("submit", function(e){

    e.preventDefault();

    let firstName = document.getElementById("fname").value.trim();
    let lastName = document.getElementById("lname").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if(firstName==="" || lastName==="" || email==="" || password===""){
        alert("Please fill all fields.");
        return;
    }

    if(password.length < 6){
        alert("Password must be at least 6 characters.");
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match.");
        return;
    }

    alert("Signup Successful!");

    // Later you will connect this with ASP.NET API or SQL Server
    // Example:
    // fetch('http://localhost:5000/api/signup',{...})

    form.reset();

});