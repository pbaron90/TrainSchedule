$(document).ready(function(){
  // Your web app's Firebase configuration
  var config = {
    apiKey: "AIzaSyAzEvPmGGzYkxqthbpdqMxLRQwdkG6ThBc",
    authDomain: "trainschedule-cf574.firebaseapp.com",
    databaseURL: "https://trainschedule-cf574.firebaseio.com",
    projectId: "trainschedule-cf574",
    storageBucket: "trainschedule-cf574.appspot.com",
    messagingSenderId: "36546088962",
    appId: "1:36546088962:web:003f84b7a9061ca9"
  };
  firebase.initializeApp(config);

 
  var database = firebase.database();

  
  var name;
  var destination;
  var firstTrain;
  var frequency = 0;

  $("#add-train").on("click", function() {
      event.preventDefault();
    
      name = $("#train-name").val().trim();
      destination = $("#destination").val().trim();
      firstTrain = $("#first-train").val().trim();
      frequency = $("#frequency").val().trim();

     
      database.ref().push({
          name: name,
          destination: destination,
          firstTrain: firstTrain,
          frequency: frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      $("form")[0].reset();
  });

  database.ref().on("child_added", function(childSnapshot) {
      var nextArr;
      var minAway;
      
      var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
      
      var diffTime = moment().diff(moment(firstTrainNew), "minutes");
      var remainder = diffTime % childSnapshot.val().frequency;
      
      var minAway = childSnapshot.val().frequency - remainder;
      
      var nextTrain = moment().add(minAway, "minutes");
      nextTrain = moment(nextTrain).format("hh:mm");

      $("#add-row").append("<tr><td>" + childSnapshot.val().name +
              "</td><td>" + childSnapshot.val().destination +
              "</td><td>" + childSnapshot.val().frequency +
              "</td><td>" + nextTrain + 
              "</td><td>" + minAway + "</td></tr>");

     
      }, function(errorObject) {
          console.log("Errors handled: " + errorObject.code);
  });

  database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
   
      $("#name-display").html(snapshot.val().name);
      $("#email-display").html(snapshot.val().email);
      $("#age-display").html(snapshot.val().age);
      $("#comment-display").html(snapshot.val().comment);
  });
});