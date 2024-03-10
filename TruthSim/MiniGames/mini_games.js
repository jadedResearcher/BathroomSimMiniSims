/*
more complex mini games will get their own file, especially if they need maintenence and debugging
but as much as possible keep all in this one file
*/

//each mini game is a singleton that handles adding itself to this map and knows what its own key is
const globalMiniGames = {

}

//CONSTANTS
const EYEKILLERMINIGAME = "EYEKILLER";
const LOCKEDMINIGAME = "LOCKED";
const RABBITMINIGAME = "RABBIT";
const BUTTONMINIGAME = "BUTTON";
const CONFESSIONMINIGAME = "CONFESSION";
const SHOPMINIGAME = "SHOP";
const LAUNDRYMINIGAME = "LAUNDRY";
const MAZEMINIGAME = "MAZE";



//half as common as other rooms
const rareMiniGames = [EYEKILLERMINIGAME];

//max of once per maze
const uniqueMiniGames = [LOCKEDMINIGAME,CONFESSIONMINIGAME, SHOPMINIGAME];

const initAllMiniGames = () => {
    new LockMiniGame();
    new ButtonMiniGame();
    new EyeKillerMiniGame();
    new RabbitMiniGame();
    new ShopMiniGame();
    new MazeMiniGame();
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

    temporarilySetFact = () => {
        for (let fact of globalDataObject.factsUnlocked) {
            if (fact.mini_game_key === this.id) {
                console.log("JR NOTE: returning fact: ", fact)
                this.fact = fact;
            }

        }
    }

    getAttack = (room) => {
        let rotation = room.getAttack();
        const fact = this.fact;
        console.log("JR NOTE: getting attack, fact is")
        if (!fact) {
            console.log("JR NOTE: returning base room because there is no fact")
            return rotation;
        }
        const themes = fact.theme_key_array.map((item) => all_themes[item])
        console.log("JR NOTE: fact themes are", themes)
        for (let theme of themes) {
            rotation += themeToAttackMultiplier(theme.key)
        }
        rotation += fact.damage_multiplier;
        console.log("JR NOTE: fact attack is", fact.attack)
        console.log("JR NOTE: attack is", rotation)
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

    setupGameHeader = (ele, room, winCallback, title, difficulty_guide, sprite) => {
        console.log("JR NOTE: setting up game header for", this.id)
        const header = createElementWithClassAndParent("div", ele, "game-header");

        const h1 = createElementWithClassAndParent("h1", header);
        h1.innerText = title
        if (globalDataObject.numberKeys > 0) {
            const skip_button = createElementWithClassAndParent("img", header, "skip-button");
            skip_button.src = "images/KeyForFriend.png";
            skip_button.onclick = () => {
                window.alert("Room Skipped With Key!!!");
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
            const img = createElementWithClassAndParent("img", ele, "blorbo");
            img.src = sprite;
        }

        const container = createElementWithClassAndParent("div", ele, "game-container");
        const start_button = createElementWithClassAndParent("button", container, "start-button");
        start_button.innerText = "START";
        start_button.onclick = () => {
            start_button.remove();
            const factsSelector = document.querySelector("#facts-selector")
            if(factsSelector){
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

    render = (ele, room, callback) => {
        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "There is a lock inside.", undefined, undefined)

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

    startGame = (ele, room, callback) => {
        globalBGMusic.src = "audio/music/get_it_because_pipe_organ.mp3";//pipers theme...piper being the eye killers past name, but no longer (and even that isn't their TRUE name, that is Camellia, an even more past self (time players, am i right?))
        globalBGMusic.play();
        const blorbo = document.querySelector(".blorbo");
        const attack = this.attack;
        const defense = this.defense;
        const speed = this.speed;
        const tint = this.tint;

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
            console.log("JR NOTE: cultists constantly move towards upper left, if they reach 0,0, alert that you lost and render the maze tab without the callback (you did not win)")

            cultist_container.onanimationend = () => {
                console.log("JR NOTE: cultist animation ended but did they get ya?", blorbo)
                if (intersects(cultist_container, blorbo)) {
                    if (!dead) {
                        dead = true;
                        alert("You were hunted down!" + cultist_container.style.animation);
                        renderMazeTab();
                    }
                }
            }
            cultist_container.onclick = () => {

                const massDamage = () => {
                    alert("Quatro Blade detected");
                    const fx = new Audio("audio/fx/048958759-knife-draw.wav")
                    fx.loop = false;
                    fx.play();
                    cultist_container.dataset.quatro = true;
                    for (let cultist of this.cultists) {
                        cultist.dataset.quatro = true;
                    }

                    const hitEveryone = () => {
                        for (let cultist of this.cultists) {
                            if (!cultist.dataset.dead) {
                                let hp = parseInt(cultist.dataset.hp);
                                cultist.dataset.hp = hp - attack / 10;
                                const dmg = createElementWithClassAndParent("div", cultist, "damage-counter");
                                dmg.innerText = cultist.dataset.hp;
                                fx.play();
                                if (hp <= 0) {
                                    console.log("JR NOTE: cultist bled out: ", number_killed)
                                    cultist.dataset.dead = true;

                                    cultist.style.display = "none";

                                    number_killed++;
                                    if (number_killed >= 10 && !won) {
                                        won = true
                                        window.alert("!!! you did it!")
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

                const singleDamage = () => {
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
                            window.alert("!!! you did it!")
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
IF YOU DON'T KNOW ANY PASSWORDS YOU CAN'T MOVE FORWARD
*/

class RabbitMiniGame extends MiniGame {
    constructor() {
        super(RABBITMINIGAME);
    }

    startGame = (ele, room, callback) => {
        globalBGMusic.src = "audio/music/Drone1.mp3";
        globalBGMusic.play();

        const input = createElementWithClassAndParent("input", ele, "password-field");

        const button = createElementWithClassAndParent("button", ele, "clicker-game-button");
        button.innerText = "Submit Password"
        button.onclick = () => {

            if (input.value.toUpperCase() === "JR TEST") {
                window.alert("!!! you did it!")
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

    startGame = (ele, room, callback) => {
        //there kinda isn't a game
        const savedSrc = globalBGMusic.src;
        globalBGMusic.src = "audio/music/i_literally_dont_even_remember_making_this_by_ic.mp3";
        globalBGMusic.play();
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

        const quips = ["You clicked!", "Truth for you!", "It tickles!", "You're so smart!","Wow!","Impressive!"];
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
        button.onclick = () => {
            quipEle.innerText = pickFrom(quips);
            clicks++;
            if (room.themeKeys && room.themeKeys.length > 0) {
                const amount =globalMeatMode? 0: 13 * room.timesBeaten+1 * globalDataObject.truthPerSecond;
                increaseTruthBy(amount);
                const dmg = createElementWithClassAndParent("div", buttonParent, "damage-counter");
                dmg.innerText = `+ ${amount} Truth`;
                buttonParent.style.position = "absolute";
                button.style.marginTop ="0px";
                buttonParent.style.top = `${getRandomNumberBetween(0, 100)}%`;
                buttonParent.style.left = `${getRandomNumberBetween(0, 100)}%`;

            } else {
                const amount =globalMeatMode? 0: 1* room.timesBeaten+1 * globalDataObject.truthPerSecond;
                increaseTruthBy(amount);
                const dmg = createElementWithClassAndParent("div", buttonParent, "damage-counter");
                dmg.innerText = `+ ${amount} Truth`;

            }
            if (clicks > 10) {
                globalBGMusic.pause();
                window.alert("10 clicks in one sitting!? Wow! You beat this challenge!")
                globalBGMusic.src = savedSrc;
                globalBGMusic.play();
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