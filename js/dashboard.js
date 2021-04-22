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
var db = firebase.firestore();

const dbRef = firebase.database().ref();
let tableData = [];
/*dbRef.child("bookings").get().then((snapshot) => {
    if (snapshot.exists()) {

        let initial_data = snapshot.val();
        let keys_array = Object.keys(initial_data);

        //console.log(keys_array);
        let t;
        for (t = 0; t < keys_array.length; t++){
            tableData.push(initial_data[keys_array[t]])

        }
        console.log(tableData);
        document.getElementById('table_data').innerHTML = '';
        tableData.forEach(function (object) {
            $('#table_data').append(
                '<tr><td>'+ object.name +'</td><td>'+ object.mail +'</td><td>'+ object.rooms +'</td><td>'+ object.adults +'</td><td>'+ object.children +'</td><td class="text-right">'+ object.guests +'</td></tr>'
            )
        })
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});*/

/*db.collection("bookings").get().then((querySnapshot) => {
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
        //console.log(`${doc.data()}`);
    });
});*/
let bookings = [];
/*db.collection("bookings").where("hotel", "==", "Hotel Comster Mtwapa")
    .onSnapshot((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            bookings.push({
                name: doc.data().name,
                mail: doc.data().mail,
                adults: doc.data().adults,
                amount: doc.data(),
                checkin: doc.data().checkin,
                checkout: doc.data().checkout,
                guests: doc.data().guests,
                notes: doc.data().notes,
                rooms: doc.data().rooms,
                children: doc.data().children,
                id: doc.id
            });
        });


        bookings.forEach(function (object) {
            $('#table_data').append(
                '<tr id="'+ object.id +'"><td class="booking_name">'+ object.name +'</td><td class="booking_mail">'+ object.mail +'</td><td class="booking_rooms">'+ object.rooms +'</td><td class="booking_adults">'+ object.adults +'</td><td class="booking_children">'+ object.children +'</td><td class="text-right booking_guests">'+ object.guests +'</td></tr>'
            )
        })
        //console.log("Current cities in CA: ", cities.join(", "));
    });*/

db.collection("bookings").where("hotel", "==", "Hotel Comster Mtwapa")
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                //console.log("New city: ", change.doc.id);
                let object = change.doc.data();
                let id = change.doc.id;
                bookings.push({
                    name: object.name,
                    mail: object.mail,
                    adults: object.adults,
                    amount: object.amount,
                    checkin: object.checkin,
                    checkout: object.checkout,
                    guests: object.guests,
                    notes: object.notes,
                    rooms: object.rooms,
                    children: object.children,
                    id: id
                });
                $('#table_data').append(
                    '<tr class="tablerow" onclick="expandInfo(this)" id="'+ change.doc.id +'"><td class="booking_name">'+ object.name +'</td><td class="booking_mail">'+ object.mail +'</td><td class="booking_rooms">'+ object.rooms +'</td><td class="booking_adults">'+ object.adults +'</td><td class="booking_children">'+ object.children +'</td><td class="text-right booking_guests">'+ object.guests +'</td></tr>'
                )
            }
            if (change.type === "modified") {
                let object = change.doc.data();
                let id = change.doc.id;
                //console.log("Modified city: ", change.doc.data());
                $('#' + id).replaceWith(
                    '<tr class="tablerow" onclick="expandInfo(this)" id="'+ id +'"><td class="booking_name">'+ object.name +'</td><td class="booking_mail">'+ object.mail +'</td><td class="booking_rooms">'+ object.rooms +'</td><td class="booking_adults">'+ object.adults +'</td><td class="booking_children">'+ object.children +'</td><td class="text-right booking_guests">'+ object.guests +'</td></tr>'
                )
            }
            if (change.type === "removed") {
                let object = change.doc.data();
                let id = change.doc.id;
                console.log("Removed city: ", change.doc.id);
                $('#' + id).remove();
                //console.log("Removed city: ", change.doc.data());
            }
        });
    });

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        // ...
        console.log(user);
    } else {
        // User is signed out
        // ...
        window.location.href = 'index.html';
    }
});

$('#logout').on('click', function () {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("Sign-out successful.")
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 1000);
    }).catch((error) => {
        // An error happened.
        console.log(error);
    });
})

$('#accept-button').on('click', function () {
    console.log(this.getAttribute('data-id'));
});

function expandInfo(evt) {
    let id = evt.id;
    let booking = bookings.find(booking => booking.id === id);
    console.log(booking);
    document.getElementById('modal-title').innerText = booking.name;
    document.getElementById('name').innerText = booking.name;
    document.getElementById('mail').innerText = booking.mail;
    document.getElementById('amount').innerText = booking.amount;
    document.getElementById('adults').innerText = booking.adults;
    document.getElementById('children').innerText = booking.children;
    document.getElementById('nights').innerText = getDateDiff(booking.checkin, booking.checkout) + ' night';
    document.getElementById('guests').innerText = booking.guests;
    document.getElementById('checkin').innerText = booking.checkin;
    document.getElementById('checkout').innerText = booking.checkout;
    document.getElementById('rooms').innerText = booking.rooms;
    document.getElementById('notes').innerText = booking.notes;
    document.getElementById('accept-button').setAttribute('data-id', booking.id);

    $('#dataModal').modal('show');
}

function getDateDiff(earlier_date, later_date) {
    let Difference_In_Time = new Date(later_date).getTime() - new Date(earlier_date).getTime();
    return Difference_In_Time / (1000 * 3600 * 24);
}
