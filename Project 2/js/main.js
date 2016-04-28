/**
 * Created by losotelo on 4/19/16.
 */


/*
M A P     S T U F F
 */

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
            }
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


$( "span img" ).click(function( event ) {
    var btnId = event.currentTarget.id;
    var sectionId = btnId + "Section";
    $('html, body').animate({
        scrollTop: currentTarget.offset().top
    }, 1000);
});




/*
S K E T C H      S T U F F
 */


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

$("#btnSave").click(function(){
    //get a reference to our canvas
    var canvas = document.getElementById("sketchpad");

    //make the object to put into our object store
    var drawingData = {
        time: Date.now(),
        pixelData: canvas.toDataURL()
    }
    //add that drawing to the datastore
    db.drawings.add(drawingData).then(listDrawings);
});

//lists all the drawings on the righthand side..
function listDrawings(){
    //give ref to HTML element that will list the drawings
    var drawingListingDiv = $("#drawingListing");

    //clear out the old content
    drawingListingDiv.html("");

    db.drawings.each(function(drawing){
        var drawingDate = new Date(drawing.time);
        drawingListingDiv.append("<li onclick='showDrawing(" + drawing.id + ")'>" + drawingDate.getMonth() +"/" + drawingDate.getDate() + " " + drawingDate.getHours() + "</li>");
    })
}
function showDrawing(id){

    db.drawings.get(id)
        .then(function(result){
            //create a new image
            var cvEl = document.createElement("img");
            //make it display our data url image
            cvEl.src = result.pixelData;

            //put that image onto the page
            $("#drawingShowcase").html(cvEl);

        })
}


