import { helpers } from "../stdimports.js";

import localforage from "localforage";

const types = {
    dataset: {
        id: undefined,              //will be a random uuid
        created: 0,                 //utc of when this dataset was imported
        name: "",                   //display name
        status: "created",          //can be "created", "error"
        error: null,                //can be null or a string containing the human readable error message

        raw: {                      //raw input data
            name: "",               //name of the input file
            size: 0,                //size of the input file in bytes
            file: null              //blob of the input file
        },
        data: {
            poles: [],              //parsed geopoles from the input data
            length: 0               //amount of geopoles
        },
        calculations: {_docstore_link: true, link: "calculation", multiple: true}  //list of 'calculation' id's
    },

    calculation: {
        id: undefined,              //will be a random uuid
        created: 0,                 //utc of when this dataset was imported
        type: "",                   //can be "apwp" or "rpd"
        status: "created",          //can be "created", "busy", "done"
        error: null,                //can be null or a string containing the human readable error message

        options: {},                //key value pairs of calculation option names and values, can be passed to the python runtime to perform calculations
        results: [],                //the return value of the calculations
        calculationtime: 0          //calculation time in ms
    }
}

// Possible feature: make a failback and use LOCALSTORAGE as driver or an in memory (not persistant) key-val db.
// We cant use LOCALSTORAGE right now because we want to store a blob in dataset.raw.file
// If we are going to use LOCALSTORAGE as fallback, make sure dataset.raw.file is not stored and
// the rest of the app does not expect anything in the field dataset.raw.file
if (localforage.supports(localforage.INDEXEDDB) === false) {
    alert(`IndexedDB is not supported by your browser. This is currently needed to use this website,
           the website will not function correctly. Use (a newer version of) Chrome, Firefox or Safari.
           If this is not possible, please send me a message at info@apwp-online.org, then we will make
           an update of the website with a fallback for this feature`);
}


//Make an localforage instance for each document
const stores = Object.fromEntries(Object.keys(types).map((typeName) => {
    return [typeName, localforage.createInstance({ name: typeName , driver: [localforage.INDEXEDDB]})]
}));


export const docstoreHelpers = {

    get: function get(type, id) {
        // console.log("get", type, id)
        if (stores[type] === undefined) {
            return Promise.reject(`Docstore: tried to get document of type ${type}, this is not a defined type`)
        }
        if (id === undefined) {
            return Promise.resolve()
        }

        return stores[type].getItem(id);
    },

    getAll: function geAll(type) {
        // console.log("getAll", type)

        if (type === undefined) {
            return Promise.all(Object.keys(stores).map((type) => {
                return docstoreHelpers.getAll(type);
            })).then((results) => {
                return Object.fromEntries(Object.keys(stores).map((type, i) => {
                    return [type, results[i]]
                }))
            })
        }
        else {
            if (stores[type] === undefined) {
                return Promise.reject(`Docstore: tried to get all documents of type ${type}, this is not a defined type`)
            }

            return stores[type].keys().then((ids) => {
                let promises = ids.map((id) => {
                    return docstoreHelpers.get(type, id)
                });

                return Promise.all(promises)
            });
        }
    },

    getFull: function getFull(type, id) {
        // console.log("getFull", type)
        if (stores[type] === undefined) {
            return Promise.reject(`Docstore: tried to get a full document of type ${type}, this is not a defined type`)
        }
        if (id === undefined) {
            return Promise.resolve()
        }

        return new Promise((resolve, reject) => {

            //get the root node
            docstoreHelpers.get(type, id).then((rootNode) => {
                let waitFor = [];

                //check if any links are defined and follow them
                let typedef = types[type];
                Object.keys(typedef).forEach((property) => {
                    let linkFlag = typedef[property]?._docstore_link;
                    if (linkFlag) {
                        if (typedef[property].multiple) {
                            rootNode[property].forEach((item, i) => {
                                let id = typeof rootNode[property][i] === "object" ? rootNode[property][i].id : rootNode[property][i];
                                waitFor.push(getFull(typedef[property].link, id).then((childNode) => {
                                    rootNode[property][i] = childNode;
                                }));
                            });
                        }
                        else {
                            let id = typeof rootNode[property] === "object" ? rootNode[property].id : rootNode[property];
                            waitFor.push(getFull(typedef[property].link, id).then((childNode) => {
                                rootNode[property] = childNode;
                            }))
                        }
                    }
                });

                Promise.all(waitFor).then(() => {
                    resolve(rootNode);
                })
            })
        })
    },

    set: function set(type, value) {
        // console.log("set", type, value)
        if (stores[type] === undefined) {
            return Promise.reject(`Docstore: tried to set document of type ${type}, this is not a defined type`)
        }

        //Create a new object, copoy over all the default values, then copy over the given value.
        //This ensures all the properties of the type are present, everywhere a property is definend in value it has presendence
        value = Object.assign({}, types[type], value ?? {});

        //check and remove any 'link' directives, replace them with a literal ([] for 1 to many, null for 1 to 1 links)
        Object.keys(value).forEach((key) => {
            let linkFlag = value[key]?._docstore_link;
            if (linkFlag === true) {
                if (value[key].multiple) value[key] = [];
                else value[key] = null;
            }
        });


        //Make sure there is an id defined, if not (for instance in case of a new document) create a new id
        if (value.id === undefined) {
            value.id = helpers.general.uuid();
            value.created = parseInt(Date.now() / 1000)
        }

        return stores[type].setItem(value.id, value);
    },

    remove: function remove(type, id) {
        // console.log("remove", type, id)
        if (stores[type] === undefined) {
            return Promise.reject(`Docstore: tried to remove document of type ${type}, this is not a defined type`)
        }
        if (id === undefined) {
            return Promise.resolve()
        }

        return stores[type].removeItem(id);
    },

    //clear all documents of a certain type or if type is undefined, clear all documents
    clear: function clear(type) {
        // console.log("clear", type)
        if (type === undefined) {
            return Promise.all(Object.keys(stores).map((type) => {
                return stores[type].clear()
            }))
        }
        else {
            return stores[type].clear()
        }
    }


}
