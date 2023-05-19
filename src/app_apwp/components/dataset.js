import { m, helpers, options } from '../../shared/stdimports.js';

import './dataset.less';

//components
import { comp as Positionaldialog } from '../../shared/components/positionaldialog.js';
import { comp as Dialog } from '../../shared/components/dialog.js';
import { comp as Polarmap } from './polarmap.js'
import { comp as Input_text } from '../../shared/components/input_text.js';




export const comp = {

    oninit: function(vnode) {
        vnode.state.isOpen = {
            menu: false,
            remove: false,
            rename: false,
            bigmap: false,
        }

        //if the vnode.attrs.dataset.raw.file is a file, make a url of it. Otherwise (= demo data), the contents of vnode.attrs.dataset.raw.file is an URL itself, pointing to the file
        vnode.state.fileObjectURL = vnode.attrs.dataset.raw.file instanceof File ? URL.createObjectURL(vnode.attrs.dataset.raw.file) : vnode.attrs.dataset.raw.file;
        vnode.state.showMap = true;
        vnode.state.newDatasetName = undefined;

        //can be false (still loading the data), undefined (no data present) or an array with the data
        vnode.state.apwpData = false;
    },

    onremove: function(vnode) {
        if (vnode.state.fileObjectURL.startsWith("blob:")) {
            URL.revokeObjectURL(vnode.state.fileObjectURL)
        }
    },

    view: function(vnode) {
        let dataset = vnode.attrs.dataset;

        if (dataset === undefined) {
            return (
                <div class='comp dataset'>
                    <div class='card'>
                        <div class='info'>
                            <h4>Error...</h4>
                            <div>
                                <i>Something probally went wrong with importing this dataset...</i>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div class={`comp dataset ${vnode.attrs.isactive ? "isactive" : ""} ${vnode.attrs.isref ? "isref" : ""}`}>
                <div class='card'>
                    <Choose>
                        <When condition={vnode.state.showMap === false}>
                            {/* Show noting... (for example used to reset the polar map)  */}
                        </When>
                        <When condition={vnode.attrs.showapwp === true && dataset.results.apwp === undefined}>
                            <div class='noapwp'>
                                <span class='txt_error'>No APWP calculated for this dataset.</span>
                                <a href='#!/apwptool'>APWP Tool</a>
                            </div>
                        </When>
                        <Otherwise>
                            <Polarmap
                                poles={vnode.attrs.showapwp ? undefined : dataset.data.poles}
                                path={vnode.attrs.showapwp ? dataset.results.apwp : undefined}
                                projection={vnode.attrs.showapwp ? options.find("mapProjection", "EPSG:3575") : options.find("mapProjection", "EPSG:3857")}
                                width="13.5rem"
                                height="15rem"
                                controls={false}
                                exportName={dataset.name}
                                />
                        </Otherwise>
                    </Choose>

                    <div class='info'>
                        <h4>{dataset.name}</h4>
                        <div><a href={vnode.state.fileObjectURL}>{dataset.raw.name}</a> <small><i>({helpers.general.displayFileSize(dataset.raw.size)})</i></small></div>
                        <div>{dataset.data.length} poles</div>
                        <div style='flex-grow: 1;'></div>

                        <If condition={vnode.attrs.onActivate !== false}>
                            <Choose>
                                <When condition={vnode.attrs.isref && vnode.attrs.isactive}>
                                    <small style='line-height: 1rem;' class='txt_error'><i>Used as both reference and active set</i></small>
                                </When>
                                <When condition={vnode.attrs.isref}>
                                    <small class='txt_default_lesser'><i>Used as reference</i></small>
                                    <button class={`activate_button ${vnode.attrs.disabled ? "disabled" : ""}`} onclick={() => {vnode.attrs.onActivate(dataset)}}>
                                        Use this set
                                    </button>
                                </When>
                                <When condition={vnode.attrs.isactive}>
                                    <small class='txt_default_lesser'><i>This set is active</i></small>
                                </When>
                                <Otherwise>
                                    <button class={`activate_button ${vnode.attrs.disabled ? "disabled" : ""}`} onclick={() => {vnode.attrs.onActivate(dataset)}}>
                                        Use this set
                                    </button>
                                </Otherwise>
                            </Choose>
                        </If>

                    </div>


                </div>

                <button class={`btn_icon menu_button ${vnode.attrs.disabled ? "disabled" : ""}`} onclick={() => {vnode.state.isOpen.menu = !vnode.state.isOpen.menu}}>
                    <i class="fa-solid fa-bars fa-fw"></i>
                </button>
                <Positionaldialog fillcontainer={true} isOpen={vnode.state.isOpen.menu} onClose={() => {vnode.state.isOpen.menu = false}}>
                    <div class='menu'>
                        <a href='javascript:' onclick={(e) => {
                                e.redraw = false;
                                vnode.state.isOpen.menu = false;
                                vnode.state.showMap = false;
                                m.redraw.sync();
                                vnode.state.showMap = true;
                                m.redraw();
                            }}>
                            <i class="fa-solid fa-arrows-to-circle fa-fw"></i> Recenter map
                        </a>
                        <a onclick={() => {vnode.state.isOpen.bigmap = true; vnode.state.isOpen.menu = false; setAPWPdata(vnode);}} href='javascript:'>
                            <i class="fa-solid fa-arrows-maximize fa-fw"></i> Show fullscreen
                        </a>
                        <a onclick={() => {vnode.state.isOpen.rename = true; vnode.state.isOpen.menu = false}} href='javascript:'>
                            <i class="fa-solid fa-pencil fa-fw"></i> Rename dataset
                        </a>
                        <a href={vnode.state.fileObjectURL}>
                            <i class="fa-solid fa-download fa-fw"></i>Download {dataset.raw.name}
                        </a>
                        <a onclick={() => {vnode.state.isOpen.remove = true; vnode.state.isOpen.menu = false}} href='javascript:'>
                            <i class="fa-solid fa-trash-can fa-fw"></i> Remove dataset
                        </a>
                    </div>
                </Positionaldialog>

                <Dialog
                    isOpen={vnode.state.isOpen.rename}
                    onAnswer={(resp) => {onRename(vnode, resp)}
                }>
                    {/* key is needed so the old value will not remain the next time you open up this dialog. I know... not happy about it either */}
                    <div key={vnode.state.newDatasetName === undefined}>
                        <h4>Rename dataset</h4>
                        <Input_text
                            title = "Name:"
                            value = {vnode.state.newDatasetName ?? dataset.name}
                            onblur = {(val) => {
                                vnode.state.newDatasetName = val;
                            }}
                        />
                    </div>
                </Dialog>

                <Dialog
                    isOpen={vnode.state.isOpen.remove}
                    onAnswer={(resp) => {onRemove(vnode, resp)}
                }>
                    <h4>Are you sure?</h4>
                    Removing the dataset <i>{dataset.name}</i> can not be undone.
                </Dialog>

                <Dialog
                    isLightbox={true}
                    autowidth={true}
                    topmargin={"6vh"}
                    isOpen={vnode.state.isOpen.bigmap}
                    onAnswer={(resp) => {vnode.state.isOpen.bigmap = false;}
                }>
                    <Polarmap
                        poles={vnode.state.bigmapAPWP ? undefined : dataset.data.poles}
                        path={vnode.state.bigmapAPWP ? vnode.state.apwpData : undefined}
                        projection={vnode.state.bigmapAPWP ? options.find("mapProjection", "EPSG:3575") : options.find("mapProjection", "EPSG:3857")}
                        width="80vw"
                        height="88vh"
                        controls={true}
                        exportName={dataset.name}
                        />

                    <button style='right: 3rem;' class={`btn_icon menu_button ${vnode.state.apwpData ? "" : "disabled"}`} onclick={() => {vnode.state.bigmapAPWP = !vnode.state.bigmapAPWP}}>
                        <Choose>
                            <When condition={vnode.state.apwpData === false}>
                                loading...
                            </When>
                            <When condition={vnode.state.apwpData === undefined}>
                                No custom APWP calculated
                            </When>
                            <When condition={vnode.state.bigmapAPWP}>
                                <span key={"polesicon"}><i class="fa-duotone fa-chart-scatter-3d fa-fw" style="--fa-secondary-opacity: 0;"></i> Show poles</span>
                            </When>
                            <Otherwise>
                                <span key={"apwpcion"}><i class="fa-solid fa-bezier-curve fa-fw"></i> Show APWP</span>
                            </Otherwise>
                        </Choose>
                    </button>


                </Dialog>

            </div>

        )
    }

}


function onRename(vnode, resp) {
    vnode.state.isOpen.rename = false;
    if (resp) {
        let newDataset = Object.assign({}, vnode.attrs.dataset);
        newDataset.name = vnode.state.newDatasetName;
        helpers.docstore.set("dataset", newDataset).then((dataset) => {
            vnode.attrs.onDatasetchanged(dataset);
        })
    }

    vnode.state.newDatasetName = undefined;
}

function onRemove(vnode, resp) {
    vnode.state.isOpen.remove = false;
    if (resp) {
        //remove all calculations
        vnode.attrs.dataset.calculations.forEach((calcId) => {
            helpers.docstore.remove("calculation", calcId);
        });

        //remove the dataset itself, then notify the parent component somethings changed
        helpers.docstore.remove("dataset", vnode.attrs.dataset.id).then(() => {
            vnode.attrs.onDatasetchanged();
        })
    }
}

function setAPWPdata(vnode) {
    helpers.docstore.getFull("dataset", vnode.attrs.dataset.id).then((fullDataset) => {
        vnode.state.apwpData = fullDataset.calculations.filter((c) => {return c.type === "apwp" && c.status === "done"}).sort((a,b) => {return b.created - a.created})[0]?.results;
        m.redraw();
    })
}
