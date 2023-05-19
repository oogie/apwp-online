import { m } from '../../shared/stdimports.js';

import './dialog.less';


export const comp = {

    /*
        vnode.attrs = {
            isOpen: bool,               //bool indicating if the dialog has to be open or not
            onAnswer: function(resp) {} //triggered when the dialog is closed. Resp will be:
                                            undefined if no response is given,
                                            false when 'Cancel' button pressed,
                                            true when 'Ok' or 'Confirm' buttons are pressed

            topmargin: "20vh"           //CSS style of the top margin of the dialog
            autowidth: bool,            //when true the width of the content will be the width of the dialog, otherwise it is 95vw, with a max of 420px

            isLightbox: bool,           //sets response options to [] and the padding to 0
            isAlert: bool,              //sets response options to only an Ok button
        }

    */


    oninit: function oninit(vnode) {
        vnode.state.isOpen = false;
    },

    view: function view(vnode) {
        return (
            <dialog class={`comp dialog ${vnode.attrs.autowidth ? "autowidth" : ""} ${vnode.attrs.isLightbox ? "isLightbox" : ""}`}
                onclick={(e) => {e.redraw = false; onDialogClick(vnode, e);}}
                oncancel={(e) => {e.redraw = false; e.preventDefault();}}
                style={`margin-top: ${vnode.attrs.topmargin ?? "20vh"}`}
                >
                <div class='content'>
                    {vnode.children}
                </div>
                <div class='reactions'>
                    <Choose>
                        <When condition={vnode.attrs.isLightbox}>

                        </When>
                        <When condition={vnode.attrs.isAlert}>
                            <button autofocus onclick={() => {e.redraw = false; answer(vnode, true)}}>Ok</button>
                        </When>
                        <Otherwise>
                            <button onclick={() => {e.redraw = false; answer(vnode, false)}}>Cancel</button>
                            <button autofocus onclick={() => {e.redraw = false; answer(vnode, true)}}>Confirm</button>
                        </Otherwise>
                    </Choose>
                </div>
            </dialog>
        )
    },

    onupdate: function onupdate(vnode) {
        if (vnode.state.isOpen !== vnode.attrs.isOpen) {
            if (vnode.attrs.isOpen) {
                vnode.dom.showModal();
            }
            else {
                vnode.dom.classList.add("hide");
                window.setTimeout(() => {
                    vnode.dom.close()
                    vnode.dom.classList.remove("hide");
                }, 200)
            }
            vnode.state.isOpen = vnode.attrs.isOpen;
        }
    }
}

function answer(vnode, resp) {
    vnode.attrs.onAnswer?.(resp);
    m.redraw();
}

function onDialogClick(vnode, e) {
    if (vnode.dom === e.target) {
        answer(vnode, undefined);
    }
}
