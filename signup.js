// alert('hi');

let form = document.querySelector('#form');

var firebaseConfig = {
    apiKey: "AIzaSyCVwfqCGwEIf-Rvs7GOGjGk2G5BGuYYMuo",
    authDomain: "all-users-data.firebaseapp.com",
    databaseURL: "https://all-users-data-default-rtdb.firebaseio.com",
    projectId: "all-users-data",
    storageBucket: "all-users-data.appspot.com",
    messagingSenderId: "627793801794",
    appId: "1:627793801794:web:18687880ad71cec4a8b3db",
    measurementId: "G-EHR0TSSH1W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let email = form.elements.email.value;
    let password = form.elements.password.value;
    // console.log(email);
    // console.log(password);

    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            form.reset();
            window.location.href = "index.html";
        })
        .catch(err => {
            alert(err.message);
        })
});