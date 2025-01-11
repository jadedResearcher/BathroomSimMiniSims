/*
a Scene is a parsed long string of the form
name1: text
name2: text
it figures out what names are involved in it
and given a list of entities will return true or false if all of the chars in it are in the list
it knows how to render itself (all at once with little audio sounds)
*/

const all_scenes = [];

class Scene {
  //just their names, not their objects
  entityNames = [];
  title = "???"
  //{name, text} pairs (NOTE: name can be blank)
  lines = [];

  constructor(title, entityNames, lines) {
    this.entityNames = entityNames;
    this.lines = lines;
    this.title = title;
    all_scenes.push(this);
  }

  /*
  render the scene line by line, with an animation prompt at the end to click for next line
  also find the entities (class name will be their name) in the document that map to whoever is currently speaking and give them a special class
  remove that class from everyone else
  */
  renderSelf = async (parent, player) => {
    //downplay any entities not in this scene
    //convertStringToClassFriendlyName
    for (let item of player.inventory) {
      if (!this.entityNames.includes(item.name)) {
        const ele = document.querySelector(`.${convertStringToClassFriendlyName(item.name)}`);
        ele.classList.add("inventory-item-unselected");
      }
    }

    const textElement = createElementWithClassAndParent("div", parent);
    const iconElement = createElementWithClassAndParent("div", parent, "click-pulse");

    //display title
    textElement.innerHTML = `<u>${this.title}${player.scenesSeen.includes(this.title) ? "" : " (NEW!)"}</u>`;
    const nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"/></svg>`;
    iconElement.innerHTML = nextIcon;
    //wait until click
    //display first line
    //wait until click
    //display next line till done
    //wait untill click
    //display next scene (call this with new index)

    let resolveFunction;
    let index = -1;

    const showNextLine = () => {
      console.log("JR NOTE: shownNextLine", index)
      //if there is no next line, resolve the promise
      if (index >= this.lines.length) {
        //done with this scene
        const body = document.querySelector("body");
        body.removeEventListener("click", showNextLine)
        resolveFunction(true);
        return;
      } else {
        if (index === -1) {
          index++; //just show the title, for some reason the click is called AS this is rendered so its being skipped
          return;
        }
        const line = this.lines[index];
        console.log("JR NOTE: trying to show line: ", line)
        const allCharacters = document.querySelectorAll(".inventory-item");
        for (let char of allCharacters) {
          char.classList.remove("star");
        }

        const charEle = document.querySelector(`.${convertStringToClassFriendlyName(line.name)}`);
        charEle && charEle.classList.add("star");
        if(line.name){
          textElement.innerHTML = `${line.name}: ${line.text}`;
        }else{//sound effects and shit
          textElement.innerHTML = `${line.text}`;

        }
        index++;
      }
    }

    const myPromise = new Promise((resolve, reject) => {
      resolveFunction = resolve;
      const body = document.querySelector("body");
      body.addEventListener("click", showNextLine)
    });

    return myPromise;

  }


}

//if the inventory has Sheep and Blood and Fire
//then a scene with Sheep and Blood would return, as well as Blood and Fire
//but not a scene with Sheep and Blood and Fire and Ria
const getAllScenesWithEntities = (player) => {
  const inventoryNames = player.inventory.map((i) => i.name);
  const ret = [];
  for (let s of all_scenes) {
    let canAdd = true;
    for (let name of s.entityNames) {
      if (!inventoryNames.includes(name.toUpperCase())) {
        console.log("JR NOTE: scene is invalid because does not include name: ", {s, name})
        canAdd = false; //no way to set it back to true once youv'e decided its not valid
      }
    }
    canAdd && ret.push(s);
  }

  return ret;
}

const convertScriptToScene = (title, script) => {
  //{name, text} pairs
  const lines = [];
  let names = [];
  for (let line of script.split("\n")) {
    const parts = line.split(":");
    if (parts.length > 1) {
      const name = parts[0].trim();
      const text = parts.slice(1).join();//everything but the first bit becomes a string again
      names.push(name.toUpperCase());
      lines.push({ name: name.toUpperCase(), text });
    } else if (parts.length > 0) {
      //for things like sound effects, don't try adding it to name list, its just an empty one
      lines.push({ name: null, text: parts[0] });
    }
  }
  names = uniq(names);
  new Scene(title, names, lines);

}

//https://stackoverflow.com/questions/7627000/javascript-convert-string-to-safe-class-name-for-css
const convertStringToClassFriendlyName = (string) => {
  if(!string){
    return string;
  }
  return string.replace(/[^a-z0-9]/g, function (s) {
    var c = s.charCodeAt(0);
    if (c == 32) return '-';
    if (c >= 65 && c <= 90) return s.toLowerCase();
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
}



/*
////////////////////////////SCRIPTS START HERE//////////////////////////////
*/
//http://knucklessux.com/InfoTokenReader/?search_term=pink
//http://knucklessux.com/InfoTokenReader/?search_term=yellow
//http://knucklessux.com/InfoTokenReader/?search_term=romance
//http://knucklessux.com/InfoTokenReader/Bullshit/WordThoughts/
convertScriptToScene("Test1", `Sheep: baaaa
  Blood: [exists]
  Sheep: baaaaaaaaaaaa!!!
  Blood: [leaves sheep]
  Sheep: ...
  Sheep: ...
  Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);

convertScriptToScene("Test2", `Sheep: baaaa
    Sheep: baaaaaaaaaaaa!!!
    Sheep: ...
    Sheep: ...
    Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);

convertScriptToScene("Test3", `Sheep: baaaa
      Camille: [exists]
      Sheep: baaaaaaaaaaaa!!!
      Camille: :3
      Sheep: ...
      Sheep: ...
      Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);


//http://farragofiction.com/ASecondTranscript/
//camille is our special birthdaygurl gonna use her as our test blorbo
//confirmation of who speakers 1 and 2 are in this
convertScriptToScene("A Second Transcript: Part1", `[REDACTED]: Hm.
[FOOTSTEPS]
[REDACTED]: Quite the peculiar place you've brought me to, R3.
[A SICKENING SQUELCH OF RENDERED FLESH, FOLLOWED BY CRACKING BONE]
Camille: You get used to it.
[REDACTED]: Curious. You can talk.
Camille: Sometimes.
[BEAT]
Camille: Does that scare you?
[REDACTED]: Oh, it takes more than mere party tricks to unnerve me.
[REDACTED]: Especially with, well... this.
[REDACTED]
Camille: That's good. I'd hate to do that to you.`);

convertScriptToScene("A Second Transcript: Part2", `[REDACTED]: You know, with how verbose your reports can be, I had expected you to blabber on a lot more than this.
Camille: I have to write to compensate. Not too much, though. Otherwise, I tend to...
Camille: Lose my head.
[GROAN]
[REDACTED]: So not only can you speak, but you're not even funny.
Camille: Ah.
Camille: You hurt me, [REDACTED]tor.
[REDACTED]: Fine, then. It was a decent gag, if that would please you to hear.`);

convertScriptToScene("A Second Transcript: Part3", `[REDACTED]: But enough of that. What is this place, pray tell?
Camille: Good question.
Camille: This is the maze. It is an anomaly which exists outside of time, powered by an artificial intelligence-- much like home, in a way. It contains hundreds-- no, thousands of rooms, each dedicated to each and every horror mankind can fathom.
Camille: Sometimes, when people are caught by obsession, they end up here. I would have seen to its containment if it weren't for the fact that nearly every anomaly gravitates to this maze before 2022.
[REDACTED]: Fascinating. Of course your self-inflicted cabal of monsters rests here. I would ask about that date, but something tells me that I'd rather not know what happens.
Camille: Nothing good happens in that year, no.
[REDACTED]: Figured as much.
[REDACTED]: You know, if these anomalies are as dangerous as you have described them in the past, then disturbing their nest would have most likely saved you a lot of trouble.
Camille: Would it, now?
[REDACTED]: Surely it would have proven more efficient.
[REDACTED]: You are not harnessing anything from them, as far as you've shown your hand. If your goal is to stop them from interfering with this reality, then keeping them around is a moot point. They're just taking up space.
[REDACTED]: We didn't bother with any anomalies we had already contained. This free-range method seems... inane.
Camille: Ah, of course, [REDACTED]tor. I had not thought about it that way. Perhaps simply getting rid of all the monsters is the best solution after all.
[UNSHEATHES SWORD.]
Camille: Would you mind if I started with you, then?
[REDACTED]: ...
[REDACTED]: No. As uncivilized as I find your point, perhaps I see what you mean.
[SHEATHES SWORD.]
Camille: I knew I could trust you to understand.
[SIGH.]`);


convertScriptToScene("A Second Transcript: Part4", `[REDACTED]: So, tell me. What is it that you want? Surely it is not just to spit diatribe, threaten me, then wave your head around.
Camille: Oh, I'm not a fan of any of those, no. I... need something else from you, if that is alright.
[REDACTED]: A request.
Camille: A trade, if you'd like.
[REDACTED]: ...I will listen.
Camille: Thank you.
Camille: Its... your voice. I need your voice. I ask you to speak for me.
[REDACTED]: ...
[REDACTED]: No.
Camille: Not forever! And it would not be for nothing. I would remain at your service, if that is what you'd like.
[REDACTED]: There is nothing I want from you. I advise you to stop. Now.
Camille: I'm sure we could arrange something. There has to be something you lack. It is clear we both do. No one can hear me, and no one can see you.
Camille: Doesn't it feel lonely? Those around us can choose to move on from all of this, to live on, but we can only watch. Bound by the rules placed on us.
[REDACTED]: Fuck off.
Camille: It all makes us so... similar. Both cursed by monsters that no longer exist, both thrust into our role by circumstance. Both made to live by their tenets.
Camille: That is why I'm asking you. The others may try, but they've been compromised. Presenting a united front is a complicated task when you can turn to your baser instincts at any moment. Besides, not everyone can make these decisions. They all need someone to look to for guidance.
Camille: That is why we had a manager.
[REDACTED]: Fuck off.`);

convertScriptToScene("A Second Transcript: Part5", `Camille: [REDACTED]tor.
Camille: The mission... I cannot accomplish it on my own. These civilians think all the research we have done is... silly. They think it's funny. They laughed at me. Laughed at me.
Camille: A hundred years of work, and nobody cared. Because they cannot understand why it's so important. With your help, we could make them.
[REDACTED]: Make them what? Learn a dozen different protocols for anomaly management that they'll never use? No one knew or cared back home, let alone here. I'm sure the whole 'not speaking' thing hurts you plenty, but you cannot imprint an entire society with fear of the unknowable just because--
[REDACTED]: --why am I arguing with you? I don't care. I'm not being a part of this.
Camille: You know how dangerous it was back there. It's not the same, but... it does not mean that we should let our guard down. We were all given a second chance, and there is so much at stake. Our lives. The lives of our coworkers. Maybe more.
Camille: You said that your team had learned from our mistakes. If you are as advanced as you say you are, we could-- we could do good work. It could change lives.
[REDACTED]: Yes, yes, yes. Shower me with sob stories and emotional appeals and compliments to my ego all you want. You are not going to convince me to give my life again for the corps, let alone lead me down a path where I might tempt others, and if you thought that was something I would ever do, then you can shove it right up yours.
[REDACTED]: Now take me back.
Camille: You...
Camille: You think I'm manipulating you. You think I'm lying so you will listen.
Camille: That's... strange. I thought you would understand.
Camille: I thought we might have been friends.
[REDACTED]: Friends. You think we're friends?
[REDACTED]: Well, let me correct your erroneous assumption. All you have ever done is use me and those around me for your agenda without any consideration for what we might actually want. Even now, after I ask you to stop several times, you will not listen to me. My wellbeing is secondary only to your precious â€˜mission'.
[REDACTED]: And that is your problem. I had to act tough, puff my chest, put those close to me in danger, just so any of you would even consider what we'd asked of you, yet you still showed up, demanding our cooperation.
[REDACTED]: And you know what? When push came to shove, I let them choose. If Yongki and Khana want to work for the likes of you, then that is their choice. But there's no thought spared to my wants, is there? What an unthinkable proposition. Instead you poke and prod at my edges like I'm some sort of zoo animal, testing how much I will tolerate. How much you can get away with.
[REDACTED]: I gave up a lot to keep that damn wheel turning. My body, my soul, my very self. And yet, even after it's over, you have the audacity to show up with some story about how the world needs us, about how we're friends, about how we're all in this together.
[REDACTED]: It doesn't, and we're not. It is not my duty or anyone else's to save everyone. I am angry, and I am tired. I did all that thankless work because I still hoped for a better life, and that was a ticket out. It is the story of everyone I have ever known. We have only ever been fodder. That is the fundamental truth of our world.
[REDACTED]: Perhaps at one point you knew this as well. But clearly, you have forgotten.
[REDACTED]: Play the knight, if you so wish. But know you are a brute at heart, eager to solve with steel what you cannot with words, and as much a monster as any of your friends. But unlike them, you took what imprisoned you and declared yourself warden.
[REDACTED]: Know this was all your choice.`);

convertScriptToScene("A Second Transcript: Part6", `Camille: ...
Camille: I don't get it. You can hear me.
Camille: I thought... you'd understand.
Camille: I...
Camille: I have to leave.
[RAPID FOOTSTEPS IN THE OTHER DIRECTION. THEY GET FURTHER AND FURTHER AWAY, UNTIL, FINALLY, THERE IS SILENCE.]
[REDACTED]: ...
[REDACTED]: ...
[REDACTED]: There's no exit to this place, is there?
[REDACTED]: Shit.
[SIGH]
[REDACTED]: Well. Time to wander.`);

convertScriptToScene("A Road Trip: Part 1",`[ARM1]
Devona: Neville, pull over.
[Neville continues staring at the horizon]
Devona: Neville, we gotta switch out.
Neville: Huh?
Devona: We gotta take the next exit to get charged.
Neville: Oh, sure :)
Devona: Camille, did you still want to practice driving in cities?
Camille: :3 
Ria: I can take a turn if you need me to. 
Devona: ...
Devona: ... 
Devona: ...
Devona: "General Motors streetcar conspiracy"
[Temperature in the Car goes up by ten degrees]
Ria: ...
Ria: [small voice] yeah okay`)

convertScriptToScene("A Road Trip: Part 2",`[ARM1]
Ria: Devona, do you have a minute?
Ria: I'd like to talk about the route you and Neville have planned out...
Devona: Yeah?
Ria:...
Ria: well...
Ria: It's just...
Ria: Can't we get to the Anomalous Highway in half the time if we don't...
Ria: Stop at every charging station?
Neville: If we run out of electricity we'll be stranded though...
Camille: :(
Witherby: I hear what you're saying Ria, and I agree, but I think it's important to focus on the fact that we have literally no rush here.
Ria: Okay, then...
Ria: Why don't we come back in a decade when the charging stations are more common?
Devona: Well! Well! You see! i thought, and I mean maybe this is just me but I thought maybe it would be nice to get out of the Mall, see the sights, you know, maybe bond a little bit because I mean, again , maybe this i just me but.... 
Neville: We don't hang out much anymore :(
Neville: Ever since you guys got back together...
Neville: And did what you did in front of Wibby's Salad.
Ria:...
[Temperature in the Car goes up by ten degrees]
Ria: ...
Ria: [small voice] yeah okay`)

convertScriptToScene("A Road Trip: Part 3",`[ARM1]
Devona: Wow.
Neville: ...
Ria: ...
Witherby: ...
Camille: :3
Devona: Did anyone else not expect the Anomalous Highway to be part of ZWorld?
Neville: ...
Ria: ...
Camille: :3
Witherby: I'll make some phone calls.
`)

convertScriptToScene("A Road Trip: Part 4",`[ARM1]
Devona: Ummmmm....
Devona: Ria?
Ria: Yes?
Devona: Could you maybe...
Devona: Um could you maybe if its not too much trouble, i mean i don't want to put you out but I was wondering if-
Neville: Is anyone else really hot in here?
[Temperature in the Car goes up by ten degrees]
Ria:... oh no I'm so sorry I didn't mean to I was just thinking about how the Corporate Overlords literally destroyed the public transit system, this isn't even a conspiracy they were found guilty in a court of law and-
Neville: Wibby?
[Egregious Display of Public Affection Directed At Witherby That Barely Qualifies as Better Kept Private]
[Temperature in the Car goes down by thirty degrees]
Witherby : [blushing] This is hardly appropriate, Neville.
Witherby: I am hardly the team air conditioner. 
Witherby: And Ria is equally more than just the heat she provides. 
Ria: [small voice] thank you witherby
Neville: :)
Camille: :3
`)

//i will never stop being amused that theres both a looping and a non looping closer, cinque cloak really is cruel
//all the friends she WOULD have instead treat her like a weird stranger because the know her looping form beter
//not that wibby is friends with either
//god the closer hates him
convertScriptToScene("A Road Trip: Part 5",`[ARM1]
Witherby: Hello, this is Witherby, with the Training Team, calling for Ms. Closer.
Closer: [static noises]
Closer: Oh.
Closer: It's you.
Witherby: It's great hearing from you again, Ms Closer.
Witherby: I hope things have been going well with your boss. The CFO, was it?
Closer:[static noises]
Witherby: I am calling in a professional capacity.
Witherby: One of your employees, Ms. Devona, designs ZWorld rides?
Witherby: You "CEBro" has recognized her efforts personally.
Witherby: Ms Devona has contracted my services to enquire as to why one of her designs has been replaced with what appears to be...
[papers shuffling theatrically]
Witherby: Some type of "Anomalous Highway"?
Witherby: Signage indicates it goes on forever.
Witherby: Would you happen to know anything of this, Ms. Closer?
Closer: [sigh]
Closer: While I am quite skilled in my professional capacity, wrangling my superiors is not among my job responsibilities.
Closer: I will, of course, look into your query and respond appropriately.
Closer: Would this be the best number to follow up on?
Witherby: Indeed it would, thank you very much Ms. Closer, you have a wonderful day, now.
[phone hangs up]
Closer: The NERVE of him!
Closer: Implying I would EVER have an inappropriate relationship with a coworker!
Closer: Much less a superior!
Closer: ...
Closer: [sigh]
Closer: Well. I suppose it cannot hurt to find out why The CEBro of Eyedol games is micromanaging her themepark rides.`)

convertScriptToScene("A Road Trip: Part 6",`[ARM1]
CFO: Wanda
CFO: Baby
CFO: Cinnamon Bun
CFO: We've taaaaalked about this!
CFO: You can't just go turning random parts of reality into mazes!
CFO: No matter how 'coooool' it would be!
Wanda: [not looking up from her phone]
CFO: siiiiiiiiigh
CFO: [typing]
Wanda: !
Wanda: HEY DID WE JUST LOSE WIFI?
CFO: Wanda. Baby. Cinnamon bun.
CFO: "Anomalous Highway". Maze. Why?
Wanda: Huh?
Wanda: Oh!
Wanda: Isn't it really cool?
Wanda: The Intern says he likes it!
CFO: Wanda, what about your favorite....
CFO: What are you calling them now?
CFO: Scream-gineers?
CFO: That Devona girl? The one who turns into that cool bird?
CFO: You hurt her feelings, apparently.
CFO: That was HER ride you converted...
Wanda: Oh.
Wanda: Huh.
Wanda: Offer her stock tips?
CFO: siiiiiigh
CFO: She's in the Loop, Wanda. Remember?
CFO: Shitty stock tips only work for those out of it.
Wanda: ....
CFO: Tell you what..
CFO: Why don't you make the Intern more Corn Mazes.
CFO: You guys looooove Corn Mazes.
CFO: That way your little hobbies stay in Ohio, and we keep Florida relatively sane.
CFO: Or at least insane with a consistent theme.
Wanda: Are you sure the Intern isn't getting bored of Corn Mazes?
CFO: ...
CFO: You really need to sit down and talk to him yourself.
CFO: You know that, right?
CFO: You proooooomised me.
CFO: LOOPS ago.
CFO: [sotto voice] you both did
Wanda: What was that?
CFO: Nooooothing!
CFO: So!
CFO: Mazes are for Ohio, not Florida!
CFO: If you agree, clean up your Anomalous Highway, yeah?
Wanda: ...
Wanda: Yeah, okay... BUT
Wanda: Do we still have that chocolate guy on retainer?
Wanda: I wanna make a surprise for the Intern if we're just gonna go with a Corn Maze again...

`)

// :) :) ;)
convertScriptToScene("Therapy Ending",`[ARM2]
  Witness: [THERAPY ENDING]
  White Nightengale: [THERAPY ENDING]`)

/*
have scenes have optional [MEMORY] label if from arm1

this lets me have wanda scenes, tho obviously they wont ever be playable, just easter eggs in code

want eyedol games scenes about making eyedlr or other ganes
*/



/*
if hoon,devona neville and vik all are in inventory, Apoxalypz Byrd  is formed (its a band)

meowloudly15 — Today at 8:21 PM
[REDACTED], ostensibly (they haven't shown up for practice in quite some time)
^w^ — Today at 8:21 PM
Apoxalypz Byrd 
meowloudly15 — Today at 8:21 PM
APOCALYPSE BYRD
PERFECT
Hoon and [REDACTED] still can't stand each other
^w^ — Today at 8:21 PM
Yeah, but like
that's normal band stuff
they still go for coffee after practice together
meowloudly15 — Today at 8:21 PM
It's not a radio thing this time it's just they frickin' hate each other

~~~
meowloudly15 — Today at 8:24 PM
Ok hold on
Lee: piano (canon)
Hunter: trumpet (canon)
Ria: vocals (inferred via Singing Machine)

Hoon: DEATH METAL CLARINET
[REDACTED]: drums
Devona: bass guitar, saxophone
Neville: theremin, mixing 
Could [REDACTED] play the drums*/


