import { m, helpers, options } from '../../../shared/stdimports.js';


//styling
import './_home.less';


import MANUAL_apwp from '../../assets/APWP-online_manual.pdf';



export const page = {

    oninit: function(vnode) {

    },

    onremove: function(vnode) {

    },

    view: function(vnode) {

        return (
            <div class="page home">
                <div class='section content_width_standard'>
                    <div class='content_width_narrow'>
                        <h2>APWP-online</h2>
                        User-friendly tools to compute apparent polar wander paths (APWPs) from site-level paleomagnetic data and to determine relative paleomagnetic displacements.
                        <br/><br/>
                        You will also find the curated paleomagnetic database used to compute the most recent global APWP of <a href='#!/referencedatabase'>Vaes et al. (2023)</a>.
                        Do you have new high-quality paleomagnetic data to add to future iterations of the global APWP, <a href='#!/referencedatabase'>let us know</a>!
                        <br/><br/>
                        See <a href={MANUAL_apwp}>the user manual</a> for more information on how to use the tools and the underlying methodology.
                        <br/><br/>
                        <br/><br/>
                    </div>

                    <div class='flex features'>
                        <button class='feature' onclick={()=>{m.route.set("/apwptool")}}>
                            <h4>APWP Tool</h4>
                            <div class='txt_default_lesser'>
                                Compute a custom Apparent Polar Wander Paths based on site-level paleo&shy;magnetic data
                            </div>
                            <br/><br/>
                            <i class="fa-duotone fa-bezier-curve fa-8x"></i>
                        </button>

                        <button class='feature' onclick={()=>{m.route.set("/rpdtool")}}>
                            <h4>RPD Tool</h4>
                            <div class='txt_default_lesser'>
                                Determine Relative Paleo&shy;magnetic Dis&shy;place&shy;ments to quantify vertical-axis rotations and paleo&shy;latitudinal motions through time
                            </div>
                            <br/><br/>
                            <i class="fa-duotone fa-up-down-left-right fa-8x"></i>
                        </button>

                        <button class='feature' onclick={()=>{m.route.set("/referencedatabase")}}>
                            <h4>Reference database</h4>
                            <div class='txt_default_lesser'>
                                The reference database that underpins the global APWP for the last 320 Ma from Vaes et al. (2023).
                            </div>
                            <br/><br/>
                            <i class="fa-duotone fa-table-list fa-8x"></i>
                        </button>
                    </div>

                </div>

                <div class='section content_width_narrow'>
                    <h2>More</h2>
                    See the <a href="#!/about">about page</a> for the underlying publications, technical details and contributors.
                    <br/><br/>
                    For more paleomagnetic data analysis tools and tectonic applications, see <a href='https://paleomagnetism.org/' target="_blank">Paleomagnetism.org</a>
                </div>
            </div>
        )
    }

}
