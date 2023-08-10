 console.log('hi');
let posts = [];
let form = document.querySelector('#p_frm');

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
const db = firebase.firestore();
// console.log(db);
db.settings({ timestampsInSnapshots: true });
// let isSignedOut = false;

// firebase.auth().onAuthStateChanged(function (user) {
//     if (!user && !isSignedOut) {
//         window.alert("You need to LogIn First. Redirecting to Home Page.");
//         window.location = "index.html";
//     }
// });

function createUpvote() {
    let up = document.createElement('button');
    up.setAttribute("type", "button");
    up.classList.add('btn');
    up.classList.add('btn-success');
    up.innerText = "Upvote";
    return up;
}

function createDownvote() {
    let down = document.createElement('button');
    down.setAttribute("type", "button");
    down.classList.add('btn');
    down.classList.add('btn-danger');
    down.innerText = "Downvote";
    return down;
}

function renderPetition(doc) {
    let issue = doc.data().issue;
    let content = doc.data().content;
    let votes = doc.data().votes;

    //creating header
    let header = document.createElement('div');
    header.innerHTML = issue;
    header.classList.add('card-header');
    let p = document.createElement('p');
    p.innerHTML = content;

    //creating body
    let body = document.createElement('div');
    body.appendChild(p);
    body.classList.add('card-body');
    let card = document.createElement('div');
    card.setAttribute('id', doc.id);

    //appending body and header
    card.appendChild(header);
    card.appendChild(body);

    //creating footer
    let footer = document.createElement('div');
    footer.classList.add('card-footer');
    let up = createUpvote();
    up.setAttribute('id', `u${doc.id}`);
    let down = createDownvote();
    down.setAttribute('id', `d${doc.id}`);
    let span = document.createElement('span');
    span.setAttribute('id', `dis${doc.id}`);
    let h5 = document.createElement('h3');
    span.innerText = `${votes}`;
    span.classList.add("dis");
    span.classList.add('badge');
    span.classList.add('bg-primary');

    up.addEventListener('click', function () {
        let id = up.id.slice(1);
         console.log(id);
        let z = 0;
        let docRef = db.collection('Petitions').doc(id);
        docRef.get()
            .then(doc => {
                // console.log(doc.data().votes);
                z = doc.data().votes;
                 console.log(z);
                console.log("Increment");
                db.collection('Petitions').doc(id).update({
                    votes: z + 1,
                });
                let dis = document.querySelector(`#dis${id}`);
                dis.innerText = `${z + 1}`;

                if (z + 1 > 20) {
                    console.log("Email Sent!");
                }
            }).catch(err => {
                console.log(err.message);
            })

    });

    down.addEventListener('click', function () {
        let id = down.id.slice(1);
         console.log(id);
        let z = 0;
        let docRef = db.collection('Petitions').doc(id);
        //console.log(docRef);
        docRef.get()
            .then(doc => {
                // console.log(doc.data().votes);
                z = doc.data().votes;
                // console.log(z);
                console.log("Decrement");
                db.collection('Petitions').doc(id).update({
                    votes: z - 1,
                });
                let dis = document.querySelector(`#dis${id}`);
                dis.innerText = `${z - 1}`;

                if (z - 1 < -20) {
                    db.collection('Petitions').doc(id).delete();
                }
            }).catch(err => {
                console.log(err.message);
            })
    });

    h5.appendChild(span);
    footer.appendChild(h5);
    footer.appendChild(up);
    footer.appendChild(down);
    card.appendChild(footer);
    card.classList.add('card');
    let main = document.querySelector('#main');
    main.appendChild(card);
}

// on Refreshing
// db.collection('Petitions').get()
//     .then((snapshot) => {
//         snapshot.docs.forEach(doc => {
//             renderPetition(doc);
//         })
//     })
//     .catch(err => {
//         alert(err.message);
//     })

// Real-time updation
db.collection('Petitions').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderPetition(change.doc);
        } else if (change.type == 'removed') {
            let main = document.querySelector('#main');
            let card = document.querySelector(`#${change.doc.id}`);
            main.removeChild(card);
        }
    })
})

form.addEventListener('submit', function (e) {
     console.log("hi(2)");
    e.preventDefault();
    let issue = form.elements.iname.value;
    let content = form.elements.content.value;

    db.collection('Petitions').add({
        issue: issue,
        content: content,
        votes: 0
    });

    form.elements.iname.value = "";
    form.elements.content.value = "";
});

let signout = document.querySelector('#signout');

signout.addEventListener('click', function () {
    isSignedOut = true;
    auth.signOut()
        .then(() => {
            // Sign-out successful.
             alert("You have signed out Succesfully");
            window.location = "index.html";
        }).catch((error) => {
            // An error happened.
            alert(error.message);
        });
});