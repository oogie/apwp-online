import { m } from '../../shared/stdimports.js';

import './input.less';


export const comp = {

    oninit: function oninit(vnode) {
        vnode.state.value = vnode.attrs.value;
        vnode.state.valid = true;
    },

    oncreate: function oncreate(vnode) {
        if (vnode.attrs.autofocus) {
            vnode.dom.querySelector("input").focus();
        }
        if (vnode.attrs.autoselect) {
            vnode.dom.querySelector("input").select();
        }
    },

    view: function view(vnode) {
        return (
            <div class={
                "comp input input_text" +
                (vnode.state.saving ? " saving" : "") +
                (vnode.state.valid ? "" : " invalid") +
                (vnode.attrs.format ? " formatted" : "") +
                (vnode.attrs.disabled ? " disabled" : "") +
                (vnode.attrs.autowidth ? " autowidth" : "")}>
                {vnode.attrs.title ? (<div class='title'>{vnode.attrs.title}</div>) : ""}
                <input
                    type="text"
                    oninput={(e) => {onChange(vnode, e.target.value); e.redraw = true;}}
                    onkeyup={(e) => {if (e.which == 13) {e.target.blur()}; e.redraw = false;}}
                    onblur={(e) => {onBlur(vnode, e.target.value);}}
                    tabindex={vnode.attrs.tabindex || "1"}

                    value={vnode.state.value}
                    placeholder={vnode.attrs.placeholder}

                    >
                </input>
                {vnode.attrs.format === undefined ? "" : (
                    <div class='formatval'>
                        {vnode.attrs.format(vnode.state.value)}
                    </div>
                )}
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

    validityCheck(vnode, val, true);
}

function onBlur(vnode, val) {
    if (vnode.attrs.onblur) {
        vnode.attrs.onblur(val);
    }

    validityCheck(vnode, val, false);
}

function validityCheck(vnode, val, redraw) {
    if (vnode.attrs.isvalid) {
        var isValid = vnode.attrs.isvalid(val);
        if (vnode.state.valid != isValid) {
            vnode.state.valid = isValid;
            if (redraw) m.redraw();
        }
    }
}
