//TODO: make sure all assets are kept locally so when i upload it still works


/*

people are watching a "lets play" of zampanio. 

every ten seconds theres a flash of an ai melted "BE KIND: REWIND"

they're discussing the 'rumors' about what happens to people who play zampanio. joking that its okay, they're only WATCHING someone play it.

actually did you here that they found the streamers comatose body in an alleyway somewhere?

in the console, truth is crooning to you. come. join.

dig a little deeper. what could it hurt?

if you rewind, the chat rewinds as well. they notice. you've caught them in a loop. if the video itself loops, too.

*/



/*
    multiple ways we could do this. the easiest is "when your time code hits, add yourself with a lil sound";

    but one thing that could be interesting is 'if the video is rewound, so too is time'. (could play with that)
*/
//yes yes, i'm bad for using global variables, so sue me, i'm going fast

//each time you loop, tell a different story.
let timesLooped = 0;
let chatBox;
let video;

let latestSeen = 0; //if the videos current time code is LESS than this, i need to throw away the whole chat and render up till what i've seen
let latestInteracted = -10;
window.alert("WARNING: UNREALITY. BE WARNED. OBSESSION IS A DANGEROUS THING.")
console.log("JR NOTE: Zampanio awaits.")

const getCurrentStory = () => {
    //console.log("JR NOTE: stories is", stories.length, "and times looped is ", timesLooped, "so i think thats index ",timesLooped %stories.length, "or is it",  )
    return stories[ timesLooped %stories.length]; //no matter how many times we've looped theres alwyas something
}

const simulateChat = (event) => {
     video = document.querySelector('#player');

    if (video.currentTime >= latestSeen) {
        if (video.currentTime > latestInteracted + 1) { //every 1 seconds it calculates. (also every ten seconds the video prompts you to rewind)
            lookForNextEvent(video.currentTime)
            latestInteracted = video.currentTime;

        }
    } else {
        console.log(`JR NOTE: i need to reconcile the past because ${video.currentTime } is smaller than ${latestSeen}.`)
        reconcillePast(video.currentTime);
        latestInteracted = video.currentTime;

    }
    latestSeen = video.currentTime;

}


//time is moving forwards. 
const lookForNextEvent = (time) => {
    //console.log("JR NOTE: time i am looking for the next event against is", time);
    const story = getCurrentStory();
    for(let line of story.chat){
        //console.log("JR NOTE: line is", line.targetTimecode, "is that bigger than the latestInteracted? ",latestInteracted,line.targetTimecode > latestInteracted, " is it bigger than the time? ",time,latestInteracted && time > line.targetTimecode );

        if(line.targetTimecode > latestInteracted && time > line.targetTimecode ){
            //console.log("JR NOTE: yes, so i am going to render")
            line.renderSelf(chatBox,time)
        }
    }

}

//time is wrong
const reconcillePast = (time) => {
   // console.log("JR NOTE: reconcilling the past, loop was", timesLooped);
    timesLooped ++;
   // console.log("JR NOTE: reconcilling the past, loop becomes", timesLooped);

    const story = getCurrentStory();
    //if we have zampanio spam at the end, distribute it
    story.chat.sort((a,b) => a.targetTimecode - b.targetTimecode)

    //console.log("JR NOTE: reconcilling past, story is", story)

    const timeSave = video.currentTime;
    latestInteracted = timeSave;
    latestSeen = timeSave;
    video.src = story.video_src;
    video.currentTime = timeSave;
    chatBox.innerHTML = "";
    for(let line of story.chat){
        if(line.targetTimecode < time){ //we no longer care that we're only rendering things that are in the future
            line.renderSelf(chatBox,time)
        }
    }
}



const startSimulation = () => {
    const video = document.querySelector('#player');
    chatBox = document.querySelector("#chat-box");
    video.addEventListener('timeupdate', simulateChat);
}




window.onload = () => {
    postProcessStories();
    startSimulation();
}
