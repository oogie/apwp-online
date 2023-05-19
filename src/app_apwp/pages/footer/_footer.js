import { m, config } from '../../../shared/stdimports.js';


//styling
import './_footer.less';

//images
import LOGO_nwo from '../../assets/LOGO_nwo.png';
import LOGO_uu from '../../assets/LOGO_uu.svg';


export const page = {

    view: function(vnode) {
        return (
            <div class="page footer">
                <div class='content content_width_standard'>
                    <div>
                        <h4>APWP-online</h4>
                        <a href='#!/'>Home</a><br/>
                        <a href='#!/apwptool'>APWP Tool</a><br/>
                        <a href='#!/rpdtool'>RPD Tool</a><br/>
                        <a href='#!/referencedatabase'>Reference database</a><br/>
                        <a href='#!/about'>About</a>
                    </div>

                    <div>
                        <h4>Contact</h4>
                        <div class='flex'>
                            <div>
                                <a href="mailto:info@apwp-online.org">info@apwp-online.org</a><br/>
                            </div>
                            <small>
                                Department of Earth Sciences<br/>
                                Utrecht University,<br/>
                                Vening Meinesz Building A,<br/>
                                Princetonlaan 8A,<br/>
                                3584 CB Utrecht, Netherlands
                            </small>
                        </div>

                    </div>

                    <div>
                        <h4>Supported by</h4>
                        <div class='logos'>
                            <a href="https://www.nwo.nl/"><img src={LOGO_nwo}></img></a>
                            <a href="https://www.uu.nl/"><img src={LOGO_uu}></img></a>
                        </div>
                    </div>
                </div>

                <div class='siteinfo'>
                    <small>&copy; 2022 - {new Date().getFullYear()}, version {config.version.apwp}</small>
                </div>
            </div>
        )
    }

}
