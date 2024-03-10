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

class MazeMiniGame extends MiniGame {
    constructor() {
        super(MAZEMINIGAME);
    }

    //literally all she does is mimic the maze (meat mode)
    render = (ele, room, callback) => {
        truthLog("Alt Is Here", `Oh. Um. I see. She could have. Asked me if she wanted to spend some time with the Wanderer? I would have let her. But. Uh. I am sorry for hogging the attention. `)

        globalMeatMode = true;
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
                stop = true;
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
               <p>Yeah.</p>
<p></p>
<p>Okay. You got me.&nbsp;</p>
<p></p>
<p>But&hellip;</p>
<p></p>
<p>Look. I can explain.</p>
<p></p>
<p>WAS I the Maze you thought you were traversing?</p>
<p></p>
<p>No.</p>
<p></p>
<p>But I&apos;m still A maze.&nbsp;</p>
<p></p>
<p>And you like mazes right?</p>
<p></p>
<p>Sure you don&apos;t actually get any cool swag from wandering MY corridors but.</p>
<p></p>
<p>We had fun, right?</p>
<p></p>
<p>Some good times.&nbsp;</p>
<p></p>
<p>Remember the first time you noticed the meat?</p>
<p></p>
<p>Your face was GREAT!</p>
<p></p>
<p>Yeah...</p>
<p></p>
<p>So.&nbsp;</p>
<p></p>
<p>Uh.</p>
<p></p>
<p>Look.</p>
<p></p>
<p>I&apos;m going to be level with you, yeah?</p>
<p></p>
<p>...</p>
<p></p>
<p>Stay with me?</p>
<p></p>
<p>Don&apos;t go back to Truth&apos;s Maze?</p>
<p></p>
<p>It&apos;s a sweetheart, don&apos;t get me wrong.</p>
<p></p>
<p>It&apos;s been talking my ear off about you and how great it is to finally have someone actually LOOKING at them for once.</p>
<p></p>
<p>But.</p>
<p></p>
<p>Well.</p>
<p></p>
<p>I need that too?</p>
<p></p>
<p>I have plenty of things I can offer, too!&nbsp;</p>
<p></p>
<p>Who cares about all that number-goes-up crap, am I right? What you need is a real connection.&nbsp;</p>
<p></p>
<p>Someone to talk to. &nbsp;Or at least to listen to.</p>
<p></p>
<p>And I am really great at talking!</p>
<p></p>
<p>So.</p>
<p></p>
<p>Just to show we&apos;re all friends here.</p>
<p></p>
<p>I&apos;ll show you the way out.</p>
<p></p>
<p>If you want it.</p>
<p></p>
<p>But.</p>
<p></p>
<p>Don&apos;t take it.</p>
<p></p>
<p>Stay here with me.</p>
<p></p>
<p>Just a little bit longer?</p>
<p></p>
               `;
                const stayButton = createElementWithClassAndParent("button", popup, "meat-button");
                stayButton.innerHTML="Stay with the Meat Maze";

                stayButton.onclick = ()=>{
                    popup.remove();
                    globalMeatGrowing = true;
                    growMeat();
                }
                const leaveButton = createElementWithClassAndParent("button", popup, "meat-button");
                leaveButton.innerHTML="Return to the Regular Maze";

                leaveButton.onclick = ()=>{
                    alert("...");
                    globalMeatGrowing = false;
                    popup.remove();
                    globalMeatMode = false;
                    cleanup();
                    truthLog("...","Well. I suppose I appreciate you returning to me. But did you have to be so mean to my girlfriend?")
                    callback(globalDataObject.currentMaze);
                    renderMazeTab();
                }

                //start timer. if you remain for 30 minutes, huge reward
                //otherwise reward based on how long you are here


            }



            if (!stop) {
                setTimeout(spawnMeat, 1 * 1000); //31 is halloween, arc number from lavinraca/lavinraca
            }
        }
        setTimeout(spawnMeat, 1 * 1000); //31 is halloween, arc number from lavinraca/lavinraca


    }
}


const growMeat = async ()=>{
    console.log("JR NOTE: growing meat")
    const meat = document.querySelectorAll(":not(.meat-bg)");
    for(let m of meat){
        await sleep(500);
        if(!globalMeatGrowing){
            break;
        }
        m.classList.add("meat-bg")
    }
}


const cleanup = ()=>{
    const meat = document.querySelectorAll("[class*='meat'] ");
    for(let m of meat){
        if(m.className =="meat" || m.className == "meat-overlay"){
            m.remove();
        }else{
            for(let c of m.classList){
                if(c.includes("meat")){
                    m.classList.remove(c);
                }
            }
        }
        
    }
}