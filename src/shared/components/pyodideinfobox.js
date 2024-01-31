import { m, helpers } from '../../shared/stdimports.js';

import './pyodideinfobox.less';


//GLOBAL VARIABLES, will the shared by all instances of this component
let messages = [];

export const comp = {

    oninit: function oninit(vnode) {

    },

    view: function view(vnode) {
        return (
            <div class={`comp pyodideinfobox ${messages.length === 0 ? "hidden" : ""}`} >
                {messages.filter((msg) => {return msg.messagetime > 0}).length === 0 ? "" : (
                    <div class='close' onclick={() => {messages = messages.filter((msg) => {return msg.messagetime < 0})}}>
                        <i class="fa-solid fa-xmark fa-xl"></i>
                    </div>
                )}


                {messages.map((msg) => {

                    msg.content = (msg.content ?? "").replace("##__consoleShortcut__##", `(${localStorage.getItem("consoleShortcut")})`);

                    return (
                        <div class='message'>
                            <div class='title'>
                                <span key={msg.spinner ? "spinner" : "nospinner"}>
                                    {msg.spinner ? <i class="spinner fa-solid fa-gear fa-fw fa-spin"></i> : ""}
                                </span>
                                <span key="title">
                                    {m.trust(msg.title)}
                                </span>
                            </div>

                            <div class='content'>
                                {m.trust(msg.content)}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    },


    show: function show(newMsg) {
        //newMsg can be something of the form:
        // {
        //  title: "Calculated APWP"
        //  content: "It took 0.0212s"
        //  messagetime: 3000 //make it -1 to keep this message until the next message comes along, 0 to not show up or undefined to use the default messagetime
        // }

        //keep the message up until the next message unless defined otherwise
        if (newMsg.messagetime === undefined) newMsg.messagetime = -1

        //show a spinner unless defined otherwise
        if (newMsg.spinner === undefined) newMsg.spinner = true;

        //set a random uuid as message id
        newMsg.id = helpers.general.uuid();

        //remove all messages that should be cleared when the next message comes along
        messages = messages.filter((msg) => {
            return msg.messagetime > 0;
        })

        //add the starting time to the message, so it we know when to remove it later
        newMsg.starttime = Date.now();

        //add the new message to the list
        messages.push(newMsg)

        //remove all outdated messages
        removeOutdatedMessages()

        m.redraw();
    }
}


function removeOutdatedMessages() {
    const curTime = Date.now();
    const oldCount = messages.length;

    messages = messages.filter((msg) => {
        //if messagetime is negative, it will be removed when the next message comes along by the comp.show() function. Dont remove it here.
        if (msg.messagetime < 0) {
            return true;
        }
        //filter message out if the starttime + messagetime is greater then the time now
        else {
            return (msg.starttime + msg.messagetime > curTime)
        }
    });

    if (oldCount !== messages.length) {
        m.redraw();
    }

    if (messages.length > 0) {
        window.setTimeout(removeOutdatedMessages, 150)
    }
}
