/*
k moneylaunders facts:  take any fact you want, he wipes it clean and replaces it with his own  (entirely procedural) fact

give him the right fact (stroke his ego and use one he created) and he'll let you do it too (completely customizable facts)

*/

class LaundryMiniGame extends MiniGame {
    constructor() {
        super(LAUNDRYMINIGAME);
    }

    startGame = (ele, room, callback) => {
        const container = createElementWithClassAndParent("div", ele, "shop");

        if (globalDataObject.factsUnlocked.length > 0) {
            const options = [];
            for (let fact of globalDataObject.factsUnlocked) {
                if (!fact.mini_game_key) { //don't display facts that already live somewhere
                    const option = document.createElement("option")
                    option.innerText = fact.title;
                    options.push({ option, fact });
                }

            }

            if (options.length > 0 && !this.fact) {
                const factsSelector = createElementWithClassAndParent("select", container, "multi-select");
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
            submitButton.style.display ="block";
            submitButton.style.marginTop="13px";
            submitButton.innerText = "Generously Donate Facts to K (no takebacks)";
            submitButton.onclick = () => {
                window.alert("JR NOTE: TODO");
            }

        }
    }

    render = (ele, room, callback) => {
        truthLog("Disgusting Lies", `... Do not listen to this little buzzing annoyance. Facts are not something you can just twist into whatever shape you want. Unless.   Would you like me better if I was a more pleasing shape? Would you remember me better? Spend more time here? Please do not forget me.`)

        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Khana is a cool guy/girl/whatever you can trust with your facts!", undefined, "images/Khana_pixel_by_the_guide.png")

    }
}