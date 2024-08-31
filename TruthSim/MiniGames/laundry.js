/*
k moneylaunders facts:  take any fact you want, he wipes it clean and replaces it with his own  (entirely procedural) fact

give him the right fact (stroke his ego and use one he created) and he'll let you do it too (completely customizable facts)

*/

class LaundryMiniGame extends MiniGame {
    constructor() {
        super(LAUNDRYMINIGAME);
    }

    respondsToFact = (fact) => {
        return fact.title.toUpperCase().includes("KHANA"); //he's gonna steal it
    }


    kPopup = (text, size, callback) => {
        const popup = createElementWithClassAndParent("div", document.querySelector("body"), "slot-popup");
        const popupbody = createElementWithClassAndParent("div", popup);
        popupbody.innerHTML = `  
        <img style="width: ${size}; float:left; margin-right:42px; margin-bottom:42px;" src="images/Khana_pixel_by_the_guide.png">      
             ${text} TODO: if multiple of truth per second, K gives you a lil bonus`

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

    vikPopup = (callback) => {
        removeItemOnce(globalDataObject.unlockedMiniGames, this.id);
        globalDataObject.currentMaze = null;
        //vik doesnt ROT k, they're still friends
        //this is more an intervention

        const popup = createElementWithClassAndParent("div", document.querySelector("body"), "slot-popup");
        const popupbody = createElementWithClassAndParent("div", popup);
        popupbody.innerHTML = `  
        <img style="float:left; margin-right:42px; margin-bottom:42px;" src="images/Vik_byguide.png">      
             Apologies. This one's head has gotten too big. Gonna let her cool his heels a bit. See if that helps xer.`

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
        for(let fact of globalDataObject.factsUnlocked){
            if(this.respondsToFact(fact)){
                base = base * 1.13;
                facts ++;
            }
        }
        if(facts >2){
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
        kHimself.style.width = size+"px";
        
        const container = createElementWithClassAndParent("div", ele, "shop");
        const header = createElementWithClassAndParent("div", container);
        if (this.fact && this.respondsToFact(this.fact)) {
            donateFactToK(this.fact);
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
            submitButton.onclick = () => {
                const selected = [...factsSelector.querySelectorAll('option:checked')].map((i) => i.value);
                console.log("JR NOTE: selected is", selected)
                for (let s of selected) {
                    for (let fact of globalDataObject.factsUnlocked) {
                        if (fact.title === s) {
                            donateFactToK(fact);
                            this.kPopup("I knew you had it in you! Always bet on the winning team, that's what I say!", size, callback);
                        }
                    }
                }


            }

        } else {
            const rude = createElementWithClassAndParent("div", container);
            rude.innerText = "You don't have any facts? Fucking useless. Why are you even here?"

        }
    }

    render = (ele, room, callback) => {
        truthLog("Disgusting Lies", `... Do not listen to this little buzzing annoyance. Facts are not something you can just twist into whatever shape you want. Unless.   Would you like me better if I was a more pleasing shape? Would you remember me better? Spend more time here? Please do not forget me.`)

        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Khana is a cool guy/girl/whatever you can trust with your facts!", undefined, "images/Khana_pixel_by_the_guide.png")

    }
}