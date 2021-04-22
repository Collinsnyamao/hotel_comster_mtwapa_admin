document.getElementById('statusDiv').hidden = true;
var firebaseConfig = {
    apiKey: "AIzaSyC75xjGMriJU1viUZYgfgHYpthYybhAvmg",
    authDomain: "hotel-comster-mtwapa.firebaseapp.com",
    projectId: "hotel-comster-mtwapa",
    storageBucket: "hotel-comster-mtwapa.appspot.com",
    messagingSenderId: "643202371883",
    appId: "1:643202371883:web:5a63c7118adbd3b775f56e",
    measurementId: "G-LEP23JFDQJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const database = firebase.database();

function login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
            return userCredential;
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            return error;
        });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        // ...
        window.location.href = 'dashboard.html';
    } else {
        // User is signed out
        // ...
    }
});

const rmCheck = document.getElementById("ckb1"),
    emailInput = document.getElementById("loginEmail");

if (localStorage.checkbox && localStorage.checkbox !== "") {
    rmCheck.setAttribute("checked", "checked");
    emailInput.value = localStorage.username;
} else {
    rmCheck.removeAttribute("checked");
    emailInput.value = "";
}

function lsRememberMe() {
    if (rmCheck.checked && emailInput.value !== "") {
        localStorage.username = emailInput.value;
        localStorage.checkbox = rmCheck.value;
    } else {
        localStorage.username = "";
        localStorage.checkbox = "";
    }
}

$('#loginBtn').on('click', function () {
    lsRememberMe();
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
            document.getElementById('statusDiv').hidden = false;
            document.getElementById('statustext').classList.remove('text-danger');
            document.getElementById('statustext').classList.add('text-success');
            document.getElementById('statustext').innerText = 'Signed in as ' + userCredential.email;
            setTimeout(function () {
                window.location.href = 'dashboard.html';
            }, 2000);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById('statusDiv').hidden = false;
            document.getElementById('statustext').classList.remove('text-success');
            document.getElementById('statustext').classList.add('text-danger');
            document.getElementById('statustext').innerText = errorMessage;
        });
})
