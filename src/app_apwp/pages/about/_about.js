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
                    <a href="https://doi.org/10.31223/X5WD44" target="_blank">
                        <img src="https://zenodo.org/badge/DOI/10.31223/X5WD44.svg" alt="DOI" style='vertical-align: text-bottom;' />
                    </a>
                    &nbsp;about apwp-online.org.<br />

                    <a href="https://doi.org/10.1029/2022JB023953" target="_blank">
                        <img src="https://zenodo.org/badge/DOI/10.1029/2022JB023953.svg" alt="DOI" style='vertical-align: text-bottom;' />
                    </a>
                    &nbsp;about the Global APWP.
                </div>

                <div class='section content_width_standard flexequal'>
                    <div>
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

                        <span>
                            The complete (Python) source code will available on GitHub soon
                        </span>

                        {/* <a href="http://github.com/sj/paleolatitude" class='unobtrusive' target="_blank">
                            <div class='githubpromo flex'>
                                <i class="fa-brands fa-github fa-5x"></i>
                                <span>
                                    <a href='http://github.com/sj/paleolatitude' target="_blank">github.com/sj/paleolatitude</a><br />
                                    <small class='txt_default_lesser'>@sj - Bas van Schaik</small>
                                </span>
                            </div>
                        </a> */}

                        <h4>Data license</h4>
                        <span>
                            All (geophysical) (demo) data that is published on this web site is made available to the public domain.
                        </span>

                        <div class='section'></div>
                        <h3>Privacy and data security statement</h3>
                        <span>
                            All data uploaded to our server via the form on the Reference Database page is handled with
                            care. It is not allowed to upload any sensitive or personal data to our servers.
                        </span>

                        <div class='section'></div>
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

                            <br />
                            <button class='btn' onclick={(e) => { exportDocStore(vnode) }}>Export all locally stored data to a file (experimental)</button>
                        </span> 


                    </div>

                    <div>
                        <h3>GAPWaP-Database Steering Committee</h3>
                        A steering committee will once a year update the paleomagnetic database
                        behind the global APWP that is running on this website. Once this is done, 
                        a new version of the APWP will be published on this site, and if significant changes occur, 
                        an accompanying peer-reviewed publication will follow. The current composition of the 
                        steering committee is:

                        <ul>
                            <li>
                                Bram Vaes  (Utrecht University, the Netherlands)
                            </li>
                            <li>
                                Douwe van Hinsbergen (Utrecht University, the Netherlands)
                            </li>
                            <li>
                                Lydian Boschman (Utrecht University, the Netherlands)
                            </li>
                            <li>
                                Peter Lippert (University of Utah at Salt Lake City, USA)
                            </li>
                            <li>
                                Guillaume Dupont-Nivet (Géosciences Rennes, France)
                            </li>
                            <li>
                                Mat Domeier (University of Oslo, Norway)
                            </li>
                            <li>
                                Nick Swanson-Hysell (University of California at Berkeley, USA)
                            </li>
                            <li>
                                Wentao Huang (Institute of Tibetan Plateau Research of the Chinese Academy of Sciences, Beijing, China)
                            </li>
                        </ul>

                        <br /><br />
                        <h3>APWP-Online development team</h3>
                        <br />
                        <span>
                            {TEAM_Vaes}
                            {TEAM_Hinsbergen}
                            {TEAM_Paridaens}
                        </span>


                        <h3>Changelog</h3>
                        <div class='versionheader'>
                            <h4>Version 1.0</h4>
                            <span>&mdash; May 2023</span>
                        </div>
                        <ul>
                            <li>Release of version 1.0</li>
                        </ul>

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
            Bram currently works as a PhD Candidate on the TRIGGER project, led by Prof. Douwe van
            Hinsbergen, in which he mainly focuses on developing new approaches to the tectonic
            applications of paleomagnetism. The main aim of his project is to construct a new global
            apparent polar wander path, that serves as a paleomagnetic reference frame for paleogeograpy,
            paleoclimate and tectonic studies.
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