/*
k moneylaunders facts:  take any fact you want, he wipes it clean and replaces it with his own  (entirely procedural) fact

give him the right fact (stroke his ego and use one he created) and he'll let you do it too (completely customizable facts)

*/

class LaundryMiniGame extends MiniGame {
    constructor() {
        super(LAUNDRYMINIGAME);
    }

    startGame = (ele, room, callback) => {
        window.alert("JR NOTE: TODO");
    }

    render = (ele, room, callback) => {
        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Fact Laundering With K!", undefined, "images/Khana_pixel_by_the_guide")

    }
}