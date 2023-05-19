import { m } from '../../shared/stdimports.js';

import './input.less';


export const comp = {

    oninit: function oninit(vnode) {
        vnode.state.value = vnode.attrs.value;
    },

    view: function view(vnode) {
        if (vnode.attrs.options === undefined) vnode.attrs.options = [];

        return (
            <div class={`comp input input_select ${vnode.state.saving ? "saving" : ""} ${vnode.attrs.disabled ? "disabled" : ""} ${vnode.attrs.autowidth ? "autowidth" : ""}`}>
                {vnode.attrs.title ? (<div class='title'>{vnode.attrs.title}</div>) : ""}
                <select
                    onchange={(e) => {onChange(vnode, e.target.value);}}
                    onkeyup={(e) => {if (e.which == 13) {e.target.blur()}; e.redraw = false;}}
                    tabindex={vnode.attrs.tabindex || "1"}

                    value={vnode.state.value}
                    >
                    {!vnode.attrs.placeholder ? "" : (
                        <option value="" disabled>{vnode.attrs.placeholder}</option>
                    )}
                    {vnode.attrs.options.map((option) => {
                        return (
                            <option value={option.value} disabled={option.disabled === true}>{option.label}</option>
                        )
                    })}
                </select>
                <div class='saveui'>
                    <i class="saving far fa-spin fa-sync-alt"></i>&nbsp;saving
                </div>

            </div>
        )
    }
}

function onChange(vnode, val) {
    vnode.state.value = val;

    if (vnode.attrs.onchange) {
        vnode.attrs.onchange(val);
    }

    if (vnode.attrs.onblur) {
        vnode.attrs.onblur(val);
    }
}
