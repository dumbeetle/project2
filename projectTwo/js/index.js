/**
 * Created by losotelo on 4/12/16.
 */
var map,marker,userLocation,db;
db=new Dexie("DrawingLocationsDB");
db.version(1).stores({locations: "++id,position,time"});
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
    $("#vision").html("<h3>Past Vision</h3><br>");
    //go through all the locations in the locations datastore
    db.locations.reverse().limit(5)
        .each(function(location){
        var ids = location.id;
        var stringId=  ids.toString();
        var stringLocationDraw = "<br><button onclick='locationDraw("+ids +")'>"+ location.title + "</button>";

        var marker = new google.maps.Marker({
            position:location.position,
            map: map,
            title:location.title,
            animation:google.maps.Animation.DROP
        });
        marker.addListener('click',function(){
            var drawingTitle = $("#titles");
            drawingTitle.html("<br><br><br><h3>Titles</h3>");
            $("#addTitle").html(stringLocationDraw);
        })
        })
}

function locationDraw(id){
    db.locations.get(id)
        .then(function(result){
            //create a new image
            var cvEl = document.createElement("img");
            //make it display our data url image
            cvEl.src = result.pixelData;
            $("#drawings").html("<br><h3>Drawings</h3><br>")
            //put that image onto the page
            $("#drawingShowcase").html(cvEl);

        })
}
function listDrawings(){
    //give ref to HTML element that will list the drawings
    var drawingListingDiv = $("#drawingListing");
    //clear out the old content
    drawingListingDiv.html("");
    db.locations.reverse().limit(5)
        .each(function(drawing){
        var drawingDate = new Date(drawing.time);
        drawingListingDiv.append("<button onclick='showDrawing(" + drawing.id + ")'>" + drawingDate.getMonth() +"/" + drawingDate.getDate() + " " + drawingDate.getHours() + "</button>");
    })
}
function showDrawing(id){

    db.locations.get(id)
        .then(function(result){
            //create a new image
            var cvEl = document.createElement("img");
            //make it display our data url image
            cvEl.src = result.pixelData;
            $("#drawings").html("<br><h3>Drawings</h3><br>")
            //put that image onto the page
            $("#drawingShowcase").html(cvEl);

        })
}
//function changeTime(timer){
//
//    db.locations.where("time").between(Date.now()-(timer*60*1000),Date.now()).each(function(location){
//        //give ref to HTML element that will list the drawings
//        var drawingListingDiv = $("#drawingListing");
//        //clear out the old content
//        drawingListingDiv.html("");
//        var drawingDate = new Date(location.time);
//        drawingListingDiv.append("<button onclick='showDrawing(" + location.id + ")'>" + drawingDate.getMonth() +"/" + drawingDate.getDate() + " " + drawingDate.getHours() + "</button>");
//        //window.location.assign("index.html");
//    })
//};
listDrawings();
