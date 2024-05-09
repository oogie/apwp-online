import { helpers, options } from "../stdimports.js";


export const sessionStorageHelpers = {


    getOption: function getOption(name) {
        return helpers.general.deserialize(window.sessionStorage.getItem("option_" + name.toString())) ?? options.findDefault(name).value;
    },

    setOption: function getOption(name, value) {
        
        if (value === undefined) {
            value = options.findDefault(name).value
        }
        return window.sessionStorage.setItem("option_" + name.toString(), helpers.general.serialize(value));
    }


}
