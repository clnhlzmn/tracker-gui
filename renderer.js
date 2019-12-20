
//const serialport = require('serialport')
const {ipcRenderer} = require('electron')

const fs = require("fs");

let vectorSource = new ol.source.Vector();

let vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

let map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.BingMaps({
                key: fs.readFileSync('bingmaps.key'),
                imagerySet: 'AerialWithLabelsOnDemand',
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
    let checkedPort = undefined
    while(portsList.firstChild){
        if (portsList.firstChild.nodeName == "LI" && portsList.firstChild.classList.contains('checked'))
            checkedPort = portsList.firstChild
        portsList.removeChild(portsList.firstChild);
    }
    console.log('checked port ' + checkedPort)
    list.forEach(port => {
        var li = document.createElement("LI");
        li.classList.add('trackerLI')
        li.innerHTML = port.path;
        if (checkedPort !== undefined && checkedPort.innerHTML == port.path)
            li.classList.add('checked')
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
    const date = fields[0]
    const time = ('00' + fields[1]).slice(-8)
    const lat = fields[2]
    const lng = fields[3]
    if (fields.length == 5) {
        vectorSource.addFeature(new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
        }))
        vectorSource.changed()
        newDataElement(dataStr)
    }
}

ipcRenderer.on('new-data', function(event, data) {
    addDataPoint(data)
});