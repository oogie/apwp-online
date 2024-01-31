import { m, helpers } from '../../../shared/stdimports.js';

import "./dispgraph.less";

import Highcharts from 'highcharts';
import { comp as Positionaldialog } from '../../../shared/components/positionaldialog.js';



export const comp = {

    oninit: function (vnode) {
        vnode.state.isOpen = {
            export: false
        }

        vnode.state.refLocRender = undefined;
    },

    oncreate: function (vnode) {
        initGraph(vnode);
        updateSeries(vnode);
    },

    view: function (vnode) {
        updateSeries(vnode);

        return (
            <div class='comp dispgraph'>
                <div id='graphWrapper'>
                    <div id='dispgraphContent'>Loading graph..</div>
                </div>
                <button class='btn_icon export_button' onclick={() => {vnode.state.isOpen.export = true}}>
                    <i class="fa-solid fa-bars"></i>
                </button>

                <Positionaldialog fillcontainer={true} isOpen={vnode.state.isOpen.export} onClose={() => {vnode.state.isOpen.export = false}}>
                    <div class='menu'>
                        <a onclick={() => {vnode.state.graph.fullscreen.open(); vnode.state.isOpen.export = false}} href='javascript:'>
                            <i class="fa-solid fa-arrows-maximize fa-fw"></i> Show fullscreen
                        </a>
                        <div class='spacer' />
                        <a onclick={() => {ExportXLSX(vnode); vnode.state.isOpen.export = false }} href='javascript:'>
                            <i class="fa-solid fa-download fa-fw"></i> Download XLSX
                        </a>
                        <a onclick={() => { vnode.state.graph.exportChartLocal({ type: 'application/pdf', filename: 'Paleolatitude difference APWP-online.org' }); vnode.state.isOpen.export = false }} href='javascript:'>
                            <i class="fa-solid fa-download fa-fw"></i> Download PDF
                        </a>
                        
                        <div class='spacer' />
                        <a onclick={() => {vnode.state.graph.exportChartLocal({type: 'image/png', filename: 'Paleolatitude difference APWP-online.org'}); vnode.state.isOpen.export = false}} href='javascript:'>
                            <i class="fa-solid fa-download fa-fw"></i> Download PNG
                        </a>
                        <a onclick={() => {vnode.state.graph.exportChartLocal({type: 'image/jpeg', filename: 'Paleolatitude difference APWP-online.org'}); vnode.state.isOpen.export = false}} href='javascript:'>
                            <i class="fa-solid fa-download fa-fw"></i> Download JPG
                        </a>
                        <a onclick={() => {vnode.state.graph.exportChartLocal({type: 'image/svg+xml', filename: 'Paleolatitude difference APWP-online.org'}); vnode.state.isOpen.export = false}} href='javascript:'>
                            <i class="fa-solid fa-download fa-fw"></i> Download SVG
                        </a>
                    </div>
                </Positionaldialog>
            </div>
        )
    }

}


function initGraph(vnode) {
    const graph = Highcharts.chart('dispgraphContent', {
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false
                }
            },
            fallbackToExportServer: false,
            url: "",
        },

        chart: {
            type: 'scatter',
            zoomType: 'xy',
            animation: false,
            style: {
                fontFamily: 'Poppins'
            },
        },
        title: {
            text: 'Paleolatitude difference',
            style: {
                fontSize: '1rem',
                fontWeight: "400"
            },
        },
        legend: { enabled: false },
        tooltip: {
            shared: false,
            useHTML: true,

            formatter: function() {
                let context = this.point.options.context;

                if (context === undefined)
                    return false;

                return `
                    <div>
                        <div style='color:${this.color};'><b>${context.name}</b></div>
                        <div>Age: <b>${context.age.toFixed(1)} Ma</b> &pm; <small>${(context.age - context.min_age).toFixed(1)} Ma</small></div>
                        <div>Diff: <b>${context.L.toFixed(1)}°</b> &pm; <small>${context.delta_L.toFixed(1)}°</small></div>
                    </div>
                `
            }
        },
        xAxis: {
            title: {
                text: "Age (Ma)"
            },
            reversed: true,
            endOnTick: true,
            startOnTick: true,
            min: 0,
            floor: 0,
            maxPadding: 0,
            margin: 0,
            crosshair: true
        },
        yAxis: [{
            title: {
                text: "Paleolatitude difference (deg)"
            },
            crosshair: true,

            labels: {
                formatter: function () {
                    return this.value + "°"
                }
            }
        }],
        series: [],
    });

    vnode.state.graph = graph;
}

function updateSeries(vnode) {
    //if the graph is not yet inited, skip
    if (vnode.state.graph === undefined || vnode.attrs.rpd === undefined) return;

    //TODO optimisation: only remove the dataset if the current dataset is outdated
    [].concat(vnode.state.graph.series).forEach((series, i) => {
        series.remove(false, false, false);
    });

    if (vnode.state.refLocRender) { vnode.state.refLocRender.destroy() }
    vnode.state.refLocRender = vnode.state.graph.renderer.label(createRefLocStr(vnode.attrs.rpd), 80, 23)
        .add()
        .css({
            color: 'grey',
            fontWeight: 200
        })

    vnode.state.graph.addSeries({
        animation: false,

        id: 'dispErrorbarX',
        type: 'line',
        name: 'errorbars',
        lineWidth: 0.5,
        marker: {
            enabled: true,
            symbol: 'hline',
            lineColor: null,
            lineWidth: 0.5,
            states: {
                hover: {
                    enabled: false
                }
            }
        },
        states: {
            hover: {
                enabled: false
            }
        },
        tooltip: {
            enabled: false
        },

        color: "#000",
        data: vnode.attrs.rpd.map((p) => {
            return [
                {x: p.max_age === 0 ? null : p.max_age, y: p.L, marker: { symbol: 'vline', lineWidth: 0.5, lineColor: null }},
                {x: p.max_age === 0 ? null : p.min_age, y: p.L, marker: { symbol: 'vline', lineWidth: 0.5, lineColor: null }},
                {x: null, y: null},
                {x: p.age, y: p.L + p.delta_L, marker: { symbol: 'hline', lineWidth: 0.5, lineColor: null }},
                {x: p.age, y: p.L - p.delta_L, marker: { symbol: 'hline', lineWidth: 0.5, lineColor: null }},
                {x: null, y: null},
            ]
        }).flat()
    });

    // DISPLACEMENT DATA SERIES
    vnode.state.graph.addSeries({
        animation: false,

        id: 'disp',
        type: 'scatter',
        name: 'dispData',
        marker: {
            enabled: true,
            symbol: "circle"
        },
        color: "#0652DD",
        data: vnode.attrs.rpd.map((p) => {
            return {
                marker: {
                    fillColor: p.L_sig ? undefined : "white",
                    lineWidth: p.L_sig ? undefined : 1,
                    lineColor: "#0652DD",
                    symbol: "circle"
                },
                x: p.age,
                y: p.L,
                context: p
            }
        })
    });
}


function createRefLocStr(rpd) {
    //will be [lon, lat] if all the ref. loc. are the same
    //otherwise will be null
    let refLoc = rpd.reduce((acc, cur) => {
        //if acc is set to null in the process, there are multiple ref locations
        if (acc === null) { return acc; }

        //initialise acc at the first run
        if (acc === undefined) { acc = [cur.ref_lon, cur.ref_lat] }

        //check if the ref loc is the same as the previous items, if not set acc to null
        if (cur.ref_lon !== acc[0] || cur.ref_lat !== acc[1]) {
            acc = null;
        }

        return acc;
    }, undefined)

    let refLocStr = "Using sample as ref. loc.";
    if (refLoc !== null) {
        refLocStr = `Using ref. loc.(${parseFloat(refLoc[0]).toFixed(2)},${parseFloat(refLoc[1]).toFixed(2)})`
    }

    return refLocStr;
}

function ExportXLSX(vnode) {
    if (!Array.isArray(vnode.attrs.rpd)) {
        alert("Error, something went wrong with exporting this data..");
        return;
    }
    
    let title = "Paleolatitude difference";

    let fields = [
        { label: "name", value: "name"},
        { label: "age", value: "age"},
        { label: "min_age", value: "min_age"},
        { label: "max_age", value: "max_age"},

        { label: "N", value: "N" },
        { label: "R", value: "R"},
        { label: "delta_R", value: "delta_R"},
        { label: "R_sig", value: "R_sig"},
        { label: "L", value: "L"},
        { label: "delta_L", value: "delta_L"},
        { label: "L_sig", value: "L_sig"},
        { label: "ref_plon", value: "ref_plon"},
        { label: "ref_plat", value: "ref_plat"},
        // { label: "ref_lon", value: "ref_lon"},
        // { label: "ref_lat", value: "ref_lat"},
        { label: "A95", value: "A95" },
        { label: "B95", value: "B95"},
        { label: "plat", value: "plat" },
        { label: "plon", value: "plon" },

        //These values are in the input data, but not in the export data.
        //if it is possible to match the input and export data, these values can be added
        // { label: "slat", value: "slat"},
        // { label: "slon", value: "slon"},
        // { label: "K", value: "K"},
        // { label: "mdec", value: "mdec"},
        // { label: "minc", value: "minc"},
        // { label: "plateID", value: "plateID"},
        // { label: "lithology", value: "lithology"},
        // { label: "f", value: "f"},
        // { label: "p_std", value: "p_std"},
    ];

    helpers.general.downloadXlsx(fields, vnode.attrs.rpd, title);

}