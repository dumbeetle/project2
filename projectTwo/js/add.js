init();

var map,marker,userLocation,db, sketchController;
var drawingColor = "#000";
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
/*
S K E T C H   S T U F F S
 */
//call the function straightaway

function init() {
    //make it so we can draw on the sketchpad canvas
    sketchController = $("#sketchpad").sketch().data('sketch');
    //add event listeners to drawing tools
    $("#colorpicker").on("input", setDrawingColor);
    $("#sizepicker").on("input",setDrawingSize);
}
//drawing tool event handlers
function setDrawingColor(event){
    sketchController.color = this.value;
}
function setDrawingSize(event){
    sketchController.size = this.value;
}
//lists all the drawings on the righthand side..
function listDrawings(){
    //give ref to HTML element that will list the drawings
    var drawingListingDiv = $("#drawingListing");
    //clear out the old content
    drawingListingDiv.html("");
    db.locations.each(function(drawing){
        var drawingDate = new Date(drawing.time);
        drawingListingDiv.append("<li onclick='showDrawing(" + drawing.id + ")'>" + drawingDate.getMonth() +"/" + drawingDate.getDate() + " " + drawingDate.getHours() + "</li>");
    })
}
function showDrawing(id){

    db.locations.get(id)
        .then(function(result){
            //create a new image
            var cvEl = document.createElement("img");
            //make it display our data url image
            cvEl.src = result.pixelData;
            //put that image onto the page
            $("#drawingShowcase").html(cvEl);

        })
}
//when the save data button is clicked
$("#savePosition").click(function(){
    //get a reference to our canvas
    var canvas = document.getElementById("sketchpad");
    //create an object and save it into our locations object store
    var memoryData = {
        title: $("#txtMemoryName").val(),
        position: {lat: marker.position.lat(),lng: marker.position.lng()},
        time: Date.now(),
        pixelData: canvas.toDataURL()
    };
    db.locations.add(memoryData).then(listDrawings);
    //redirect back to main page
    window.location.assign("index.html");
});
listDrawings();