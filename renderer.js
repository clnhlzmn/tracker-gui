
const serialport = require('serialport')

//create icons
let iconFeatures=[];

let iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([-83.050892, 42.532880], 'EPSG:4326', 'EPSG:3857')),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
});

let iconFeature1 = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([-83.070892, 42.532880], 'EPSG:4326', 'EPSG:3857')),
    name: 'Null Island Two',
    population: 4001,
    rainfall: 501
});

iconFeatures.push(iconFeature);
iconFeatures.push(iconFeature1);

let vectorSource = new ol.source.Vector({
    features: iconFeatures //add an array of features
});

let iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1,
        src: 'dot-large.png'
    }))
});


let vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: iconStyle
});

let map = new ol.Map({
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
let myNodelist = document.getElementsByTagName("LI");
for (let i = 0; i < myNodelist.length; i++) {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
let close = document.getElementsByClassName("close");
for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        let div = this.parentElement;
        div.style.display = "none";
    }
}

// Add a "checked" symbol when clicking on a list item
let lists = [document.getElementById('portsList'), document.getElementById('dataList')];
lists.forEach( list => {
    list.addEventListener('click', function(ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);
})

// Create a new list item when clicking on the "Add" button
function newElement() {
    let li = document.createElement("li");
    let inputValue = document.getElementById("myInput").value;
    let t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("myUL").appendChild(li);
    }
    document.getElementById("myInput").value = "";

    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            let div = this.parentElement;
            div.style.display = "none";
        }
    }
}

function refreshPorts() {
    const portsList = document.getElementById('portsList')
    while(portsList.firstChild){
        portsList.removeChild(portsList.firstChild);
    }
    serialport.list().then(ports => {
        ports.forEach(port => {
            var li = document.createElement("LI");
            li.innerHTML = port.path;
            portsList.append(li)
        })
    })
}