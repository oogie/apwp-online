import { m, helpers, options, config } from '../../../shared/stdimports.js';
import { pyWorkerAPI } from '../../calculations/pyWorkerAPI.js'


//styling
import './_apwptool.less';


//assets
import Demo_input_XLSX from "../../assets/demo_input.xlsx";
import Demo_input_CSV_NEJ from "../../assets/demo_input_NEJ.csv";
import Demo_input_CSV_SWJ from "../../assets/demo_input_SWJ.csv";
import MANUAL_apwp from '../../assets/APWP-online_manual.pdf';


//components
import { comp as Pyodideinfobox } from '../../../shared/components/pyodideinfobox.js';

import { comp as Loaddataset } from '../../components/loaddataset.js';
import { comp as Dataset } from '../../components/dataset.js';
import { comp as Input_text } from '../../../shared/components/input_text.js';
import { comp as Polarmap } from '../../components/polarmap.js';
import { comp as Showmore } from '../../../shared/components/showmore.js';
import { comp as Dialog } from '../../../shared/components/dialog.js';
import { comp as Positionaldialog } from '../../../shared/components/positionaldialog.js';



export const page = {

    oninit: function(vnode) {
        vnode.state.activeset = undefined;
        vnode.state.activecalc = undefined;

        vnode.state.datasets = [];
        getData(vnode);

        vnode.state.isOpen = {
            datasetsBulk: false,
            clearDocStore: false,

            calcSettings: false,
        }
    },

    view: function(vnode) {
        let inputDisabled = vnode.state.caclbusy;

        let demodataloaded = vnode.state.datasets.filter((ds) => {
            return ds.isdemo || ds.name === "DEMO - South west Japan" || ds.name === "DEMO - North east Japan";
        }).length > 1;

        return (
            <div class="page apwptool">
                <Pyodideinfobox />

                <div class='section explainer content_width_narrow_left'>
                    <h2>APWP Tool</h2>
                    This tool allows you to compute an APWP based on site-level paleomagnetic data using the approach of <a href='#!/referencedatabase'>Vaes et al. (2023)</a>.
                    <br/><br/>
                    Download:<br />
                    <a href={Demo_input_XLSX}>Example input file (XSLX, contains both Japan datasets)</a><br />
                    <a href={Demo_input_CSV_NEJ}>Example input file (CSV, North East Japan)</a><br />
                    <br /><br />
                    <Showmore>
                        <h4>What</h4>
                        This tool can be used to construct an APWP for any plate or terrane regardless of the age of rocks from which the data are derived, as long as the input data are provided in the coordinate system of the same plate or terrane.
                        <br/><br/>
                        <h4>How</h4>
                        To compute an APWP, you can set the size of the time window, the time step at which the reference poles of the APWP are computed and the age range.
                        You can also set the number of iterations used for the com&shy;putation of the path and the estimation of its 95% confidence region.
                        <br/>
                        <small class='txt_default_lesser'>Please be patient when calculating an APWP using many iterations.</small>
                        <br/><br/>
                        <h4>Manual</h4>
                        See <a href={MANUAL_apwp}>the user manual</a> for more information on how to use the tools and the underlying methodology.
                    </Showmore>
                </div>

                <div class='section content_width_standard'>
                    <div class='flex' style='align-items: baseline;'>
                        <h4>Load input files</h4>
                        <div class='headermenu'>
                            <button class={`btn_narrow ${vnode.state.caclbusy ? "disabled" : ""}`} onclick={() => { vnode.state.isOpen.datasetsBulk = true; }}>
                                <i class="fa-solid fa-bars"></i>
                            </button>
                            <Positionaldialog fillcontainer={true} isOpen={vnode.state.isOpen.datasetsBulk} onClose={() => { vnode.state.isOpen.datasetsBulk = false }}>
                                <div class='menu'>
                                    <a onclick={() => { exportDocStore(); vnode.state.isOpen.datasetsBulk = false }} href='javascript:'>
                                        <i class="fa-solid fa-file-export fa-fw"></i> Export all datasets to a file (experimental)
                                    </a>
                                    <a onclick={() => { vnode.state.isOpen.clearDocStore = true; vnode.state.isOpen.datasetsBulk = false }} href='javascript:'>
                                        <i class="fa-solid fa-trash-can fa-fw"></i> Remove all datasets
                                    </a>

                                </div>
                            </Positionaldialog>

                            <Dialog
                                isOpen={vnode.state.isOpen.clearDocStore}
                                onAnswer={(resp) => { if (resp) { clearDocStore(vnode) }; vnode.state.isOpen.clearDocStore = false; }}>
                                <h4>Are you sure?</h4>
                                Removing all locally stored data can not be undone! All uploaded datasets and computation results will be lost.
                            </Dialog>
                        </div>
                        <span class='txt_default_lesser'><i class="fa-light fa-circle-question"></i> data will be stored and processed locally on your own machine.</span>
                    </div>

                    <div class='datasetgrid'>
                        <div class="flexcolumn">
                            <Loaddataset onnewfile={() => { getData(vnode); }} />
                            <Choose>
                                <When condition={!demodataloaded}>
                                    <button onclick={() => { addDemoData(vnode); }}>
                                        Load in demo data
                                    </button>
                                </When>
                                <Otherwise>
                                    <center>
                                        <span class='txt_default_lesser'>Demo data is loaded</span>
                                    </center>
                                </Otherwise>
                            </Choose>
                        </div>

                        {vnode.state.datasets.map((dataset) => {
                            return (
                                <Dataset
                                    key={dataset.id}
                                    dataset={dataset}
                                    isactive={vnode.state.activeset?.id === dataset.id}
                                    onActivate={(ds) => {vnode.state.activeset = ds; getData(vnode);}}
                                    onDatasetchanged={(ds) => {getData(vnode);}}
                                    disabled={inputDisabled}
                                    />
                            )
                        })}
                    </div>
                </div>


                <div class='section content_width_standard'>
                    <div class='flex' style='align-items: baseline;'>
                        <h4>Calculations</h4>
                        <span class='txt_default_lesser'><i class="fa-light fa-circle-question"></i> calculations will run locally on your own machine.</span>
                    </div>

                    <div class='flex'>
                        <div class='settings'>
                            <div class='flexequal'>
                                <Input_text title = "Window length (Ma)" value={helpers.sessionStorage.getOption("APWP_window_length")} disabled={inputDisabled} onblur={(val) => {
                                    helpers.sessionStorage.setOption("APWP_window_length", parseFloat(val))
                                }} />
                                <Input_text title = "Time step (Ma)" value={helpers.sessionStorage.getOption("APWP_time_step")} disabled={inputDisabled} onblur={(val) => {
                                    helpers.sessionStorage.setOption("APWP_time_step", parseFloat(val))
                                }} />
                            </div>
                            <div class='flexequal'>
                                <Input_text title = "Minimum age (Ma)" value={helpers.sessionStorage.getOption("APWP_t_min")} disabled={inputDisabled} onblur={(val) => {
                                    helpers.sessionStorage.setOption("APWP_t_min", parseFloat(val))
                                }} />
                                <Input_text title = "Maximum age (Ma)" value={helpers.sessionStorage.getOption("APWP_t_max")} disabled={inputDisabled} onblur={(val) => {
                                    helpers.sessionStorage.setOption("APWP_t_max", parseFloat(val))
                                }} />
                            </div>
                            <Input_text title = "Number of iterations" value={helpers.sessionStorage.getOption("APWP_Nb")} disabled={inputDisabled} onblur={(val) => {
                                helpers.sessionStorage.setOption("APWP_Nb", parseFloat(val))
                            }} />

                            <div class='filler' style='grid-row: span 3;'></div>

                            <Choose>
                                <When condition={vnode.state.activeset === undefined}>
                                    <span style='align-self: end;' class='txt_default_lesser'>
                                        <i class="fa-solid fa-arrow-up"></i> First, add or select a dataset
                                    </span>
                                </When>
                                <When condition={vnode.state.caclbusy}>
                                    <span style='align-self: end;' class='txt_default_lesser'>
                                        <i class="txt_primary fa-solid fa-circle fa-fade"></i> Busy with calculation...
                                    </span>
                                </When>
                                <Otherwise>
                                    <button style='align-self: end;' onclick={() => {calcAPWP(vnode, vnode.state.activeset)}}>Calculate APWP</button>
                                </Otherwise>
                            </Choose>
                            <If condition={vnode.state.calcerror}>
                                <span style='align-self: end;'>
                                    <i class="txt_error fa-solid fa-triangle-exclamation fa-fade"></i>&nbsp;
                                    <span class='txt_error'>The previous calculation might have failed</span><br/>
                                    <span class='txt_default_lesser'>see the error console for more information ({localStorage.getItem("consoleShortcut")})</span>
                                </span>
                            </If>

                        </div>

                        <div class='activeset'>
                            <Choose>
                                <When condition={vnode.state.activeset === undefined}>
                                    <div class='emptymsg txt_default_lesser' key={"emptymsg"}>
                                        <i class="fa-solid fa-arrow-up-long"></i> Add or select a dataset
                                    </div>
                                </When>
                                <Otherwise>
                                    <div class='set' key={vnode.state.activeset.id}>
                                        <Dataset
                                            dataset={vnode.state.activeset}
                                            showapwp={false}
                                            isactive={true}
                                            onActivate={(ds) => {vnode.state.activeset = ds; getData(vnode);}}
                                            onDatasetchanged={(ds) => {getData(vnode);}}
                                            disabled={inputDisabled}
                                            />
                                    </div>
                                </Otherwise>
                            </Choose>
                        </div>

                    </div>

                </div>

                <If condition={vnode.state.activecalc !== undefined}>
                    <div class='section content_width_standard'>
                        <div class='flex' style='align-items: baseline;'>
                            <h4>Calculated APWP</h4>
                            <span class='txt_default_lesser'>
                                calculated in {helpers.general.displayElapsedTime(vnode.state.activecalc.calculationtime)}
                                , <a href="javascript:" onclick={() => {vnode.state.isOpen.calcSettings = true}}>with these settings</a>
                            </span>
                        </div>
                        <br/>

                        <Polarmap
                            path={vnode.state.activecalc.results}
                            projection={options.find("mapProjection", "EPSG:3575")}
                            width="100%"
                            height="80vh"
                            controls={true}
                            exportName={vnode.state.activeset.name}
                            />
                    </div>

                    <Dialog
                        isAlert={true}
                        isOpen={vnode.state.isOpen.calcSettings}
                        onAnswer={() => {vnode.state.isOpen.calcSettings = false}}
                    >
                        <h4>Calculation settings</h4>
                        Window length: {vnode.state.activecalc.options.window_length}Ma<br/>
                        Time step: {vnode.state.activecalc.options.time_step}Ma<br/>
                        Minimum age: {vnode.state.activecalc.options.t_min}Ma<br/>
                        Maximum age: {vnode.state.activecalc.options.t_max}Ma<br/>
                        Number of iterations: {vnode.state.activecalc.options.Nb}<br/>
                        Date: {helpers.general.displayFullDate(vnode.state.activecalc.options.startTime)}
                    </Dialog>
                </If>
            </div>
        )
    }
}

function getData(vnode) {
    helpers.docstore.getAll("dataset").then((datasets) => {
        //make sure the information in the stored activeset and activecalc is updated
        let activeset = datasets.find((ds) => {return vnode.state.activeset?.id === ds.id});
        return helpers.docstore.getFull("dataset", activeset?.id).then((fullActiveset) => {return [datasets, fullActiveset]});
    }).then((resp) => {
        const [datasets, fullActiveset] = resp

        //set the fullActiveset
        vnode.state.activeset = fullActiveset;

        //make the latest calculation of the correct type the activecalc
        vnode.state.activecalc = fullActiveset?.calculations.filter((c) => {return c.type === "apwp" && c.status === "done"}).sort((a,b) => {return b.created - a.created})[0];

        //set the list of datasets, sorted on created date (oldest to newest)
        vnode.state.datasets = datasets.sort((a,b) => {return a.created - b.created});

        m.redraw();
    })
}


function calcAPWP(vnode, dataset) {
    if (dataset === undefined) return;

    vnode.state.caclbusy = true;
    vnode.state.calcerror = false;

    //First parse the input data
    pyWorkerAPI.run("parsePaleoPoles", {source: dataset.data.poles})
        .then((paleopoles) => {
            //then create an 'calculation' document, with all the correct options for the calculation
            return helpers.docstore.set("calculation", {
                type: "apwp",
                options: {
                    paleopoles: paleopoles,
                    window_length: helpers.sessionStorage.getOption("APWP_window_length"),
                    time_step: helpers.sessionStorage.getOption("APWP_time_step"),
                    t_min: helpers.sessionStorage.getOption("APWP_t_min"),
                    t_max: helpers.sessionStorage.getOption("APWP_t_max"),
                    Nb: helpers.sessionStorage.getOption("APWP_Nb"),

                    startTime: Date.now()
                }
            })
        })
        .then((calculation) => {
            //then set calculation status to 'busy'..
            calculation.status = "busy";
            helpers.docstore.set("calculation", calculation);

            //.. add the calculation to the dataset..
            dataset.calculations.push(calculation.id);
            helpers.docstore.set("dataset", dataset);

            //.. and run the calculation
            return pyWorkerAPI.run("calcAPWP", calculation.options).then((apwp) => {
                //capture the results
                calculation.results = apwp;
                return calculation;
            });
        })
        .then((calculation) => {
            //determine the elapsed time and set the status to 'done'
            calculation.calculationtime = Date.now() - calculation.options.startTime;
            calculation.status = "done";
            return helpers.docstore.set("calculation", calculation);
        })
        .then((calculation) => {
            //finish
            vnode.state.caclbusy = false;
            getData(vnode);
        })
        .catch((resp) => {
            vnode.state.caclbusy = false;
            vnode.state.calcerror = true;

            console.error(resp);

            if (resp instanceof Error) {
                let maxChars = 70;
                dataset.error = resp.message.slice(0, maxChars);
                if (resp.message.length > maxChars) {
                    dataset.error += "... (see the error console: " + localStorage.getItem("consoleShortcut") + ")"
                }
            }
            else {
                dataset.error = resp;
            }

            getData(vnode);
        })
}


function addDemoData(vnode) {
    let promises = config.demodata.map((dataset) => {
        //check if the dataset is already loaded
        let exists = vnode.state.datasets.find((ds) => { return ds.name === dataset.name });
        if (exists) {
            return Promise.resolve();
        }
        else {
            return helpers.docstore.set("dataset", dataset);
        }
    });

    Promise.all(promises).then(() => {
        getData(vnode);
    })
}

function clearDocStore(vnode) {
    helpers.docstore.clear();
    getData(vnode);
}

function exportDocStore() {
    helpers.docstore.getAll().then((data) => {
        let serialized = helpers.general.serialize(data);
        helpers.general.downloadFile('paleolatitude_docstore.txt', serialized);
    });
}