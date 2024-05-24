/*
doc slaughter, k, and the twins all have mini games that let you interact with facts directly

river should let you do the save editing
*/

class TwinsMiniGame extends MiniGame {
    constructor() {
        super(TWINSMINIEGAME);
    }

    startGame = (ele, room, callback) => {
        window.alert("JR NOTE: TODO");
        this.valuableCustomer(ele, callback);
    }

    
    valuableCustomer = (ele, callback) => {
        const button = createElementWithClassAndParent("button", ele);
        button.innerText = "JR NOTE: TODO REAL GAME BUT FOR NOW CLICK THIS TO ESCAPE";
        button.onclick = async () => {
            await truthPopup("You are a real gamer!", "Wow! It seems you are having so much fun earning points and leveling up by participating in capitalism!", "While I value the Chief Financial Officer of Eyedol Game's ability to draw people in, my hot maze gf is much, much better.");
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }

    }

    render = (ele, room, callback) => {

        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "The Twins, Neville and Devona will allow you to Destroy Irrelevancy and Ignorance! ", undefined, "images/twins_by_guide.png")

    }
}