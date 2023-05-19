import { m, helpers, options, config } from '../../shared/stdimports.js';

import "./polarmap.less";

import 'ol/ol.css';
import * as ol from 'ol';

import View from 'ol/View';
import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {transform} from 'ol/proj.js';


import Graticule from 'ol/layer/Graticule';

import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import XYZ from 'ol/source/XYZ.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';

import {Circle as CircleStyle, Text, Fill, Stroke, Style} from 'ol/style.js';

import Overlay from 'ol/Overlay';
import {Point} from 'ol/geom.js';

import {circular} from 'ol/geom/Polygon.js';
import LineString from 'ol/geom/LineString.js';
import Feature from 'ol/Feature.js';

import {Attribution, defaults as defaultControls} from 'ol/control.js';


import {comp as Positionaldialog} from '../../shared/components/positionaldialog.js';


export const comp = {

    oninit: function (vnode) {
        vnode.state.id = helpers.general.uuid();

        vnode.state.prevPath = vnode.attrs.path;
        vnode.state.prevPoles = vnode.attrs.poles;
        vnode.state.mapboundsfitted = false;

        vnode.state.isOpen = {
            export: false
        }
    },

    oncreate: function (vnode) {
        initMap(vnode);
        updateLocations(vnode);
    },

    view: function (vnode) {
        //if the projection changed, reset the map
        if (vnode.attrs.projection !== undefined && vnode.state.projection !== undefined && vnode.attrs.projection.name !== vnode.state.projection.name) {
            initMap(vnode);
        }
        updateLocations(vnode);

        return (
            <div class="comp polarmap">
                <div id={vnode.state.id} style={(vnode.attrs.width ? `width: ${vnode.attrs.width}; ` : "") + (vnode.attrs.height ? ` height: ${vnode.attrs.height}; ` : "")}/>
                <If condition={vnode.attrs.controls !== false}>
                    <button class='btn_icon export_button' onclick={() => { vnode.state.isOpen.export = true }}>
                        <i class="fa-solid fa-bars"></i>
                    </button>

                    <Positionaldialog fillcontainer={true} isOpen={vnode.state.isOpen.export} onClose={() => { vnode.state.isOpen.export = false }}>
                        <div class='menu'>
                            <a onclick={() => { ExportXLSX(vnode); vnode.state.isOpen.export = false }} href='javascript:'>
                                <i class="fa-solid fa-download fa-fw"></i> Download XLSX
                            </a>
                            <a onclick={() => { exportToPNG(vnode); vnode.state.isOpen.export = false }} href='javascript:'>
                                <i class="fa-solid fa-download fa-fw"></i> Download PNG
                            </a>
                        </div>
                    </Positionaldialog>
                </If>
            </div>
        )
    }
}


function initMap(vnode) {
    document.getElementById(vnode.state.id).innerHTML = "";

    const olProjection = setupProjection(vnode);
    vnode.state.maplayers = {
        layer_basemap: setupBaseMap(vnode),
        layer_A95: setupA95Layer(vnode),
        layer_path: setupPathLayer(vnode),
        layer_pathlabels: setupPathLabelsLayer(vnode),
        layer_graticule:  setupGraticule(vnode),
    }

    const map = new ol.Map({
        layers: [
            vnode.state.maplayers.layer_basemap,
            vnode.state.maplayers.layer_A95,
            vnode.state.maplayers.layer_path,
            vnode.state.maplayers.layer_pathlabels,
            vnode.state.maplayers.layer_graticule
        ],
        target: vnode.state.id,
        controls: vnode.attrs.controls === true ? defaultControls({attribution: false}).extend([new Attribution({collapsible: false})]) : [new Attribution({collapsible: true})],
        view: new View({
            projection: olProjection,
            extent: vnode.state.projection.extent,

            center: [0,0],
            zoom: 1.5,
            enableRotation: false
        })
    });

    vnode.state.map = map;
    setupEvents(vnode);
}


function setupProjection(vnode) {
    vnode.state.projection = vnode.attrs.projection || options.findDefault("mapProjection");

    proj4.defs(vnode.state.projection.name, vnode.state.projection.params);
    register(proj4);

    const proj = new Projection({
        code: vnode.state.projection.name,
        extent: vnode.state.projection.extent,
        worldExtent: vnode.state.projection.worldextent,
    });

    return proj;
}

function setupBaseMap(vnode) {
    return new TileLayer({
        source: new XYZ({
            crossOrigin: 'anonymous',
            url: vnode.state.projection.basemapsrc,
            projection: vnode.state.projection.name,
            attributions: vnode.state.projection.attributions
        })
    })
}

function setupA95Layer(vnode) {
    const style_A95 = new Style({
      fill: new Fill({
        color: '#0652DD44',
      })
    });

    return new VectorLayer({
        id: "layer_A95",
        source: new VectorSource({
            projection: vnode.state.projection.name,
        }),
        extent: vnode.state.projection.extent,

        style: style_A95,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
    })
}

function setupPathLayer(vnode) {
    const style_path = new Style({
        stroke: new Stroke({
            color: '#000000',
            width: 1
        }),
        image: new CircleStyle({
            radius: 3,
            stroke: new Stroke({
                color: '#000000',
                width: 2,
            }),
            fill: new Fill({
                color: '#FFF',
            }),
        })
    })

    return new VectorLayer({
        id: "layer_path",
        source: new VectorSource({
            projection: vnode.state.projection.name,
        }),
        extent: vnode.state.projection.extent,

        style: style_path,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
    })
}

function setupPathLabelsLayer(vnode) {
    const style_label = new Style({
        text: new Text({
            textAlign: 'middle',
            font: '"Poppins"',
            text: "",
            fill: new Fill({color: "#000"}),
            stroke: new Stroke({color: "#fff", width: 3}),
            offsetX: 0,
            offsetY: 12
        })
    })

    return new VectorLayer({
        id: "layer_pathlabels",
        source: new VectorSource({
            projection: vnode.state.projection.name,
        }),
        extent: vnode.state.projection.extent,

        declutter: true,
        style: function(feature, a, b, c, d) {
            //If present, add the label of the feature,
            style_label.getText().setText(feature.get('label'));
            style_label.setZIndex(feature.get('zIndex'));
            return [style_label];
        },
        updateWhileAnimating: true,
        updateWhileInteracting: true,
    })
}

function setupGraticule(vnode) {
    return new Graticule({
        showLabels: true, //show lat long labels
        lonLabelFormatter: (lon) => {
            return ""; //remove longitude labels
        },
        strokeStyle: new Stroke({
            color: 'rgba(0, 0, 0, 0.2)'
        }),
        intervals: [30, 10, 5],
        extent: vnode.state.projection.extent
    })
}

function setupEvents(vnode) {
    new ResizeObserver(onMapResize).observe(vnode.state.map.getViewport())
    function onMapResize() {
        vnode.state.map.updateSize();
    }
}

function updateLocations(vnode) {
    //if the map is not yet inited, skip
    if (vnode.state.map === undefined) return;

    clearLocations(vnode);
    if (vnode.attrs.path) {
        drawLocations(vnode.attrs.path, true, vnode);
    }
    if (vnode.attrs.poles) {
        drawLocations(vnode.attrs.poles, false, vnode);
    }

    fitBoundsIfNeeded(vnode);
}

function clearLocations(vnode) {
    vnode.state.maplayers.layer_A95.getSource().clear();
    vnode.state.maplayers.layer_path.getSource().clear();
    vnode.state.maplayers.layer_pathlabels.getSource().clear();
}

function drawLocations(locations, isPath, vnode) {
    let prevCoord;

    locations.forEach((location, i, allLocations) => {
        const longitude = location.slon ?? location.plon;
        const latitude = location.slat ?? location.plat;
        const uncertainty = location.B95 ?? (location.A95 ?? location.P95);
        const label = parseFloat(location.age.toFixed(2)).toString() + "Ma";

        if (isNaN(longitude) || isNaN(latitude)) {
            return;
        }

        const coord = new Point(
            [longitude, latitude]
        ).transform('EPSG:4326', vnode.state.projection.name).getFirstCoordinate();

        //Set A95 circle
        if (isPath) {
            const circle = circular(
              transform(coord, vnode.state.projection.name, 'EPSG:4326'),
              uncertainty * 111_139, //1 degree is 111,139 meteres
              128
            );
            circle.transform('EPSG:4326', vnode.state.projection.name);
            const feature_A95 = new Feature({geometry: circle});
            vnode.state.maplayers.layer_A95.getSource().addFeature(feature_A95);
        }


        //Set path from prevCoord to coord
        if (isPath && prevCoord !== undefined) {
            let feature_path = new Feature({geometry: new LineString([prevCoord, coord])});
            vnode.state.maplayers.layer_path.getSource().addFeature(feature_path);
        }

        //Set a dot per location
        let feature_dot = new Feature({geometry: new Point(coord)});
        vnode.state.maplayers.layer_path.getSource().addFeature(feature_dot);

        //add the age label
        let zIndex = i === 0 || i === allLocations.length - 1 ? 1 : 0; //Always show the first and last location on top
        let feature_label = new Feature({geometry: new Point(coord), label: label, zIndex: zIndex});
        vnode.state.maplayers.layer_pathlabels.getSource().addFeature(feature_label);

        //Keep record of the previous coordinate to draw the next path
        prevCoord = coord;
    })
}

function fitBoundsIfNeeded(vnode) {
    const mapelementschanged = vnode.state.prevPath !== vnode.attrs.path || vnode.state.prevPoles !== vnode.attrs.poles;
    const mapelementcount = (vnode.attrs.poles?.length ?? 0) + (vnode.attrs.path?.length ?? 0);

    //if the path or poles changed, fit the mapbounds
    if (mapelementschanged) {
        vnode.state.prevPath = vnode.attrs.path;
        vnode.state.prevPoles = vnode.attrs.poles;
        vnode.state.mapboundsfitted = false;
    }

    //if there is noting to fit on, do not fit now.
    if (mapelementcount === 0) {
        return;
    }

    //if not already fitted, fit the mapbounds
    if (vnode.state.mapboundsfitted === false) {
        vnode.state.map.getView().fit(vnode.state.maplayers.layer_path.getSource().getExtent(), {padding: [30, 30, 30, 30], maxZoom: 8});
        vnode.state.mapboundsfitted = true;
    }
}

function exportToPNG(vnode) {
    const resizeFactor = 3;
    const map = vnode.state.map;

    map.once('rendercomplete', function () {
        const mapCanvas = document.createElement('canvas');
        mapCanvas.crossOrigin = "Anonymous";
        const size = map.getSize();
        mapCanvas.width = size[0]*resizeFactor;
        mapCanvas.height = size[1]*resizeFactor;
        const mapContext = mapCanvas.getContext('2d');


        Array.prototype.forEach.call(
            map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
            function (canvas) {
                if (canvas.width > 0) {
                    const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
                    mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                    let matrix;
                    const transform = canvas.style.transform;
                    if (transform) {
                        // Get the transform parameters from the style's transform matrix
                        matrix = transform
                            .match(/^matrix\(([^\(]*)\)$/)[1]
                            .split(',')
                            .map(Number);
                    } else {
                        matrix = [
                            parseFloat(canvas.style.width) / canvas.width, 0,  0,
                            parseFloat(canvas.style.height) / canvas.height, 0, 0,
                        ];
                    }
                    // Apply the transform to the export map context
                    CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
                    const backgroundColor = canvas.parentNode.style.backgroundColor;
                    if (backgroundColor) {
                        mapContext.fillStyle = "blue";
                        mapContext.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    mapContext.drawImage(canvas, 0, 0, canvas.width*resizeFactor, canvas.height*resizeFactor);
                }
            }
        );

        mapContext.globalAlpha = 1;
        mapContext.setTransform(1, 0, 0, 1, 0, 0);
        const link = document.createElement("a");
        link.href = mapCanvas.toDataURL();
        link.download = `${vnode.attrs.exportName ?? "Map"} APWP-online.org.png`;
        link.click();
    });
    map.renderSync();
}


function ExportXLSX(vnode) {
    if (vnode.attrs.path) {
        let title = "Path of " + vnode.attrs.exportName;

        let fields = [
            { label: "age", value: "age" },
            { label: "min_age", value: "min_age" },
            { label: "max_age", value: "max_age" },
            { label: "center_age", value: "center_age" },
            { label: "plat", value: "plat" },
            { label: "plon", value: "plon" },
            { label: "P95", value: "P95" },
            { label: "N", value: "N" },
            { label: "elong", value: "elong" },
            { label: "mean_E", value: "mean_E" },
            { label: "mean_K", value: "mean_K" },
            { label: "mean_csd", value: "mean_csd" }
        ];

        helpers.general.downloadXlsx(fields, vnode.attrs.path, title);
        return;
    }
    else if (vnode.attrs.poles) {
        let title = "Poles of " + vnode.attrs.exportName;

        let fields = [
            { label: "name", value: "name" },
            { label: "age", value: "age" },
            { label: "min_age", value: "min_age" },
            { label: "max_age", value: "max_age" },
            { label: "A95", value: "A95" },
            { label: "K", value: "K" },
            { label: "lithology", value: "lithology" },
            { label: "f", value: "f" },
            { label: "mdec", value: "mdec" },
            { label: "minc", value: "minc" },
            { label: "p_std", value: "p_std" },
            { label: "plat", value: "plat" },
            { label: "plon", value: "plon" },
            { label: "slat", value: "slat" },
            { label: "slon", value: "slon" },
            { label: "plateID", value: "plateID" },
        ];

        helpers.general.downloadXlsx(fields, vnode.attrs.poles, title);
        return;
    }
    else {
        alert("Error, input data is not correct. Please contact info@apwp-online.org")
    }
   
}


