
//const serialport = require('serialport')
const {ipcRenderer} = require('electron')

let vectorSource = new ol.source.Vector();

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
            source: new ol.source.XYZ({
                attributions: ['Powered by Esri',
                               'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
                attributionsCollapsible: false,
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 23
              })
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
document.getElementById('dataList').addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);
    
// Create a new list item when clicking on the "Add" button
function newDataElement(text) {
    let li = document.createElement("li");
    li.classList.add('trackerLI')
    let t = document.createTextNode(text);
    li.appendChild(t);
    
    document.getElementById('dataList').appendChild(li)

    //let span = document.createElement("SPAN");
    //let txt = document.createTextNode("\u00D7");
    //span.className = "close";
    //span.appendChild(txt);
    //li.appendChild(span);
//
    //for (i = 0; i < close.length; i++) {
        //close[i].onclick = function() {
            //let div = this.parentElement;
            //div.style.display = "none";
        //}
    //}
}

function refreshPorts() {
    ipcRenderer.send('list-ports')
}

function setChecked(li) {
    const portsList = document.getElementById('portsList').children
    for (let i = 0; i < portsList.length; ++i) {
        portsList[i].classList.remove('checked')
    }
    li.classList.add('checked')
}

ipcRenderer.on('list-ports', (event, list) => {
    const portsList = document.getElementById('portsList')
    while(portsList.firstChild){
        portsList.removeChild(portsList.firstChild);
    }
    list.forEach(port => {
        var li = document.createElement("LI");
        li.classList.add('trackerLI')
        li.innerHTML = port.path;
        li.addEventListener('click', function() {
            ipcRenderer.send('port-selected', port)
            setChecked(li)
        })
        portsList.append(li)
    })
})

function addDataPoint(dataStr) {
    const fields = dataStr.split(',')
    console.log(fields)
    vectorSource.addFeature(new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([fields[3], fields[2]], 'EPSG:4326', 'EPSG:3857')),
    }))
    vectorSource.changed()
    newDataElement(dataStr)
}

ipcRenderer.on('new-data', function(event, data) {
    addDataPoint(data)
});