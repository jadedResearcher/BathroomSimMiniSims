/*
Closer has a store where you trade truth for facts, keys and maybe even rooms.

And the CFO/FlowerChick/Gamer has a store where the more you spend with the closer
 the more points/TrustCoin you earn and the more you level up 
 in order to get fabulous prizes and bees

*/

const fruit_source = `http://farragofiction.com/DollSource/images/Fruit/Body/`;
let fruit;

const getFruit = async () => {
    fruit = await getImages(fruit_source);
}

/*

*/
//https://www.youtube.com/playlist?list=PLKcFg5LoVMv6PNU4ImcXL7tJzA3BGHkNp from soup
class GamerPointsStoreMiniGame extends MiniGame {
    constructor() {
        super(GAMERSHOPMINIGAME);
    }

    startGame = (ele, room, callback) => {
        window.alert("JR NOTE: TODO");
    }

    render = (ele, room, callback) => {

        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Points Store with The CFO Of Eyedol Games!", undefined, "images/flower_chick_by_the_guide.png")

    }

}
//one of the survivors made this
//https://uquiz.com/quiz/wxVQTg/i-am-a-normal-uquiz-i-will-not-pull-you-down-an-inescapable-rabbit-hole
class ShopMiniGame extends MiniGame {
    constructor() {
        super(SHOPMINIGAME);
        getFruit();
    }

    valuableCustomer = (ele, callback) => {
        const button = createElementWithClassAndParent("button", ele);
        button.innerText = "Thank You Valuable Customer: Click Here To Complete This Room";
        button.onclick = async () => {
            await truthPopup("You bought objects!", "Avoid spending it all in one place!", "Hmm... it would seem you are not satisfied with the perfect maze I designed for you? Well. If you insist on changing it. I can hardly stop you.");
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }

    }
    //zampanio remains

    //she sells viks room for an insanely high price (only way to get their room back once they censor themself)
    sellRooms = (ele, callback) => {
        const sales_floor = createElementWithClassAndParent("div", ele, "sales-floor");
        if (globalDataObject.unlockedMiniGames.includes(VIKMINIGAME)) {
            sales_floor.innerText = "SOLD OUT!";
            this.valuableCustomer(ele, callback); //she'll spam it if you buy a lot, its fine
        } else {
            const button = createElementWithClassAndParent("button", sales_floor, 'shop-button');
            const price = 5318008;
            button.innerHTML = `<p>${VIKMINIGAME} ROOM </p><p style="text-align:center;font-weight: bolder;">${price} Truth</p>`;
            if (price >= globalDataObject.truthCurrentValue) {
                button.disabled = true;
                button.innerHTML += "(you cannot afford this)";
            } else {
                button.onclick = () => {
                    button.remove();
                    purchaseRoomFromCloser(price, VIKMINIGAME);
                    this.valuableCustomer(ele, callback); //she'll spam it if you buy a lot, its fine
                }
            }

        }
        //VIKMINIGAME

    }

    sellFacts = (ele, callback) => {
        console.log("JR NOTE: remove closer eats babies, she'd never reveal that, but need it for testing")
        //TODO list of facts closer can sell, each one costs exponentially more, start with eye killer fact
        const unlockedFacts = getAllUnlockedFactTitles();
        const sales_floor = createElementWithClassAndParent("div", ele, "sales-floor");

        let index = 0;
        let anythingInShop = false;
        //this is specifically pulling from the bathroom sim to link the two for wastes. if you didn't know this existed before, well, now you do
        const audio = new Audio("http://farragofiction.com/CatalystsBathroomSim/184438__capslok__cash-register-fake.wav");
        for (let fact of factsForSale) {
            const price = 2 ** index;
            index++;
            if (price <= globalDataObject.truthCurrentValue) {
                const button = createElementWithClassAndParent("button", sales_floor, 'shop-button');
                const purchased = unlockedFacts.includes(fact.title);
                button.innerHTML = `<p>${fact.title.substring(fact.length - 21, fact.length)} </p>`
                if (purchased) {
                    button.remove();
                } else {
                    anythingInShop = true;
                    button.innerHTML += `<p style="text-align:center;font-weight: bolder;">${price} Truth</p>`;
                    button.onclick = () => {
                        button.remove();
                        purchaseFactFromCloser(price, fact);
                        this.valuableCustomer(ele, callback); //she'll spam it if you buy a lot, its fine
                    }
                }
            }
        }
        if (!anythingInShop) {
            const empty = createElementWithClassAndParent("div", sales_floor);
            empty.innerText = "No Items In Shop??? How did you afford them all?";
            this.valuableCustomer(ele, callback);

        }
    }

    sellKeys = (ele, callback) => {
        //TODO list of facts closer can sell, each one costs exponentially more, start with eye killer fact
        const unlockedFacts = getAllUnlockedFactTitles();
        const sales_floor = createElementWithClassAndParent("div", ele, "sales-floor");

        let anythingInShop = false;
        //this is specifically pulling from the bathroom sim to link the two for wastes. if you didn't know this existed before, well, now you do
        const audio = new Audio("http://farragofiction.com/CatalystsBathroomSim/184438__capslok__cash-register-fake.wav");
        for (let index = 0; index < 31; index++) {//halloween number
            const price = 2 ** index;
            index++;
            if (price <= globalDataObject.truthCurrentValue && globalDataObject.keysBoughtFromCloser < index) {
                const button = createElementWithClassAndParent("button", sales_floor, 'shop-button');
                const skip_button = createElementWithClassAndParent("img", button, "skip-button");
                skip_button.src = "images/KeyForFriend.png";

                anythingInShop = true;
                button.innerHTML += `<p style="text-align:center;font-weight: bolder;">${price} Truth</p>`;
                button.onclick = () => {
                    button.remove();
                    purchaseKeyFromCloser(price);
                    this.valuableCustomer(ele, callback); //she'll spam it if you buy a lot, its fine
                }

            }
        }
        if (!anythingInShop) {
            const empty = createElementWithClassAndParent("div", sales_floor);
            empty.innerText = "No Items In Shop??? How did you afford them all?";
            this.valuableCustomer(ele, callback);
        }
    }

    trickster = (ele, callback) => {
        const header = document.querySelector(".game-header h1");
        header.classList.add("rainbowTextAnimated")
        header.innerText = "SELL ME FRUIT!!!!!!!!!!! TRUTH FOR FRUIT!!!!!!!!!!! COMMERCE!!!!!!!!!!!!"
        //basically staticky fruit goes everywhere like in fruit sim and if you click one you get some truth
        const bounce_container = createElementWithClassAndParent("div", ele, `bounce-container`);
        const secret = createElementWithClassAndParent("a", ele)
        secret.href = "http://farragofiction.com/FruitSim/";
        secret.target = "_blank";
        secret.innerText = "Does this look familiar to you?";


        const bounceTime = (canvas) => {
            console.log("JR NOTE: bounce time", canvas)

            let animation_frame_sheet = transformCanvasIntoAnimationWithTransform(canvas, [turnToPureStatic, turnToPartialStatic, turnToPureStatic]);

            //multiple things we wanna do. first is just bounce it around as is
            //then give it three frames of animation (same as LOGAC) that makes it staticky

            /*
            <div class="el-wrap x">
              <div class="el y"></div>
            </div>
            */
            //ternary is so i can debug it without it zipping about
            const xAnimations = false ? ["x-turtle"] : ["x", "x-turtle"];
            const yAnimations = false ? ["y-turtle"] : ["y", "y-turtle"];
            const elWrap = createElementWithClassAndParent("div", bounce_container, `el-wrap ${pickFrom(xAnimations)}`);
            elWrap.style.left = `${getRandomNumberBetween(0, 100)}vw`;
            elWrap.style.top = `${getRandomNumberBetween(0, 100)}vh`;
            const el = createElementWithClassAndParent("div", elWrap, `el ${pickFrom(yAnimations)}`);
            el.style.width = "50px";
            el.style.height = "50px";

            const graphic = createElementWithClassAndParent("div", el, `animated_bg`);
            graphic.style.backgroundImage = `url(${animation_frame_sheet.toDataURL()})`;
            const audio = new Audio("audio/fx/275015__wadaltmon__bite-apple.wav");
            elWrap.onclick = () => {
                audio.play();
                const dmg = createElementWithClassAndParent("div", ele, "damage-counter");
                const amount = globalMeatMode ? 0 : 11 * globalDataObject.truthPerSecond;
                increaseTruthBy(amount);
                dmg.innerText = `+ Tasty Tasty Fruit! Have Truth! ${amount} Truth For Fruit!!!`;
                elWrap.remove();
                if (!document.querySelector(".el")) {
                    this.valuableCustomer(ele, callback);
                }
            }

            //JR NOTE: to debug
            //bounce_container.append(animation_frame_sheet);

        }

        const fruitStack = [];
        const wigglerEater = document.querySelector(".shop-kiosk");
        wigglerEater.cursor = "pointer";
        wigglerEater.pointerEvents = "all";

        wigglerEater.onclick = () => {
            if (fruitStack.length > 0) {
                bounceTime(fruitStack.pop())
            }
        }

        const addFruit = async () => {
            const image = fruit_source + pickFrom(fruit)
            let canvas = document.createElement("canvas");
            canvas.width = 50;
            canvas.height = 50;
            //ele.append(canvas);
            await kickoffImageRenderingToCanvas(image, canvas);
            //secret extra fruit leftover from a debugging effort
            fruitStack.push(canvas);
            await sleep(500);
            bounceTime(canvas);


        }

        const max = 31;
        for (let i = 0; i < max; i++) {
            addFruit();
        }

    }


    startGame = (ele, room, callback) => {
        globalBGMusic.src = "http://farragofiction.com/CatalystsBathroomSim/seeking_help.mp3";
        globalBGMusic.loop = true;
        globalBGMusic.play();
        const parent = createElementWithClassAndParent("div", ele, "shop");

        const kiosk = createElementWithClassAndParent("img", parent, "shop-kiosk");
        kiosk.src = "images/expobyfriendLARGE.png";

        const closer = createElementWithClassAndParent("img", parent, "shop-keep");
        closer.src = "images/closer_by_the_guide.png";
        if (this.fact && this.fact.title.includes("The Closer Provides You With Best Value KEYS")) {
            this.sellKeys(ele, callback);
        } else if (this.fact && this.fact.title.includes("The Closer Provides You With Best Value ROOMS")) {
            this.sellRooms(ele, callback);
        } else if (this.fact && (this.fact.title.includes("The Closer Eats Babies") || this.fact.title.includes("The Closer Is Addicted To Fruit"))) {
            closer.src = "http://farragofiction.com/ZampanioHotlink/trickster_closer_transparency.gif";
            this.trickster(ele, callback);
        } else {
            this.sellFacts(ele, callback);
        }



    }

    render = (ele, room, callback) => {
        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "The Closer Is Here To Meet All Your Shopping Needs", undefined)

    }
}


class CENSORSHIPShopMiniGame extends MiniGame {
    constructor() {
        super(VIKMINIGAME);
    }

    valuableCustomer = (ele, callback) => {
        const button = createElementWithClassAndParent("button", ele);
        button.innerText = "You Do Not Need To Look At The Void";
        button.onclick = async () => {
            await truthPopup("You Avoided the Void!", "Probably a smart idea! Who KNOWS what would happen if you gave part of our soul to it...", "I... appreciate you not rotting off pieces of the maze for your convinience. Thank you. I... did not consider that you valued me that highly.");
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }

    }

    startGame = (ele, room, callback) => {
        this.valuableCustomer(ele, callback); //she'll spam it if you buy a lot, its fine
        globalBGMusic.src = "audio/music/sounds.mp3";
        globalBGMusic.play();

        const parent = createElementWithClassAndParent("div", ele, "shop");
        const dropdown = createElementWithClassAndParent("select", parent);

        for (let o of globalDataObject.unlockedMiniGames) {
            const option = document.createElement("option")
            option.innerText = o + " ROOM";
            option.value = o ;
            dropdown.append(option);
        }
        const button = createElementWithClassAndParent("button", parent);
        button.innerText = `Give up ALL your truth and go back to 1 truth per second AND roll a new maze in exchange for permanently forgetting the chosen room?`;
        button.style.marginTop="31px"
        
        button.onclick = async ()=>{
            globalDataObject.currentMaze = null;
            globalDataObject.truthCurrentValue = 0;
            globalDataObject.allTimeTruthValue = 0;
            globalDataObject.truthPerSecond = 1;
            globalDataObject.rottenMiniGames.push(dropdown.value);
            removeItemOnce(globalDataObject.unlockedMiniGames, dropdown.value);
            removeItemOnce(globalDataObject.unlockedMiniGames, VIKMINIGAME); //doesn't rot it but you can only do it the one time without paying again

            globalBGMusic.src = "audio/music/sometimes_you_have_fun.mp3";
            globalBGMusic.play();
            await truthPopup("Uh. I feel weird...", "What was I doing? Where are you? Oh. Sorry about the glitch! Let me just... uh. Make a new maze? I guess? How did you end up in the Void?", "I am scared...");
            renderMazeTab();

            //currentTruth is zero
            //truth per second is zero
            //unlocked mini games no longer has the chosen one
            //reroll maze
            //add room name to the rotten rooms array
        }




    }

    render = (ele, room, callback) => {

        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Would you be happier if you forgot a Room?", undefined, "images/Vik_byguide.png")

    }

}