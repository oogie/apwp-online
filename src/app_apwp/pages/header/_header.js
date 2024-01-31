import { m } from '../../../shared/stdimports.js';


//styling
import './_header.less';

import { comp as Positionaldialog } from '../../../shared/components/positionaldialog.js';

import MANUAL_apwp from '../../assets/APWP-online_manual.pdf';



export const page = {

    view: function(vnode) {
        return (
            <div class="page header">
                <div class='menu content_width_standard'>
                    <a href='#!/' class='unobtrusive'>
                        <h1>APWP-online.org</h1>
                    </a>

                    <div style='flex-grow:1;'></div>

                    <a class='mobile_hidden' href='#!/'>Home</a>
                    <a class='mobile_hidden' href='#!/apwptool'>APWP Tool</a>
                    <a class='mobile_hidden' href='#!/rpdtool'>RPD Tool</a>
                    <a class='mobile_hidden' href='#!/referencedatabase'>Reference database</a>
                    <a class='mobile_hidden' href='#!/about'>About</a>
                    <a class='mobile_hidden' href={MANUAL_apwp} target="_blank">Manual (PDF)</a>

                    <button class='btn_icon mobile_only' onclick={() => {vnode.state.menuIsOpen = !vnode.state.menuIsOpen}}>
                        <i class="fa-solid fa-bars"></i>
                    </button>

                    <Positionaldialog fillcontainer={true} isOpen={vnode.state.menuIsOpen} onClose={() => {vnode.state.menuIsOpen = false}}>
                        <a onclick={() => {vnode.state.menuIsOpen = false}} href='#!/'>Home</a>
                        <a onclick={() => {vnode.state.menuIsOpen = false}} href='#!/apwptool'>APWP Tool</a>
                        <a onclick={() => {vnode.state.menuIsOpen = false}} href='#!/rpdtool'>RPD Tool</a>
                        <a onclick={() => {vnode.state.menuIsOpen = false}} href='#!/referencedatabase' >Reference database</a>
                        <a onclick={() => {vnode.state.menuIsOpen = false}} href='#!/about'>About</a>
                        <a href={MANUAL_apwp} target="_blank">Manual (PDF)</a>
                    </Positionaldialog>
                </div>


            </div>
        )
    }

}
