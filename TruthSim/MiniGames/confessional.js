/*
very lore heavy, just lil cutscenes of characters confession to witherby
need to find that confession fic IC wrote and feed on it


*/

class ConfessionMiniGame extends MiniGame {
    constructor() {
        super(CONFESSIONMINIGAME);
    }

    startGame = (ele, room, callback) => {
        window.alert("JR NOTE: TODO");
    }

    render = (ele, room, callback) => {
        truthLog("Confessional", `I suppose the little priest is useful for prying the secrets from the blorbos. You like the blorbos. This will help keep you coming back.`)

        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Come All and Confess Your Sins", undefined, "images/Thesolemn_by_guide.png")

    }
}