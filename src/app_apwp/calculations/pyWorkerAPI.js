
import { comp as Pyodideinfobox } from '../../shared/components/pyodideinfobox.js'

const callbacks = {
    //id 0 will not be removed, this is for the progressupdates
    0: (progressMessage, error) => {
        Pyodideinfobox.show(progressMessage)
        if (error) {
            console.error(error);
        }
    }
};



const pyodideWorker = new Worker(new URL('./pyWorker.js', import.meta.url));

pyodideWorker.onmessage = (event) => {
    const { id, error, ...data } = event.data;
    if (error) {
        console.error(error);
    }

    const onSuccess = callbacks[id];
    if (id !== 0) {
        delete callbacks[id];
    }
    onSuccess({...data, error});
};

const asyncRun = (() => {
    let id = 0; // identify a Promise
    return (cmd, options) => {
        id = (id + 1) % Number.MAX_SAFE_INTEGER;
        return new Promise((onSuccess) => {
            callbacks[id] = onSuccess;
            pyodideWorker.postMessage({
                options: options,
                cmd: cmd,
                id,
            });
        });
    };
})();


function run(cmd, options) {
    return new Promise((resolve, reject) => {
        asyncRun(cmd, options).then((resp) => {
            const { results, error } = resp;
            if (error) { 
                reject(error);
            }
            else if (results) {
                resolve(results);
            }
            else {
                reject("Empty response from the calculation engine");
            }
        }).catch((e) => {
          reject(`Error in pyWorker.js at ${e?.filename}, Line: ${e?.lineno}, ${e?.message}`);
      })
  })
}

export const pyWorkerAPI = {
    run
}
