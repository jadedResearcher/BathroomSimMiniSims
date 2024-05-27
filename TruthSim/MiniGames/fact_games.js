/*
doc slaughter, k, and the twins all have mini games that let you interact with facts directly

river should let you do the save editing
*/

class TwinsMiniGame extends MiniGame {
    constructor() {
        super(TWINSMINIEGAME);
    }

    singleFactInfoDump = (fact, ele, room, callback) => {
        const devonalabel = createElementWithClassAndParent("div", ele);
        //she adds all the emphasis she can to the point its hard to tell whats going on
        devonalabel.innerHTML = `<hr><u><img height="31" src='images/devona_twin_by_guide.png'>Devona says: 'Here's Everything I Know About <i><b>'${fact.title}'</b></i> I Hope It's Okay!'</u><br><br>` //because she is too much information all at once not using css for her, she is all in the html, a mess of content and design that is practically unreadable

        const infodump = createElementWithClassAndParent("div", ele);
        infodump.style.padding = '31px';
        infodump.style.border = "1px dashed yellow";
        infodump.style.marginLeft = "auto";
        infodump.style.marginRight = "auto";
        infodump.style.width = "50%";
        infodump.style.marginBottom = "13px";
        infodump.innerHTML = fact.lore_snippet;

        const buttonLabel = createElementWithClassAndParent("div", ele, "void neville-button"); //while neville is entirely css, even the text, don't worry you don't need to see anything :) :) :)

        const button = createElementWithClassAndParent("button", buttonLabel); //while neville is entirely css, even the text, don't worry you don't need to see anything :) :) :)
        button.innerText= "Forget?"
        button.onclick = async () => {
            globalDataObject.factsUnlocked = removeItemOnce(globalDataObject.factsUnlocked, fact);

            if(fact === this.fact){
                this.fact = undefined; //forget about it
            }
            this.startGame(ele, room, callback);
        }
    }

    startGame = (ele, room, callback) => {
        ele.innerHTML="";
        if(this.fact){
            this.singleFactInfoDump(this.fact, ele, room, callback);
        }else{

            for(let fact of globalDataObject.factsUnlocked){
                this.singleFactInfoDump(fact, ele, room, callback);
            }
        }

        this.valuableCustomer(ele, callback);

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