import { m, config } from '../shared/stdimports.js';


//Error reporting
import { Notifier } from '@airbrake/browser';

const airbrake = new Notifier({
    projectId: 497187,
    projectKey: '180e3dd16a3d2a17ad103a863d107b85',
    environment: 'production'
});

setupErrorLogging();
function setupErrorLogging() {
    window.onunhandledrejection = function (e) {
        console.log("ERROR (catched at 1)", e)

        if (e !== undefined) {
            airbrakeNotify(e.reason ?? e)
        }
        else {
            airbrakeNotify("Unhandled promise rejection, no error event object")
        }
    }

    console.error = function (message) {
        console.log("ERROR (catched at 2)", message)
        airbrakeNotify(message)
    }

    window.addEventListener('error', (event) => {
        console.log("ERROR (catched at 3)", event?.message)
        if (event !== undefined) {
            airbrakeNotify(event.message ?? event)
        }
        else {
            airbrakeNotify("Unhandled error, no error event object")
        }
    });

    window.onerror = function (message, source, lineno, colno, error) {
        console.log("ERROR (catched at 4)", message);
        airbrakeNotify(message, source, lineno);

        return true;
    };
}

function airbrakeNotify(message, source, lineno) {
    //If we are on localhost, do not send the error to airbrake
    if (window.location.hostname === "localhost") {
        return;
    }

    console.log("Notify airbrake")
    if (airbrake !== undefined) {
        airbrake.notify({
            error: message,
            params: {
                source: source,
                lineno: lineno,
                siteversion: config.version
            }
        });
    }
}




//styling
import '../shared/styling/paleo.less';

//pages
import {page as Header} from "./pages/header/_header.js";
import {page as Footer} from "./pages/footer/_footer.js";

import {page as Home} from "./pages/home/_home.js";
import {page as Rpdtool} from "./pages/rpdtool/_rpdtool.js";
import {page as Apwptool} from "./pages/apwptool/_apwptool.js";
import {page as Referencedatabase} from "./pages/referencedatabase/_referencedatabase.js";
import {page as About} from "./pages/about/_about.js";


//Globally define hline and vline markers in highcharts
import Highcharts from "highcharts";
Highcharts.SVGRenderer.prototype.symbols.hline = function (x, y, w, h, p) {
    return ['M', x, y + (h/2), 'H', x + w + p.lineWidth];
};
Highcharts.SVGRenderer.prototype.symbols.vline = function (x, y, w, h, p) {
    return ['M', x + (w/2), y, 'V', y + h + p.lineWidth];
};

// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import FullScreen from 'highcharts/modules/full-screen.js';
Exporting(Highcharts);
OfflineExporting(Highcharts);
FullScreen(Highcharts);


initApp();


function initApp() {
    storeBrowserDetection();
    mountUI();
}

function mountUI() {
    var abc = {};

    m.mount(document.getElementById("header"), Header);
    m.mount(document.getElementById("footer"), Footer);


    m.route(document.getElementById("app"), "/", {
        "/": {onmatch: () => {onRouting(); return Home}},
        "/rpdtool": {onmatch: () => {onRouting(); return Rpdtool}},
        "/apwptool": {onmatch: () => {onRouting(); return Apwptool}},
        "/referencedatabase": {onmatch: () => {onRouting(); return Referencedatabase}},
        "/about": {onmatch: () => {onRouting(); return About}},
    });

    function onRouting(route) {
        window.scroll(0, 0);

        let root = document.querySelector(':root');

        //todo, find a better way of doing this an a better place of configuring it. (with a css variable for both versions?
        root.style.setProperty("--txt_primary", "#0F583E");
        root.style.setProperty("--elm_primary", "#0F583E");
        root.style.setProperty("--elm_secondary", "#0F583E");
    }
}

function storeBrowserDetection() {
    let userAgent = navigator.userAgent;
   
    const browserName = userAgent.match(/edg/i) ? "edge" : 
                        userAgent.match(/chrome|chromium|crios/i) ? "chrome" : 
                        userAgent.match(/firefox|fxios/i) ? "firefox" : 
                        userAgent.match(/safari/i) ? "safari" : 
                        userAgent.match(/opr\//i) ? "opera" : "";

    const systemName = (userAgent.search('Mac') !== -1) ? "mac" : "notmac";

    const consoleShortcut = (systemName === "mac" ? "Cmd + Opt + " : "Ctrl + Shift + ") + (
                            browserName === "firefox" ? "K" : 
                            browserName === "safari" ? "C" : 
                            browserName === "opera" ? "I" : "J");

    localStorage.setItem("browserName", browserName);
    localStorage.setItem("systemName", systemName);
    localStorage.setItem("consoleShortcut", consoleShortcut);

    console.log(browserName, systemName, consoleShortcut)
}
