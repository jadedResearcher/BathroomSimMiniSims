/*

k doesn't have to share his file with ANYONE

specialist boi gurl thing

(by which i mean he'd' probably kill anyone in here)


k moneylaunders facts:  take any fact you want, he wipes it clean and replaces it with his own  (entirely procedural) fact

give him the right fact (stroke his ego and use one he created) and he'll let you do it too (completely customizable facts)

*/

const kPopup = (text, size, callback) => {
    const popup = createElementWithClassAndParent("div", document.querySelector("body"), "slot-popup");
    const popupbody = createElementWithClassAndParent("div", popup);
    const img = createElementWithClassAndParent("img", popupbody);
    img.src = "images/Khana_pixel_by_the_guide.png";
    img.style.cssText = `width: ${size}; float:left; margin-right:42px; margin-bottom:42px;`;
    const textEle = createElementWithClassAndParent("div", popupbody);
    textEle.innerHTML = text;

    let textInput;
    let textArea;

    //this means that K is more likely to help you if you're small and weak
    /*
    this isn't out of a sense of charity, though has the same effect
    more
    the less of a threat you are the more k doens't mind feeling a bit big by helping you

    but if you even remotely could rival him/xer/her...

    prepare to get wrenched
    */
    if (globalDataObject.allTimeFactsGivenToK % globalDataObject.truthPerSecond == 0) {
        const bonusEle = createElementWithClassAndParent("div", popupbody);
        bonusEle.innerHTML = "Hey. Thanks for all the donations. You're alright, kid. Here's a lil something for you.  Did you know anything can be a Fact if you're willing to defend it? Try it out, write whatever you want, my treat: <br><br>"
        const labelInput = createElementWithClassAndParent("div", popupbody);
        labelInput.innerText = "Fact Title:"

        textInput = createElementWithClassAndParent("input", popupbody);

        const labelInput2 = createElementWithClassAndParent("div", popupbody);
        labelInput2.innerText = "Fact Content:"
        textArea = createElementWithClassAndParent("textarea", popupbody);
        textArea.style.width = "50%";


    }

    const closeButton = createElementWithClassAndParent("button", popupbody);
    closeButton.innerText = "Close";
    closeButton.style.display = "block";
    closeButton.style.marginTop = "13px";
    closeButton.onclick = () => {
        if(textInput && textArea){
            //best themes (all of them) and best stats and empty secret (JUST to fuck with doc slaughter)
            //god he hates her
            //how dare she think she can get in his head and also how dare she not dedicate her entire practice to studying him like a bug because he's the specialist little boy
            const kFact = new Fact(textInput.value, textArea.value, Object.keys(all_themes), 999, 999, 999, new Secrets());
            globalDataObject.factsUnlocked.push(kFact);
        }
        popup.remove();
        callback(globalDataObject.currentMaze);
    }
}

class LaundryMiniGame extends MiniGame {
    constructor() {
        super(LAUNDRYMINIGAME);
    }

    respondsToFact = (fact) => {
        return fact.title.toUpperCase().includes("KHANA"); //he's gonna steal it
    }




    //k got too big, vik called in
    vikPopup = (callback) => {
        removeItemOnce(globalDataObject.unlockedMiniGames, this.id);
        globalDataObject.currentMaze = null;
        //vik doesnt ROT k, they're still friends
        //this is more an intervention

        const popup = createElementWithClassAndParent("div", document.querySelector("body"), "slot-popup");
        const popupbody = createElementWithClassAndParent("div", popup);
        popupbody.innerHTML = `  
        <img style="float:left; margin-right:42px; margin-bottom:42px;" src="images/Vik_byguide.png">      
        "Alright, that's enough out of you. Get back in [REDACTED]."`

        const closeButton = createElementWithClassAndParent("button", popupbody);
        closeButton.innerText = "Close";
        closeButton.style.display = "block";
        closeButton.style.marginTop = "13px";
        closeButton.onclick = () => {
            popup.remove();
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }
    }

    //the more you've been looking at K, the bigger he gets
    //until he risks breahching
    //and vik has to censor him
    decideKSize = (callback) => {
        let base = 125;
        let facts = 0;
        for (let fact of globalDataObject.factsUnlocked) {
            if (this.respondsToFact(fact)) {
                base = base * 1.13;
                facts++;
            }
        }
        if (facts > 12) {
            this.vikPopup(callback);
        }
        return base;
    }
    //https://www.tiktok.com/@junior.elizuki/video/7393057875771411718
    //https://www.tiktok.com/@junior.elizuki/video/7396053924609821957
    //https://www.tiktok.com/@junior.elizuki/video/7398048484382838021
    //https://www.tiktok.com/@junior.elizuki/photo/7398017994615475462
    //https://www.tiktok.com/@junior.elizuki/video/7397431862832024838
    //https://www.tiktok.com/@junior.elizuki/video/7395238699853761798
    //https://www.tiktok.com/@junior.elizuki/photo/7394628936333921541
    //https://www.tiktok.com/@junior.elizuki/video/7387475649579224325
    //https://www.youtube.com/@JrElizuki
    startGame = (ele, room, callback) => {
        const size = this.decideKSize(callback);
        const kHimself = document.querySelector(".blorbo");
        kHimself.style.width = size + "px";

        const container = createElementWithClassAndParent("div", ele, "shop");
        const header = createElementWithClassAndParent("div", container);
        if (this.fact && this.respondsToFact(this.fact)) {
            donateFactToK(this.fact);
            console.log("JR NOTE: https://archiveofourown.org/works/60649303/chapters/154864102")
            truthLog("It seems the little gremlin has stolen your fact because it had his/xer/her/their/its name on it.", "No matter. I am certain you can obtain it again elsewhere.");
            this.fact = null;//yoinked
        }
        header.innerText = "Facts Donated So Far: " + globalDataObject.allTimeFactsGivenToK;

        if (globalDataObject.factsUnlocked.length > 0) {
            const options = [];
            for (let fact of globalDataObject.factsUnlocked) {
                if (!fact.mini_game_key) { //don't display facts that already live somewhere
                    const option = document.createElement("option")
                    option.innerText = fact.title;
                    options.push({ option, fact });
                }

            }

            let factsSelector;
            if (options.length > 0) {
                factsSelector = createElementWithClassAndParent("select", container, "multi-select");
                factsSelector.multiple = true;
                factsSelector.id = "facts-selector"
                const option = document.createElement("option")
                factsSelector.mul
                factsSelector.append(option);
                option.selected = true;
                for (let o of options) {
                    factsSelector.append(o.option);
                }
            }

            const submitButton = createElementWithClassAndParent("button", container);
            submitButton.style.display = "block";
            submitButton.style.marginTop = "13px";
            submitButton.innerText = "Generously Donate Facts to K (no takebacks)";
            submitButton.onclick = async() => {
                let donated = 0;
                const selected = [...factsSelector.querySelectorAll('option:checked')].map((i) => i.value);
                for (let s of selected) {
                    for (let fact of globalDataObject.factsUnlocked) {
                        if (fact.title === s) {
                            donated++;
                            donateFactToK(fact);
                        }
                    }
                }
                if (donated> 0) {
                    kPopup("I knew you had it in you! Always bet on the winning team, that's what I say!", size, () => {
                        callback(globalDataObject.currentMaze);
                        renderMazeTab();
                    });
                }else{
                    await truthPopup("You Decide Not To Engage","Probably for the best! That K person doesn't exactly seem trustworthy! I'm sure there's other ways to get past this room!","Seethe, K. Feel the Eyes on you grow cold and disinterested. Wither. Rot. How dare you fuck my hot maze girlfriend.")
                    renderMazeTab(); //don't kid a kidder, you don't get shit from this
                }


            }

        } else {
            const rude = createElementWithClassAndParent("div", container);
            rude.innerText = "You don't have any facts? Fucking useless. Why are you even here?"
            const kFact = new Fact("You Will Look At Khana", "So. Funny story. K has two main abnormalities associated with him/her/xer:  Burrowing Heaven, and Schadenfreude. With the former, if you ignore K too long, he breeches, and spreads in every direction to try to find your Gaze. With the latter, if you look too much at xer, xe breeches and rampages around killing people horribly. Vik can help contain the latter. The Censorship is for your protection against schadenfreude....but once Burrowing Heaven gets loose... Well. Best to let it run its course. Censorship only makes it worse, afterall.", Object.keys(all_themes), 999, 999, 999);
            globalDataObject.factsUnlocked.push(kFact);
        }
    }

    render = (ele, room, callback) => {
        truthLog("Disgusting Lies", `... Do not listen to this little buzzing annoyance. Facts are not something you can just twist into whatever shape you want. Unless.   Would you like me better if I was a more pleasing shape? Would you remember me better? Spend more time here? Please do not forget me.`)

        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Khana is a cool guy/girl/whatever you can trust with your facts!", undefined, "images/Khana_pixel_by_the_guide.png")

    }
}