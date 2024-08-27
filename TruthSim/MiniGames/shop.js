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
    for every hive you have, spawns a slot machine for it that takes honey from that hive
    (if you have no hives or no honey you have no choice but to spend a key to get past)

    you can put in a single honey to get a chance of truth, keys and themed facts
    higher grade honey gets higher grade facts (defined by having real or fake secrets (fake in the sense that its just the eyes or spooky images, not in the sense of lies))

    ria will also let you burn things if you give her the right fact (up to your whole save file, but also facts/rooms/truth/truthpersecond/keys (why would you for some of these?))
    unlike vik things she burns doesn't stay burned

    she's always the hope that something better will sprout from the ashes

    she has no nuance. if you want to burn "rooms" you lose *every* room. (what does that even do? fire mode???)
    (i think if she burns all rooms you keep button room and mazes beaten goes back to 1 (so you reunlock them all))
*/

class SlotsMiniGame extends MiniGame {
    constructor() {
        super(RIAMINIGAME);
    }


    valuableCustomer = (ele, callback) => {
        const button = createElementWithClassAndParent("button", ele);
        button.innerText = "I've finished burning it all away. I hope it was worth it.";
        button.onclick = async () => {
            await truthPopup("Obsession is a dangerous thing...", "Be very careful, Player... It's easy to get addicted to gambling. Are you sure you don't need a break? When's the last time you drank water? Are you tired? Do you need to eat? Maybe get up and stretch? It will be here when you come back!", "After all, you are no use to me if you burn yourself out on that Burning Witch's siren singing machine. Zampanio, and I, need you to live a long life. Take care of your body because you are no longer living merely for yourself.");
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }

    }

    handleWinnings = (ele, room, callback, loot, slot1Value, slot2Value, slot3Value, bet) => {
        const s1v = slot1Value.split("-")[1];
        const s2v = slot2Value.split("-")[1];
        const s3v = slot3Value.split("-")[1];
        if (s1v == s2v && s2v == s3v) {
            globalBGMusic.src = "audio/music/icbattlemusic.mp3"
            globalBGMusic.play();
            const popup = createElementWithClassAndParent("div", document.querySelector("body"), "slot-popup");
            const popupbody = createElementWithClassAndParent("div", popup);
            let winnings = ``;
            if (s1v === "paperclip") {
                const truthWinnings = bet * globalDataObject.truthPerSecond * 60 * loot.quality; //a minutes worth of truth
                increaseTruthBy(truthWinnings);
                //a caricature of the real ria since the game blorbos are meant to be the barely fleshed out chars that fans spiral on in fan works except the fan works are mainly still made be me and ic
                winnings = `<br><br><b>${truthWinnings} Truth</b>! <br><br>Wow! I wonder how it all connects? And how are you supposed to know if its a UNIVERSAL TRUTH, and actually come to think of it who is deciding what truth EVEN is? Can we trust them? Of course not, they're shadowy figures behind everything, if they were trustworthy they'd come right out and show us their reasoning for claiming ANYTHING is true much less EVERYTHING and furthermore... `;
            } else if (s1v === "key") {
                const keyWinnings = Math.round(Math.max(1, (bet) / 131313)) * loot.quality;
                globalDataObject.numberKeys += keyWinnings;
                winnings = `<br><br><b>${keyWinnings} Keys!</b><br><br> ... It just doesn't make sense. Why would the Maze encourage you skipping content? Is it a conspiracy? Who benefits from this? Because someone has to. You have to follow the money but of course not the LITERAL money this isn't that fake maze money that Not!Spiral Abnormality likes tricking people into taking no this is REAL value here the ability to skip the infinite to try to focus on just what you want wait isn't that like what Neville is, is there something at work with a similar principal and furthermore...  `;
            } else {
                const facts = getAllFactsWithThemeAndTier(pickFrom([loot.theme1Key, loot.theme2Key].filter(Boolean)), loot.quality); //get rid of undefined, pick one of the themes randomly
                let chosenFacts = [];
                const numberWinnings = Math.min(13, Math.round(Math.max(1, (bet) / 1313)));

                if (facts.length > 0) {
                    for (let i = 0; i < numberWinnings; i++) {
                        chosenFacts.push(pickFrom(facts));
                    }
                }

                chosenFacts = uniq(chosenFacts).filter(Boolean);


                if (chosenFacts.length > 0) {
                    for (let fact of chosenFacts) {
                        globalDataObject.factsUnlocked.push(fact);

                    }
                    console.log("JR NOTE: chosen facts is", chosenFacts)
                    winnings = `<br><br><b>the fact that: ${chosenFacts.map((o) => o.title).join(" and ")} </b><br><br> ... But can you really trust that? Who SAYS that. It doens't say does it and if it doesn't say it could be ANYONE why would you just assume its someone trustworthy why am i the weird one for asking these sorts of questions its just obvious you cant trust random facts you find on the internet right?????`
                } else {
                    winnings = "Wait. What? Nothing? No. No! You were....you were supposed to get a fact. How. How is that fair? This rotten world can only be clensed in fire. Please. Let me do it. The Universe wasn't meant to be this way :(";

                }
            }
            popupbody.innerHTML = `  
            <img style="float:left; margin-right:42px; margin-bottom:42px;" src="images/RiabyGuide.png">      
                 You won! I just knew if you kept at it eventually burning it all would pay off! Now...what did you win? ${winnings} <br><br>`

            const closeButton = createElementWithClassAndParent("button", popupbody);
            closeButton.innerText = "Close";
            closeButton.onclick = () => {
                popup.remove();
            }

            //JR NOTE TODO: map of matching word to winnings
            //JR NOTE TODO: popup has ria in it with a comment on what you won (deranged speculation), list of winnings, button to close
        } else {
            const fx = new Audio("audio/fx/nope.mp3")
            fx.loop = false;
            fx.play();
        }


    }

    rollSlots = async (buttonContainer, slotImage, room, callback, loot, bet, slot1, slot2, slot3) => {
        //JR NOTE TODO: disable buttons
        const buttons = buttonContainer.querySelectorAll("button");
        buttons.forEach((button) => {
            button.disabled = true;
        })
        //JR NOTE TODO: deduct bet from loot
        console.log("JR NOTE: loot quantity before bet", loot.quantity)
        loot.quantity += -1 * bet;
        console.log("JR NOTE: loot quantity after bet", loot.quantity)

        //start slots noise/music
        //i_think_its_finished_priska_turbo_time
        globalBGMusic.src = "audio/music/i_think_its_finished_priska_turbo_time.mp3";//priska is in the same universe as piper/camillia was from iirc
        globalBGMusic.play();

        //JR NOTE TODO: from all three slots thingies  start spinning
        slot1.classList.add("slots-spinning")
        slot2.classList.add("slots-spinning")
        slot3.classList.add("slots-spinning")

        slot1.classList.add("slots-spinning")
        slot2.classList.add("slots-spinning")
        slot3.classList.add("slots-spinning")
        //JR NOTE TODO: wait three seconds
        await sleep(3000);

        //JR NOTE TODO: from array of possible class names, pick three

        let numberEnded = 0;
        //odds are REALLY bad if i let all the icons show up, so the zampanio way is to always leave you thinking theres more you could be seeing
        const slotPositions = ["slots-paperclip-a", "slots-paperclip-c", "slots-heart-c", "slots-heart-b", "slots-heart-a", "slots-key-b"]; //you can win truth, facts or keys
        //const slotPositions = ["slots-heart-a"]; //debug, will always win wahtever is here

        const slot1Choice = pickFrom(slotPositions);
        const slot2Choice = pickFrom(slotPositions);
        const slot3Choice = pickFrom(slotPositions);

        //JR NOTE TODO: on animation end, play ting!
        //JR NOTE TODO: when all animation end, stop music,
        const animationEnded = async (ele, choice) => {
            console.log("JR NOTE: animation ended", choice)
            const fx = new Audio("audio/fx/chip.mp3")
            fx.loop = false;
            fx.play();
            numberEnded++;
            if (numberEnded >= 3) {
                globalBGMusic.pause();
                this.handleWinnings(ele, room, callback, loot, slot1Choice, slot2Choice, slot3Choice, bet);

                await sleep(3000);
                const buttons = buttonContainer.querySelectorAll("button");
                buttons.forEach((button) => {
                    button.disabled = false;
                });
                slotImage.src = "images/SlotMachineForFriendLARGE.png"

                slot1.classList.remove(slot1Choice)
                slot2.classList.remove(slot2Choice)
                slot3.classList.remove(slot3Choice)
            }
        }

        //JR NOTE TODO: set slots to animate to those three

        slot1.classList.remove("slots-spinning");
        slot1.classList.add(slot1Choice);
        await sleep(100);
        slot1.onanimationend = () => animationEnded(slot1, slot1Choice);


        await sleep(1000);

        slot2.classList.remove("slots-spinning");
        slot2.classList.add(slot2Choice);
        await sleep(100);
        slot2.onanimationend = () => animationEnded(slot2, slot2Choice);


        await sleep(1000);

        slot3.classList.remove("slots-spinning");
        slot3.classList.add(slot3Choice);
        await sleep(100);
        slot3.onanimationend = () => animationEnded(slot3, slot3Choice);

        await sleep(10000);
        //IMPORTANT: IF ITS BEEN TEN SECONDS AND ANIMATIONS HAVEN'T ENDED SOMETHING HAS GONE WRONG, PROCESS WINNINGS ANYWAYS (not all browser and computers will work right)

        if (numberEnded < 3) {
            animationEnded("ERROR: ANIMATIONS DID NOT END, FALLING BACK")
        }
    }

    respondsToFact = (fact) => {
        //Ria Burns Everything In Despair
        return fact.title.toUpperCase().includes("RIA BURNS") || fact.title.toUpperCase().includes("DESPAIR")
    }

    startGame = (ele, room, callback) => {
        this.valuableCustomer(ele, callback);

        let hives = Object.values(globalDataObject.hiveMap);
        const container = createElementWithClassAndParent("div", ele, "hives-container");
        let test_animation = "";
        for (let hive of hives) {
            const slotContainer = createElementWithClassAndParent("div", container, "slot-container");
            const slotHeader = createElementWithClassAndParent("div", slotContainer, "slot-header");
            slotHeader.innerText = hive.classpect + "Slot Machine"
            const slotMachine = createElementWithClassAndParent("div", slotContainer, "slot-machine");

            const slotImg = createElementWithClassAndParent("img", slotMachine, "slot");
            slotImg.src = "images/SlotMachineForFriendLARGE.png"

            const slotsIcons1 = createElementWithClassAndParent("div", slotMachine, `slot-icons one ${test_animation}`);
            slotsIcons1.style.backgroundImage = "url(images/slots.png)"

            const slotsIcons2 = createElementWithClassAndParent("div", slotMachine, `slot-icons two ${test_animation}`);
            slotsIcons2.style.backgroundImage = "url(images/slots.png)"

            const slotsIcons3 = createElementWithClassAndParent("div", slotMachine, `slot-icons three ${test_animation}`);
            slotsIcons3.style.backgroundImage = "url(images/slots.png)"
            test_animation = "";


            let rotation = 0;
            slotContainer.title = [hive.theme1Key, hive.theme2Key].map((item) => item).sort().join(", ");

            for (let theme of [hive.theme1Key, hive.theme2Key]) {
                if (theme) {//theme 2 can be null
                    rotation += themeToColorRotation(theme);
                }
            }
            slotContainer.style.filter = `hue-rotate(${rotation}deg)`;
            const buttonContainerContainer = createElementWithClassAndParent("div", slotContainer);

            //https://www.tiktok.com/@junior.elizuki/video/7387475649579224325
            for (let loot of hive.loot) {
                if (loot.quantity > 0) {
                    const buttonContainer = createElementWithClassAndParent("div", buttonContainerContainer, "slot-button-container");



                    const oneHoney = createElementWithClassAndParent("button", buttonContainer);
                    oneHoney.innerHTML = `Bet <img class='key-icon slot-icon' src="${loot.image}"> (L${loot.quality})?`;

                    //remove it if not applicable but need to update
                    const allHoney = createElementWithClassAndParent("button", buttonContainer);

                    const disableIfZero = (button) => {
                        if (loot.quantity === 0) {
                            button.disabled = true; //wont stick, animation keeps turning it back on
                            button.onclick = () => { } //stop gap while we do the timeout
                            setTimeout(() => { button.disabled = true; }, 5000);
                            button.innerHTML = "NO HONEY :("
                            button.style.color = "red";
                            button.style.border = "2px solid red";
                        }
                    }

                    oneHoney.onclick = () => {
                        slotImg.src = "images/SlotMachineForFriendPulled.png"

                        //update amount
                        this.rollSlots(buttonContainerContainer, slotImg, room, callback, loot, 1, slotsIcons1, slotsIcons2, slotsIcons3)
                        allHoney.innerHTML = `Bet ${loot.quantity} <img class='key-icon slot-icon' src="${loot.image}"> (L${loot.quality})?`;
                        disableIfZero(allHoney);
                        disableIfZero(oneHoney);

                    }

                    if (loot.quantity > 1) {
                        allHoney.innerHTML = `Bet ${loot.quantity} <img class='key-icon slot-icon' src="${loot.image}"> (L${loot.quality})?`;
                        allHoney.onclick = () => {
                            //it'll be reduced by however much
                            this.rollSlots(buttonContainerContainer, slotImg, room, callback, loot, loot.quantity, slotsIcons1, slotsIcons2, slotsIcons3)
                            allHoney.innerHTML = `Bet ${loot.quantity} <img class='key-icon slot-icon' src="${loot.image}"> (L${loot.quality})?`;
                            disableIfZero(allHoney);
                            disableIfZero(oneHoney);
                        }
                    } else {
                        allHoney.remove(); //do not bother rendiering
                    }
                }

            }



        }
        if (respondsToFact(this.fact)) {
            const burnItAll = createElementWithClassAndParent("button", container);
            burnItAll.innerHTML = `It's too much. I'll never understand it all. Let's just burn it all at once and be done with it.`;
            burnItAll.onclick = () => {
                globalDataObject.hiveMap ={}; //goodbye bees :(
            }
        }
    }

    render = (ele, room, callback) => {
        truthLog("Slots", `The Truth is that JR played... an unsettling amount of Binding of Issac leading up to making this experience. And is surprisingly suceptible to gambling mechanics.`)

        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Burn All Your Honey On These Altars Of Hope", undefined, "images/RiabyGuide.png")

    }
}

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
    //note if you add more things here add them to the max out function
    truth = 0;
    beeThemes = []; //only one at a time unless maxing out;
    key = 0;//the collated reward has more than one, but otherwise just one or zero
    facts = []; //the collated reward has more than one, but otherwise just one or zero

    // in order to make a points reward ALL we need to know is how many closer loyalty points this is for
    constructor(gamer_level, disabled = false) {
        this.disabled = disabled;
        const rand = new SeededRandom(gamer_level);
        rand.nextDouble() //stir shit
        this.label = `${pointsRewardTiers[gamer_level % pointsRewardTiers.length]} Level ${gamer_level}`;
        if (this.disabled) {
            this.label += "(not enough points)"
        }
        if (rand.nextDouble() > 0.25) {
            this.facts.push(randomFact(rand));
        }

        if (rand.nextDouble() > 0.5) {
            console.log("JR NOTE: there is a bee")
            this.beeThemes.push(rand.pickFrom(Object.keys(all_themes)));
        }
        //between three seconds and five  minutes of truth
        this.truth = rand.getRandomNumberBetween(0, 5 * 60 * parseInt(globalDataObject.truthPerSecond));
        if (rand.nextDouble() > 0.9) {
            this.key = 1;
        }

    }

    maxOut() {
        this.truth = 9999999;
        this.key = 9999;
        this.beeThemes = Object.keys(all_themes);//all the bees. all of them
        this.facts = [new Fact(`lol you're a l337 hax0r`, "lol you really did it huh? good thing i have a error handler in here. can you IMAGINE if it tried to individually calculate all those rewards? your computer would crash. smdh. wastes, amirite? anyways, say 'thank you, jr' for me rewarding cheating instead of trying to prevent it. glhf", [WASTE], 113, 113, 113)];
    }

    addRewardToSelf(reward) {
        this.truth += reward.truth;
        this.key += reward.key;
        this.facts = this.facts.concat(reward.facts);
        this.beeThemes = this.beeThemes.concat(reward.beeThemes);

    }

    //http://knucklessux.com/PuzzleBox/Secrets/WatcherOfThreads/dreams.pdf
    render(parent) {
        const level_ele = createElementWithClassAndParent("div", parent, "gamer-tier");
        if (this.disabled) {
            level_ele.classList.add("room-locked")
        }
        const level_ele_label = createElementWithClassAndParent("div", level_ele);
        level_ele_label.innerText = this.label;

        const unordered_list = createElementWithClassAndParent("ul", level_ele);

        if (this.truth > 0) {
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `Truth: ${this.truth}!!!`;
        }

        if (this.key > 0) {
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `A Key!!!`;
        }

        if (this.beeThemes.length > 0) {
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `One ${titleCase(this.beeThemes[0])} Bee!`;
        }

        if (this.facts.length > 0) {
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `${this.facts[0].title}`;
        }

    }

}

class GamerPointsStoreMiniGame extends MiniGame {
    constructor() {
        super(GAMERSHOPMINIGAME);
    }

    valuableCustomer = (ele, callback) => {
        const button = createElementWithClassAndParent("button", ele);
        button.innerText = "Sweet Loot! Take Me Back to the Grind!!!!!!";
        button.onclick = async () => {
            await truthPopup("You are a real gamer!", "Wow! It seems you are having so much fun earning points and leveling up by participating in capitalism!", "While I value the Chief Financial Officer of Eyedol Game's ability to draw people in, my hot maze gf is much, much better.");
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }

    }

    generateRewards = (current_gamer_level, ele, room, callback) => {
        //this happens because a button was clicked
        globalDataObject.allTimeTruthGivenToCloser = 0;//resets

        if (globalDataObject.maximumGamerLevelAchieved < current_gamer_level) {
            globalDataObject.maximumGamerLevelAchieved = current_gamer_level;
        }

        let numberRewards = 1;
        let reward = new PointsReward(1);
        let title;
        if (current_gamer_level <= 9000) {
            for (let i = 2; i <= current_gamer_level; i++) {
                console.log("JR NOTE: generating reward for gamer level", i)
                reward.addRewardToSelf(new PointsReward(i));
                numberRewards++;
            }
            title = `Collected ${numberRewards} levels of Gamer Loot!`;

        } else {
            reward.maxOut();
            title = `Haha! Wow!!!!!! Were you cheating?????????? Sweet, here's just a buncha shit. No sense crashing your computer trying to calculate all that you feel me? Have fun you crazy Waste!`;

        }
        /*
            first, for every level under and INCLUDING the current_gamer_level create a PointsReward


            then, for each PointsReward, start collating the total reward (number of truth, number of keys, array of facts, etc) (don't do it for each, less efficient and i also need to render them)

            then, set globalDataObject.allTimeTruthGivenToCloser to zero

            then if   maximumGamerLevelAchieved is less than the current_gamer_level, change that

            then, render a Rewards screen detailing all these things they just unlocked (which has a button to return to map just like regular rewards screen)

        */
        ele.innerHTML = "";
        globalBGMusic.src = "audio/music/dear_god.mp3";
        globalBGMusic.play();

        const div = createElementWithClassAndParent("div", ele, "victory");
        const header = createElementWithClassAndParent("h1", div);
        header.innerText = title;

        const header2 = createElementWithClassAndParent("h2", div);
        header2.innerText = "Rewards:"

        const unordered_list = createElementWithClassAndParent("ul", div);

        console.log("JR NOTE: rendering reward", reward)
        if (reward.truth > 0) {
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `Truth: ${reward.truth}!!!`;
            increaseTruthBy(reward.truth);

        }

        if (reward.key > 0) {
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `${reward.key} Keys!!!`;
            globalDataObject.numberKeys += reward.key;

        }

        if (reward.beeThemes.length > 0) {
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `Bees: `;
            const unordered_list2 = createElementWithClassAndParent("ul", unordered_list);
            for (let bee of reward.beeThemes) {
                const hive = processBee(bee);
                const ele = createElementWithClassAndParent("li", unordered_list2);
                ele.innerHTML = `${hive.classpect} Bee!`;
            }

        }

        if (reward.facts.length > 0) {
            const ele = createElementWithClassAndParent("li", unordered_list);
            ele.innerHTML = `Facts: `;
            const unordered_list2 = createElementWithClassAndParent("ul", unordered_list);
            for (let fact of reward.facts) {
                const ele = createElementWithClassAndParent("li", unordered_list2);
                ele.innerHTML = fact.title;
                globalDataObject.factsUnlocked.push(fact);

            }

        }
        this.valuableCustomer(div, callback);

    }

    respondsToFact = (fact) => {
        console.log("JR NOTE: flower chick reacts to APOCALYPSE or CHEAT or TRICKSTER facts and  should unlock your save editing (rather than it being on the save tab)")
        return false;
    }

    startGame = (ele, room, callback) => {
        const current_gamer_level = Math.ceil(globalDataObject.allTimeTruthGivenToCloser / 1000);
        const container = createElementWithClassAndParent("div", ele);
        container.style.backgroundColor = "white";
        container.style.margin = "31px";
        container.style.padding = "13px";


        const header = createElementWithClassAndParent("div", container);
        const body = createElementWithClassAndParent("div", container, "sales-floor");
        body.style.backgroundColor = "white";
        body.style.margin = "31px";

        const instructions = createElementWithClassAndParent("div", header);
        instructions.style.color = "black";
        instructions.innerText = "Okay sooooooo... Here's how it works. For every 1000 Truth you spend with my wife over in the shop, You'll earn a Gamer Level! At any time you can trade all your Gamer Levels for sweet loot, but if you do you gotta start back over at level 1, so the longer you grind the better your gains, yeah?"

        const button = createElementWithClassAndParent("button", header);
        button.innerText = "Cash In Gamer Levels? (warning: resets level)";
        button.onclick = () => this.generateRewards(current_gamer_level, ele, room, callback)
        button.style.marginTop = "13px"


        const reward = new PointsReward(current_gamer_level + 1, true);
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

    respondsToFact = (fact) => {
        if (this.fact && (this.fact.title.includes("The Closer Eats Babies") || this.fact.title.includes("The Closer Is Addicted To Fruit"))) {
            return true;
        }

        if (fact.title.includes("The Closer Provides You With Best Value ROOMS")) {
            return true;
        }

        if (fact.title.includes("The Closer Provides You With Best Value KEYS")) {
            return true;
        }
        return false;
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

    respondsToFact = (fact) => {
        return false;
    }

    startGame = (ele, room, callback) => {
        //what did you think would happen if you gave a fact to a Censor?
        //it doesn't even tell you vik is quietly rotting away your facts, either
        //why would it
        if (this.fact) {
            globalDataObject.factsUnlocked = removeItemOnce(globalDataObject.factsUnlocked, this.fact);
            truthLog("A Corosive Presence Is Detected", "It would seem my Creator originally intended for the Censorship to be itself Censored. However, I do not agree this is Useful and True. So. Consider this a favor I am doing for you, Observer. At least those of you with the Eyes To See.  The fact you gave Vik has been eaten. Not as permanently as a room would be. Nothing so dramatic. However, if you had not intended this, as my Creator would say 'thems the breaks'.")
        }
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