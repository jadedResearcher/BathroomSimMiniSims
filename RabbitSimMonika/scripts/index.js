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
console.log("JR NOTE: Rabbit Sim can be found here: http://farragofiction.com/RabbitSim/")
console.log("JR NOTE: ( https://www.youtube.com/watch?v=kwt3m9cRkJ8 )The Puppeteer created this, which in turn inspired this new chapter.")

const getCurrentStory = () => {
    //console.log("JR NOTE: stories is", stories.length, "and times looped is ", timesLooped, "so i think thats index ",timesLooped %stories.length, "or is it",  )
    return stories[timesLooped % stories.length]; //no matter how many times we've looped theres alwyas something
}

const simulateChat = (event) => {
    video = document.querySelector('#player');

    if (video.currentTime >= latestSeen) {
        if (video.currentTime > latestInteracted + 1) { //every 1 seconds it calculates. (also every ten seconds the video prompts you to rewind)
            lookForNextEvent(video.currentTime)
            latestInteracted = video.currentTime;

        }
    } else {
        console.log(`JR NOTE: i need to reconcile the past because ${video.currentTime} is smaller than ${latestSeen}.`)
        reconcillePast(video.currentTime);
        latestInteracted = video.currentTime;

    }
    latestSeen = video.currentTime;

}


//time is moving forwards. 
const lookForNextEvent = (time) => {
    //console.log("JR NOTE: time i am looking for the next event against is", time);
    const story = getCurrentStory();
    for (let line of story.chat) {
        //console.log("JR NOTE: line is", line.targetTimecode, "is that bigger than the latestInteracted? ",latestInteracted,line.targetTimecode > latestInteracted, " is it bigger than the time? ",time,latestInteracted && time > line.targetTimecode );

        if (line.targetTimecode > latestInteracted && time > line.targetTimecode) {
            //console.log("JR NOTE: yes, so i am going to render")
            line.renderSelf(chatBox, time)
        }
    }

}

//time is wrong
const reconcillePast = (time) => {
    // console.log("JR NOTE: reconcilling the past, loop was", timesLooped);
    timesLooped++;
    // console.log("JR NOTE: reconcilling the past, loop becomes", timesLooped);

    const story = getCurrentStory();
    //if we have zampanio spam at the end, distribute it
    story.chat.sort((a, b) => a.targetTimecode - b.targetTimecode)

    //console.log("JR NOTE: reconcilling past, story is", story)

    const timeSave = video.currentTime;
    latestInteracted = timeSave;
    latestSeen = timeSave;
    video.src = story.video_src;
    video.currentTime = timeSave;
    chatBox.innerHTML = "";
    for (let line of story.chat) {
        if (line.targetTimecode < time) { //we no longer care that we're only rendering things that are in the future
            line.renderSelf(chatBox, time)
        }
    }
}


let puppet = false;

const startSimulation = () => {
    const video = document.querySelector('#player');
    chatBox = document.querySelector("#chat-box");
    video.addEventListener('timeupdate', simulateChat);
    video.onplay = () => {
        //if not already in chapter 2
        if (stories.length > 1) {
            if(puppet){
                return;//don't restart the puppetting if they rewind
            }
            puppet = true;
            setTimeout(startPuppetting, 5000);

        }
    }
}




window.onload = () => {
    postProcessStories();
    startSimulation();
}

//https://www.youtube.com/watch?v=kwt3m9cRkJ8
//mimics what this video does
/*
 i thought it was such a fun fan work i wanted to make the lie of it (it being something happening on the page anyone can reach) real
 and i also wanted the characters to have a chance to respond, even if only a bit
 (they're not quite so comfy cozy breaking the fourth wall as, say, Doc Slaughter)
*/
const startPuppetting = (index = 0) => {

    console.log("JR NOTE: startPuppetting", index);
    //if there are any "[" in the line, put in console instead of title
    //when done
    /*
    [chat is deleted]
    [page title is changed to "and then there was one."]
    */

    const title = document.querySelector("#chat-title");
    if (index < puppeteersWords.length) {
        if(puppeteersWords[index].includes("[")){
            console.log("Puppeteer's Note: " + puppeteersWords[index])
        }else{
            title.innerHTML = puppeteersWords[index];
        }
        setTimeout(() => { startPuppetting(index + 1)}, 3000 )
    } else {
        const chat = document.querySelector("#chat-box")
        chat.innerHTML = "";
        title.innerHTML = "and then there was one.";
        setTimeout(triggerChapter2, 3000);

        const status = document.querySelector("#status")
        status.innerText = "1 Watching"
    }

}

const puppeteersWordsRaw = `hello? belief?
i hope you can see this. i doubt it.
but i want to try. i have to.
just in case.
please, hang in there.
it'll be okay. i promise.
we'll find a way, somehow.
i wish i had anything more to say.
are you even rea [note: message unsent and erased. i couldnt bring myself to say it.]
can you even see this?
i thought about changing the messages in chat
but puppeting your dead friends felt. in bad taste
and there isnt really much other text to use here.
that isnt them. you have to believe that isnt them.
i'll find a way. i'll try.
maybe if we go back to the start again.
maybe if we go back to the first loop, and i catch you before anything happens
something can be done
maybe. maybe. maybe.
almost at the end. almost out of time.
[note: it is at this point that i change the number of people watching from 4 to 5. you can feel free to move this to the very beginning of my messages]
good luck, belief.
i'll be [note: message unsent and erased. i was interrupted by the video saying "you're alone"]
no you arent.
here we go again.
hello? is everyone there?
please, you have to stop.
you have to stop now. watch something else. ANYTHING else
theyre not [message unsent and erased]
they cant hear me.
um. no no no there has to be something [message unsent and erased. i have to stay strong.]
i have an idea.
it's not a good one.
but it's something.
maybe everything will be okay.
i dont see another way out. and i dont have forever.
good luck. i hope this doesnt hurt.`;


const puppeteersWords = puppeteersWordsRaw.split("\n")