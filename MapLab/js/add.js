
var map,marker,userLocation,db;

db=new Dexie("LocationsDB");
db.version(1).stores({locations: "++id,position"});
db.open();




function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
    //can I geolocate
    if(navigator.geolocation){
        //if i can geolocate..

        navigator.geolocation.getCurrentPosition(function(position){
            //store the location of this user...
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            //center on the user's location
            map.setCenter(userLocation);

            //place a marker that the user can add
            placeNewMarker();
        })
    }
}

function placeNewMarker(){
    marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Click to position choice',
        draggable:true,
        animation:google.maps.Animation.DROP
    })
}



//when the save data button is clicked
$("#savePosition").click(function(){

    //create an object and save it into our locations object store

    var memoryData = {
        title: $("#txtMemoryName").val(),
        position: {lat: marker.position.lat(),lng: marker.position.lng()}
    };
    db.locations.add(memoryData);

    //redirect back to main page


});
