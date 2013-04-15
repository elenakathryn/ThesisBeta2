//Geolocation
var lat, lon;

// App Open Counter
var appOpenCount = window.localStorage.getItem("loadCount");

// Story Progress Counter
var progressCounter = window.localStorage.getItem("alertNumber"); 
var alertNumber; 

// Audio player
//
var my_media = null;
var mediaTimer = null;

var page; 




document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("resume", onResume, false);


//first load swipe handlers 
$( document ).on( "pageinit", "[data-role='page'].demo-page", function() {
                 
                 
                page = "#" + $( this ).attr( "id" ),
                 // Get the filename of the next page that we stored in the data-next attribute
                 next = $( this ).jqmData( "next" ),
                 // Get the filename of the previous page that we stored in the data-prev attribute
                 prev = $( this ).jqmData( "prev" );
                 
                 // Check if we did set the data-next attribute
                 if ( next ) {
                 // Prefetch the next page
                 $.mobile.loadPage( next + ".html" );
                 // Navigate to next page on swipe left
                 $( document ).on( "swipeleft", page, function() {
                                  $.mobile.changePage("#" + next);
                                  });
                 // Navigate to next page when the "next" button is clicked
                 $( ".control .next", page ).on( "click", function() {
                                                $.mobile.changePage( "#" + next );
                                                });
                 }
                 // Disable the "next" button if there is no next page
                 else {
                 $( ".control .next", page ).addClass( "ui-disabled" );
                 }
                 // The same for the previous page (we set data-dom-cache="true" so there is no need to prefetch)
                 if ( prev ) {
                 $( document ).on( "swiperight", page, function() {
                                  $.mobile.changePage( "#" + prev, { reverse: true } );
                                  });
                 $( ".control .prev", page ).on( "click", function() {
                                                $.mobile.changePage( "#" + prev, { reverse: true } );
                                                });
                 }
                 else {
                 $( ".control .prev", page ).addClass( "ui-disabled" );
                 }
                 
                 if (page == "#Intro5"){
                    window.setTimeout('playVideo()', 6000);
                 }
                 
                 });


// NOTE TO SELF: REPLACE THE GELOPLOCATION HANDLER!
//$(document).live("pagecreate", function() {
  //               navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
    //             });


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
    } else {
        window.localStorage.setItem("loadCount", 1);
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




//Content Population

function firstAlertDismissed(){
    
    progressCounter = window.localStorage.getItem("alertNumber");
    $.mobile.changePage("#audio"); 
    playAudio("audio/Scene"+progressCounter+"_mixdown.wav");
    
    var currentPos = my_media.getCurrentPosition();
    var mediaLength = my_media.getDuration();
    
    if (currentPos >= mediaLength){
        $.mobile.changePage("#briefs");
        loadContent1(); 
    }

    
}

function showFirstAlert() {
    navigator.notification.alert(
                                 'You now have access to Etta Wheatons Transmitter',  // message
                                 firstAlertDismissed,         // callback
                                 'Access Granted',            // title
                                 'Listen'                  // button Name
                                 );
}

function alertDismissed(){
    
    progressCounter = window.localStorage.getItem("alertNumber");
    $.mobile.changePage("#audio");
    playAudio("audio/Scene"+progressCounter+"_mixdown.wav");
    
}

function showAlert() {
    navigator.notification.alert(
                                 'You now have access to Etta Wheatons Transmitter',  // message
                                 alertDismissed,         // callback
                                 'Access Granted',            // title
                                 'Listen'                  // button Name
                                 );
}



function loadContent1(){
    progressCounter = window.localStorage.getItem("alertNumber");
    document.getElementById('textMessage1').style.display = 'block';
    document.getElementById('brief1').style.display = 'block';

}

//Custom Local Notification Handlers
//

function firstLocalNotification(){
    window.addNotification({
                           fireDate        : Math.round(new Date().getTime()/1000 + 13),
                           alertBody       : "You now have access to Etta Wheaton's Transmitter",
                           repeatInterval  : "0",
                           soundName       : "horn.caf",
                           badge           : 0,
                           notificationId  : 1,
                           callBack        : function(notificationId){
                                    showFirstAlert();
                           }
                           });
    alertNumber= 1;
    window.localStorage.setItem("alertNumber", alertNumber);
    loadContent1();

}

function secondLocalNotification(){
    window.addNotification({
                           fireDate        : Math.round(new Date().getTime()/1000 + 60),
                           alertBody       : "You now have access to Etta Wheaton's Transmitter",
                           repeatInterval  : "0",
                           soundName       : "horn.caf",
                           badge           : 0,
                           notificationId  : 2,
                           callBack        : function(notificationId){
                                    showAlert(); 
                           }
                           });
    alertNumber = 2;
    window.localStorage.setItem("alertNumber", alertNumber);

}




//First Load Sequence
//

function onFirstLoad(){
    //placeholder - this will be the "this app is best experienced with headphones

    //Preamble - image fading handled on page itself 
    $.mobile.changePage("#Intro1");
    alertNumber = 0;
}



function playVideo(){
    $.mobile.changePage("#breakVid");
    firstLocalNotification(); 
    var video = document.getElementById("video");
    video.addEventListener('ended', function() {
                           $.mobile.changePage("#home");
                           });
}



//Ending
//

function endCredits(){
    
}




//Execution
//

function onDeviceReady() {
    appOpenCounterHandler();
    
    progressCounter = window.localStorage.getItem("alertNumber");
    if (progressCounter > 0){
        loadContent1();
    }
    
}


function onResume(){
    progressCounter = window.localStorage.getItem("alertNumber");
    alert("you've recived the following number of alerts:" + progressCounter);
}







