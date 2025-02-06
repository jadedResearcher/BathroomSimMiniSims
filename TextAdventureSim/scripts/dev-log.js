const all_dev_logs = [];

//gosh this does look familiar
const jrLog = (text) => {
  const jrCSSTitle = "font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:25px;text-decoration:underline;";
  const jrCSSBody = "font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:13px;";
  console.log(`%c${"JR NOTE:"}%c  ${text}`, jrCSSTitle, jrCSSBody);

}

/*
taking in a content ele is a pattern i learned from work, feels weird using it in vanilla
*/
const jrPopup =  (title, contentEle, secret) => {
  const popup = createElementWithClassAndParent("div", document.querySelector("body"), "jr-popup");

  popup.focus();
  const titleSection = createElementWithClassAndParent("div", popup, "popup-title-container");
  const titleEle = createElementWithClassAndParent("div", titleSection, "popup-title");
  titleEle.innerText = title;

  const closeButton = createElementWithClassAndParent("button", titleSection, "popup-button");
  closeButton.innerText = "X";

  const popupbody = createElementWithClassAndParent("div", popup);
  //truths arc number is 42. answer to life, the universe and everything.
  popupbody.append(contentEle);
  jrLog(secret);

  closeButton.onclick = () => {
    popup.remove();
    //just in case somehow theres multiple
    document.querySelectorAll(".jr-popup").forEach((x) => x.remove());
  }

  return popup;
}

const showBugForm = () => {
  const bugIcon = document.querySelector("#bug-report");
  bugIcon.classList.remove("bug-pulse")

  const contentEle = document.createElement("div");

  const form = createElementWithClassAndParent("form", contentEle);

  const line1 = createElementWithClassAndParent("div", form);
  line1.style.marginLeft = "13px"

  const label = createElementWithClassAndParent("label", line1);
  label.innerText = "Error Code: "
  label.style.width = "100px"
  label.style.display = "inline-block"


  const input = createElementWithClassAndParent("input", line1);
  input.placeholder = "(find in error reports)"

  const line2 = createElementWithClassAndParent("div", form);
  line2.style.marginLeft = "13px"


  const label2 = createElementWithClassAndParent("label", line2);
  label2.innerText = "Comments: "
  label2.style.width = "100px"
  label2.style.display = "inline-block"


  const area = createElementWithClassAndParent("textarea", line2);
  area.placeholder = "What were you doing when it hit?"

  const button = createElementWithClassAndParent("button", form);
  button.innerText = "Submit"

  form.onsubmit = (e) => {
    e.preventDefault();
    for(const key of Object.keys(fakeDevLogs)){
      console.log("JR NOTE: does key match input?",{key,input:input.value})
      if(key.toUpperCase().trim() ===input.value.toUpperCase().trim()){
        console.log("JR NOTE: yes!")
        player.debugCodes.push(key);//save it exactly in the form its mapped
        player.saveToLocalStorage();
      }
    }
    alert("Thanks! (If I fix this bug I'll make a devlog about it)")
    contentEle.parentElement.parentElement.remove();
  }


  jrPopup("Submit Bug Report", contentEle)

}

const showDevLog = () => {
  const contentEle = document.createElement("div");

  for (let fakeLogCode of player.debugCodes.reverse()) {
    //WHY YES! it converting it to to the local date format means the fake jr devlogs might look different than the real ones
    //secret gigglesnort just for people not in my region :) :) :)
    const log = {date: new Date().toLocaleDateString(), text: fakeDevLogs[fakeLogCode]};
    const container = createElementWithClassAndParent("li", contentEle, "dev-log");
    container.innerHTML = `<b><u>${log.date}</u></b>: ${log.text}`;
    container.onmouseover = () => {
      log.secret && jrLog(log.secret);
    }
  }

  for (let log of all_dev_logs) {
    const container = createElementWithClassAndParent("li", contentEle, "dev-log");
    container.innerHTML = `<b><u>${log.date}</u></b>: ${log.text}`;
    container.onmouseover = () => {
      log.secret && jrLog(log.secret);
    }
  }

  const popup = jrPopup("JR Dev Log", contentEle);
  //just for me cuz i have to refresh the page a lot to develop
  const body = document.querySelector("body");
  const closePopup = () => {
    popup.remove();
    body.removeEventListener("click", closePopup)
    body.removeEventListener("keydown", closePopup)
  }
  body.addEventListener("click", closePopup)
  body.addEventListener("keydown", closePopup)

}

class DevLog {
  date;
  text;
  secret;
  constructor(date, text, secret) {
    this.date = date;
    this.text = text;
    this.secret = secret;
    all_dev_logs.push(this);
  }
}
//new DevLog("01/17/2025","")
//newest on top
//fake devlogs will get added to the top as well

new DevLog("01/26/2025","Been doing a lot of writing lately, but got all the characters in at least...")

new DevLog("01/19/2025","Assuming I didn't accidentally break the inventory again, you can drop things from it.<br><br>You're welcome :)","Plus I made it so you can re-visit any Inventory scene in easier to read format, so long as you've seen it once.")

new DevLog("01/16/2025","Why is it so hard to make the blorbos talk???","see you think its the broken 'TALK' command but actually its the inventory voice system") 
new DevLog("01/12/2025","Haha whoops.<br><br>Guess who has completely forgot to update the Dev Log?<br><br>It's me.<br><br>I've been, believe it or not, STILL been playing wac-a-mole with the Inventory.<br><br>Turns out if you have nothing in it the whole game crashes since my big update with the ending.<br><br>This is why we regression test, smdh.")
new DevLog("12/30/2024","Last day of real vacation left, hoping to get the last little bit of the bones (the scripting system) finished.","for the inventory :)")
new DevLog("12/28/2024","I was GONNA work on the inventory more yesterday, but totally forgot it was a friday, so I had to rest.", "zampanio needs you to live a long life. it's a marathon not a sprint.")
new DevLog("12/26/2024","lol, the inventory is a little more complicated than I thought, disabling it for now, need to remember to enable it when i release<br><br>I am a GENIUS!")
new DevLog("12/24/2024","Wiring up the inventory now, more complicated than expected lol", "by which i mean i'm wiring up all the fakey fake bugs for it :) :) :)")
new DevLog("12/23/2024","Now you can actually move around in this maze!<br><br>Apocalypse chick has been a HUGE help here, cuz the recursion, as it turns out, is NOT always justified :) :) ;)")
new DevLog("12/22/2024", "Guess who's got a whole week off to obsess over making a shitty zampanio fangame?<br><br>having a lot of fun realizing that our protag should be twig cuz of how freaking weird it is to go around smelling things", "its me<br><br>i'm the one on vacation")
new DevLog("12/17/2024", "lol, realized i should probably have some kinda bug report form<br><br>plus this devlog<br><br>gotta get my RAMBLE on<br><br>you know?", "gonna have FUN with this<br><br>Its not enough to have a game that's broken, we need to rub it in your face, after all.\n\nHopefully my fake 'responses' to bug reports won't be TOO cruel if someone believes them?\n\nI promise, I'm a weirdly fast and responsive dev but Obsession is a Dangerous Thing and i'm not THAT responsive")
new DevLog("12/15/2024", "Got the bones in place, you can submit commands and they print text on the screen. it's all default text tho")
new DevLog("12/14/2024", "Got the page more or less created<br><br>Super excited about getting to actually play around with North again. Don't get me wrong, Eyedlr was a great time, 10/10, but it wasn't really ZAMPANIOSIM you know? it was just me spiralling around my own branch in a highly selfindulgent way.<br><br>This is me trying to get back to basics. I tried my hand at making a simulation of what Zampanio would look like if it were an RPGMaker game, so how about a Text Adventure?", "PLUS the Medium and the Anon and a few otheres are trying to end the story :) :) :)\n\nTHAT'll be fun to bounce off of")

//https://www.youtube.com/watch?v=mMo-Nn9_YW4
//today has been a bad day... maybe looking at my old work will help


/*
IC sent me these today:

watt obviously became notAMinotaur
piper becomes camellia (the Cultist) and the Eye Killer
and Jasna becomes the Closer

in zampanio at least


~~~

Watt

PHYSICALITY:
Watt follows cues from Kamen Riders and Super Heroes-- he walks and moves like someone who's watched too many reruns, so he jerks around and his body is very expressive. His body and head tend to zip, like a 'twitch', because of the electricity, so his hands are rarely still. Watt's gotta be moving fast, fast, fast. It's only when he's in shock or upset that these movements slow into something less cartoony.
 
VOICE:
Watt's efforts stay primarily at the higher register, and they push against the back of the throat-- kind of like an alarm buzz to how he speaks. His voice is just as animated as his movement, but not confident-- he erms and he hums and he adds 'sir' to his sentences when under those with authority. It's clear that Watt is more flying by the seat of his pants more often than he's speaking from confidence. Watt abstains from swearing, but this is eroded as the mask of giddy politeness starts to crack. He speaks surely what he says but very meekly and runs around topics-- like he's trying to system overflow his way into wha the wants to say.

LABAN TECHNIQUES:
Watt is quick light efforts, rarely backing into strong efforts unless he has to-- a lot of dabs, a lot of flicks. When pushed, he'll retaliate to slashes, and when REALLY pushed, we can see more maintained efforts like press or wring. It's clear these are efforts he's not used to being in but that he knows how to access.

~~~
Jasna

PHYSICALITY:
Jasna is very aware of her body, but not in a nervous way-- she's from a family of ninjas, so restraint and awareness of how she moves comes easy. Think gameshow hosts and business ad tv women in that they move with assurance and not quite swagger, but purpose-- and even then, she's very controlled! Large ostentatious motions are rare for her unless actively trying to sell something, being from a culture of relative austerity. There's a lot of thought and energy that goes into the soft, non-threatening motions of business acumen. I like to think of how boomerangs themselves move in that they glide effortlessly until they stop, so when not business-pilled she's more like that, slow and still until she has to unleash it all and move.

VOICE:

Jasna is middle register-- her voice rests further down the neck, so that it rings as clear as it can. It's a little salesman, a little high society lady, very feminine, very demure; she's leaning on the feminine persuasion unabashedly as a tool she can use. Her laugh is polite and outward facing, and even when she's not feeling great she's leaning on this voice a little. Either this is the voice she was born with, or it's the voice she's used to-- there's not much of a mask on it here.

LABAN TECHNIQUES:

Jasna primarily glides through her sentences, and flicks mostly when talking about things she finds small or inconsequential; if it's not important to her, she's staying in the more indirect stances. When she wants attention or really needs things punctuated, expect pressing but rarely ever wringing-- that sort of sustained effort isn't like her. Pressing is dedicated to when she's attempting to assert authority, so it's for when she's talking down to someone. She'll otherwise stay light when talking to those above her unless they've really slipped out of tone.

~~~

Piper (Act 1)

PHYSICALITY:
Piper is aware of her body in the same way a kid is aware of their hiding spot-- she knows it's best to stay still, but she still feels the urge to make herself smaller. She moves like she's hiding from a serial killer no one else can see. To this she's not constantly making herself small in a way that looks unnatural, but her arms are never too far from her body and are usually self-soothing (fidgeting, or having her arms crossed or touching). It's almost like she's clammed up and could scurry out in a moment's notice. She's got eyes like a prey animal-- focused on the threat until she's looked at, at which point she may flinch and look somewhere else.

VOICE:
Piper is upper register, on the upper back of the throat, but using a more strained, airy effort, like she's always mid sigh. Her voice leans on deadpan, though it has its peak when in a panic or when she feels like she simply must be heard. When she speaks she does so in a modulated manner, though she has a lot of fun pushing up the creepy factor by whispering or raising to add more threat to it when she's wanting to lean into the horror bit. There's an aura that she's choosing to control how she speaks than it being how she speaks naturally-- more actress finesse than deliberate subterfuge.

LABAN TECHNIQUES:

Piper glides and she dabs, alternating between these depending on whether she's delivering a line or truly speaking off the cuff. There's not a lot of change between these, almost like she's choosing to stay in one effort most of the time? Curious. She gravitates to the harder efforts easily, with sustained efforts such as wrings and presses being her go-tos.

~~~

Camellia

PHYSICALITY:
As Piper's foil, Camellia operates with the presence of a predator. I'd compare it to big cats, specifically lions, who are large and tend to have a small swagger back and forth. Camellia is someone who, when outside of her pack, is aware and constantly on the hunt, so she has the same sort of creepy stare, just more fleeting-- sizing up all threats before focusing in the ones that matter. This eases out when near others of her group, where while she's still playing herself up to be bigger than she is, she's glancing over them and somewhat relaxing her posture. If you've had a cat, you know.

VOICE:

Camellia sits in the same upper register as Piper, but speaks in a lower intonation. Every word is strained and delivered in an even more deadpan voice. It's a little authoritarian, meant to sound final and threatening, maybe a little... fake? When she speaks she inserts as little filler words as possible, preferring to speak in either short yes/nos or full on monologues. She likes these to go through and doesn't like it when she doesn't get her way.

LABAN TECHNIQUES:

Camellia primarily presses, every word pushing against the other person to make them listen no matter what. She prefers her strong efforts, but when not 'on the job' she returns to glide for a more conversational tone. Quick efforts stay out of her repertoire unless really set on edge, in which point she'll revert to them. 

~~~

Piper (Act 2)

PHYSICALITY:
Piper, being some sort of overworld boss for beasts, has to define her physicality into something more tough. She's directly channeling the serial killers from her horror movies; slow, threatening, overbearing. Look at how Jason stances up on his movies, or Michael Myers in halloween-- she's not literally invincible, but she's trying to project the idea that she is. When not on the spotlight, she might revert to a more relaxed posture, though she's gained enough confidence to not go into prey mode. Ultimately she's 'bridging the gap' between Camellia and her, though she stands more true.

VOICE:
Notice a difference not in the register, which doesn't change, but intonation. Her previous deadpan is reserved exclusively for behind the scenes or when performing a scare, with it being replaced by a more forceful, almost playful speaking tone. At the very least she's having tons of fun about it.

LABAN TECHNIQUES:
Here we see the introduction of a bigger variety of efforts. We see more punching/thrusting, choosing to deliver points with emphasis quickly instead of staying on them, and pushing mostly when she's getting what she wants, almost like the mask on her is slipping (deliberately). 

*/

/*
i really like the jasna one, cuz i voice her when she's the Closer

and IC has always said i get her spot on

so the description of jasna's voice reminds me of acting her.
*/