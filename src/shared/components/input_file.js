import { m } from '../../shared/stdimports.js';

import './input.less';


export const comp = {

    oninit: function oninit(vnode) {

    },

    view: function view(vnode) {
        return (
            <div class={`comp input input_file ${vnode.state.dragging ? "dragging" : ""}`}>
                <input
                    type="file"
                    multiple={vnode.attrs.multiple === true}
                    disabled={vnode.attrs.disabled}
                    class={(vnode.attrs.error ? "error " : "")+(vnode.attrs.size == "auto" ? "size-auto" : "")}
                    value={vnode.attrs.value}
                    onchange={(e) => {(vnode.attrs.onblur || (() => {}))(e.target.closest("input").files)}}
                    accept={vnode.attrs.accept || "application/pdf"}

                    ondragenter={(e) => {vnode.state.dragging = true}}
                    ondragover={(e) => {vnode.state.dragging = true}}

                    ondragleave={(e) => {vnode.state.dragging = false}}
                    ondragend={(e) =>{vnode.state.dragging = false}}
                    ondrop={(e) => {vnode.state.dragging = false}}
                />
                <div class='dropzoneui noselect'>
                    <div class='icon'><i class="fas fa-plus fa-4x"></i></div>
                    {m.trust(vnode.attrs.title)}
                </div>
            </div>
        )
    }
}
