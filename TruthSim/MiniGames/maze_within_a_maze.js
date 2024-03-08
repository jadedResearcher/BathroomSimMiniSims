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

class MazeMiniGame extends MiniGame {
    constructor() {
        super(MAZEMINIGAME);
    }

    //literally all she does is mimic the maze (meat mode)
    render = (ele, room, callback) => {
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
        const spawnMeat = ()=>{
            const meat = createElementWithClassAndParent("img", document.querySelector("body"), "meat");
            meat.src = "http://farragofiction.com/AntSim/images/meat2.png";
            //TODO: randomzize location o page, call every 31 seconds
            meat.style.top = `${getRandomNumberBetween(0,100)}%`;
            meat.style.left = `${getRandomNumberBetween(0,100)}%`;
            meat.style.opacity = `${getRandomNumberBetween(0,100)}%`;
            meat.onclick = ()=>{
                stop = true;
                alert("TODO handle alt")
            }

            if(!stop){
                setTimeout(spawnMeat, 31*1000); //31 is halloween, arc number from lavinraca/lavinraca
            }
        }
        setTimeout(spawnMeat, 31*1000); //31 is halloween, arc number from lavinraca/lavinraca


    }
}