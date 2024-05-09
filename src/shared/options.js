
export const options = {

    find: function(type, value) {
        return options[type].find((option) => {return option.value == value})
    },

    findLabel: function(type, value) {
        return (options.find(type, value) || {}).label
    },

    findDefault: function(type) {
        if (options[type] === undefined) {
            return {
                value: undefined,
                label: undefined
            };
        }
        else {
            return options[type].find((option) => {return option.default}) || options[type][0]
        }
    },


    bool: [
        {value: "true", label: "True", default: true},
        {value: "false", label: "False"}
    ],

    RPD_datasource: [
        {value: "raw", label: "Use dataset", default: true},
        {value: "apwp", label: "Use APWP of dataset"},
    ],
    RPD_Nb: [
        {value: 20, label: "RPD_Nb", default: true},
    ],
    RPD_ref_loc_type:[
        {value: "mean_loc",    label: "Calculate mean location of input", default: true},
        {value: "one_ref_loc", label: "Set a custom single location"},
        {value: "samp_loc",    label: "Use sampling location of each individual study"},
    ],
    RPD_ref_loc_lat: [
        {value: 90, label: "RPD_ref_loc_lat", default: true},
    ],
    RPD_ref_loc_lon: [
        {value: 0,  label: "RPD_ref_loc_lon", default: true},
    ],
    RPD_ref_window: [
        {value: 10, label: "RPD_ref_window", default: true},
    ],
    RPD_ref_type: [
        {value: "gapwap",  label: "Global APWP", default: true},
        {value: "geopole", label: "North pole (0,90)"},
        {value: "custom",  label: "Custom dataset"},
        // {value: "refpole", label: "South Africa (701)"},
    ],
    RPD_Euler_poles: [
        {value: "Euler_poles_101.csv", label: "North America (101)"},
        {value: "Euler_poles_102.csv", label: "Greenland (102)"},
        {value: "Euler_poles_201.csv", label: "South America (201)"},
        {value: "Euler_poles_301.csv", label: "Eurasia (301)", default: true},
        {value: "Euler_poles_304.csv", label: "Iberia (304)", default: true},
        {value: "Euler_poles_501.csv", label: "India (501)"},
        {value: "Euler_poles_503.csv", label: "Arabia (503)"},
        {value: "Euler_poles_701.csv", label: "South Africa (701)"},
        {value: "Euler_poles_801.csv", label: "Australia (801)"},
        {value: "Euler_poles_802.csv", label: "East Antarctica (802)"},
        {value: "Euler_poles_901.csv", label: "Pacific (901)"},
    ],
    
    APWP_window_length: [
        {value: 5, label: "APWP_window_length", default: true},
    ],
    APWP_time_step: [
        {value: 1, label: "APWP_time_step", default: true},
    ],
    APWP_t_min: [
        {value: 5, label: "APWP_t_min", default: true},
    ],
    APWP_t_max: [
        {value: 25, label: "APWP_t_max", default: true},
    ],
    APWP_Nb: [
        {value: 30, label: "APWP_Nb", default: true},
    ],

    mapProjection: [
        {
            value: "ESRI:54009",
            label: "World Mollweide",

            name: "ESRI:54009",
            params: "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 units=m +no_defs",
            extent: [-18019909.21177587, -9009954.605703328, 18019909.21177587, 9009954.605703328],
            worldextent: [-180.0, -90.0, 180.0, 90.0],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3857",
            label: "WGS 84 / Pseudo-Mercator",
            default: true,

            name: "EPSG:3857",
            params: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
            extent: [-20037508.34, -20048966.1, 20037508.34, 20048966.1],
            worldextent: [-180.0, -85.06, 180.0, 85.06],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3571",
            label: "WGS 84 / North Pole LAEA Bering Sea",

            name: "EPSG:3571",
            params: "+proj=laea +lat_0=90 +lon_0=180 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
            extent: [-4839568.42, -4889334.8, 4839568.42, 4889334.8].map((n) => {return n*2}),
            worldextent: [-180.0, 45.0, 180.0, 90.0],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3572",
            label: "WGS 84 / North Pole LAEA Alaska",

            name: "EPSG:3572",
            params: "+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
            extent: [-4867195.52, -4883796.85, 4867195.52, 4883796.85].map((n) => {return n*2}),
            worldextent: [-180.0, 45.0, 180.0, 90.0],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3573",
            label: "WGS 84 / North Pole LAEA Canada",

            name: "EPSG:3573",
            params: "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
            extent: [-4859208.99, -4886873.23, 4859208.99, 4886873.23].map((n) => {return n*2}),
            worldextent: [-180.0, 45.0, 180.0, 90.0],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3574",
            label: "WGS 84 / North Pole LAEA Atlantic",

            name: "EPSG:3574",
            params: "+proj=laea +lat_0=90 +lon_0=-40 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
            extent: [-4888719.37, -4849999.19, 4888719.37, 4849999.19].map((n) => {return n*2}),
            worldextent: [-180.0, 45.0, 180.0, 90.0],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3575",
            label: "WGS 84 / North Pole LAEA Europe",

            name: "EPSG:3575",
            params: "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
            extent: [-4886873.23, -4859208.99, 4886873.23, 4859208.99].map((n) => {return n*2}),
            worldextent: [-180.0, 45.0, 180.0, 90.0],
            // basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3576",
            label: "WGS 84 / North Pole LAEA Russia",

            name: "EPSG:3576",
            params: "+proj=laea +lat_0=90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
            extent: [-4889334.8, -4839568.42, 4889334.8, 4839568.42].map((n) => {return n*2}),
            worldextent: [-180.0, 45.0, 180.0, 90.0],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3413",
            label: "WGS 84 / NSIDC Sea Ice Polar Stereographic North",

            name: "EPSG:3413",
            params: "+ proj=stere + lat_0=90 + lat_ts=70 + lon_0=-45 + x_0=0 + y_0=0 + datum=WGS84 + units=m + no_defs + type=crs",
            extent: [-3314693.24, -3314693.24, 3314693.24, 3314693.24],
            worldextent: [-180.0, 60.0, 180.0, 90.0],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
    ]

};
