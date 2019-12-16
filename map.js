
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