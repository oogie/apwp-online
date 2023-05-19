
importScripts("https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js");

//calculation code
import PY_aux from './pySrc/auxiliary.py'
import PY_apwp from './pySrc/APWP-online_tools.py'
import JSON_repodata from './repodata.json'

//data used in calculation
let datamodel = [
    {name: "Euler_poles_101.csv", url: ""},
    {name: "Euler_poles_102.csv", url: ""},
    {name: "Euler_poles_201.csv", url: ""},
    {name: "Euler_poles_301.csv", url: ""},
    {name: "Euler_poles_304.csv", url: ""},
    {name: "Euler_poles_501.csv", url: ""},
    {name: "Euler_poles_503.csv", url: ""},
    {name: "Euler_poles_701.csv", url: ""},
    {name: "Euler_poles_801.csv", url: ""},
    {name: "Euler_poles_802.csv", url: ""},
    {name: "Euler_poles_901.csv", url: ""},
    {name: "Global_APWP_DB_Vaes_et_al.xlsx", url: ""},
    {name: "Global_APWP_Vaes_et_al.xlsx", url: ""},
]

//add the file url to the datamodel files, use a dynamic import from webpack for this
datamodel.forEach((file) => {
    import(`./pySrc/data/${file.name}`).then((resp) => {
        file.url = resp.default;
    })
})


function sendProgress(msg) {
    //check if this is a pyProxy, if so convert it to a js object
    if (typeof msg.toJs === "function") {
        msg = Object.fromEntries(msg.toJs());
    }

    self.postMessage({ ...msg, id: 0})
}

// *** INITIALISATION *** //

const initSteps = {
    "loadPyodide": {
        title: "1/5 Loading python runtime..",
        content: "We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!",
    },
    "loadMicropip": {
        title:  "2/5 Loading package manager..",
        content: "We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!",
    },
    "loadLibraries": {
        title:  "3/5 Loading supporting libraries..",
        content: "We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!",
    },
    "loadData": {
        title:  "4/5 Loading datamodel..",
        content: "We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!",
    },
    "loadCode": {
        title:  "5/5 Loading calculation code..",
        content: "We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!",
    },
    "finished": {
        title:  "The calculation engine is ready.",
        content: "Lets get to work!",
        messagetime: 6000,
        spinner: false
    },
    "error": {
        title:  "! Error initialising the calculation engine.",
        content: "More information could be found in the javascript error console (ctrl-shift-i)",
        spinner: false
    }
}

async function loadPyodideAndPackages() {
    try {
        const starttime = Date.now();

        // 1/5 Loading python runtime..
        sendProgress(initSteps["loadPyodide"])
        self.pyodide = await loadPyodide({
            lockFileURL: JSON_repodata
        });
        pyodide.setStderr({
            batched: (err) => {
                console.error(err);
            }
        })

        // 2/5 Loading package manager..
        sendProgress(initSteps["loadMicropip"])
        await self.pyodide.loadPackage("micropip");
        const micropip = self.pyodide.pyimport("micropip");

        //3/5 Loading supporting libraries..
        sendProgress(initSteps["loadLibraries"])
        await micropip.install(["pandas", "future", "scipy", "matplotlib", "pmagpy", "openpyxl"])

        //4/5 Loading datamodel..
        sendProgress(initSteps["loadData"])
        await Promise.all(datamodel.map((file) => {
            return self.pyodide.runPythonAsync(`
                from pyodide.http import pyfetch
                data = await pyfetch("${file.url}")

                with open("${file.name}", "wb") as f:
                    f.write(await data.bytes())
            `)
        }))


        //4/5 Loading calculation code..
        sendProgress(initSteps["loadCode"])
        await self.pyodide.runPythonAsync(`
            from pyodide.http import pyfetch
            auxCode = await pyfetch("${PY_aux}")
            from pyodide.http import pyfetch
            calcCode = await pyfetch("${PY_apwp}")

            with open("auxiliary.py", "wb") as f:
                f.write(await auxCode.bytes())
            with open("APWP-online_tools.py", "wb") as f:
                f.write(await calcCode.bytes())
        `)
        self.pyodide.pyimport("auxiliary");
        self.pyodide.pyimport("APWP-online_tools");

        //Calculation engine ready!
        sendProgress(initSteps["finished"])
    }
    catch (e) {
        console.error(e);
        sendProgress(initSteps["error"])
    }
}

const startInitOnPageLoad = true;
let pyodideReadyPromise;

if (startInitOnPageLoad) {
    pyodideReadyPromise = loadPyodideAndPackages();
}
else {
    pyodideReadyPromise = Promise.resolve();
}





// *** COMMAND HANDLERS *** //
let pyPackage;

self.onmessage = async (event) => {
    // make sure loading is done
    await pyodideReadyPromise;

    if (pyPackage === undefined) {
        pyPackage = pyodide.pyimport("APWP-online_tools");
    }

    const { id, cmd, options } = event.data;

    // console.log(cmd, options)

    if (cmd === "parsePaleoPoles") {
        parsePaleoPoles(id, options);
    }
    else if (cmd === "getReferencePoles") {
        getReferencePoles(id, options);
    }
    else if (cmd === "calcRPD") {
        calcRPD(id, options);
    }
    else if (cmd === "calcAPWP") {
        calcAPWP(id, options);
    }
    else {
        console.error(`Pyodide worker tried to perform the unkown command '${cmd}'`)
    }
};

function parsePaleoPoles(id, options) {
    try {
        let pyresult = pyPackage.parsePaleoPoles(pyodide.toPy(options), sendProgress);
        let jsresult = pyresult.toJs();
        let results = jsresult.map((m) => {return Object.fromEntries(m)});

        //clear last message
        sendProgress({messagetime: 0})
        self.postMessage({ results, id });
        pyresult.destroy();
    }
    catch (error) {
        console.error(error);
        sendProgress({title: "! Error while running calculations", content: "More information could be found in the javascript error console (ctrl-shift-i)", messagetime: 120*1000, spinner: false})
        self.postMessage({ error, id })
    }
}

function getReferencePoles(id, options) {
    try {
        let pyresult = pyPackage.getReferencePoles(pyodide.toPy(options), sendProgress);
        let jsresult = pyresult.toJs();
        let results = jsresult;
        if (jsresult instanceof Map === true)
            results = jsresult.map((m) => {return Object.fromEntries(m)});

        //clear last message
        sendProgress({messagetime: 0})
        self.postMessage({ results, id });
        pyresult.destroy();
    }
    catch (error) {
        console.error(error);
        sendProgress({title: "! Error while running calculations", content: "More information could be found in the javascript error console (ctrl-shift-i)", messagetime: 120*1000, spinner: false})
        self.postMessage({ error, id })
    }
}

function calcRPD(id, options) {
    try {
        let pyresult = pyPackage.calcRPD(pyodide.toPy(options), sendProgress);
        let jsresult = pyresult.toJs();
        let results = jsresult.map((m) => {return Object.fromEntries(m)});

        //clear last message
        sendProgress({messagetime: 0})
        self.postMessage({ results, id });
        pyresult.destroy();
    }
    catch (error) {
        console.error(error);
        sendProgress({title: "! Error while running calculations", content: "More information could be found in the javascript error console (ctrl-shift-i)", messagetime: 120*1000, spinner: false})
        self.postMessage({ error, id })
    }
}

function calcAPWP(id, options) {
    try {
        let pyresult = pyPackage.calcAPWP(pyodide.toPy(options), sendProgress);
        let jsresult = pyresult.toJs();
        let results = jsresult.map((m) => {return Object.fromEntries(m)});

        //clear last message
        sendProgress({messagetime: 0})
        self.postMessage({ results, id });
        pyresult.destroy();
    }
    catch (error) {
        console.error(error);
        sendProgress({title: "! Error while running calculations", content: "More information could be found in the javascript error console (ctrl-shift-i)", messagetime: 120*1000, spinner: false})
        self.postMessage({ error, id })
    }
}
