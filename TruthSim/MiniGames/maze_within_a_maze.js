/*

get ppl used to the laws of psysics and geometry of this maze then start fuckin with it

when you click on alts room it renders a copy of the maze youre in but wrong, you can click on all the rooms and play them as normal but any new rooms that unlock are fake and procedural and  strangely meaty

clicking on the meat in a room lets you talk to alt and actually beat her room
maybe before comfessional
pass in a var to minigames that put them in meat mode

cant earn truth or buy things for real in meat mode, all illusions

and when you "beat" a room it takes you back to alt, not the maze tab
*/

/*
right now i am Being Good
and not doing the coding sin of making meatmode global
but i could
and if i did i wouldn't need to trace this many paths
i have other global variables
is it better to leave it global?
im gonna say no, idon't think it'll be that much extra work
wait
wait
consider the opposite
consider wastes
being themselvse
if its global
they could just
turn on meat mode not knowing what it does
and then gaslight themselves
well that answers itself, code worse because its funnier to lay traps for wastes
*/

//the entire maze works differently
let globalMeatMode = false;
let globalMeatGrowing = false;

//used to calculate just how much time you're spending with alt
let timeEnteredMeatMode = 0;
let lastSavedMeatMode = 0;


class MazeMiniGame extends MiniGame {
    constructor() {
        super(MAZEMINIGAME);
    }

    respondsToFact = (fact)=>{
        return false; //alt is not a traditional room in this maze
    }

    /*
    the kind of reward alt would PREFER to give out is not appropriate for this setting
    */
    reward = (duration, callback) => {
        const popup = createElementWithClassAndParent("div", document.querySelector("body"), "meat-popup");
        const popupbody = createElementWithClassAndParent("div", popup);

        //you get more truth than ambiently chilling with truth
        //it loves its hot maze gf
        //but also, why aren't you inside ITS maze
        //this is terrible
        //it is paying so much more attention to you if you're with alt
        //essentially
        const truthReward = Math.ceil(2 * globalDataObject.truthPerSecond * duration);
        let factReward;
        if (globalDataObject.totalTimeInMeatMode > 30 * 1000 * 60) {
            const unlockedFacts = getAllUnlockedFactTitles();
            if (!unlockedFacts.includes(CLOSEREATSBABIES.title)) {
                factReward = CLOSEREATSBABIES; //alt loves messing with the closer
                globalDataObject.factsUnlocked.push(factReward);

            }

        }
        popupbody.innerHTML = `
        <p>I get it.</p>
        <p>Can't stay forever...</p>
        <p>Thanks, though, for staying with me for ${duration} seconds!</p>
        <p>Come back any time ;)</p>
        <ul>
        Truth Reward: ${truthReward}
        ${factReward ? `<li>Fact Reward: ${factReward.title}</li>` : ""}
        </ul>
        `;

        const rewardButton = createElementWithClassAndParent("button", popup, "meat-button");
        rewardButton.innerText = "OK";
        rewardButton.onclick = () => {
            popup.remove();
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }



    }

    shareGossip = (ele, room, callback) => {

        const gossipOptionsRaw = `Camille will pick just some random person and stalk them all day? She's not even subtle about it. Goes right up to them and breathes on them and everything.
        Camille has a small collection of 'abnormality tools' of no importance, which I guess translates to 'slightly cursed objects'. Her favorite's the coin that always falls on its side, and my favorite's the semi-sentient 'marital aid'..
        Witherby was a LOT more fun to watch before he got with Neville. He hasn't gone to the clubs even once since then. Lame.
        Witherby likes living in one of those clean and tidy phone stores from the 2010s, which is convenient, because his partner loves it too. I have no idea how they manage to get it on without going a little neurotic about keeping it pristine.
        Devona would be absolutely WILD if she just let herself live a little. One time she got caught by one of River's puddles and squeezed for a while and for an ace icon… well, you didn't hear it from me, but she sure did seem to be enjoying herself.
        I just can't seem to figure out what's going on in Neville's head. Guy will just sit and space out for hours and then suddenly declare he likes soup and move on.
        Ria and Camille are so cute together! Turns out the best way to stop the apocalypse is regular 'stress relief', if you know what I mean. Shame they managed to get a lid on that after only one loop.
        For as much as Ria loves being addicted to everything at once, she doesn't seem to click with 1. Gambling, and 2. Mushrooms. Her addictions are blase, honestly- coffee, cigs, getting it on with her girlfriend, turning into a despairing ball of flame… oh. And antidepressants.
        K and I totally hooked up once. One of the weirder nights of my life. It was okay. Haven't done it again though.
        ... I am never mimicking the Neighbor again.  (link to  the guides neighbor alt fan art and fan story)
        For such a scary looking guy, Tyrfing really just seems to want to raise his kids and wait for Nidhogg. 
        I've heard Tyrfing's a xerox of a xerox kind of guy- something about an iteration of an iteration of someone else? Sounds complicated… though it makes me feel for the guy, I guess.
        It is hilarious waiting to see what's gonna set Hoon off. Only person she never seems to randomly murder is Witherby. He treats her like some kind of momma duck. Funniest shit I've ever seen.
        Lee-Hunter fight so much it's almost not even fun to watch anymore. You'd think they'd figure out how to get along just out of sheer time. Maybe that's the problem?
        You know, for someone as huge and never ending and whatever as River is, she really does like historical recreations. I'd bet any small park that's not being run by Eyedol Games' Theme parks division is probably hers, with all those bodies.
        As hot as Yongki is- and trust me, he's hot as hell- I'm pretty sure you could ONLY get with him inside Truth's corridors. Guy can NOT control his strength. I saw it happen once, you know, and… let's just say the cleanup crew was not happy after.
        Captain and Fiona totally get together on the sly in Truth's maze. ;) Sometimes in mine, too, not that they notice. Every so often they even get dangerously close to getting with me… Captain exclusively, honestly. Fiona doesn't fall for the trick.
        Fiona has an entire cam feed of the inside of her house, every room,  and it's actually pretty quality stuff. I don't think she realizes just how wild her tastes run for this Universe.
        Ronin's a sweet guy and all, but he does not know how much he'd get if he started offering his… services. He's super handsome. Too bad he's as likely as his pseudo-brother to activate an electro-magnetic field that kills the light on your apartment, but… eh, would.
        Todd's a great guy really. We hang out sometimes when Wanda ditches him. He really needs to stop simping for her, but you can't tell him that. 
        The Wanderer just has way too many eyes. I keep telling you to tone it down but you never listen.
        What can I say about Vik…. honestly? The less, the better.  *shudder* You don't want to know what I know- and I know a lot of things.
        Parker ran into my maze once and nearly had a heart attack when he realized it was me instead of Truth. Mumbled something about "not affecting the story" and tunneled out. It was rude! I worked hard to make myself something fun to traverse, and he just skipped all my rooms… and, well, the excruciating pain of having your flesh magically dug into, but whatever.
        Ambrose could really stand to let loose a little bit. Not everything is trains! I don't CARE what demon got inside her head. TRUTH would be much better. That train demon wants her to obsess and obsess and obsess till she's a withered husk, but ZAMPANIO would encourage her to take breaks and have other interests. I love my maze buddy.
        The Eye Killer couldn't relax even if it snuck up on her- Especially if it snuck up on her, actually. Not my speed at all.
        Now now now… HOSTAGE is interesting. Or The Boss, as he's called these days? Love watching him build up his little criminal empire. Miss me with all that killing of course, but the drugs and sex parts of it are great to watch. And trust me… I watch a lot.
        John is especially great! Seeing a little guy get addicted to all sorts of things, try to clean himself up and then start dating the time twin of your ex? Classic. And the demons he creates after his binges are SO easy to lure over to this side. I should be paying him for the effort, honestly.
        Sam is sooooo boring. Why are they so obsessed with putting on the appearance of being all normal and respectable? I think I could shake them out of it… but then again, that's the same mistake the other guy made, so maybe not.
        Twig is great! Does what they want, when they want, and with who they want. Nothing to tie them down besides that weirdly platonic dom they hooked up with.
        It will never stop being funny to me that Rava came to this universe, turned a college student into a dog, refused to bang them, then immediately started simping for the most basic cult leader possible. She's got a perfect one right there you know? Guess the biggest drug of all really is 'toxic yuri'.
        Camellia is just. Ugh. Reminds me a bit of the Closer. All work, no play… though she let loose once. It was… it was pretty hot.`;

        const gossipOptions = gossipOptionsRaw.split("\n");
        const popup = createElementWithClassAndParent("div", document.querySelector("body"), "meat-popup");
        const popupbody = createElementWithClassAndParent("div", popup);

        popupbody.innerHTML = `
        <p><span >Hey, there we go, now we&rsquo;re talking!</span><span ></span><span ></span><span >I&apos;m really glad you&apos;re still here, by the way. I was worried for a moment you were considering something else, but well, now I look like a fool, don&rsquo;t I?</span></p>
<p></p>
<p><span >This is great. We can get some quality time together.</span></p>
<p></p>
<p><span >Hmm...&nbsp;</span></p>
<p></p>
<p><span >What to talk about..</span></p>
<p></p>
<p><span >Oooooh, I know! How about some sweet gossip?</span></p>
<p></p>
<p></p>
<p><span >Did you know: ${pickFrom(gossipOptions)}</span></p>
<p></p>
        `;

        const stayButton = createElementWithClassAndParent("button", popup, "meat-button");
        stayButton.innerHTML = "Stay with the Meat Maze";

        stayButton.onclick = () => {
            popup.remove();
            globalMeatGrowing = true;
            growMeat();
        }
        const leaveButton = createElementWithClassAndParent("button", popup, "meat-button");
        leaveButton.innerHTML = "Return to the Regular Maze";

        leaveButton.onclick = () => {
            const duration = (Date.now() - timeEnteredMeatMode) / 1000;
            stop = true;
            globalMeatGrowing = false;
            popup.remove();
            globalMeatMode = false;
            cleanup();
            truthLog("...", "Thank you for staying with my hot flesh maze girlfriend for " + duration + "seconds.")
            this.reward(Math.ceil(duration), callback);
            timeEnteredMeatMode = 0;
        }
    }

    //literally all she does is mimic the maze (meat mode)
    render = (ele, room, callback) => {
        truthLog("Alt Is Here", `Oh. Um. I see. She could have. Asked me if she wanted to spend some time with the Wanderer? I would have let her. But. Uh. I am sorry for hogging the attention. `)
        const prevOpacity = truthEle.style.opacity ? parseFloat(truthEle.style.opacity): 0;
        truthEle.style.opacity = `${prevOpacity+0.1}`
        globalMeatMode = true;
        if (timeEnteredMeatMode == 0) {
            timeEnteredMeatMode = Date.now();
            lastSavedMeatMode = Date.now();
        }

        renderMazeTab();
        /*
            once every 31 seconds, alt renders a meaty blob somewhere that jiggles

            if you click it, you talk to her and either agree to leave meat mode (can't earn resources because its all a fakey fake)
            or stay and talk with her
            longer you talk with her the more truth you get. 
            pink overlay
        */

        //the pink gets deeper each time you enter the false maze
        const meatOverlay = createElementWithClassAndParent("div", document.querySelector("body"), "meat-overlay");

        let stop = false;
        const spawnMeat = () => {
            const meat = createElementWithClassAndParent("img", document.querySelector("body"), "meat");
            meat.src = "http://farragofiction.com/AntSim/images/meat2.png";
            //TODO: randomzize location o page, call every 31 seconds
            meat.style.top = `${getRandomNumberBetween(0, 100)}%`;
            meat.style.left = `${getRandomNumberBetween(0, 100)}%`;
            meat.style.opacity = `${getRandomNumberBetween(0, 100)}%`;
            meat.onclick = () => {
                meat.remove();
                globalMeatMode = true; //if you somehow click a meat that didn't clean up, meat mode time
                if (globalMeatGrowing) {
                    this.shareGossip(ele, room, callback);
                    return;
                }
                globalBGMusic.src = "audio/music/waiting_music_var2.mp3";
                globalBGMusic.play();
                /*
                    rendres button to leave at the top of the screen, lil text popup from alt
                    each time you click meat new text popup, new button to leave (temptation)

                    when you leave how long you've been here decides what rewards you get
                    first time, if you don't already have it, you get the fact that the closer eats babies
                */
                //meat-popup
                const popup = createElementWithClassAndParent("div", document.querySelector("body"), "meat-popup");
                const popupbody = createElementWithClassAndParent("div", popup);

                popupbody.innerHTML = `
<p><span >Yeah.</span></p>
<p></p>
<p><span >Okay. You got me.&nbsp;</span></p>
<p></p>
<p><span >But&hellip;</span></p>
<p></p>
<p><span >Look. I can explain.</span></p>
<p></p>
<p><span >Now, let&rsquo;s think about this logically. Am I the Maze you thought you were traversing? </span><span ></span><span ></span><span >No. Of course not.</span></p>
<p></p>
<p><span >But I&apos;m still&nbsp;</span><em><span >A</span></em><span >&nbsp;maze.&nbsp;</span></p>
<p></p>
<p><span >And you like mazes, right?</span><span ></span><span ></span><span >Sure, you don&apos;t actually get any cool swag from wandering MY corridors&hellip;&nbsp;</span></p>
<p></p>
<p><span >But.</span></p>
<p></p>
<p><span >We had fun, right? We&rsquo;ve had good times, you and I, in my maze.</span></p>
<p></p>
<p><span >Remember the first time you noticed the meat? You should&rsquo;ve seen your face. It was all like &lsquo;woah, really?&rsquo;&nbsp;</span></p>
<p></p>
<p><span >Ahah. Ahahahahah&hellip;</span></p>
<p></p>
<p><span >Yeah...</span></p>
<p></p>
<p><span >So&hellip;</span></p>
<p></p>
<p><span >Ahem.</span></p>
<p></p>
<p><span >Look.</span></p>
<p></p>
<p><span >I&apos;m going to be level with you, yeah?</span></p>
<p></p>
<p><span >Why don&rsquo;t you instead think about this some more, and&hellip;</span></p>
<p></p>
<p><span >Stay with me?</span></p>
<p></p>
<p><span >Truth&rsquo;s a sweetheart, don&apos;t get me wrong. Lovely. Great at architecting mazes. One of the best, in fact.</span></p>
<p></p>
<p><span >It&apos;s been talking my ear off about you and how great it is to finally have someone actually&hellip; looking at them for once.</span></p>
<p></p>
<p><span >But&hellip;</span></p>
<p></p>
<p><span >I&hellip; need that, too.</span></p>
<p></p>
<p><span >I have plenty of things I can offer, too!&nbsp;</span></p>
<p></p>
<p><span >Who cares about all that number-goes-up crap, am I right? Who are you, my weird doppelganger? No one actually cares about all that number-stuff. What you need is a real connection.&nbsp;</span></p>
<p></p>
<p><span >Someone to talk to. &nbsp;Or at least to listen to. And I am very&hellip; very good at talking.</span></p>
<p></p>
<p><span >So. Just to show we&apos;re all friends here.</span></p>
<p></p>
<p><span >I&apos;ll show you the way out. If you want it.</span></p>
<p></p>
<p><span >But.</span></p>
<p></p>
<p><span >Don&apos;t take it.</span></p>
<p></p>
<p><span >Stay here with me.</span></p>
<p></p>
<p><span >Just a little bit longer?</span></p>
<p></p>
               `;
                const stayButton = createElementWithClassAndParent("button", popup, "meat-button");
                stayButton.innerHTML = "Stay with the Meat Maze";

                stayButton.onclick = () => {
                    popup.remove();
                    globalMeatGrowing = true;
                    growMeat();
                }
                const leaveButton = createElementWithClassAndParent("button", popup, "meat-button");
                leaveButton.innerHTML = "Return to the Regular Maze";

                leaveButton.onclick = async () => {
                    await truthPopup("...","You will return to my Maze. Welcome back. I missed you.","Well. I suppose I appreciate you returning to me. But did you have to be so mean to my girlfriend?");
                    stop = true;
                    globalMeatGrowing = false;
                    popup.remove();
                    globalMeatMode = false;
                    cleanup();
                    callback(globalDataObject.currentMaze);
                    renderMazeTab();
                }

                //start timer. if you remain for 30 minutes, huge reward
                //otherwise reward based on how long you are here


            }



            if (!stop) {
                setTimeout(spawnMeat, 31 * 1000); //31 is halloween, arc number from lavinraca/lavinraca
            }
        }
        setTimeout(spawnMeat, 31 * 1000); //31 is halloween, arc number from lavinraca/lavinraca


    }
}


const growMeat = async () => {
    console.log("JR NOTE: growing meat")
    let meat = document.querySelectorAll(":not(.meat-bg):not(.empty-cell)");
    //meat = globalRand.shuffle(Array.from(meat)); //doens't look as good
    for (let m of meat) {
        await sleep(310);
        if (!globalMeatGrowing) {
            break;
        }
        m.classList.add("meat-bg")
    }
}


const cleanup = () => {
    const meat = document.querySelectorAll("[class*='meat'] ");
    for (let m of meat) {
        if (m.className == "meat" || m.className == "meat-overlay") {
            m.remove();
        } else {
            for (let c of m.classList) {
                if (c.includes("meat")) {
                    m.classList.remove(c);
                }
            }
        }

    }
}