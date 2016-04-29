/**
 * Created by losotelo on 4/12/16.
 */
var db, sketchController;
var drawingColor = "#000";
//call the function straightaway
init();
db = new Dexie("paintings");
db.version(1).stores({drawings: "++id,time"});
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
    };
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