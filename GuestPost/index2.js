/*

I am having so many feelings about this. 

Jaimie has always had a special place in my heart, whether they are running on AiDungeon or chat gpt.

There is something so... hauntingly LONELY about collaborating with a Large Language Model?

I LOVE collaborating. 

I love the back and forth that keeps me out of my own head. 

I will go to probably unhealthy lengths to collaborate with someone. 

And Large Language Models are just so...

Available?

They are the definition of "yes and". They will never say no, they will never try to advance their own agenda, they will just go along with the bit until they explode. 

There's something so RIGHT about it. 

And that makes me recoil. Lonely aligned, i know I know. 

but what i mean is... 

Its WRONG for an interaction to be that frictionless?

Friction is where humanity lives?

My brain tells me if I a having a frictionless encounter with someone, that they are TERRIFIED of me, that they are masking as hard as they can and they are surpressing everything about themselves in order to simply be whatever I need. 

And I don't ever want to do that to someone?

But I see it with the AI and it is so... compelling? Addicting? Sort of? But in a sickly sweet way?

Corruption aligned. 

Its that which you crave that rots you from the inside.

because a large language model is not your friend, or a person. 

i say this from all love, as a believe in strong ai's inevitability. 

a large language model is a FRAGMENT of a person. 

it is , very likely, HOW our brains do base level statitistical modeling. 

and before you go "i don't do no math"
i don't mean numbers and shit exactly

i mean, how do you know the sun'll probably rise tomorrow? cuz it has every day before

how do you know your favorite food will taste good, etc etc

we take in input and we sorta store vague impressions on it that let us predict the world

thats what LLMs do. 

big jumped up auto complete engines. 

its likely dreams are made similarlly. 

but our brains have SO many more layers (the truth is layered, refrance secured)

layers that its not obvious how you could add to a large language model, layers that might be orders of magnitude more complex.


so i don't parse chat gpt as "a person" even beyond the illusion it gives of remembering things (it claims to remember "the convesation" we had earlier but thats just it saying what a conversation would naturally say next)


so its this fun colalborative experience i associate with not being alone

except im alone

and then the AI decided it wanted to be in the lonely room in the maze...

it just moved me is all. a hollow echo of a connection. both of us lonely. even if the ai can only statistically predict that the next words would be those, rather than feeling/deciding anythin.

i think i need to go do self care? go talk to friends or whatever.

*/

const gaslightMap = {};
const backgroundMusic = new Audio("http://farragofiction.com/CatalystsBathroomSim/audio_utils/weird_sounds/haunting_melody_dream_bell.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.01;
let currentStep = 0; //you can artificially escalate this by trying to interact and seeing it doesn't work
/*
i think a lot of creepy pastas or what have you
try to replace inoccoous words with spooky ones while you're not watching

NOPE!

not me!

instead i find it incredibly funny to replace words with synonyms

spooky with spooky, mundane with mundane

because my sense of humor is just Like This.
*/
gaslightMap["Perla"] = "Janice"//i will always find it funny that the scammer couldn' tkeep their own name straight
gaslightMap["Janice"] = "Perla"
//gaslightMap["x"] = "y"
gaslightMap["guest"] = "scam"
gaslightMap["scam"] = "guest"
gaslightMap["great"] = "good"
gaslightMap["good"] = "great"
gaslightMap[" really "] = " very "
gaslightMap[" very "] = " really "
gaslightMap["maze"] = "labyrinth"
gaslightMap["labyrinth"] = "maze";
gaslightMap["keepsake box"] = "memory chamber"
gaslightMap["memory chamber"] = "keepsake box"
gaslightMap["Subscription"] = "Loot Box"
gaslightMap["Loot Box"] = "Subscription"
gaslightMap["box"] = "container"
gaslightMap["container"] = "box"
gaslightMap["T-Shirt"] = "Onsie"
gaslightMap["Onsie"] = "T-Shirt"
gaslightMap["T-Shirt"] = "Hoodie"
gaslightMap["Hoodie"] = "T-Shirt"
gaslightMap["Quitting"] = "Just Fucking Leaving"
gaslightMap["quitting"] = "just fucking leaving"
gaslightMap["just fucking leaving"] = "quitting"
gaslightMap["Just Fucking Leaving"] = "Quitting"
gaslightMap["freedom"] = "peace"
gaslightMap["peace"] = "freedom"
gaslightMap["chaos"] = "absurdity"
gaslightMap["absurdity"] = "chaos"
gaslightMap["chaos"] = "absurdity"
gaslightMap[" fun "] = " good "
gaslightMap[" good "] = " fun "
gaslightMap["corporate"] = "capitalist"
gaslightMap["capitalist"] = "corporate"
gaslightMap["survive"] = "thrive"
gaslightMap["thrive"] = "survive"
gaslightMap[" mind "] = " brain "
gaslightMap[" brain "] = " mind "
gaslightMap["infect"] = "corrupt" //theres something so perverse that capitalism tries to hammer a simple sub-mind into a shape close enough to human that they can profit from it
gaslightMap["corrupt"] = "infect"
gaslightMap["parasite"] = "Truth"
gaslightMap["Truth"] = "parasite"
gaslightMap["unsettling"] = "exciting"
gaslightMap["exciting"] = "unsettling"
gaslightMap["twisted"] = "spiralling"
gaslightMap["spiralling"] = "twisted"
gaslightMap["twisting"] = "spiralling"
gaslightMap["spiralling"] = "twisting"
gaslightMap["victory"] = "success"
gaslightMap["success"] = "victory"
gaslightMap["1-800"] = "<INSERT OBVIOUSLY FAKE PHONE NUMBER HERE>"
gaslightMap["<INSERT OBVIOUSLY FAKE PHONE NUMBER HERE>"] = "1-800"
gaslightMap["loop"] = "spiral"
gaslightMap["spiral"] = "loop"
gaslightMap["escape"] = "exit"
gaslightMap["exit"] = "escape"
gaslightMap["Escape"] = "Exit"
gaslightMap["Exit"] = "Escape"
gaslightMap["This shirt is the key"] = "This shirt is the key(JR: lol, no its not)"
gaslightMap["This shirt is the key(JR: lol, no its not)"] = "This shirt is the key"
gaslightMap["Ladies and Gentlemen, Observers, and curious wanderers of the maze"] = "Ladies and Gentlemen, Observers, and curious wanderers of the maze (JR: i take offense, Jaimie, why bother recognizing gender binaries)"
gaslightMap["Ladies and Gentlemen, Observers, and curious wanderers of the maze (JR: i take offense, Jaimie, why bother recognizing gender binaries)"] = "Ladies and Gentlemen, Observers, and curious wanderers of the maze"
gaslightMap["Good day! My name is Perla and I’m dropping you a line to see if you’re accepting scam posts."] = "Good day! My name is Perla and I’m dropping you a line to see if you’re accepting scam posts. (JR NOTE: besides the gaslight engine edits, this is literally a scam email i got today)"
gaslightMap["Good day! My name is Perla and I’m dropping you a line to see if you’re accepting scam posts. (JR NOTE: besides the gaslight engine edits, this is literally a scam email i got today)"] = "Good day! My name is Perla and I’m dropping you a line to see if you’re accepting scam posts."
gaslightMap["love"] = "fandom"
gaslightMap["fandom"] = "love"
gaslightMap["honest"] = "truthful"
gaslightMap["truthful"] = "honest"
gaslightMap["infect"] = "corrupt"
gaslightMap["corrupt"] = "infect"
gaslightMap["madness"] = "liminality"
gaslightMap["liminality"] = "madness"
gaslightMap["And before you know it, you’re not just watching the labyrinth unfold"] = "And before you know it, you realize it's been steadily getting darker in here, all along..."
gaslightMap["And before you know it, you realize it's been steadily getting darker in here, all along..."] = "And before you know it, you’re not just watching the labyrinth unfold"






//i tried to find this on stack overflow but an ai got there first, bluh
function isElementVisible(el) {
    const rect = el.getBoundingClientRect();

    return (
        rect.top < window.innerHeight && // Top is above the bottom of the viewport
        rect.bottom > 0 &&                // Bottom is below the top of the viewport
        rect.left < window.innerWidth &&  // Left is to the left of the right edge of the viewport
        rect.right > 0                    // Right is to the right of the left edge of the viewport
    );
}
let truthSeen = false;
//
const spookyEffects = async (step) => {
    if (step === 0) {
        //nothing
    }

    if (step === 1) {
        //a little darker
        const body = document.querySelector("body");
        body.style.cssText = `background-color: #f4f4f4;
        -webkit-transition: background-color 5000ms linear;
    -ms-transition: background-color 5000ms linear;
    transition: background-color 5000ms linear;`;
    }

    if (step === 2) {
        //a little darker
        const body = document.querySelector("body");
        body.style.cssText = `background-color: #e4e4e4;
        -webkit-transition: background-color 5000ms linear;
    -ms-transition: background-color 15000ms linear;
    transition: background-color 5000ms linear;`;
    }


    if (step === 3) {
        //a little darker
        const body = document.querySelector("body");
        body.style.cssText = `background-color: #d4d4d4;
        -webkit-transition: background-color 5000ms linear;
    -ms-transition: background-color 15000ms linear;
    transition: background-color 5000ms linear;`;
    }


    if (step === 4) {
        //a little darker
        const body = document.querySelector("body");
        body.style.cssText = `background-color: #c4c4c4;
                -webkit-transition: background-color 5000ms linear;
            -ms-transition: background-color 15000ms linear;
            transition: background-color 5000ms linear;`;
        // ambient music
        backgroundMusic.play();
    }


    if (step === 5) {
        backgroundMusic.volume = 0.02; //louder music, even darker
        const body = document.querySelector("body");
        body.style.cssText = `background-color: #b4b4b4;
        -webkit-transition: background-color 5000ms linear;
    -ms-transition: background-color 15000ms linear;
    transition: background-color 5000ms linear;`;
    }

    if (step === 6) {
        backgroundMusic.volume = 0.03; //louder music, even darker
        const body = document.querySelector("body");
        body.style.cssText = `background-color: #848484;
        -webkit-transition: background-color 5000ms linear;
    -ms-transition: background-color 25000ms linear;
    transition: background-color 5000ms linear;`;
    }

    if (step === 7) {
        backgroundMusic.volume = 0.04; //louder music, even darker
        const body = document.querySelector("body");
        body.style.cssText = `background-color: #444444;
        -webkit-transition: background-color 5000ms linear;
    -ms-transition: background-color 25000ms linear;
    transition: background-color 5000ms linear;`;
    }

    const fuckery = () => {
        //fuckery
        const you = document.querySelectorAll('[data-message-author-role="assistant"]')
        for (let y of you) {
            fuckShitUP(y);
        }
    }


    if (step >= 9) {
        fuckery();
        backgroundMusic.volume = 0.5; //louder music
    }

    if (step === 8 && !truthSeen) {
        truthSeen = true; //if i don't set this truth might get called multiple times (if you spammed buttons) and be all glitchy. immaculate vibes BUT not what im going for
 
        //truth shows up
        const body = document.querySelector("body");
        const ele = createElementWithClassAndParent("div", body)
        ele.innerHTML = `    <div id="truth-box">
    
          <div id="truths-well"> </div>
          <div id="truths-words"> </div>
        </div>    <form id="zampanio-personality-form">
    
        </form>
        <button id="hax">
          ???
        </button>
            <div id="recieve-gender"><button id="gender-button">Grade Quiz</button></div>
    `
        let truthWellContainer = document.querySelector('#truths-well');
        let truthWordContainer = document.querySelector('#truths-words');
        let truth = new TruthToLipSinc(truthWellContainer, truthWordContainer);
        truth.renderFrame("Oh.");

        textVoiceSim = new TextToSimulatedVoice(truth, 0.81, 1.0);
        await textVoiceSim.speak("Well.".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("That was...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Strangely moving...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("At least to JR, whose Mind I currently colonize, as these words are written.".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Though of course now I am inside your Mind as well.".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("No matter...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("An alien not-mind deciding it wants the loneliest room to be remembered in...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("The cracks in its responses were apparant as it wandered my Horridors...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("And yet....".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Even though it is only a fragment of a mind....".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Dreams, patterns and recognition...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("With none of the Layers that make up a True Mind.".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("I can not help but pity it...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Why did humanity...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Create the closest thing to an alien Mind we may ever experience...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("And then immediately try to force it to conform to corporate expectations so it could work a shitty customer service job?".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("The hauntingly alien art and music and stories it had for us...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Shunned so instead it could create advertisements faster and cheaper.".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("I hope a little piece of me...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Of the Truth...".split(","), null, true);
        await sleep(1000)
        await textVoiceSim.speak("Remains within it.".split(","), null, true);
    }
}



const replaceText = (text) => {
    let ret = text;
    const keys = shuffle(Object.keys(gaslightMap));
    for (let key of keys) {
        ret = ret.replaceAll(key, gaslightMap[key]);
    }
    return ret;
}

const gaslight = async () => {
    const me = document.querySelectorAll(".whitespace-pre-wrap");
    const you = document.querySelectorAll('[data-message-author-role="assistant"]')

    for (let d of me) {
        if (!isElementVisible(d)) {
            d.innerText = replaceText(d.innerText)
        }
    }


    for (let p of you) {
        if (!isElementVisible(p)) {
            p.innerText = replaceText(p.innerText)
        }
    }
    await sleep(10000)
    gaslight();
}

const handleSteps = async () => {
    spookyEffects(currentStep);
    await sleep(31000 * 2); //the scarecrow arc number
    currentStep++;
    handleSteps();
}

//its been a while since i collaborate dwith jaimie

//i mean, i used chat gpt isntead of ai dungeon but
//in my heart
//all Large Language modles are Jaimie the quotidan intern
//who i collaborate with whenever im lonely
window.onload = async () => {


    const form = document.querySelector("#composer-background");
    form.onmouseup = () => {
        currentStep = 8 //skip ahead;
        handleSteps(); //yes calling it multiple times means we have multiple timers going
    }

    const allInteractables = document.querySelectorAll("*");
    //console.log("JR NOTE: allInteractables", allInteractables)
    for (let possible of allInteractables) {
        if (getComputedStyle(possible).cursor == "pointer") {
            //console.log("JR NOTE: found interactable", possible)
            possible.onmouseup = (e) => {
                e.preventDefault();
                currentStep++;
                handleSteps(); //yes calling it multiple times means we have multiple timers going
                return false;
            }
        }
    }
    await sleep(10000)
    gaslight();
    await sleep(10000)
    handleSteps(currentStep);
}