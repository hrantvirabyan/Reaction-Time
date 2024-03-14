function toggleSignup(){
    document.getElementById("login-toggle").style.backgroundColor="#fff";
    document.getElementById("login-toggle").style.color="#222";
    document.getElementById("signup-toggle").style.backgroundColor="#00ADB5";
    document.getElementById("signup-toggle").style.color="#fff";
    document.getElementById("login-form").style.display="none";
    document.getElementById("signup-form").style.display="block";
}

function toggleLogin(){
    document.getElementById("login-toggle").style.backgroundColor="#00ADB5";
    document.getElementById("login-toggle").style.color="#fff";
    document.getElementById("signup-toggle").style.backgroundColor="#fff";
    document.getElementById("signup-toggle").style.color="#222";
    document.getElementById("signup-form").style.display="none";
    document.getElementById("login-form").style.display="block";
}

document.querySelector('.login').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    const email = document.querySelector('#login-form input[type=text]').value;
    const password = document.querySelector('#login-form input[type=password]').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // This is crucial for including cookies
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (response.ok) {
            // If login is successful, redirect to index.html
            //alert('Logged in.');
           window.location.href = 'index.html';
        } else {
            // If login is not successful, you can alert the user
            // This is a simple way to handle it; consider a more user-friendly approach for production
            alert('Login failed. Please check your email and password.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});


document.querySelector('.signup').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    const email = document.querySelector('#signup-form input[type=email]').value;
    const username = document.querySelector('#signup-form input[type=text]').value;
    const password = document.querySelector('#signup-form input[type=password]').value;

    fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, username, password }),
})
.then(response => {
    if (response.ok) {
        // If signup is successful, redirect to index.html
        window.location.href = 'index.html';
    } else {
        // If signup is not successful, handle non-JSON text response
        return response.text().then(text => Promise.reject(text));
    }
})
.catch((error) => {
    console.error('Error:', error);
    // Directly alert the error assuming it's plain text
    alert(error);
});

});

