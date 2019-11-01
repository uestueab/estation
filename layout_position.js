var x = document.getElementById("pos");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}

function myFunction() {
  var a = document.getElementById("art").value;
  if (a == 'gas') {
    var b = document.getElementById("myTableGas").innerHTML;
    document.getElementById("demo").innerHTML = b;
  }
  else if (a == 'benzin') {
    var b = document.getElementById("myTableBenzin").innerHTML;
    document.getElementById("demo").innerHTML = b;
  }
  else if (a =='ele') {
    var b = document.getElementById("myTableElek").innerHTML;
    document.getElementById("demo").innerHTML =b;
  }
  else {
    var b = 'Bitte Kraftstofart wählen';
    document.getElementById("demo").innerHTML = b;
  }
}

//var erdradius = 6371000;

//Berechnung der Entfernung zwischen 2 Koordinaten
//Luftlinie
/* function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
var R = 6371; //Radius of the earth in km
var dLat = deg2rad(lat2-lat1);  //deg2rad below
var dLon = deg2rad(lon2-lon1); 
var a = 
Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
Math.sin(dLon/2) * Math.sin(dLon/2)
; 
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
var d = R * c; //Distance in km
return d;
}

function deg2rad(deg) {
return deg * (Math.PI/180)
} */