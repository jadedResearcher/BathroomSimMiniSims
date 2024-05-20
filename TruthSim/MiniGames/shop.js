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

/*

a points reward knows 
* what unlocks it
* what to do on unlock

things that can be added on unlock:
* (level +1 ) points per 100 truth spend with the closer
* an optional  random procedural fact about yourself based on the level like the Player Is A Level 10 Heir of Pizza (theme italian) (want a spammy amount of facts for K)
* an optional random bee
* an optional  random amount of truth
* every 3 levels give you a fact from the CFO 
* extremely rarely a key
*/
const pointsRewardTiers = ["Aluminum", "Nickle", "Tin", "Lead", "Iron", "Zinc", "Steel", "Copper", "Bronze", "Silver", "Gold", "Tungsten", "Titanium", "Platinum", "Diamond", "Mithril", "Adamantium", "Unubtanium", "Brass"]

class PointsReward {
    truth = 0;
    key = false;
    fact;

    // in order to make a points reward ALL we need to know is how many closer loyalty points this is for
    constructor(gamer_level, disabled = false) {
        this.disabled = disabled;
        const rand = new SeededRandom(gamer_level);
        rand.nextDouble() //stir shit
        this.label = `${pointsRewardTiers[gamer_level % pointsRewardTiers.length]} Level ${gamer_level}`;
        if(this.disabled){
            this.label += "(not enough points)"
        }
        if(rand.nextDouble()>0.5){
            this.fact = randomFact(rand);
        }
        //between three seconds and five  minutes of truth
        this.truth = rand.getRandomNumberBetween(0, 5*60*parseInt(globalDataObject.truthPerSecond));
        this.key = rand.nextDouble() > 0.9;

    }
//http://knucklessux.com/PuzzleBox/Secrets/WatcherOfThreads/dreams.pdf
    render(parent){
        const level_ele = createElementWithClassAndParent("div", parent, "gamer-tier");
        if(this.disabled){
            level_ele.classList.add("room-locked")
        }
        const level_ele_label = createElementWithClassAndParent("div", level_ele);
        level_ele_label.innerText = this.label;

        const unordered_list = createElementWithClassAndParent("ul", level_ele);

        if(this.truth>0){
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `Truth: ${this.truth}!!!`;
        }

        if(this.key){
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `A Key!!!`;
        }

        if(this.fact){
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `${this.fact.title}`;
        }

    }

}

class GamerPointsStoreMiniGame extends MiniGame {
    constructor() {
        super(GAMERSHOPMINIGAME);
    }

    valuableCustomer = (ele, callback) => {
        const button = createElementWithClassAndParent("button", ele);
        button.innerText = "Thank You Valuable Customer: Click Here To Complete This Room";
        button.onclick = async () => {
            await truthPopup("You are a real gamer!", "Wow! It seems you are having so much fun earning points and leveling up by participating in capitalism!", "While I value the Chief Financial Officer of Eyedol Game's ability to draw people in, my hot maze gf is much, much better.");
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }

    }

    generateRewards = (current_gamer_level, ele, room, callback)=>{
        //this happens because a button was clicked
        alert("JR NOTE: todo")
        /*
            first, for every level under and INCLUDING the current_gamer_level create a PointsReward


            then, for each PointsReward, star collating the total reward (number of truth, number of keys, array of facts, etc) (don't do it for each, less efficient and i also need to render them)

            then, set globalDataObject.allTimeTruthGivenToCloser to zero

            then if   maximumGamerLevelAchieved is less than the current_gamer_level, change that

            then, render a Rewards screen detailing all these things they just unlocked (which has a button to return to map just like regular rewards screen)

        */
    }

    startGame = (ele, room, callback) => {
        const current_gamer_level = Math.ceil(globalDataObject.allTimeTruthGivenToCloser / 1000);
        this.valuableCustomer(ele, callback);
        const container = createElementWithClassAndParent("div", ele);
        container.style.backgroundColor = "white";
        container.style.margin = "31px";
        container.style.padding="13px";


        const header = createElementWithClassAndParent("div", container);
        const body = createElementWithClassAndParent("div", container, "sales-floor");
        body.style.backgroundColor = "white";
        body.style.margin = "31px";

        const instructions = createElementWithClassAndParent("div", header);
        instructions.style.color="black";
        instructions.innerText = "Okay sooooooo... Here's how it works. For every 1000 Truth you spend with my wife over in the shop, You'll earn a Gamer Level! At any time you can trade all your Gamer Levels for sweet loot, but if you do you gotta start back over at level 1, so the longer you grind the better your gains, yeah?"

        const button = createElementWithClassAndParent("button", header);
        button.innerText = "Cash In Gamer Levels? (warning: resets level)";
        button.onclick = ()=>this.generateRewards(current_gamer_level, room, callback)
        button.style.marginTop="13px"


        const reward = new PointsReward(current_gamer_level +1, true);
        reward.render(body);

        //don't render ALL possible levels, just current + 1 and then 9 fewer (if extant)
        for (let i = 0; i < 9; i++) {
            const level = current_gamer_level - i;
            if (level > 0) {
                const reward = new PointsReward(current_gamer_level - i);
                reward.render(body);
            }
        }

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
            option.value = o;
            dropdown.append(option);
        }
        const button = createElementWithClassAndParent("button", parent);
        button.innerText = `Give up ALL your truth and go back to 1 truth per second AND roll a new maze in exchange for permanently forgetting the chosen room?`;
        button.style.marginTop = "31px"

        button.onclick = async () => {
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