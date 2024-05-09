import { m, helpers, config, XLSX } from '../../shared/stdimports.js';

import './loaddataset.less';


import { comp as Input_file } from '../../shared/components/input_file.js';
import { comp as Input_select } from '../../shared/components/input_select.js';
import { comp as Dialog } from '../../shared/components/dialog.js';


export const comp = {

    oninit: function(vnode) {
        vnode.attrs.onnewfile = vnode.attrs.onnewfile || (() => {});

        vnode.state.error = {
            dialogIsOpen: false,
            message: ""
        }

        vnode.state.sheetSelection = {
            dialogIsOpen: false,
            sheetNames: [],
            selectedSheet: undefined,
            resolve: () => {},
            reject: () => {}
        }
    },

    view: function(vnode) {
        return (
            <div class='comp loadsourcefile'>
                <Input_file
                    title="Add your dataset<br/><i>.xlsx or .csv</i>"
                    accept=".csv, .xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet"
                    onblur={(files) => {
                        // console.log("INPUT ON BLUR", files)
                        window.setTimeout(() => {
                            readFile(files[0])
                                .then((workbook) => {return sheetSelection(vnode, workbook)})
                                .then(worksheetToData)
                                .then(dataEnhancement)
                                .then(inputValidation)
                                .then(addMissingSampleNames)
                                .then((data) => {
                                    //Use filename as name, but remove file extention
                                    let datasetName = files[0].name.split(".").slice(0, -1).join(".");

                                    //If a sheet is selected, use the sheetname instead
                                    if (vnode.state.sheetSelection.selectedSheet) {
                                        datasetName = vnode.state.sheetSelection.selectedSheet;
                                    }

                                    return helpers.docstore.set("dataset", {
                                        name: datasetName,

                                        raw: {
                                            name: files[0].name,
                                            size: files[0].size,
                                            file: files[0]
                                        },
                                        data: {
                                            poles: data,
                                            length: data.length
                                        }
                                    })
                                })
                                .then((dataset) => {
                                    //forget selection so this information is not used in the next loaded file
                                    vnode.state.sheetSelection.selectedSheet = undefined;
                                    
                                    vnode.attrs.onnewfile();
                                })
                                .catch((e) => {
                                    vnode.state.error.dialogIsOpen = true;
                                    vnode.state.error.message = e;
                                    m.redraw();
                                })
                        }, 100);
                    }}
                />

                <Dialog
                    isOpen={vnode.state.sheetSelection.dialogIsOpen}
                    onAnswer={(resp) => {
                        if (resp === undefined || resp === false) { //either clicked on cancel or closed dialog
                            vnode.state.sheetSelection.reject("The import was canceled");
                        } else { //submitted an answer
                            vnode.state.sheetSelection.resolve(vnode.state.sheetSelection.selectedSheet);
                        }

                        //close dialog
                        vnode.state.sheetSelection.dialogIsOpen = false;
                    }
                }>
                    <h4 key={"title"}>From what sheet do you want to import data?</h4>
                    <div key={vnode.state.sheetSelection.dialogIsOpen}> {/*The key is to ensure selected answers do not persist over multiple dialog sessions*/}
                        <Input_select
                            title = "Sheet:"
                            autowidth = {true}
                            value = {vnode.state.sheetSelection.selectedSheet}
                            options = {vnode.state.sheetSelection.sheetNames}
                            onblur = {(val) => {
                                vnode.state.sheetSelection.selectedSheet = val;
                            }}
                        />
                    </div>

                </Dialog>

                <Dialog
                    isAlert={true}
                    isOpen={vnode.state.error.dialogIsOpen}
                    onAnswer={(resp) => {vnode.state.error.dialogIsOpen = false; }
                }>
                    <h4>File is not loaded in.</h4>
                    {vnode.state.error.message}
                </Dialog>

            </div>
        )
    }

}


function readFile(fileHandle) {
    // console.log("READFILE", fileHandle)
    return new Promise((resolve, reject) => {
        try {
            if (/^image/.test(fileHandle.type) || /^application\/pdf/.test(fileHandle.type)) {
                console.error(fileHandle.type)
                reject("Something went wrong while reading the file. This is not an XLSX like file. Error: 01");
                return;
            }

            var reader = new FileReader();

            reader.onload = function(e){
                try {
                    var fileContent = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(fileContent, {type:'array'});
                    resolve(workbook);
                }
                catch {
                    reject("Something went wrong while reading the file. This is not an XLSX like file. Error: 04");
                }
            };

            reader.readAsArrayBuffer(fileHandle);
        }
        catch (e) {
            console.error(e);
            reject("Something went wrong while reading the file. Error: 02")
        }
    })
}

function sheetSelection(vnode, workbook) {
    return new Promise((resolve, reject) => {
        var sheetNames = workbook.SheetNames;

        if (sheetNames.length == 0) {
            console.error(workbook.Sheets)
            reject("Something went wrong while reading the file. Error: 03")
        }
        else if (sheetNames.length == 1) {
            resolve(workbook.Sheets[sheetNames[0]]);
        }
        else {
            //aks the user
            let options = sheetNames.map((name, i) => {return {value: name, label: name}})
            vnode.state.sheetSelection = {
                dialogIsOpen: true,
                sheetNames: options,
                selectedSheet: options[0].value,
                reject: reject,
                resolve: (sheetName) => {
                    resolve(workbook.Sheets[sheetName])
                },
            }
            m.redraw();
        }
    })
}

function worksheetToData(worksheet) {
    return new Promise((resolve, reject) => {
        let data = XLSX.utils.sheet_to_json(worksheet, {blankrows: false, defval: null});
        resolve(data)
    })
}

function dataEnhancement(rows) {
    return new Promise((resolve, reject) => {
        // check if there are any rows
        if (Array.isArray(rows) === false || rows.length === 0) {
            reject("No data was found in this file.");
            return;
        }

        // rename all aliases to their original name if the original name is not present
        config.datasetImportAliases.forEach((alias) => {
            rows = rows.map((row) => {
                if (row[alias.orig] === undefined && row[alias.alias] !== undefined) {
                    row[alias.orig] = row[alias.alias];
                    delete row[alias.alias];
                }
                return row;
            })
        });

        //add a empty value if certain fields are not present
        config.datasetImportDefaults.forEach((def) => {
            rows = rows.map((row) => {
                if (row[def.field] === undefined) {
                    row[def.field] = def.value;
                }
                return row;
            })
        });

        console.log(rows);

        resolve(rows);
    });
}

function inputValidation(rows) {
    return new Promise((resolve, reject) => {
        // check if there are any rows
        if (Array.isArray(rows) === false || rows.length === 0) {
            reject("No data was found in this file.");
            return;
        }

        // do the field validation checks on all the fields
        let checks = config.datasetImportValidation.map((opts) => {
            return check({rows, ...opts});
        });

        let failedCheck = checks.find((check) => {return check.passed === false});
        if (failedCheck !== undefined) {
            reject(failedCheck.msg);
            return;
        }

        //check plat & plon or mdec & minc is present for each row
        rows.forEach((row, i) => {
            let rowNr = i + 2; //+2 because excel starts at 1 and the first row is the header
            if ((row.plat === undefined || row.plat === null) && (row.mdec === undefined || row.mdec === null)) {
                reject("Either plat and plon, or mdec and minc have to be defined for each row. Row " + rowNr + " is missing both.");
            }
        });

        resolve(rows);
    })

    //helper function to check if a field is valid
    function check(opts) {        
        let defaultOpts = { field: "", type: "number", cond: ((v, rows) => true), condMsg: "", optional: false, rows: [] }
        opts = helpers.general.merge(defaultOpts, opts);

        let result = {
            passed: true,
            msg: "",
        }
        opts.rows.forEach((row, i) => {
            let rowNr = i + 2; //+2 because excel starts at 1 and the first row is the header

            //if there is already an error, don't check any further
            if (result.passed === false) { return; }
        
            //check the field if it is required or if it is present (undefined = column is not present, null = column is present but empty)
            if (opts.optional !== true || (row[opts.field] !== undefined && row[opts.field] !== null)) {
                //cehck if the column is present
                if (row[opts.field] === undefined) {
                    result.msg = `The column "${opts.field}" is required but not present`;
                    result.passed = false;
                    return;
                }
                
                //check if the value is not 'empty' (null)
                if (row[opts.field] === null) {
                    result.msg = `The value "${opts.field}" on row ${rowNr} is required but not found`;
                    result.passed = false;
                    return;
                }

                //check if the value is of the correct type
                if (typeof row[opts.field] !== opts.type) {
                    result.msg = `The field "${opts.field}" on row ${rowNr} is not a ${opts.type}. The value of "${opts.field}" is "${row[opts.field]}" and has type "${typeof row[opts.field]}"`;
                    result.passed = false;
                    return;
                }

                //if the value has to be a number, check if it is not NaN
                if (opts.type === "number" && isNaN(row[opts.field])) {
                    result.msg = `The field "${opts.field}" on row ${rowNr} is not a valid number. The value of "${opts.field}" is "${row[opts.field]}"`;
                    result.passed = false;
                    return;
                }

                //check if the value passes the condition
                if (opts.cond(row[opts.field], row) === false) {
                    result.msg = `The field "${opts.field}" on row ${rowNr} has to be ${opts.condMsg}. The value of "${opts.field}" is "${row[opts.field]}"`;
                    result.passed = false;
                    return;
                }

            }
        })
        return result;
    }

}

function addMissingSampleNames(rows) {
    return rows.map((row, i) => {
        if (row.name === undefined || row.name === null) {
            row.name = "Sample " + (i + 1);
        }
        return row;
    })
}