// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAjaLqoIK09KzJg774l7pamA3adaufuSHI",
    authDomain: "stayfly-bucketlist.firebaseapp.com",
    databaseURL: "https://stayfly-bucketlist.firebaseio.com",
    projectId: "stayfly-bucketlist",
    storageBucket: "stayfly-bucketlist.appspot.com",
    messagingSenderId: "196059567979"
  };
 
  firebase.initializeApp(config);

  var database = database.firebase()

  var users = database.ref('/users')


/* */
/* */
/* */
/* */
/* */
/* */
