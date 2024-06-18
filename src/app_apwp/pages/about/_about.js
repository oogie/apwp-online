import { m, helpers } from '../../../shared/stdimports.js';


//styling
import './_about.less';

//components
import { comp as Dialog } from '../../../shared/components/dialog.js';


//photos
import PHOTO_Hinsbergen from '../../assets/team/Hinsbergen.jpg';
import PHOTO_Vaes from '../../assets/team/Vaes.jpg';
import PHOTO_Paridaens from '../../assets/team/Paridaens.jpg';


export const page = {

    oninit: function(vnode) {
        vnode.state.isOpen = {
            clearDocStore: false,
        }

    },

    onremove: function(vnode) {

    },

    view: function(vnode) {
        return (
            <div class="page about">
                <div class='section explainer content_width_narrow_left'>
                    <h2>About APWP-online</h2>
                    User-friendly tools to compute apparent polar wander paths (APWPs) from
                    site-level paleomagnetic data and to determine relative paleomagnetic displacements.
                    
                    <br/><br/>
                    For more information see our papers:<br/>
                    <a href="https://doi.org/10.55575/tektonika2024.2.1.44" target="_blank">
                        <img src="https://zenodo.org/badge/DOI/10.55575/tektonika2024.2.1.44.svg" alt="DOI" style='vertical-align: text-bottom;' />                
                        &nbsp;about apwp-online.org. (2024)<br/>
                    </a>

                    <a href="https://doi.org/10.1016/j.earscirev.2023.104547" target="_blank">
                        <img src="https://zenodo.org/badge/DOI/10.1016/j.earscirev.2023.104547.svg" alt="DOI" style='vertical-align: text-bottom;' />
                        &nbsp;about the global APWP (2023)<br />
                    </a>

                    <a href="https://doi.org/10.1029/2022JB023953" target="_blank">
                        <img src="https://zenodo.org/badge/DOI/10.1029/2022JB023953.svg" alt="DOI" style='vertical-align: text-bottom;' />
                        &nbsp;about the statistical methods. (2022)<br />
                    </a>
                </div>

                <div class='section content_width_standard flexequal'>
                    <div>
                        <h3>How to cite</h3>
                        When using apwp-online.org for your research, please cite our work. The following citation is suggested:
                        <span>
                            <blockquote>
                                Vaes, B., van Hinsbergen, D., & Paridaens, J. (2024). APWP-online.org: a Global Reference Database
                                and Open-Source Tools for Calculating Apparent Polar Wander Paths and Relative Paleomagnetic
                                Displacements. τeκτoniκa, 2(1), 173–188. https://doi.org/10.55575/tektonika2024.2.1.44
                            </blockquote>
                        </span>
                        <br /><br />

                        <h3>Code and Data</h3>
                        <span>
                            If you use apwp-online.org and/or its source code for research purposes, we kindly
                            ask you to cite our work. The code 
                            and data licenses are detailed below.
                        </span>
                        <br /><br />

                        <h4>Source code license</h4>
                        <span>
                            All source code of apwp-online.org is available under the GNU General Public License v3.
                            This license allows for free use and redistribution of the
                            source code.
                        </span>
                        <br/><br/>
                        <b>
                            The source code of this webapplication:
                        </b>

                        <a href="https://github.com/oogie/apwp-online" class='unobtrusive' target="_blank">
                            <div class='githubpromo flex'>
                                <i class="fa-brands fa-github fa-5x"></i>
                                <span>
                                    <a href='https://github.com/oogie/apwp-online' target="_blank">github.com/oogie/apwp-online</a><br />
                                    <small class='txt_default_lesser'>@oogie - Joren Paridaens</small>
                                </span>
                            </div>
                        </a>
                        <br />

                        <div class='section'>
                            <h3>Locally stored data</h3>
                            <span>
                                Imported datasets and computation results are stored locally in your browser. This data is not
                                shared with any one other than you. 
                                <br/><br />
                                <button class='btn' onclick={(e) => {
                                    vnode.state.isOpen.clearDocStore = true;
                                }}>Delete all locally stored data</button>

                                <Dialog
                                    isOpen={vnode.state.isOpen.clearDocStore}
                                    onAnswer={(resp) => { clearDocStore(vnode, resp); }}>
                                    <h4>Are you sure?</h4>
                                    Removing all locally stored data can not be undone! All uploaded datasets and computation results will be lost.
                                </Dialog>

                                {/* <br /> */}
                                {/* <button class='btn' onclick={(e) => { exportDocStore(vnode) }}>Export all locally stored data to a file (experimental)</button> */}
                            </span> 
                        </div>

                        <div class='section changelog'>
                            <h3>Changelog</h3>
                            <div class='versionheader'>
                                <h4>Version 1.2</h4>
                                <span>&mdash; May 2024</span>
                            </div>
                            <ul>
                                <li>Updated: the user manual</li>
                                <li>Added: slat, slon and name columns to the xlsx/csv output of the APWP tool</li>
                                <li>Added: the ability to use the output files of the APWP tool as input dataset</li>
                                <li>Fixed: the demo data can no longer be loaded in multiple times</li>
                                <li>Fixed: a python runtime error when the input columns lithology or plateID missing</li>
                                <li>Fixed: various small textual errors throughout the website</li>
                            </ul>

                            <div class='versionheader'>
                                <h4>Version 1.1</h4>
                                <span>&mdash; Feb 2024</span>
                            </div>
                            <ul>
                                <li>Added: the user manual</li>
                                <li>Added: the values ref_dec ref_inc ref_mean_N ref_mean_K to the output of the RDP tool</li>
                                <li>Added: the RDP tool will give a warning when <code>N_ref &lt; N</code> or <code>K &lt; 10</code> for any pole</li>
                                <li>Added: option to import and export with .csv files</li>
                                <li>Added: better input validation and error messages</li>
                                <li>Fixed: any setting where the input was <code>0</code> was set to the default (e.g. Minimum age became 5ma instead of 0ma)</li>
                                <li>Fixed: the reference data of the plate 101 (North America) was only available up until 100ma, this is now up to 320ma</li>
                                <li>Fixed: various small textual errors throughout the website</li>
                            </ul>

                            <div class='versionheader'>
                                <h4>Version 1.0</h4>
                                <span>&mdash; May 2023</span>
                            </div>
                            <ul>
                                <li>Beta release of version 1.0</li>
                            </ul>
                        </div>


                    </div>

                    <div>
                        <h3>GAPWaP-Database Steering Committee</h3>
                        A steering committee will once a year update the paleomagnetic database
                        behind the global APWP that is running on this website. Once this is done, 
                        a new version of the APWP will be published on this site, and if significant changes occur, 
                        an accompanying peer-reviewed publication will follow. 
                        {/* The current composition of the steering committee is: */}

                        <br/><br/>
                        The members of the 2024 committee will be appointed soon and listed here.

                        {/* <ul>
                            <li>
                                Bram Vaes<br/>
                                <small>Utrecht University, the Netherlands; now at University of Milano-Bicocca, Italy</small>
                            </li>
                            <li>
                                Douwe van Hinsbergen<br/>
                                <small>Utrecht University, the Netherlands</small>
                            </li>
                            <li>
                                Lydian Boschman<br/>
                                <small>Utrecht University, the Netherlands</small>
                            </li>
                            <li>
                                Peter Lippert<br/>
                                <small>University of Utah at Salt Lake City, USA</small>
                            </li>
                            <li>
                                Guillaume Dupont-Nivet<br/>
                                <small>Géosciences Rennes, France</small>
                            </li>
                            <li>
                                Mat Domeier<br/>
                                <small>University of Oslo, Norway</small>
                            </li>
                            <li>
                                Nick Swanson-Hysell<br/>
                                <small>University of California at Berkeley, USA</small>
                            </li>
                            <li>
                                Wentao Huang<br/>
                                <small>Institute of Tibetan Plateau Research of the Chinese Academy of Sciences, Beijing, China</small>
                            </li>
                        </ul> */}

                        <div class="section">
                            <h3>APWP-Online development team</h3>
                            <br />
                            <span>
                                {TEAM_Vaes}
                                {TEAM_Hinsbergen}
                                {TEAM_Paridaens}
                            </span>
                        </div>

                   </div> 

                </div>

            </div>
        )
    }

}


const TEAM_Vaes = (
    <div class='teammember'>
        <h4>Bram Vaes</h4>
        <img src={PHOTO_Vaes} />
        <span>
            Bram currently works as a postdoctoral researcher in the Coupled Earth Systems Group at the University of Milano-Bicocca, studying the interactions between tectonics and climate in the Cenozoic. Bram obtained his PhD in June 2023 at Utrecht University, during which he developed a new approach to using paleomagnetism for tectonic and paleogeographic applications. The main result of his project is a global apparent polar wander path that serves as a paleomagnetic reference frame for paleogeograpy, paleoclimate and tectonic studies. 
        </span>
    </div>
)

const TEAM_Hinsbergen = (
    <div class='teammember'>
        <h4>Douwe J.J. van Hinsbergen</h4>
        <img src={PHOTO_Hinsbergen} />
        <span>
            Douwe received his PhD degree in Geology from Utrecht University in 2004, subsequently worked
            at universities in the UK and Norway, and is currently Full Professor, Chair in Global 
            Tectonics and Paleogeography in Utrecht. He specializes in plate and paleogeography 
            reconstructions, especially of intensely deformed convergent margins, and has a taste for 
            developing quantitative online tools for paleomagnetism, paleogeography, and mantle dynamics.
        </span>
    </div>
)

const TEAM_Paridaens = (
    <div class='teammember'>
        <h4>Joren Paridaens</h4>
        <img src={PHOTO_Paridaens} />
        <span>
            Since 2015 Joren is working with various companies and academic institutions to develop large or 
            specialised webapplications as a freelancer. With a wide range of experience in webdevelopment,
            design and project management he is always up for a conversations about your interesting problem.
        </span>
    </div>
)



function clearDocStore(vnode, resp) {
    if (resp) {
        helpers.docstore.clear();
    }

    vnode.state.isOpen.clearDocStore = false;
    m.redraw();
}

function exportDocStore() {
    helpers.docstore.getAll().then((data) => {
        let serialized = helpers.general.serialize(data);
        helpers.general.downloadFile('paleolatitude_docstore.txt', serialized);
    });
}