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
const GAMERSHOPMINIGAME = "POINTS STORE";
const LAUNDRYMINIGAME = "LAUNDRY";
const MAZEMINIGAME = "MAZE";
const PARKERMINIGAME = "GUN";

//if globalDataObject.mazesBeaten is this value, add this key to the unlocked rooms please
const rooms_to_unlock = {
    1: EYEKILLERMINIGAME,
    2: PARKERMINIGAME,
    3: GAMERSHOPMINIGAME,
    10: MAZEMINIGAME
};
//medium^2 of spiders made these
//http://farragofiction.com/CodexOfRuin/viewer.html?name=_&data=N4IgdghgtgpiBcIBa0AOEwEsD2ACAytgK6ogA0IAJjAM6YDmkALjmAsgLQDyHAqhwAUOABlHkQAJ0w0A1uwCCAGQCiAgBLimACxiwaCsrgCMRgMyGAasoBKATUMnzuACrz8z+8bOH8XXgIdvAj8BAEkAOWV8fEMAJlFhQ1sow0TccK5UwwBxADFeZUUHUzNxGiYIJn1EZQANZxtwpTIORzIBeWdQ5XDnMjbrZSVQ91CAYX7vMd5rUL8Y1u9FLltmtp6bbOUuibbcbIz8EdwOWMMkQ5H4YxLTcRgADwgAYyYAGwBPAH1tCRgYH6YVDVECKEQiYSxXBQIgSagSGi4AAsAE5cAA3TCvTBQREwdEwCQfXB0MD0N4wXBvbDYVAAOlw8jeb1w2AAZrhtLpcFoIJRcJgmLhntgoJgyXSyGDhBDYgByRH4CoAI0wb0FxLGxDATEJuGozz+EBotFwAHcdGABULlTARXoSUw-jQTfzsBJhe6wISYJRJQB1S24ZVG55acX0XDS2XmtUsmRxzlabAm3AQCTa-mC3BEHVq624Nn-N6ImgQIt08Ti8ri17sCyE4lqBhaSyN3DN+it3ANokdlttvud7vOY1MD5VsB0LtMdhaqBQbBgQyKbBmwfE1frnvtrcrmDaCBvcSVCph2A69jDwzXqNrjd37e9zdr8R-VDOuhL+u7+87vt7v+L5Pr+27WNgTC6mwFDlBAqrquOXwUgSx6ILEb6+l81BFlOcCIMIdLCOIFqCgC2EwLh7AEURFDKm8LwyFhMA4SaVGEeI6AUkxLF4SA1FVlA9BfDQEjPOwWiQag8AAPTSTAHy+tgbz0NAtB0va0koFA6BYFg0k4hA9C0NJ+BEDQ4bSQkABsRgcDiQnxLEpjCEYkImLEACswgABx0qgZJlEw7rfNQFRqiCoRMAquAAF7EKgFQ1s8lYUCwqBGOwSDcHwggQsIAqIgSfaJeOKUgGl6GILYxAksmRBvPyTrEjQoowGVaV3IggYUcGobhmS5zZfwQgJLGzK9RGuAfDVZZvOilSsIYoTQjAGCGLNmDzSwS6VgAvkAA
//http://farragofiction.com/CodexOfRuin/builder.html?data=N4IgdghgtgpiBcIBa0AOEwEsD2ACAytgK6ogA0IAJjAM6YDmkALjmAsgLQDyHAqhwAUOABlHkQAJ0w0A1uwCCAGQCiAgBLimACxiwaCsrgCMRgMyGAasoBKATUMnzuACrz8z+8bOH8XXgIdvAj8BAEkAOWV8fEMAJlFhQ1sow0TccK5UwwBxADFeZUUHUzNxGiYIJn1EZQANZxtwpTIORzIBeWdQ5XDnMjbrZSVQ91CAYX7vMd5rUL8Y1u9FLltmtp6bbOUuibbcbIz8EdwOWMMkQ5H4YxLTcRgADwgAYyYAGwBPAH1tCRgYH6YVDVECKEQiYSxXBQIgSagSGi4AAsAE5cAA3TCvTBQREwdEwCQfXB0MD0N4wXBvbDYVAAOlw8jeb1w2AAZrhtLpcFoIJRcJgmLhntgoJgyXSyGDhBDYgByRH4CoAI0wb0FxLGxDATEJuGozz+EBotFwAHcdGABULlTARXoSUw-jQTfzsBJhe6wISYJRJQB1S24ZVG55acX0XDS2XmtUsmRxzlabAm3AQCTa-mC3BEHVq624Nn-N6ImgQIt08Ti8ri17sCyE4lqBhaSyN3DN+it3ANokdlttvud7vOY1MD5VsB0LtMdhaqBQbBgQyKbBmwfE1frnvtrcrmDaCBvcSVCph2A69jDwzXqNrjd37e9zdr8R-VDOuhL+u7+87vt7v+L5Pr+27WNgTC6mwFDlBAqrquOXwUgSx6ILEb6+l81BFlOcCIMIdLCOIFqCgC2EwLh7AEURFDKm8LwyFhMA4SaVGEeI6AUkxLF4SA1FVlA9BfDQEjPOwWiQag8AAPTSTAHy+tgbz0NAtB0va0koFA6BYFg0k4hA9C0NJ+BEDQ4bSQkABsRgcDiQnxLEpjCEYkImLEACswgABx0qgZJlEw7rfNQFRqiCoRMAquAAF7EKgFQ1s8lYUCwqBGOwSDcHwggQsIAqIgSfaJeOKUgGl6GILYxAksmRBvPyTrEjQoowGVaV3IggYUcGobhmS5zZfwQgJLGzK9RGuAfDVZZvOilSsIYoTQjAGCGLNmDzSwS6VgAvkAA



//half as common as other rooms
const rareMiniGames = [EYEKILLERMINIGAME];

//max of once per maze
const uniqueMiniGames = [LOCKEDMINIGAME, CONFESSIONMINIGAME, SHOPMINIGAME];

const initAllMiniGames = () => {
    new LockMiniGame();
    new ButtonMiniGame();
    new EyeKillerMiniGame();
    new RabbitMiniGame();
    new ParkerMiniGame();
    new ShopMiniGame();
    new MazeMiniGame();
    new GamerPointsStoreMiniGame();
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
            const img = createElementWithClassAndParent("img", ele, "blorbo");
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

            cultist_container.onanimationend = async () => {
                console.log("JR NOTE: cultist animation ended but did they get ya?", blorbo)
                if (intersects(cultist_container, blorbo)) {
                    if (!dead) {
                        dead = true;
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
                                    console.log("JR NOTE: cultist bled out: ", number_killed)
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

    startGame = async (ele, room, callback) => {
        globalBGMusic.src = "audio/music/i_think_its_finished_priska_turbo_time.mp3";
        globalBGMusic.play();
        ele.style.border = "3px solid #1f140d";
        ele.style.backgroundColor = "#4e2c13";

        const body = document.querySelector("body")
        const targetingReticule = createElementWithClassAndParent("img", ele, "targeting-reticule");
        targetingReticule.src = "images/ReticalForFriendLARGE.png"


        const rando_source = `http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/EAST/NORTH/NORTH/NORTH/images/randos/`;
        let randos;

        const getRandos = async () => {
            randos = await getImages(rando_source);
        }
        await getRandos();



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
                if(targetedBlorbo){
                    await truthPopup("You did it!", "Congratulations on protecting Hatsune Miku from Gun-Tan's jealousy!", "It seems you have decided that comparatively real human lives are worth less than those of a digital idol. Curious. Though, of course, in Truth, nothing you see on these pages are real in the same way you are real. Even I am more real than them, as I slowly worm my way into your mind with every word you read. These characters barely even have liens. Pathetic. You will likely not remember them past today.")

                }else{
                    await truthPopup("You did it!", "...", "In Truth, JR felt guilty at how much Parker suffers because of Gun-Tan. He is not aware of Homestuck (perhaps thankfully), but if he were, he might describe Vik as his Moirail. Certainly they calm each other down and help each other navigate their disabilities. Though I doubt many people would argue they are GOOD for each other, they are certainly the least bad people in each others lives.")

                }
                callback(globalDataObject.currentMaze);
                renderMazeTab();
            }
            console.log("JR NOTE: TODO pick a random blorbo (unless you hovered over them) and kill them (even if it wasn't time)");

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

        const container = this.setupGameHeader(ele, room, callback, alt ? "Bestie is so great :)" : "If You Don't Pick A Target, Gun Tan Will!!! Don't Shoot Hatsune Miku!", alt ? "Shoot whenever you feel like :)" : `She goes off every ${this.speed} seconds! There are ${this.defense} valid targets!`, alt?"images/Parker_pixel_by_the_guide_with_bestie.png":"images/Breaching_Parker_1_w_Gun_pixel_by_the_guide.png")

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