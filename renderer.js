
//create icons
var iconFeatures=[];

var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([-83.050892, 42.532880], 'EPSG:4326', 'EPSG:3857')),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
});

var iconFeature1 = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([-83.070892, 42.532880], 'EPSG:4326', 'EPSG:3857')),
    name: 'Null Island Two',
    population: 4001,
    rainfall: 501
});

iconFeatures.push(iconFeature);
iconFeatures.push(iconFeature1);

var vectorSource = new ol.source.Vector({
    features: iconFeatures //add an array of features
});

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1,
        src: 'dot-large.png'
    }))
});


var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: iconStyle
});

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
    source: new ol.source.OSM()
        }),
        vectorLayer
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-83.050892, 42.532880]),
        zoom: 16
    })
});

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

// Add a "checked" symbol when clicking on a list item
var lists = [document.getElementById('portsList'), document.getElementById('dataList')];
lists.forEach( list => {
    list.addEventListener('click', function(ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);
})

// Create a new list item when clicking on the "Add" button
function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("myInput").value;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("myUL").appendChild(li);
    }
    document.getElementById("myInput").value = "";

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
} 