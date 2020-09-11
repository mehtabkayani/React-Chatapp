import firebase from 'firebase';

let firebaseConfig = {
  apiKey: "AIzaSyBOZdve4AVCUbMu1igkoDEZ23i9PGM1Jbk",
  authDomain: "react-firebase-a2c20.firebaseapp.com",
  databaseURL: "https://react-firebase-a2c20.firebaseio.com",
  projectId: "react-firebase-a2c20",
  storageBucket: "react-firebase-a2c20.appspot.com",
  messagingSenderId: "806375168296",
  appId: "1:806375168296:web:cb843c1e0b15104478981d"
}; 

  const fire = firebase.initializeApp(firebaseConfig);

  export default fire;