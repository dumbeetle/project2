/**
 * Created by losotelo on 4/12/16.
 */
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

            //show saved locations
            showLocations();
        })
    }
}
function showLocations(){
    //go through all the locations in the locations datastore
    db.locations.each(function(location){
        new google.maps.Marker({
            position:location.position,
            map: map,
            title:location.title,
            animation:google.maps.Animation.DROP
        })
    })
}