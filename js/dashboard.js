const firebaseConfig = {
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
const db = firebase.firestore();

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
let deleted_Bookings = [];
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
                    id: id,
                    status: object.status
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
                deleted_Bookings.push({
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
                    id: id,
                    status: object.status
                });
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
        const uid = user.uid;
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
    let id = this.getAttribute('data-id');
    const statusRef = db.collection("bookings").doc(id);
    let booking = [];

    statusRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            booking.push(doc.data());
        } else {
            // doc.data() will be undefined in this case
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

// Set the "capital" field of the city 'DC'
    return statusRef.update({
        status: true
    })
        .then(() => {
            console.log("Document successfully updated!", booking);
            let booked = booking[0];
            document.getElementById('accept-button').hidden = true;
            document.getElementById('booking_status').innerText = 'Confirmed';
            $('#booking_status').css('color', 'green');

            const templateParams = {
                booking_name: booked.name,
                to_email: booked.mail,
                checkin_date: booked.checkin,
                checkout_date: booked.checkout,
                phone: booked.phone,
                email: booked.mail,
                adults: booked.adults,
                children: booked.children,
                room_type: booked.rooms,
                number_of_rooms: booked.rooms
            };

            const templateParams2 = {
                booking_name: booked.name,
                to_email: booked.mail,
                checkin_date: booked.checkin,
                checkout_date: booked.checkout,
                phone: booked.phone,
                email: booked.mail,
                adults: booked.adults,
                children: booked.children,
                room_type: booked.rooms,
                number_of_rooms: booked.rooms
            };

            emailjs.send('service_7wihh4g', 'template_i4317om', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text, booked.mail);

                    emailjs.send('service_7wihh4g', 'template_29cwh9s', templateParams2)
                        .then(function(response2) {
                            console.log('SUCCESS!', response2.status, response2.text, booked.mail);
                        }, function(error2) {
                            console.log('FAILED...', error2);
                        });
                }, function(error) {
                    console.log('FAILED...', error);
                });
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
});

function expandInfo(evt) {
    let id = evt.id;
    let bookingdata = [];
    const docRef = db.collection("bookings").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            //console.log("Document data:", doc.data());
            let booking = doc.data();
            document.getElementById('accept-button').hidden = !!booking.status;
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
            document.getElementById('unit-count').innerText = booking.roomCount;
            document.getElementById('notes').innerText = booking.notes;
            document.getElementById('phone_number').innerText = booking.phone;
            document.getElementById('accept-button').setAttribute('data-id', id);
            let status;
            if (booking.status) {
                status = 'Confirmed'
                document.getElementById('booking_status').innerText = status;
                $('#booking_status').css('color', 'green');
            }else {
                status = 'Not Confirmed'
                document.getElementById('booking_status').innerText = status;
                $('#booking_status').css('color', 'red');
            }

            $('#dataModal').modal('show');
        } else {
            // doc.data() will be undefined in this case
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    //let booking = bookings.find(booking => booking.id === id);
    //console.log(booking);
}

function getDateDiff(earlier_date, later_date) {
    let Difference_In_Time = new Date(later_date).getTime() - new Date(earlier_date).getTime();
    return Math.round(Difference_In_Time / (1000 * 3600 * 24));
}

function getOneDocument(doc, ref) {
    const docRef = db.collection(doc).doc(ref);

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            return doc.data();
        } else {
            // doc.data() will be undefined in this case
            return false;
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
        return false;
    });
}

function acceptBooking(ref) {
    const washingtonRef = db.collection("bookings").doc(ref);

// Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        status: true
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}
