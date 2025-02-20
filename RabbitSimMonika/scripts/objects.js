
const beep = new Audio(src = "audio/beep.mp3");

class ChatLine {
    content = "";
    watching = -1;//if this is a value, change the watching to this when it beeps
    offset = 0;//offset from when you were asked to render.
    constructor(offset, content, watching=-1) {
        this.offset = offset;
        this.content = content;
        this.watching = watching;
    }

    //imeediate if we're jumping around in time
    renderSelf = (target, scrollTarget, immediate) => {
        if (immediate) {
            const p = createElementWithParentAndClass("p", target);
            p.innerHTML = this.content;
            //scrollTarget.scrollTop = scrollTarget.scrollHeight;
            //beep.play();
            if (this.watching >= 0) {
                const status = document.querySelector("#status");
                status.innerText = `${this.watching} Watching`;
            }
        } else {
            setTimeout(() => {
                const p = createElementWithParentAndClass("p", target);
                p.innerHTML = this.content;
                if (target.isConnected) { //if its been removed cuz the loop changed, don't bother
                    scrollTarget.scrollTop = scrollTarget.scrollHeight + 50;

                    if (this.watching >= 0) {
                        const status = document.querySelector("#status");
                        status.innerText = `${this.watching} Watching`;
                    }

                    beep.play();
                }

            }, this.offset * 1000)

        }

    }


}

class ChatItem {
    icon_src;
    name;
    isMe = false;
    targetTimecode; //NOT display time code. display time code is when it actually went on screen, local time
    displayTimecode;
    lines = []; //chat lines
    constructor(name, icon_src, targetTimecode, lines) {
        this.name = name;
        this.icon_src = icon_src;
        this.targetTimecode = targetTimecode;
        this.lines = lines;
    }

    //the video is currentlyTime, so we can assume it started playing videoTime seconds ago.
    //so this message SHOULD have gone out 
    calculatePastTime = (videoTime) => {
        videoTime = videoTime * 1000;
        //console.log("JR NOTE: calculating past time videoTime is",videoTime)
        const now = new Date().getTime();
        //console.log("JR NOTE: now is", new Date(now).toLocaleTimeString());
        const videoStart = new Date(now - videoTime).getTime();
        //console.log("JR NOTE: videoStart is", new Date(videoStart).toLocaleTimeString());

        const whenThisMessageWentOutInThePast = new Date(videoStart + this.targetTimecode * 1000);
        //console.log("JR NOTE: whenThisMessageWentOutInThePast is", whenThisMessageWentOutInThePast.toLocaleTimeString());

        return whenThisMessageWentOutInThePast.toLocaleTimeString();
    }

    renderSelf = (target, timecode) => {
        /*
        <div class="your chat">
          <img class="circle chat-icon"
            src="http://farragofiction.com/TwoGayJokes/Stories/MurderGameIcons/theend.png" />
          <div class="chat-header">

            <div class="name">theEnd</div>
            <div class="timestamp">12:03 am</div>
          </div>
          <div class="chat-content">

            <p>...</p>
            <p>:(</p>
          </div>
        </div>
        */
        const container = createElementWithParentAndClass("div", target, `${this.isMe ? "my" : "your"} chat`);
        const img = createElementWithParentAndClass("img", container, "circle chat-icon");
        img.src = this.icon_src;
        const header = createElementWithParentAndClass("div", container, "chat-header");
        const name = createElementWithParentAndClass("div", header, "name");
        name.innerHTML = this.name;
        const timestamp = createElementWithParentAndClass("div", header, "timestamp");
        if (timecode > this.targetTimecode + 10) {
            timestamp.innerHTML = ` ${this.calculatePastTime(timecode)}`;//you went out in the past

        } else {
            timestamp.innerHTML = ` ${new Date().toLocaleTimeString()}`;//you went out now

        }
        target.scrollTop = target.scrollHeight + 50;
        const content = createElementWithParentAndClass("div", container, "chat-content");
        for (let line of this.lines) {
            line.renderSelf(content, target, timecode > this.targetTimecode + 10); //if i was supposed to render more than ten seconds ago, no async behavior plz (useful for fastforward and)
        }

    }


}


//they're into homestuck and the magnus archives
//and they thought they'd get to show their friends some music videos from both fandoms
//but they ditched them :( :( :(
/*
you know what
thats their quirk
they have that perma copied and pasted
and tahts what they post instead of sad faces (the glithced out text)
because of an injoke
with the friends who ditched them
*/
class lonelyAltruist extends ChatItem {
    isMe = true;
    constructor(targetTimecode, lines) {
        super("lonelyAltruist", "icons/LA.png", targetTimecode, lines);
    }
}

//Belief and friends drew them to Zampanio but didn't mean to
//they're glad for the company but...
//whoops
//they're very paranoid about ai doppelgangers
class flowersForAlgorithm extends ChatItem {
    isMe = true;
    constructor(targetTimecode, lines) {
        super("flwrs4Algorithm", "icons/flower.png", targetTimecode, lines);
    }
}

class iWantToBelieve extends ChatItem {
    isMe = true;
    constructor(targetTimecode, lines) {
        super("iWantToBelieve", "icons/ufo.PNG", targetTimecode, lines);
    }
}

class uMad extends ChatItem {
    isMe = true;
    constructor(targetTimecode, lines) {
        super("uMad", "icons/umad.PNG", targetTimecode, lines);
    }
}

class hatsuneMikuFan1997 extends ChatItem {
    isMe = true;
    constructor(targetTimecode, lines) {
        super("mikuFan1997", "icons/miku.PNG", targetTimecode, lines);
    }
}

class asinineAssasin extends ChatItem {
    isMe = true;
    constructor(targetTimecode, lines) {
        super("asinineAssasin", "icons/ass.PNG", targetTimecode, lines);
    }
}

class Rando1 extends ChatItem {
    isMe = true;
    constructor(targetTimecode, lines) {
        super("Rando1", "http://farragofiction.com/TwoGayJokes/Stories/MurderGameIcons/k.png", targetTimecode, lines);
    }
}

class Rando2 extends ChatItem {
    constructor(targetTimecode, lines) {
        super("Rando2", "http://farragofiction.com/TwoGayJokes/Stories/MurderGameIcons/theshot.png", targetTimecode, lines);
    }
}

const createElementWithClass = (eleName, className) => {
    const ele = document.createElement(eleName);
    if (className) {
        ele.className = className;
    }
    return ele;
}

const createElementWithParentAndClass = (eleName, parent, className) => {
    const ele = createElementWithClass(eleName, className);
    parent.append(ele);
    return ele;
}

