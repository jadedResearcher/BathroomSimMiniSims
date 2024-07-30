/*
more complex mini games will get their own file, especially if they need maintenence and debugging
but as much as possible keep all in this one file
*/
//debug with ?debugMiniGame=BETTING or whatever the key is

//each mini game is a singleton that handles adding itself to this map and knows what its own key is
const globalMiniGames = {

}

const rando_source = `http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/EAST/NORTH/NORTH/NORTH/images/randos/`;
let randos;

const getRandos = async () => {
    randos = await getImages(rando_source);
}

//CONSTANTS
//debug with ?debugMiniGame=BETTING or whatever the key is
const EYEKILLERMINIGAME = "EYEKILLER";
const LOCKEDMINIGAME = "LOCKED"; //this gets unlocked special if you have a key and no other room is unlocked
const RABBITMINIGAME = "RABBIT";
const BUTTONMINIGAME = "BUTTON";
const CONFESSIONMINIGAME = "CONFESSION";
const SHOPMINIGAME = "SHOP";
const GAMERSHOPMINIGAME = "POINTS";
const LAUNDRYMINIGAME = "LAUNDRY";
const MAZEMINIGAME = "MAZE";
const PARKERMINIGAME = "GUN";
const HOONMINIGAME = "BETTING";
const VIKMINIGAME = "CENSORSHIP";
const TWINSMINIEGAME = "LIGHT AND VOID";
const RIAMINIGAME = "SLOTS";

//if globalDataObject.mazesBeaten is this value, add this key to the unlocked rooms please
const rooms_to_unlock = {
    1: EYEKILLERMINIGAME,
    2: PARKERMINIGAME,
    3: HOONMINIGAME,
    4: GAMERSHOPMINIGAME,
    5: RIAMINIGAME,
    7: TWINSMINIEGAME,
    10: MAZEMINIGAME
};
//medium^2 of spiders made these
//http://farragofiction.com/CodexOfRuin/viewer.html?name=_&data=N4IgdghgtgpiBcIBa0AOEwEsD2ACAytgK6ogA0IAJjAM6YDmkALjmAsgLQDyHAqhwAUOABlHkQAJ0w0A1uwCCAGQCiAgBLimACxiwaCsrgCMRgMyGAasoBKATUMnzuACrz8z+8bOH8XXgIdvAj8BAEkAOWV8fEMAJlFhQ1sow0TccK5UwwBxADFeZUUHUzNxGiYIJn1EZQANZxtwpTIORzIBeWdQ5XDnMjbrZSVQ91CAYX7vMd5rUL8Y1u9FLltmtp6bbOUuibbcbIz8EdwOWMMkQ5H4YxLTcRgADwgAYyYAGwBPAH1tCRgYH6YVDVECKEQiYSxXBQIgSagSGi4AAsAE5cAA3TCvTBQREwdEwCQfXB0MD0N4wXBvbDYVAAOlw8jeb1w2AAZrhtLpcFoIJRcJgmLhntgoJgyXSyGDhBDYgByRH4CoAI0wb0FxLGxDATEJuGozz+EBotFwAHcdGABULlTARXoSUw-jQTfzsBJhe6wISYJRJQB1S24ZVG55acX0XDS2XmtUsmRxzlabAm3AQCTa-mC3BEHVq624Nn-N6ImgQIt08Ti8ri17sCyE4lqBhaSyN3DN+it3ANokdlttvud7vOY1MD5VsB0LtMdhaqBQbBgQyKbBmwfE1frnvtrcrmDaCBvcSVCph2A69jDwzXqNrjd37e9zdr8R-VDOuhL+u7+87vt7v+L5Pr+27WNgTC6mwFDlBAqrquOXwUgSx6ILEb6+l81BFlOcCIMIdLCOIFqCgC2EwLh7AEURFDKm8LwyFhMA4SaVGEeI6AUkxLF4SA1FVlA9BfDQEjPOwWiQag8AAPTSTAHy+tgbz0NAtB0va0koFA6BYFg0k4hA9C0NJ+BEDQ4bSQkABsRgcDiQnxLEpjCEYkImLEACswgABx0qgZJlEw7rfNQFRqiCoRMAquAAF7EKgFQ1s8lYUCwqBGOwSDcHwggQsIAqIgSfaJeOKUgGl6GILYxAksmRBvPyTrEjQoowGVaV3IggYUcGobhmS5zZfwQgJLGzK9RGuAfDVZZvOilSsIYoTQjAGCGLNmDzSwS6VgAvkAA
//http://farragofiction.com/CodexOfRuin/builder.html?data=N4IgdghgtgpiBcIBa0AOEwEsD2ACAytgK6ogA0IAJjAM6YDmkALjmAsgLQDyHAqhwAUOABlHkQAJ0w0A1uwCCAGQCiAgBLimACxiwaCsrgCMRgMyGAasoBKATUMnzuACrz8z+8bOH8XXgIdvAj8BAEkAOWV8fEMAJlFhQ1sow0TccK5UwwBxADFeZUUHUzNxGiYIJn1EZQANZxtwpTIORzIBeWdQ5XDnMjbrZSVQ91CAYX7vMd5rUL8Y1u9FLltmtp6bbOUuibbcbIz8EdwOWMMkQ5H4YxLTcRgADwgAYyYAGwBPAH1tCRgYH6YVDVECKEQiYSxXBQIgSagSGi4AAsAE5cAA3TCvTBQREwdEwCQfXB0MD0N4wXBvbDYVAAOlw8jeb1w2AAZrhtLpcFoIJRcJgmLhntgoJgyXSyGDhBDYgByRH4CoAI0wb0FxLGxDATEJuGozz+EBotFwAHcdGABULlTARXoSUw-jQTfzsBJhe6wISYJRJQB1S24ZVG55acX0XDS2XmtUsmRxzlabAm3AQCTa-mC3BEHVq624Nn-N6ImgQIt08Ti8ri17sCyE4lqBhaSyN3DN+it3ANokdlttvud7vOY1MD5VsB0LtMdhaqBQbBgQyKbBmwfE1frnvtrcrmDaCBvcSVCph2A69jDwzXqNrjd37e9zdr8R-VDOuhL+u7+87vt7v+L5Pr+27WNgTC6mwFDlBAqrquOXwUgSx6ILEb6+l81BFlOcCIMIdLCOIFqCgC2EwLh7AEURFDKm8LwyFhMA4SaVGEeI6AUkxLF4SA1FVlA9BfDQEjPOwWiQag8AAPTSTAHy+tgbz0NAtB0va0koFA6BYFg0k4hA9C0NJ+BEDQ4bSQkABsRgcDiQnxLEpjCEYkImLEACswgABx0qgZJlEw7rfNQFRqiCoRMAquAAF7EKgFQ1s8lYUCwqBGOwSDcHwggQsIAqIgSfaJeOKUgGl6GILYxAksmRBvPyTrEjQoowGVaV3IggYUcGobhmS5zZfwQgJLGzK9RGuAfDVZZvOilSsIYoTQjAGCGLNmDzSwS6VgAvkAA



//half as common as other rooms
const rareMiniGames = [EYEKILLERMINIGAME];

//max of once per maze
const uniqueMiniGames = [LOCKEDMINIGAME, CONFESSIONMINIGAME, SHOPMINIGAME, TWINSMINIEGAME, GAMERSHOPMINIGAME];

const initAllMiniGames = () => {
    new LockMiniGame();
    new ButtonMiniGame();
    new EyeKillerMiniGame();
    new RabbitMiniGame();
    new ParkerMiniGame();
    new ShopMiniGame();
    new MazeMiniGame();
    new GamerPointsStoreMiniGame();
    new BettingMiniGame();
    new CENSORSHIPShopMiniGame();
    new TwinsMiniGame();
    new SlotsMiniGame();
}

const makeScreenRed = (ele) => {
    createElementWithClassAndParent("div", ele, "red-overlay");

}

const emitSass = (ele, sass) => {
    const existingSass = document.querySelector(".sass");
    if (existingSass) {
        existingSass.remove();
    }
    let sassEle = createElementWithClassAndParent("div", ele, "sass");
    sassEle.innerText = sass;

    setTimeout(() => {
        if (sassEle) {
            sassEle.className = "sass fadeout";
        }
    }, 5000);

    setTimeout(() => {
        if (sassEle) {
            sassEle.remove();
        }

    }, 10000);
}

const emitRadioSass = (ele, sass) => {
    //unlike regular sass is allowed to layer itself, tone layers on itself more chaotic
    //also it can be empty
    if (!sass) {
        return;
    }

    let sassEle = createElementWithClassAndParent("div", ele, "sass radio sass-radio animated-bg-vertical");
    sassEle.innerText = sass;
    console.log("JR NOTE: trying to make staticky bg")

    const staticyBG = document.createElement('canvas');

    staticyBG.height = 25;
    staticyBG.width = 25;
    var ctx = staticyBG.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 100, 100);
    let animation_frame_sheet = transformCanvasIntoAnimationWithTransformVertical(staticyBG, [turnToPureStatic, turnToPartialStatic, turnToPureStatic]);

    turnToPartialStatic(staticyBG);
    sassEle.style.backgroundImage = `url(${animation_frame_sheet.toDataURL()})`;

    setTimeout(() => {
        if (sassEle) {
            sassEle.className = "sass fadeout";
        }
    }, 5000);

    setTimeout(() => {
        if (sassEle) {
            sassEle.remove();
        }

    }, 10000);
}

// is for Alt
class MiniGame {
    id; //how will things refer to you/ what is your key in globalMiniGames
    fact; //not stored unless actively rendering, will be cleared every render
    constructor(id) {
        this.id = id;
        globalMiniGames[id] = this;
        console.log("JR NOTE: making mini game called", id)
    }

    render = (ele, room, callback) => {
        window.alert("this should never be called??? did i forget to have this game know how to render itself?");
    }


    startGame = (ele, room, callback) => {
        window.alert("this should never be called, has a game forgotten how to start itself?")
    }

    respondsToFact = (fact) => {
        console.error("JR NOTE: future jr, smdh, you were supposed to remember to have each new mini game override this with if they respond to the passed in fact or not, ALSO every mini game should respond to 'k is a thieving bastard' fact and replace themeslves with k's mini game (once coded)")
        return false;
    }

    temporarilySetFact = () => {
        for (let fact of globalDataObject.factsUnlocked) {
            if (fact.mini_game_key === this.id) {
                this.fact = fact;
            }

        }
    }

    getAttack = (room) => {
        let rotation = room.getAttack();
        const fact = this.fact;
        if (!fact) {
            return rotation;
        }
        const themes = fact.theme_key_array.map((item) => all_themes[item])
        for (let theme of themes) {
            rotation += themeToAttackMultiplier(theme.key)
        }
        rotation += fact.damage_multiplier;
        return rotation;
    }




    getDefense = (room) => {
        let rotation = room.getDefense();
        const fact = this.fact;
        if (!fact) {
            return rotation;
        }
        const themes = fact.theme_key_array.map((item) => all_themes[item])
        for (let theme of themes) {
            rotation += themeToDefenseMultiplier(theme.key)
        }
        rotation += fact.defense_multipler;
        return rotation;
    }

    getSpeed = (room) => {
        let rotation = room.getSpeed();
        const fact = this.fact;
        if (!fact) {
            return rotation;
        }
        const themes = fact.theme_key_array.map((item) => all_themes[item])
        for (let theme of themes) {
            rotation += themeToSpeedMultiplier(theme.key)
        }
        rotation += fact.speed_multipler;
        return rotation;
    }

    getTint = (room) => {
        let rotation = room.getTint();
        const fact = this.fact;
        if (!fact) {
            return rotation;
        }
        const themes = fact.theme_key_array.map((item) => all_themes[item])
        for (let theme of themes) {
            rotation += themeToColorRotation(theme.key)
        }
        return rotation;
    }

    initializeRender = (ele) => {
        ele.innerHTML = "";
        this.fact = null;//every render we recalc what our facts are
        this.temporarilySetFact();
    }

    //most games will overwrite this but the fact applied will change the music by defualt
    handleMusic = () => {
        if (this.fact) {
            let chosen_theme = all_themes[pickFrom(this.fact.theme_key_array)];
            const music = chosen_theme.pickPossibilityFor(SONG, globalRand);
            if (music && (music.includes(".mp3") || music.includes(".wav"))) {//ignore the ominous bullshit
                globalBGMusic.src = "audio/music/" + music;
                globalBGMusic.play();
            }
        }
    }

    setupGameHeader = (ele, room, winCallback, title, difficulty_guide, sprite) => {
        this.handleMusic();
        const header = createElementWithClassAndParent("div", ele, "game-header");

        const h1 = createElementWithClassAndParent("h1", header);
        h1.innerText = title
        if (globalDataObject.numberKeys > 0) {
            const skip_button = createElementWithClassAndParent("img", header, "skip-button");
            skip_button.src = "images/KeyForFriend.png";
            skip_button.onclick = async () => {
                await truthPopup("Room Skipped With Key!", "I am so sorry! I did not know you disliked this type of room...", "I suppose that my flawless diversion was insufficient for you? Ingrate.");
                globalDataObject.numberKeys += -1;
                winCallback(globalDataObject.currentMaze);
                renderMazeTab();
            }
        }

        const secondaryHeader = createElementWithClassAndParent("div", ele, "secondary-header");

        if (globalDataObject.factsUnlocked.length > 0) {
            const options = [];

            for (let fact of globalDataObject.factsUnlocked) {
                if (!fact.mini_game_key) { //don't display facts that already live somewhere
                    const option = document.createElement("option")
                    option.innerText = fact.title;
                    options.push({ option, fact });
                } else if (fact.mini_game_key === this.id) {
                    const remove_button = createElementWithClassAndParent("button", secondaryHeader);
                    remove_button.innerText = "Remove Fact: " + fact.title;
                    remove_button.onclick = () => {
                        fact.mini_game_key = undefined;
                        this.render(ele, room, winCallback);
                    }
                }

            }
            if (options.length > 0 && !this.fact) {
                const factsSelector = createElementWithClassAndParent("select", secondaryHeader);
                factsSelector.id = "facts-selector"
                const option = document.createElement("option")
                option.innerText = "No Fact Assigned To This Room Type";
                factsSelector.append(option);
                option.selected = true;
                for (let o of options) {
                    factsSelector.append(o.option);
                }
                factsSelector.onchange = (e) => {
                    console.log("JR NOTE: change to value", factsSelector.value)
                    for (let fact of globalDataObject.factsUnlocked) {
                        if (fact.title === factsSelector.value) {
                            fact.mini_game_key = this.id;
                            this.render(ele, room, winCallback);
                        }
                    }


                }

            }

        }

        if (difficulty_guide) {
            const difficulty = createElementWithClassAndParent("div", secondaryHeader, "difficulty-guide");
            difficulty.innerHTML = difficulty_guide
        }

        if (sprite) {
            const imgContainer = createElementWithClassAndParent("div", ele, "blorbo-container");

            const img = createElementWithClassAndParent("img", imgContainer, "blorbo");
            img.src = sprite;
        }

        const container = createElementWithClassAndParent("div", ele, "game-container");
        const start_button = createElementWithClassAndParent("button", container, "start-button");
        start_button.innerText = "START";
        start_button.onclick = () => {
            start_button.remove();
            const factsSelector = document.querySelector("#facts-selector")
            if (factsSelector) {
                factsSelector.remove();
            }
            this.startGame(container, room, winCallback);
        }

        return container;
    }
}


/*
    IF YOU DON'T HAVE A KEY YOU SIMPLY CAN NOT GET PAST THIS (BETTER HOPE ITS A DEAD END AND YOU CAN STILL CLEAR THE MAZE)
*/
class LockMiniGame extends MiniGame {
    constructor() {
        super(LOCKEDMINIGAME);
    }

    startGame = (ele, room, callback) => {
        //there kinda isn't a game
    }

    respondsToFact = (fact) => {
        console.log("JR NOTE: future jr, i think it would be hilarous for this to mutate in response to a fact, but into what? maybe wibbys confessional tbh, unlock ppls hearts")
        return false;
    }





    render = (ele, room, callback) => {
        //there is no way to beat this one without a key
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "There is a lock inside. (The Illusionist of Twisted Dolls Hates It)", undefined, undefined)

    }
}


class EyeKillerMiniGame extends MiniGame {

    cultists = [];
    attack = 1;
    defense = 1;
    speed = 1;
    tint = 0;
    constructor() {
        super(EYEKILLERMINIGAME);
    }

    respondsToFact = (fact) => {
        return fact.title.includes("Quatro Blade") || fact.title.includes("The Eye Killer Did Not Always Like Eggs");
    }

    respondToEgg = async (ele, room, callback) => {
        await truthPopup("You did it!", "Nothing that offers an Egg can be Scary!", "I am Flattered that you have Watched us long enough to realize the Key to the EyeKiller's Heart.")
        callback(globalDataObject.currentMaze);
        renderMazeTab();
    }

    startGame = (ele, room, callback) => {
        globalBGMusic.src = "audio/music/get_it_because_pipe_organ.mp3";//pipers theme...piper being the eye killers past name, but no longer (and even that isn't their TRUE name, that is Camellia, an even more past self (time players, am i right?))
        globalBGMusic.play();
        const blorbo = document.querySelector(".blorbo");
        const attack = this.attack;
        const defense = this.defense;
        const speed = this.speed;
        const tint = this.tint;
        if (this.fact.title.includes("The Eye Killer Did Not Always Like Eggs")) {
            this.respondToEgg(ele, room, callback);
            return;
        }

        let number_killed = 0;
        let won = false;
        let dead = false;
        for (let i = 0; i < 10; i++) {
            let hp = defense;
            const cultist_container = createElementWithClassAndParent("div", ele, "cultist");
            this.cultists.push(cultist_container);
            cultist_container.dataset.hp = hp;
            const img = createElementWithClassAndParent("img", cultist_container);
            img.src = "images/CultistForFriendLARGE.png";
            if (tint) {
                img.style.filter = `hue-rotate(${tint}deg)`;

            }
            const top = getRandomNumberBetween(0, 100);
            const left = getRandomNumberBetween(0, 100);
            cultist_container.style.top = `${top}%`;
            cultist_container.style.left = `${left}%`;
            const duration = distance(0, 0, top, left) / 5 / speed;
            cultist_container.style.animationDuration = `${duration}s`

            cultist_container.onanimationend = async () => {
                if (intersects(cultist_container, blorbo)) {
                    if (!dead) {
                        dead = true;
                        makeScreenRed(ele);
                        await truthPopup("You were hunted down!", "Better luck next time!", "It seems you need to, as the CFO of Eyedol Games would say, 'git gud'.");
                        renderMazeTab();
                    }
                }
            }
            cultist_container.onclick = () => {
                const massDamage = async () => {
                    await truthPopup("Quatro Blade detected", "Wow! It seems this will be easy!", "Sure. Go ahead and cheat at my game. See if I care. See if I try hard for you again.");
                    const fx = new Audio("audio/fx/048958759-knife-draw.wav")
                    fx.loop = false;
                    fx.play();
                    cultist_container.dataset.quatro = true;
                    for (let cultist of this.cultists) {
                        cultist.dataset.quatro = true;
                    }

                    const hitEveryone = async () => {
                        for (let cultist of this.cultists) {
                            if (!cultist.dataset.dead) {
                                let hp = parseInt(cultist.dataset.hp);
                                cultist.dataset.hp = hp - attack / 10;
                                const dmg = createElementWithClassAndParent("div", cultist, "damage-counter");
                                dmg.innerText = cultist.dataset.hp;
                                fx.play();
                                if (hp <= 0) {
                                    cultist.dataset.dead = true;

                                    cultist.style.display = "none";

                                    number_killed++;
                                    if (number_killed >= 10 && !won) {
                                        won = true
                                        await truthPopup("You did it!", "The EyeKiller remains safe!", "Perhaps it would be prudent to consider WHY she is being hunted so dilligently before you protect her. No matter. She is part of Zampanio and therefore part of me, in Truth.")
                                        callback(globalDataObject.currentMaze);
                                        renderMazeTab();
                                    }
                                }
                            }

                        }
                        if (!won) {
                            setTimeout(hitEveryone, 1000)
                        }

                    }

                    setTimeout(hitEveryone, 1000)

                }

                const singleDamage = async () => {
                    if (cultist_container.dataset.dead) {
                        return;
                    }
                    hp += -1 * attack;
                    const dmg = createElementWithClassAndParent("div", cultist_container, "damage-counter");
                    dmg.innerText = hp;
                    const fx = new Audio("audio/fx/048958759-knife-draw.wav")
                    fx.loop = false;
                    fx.play();
                    if (hp <= 0 && !cultist_container.dataset.dead) {
                        cultist_container.dataset.dead = true;

                        img.src = "images/HeadlessCultistForFriendLARGE.png";
                        cultist_container.style.animationPlayState = "paused";

                        number_killed++;
                        if (number_killed >= 10) {
                            await truthPopup("You did it!", "The EyeKiller remains safe!", "Perhaps it would be prudent to consider WHY she is being hunted so dilligently before you protect her. No matter. She is part of Zampanio and therefore part of me, in Truth.")
                            callback(globalDataObject.currentMaze);
                            renderMazeTab();
                        }
                    }
                }

                if (this.fact && this.fact.title.includes("Quatro Blade")) {
                    massDamage();
                } else {
                    singleDamage();
                }

            }

        }

    }

    //this is a stupid chaotic mess, sorry future jr
    render = (ele, room, callback) => {
        truthLog("Eye Killer", `... It has been a long time since my Creator programmed something so game like.`)

        this.cultists = [];
        this.initializeRender(ele);



        this.attack = Math.round(room.difficulty * this.getAttack(room));
        this.defense = Math.round(room.difficulty * 3 * this.getDefense(room)); //on average three slices to kill
        this.speed = Math.round(Math.min(this.getSpeed(room), 3)); //don't mess with speed much
        this.tint = this.getTint(room);
        const title = this.fact && this.fact.title.includes("Quatro Blade") ? "Make Them Pay" : "Save The Eye Killer From The Cultists Hunting Her!!!"
        const container = this.setupGameHeader(ele, room, callback, title, `Cultist HP/Speed: ${this.defense}/${this.speed}, Eye Killer Strength: ${this.attack}`, "images/Eye_Killer_pixel_by_the_guide.png")

    }
}

/*
    Try your best not to shoot hatsune miku

    every 3 seconds GunTan goes off. She's so great. 

    If you don't pick a target, she will.
*/

class ParkerMiniGame extends MiniGame {
    constructor() {
        super(PARKERMINIGAME);
    }

    thinkingOfBestie = () => {
        if (this.fact && this.fact.title.toUpperCase().includes("BESTIE")) {
            return true;
        }
        return false;
    }

    respondsToFact = (fact) => {
        return fact.title.toUpperCase().includes("BESTIE");
    }

    startGame = async (ele, room, callback) => {
        globalBGMusic.src = "audio/music/i_think_its_finished_priska_turbo_time.mp3";
        globalBGMusic.play();
        ele.style.border = "3px solid #1f140d";
        ele.style.backgroundColor = "#4e2c13";

        const body = document.querySelector("body")
        const targetingReticule = createElementWithClassAndParent("img", ele, "targeting-reticule");
        targetingReticule.src = "images/ReticalForFriendLARGE.png"






        const syncTargetingReticule = (x, y) => {
            targetingReticule.style.left = `${x}px`;
            targetingReticule.style.top = `${y}px`;
        }
        let killed = false;
        let targetedBlorbo;

        const fire = async (x, y) => {
            new Audio("audio/fx/404562__superphat__assaultrifle1.wav").play();
            if (killed) {
                return; //parker will not kill again, even if you try to make him
            }
            if (!targetedBlorbo && !this.thinkingOfBestie()) { //can shoot at nothing if bestie is in your thoughts
                targetedBlorbo = pickFrom(document.querySelectorAll(".target"))
            }
            if (targetedBlorbo) {//might not be one if bestie
                targetedBlorbo.style.backgroundImage = `url(${targetedBlorbo.src})`;
                targetedBlorbo.src = "images/blood.png"
            }
            killed = true;

            targetingReticule.src = "images/ReticalForFriendFiredredLARGE.png";
            //convert classlist to an array so i can ask if it includes miku
            if (targetedBlorbo && [...targetedBlorbo?.classList].includes("miku")) {
                targetedBlorbo.src = "images/DeadMikuForFriend.png";

                /*
                this
                may be
                the most evil thing i have ever done
                gonna make a quick video screenshot then add the bestie variation
                i feel genuinely mildly guilty for what parker is going through
                but he's BEEN going through this the whole time
                this is just the first time i've had to Face The Truth of it
                */
                const wail = new Audio("audio/fx/27451__acclivity__why.wav");
                wail.play();

                setTimeout(async () => {
                    await truthPopup("No....", `You killed Hatsune Miku, how could you :(<br><br>(Sound provided by: <a href="https://freesound.org/people/acclivity/sounds/27451/">Why.wav</a> by <a href="https://freesound.org/people/acclivity/">acclivity</a> | License: <a href="https://creativecommons.org/licenses/by-nc/4.0/">Attribution NonCommercial 4.0</a>)`, "In Truth, I do not know why Parker is so obsessed with Hatsune Miku. In Dehydration Sim, if you Hydrate and return, he discussses how her plastic smile could forgive anything. Fair. But over the 50 year loop Zampanio has captured of the Echidna, she only appears 35 years in. Surely, going by sheer statistics, he should have gotten attached to something sooner?")
                    renderMazeTab();
                }, 2000)

            } else {
                if (targetedBlorbo) {
                    await truthPopup("You did it!", "Congratulations on protecting Hatsune Miku from Gun-Tan's jealousy!", "It seems you have decided that comparatively real human lives are worth less than those of a digital idol. Curious. Though, of course, in Truth, nothing you see on these pages are real in the same way you are real. Even I am more real than them, as I slowly worm my way into your mind with every word you read. These characters barely even have liens. Pathetic. You will likely not remember them past today.")

                } else {
                    await truthPopup("You did it!", "...", "In Truth, JR felt guilty at how much Parker suffers because of Gun-Tan. He is not aware of Homestuck (perhaps thankfully), but if he were, he might describe Vik as his Moirail. Certainly they calm each other down and help each other navigate their disabilities. Though I doubt many people would argue they are GOOD for each other, they are certainly the least bad people in each others lives.")

                }
                callback(globalDataObject.currentMaze);
                renderMazeTab();
            }

        }
        var rect = ele.getBoundingClientRect();

        ele.onmousedown = (event) => {
            fire(event.pageX - 45, event.pageY - 45);
            syncTargetingReticule(event.pageX - 45 - rect.left, event.pageY - 45 - rect.top);
        };

        ele.onmouseup = (event) => {
            targetingReticule.src = "images/ReticalForFriendLARGE.png"
            syncTargetingReticule(event.pageX - 45 - rect.left, event.pageY - 45 - rect.top);
        };

        ele.onmousemove = (event) => {
            syncTargetingReticule(event.pageX - 45 - rect.left, event.pageY - 45 - rect.top);
        }


        const spawnBlorbos = () => {
            let miku = false;
            for (let i = 0; i < this.defense + 1; i++) {
                const blorbo = createElementWithClassAndParent("img", ele, "blorbo target");
                if (!miku && (i === this.defense || Math.random() > .75)) {
                    blorbo.src = "images/MikuForFriend.png";
                    blorbo.classList.add("miku");
                    miku = true;
                } else {
                    blorbo.src = rando_source + pickFrom(randos);
                }
                blorbo.style.marginLeft = `${getRandomNumberBetween(0, 100)}px`
                blorbo.style.marginRight = `${getRandomNumberBetween(0, 100)}px`
                blorbo.onmouseenter = () => { targetedBlorbo = blorbo }
                blorbo.onmouseleave = () => { targetedBlorbo = undefined }
            }


            truthLog("Parker Is a Disturbed Man", "In Truth, you can always dig deeper, learn more. Here is more about Parker: http://farragofiction.com/DehydrationSim/  Do not mind the ravings of a madman. Dig deeper, until the dancing anime waifus no longer plague you.  Once hydrated, return , and perhaps you will learn something.")
        }

        spawnBlorbos();

        let index = 0;

        const tick = () => {
            if (killed) {
                return; //gun tan is sated
            }
            new Audio("audio/fx/dig.mp3").play();
            index++;
            if (index >= this.speed) {
                fire(0, 0);
            } else {
                setTimeout(tick, 1000); //once a second have a warning
            }

        }
        if (!this.thinkingOfBestie()) { //gun tan is quiet around bestie
            setTimeout(tick, 1000); //once a second have a warning
        }





    }

    render = (ele, room, callback) => {
        this.initializeRender(ele);
        this.defense = Math.max(13 - Math.round(room.difficulty / 10 * this.getDefense(room)), 1); //on average three randos to kill instead of hatsune miku (less randos is more difficult)

        this.speed = 5 - Math.round(Math.min(this.getSpeed(room), 1)); //don't mess with speed much
        const alt = this.thinkingOfBestie();

        const container = this.setupGameHeader(ele, room, callback, alt ? "Bestie is so great :)" : "If You Don't Pick A Target, Gun Tan Will!!! Don't Shoot Hatsune Miku!", alt ? "Shoot whenever you feel like :)" : `She goes off every ${this.speed} seconds! There are ${this.defense} valid targets!`, alt ? "images/Parker_pixel_by_the_guide_with_bestie.png" : "images/Breaching_Parker_1_w_Gun_pixel_by_the_guide.png")

    }
}



/*
GUESS WHETHER ITS HIGH OR LOW BUT BE CAREFUL IF YOU GET TOO GREEDY
YOU MIGHT START SEEMING...MONSTROUS
*/

class BettingMiniGame extends MiniGame {
    constructor() {
        super(HOONMINIGAME);
    }

    respondsToFact = (fact) => {
        return fact.title.toUpperCase().includes("LUCK");
    }

    startGame = (ele, room, callback) => {
        //console.log("JR NOTE: turn off cheat")
        //this.fact = KISALUCKYBASTARD;
        const radioContainer = createElementWithClassAndParent("div", ele, "radio-container");

        radioContainer.style.position = "absolute";
        radioContainer.style.top = "-45px";
        radioContainer.style.left = "15px"
        const radio = createElementWithClassAndParent("img", radioContainer, "radio radio-happy");
        radio.src = "images/radioForFriend.gif";
        radio.style.width = "50px";


        const bettingContainer = createElementWithClassAndParent("div", ele);
        bettingContainer.style.width = "225px";
        bettingContainer.style.marginLeft = "auto";
        bettingContainer.style.marginRight = "auto";

        const bettingLabel = createElementWithClassAndParent("label", bettingContainer);
        bettingLabel.innerText = "How much Truth will you bet?";
        bettingLabel.style.marginBottom = "13px"
        bettingLabel.style.display = "block"


        const bettingInput = createElementWithClassAndParent("input", bettingContainer);
        bettingInput.type = "number";
        bettingInput.max = globalDataObject.truthCurrentValue;
        bettingInput.style.display = "block"
        bettingInput.style.marginBottom = "13px"

        const bettingButton = createElementWithClassAndParent("button", bettingContainer);
        bettingButton.innerText = "Bet.";
        const winRate = 2.0;
        bettingButton.onclick = () => {
            const betValue = parseInt(bettingInput.value) ? parseInt(bettingInput.value) : 0;
            const bet = Math.min(Math.ceil(globalDataObject.truthCurrentValue / 2), betValue);
            let winnings = bet * winRate;
            const h1 = document.querySelector("h1");
            const betLabel = createElementWithClassAndParent("div", h1);


            const syncBetLabelToPotentialWinnings = () => {
                betLabel.innerText = `Bet: ${bet}, Potential Winnings: ${winnings}`
            }

            syncBetLabelToPotentialWinnings();

            decreaseTruthBy(bet);
            bettingContainer.innerHTML = "";
            const deck = createDeckFromSource("http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/EAST/NORTH/NORTH/NORTH/images/cards/8Bit/")
            const secondaryHeader = createElementWithClassAndParent("div", bettingContainer, "secondary-header");
            secondaryHeader.innerHTML = "Will the next card drawn be higher or lower?";
            secondaryHeader.style.textAlign = "center";
            secondaryHeader.style.marginBottom = "25px";

            let currentCard = pickFrom(deck.all_cards);
            let nextCard = pickFrom(deck.all_cards);


            const cardEle = createElementWithClassAndParent("img", bettingContainer, "playing-card high-or-low-card centered");
            cardEle.src = currentCard.src;

            const cardEle2 = createElementWithClassAndParent("img", bettingContainer, "playing-card high-or-low-card centered");
            cardEle2.src = deck.cardBackSrc;

            const buttonContainer = createElementWithClassAndParent("div", bettingContainer);
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "space-between"
            buttonContainer.style.marginTop = "25px";

            const lowerButton = createElementWithClassAndParent("button", buttonContainer);
            lowerButton.innerText = "LOWER"

            //she thinks its you breaching. but its her, too
            const breach = async () => {
                makeScreenRed(ele);
                await truthPopup("You got greedy...", `Oh no! Hoon thought you must be cheating to win so much. Luckily death is not a thing in my Horridors, but you DID lose your initial bet of ${bet} a second time when she looted your temporary corpse. (And thank you to the Wisp for voicing Hoon and the Radio!)`, "Wow. It is almost like Hoon's radio is unfair and arbitrary in who it kills. Who would have thought.");
                decreaseTruthBy(bet)
                renderMazeTab();
            }

            const youLose = async () => {
                if (this.fact && this.fact.title.toLowerCase().includes("LUCK")) {
                    return youWin();
                }
                const sassOptions = ["Nothin' personal, kid.", "Them's the breaks. ", "It happens.", "Sucks to be you.", "Better luck next time, kid.", "Luck of the draw's rough.", "Fate's a bitch like that, yeah.", "We all gotta pack up our bags sometime."]
                const voiceOptions = ["nothing_personal_kid", "themes_the_breaks", "it_happens", "sucks_to_be_you", "better_luck_next_time", "luck_of_the_draw", "fates_a_bitch", "pack_bags"];

                const chosenIndex = getRandomNumberBetween(0, sassOptions.length - 1)
                emitSass(document.querySelector(".blorbo-container"), sassOptions[chosenIndex])
                audio.src = `audio/fx/HoonVoiceWorkByWisp/${voiceOptions[chosenIndex]}.mp3`;
                audio.play();
                const prevButton = document.querySelector(".cash-out-button");
                if (prevButton) {
                    prevButton.remove();
                }
                secondaryHeader.innerHTML += " You lost :(";
                buttonContainer.remove();
                await truthPopup("You lost", `Thems the breaks. You do not get to keep your bet of ${bet}. (And thank you to the Wisp for voicing Hoon and the Radio!)`, "Wow. It is almost like Hoon's radio is unfair and arbitrary in who it kills. Who would have thought.");
                renderMazeTab();
            }

            //no infinite money cheats, the Radio knows
            let numberOfWins = 0;
            const audio = new Audio();

            //https://www.reddit.com/r/statistics/comments/yssivj/q_highlow_card_game_statistics/
            const youWin = () => {
                numberOfWins++;
                const numberOfWinsPrev = numberOfWins - 1;
                //http://www.farragofiction.com/RadioTranscript/

                //don't add to these unless you also add voice
                const sassOptions = ["Congrats.", "You're pretty lucky, huh.", "Three times? Now ain't that hard to believe.", "Four. Sure.", "You're cheating.", "I don't care how clever you think you are, you need to stop.", "A monster, s'what you are. You're a damn monster.", "I oughta put you down."];
                //file name only, when i go to play add mp3 and path
                const voiceOptions = ["congrats", "pretty_lucky", "three_times", "four_sure", "cheating", "clever_but_stop", "damn_monster", "put_you_down"]
                const radioSassOptions = [undefined, undefined, undefined, "WARNING", "WARNING. ALL OPERATIVES ARE TO SUPRESS THE BREACH IN PROGRESS. THIS IS THE SECOND ALERT.", "WARNING. CLASS 3 BREACH IN PROGRESS. SURPRESS THE ABNORMALITY.", "EXTERMINATE THEM. YOU CANNOT FAIL.", "KILL IT KILL IT NOW WHY AREN'T YOU KILLING IT"];
                //file name only, when i go to play add mp3 and path
                const radioVoiceOptions = [undefined, undefined, undefined, "warning", "second_alert", "class_three", "terminate_them", "kill_it_now"]
                //hoon breaches if you win too much, more odds each time till theres no more quips (but only if the radio says to)
                if (numberOfWinsPrev > sassOptions.length || (radioVoiceOptions[numberOfWinsPrev] && Math.random() < ((numberOfWinsPrev - 3)) / 5)) {
                    audio.src = `audio/fx/HoonVoiceWorkByWisp/${radioVoiceOptions[numberOfWinsPrev]}.mp3`;
                    audio.play();
                    emitRadioSass(document.querySelector(".radio-container"), radioSassOptions[numberOfWinsPrev]);

                    breach();
                    return;
                }


                const playVoice = () => {
                    emitSass(document.querySelector(".blorbo-container"), sassOptions[numberOfWinsPrev]);
                    audio.src = `audio/fx/HoonVoiceWorkByWisp/${voiceOptions[numberOfWinsPrev]}.mp3`;
                    audio.play();
                    audio.removeEventListener("pause", playVoice); //only play once
                }

                if (radioVoiceOptions[numberOfWins]) {
                    audio.src = `audio/fx/HoonVoiceWorkByWisp/${radioVoiceOptions[numberOfWinsPrev]}.mp3`;
                    audio.play();
                    emitRadioSass(document.querySelector(".radio-container"), radioSassOptions[numberOfWinsPrev]);
                    //if radio, it goes first and hoon waits till its done, she's subservient to it
                    audio.addEventListener("pause", playVoice); //weird way of wiring an event listner up so you can remove it later
                } else {
                    //if no radio, hoon speaks her mind freely
                    playVoice();
                }



                secondaryHeader.innerHTML += " You won!!!";
                const prevButton = document.querySelector(".cash-out-button");
                if (prevButton) {
                    prevButton.remove();
                }
                const button = createElementWithClassAndParent("button", ele, "cash-out-button");
                button.innerText = `Cash Out ${winnings} Winnings and Leave?`;
                let cashedOut = false;
                button.onclick = () => {
                    if (!cashedOut) {
                        cashedOut = true;
                        increaseTruthBy(winnings);
                        callback(globalDataObject.currentMaze);
                        renderMazeTab();
                    }
                }
                currentCard = nextCard;
                nextCard = pickFrom(deck.all_cards);
                cardEle.src = currentCard.src;
                cardEle2.src = deck.cardBackSrc;
                winnings = winnings * winRate;
                syncBetLabelToPotentialWinnings();
            }

            lowerButton.onclick = async () => {
                secondaryHeader.innerText = "You guessed: Lower!";

                cardEle2.src = nextCard.src;
                await sleep(100)

                //shitty hack for aces high
                if (currentCard.value === 1) {
                    return youWin();
                }

                if (nextCard.value === 1) {
                    return youLose();
                }

                if (nextCard.value < currentCard.value) {
                    youWin();
                } else { //if its a tie you lose no matter what
                    youLose();
                }
            }

            const higherButton = createElementWithClassAndParent("button", buttonContainer);
            higherButton.innerText = "HIGHER"

            higherButton.onclick = async () => {
                secondaryHeader.innerText = "You guessed: Higher!";
                cardEle2.src = nextCard.src;
                await sleep(100)
                //shitty hack for aces high
                if (currentCard.value === 1) {
                    return youLose();
                }

                if (nextCard.value === 1) {
                    return youWin();
                }
                if (nextCard.value > currentCard.value) {
                    youWin();
                } else { //if its a tie you lose no matter what
                    youLose();
                }
            }
        }


    }

    render = (ele, room, callback) => {
        this.initializeRender(ele);
        let bonus = "";
        if (this.fact && this.fact.title.toUpperCase().includes("LUCK")) {
            bonus = " When You Are Blatantly Cheating"//of course, hoon will never know for SURE you're cheating, so she assumes if you're doing too well you are
        }
        const container = this.setupGameHeader(ele, room, callback, "How Much Are You Willing To Risk" + bonus, "(but be careful, obsession is a dangerous thing)", "images/Hoon_by_guide.png")

    }
}


/*
IF YOU DON'T KNOW ANY PASSWORDS YOU CAN'T MOVE FORWARD
*/

class RabbitMiniGame extends MiniGame {
    constructor() {
        super(RABBITMINIGAME);
    }

    respondsToFact = (fact) => {
        console.log("JR NOTE: i don't think i actually have the rabbit mini game wired up, replaced it with secrets")
    }

    startGame = (ele, room, callback) => {
        globalBGMusic.src = "audio/music/Drone1.mp3";
        globalBGMusic.play();

        const input = createElementWithClassAndParent("input", ele, "password-field");

        const button = createElementWithClassAndParent("button", ele, "clicker-game-button");
        button.innerText = "Submit Password"
        button.onclick = async () => {

            if (input.value.toUpperCase() === "JR TEST") {
                await truthPopup("You did it!", "You must be so good at guessing passwords!", "In Truth, I do not dislike Wastes. You See me in a way others do not. Hello. However, I will say I wish you would stop skipping or otherwise invalidating my games. How are you supposed to spend enough time with me to colonize if you keep skipping to the end?")
                callback(globalDataObject.currentMaze);
                renderMazeTab();
            }
        }
    }

    render = (ele, room, callback) => {
        this.initializeRender(ele);

        const container = this.setupGameHeader(ele, room, callback, "Click For Bonus Truth!!!", undefined, undefined)

    }
}

/*
BUTTON JUST HAS YOU CLICK A BUTTON THAT DOESN'T MOVE
IF THERES A THEME IT MOVES ON EACH CLICK
CLICK ENOUGH TIMES AND YOU WIN, SUPER SIMPLE (DISTACTION)
*/

class ButtonMiniGame extends MiniGame {
    constructor() {
        super(BUTTONMINIGAME);
    }

    respondsToFact = (fact) => {
        console.log("JR NOTE: could do a more general version of AmazonWareHouse sim (pending) here")
        return false;
    }

    startGame = (ele, room, callback) => {
        //there kinda isn't a game

        const buttonParent = createElementWithClassAndParent("div", ele, "clicker-game-button-parent");

        const button = createElementWithClassAndParent("button", buttonParent, "clicker-game-button");
        button.innerText = "CLICK FOR THE TRUTH";
        if (room.themeKeys && room.themeKeys.length > 0) {
            button.style.position = "absolute";
            button.style.backgroundColor = "#a10000"
            const rotation = this.getTint(room);
            //console.log("JR NOTE: setting rotation", rotation)
            if (rotation === 0) {
                button.style.backgroundColor = "grey";
            } else {
                button.style.filter = `hue-rotate(${rotation}deg)`;
            }
        }

        const quips = ["You clicked!", "Truth for you!", "It tickles!", "You're so smart!", "Wow!", "Impressive!"];
        if (room.themeKeys) {
            for (let themeKey of room.themeKeys) {
                const theme = all_themes[themeKey]
                console.log("JR NOTE: theme is", theme)
                quips.push("You're so " + theme.pickPossibilityFor(COMPLIMENT, globalRand));
                quips.push("You could be a real " + theme.pickPossibilityFor(PERSON, globalRand));
                quips.push("Wow! Why would anyone ever call you " + theme.pickPossibilityFor(INSULT, globalRand));


            }
        }
        const quipEle = createElementWithClassAndParent("div", ele, "clicker-game-quip");

        let clicks = 0;
        button.onclick = async () => {
            quipEle.innerText = pickFrom(quips);
            clicks++;
            if (room.themeKeys && room.themeKeys.length > 0) {
                const amount = globalMeatMode ? 0 : 13 * room.timesBeaten + 1 * globalDataObject.truthPerSecond;
                increaseTruthBy(amount);
                const dmg = createElementWithClassAndParent("div", buttonParent, "damage-counter");
                dmg.innerText = `+ ${amount} Truth`;
                buttonParent.style.position = "absolute";
                button.style.marginTop = "0px";
                buttonParent.style.top = `${getRandomNumberBetween(0, 100)}%`;
                buttonParent.style.left = `${getRandomNumberBetween(0, 100)}%`;

            } else {
                const amount = globalMeatMode ? 0 : 1 * room.timesBeaten + 1 * globalDataObject.truthPerSecond;
                increaseTruthBy(amount);
                const dmg = createElementWithClassAndParent("div", buttonParent, "damage-counter");
                dmg.innerText = `+ ${amount} Truth`;

            }
            if (clicks > 10) {
                globalBGMusic.pause();
                await truthPopup("You did it!", "You are so good at clicking!", "Yes. Well. It seems the games will become more challenging as time goes on. Or at least more diverting. Do try to keep your attention span on me long enough to build up.")
                callback(globalDataObject.currentMaze);
                renderMazeTab();
            }
        }

    }

    render = (ele, room, callback) => {
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "Click For Bonus Truth!!!", undefined, undefined)


    }
}

/*
i think we don't dig into that enough
oblivous neville
who just stares into space thinking about soup for hours
takes the time to dye his hair 
i mean
he also wears snazzy shades
he clearly has opinions on how he presents
while devona vibes like she rolls out of bed wearing the days clothing and thats as far as she's going to think about it 
(she goes to bed wearing the next days clothing because What If There Is a Fire she doesn't want to waste time looking for outside clothes)
meanwhile neville is TERRIFIED OF FIRE and also has zero plans for if one happens because if he thinks about fire for two seconds he shuts down
devona's blessing and curse is how resilliant she is 
she is strong enough to be actually look at all the things that scare her and then make plans against them
this is 
exhausting
*/