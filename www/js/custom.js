//Geolocation
var lat, lon;

// App Open Counter
var appOpenCount = window.localStorage.getItem("loadCount");

// Story Progress Counter
var progressCounter = window.localStorage.getItem("alertNumber"); 

// Audio player
//
var my_media = null;
var mediaTimer = null;



document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("resume", onResume, false);




// NOTE TO SELF: REPLACE THE GELOPLOCATION HANDLER!
//$(document).live("pagecreate", function() {
//                 navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
//                 });


//Geolocaiton Handlers
//

function onGeoSuccess(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    
    
    var currentposition = new google.maps.LatLng(lat,lon);
    
    var mapoptions = {
    zoom: 12,
    center: currentposition,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    };
    
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapoptions);
    
    
    var marker = new google.maps.Marker({
                                        position: currentposition,
                                        map: map
                                        
                                        });
}

function onGeoError(error) {
    if( error == 1) {
        alert('Turn on Geolocation services.');
    }
}


//Local Storage Handler
//

function appOpenCounterHandler() {
    if (appOpenCount > 0){
        appOpenCount++;
        window.localStorage.setItem("loadCount", appOpenCount);
        localNotification(); 
    } else {
        window.localStorage.setItem("loadCount", 1);
        alert("This is first load!");
        onFirstLoad();
    }
}



// Play audio
//
function playAudio(src) {
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError);
    
    // Play audio
    my_media.play();
    
    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
                                 // get my_media position
                                 my_media.getCurrentPosition(
                                                             // success callback
                                                             function(position) {
                                                             if (position > -1) {
                                                             setAudioPosition((position) + " sec");
                                                             }
                                                             },
                                                             // error callback
                                                             function(e) {
                                                             console.log("Error getting pos=" + e);
                                                             setAudioPosition("Error: " + e);
                                                             }
                                                             );
                                 }, 1000);
    }
}

// Pause audio

function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}

// Stop audio

function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

// onSuccess Callback

function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

// Set audio position

function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}



//Custom Local Notification Handlers
//

function localNotification(){
    window.addNotification({
                           fireDate        : Math.round(new Date().getTime()/1000 + 10),
                           alertBody       : "You now have access to Etta Wheaton's Transmitter",
                           repeatInterval  : "0",
                           soundName       : "horn.caf",
                           badge           : 0,
                           notificationId  : 1,
                           callBack        : function(notificationId){
                                    showAlert();
                           }
                           });
    window.localStorage.setItem("alertNumber", 1);

}

//Custom alerts

function alertDismissed(){
    progressCounter = window.localStorage.getItem("alertNumber");
    playAudio("audio/Scene1_mixdown.wav");
}

function showAlert() {
    navigator.notification.alert(
                                 'You now have access to Etta Wheatons Transmitter',  // message
                                 alertDismissed,         // callback
                                 'Access Granted',            // title
                                 'Listen'                  // button Name
                                 );
}


//First Load Sequence
//

function onFirstLoad(){
    //placeholder - this will be the "this app is best experienced with headphones

    //Preamble - image fading handled on page itself 
    $.mobile.changePage("#Intro1");
    
       // Cut Scene .mp4 of old school msdos style login information & custom alert
    // play audio scene 1
    // Continue?
    // Breif #1
    // default to home screen
    // set first loacl notification. 
    
}


// General Population of Assets Handler
//

function assetPopulation(){
    
}


//Hander of specific Scene Logic
//

function secondScene(){
    
}

function thirdScene(){
    
}


function fourthScene(){
    
}

function fifthScene(){
    
}

function sixthScene(){
    
}

function seventhScene(){
    
}


//Ending
//

function endCredits(){
    
}




//Execution
//

function onDeviceReady() {
    appOpenCounterHandler();
}


function onResume(){
    progressCounter = window.localStorage.getItem("alertNumber");
    alert("you've recived the following number of alerts:" + progressCounter);
}







