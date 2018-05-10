// Initialize Firebase
var config = {
	apiKey: "AIzaSyDRxg8vjc7DYr0oad51DvHikFedkUGPMeY",
	authDomain: "looking-for-group-26a4c.firebaseapp.com",
	databaseURL: "https://looking-for-group-26a4c.firebaseio.com",
	projectId: "looking-for-group-26a4c",
	storageBucket: "looking-for-group-26a4c.appspot.com",
	messagingSenderId: "650436913318"
};

firebase.initializeApp(config);
var googleProvider = new firebase.auth.GoogleAuthProvider();
var facebookProvider = new firebase.auth.FacebookAuthProvider();

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);
