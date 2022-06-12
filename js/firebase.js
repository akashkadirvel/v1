if (!firebase.apps.length) { //avoid re-initializing
  var firebaseConfig = {
    "apiKey": "AIzaSyD3kt82sKYtSaqUfBZxjS6YhZbwXTBHlsA",
    "authDomain": "portfolio-akashkadirvel.firebaseapp.com",
    "databaseURL": "https://portfolio-akashkadirvel.firebaseio.com",
    "projectId": "portfolio-akashkadirvel",
    "storageBucket": "portfolio-akashkadirvel.appspot.com",
    "messagingSenderId": "231713012681",
    "appId": "1:231713012681:web:fa9b75a97b850121c30618",
    "measurementId": "G-ZGPTR0N2R2"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var db = firebase.database();
  var auth = firebase.auth();
 }

function writeUserData(path = '/entries', payload = {}, callback = () => null) {
  db.ref(path).push({
    ...payload,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  }, (error) => {
    if(path == '/entries') {
      if (error) {
        alert(error.code + " : submit failed");
      } else {
        callback(payload);
      }
    }else  {
      callback(payload);
    }
  });
}

function deleteData (path = "/") {
  db.ref(path).remove()
  .then(() => {
    // readUserData(path);
  }).catch((error) => {
    console.log(error);
    alert("delete failed");
  });
  
}

function readUserData(path = "/"){
  db.ref(path).on('value',
  (snapshot) => {
    if(path == '/entries')
      renderLists(snapshot.val());
    else 
      renderVisitorsLists(snapshot.val());
  },
  (error) => {
    console.log(error);
    alert("Error occured. Check Console for Logs")
  })
}

function getCurrentUser(){
  var a = auth.currentUser;

  if(a) return true;
  else return false;
}

function login(email, password){
  auth
  .signInWithEmailAndPassword(email, password)
  .then((success) => 
  {
    window.location.href = "./entries.html";
  }, 
  (error) => {
    buttonChange("login-btn", "Login", false);
    alert(error.code + " : login failed");
  });
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "./login.html";
  }).catch((error) => {
    alert(error.code + " : logout failed");
  });
}