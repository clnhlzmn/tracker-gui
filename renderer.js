
//const serialport = require('serialport')
const {ipcRenderer} = require('electron')

const fs = require("fs");

const vectorSource = new ol.source.Vector();

const mapView = new ol.View({
    center: ol.proj.fromLonLat([-83.050892, 42.532880]),
    zoom: 16
})

let map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.BingMaps({
                key: fs.readFileSync('bingmaps.key'),
                imagerySet: 'AerialWithLabelsOnDemand',
              })
        }),
        new ol.layer.Vector({
            source: vectorSource
        })
    ],
    view: mapView
});
    
// Create a new list item when clicking on the "Add" button
function newDataElement(text) {
    let li = document.createElement("li");
    li.classList.add('trackerLI')
    let t = document.createTextNode(text);
    li.appendChild(t);
    document.getElementById('dataList').appendChild(li)
}

function addDataPoint(dataStr) {
    const fields = dataStr.split(',')
    console.log(fields)
    const id = fields[0]
    const date = fields[1]
    const time = ('00' + fields[2]).slice(-8)
    const lat = fields[3]
    const lng = fields[4]
    const hdop = fields[5]
    if (fields.length == 6) {
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