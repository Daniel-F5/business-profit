import firebaseInstance from '../';
import database from 'firebase/database';

// firebaseInstance.firebase.auth().onAuthStateChanged((user) => {
//     firebaseInstance.firebase.database().ref(`users/${user.uid}/data/pkodot`)
//         .on('value', (snapshot) => {
//             alert("data has changed")
//         })
// });

function read(options) {
    return firebaseInstance.firebase.database().ref(`users/${window.user.uid}/${options.entity}`).once('value')
        .then(res => {
            return res.val();
        })
}

function create(options) {
    return firebaseInstance.firebase.database().ref(`users/${window.user.uid}/${options.entity}`).set(options.pkoda)
}

function remove(options) {
    return firebaseInstance.firebase.database().ref(`users/${window.user.uid}/${options.entity}`).remove();
}

function update(options) {
    return firebaseInstance.firebase.database().ref(`users/${window.user.uid}/${options.entity}`).update(options.pkoda)
}


export default {
    read,
    create,
    remove,
    update
}