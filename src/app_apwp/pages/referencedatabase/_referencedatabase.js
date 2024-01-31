import { m, helpers, options } from '../../../shared/stdimports.js';


//styling
import './_referencedatabase.less';

//assets
import GAPWP23 from '../../assets/Vaes_et_al_2023_global_APWP.zip';

//components
import { comp as Input_select } from '../../../shared/components/input_select.js';
import { comp as Input_text } from '../../../shared/components/input_text.js';
import { comp as Loaddataset } from '../../components/loaddataset.js'
import { comp as Dataset } from '../../components/dataset.js'


export const page = {

    oninit: function(vnode) {
        vnode.state.form = {
            name: "",
            institute: "",
            data: [],
            email: "",
            about: "",
            publication: ""
        }
    },

    onremove: function(vnode) {

    },

    view: function(vnode) {
        return (
            <div class="page referencedatabase">
                <div class='section content_width_narrow_left'>
                    <h2>Reference Database</h2>
                    This portal hosts the reference database that underpins the global APWP for the last 320 Ma from Vaes et al. (2023).
                    <br/><br/>
                    Below, the most recent version of the global APWP – in the coordinate frame of all major tectonic plates - can be accessed and downloaded, as well as the paleomagnetic database and the global plate circuit, which underlie the computation of the APWP.
                    This portal provides a platform where future updates of the global APWP will be made available.
                </div>

                <div class='section content_width_standard'>
                    <h2>Version history Global APWP</h2>
                    <div class='versions'>
                        <div class="txt_primary">Name</div>
                        <div class="txt_primary mobile_hidden">Publication date</div>
                        <div class="txt_primary mobile_hidden">Authors</div>
                        <div class="txt_primary">DOI</div>
                        <div class="txt_primary">Download model</div>

                        <div>gAPWP23</div>
                        <div class='mobile_hidden'>22 september 2023</div>
                        <div class='mobile_hidden'>Bram Vaes et al.</div>
                        <a href="https://doi.org/10.1016/j.earscirev.2023.104547" target="_blank">
                            <img src="https://zenodo.org/badge/DOI/10.1016/j.earscirev.2023.104547.svg" alt="DOI" />
                        </a>
                        <div><a href={GAPWP23}>Download zip (354 kB)</a></div>
                    </div>
                </div>

                <div class='section content_width_standard'>
                    <h2>Contribute to the next global APWP</h2>
                    <div class='content_width_narrow_left'>
                        We encourage researchers to submit new, high-quality paleomagnetic data obtained from stable plate interiors – after publication in a peer-reviewed journal – that may be included in the database.
                        We also welcome new age data that provides better constraints on the rock and/or magnetization age of the paleomagnetic data that is included in the database.
                        <br/><br/>
                        <h4>How to submit your data</h4>
                        Send us an email on:
                        <br /><br />

                        <center>
                            <h2><a href="mailto:info@apwp-online.org">info@apwp-online.org</a></h2>
                        </center>
                        <br /><br />

                        Please provide:
                        <ul>
                            <li>The dataset, preferable in a format APWP-online.org accepts</li>
                            <li>A description of the data</li>
                            <li>A reference/link to publication</li>
                            <li>Your affiliated institute</li>
                        </ul>

                    </div>
                </div>
            </div>
        )
    }

}
