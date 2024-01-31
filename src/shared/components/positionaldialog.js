import { m } from '../../shared/stdimports.js';

import './positionaldialog.less';


export const comp = {

    oninit: function oninit(vnode) {

    },

    view: function view(vnode) {
        return (
            <div class={"comp positionaldialog" + (vnode.attrs.isOpen ? " open" : " closed" ) + (vnode.attrs.fillcontainer ? " fill" : "") }
                 onclick={(e) => {onclick(e, vnode)}}>
                <div class='content'>
                    {vnode.children}
                </div>
            </div>
        )
    }
}

function onclick(e, vnode) {
    if (e?.target?.classList?.contains?.("positionaldialog")) {
        if (vnode.attrs.onClose) {
            vnode.attrs.onClose();
        }
    }
}
