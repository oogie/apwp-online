import { m, helpers, options, config } from '../../../shared/stdimports.js';
import { pyWorkerAPI } from '../../calculations/pyWorkerAPI.js'

//styling
import './_rpdtool.less';


//assets
import Demo_input_XLSX from "../../assets/demo_input.xlsx";
import Demo_input_CSV_NEJ from "../../assets/demo_input_NEJ.csv";
import Demo_input_CSV_SWJ from "../../assets/demo_input_SWJ.csv";
import MANUAL_apwp from '../../assets/APWP-online_manual.pdf';


//components
import { comp as Pyodideinfobox } from '../../../shared/components/pyodideinfobox.js'

import { comp as Loaddataset } from '../../components/loaddataset.js'
import { comp as Dataset } from '../../components/dataset.js'
import { comp as Dispgraph } from './dispgraph.js'
import { comp as Rotgraph } from './rotgraph.js'
import { comp as Input_text } from '../../../shared/components/input_text.js';
import { comp as Input_select } from '../../../shared/components/input_select.js';
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
        let referenceset = undefined;
        if (helpers.sessionStorage.getOption("RPD_ref_type") === "custom") {
            referenceset = vnode.state.datasets.find((ds) => {return ds.id === helpers.sessionStorage.getOption("RPD_customref")});
        }

        let inputDisabled = vnode.state.caclbusy;
        let outputWarnings = createOutputWarnings(vnode.state.activecalc);

        let demodataloaded = vnode.state.datasets.filter((ds) => {
            return ds.isdemo || ds.name === "DEMO - South west Japan" || ds.name === "DEMO - North east Japan";
        }).length > 1;

        return (
            <div class="page rpdtool">
                <Pyodideinfobox />

                <div class='section explainer content_width_narrow_left'>
                    <h2>RPD Tool</h2>
                    The relative paleomagnetic displacement (RPD) tool allows the determination of displacements using the comparison metric that was introduced by <a href='https://doi.org/10.1029/2022JB023953' target="_blank">Vaes et al. (2022)</a>.
                    <br/><br/>
                    Download:<br />
                    <a href={Demo_input_XLSX}>Example input file (XSLX, contains both Japan datasets)</a><br />
                    <a href={Demo_input_CSV_NEJ}>Example input file (CSV, North East Japan)</a><br />
                    <br /><br />
                    <Showmore>
                        <h4>What</h4>
                        Central to this approach is the comparison between an observed paleopole and a reference pole in which the number of paleomagnetic sites used to compute the paleopole is taken into consideration.
                        <br/>See paper for more detail:
                        &nbsp;<a href="https://doi.org/10.1029/2022JB023953" target="_blank">
                            <img src="https://zenodo.org/badge/DOI/10.1029/2022JB023953.svg" alt="DOI" style='vertical-align: text-bottom;' />
                        </a>
                        <br/><br/>
                        <h4>How</h4>
                        To compute relative displacements, quantified as vertical-axis rotations and paleolatitudinal displacements, you can choose an input dataset and a reference.
                        <br/>
                        <small class='txt_default_lesser'>Please be patient when calculating the displacements using many iterations.</small>
                        <br/><br/>
                        <b>The input dataset</b> can be a compilation of paleopoles or a custom APWP earlier computed with the APWP tool.
                        <br/><br/>
                        <b>As a reference</b>, the global APWP of <a href='#!/referencedatabase'>Vaes et al. (2023)</a> can be used in the coordinates of a major plate, the geographic pole, or a custom dataset.<br/>
                        <br /><br />
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
                                    isref={referenceset?.id === dataset.id}
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
                            <Input_select
                                title = "Input dataset"
                                value = {helpers.sessionStorage.getOption("RPD_datasource")}
                                options = {options.RPD_datasource}
                                disabled = {inputDisabled}
                                onblur = {(val) => {
                                    if (val === "apwp") {
                                        helpers.sessionStorage.setOption("RPD_ref_loc_type", "one_ref_loc");
                                    }
                                    helpers.sessionStorage.setOption("RPD_datasource", val);
                                }}
                            />
                            <div class='flexequal'>
                                <Input_text title = "Number of iterations" value={helpers.sessionStorage.getOption("RPD_Nb")} disabled={inputDisabled} onblur={(val) => {
                                    helpers.sessionStorage.setOption("RPD_Nb", parseFloat(val))
                                }} />
                                <Input_text title = "Time window (Ma)" value={helpers.sessionStorage.getOption("RPD_ref_window")} disabled={inputDisabled} onblur={(val) => {
                                    helpers.sessionStorage.setOption("RPD_ref_window", parseFloat(val))
                                }} />
                            </div>
                            <div class='titlebar'>
                                <Choose>
                                    <When condition={helpers.sessionStorage.getOption("RPD_datasource") === "apwp"}>
                                        <div>
                                            <div key="only_one_ref_loc">
                                                <Input_select
                                                    title="Reference location"
                                                    value={helpers.sessionStorage.getOption("RPD_ref_loc_type")}
                                                    options={options.RPD_ref_loc_type.filter((opt) => { return opt.value === "one_ref_loc" })}
                                                    disabled={inputDisabled}
                                                    onblur={(val) => {
                                                        helpers.sessionStorage.setOption("RPD_ref_loc_type", val);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </When>
                                    <Otherwise>
                                        <div>
                                            <div key='all_options'>
                                                <Input_select
                                                    title="Reference location"
                                                    value={helpers.sessionStorage.getOption("RPD_ref_loc_type")}
                                                    options={options.RPD_ref_loc_type}
                                                    disabled={inputDisabled}
                                                    onblur={(val) => {
                                                        helpers.sessionStorage.setOption("RPD_ref_loc_type", val);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Otherwise>
                                </Choose>
                                {helpers.sessionStorage.getOption("RPD_ref_loc_type") !== "one_ref_loc" ? "" : m.fragment([
                                    <Input_text title = "Longitude" value={helpers.sessionStorage.getOption("RPD_ref_loc_lon")} disabled={inputDisabled} onblur={(val) => {
                                        helpers.sessionStorage.setOption("RPD_ref_loc_lon", parseFloat(val))
                                    }} />,
                                    <Input_text title = "Latitude" value={helpers.sessionStorage.getOption("RPD_ref_loc_lat")} disabled={inputDisabled} onblur={(val) => {
                                        helpers.sessionStorage.setOption("RPD_ref_loc_lat", parseFloat(val))
                                    }} />
                                ])}
                            </div>
                            <div class='flex'>
                                <Input_select
                                    title = "Choose reference"
                                    value = {helpers.sessionStorage.getOption("RPD_ref_type")}
                                    options = {options.RPD_ref_type}
                                    disabled = {inputDisabled}
                                    onblur = {(val) => {
                                        helpers.sessionStorage.setOption("RPD_ref_type", val);
                                    }}
                                />
                                {helpers.sessionStorage.getOption("RPD_ref_type") !== "gapwap" ? "" : (
                                    <Input_select
                                        title = "Reference plate"
                                        autowidth = {true}
                                        value = {helpers.sessionStorage.getOption("RPD_Euler_poles")}
                                        options = {options.RPD_Euler_poles}
                                        disabled = {inputDisabled}
                                        onblur = {(val) => {
                                            helpers.sessionStorage.setOption("RPD_Euler_poles", val);
                                        }}
                                    />
                                )}
                                {helpers.sessionStorage.getOption("RPD_ref_type") !== "custom" ? "" : (
                                    <Input_select
                                        title = "Reference set"
                                        autowidth = {true}
                                        value = {helpers.sessionStorage.getOption("RPD_customref") || "none"}
                                        options = {[{label: "- Choose your own reference set -", value:"none"}].concat(vnode.state.datasets.map((ds) => {return {label: ds.name, value: ds.id}}))}
                                        disabled = {inputDisabled}
                                        onblur = {(val) => {
                                            helpers.sessionStorage.setOption("RPD_customref", val);
                                        }}
                                    />
                                )}
                            </div>

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
                                    <button style='align-self: end;' onclick={() => {calcRPD(vnode, vnode.state.activeset, referenceset)}}>Calculate displacements</button>
                                </Otherwise>
                            </Choose>

                            <If condition={vnode.state.calcerror}>
                                <span style='align-self: end;'>
                                    <i class="txt_error fa-solid fa-triangle-exclamation fa-fade"></i>&nbsp;
                                    <span class='txt_error'>The previous calculation might have failed</span><br />
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
                                        <If condition={referenceset !== undefined}><h4>Dataset</h4></If>
                                        <Dataset
                                            dataset={vnode.state.activeset}
                                            showapwp={helpers.sessionStorage.getOption("RPD_datasource") === "apwp"}
                                            isref={referenceset?.id === vnode.state.activeset.id}
                                            isactive={true}
                                            onActivate={(ds) => {vnode.state.activeset = ds; getData(vnode);}}
                                            onDatasetchanged={(ds) => {getData(vnode);}}
                                            disabled={inputDisabled}
                                            />
                                    </div>
                                    <Choose>
                                        <When condition={referenceset !== undefined && referenceset.id !== vnode.state.activeset.id}>
                                            <div class='set' key={referenceset.id}>
                                                <h4>Reference set</h4>
                                                <Dataset
                                                    dataset={referenceset}
                                                    showapwp={false}
                                                    isref={true}
                                                    onActivate={(ds) => {vnode.state.activeset = ds; getData(vnode);}}
                                                    onDatasetchanged={(ds) => {getData(vnode);}}
                                                    disabled={inputDisabled}
                                                    />
                                            </div>
                                        </When>
                                        <Otherwise>
                                            <div key="0" />
                                        </Otherwise>
                                    </Choose>
                                </Otherwise>
                            </Choose>
                        </div>
                    </div>

                </div>

                <If condition={vnode.state.activecalc !== undefined}>
                    <Choose>
                        <When condition={vnode.state.activecalc.results[0].input_pole === undefined}>
                            <div class='section content_width_standard'>
                                <h4>Your previous calculation was stored with an old data model</h4>
                                Please re-calculate to update the data model.
                            </div>
                        </When>
                        <Otherwise>
                            <div class='section content_width_standard'>
                                <div class='flex' style='align-items: baseline;'>
                                    <h4>Rotation and displacement</h4>
                                    <span class='txt_default_lesser'>
                                        calculated in {helpers.general.displayElapsedTime(vnode.state.activecalc.calculationtime)}
                                        , <a href="javascript:" onclick={() => { vnode.state.isOpen.calcSettings = true }}>with these settings</a>
                                    </span>
                                </div>
                                <br />

                                <If condition={outputWarnings.length > 0}>
                                    <div class='warnings'>
                                        {outputWarnings.map((warning) => {
                                            return (<div class="warning">
                                                <i class="fa-solid fa-triangle-exclamation"></i> WARNING: {warning}
                                            </div>)
                                        })}
                                    </div>
                                </If>

                                <div class='flexequal'>
                                    <Rotgraph
                                        rpd={vnode.state.activecalc.results}
                                    />
                                    <Dispgraph
                                        rpd={vnode.state.activecalc.results}
                                    />
                                </div>
                            </div>

                            <Dialog
                                isAlert={true}
                                isOpen={vnode.state.isOpen.calcSettings}
                                onAnswer={() => { vnode.state.isOpen.calcSettings = false }}
                            >
                                <h4>Calculation settings</h4>
                                Number of iterations: {vnode.state.activecalc.options.Nb}<br />
                                Time window: {vnode.state.activecalc.options.ref_window}Ma<br />
                                Reference location: {options.findLabel("RPD_ref_loc_type", vnode.state.activecalc.options.ref_loc_type)}<br />
                                Date: {helpers.general.displayFullDate(vnode.state.activecalc.options.startTime)}
                            </Dialog>
                        </Otherwise>
                    </Choose> 
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
        vnode.state.activecalc = fullActiveset?.calculations.filter((c) => {return c.type === "rpd" && c.status === "done"}).sort((a,b) => {return b.created - a.created})[0];

        //set the list of datasets, sorted on created date (oldest to newest)
        vnode.state.datasets = datasets.sort((a,b) => {return a.created - b.created});

        m.redraw();
    })
}

function createOutputWarnings(activecalc) {
    let warnings = [];

    //don't show these warnings when there is no activecalc
    if (activecalc === undefined || activecalc.status !== "done") {
        return warnings;
    }

    //don't show these warnings when the results are not of the new data model
    if (activecalc.results[0].input_pole === undefined) {
        return warnings;
    }

    //don't show these warnings when the reference type is a geopole
    if (activecalc.options.ref_type === "geopole") {
        return warnings;
    }


    //n_check: if ref_mean_N < N for any pole show a warning
    let n_check_failed = activecalc.results.reduce((failed, cur) => {
        if (cur.ref.mean_N < cur.input_pole.N) { failed.push(cur); }
        return failed;
    }, []);

    if (n_check_failed.length > 0) {
        let names = n_check_failed.map((pole) => { return pole.input_pole.name }).join(", ");
        warnings.push(`the reference pole is computed from a lower number of sites than the input paleopole (N_ref < N) for entries: ${names}`);
    }


    //k_check if ref_mean_K < 10 for any pole show a warning
    let k_check_failed = activecalc.results.reduce((failed, cur) => {
        if (cur.ref.mean_K < 10) { failed.push(cur); }
        return failed;
    }, []);

    if (k_check_failed.length > 0) {
        let names = k_check_failed.map((pole) => { return pole.input_pole.name }).join(", ");
        warnings.push(`the reference pole is computed from re-sampled sites with (K < 10) for entires: ${names}`);
    }


    return warnings;
}

function calcRPD(vnode, dataset, referenceset) {
    if (dataset === undefined) return;

    vnode.state.caclbusy = true;
    vnode.state.calcerror = false;

    let newestAPWP = dataset.calculations.reduce((newestAPWP, cur) => {
        if (cur.type === "apwp" && cur.status === "done" && cur.results !== undefined && cur.results.length > 0) {
            if (newestAPWP === undefined || newestAPWP.created < cur.created) {
                newestAPWP = cur;
            }
        }

        return newestAPWP;
    }, undefined)

    // check if the passing on of the results works with the new format
    let data = helpers.sessionStorage.getOption("RPD_datasource") === "apwp" ? newestAPWP?.results : dataset.data.poles
    let storedReference = {
        ref_type: undefined,
        ref_poles: undefined
    }

    //First parse the input data
    pyWorkerAPI.run("parsePaleoPoles", {source: data})
        .then((paleopoles) => {
            //then parse or calculate the reference type and poles
            let ref_type = helpers.sessionStorage.getOption("RPD_ref_type");

            return pyWorkerAPI.run("getReferencePoles", {ref_type: ref_type, ref_source: referenceset?.data?.poles}).then((ref_poles) => {
                storedReference.ref_type = ref_type;
                storedReference.ref_poles = ref_poles;

                return paleopoles;
            })
        })
        .then((paleopoles) => {
            //then create an 'calculation' document, with all the correct options for the calculation
            let ref_loc = null;
            if (helpers.sessionStorage.getOption("RPD_ref_loc_type") === "one_ref_loc") {
                ref_loc = [
                    helpers.sessionStorage.getOption("RPD_ref_loc_lon"),
                    helpers.sessionStorage.getOption("RPD_ref_loc_lat")
                ]
            }

            return helpers.docstore.set("calculation", {
                type: "rpd",
                options: {
                    paleopoles: paleopoles,
                    ref_type: storedReference.ref_type,
                    ref_poles: storedReference.ref_poles,

                    Nb: helpers.sessionStorage.getOption("RPD_Nb"),
                    ref_window: helpers.sessionStorage.getOption("RPD_ref_window"),
                    ref_loc: ref_loc,
                    ref_loc_type: helpers.sessionStorage.getOption("RPD_ref_loc_type"),
                    Euler_poles: helpers.sessionStorage.getOption("RPD_Euler_poles"),

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
            return pyWorkerAPI.run("calcRPD", calculation.options).then((rpd) => {
                //capture the results
                calculation.results = rpd;
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
        let exists = vnode.state.datasets.find((ds) => {return ds.name === dataset.name});
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

