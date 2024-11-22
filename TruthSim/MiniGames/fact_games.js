/*
doc slaughter, k, and the twins all have mini games that let you interact with facts directly

river should let you do the save editing
*/

class TwinsMiniGame extends MiniGame {
    constructor() {
        super(TWINSMINIEGAME);
    }
    offerMade = false;

    singleFactInfoDump = (fact, ele, room, callback) => {
        const devonalabel = createElementWithClassAndParent("div", ele);
        //she adds all the emphasis she can to the point its hard to tell whats going on
        const isItUseful = fact.changesAMiniGame ? `You Can Use It For Something! (Sorry I Can't Say :())` : ``; //the Fragmnts of the Univere that spill from her mouth would drive you mad
        const doesItHaveSecrets = fact.secret ? `It Has A Secret (Sorry I Can't Say :())` : "";//the Fragmnts of the Univere that spill from her mouth would drive you mad
        devonalabel.innerHTML = `<hr><u style='font-family: Courier New'><img height="31" src='images/devona_twin_by_guide.png'>Devona says: 'Here's Everything I Know About <i><b>'${fact.title}'</b></i> I Hope It's Okay! ${isItUseful} ${doesItHaveSecrets}'</u><br><br>` //because she is too much information all at once not using css for her, she is all in the html, a mess of content and design that is practically unreadable

        const stats = createElementWithClassAndParent("div", ele);
        stats.innerHTML = `Attack: ${fact.damage_multiplier.toFixed(2)} Defense: ${fact.defense_multipler.toFixed(2)} Speed: ${fact.speed_multipler.toFixed(2)} <br>Themes: ${fact.theme_key_array.join(",")}`;
        const infodump = createElementWithClassAndParent("div", ele);
        infodump.style.padding = '31px';
        infodump.style.border = "1px dashed yellow";
        infodump.style.marginLeft = "auto";
        infodump.style.marginRight = "auto";
        infodump.style.width = "50%";
        infodump.style.background = "black";
        infodump.style.lineHeight = "18px";
        infodump.style.fontSize = "14px";
        infodump.style.fontFamily = "Courier New";



        infodump.style.marginBottom = "13px";
        infodump.innerHTML = fact.lore_snippet.replaceAll("\n", "<br>");
        if (fact.isIrrelevant) {
            infodump.onmouseenter = () => {
                this.offerToErase(ele, room, callback);
            }

            infodump.onclick = () => {
                this.offerToErase(ele, room, callback);
            }
        }

        const buttonLabel = createElementWithClassAndParent("div", ele, "void neville-button"); //while neville is entirely css, even the text, don't worry you don't need to see anything :) :) :)

        const button = createElementWithClassAndParent("button", buttonLabel); //while neville is entirely css, even the text, don't worry you don't need to see anything :) :) :)
        button.innerText = "Forget?"
        button.onclick = async () => {
            increaseTruthBy(globalDataObject.truthPerSecond * 60); //neville gives you a full minute of truth if you delete a specific fact but doesn't tell you , void players amirite

            globalDataObject.factsUnlocked = removeItemOnce(globalDataObject.factsUnlocked, fact);

            if (fact === this.fact) {
                this.fact = undefined; //forget about it
            }
            this.startGame(ele, room, callback);
        }
    }

    offerToErase = (ele, room, callback) => {
        if (this.offerMade) {
            return; //only make it once per visit
        }
        this.offerMade = true;

        const popup = createElementWithClassAndParent("div", document.querySelector("body"), "void-popup");
        const popupbody = createElementWithClassAndParent("div", popup);
        //i am not masochistic enough to put all this in the stylesheet like the other neville bit but i WILL commit to the bit enough to make most of the text faded instead of bolding the call to action
        popupbody.innerHTML = `
  <img style="float:left; margin-right:42px; margin-bottom:42px;" src="images/neville_twin_by_guide.png">
  <p><span style="opacity: 55%">haha whoops, looks like some irrelevant facts snuck in there :)<br><br><br><br> all pretending to make sense and untill you can barely even see what matters...</span> <br><br><br><br>want me to get rid of them all for you? </p>`;

        const buttonContainer = createElementWithClassAndParent("div", popupbody);

        const buttonYes = createElementWithClassAndParent("button", buttonContainer);
        buttonYes.innerText = "sure thing :)";
        const buttonNo = createElementWithClassAndParent("button", buttonContainer);
        buttonNo.innerText = "No I Kin Devona In Case That Was Not Clear And Prefer The Clutter Because What If Its Useful?";


        const myPromise = new Promise((resolve, reject) => {
            buttonNo.onclick = () => {
                popup.remove();
                //just in case somehow theres multiple
                document.querySelectorAll(".void-popup").forEach((x) => x.remove());
                resolve(true);
            }

            /*
            it works
            my precious boi
            so useful
            honeslty neville and vik are keeping me sane
            it turns out the infinitely spiralling maze ends up being really cluttery without void players
            no WONDER the echidna is so fucked if wanda doesn't have the Witness to counter her
            */
            buttonYes.onclick = () => {
                popup.remove();
                removeAllIrrelevantFactsFromData();
                this.fact = undefined; //get distracted from focusing on just one and look at what remains (easier on me)
                console.log("JR NOTE: trying to restart game")
                this.startGame(ele, room, callback);

                document.querySelectorAll(".void-popup").forEach((x) => x.remove());
                resolve(true);
            }
        });

        return myPromise;
    }


    respondsToFact = (fact) => {
        //console.log("JR NOTE: twins should respond to a fact involving one of them dying by breaching")
        return false;
    }

    startGame = (ele, room, callback) => {
        ele.innerHTML = "";
        const container = createElementWithClassAndParent("div", ele, "void");
        const header = createElementWithClassAndParent("div", container);
        header.innerHTML = `<u>${globalDataObject.factsUnlocked.length} Facts Total<br><br><hr>`;

        const button = createElementWithClassAndParent("button", container);
        button.innerText = "Erase All Facts With No Purpose?"
        button.onclick = () => {
            if (window.confirm("Even if You Do Not Know What Criteria 'Purpose' Has?")) {
                removeAllFactsThatHaveNoUseOrSecret();
                this.startGame(ele, room, callback);
            }
        }


        if (this.fact) {
            this.singleFactInfoDump(this.fact, container, room, callback);
        } else {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const date = new Date();
            let facts = globalDataObject.factsUnlocked;
            //thanks devona
            if (urlParams.get("fragments") === "universe") {
              truthLog("Be Cautious.","It seems you believe that Mortal Minds are capable of storing all the Fragments of the Universe Within. Devona would warn you, if she could.")
              facts = all_facts;
            }

            for (let fact of facts) {
                this.singleFactInfoDump(fact, container, room, callback);
            }
        }

        this.valuableCustomer(container, callback);

    }


    valuableCustomer = (ele, callback) => {
        const button = createElementWithClassAndParent("button", ele);
        button.innerText = "The Twins Are Just Happy To InfoDump, You're Free To Leave!";
        button.onclick = async () => {
            await truthPopup("You learned about facts!", "Was it fun? It looked fun!", "Yes. It seems this is actually good. Learning more information about the various spirallling plots of Zampanio seems to draw many people in. Continue. Additionally, I appreciate the female twin, Devona's, attempt to map me.");
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }

    }

    render = (ele, room, callback) => {

        this.initializeRender(ele);
        const title = this.fact ? "Fact Chosen: " + this.fact.title : "Wait! Wait!!! What Fact Did You Want To Know About Oh God I Don't Know What To Do, Neville, Maybe I Should Just Pick All The Facts?";

        const container = this.setupGameHeader(ele, room, callback, "The Twins, Neville and Devona will allow you to Destroy Irrelevancy and Ignorance! " + title, undefined, "images/twins_by_guide.png")

    }
}