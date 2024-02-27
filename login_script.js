function toggleSignup(){
    document.getElementById("login-toggle").style.backgroundColor="#fff";
    document.getElementById("login-toggle").style.color="#222";
    document.getElementById("signup-toggle").style.backgroundColor="#57b846";
    document.getElementById("signup-toggle").style.color="#fff";
    document.getElementById("login-form").style.display="none";
    document.getElementById("signup-form").style.display="block";
}

function toggleLogin(){
    document.getElementById("login-toggle").style.backgroundColor="#57B846";
    document.getElementById("login-toggle").style.color="#fff";
    document.getElementById("signup-toggle").style.backgroundColor="#fff";
    document.getElementById("signup-toggle").style.color="#222";
    document.getElementById("signup-form").style.display="none";
    document.getElementById("login-form").style.display="block";
}

document.querySelector('.login').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.querySelector('#login-form input[type=text]').value;
    const password = document.querySelector('#login-form input[type=password]').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.querySelector('.signup').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.querySelector('#signup-form input[type=email]').value;
    const username = document.querySelector('#signup-form input[type=text]').value;
    const password = document.querySelector('#signup-form input[type=password]').value;

    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch((error) => {
        console.error('Error:', error);
    });
});
