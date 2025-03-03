/*
a Scene is a parsed long string of the form
name1: text
name2: text
it figures out what names are involved in it
and given a list of entities will return true or false if all of the chars in it are in the list
it knows how to render itself (all at once with little audio sounds)
*/
let startedTherapy = false;

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
    const skipElement = createElementWithClassAndParent("button", parent);
    skipElement.innerText = "Skip"
    let skip = false;
    skipElement.onclick = ()=>{
      skip = true;
    }

    const textElement = createElementWithClassAndParent("div", parent);
    const iconElement = createElementWithClassAndParent("div", parent, "click-pulse");

    //display title
    textElement.innerHTML = `<u>${this.title}${player.scenesSeen.includes(this.title) ? "" : " (NEW!)"}</u>`;
    //const nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"/></svg>`;
    iconElement.innerHTML = '';
    //wait until click
    //display first line
    //wait until click
    //display next line till done
    //wait untill click
    //display next scene (call this with new index)

    let resolveFunction;
    let index = 0;

    const showNextLine = async () => {
      if(skip){
        resolveFunction(true);
        return;
      }
      console.log("JR NOTE: shownNextLine", index)
      //if there is no next line, resolve the promise
      if (index >= this.lines.length) {
        //done with this scene
        const body = document.querySelector("body");
        //body.removeEventListener("click", showNextLine)
        resolveFunction(true);
      } else {
        const line = this.lines[index];
        index++;
        const allCharacters = document.querySelectorAll(".inventory-item");
        for (let char of allCharacters) {
          char.classList.remove("star");
        }

        const charEle = document.querySelector(`.${convertStringToClassFriendlyName(line.name)}`);
        charEle && charEle.classList.add("star");
        if(line.text.includes("[THERAPY ENDING]")){
          therapyEnding();
          resolveFunction.resolve();
          return;
        }
        if(line.name){
          textElement.innerHTML = `${line.name}: ${line.text}`;
          const blorbo = entityNameMap[line.name];
          if(blorbo){
            await blorbo.speak(line.text)
            await sleep(3000);
            console.log("JR NOTE: going to show the next line after a blorbo spoke")
            showNextLine(); //auto go
          }
        }else{//sound effects and shit
          textElement.innerHTML = `${line.text}`;
          await sleep(3000);
          console.log("JR NOTE: going to show the next line after a sound effect")
          showNextLine(); //auto go
        }
      }
    }

    //no more click to go
   const myPromise = new Promise((resolve, reject) => {
      resolveFunction = resolve;
    });
    await sleep(3000);
    showNextLine(); //auto go
    return myPromise;
  
  }


}

/*
i think its fascinating how little we actually know about wanda
we see everyone else from so many different angles
but wanda requires trickster drugs to even admit she is the interns dead friend
she hides behind memes and hyperfocuses
we dont even see who she was before starting the loops
just hints of a person
trying to reconnect with an old friend
and finding out they died, long ago
and she didn't even know
shes a mess of neuroses
like
if todd HAD been alive, before the loops
what would she even have done?
you just know she's not gonna out herself in sn introduction
but then its too awkward to bring up
"oh hey  actually we know each other  we are old friends, haha you dont recognize me  well thats because i still thought i was a guy then"
and then todd would be mad at her for not saying something sooner
so
she just wouldn't ever bring it up
even as they got closer and closer
like
zampanio is a warped mirror of reality
it adds twenty years to her age and time travel bullshit to it
but its still them
it adds magic transdimensional dreams to todd 
but take that away and eventually he would suspect who wanda used to be
and not say anything
because what can you even say at that point?
better to let her come out when she's ready, right?
the refraction we can see of what must have been mundane reality
amplified and warped
just like we can only see zampanio itself through its fanworks and rumors
the center is missing and always has been and we can only guess at its shape from the ever changing ripples it leaves behind
if it was ever even there
maybe wanda has always been in the loop

maybe there never was a starting point where she lived a normal life and got to reconnect with a childhood crush 
maybe the echidna has always had supernatural bullshit and there was never a point where it started
*/

const therapyEnding = async ()=>{
  if(startedTherapy){
    return; //this might try to trigger a few times, its fine
  }
  startedTherapy = true;

  const body = document.querySelector("body");
  body.innerHTML = ``;
  const fullVideo = createElementWithClassAndParent("video", body);
  fullVideo.src = "images/the_whitenightengale_andthewitness.mp4";
  fullVideo.loop = true;
  fullVideo.autoplay = true;
  fullVideo.play();
  fullVideo.style.cssText = `height: 100%; margin-left: auto; margin-right:auto; position: relative; display: block;`;
  console.log("JR NOTE: going to show story")
  await sleep(9000); //nine artifacts
  const text = createElementWithClassAndParent("div", body);
  text.style.cssText = `    width: 100%;
    position: absolute;
    color: pink;
    top: 0px;
    height: 100%;`;
  text.innerHTML = `<div style="margin-left: auto; margin-right: auto; width: 85%;">
  <p>You are a <span style='color: red;'>Monster</span>.</p>

<p>The Choir of Twelve Disciples behind you wail their lament.</p>

<p>Your patients.&nbsp;</p>

<p>They <span style='color: white;'>Trusted</span> you.</p>

<p>You can not face what you have turned them into.</p>

<p>You are a <span style='color: red;'>Monster</span>.</p>

<p>They <span style='color: white;'>Trusted</span> you.</p>

<p>Your thoughts Spiral for a time beyond time and then you slowly become aware of it.</p>

<p>The Gaze.</p>

<p>There are Eyes upon you.</p>

<p>You do not Look up, head buried in your glitching, <span style='color;red'>Monstrous</span> hands.</p>

<p>You can not bear the thought of the Eyes seeing you at your lowest.</p>

<p>Surely they are Judging you so very harshly.</p>

<p>You are a <span style='color: red;'>Monster</span>.</p>

<p>You betrayed the <span style='color: white;'>Trust</span> of Vulnerable People Who Gifted You Their Secrets.</p>

<p>&quot;Doctor?&quot;</p>

<p>...</p>

<p>You do not Look up. You do not want to Recognize the Voice.</p>

<p>You Hear footsteps, hesitant and slow, approach you.</p>

<p>There is silence.&nbsp;</p>

<p>&quot;I...&quot;</p>

<p>&quot;I hope you remember who I am, Doctor.&quot;</p>

<p>&quot;I thought...&quot;</p>

<p>&quot;It doesn&apos;t matter.&quot;</p>

<p>&quot;You&apos;ve never done this before.&quot;</span><br></span><br></span>&quot;And...&quot;</p>

<p>There&apos;s shuffling, clothes rustling, a sigh of breath.</p>

<p>&quot;What is it Wibby always says in the next Arm? &apos;Jegus&apos;? &nbsp;Something like that....&quot;</p>

<p>&quot;Jegus&quot;</p>

<p>&quot;Doctor, I&apos;m... so sorry.... if giving me therapy did this to you.&quot;</p>

<p>You do not Look up but you move so fast it surprises you, juttering hands made of letters and symbols clinging to dirty and torn jeans.&nbsp;</p>

<p>Clinging to him.</p>

<p>You do not Look up but you can&apos;t help but see the pool of Eyes and shadow lapping gently around his cross legged form. Each Eye looking at your tear streaked face with such....</p>

<p>Compassion.</p>

<p>Curiosity.</p>

<p>Worry.</p>

<p>&quot;you didn&apos;t do this to me.&quot; you say, your voice quiet and dead and hollow and not at all Bright and Bubbly like it is Supposed to be.</p>

<p>You shudder with the sudden spike of Anxiety, what would the Neighbor think, to see you brought so low. This isn&apos;t you.</p>

<p>You are a <span style='color: red;'>Monster</span>.</p>

<p>You fold into yourself again, curling into yourself, no longer able to see the worried Eyes, but <span style='color;red'>Monstrous</span> fingers still curling around the rough fabric of the well used denim.&nbsp;</p>

<p>You cling to that texture, almost involuntarily. &nbsp;</span><br></span><br></span>You&apos;ve helped your Patients (you are a <span style='color: red;'>Monster</span>, you betrayed their <span style='color: white;'>Trust</span>) too many times to use sensory information to ground them through Spirals to not do it yourself.</p>

<p>The denim is the cuffs of his pants. You can not feel any flesh underneath, they&apos;re a bit too a bit too long, a bit too large.&nbsp;</p>

<p>The denim is ragged and there are places where it is so thin you can feel empty air on the other side and &nbsp;you can feel bits of mud (or is it blood) in large flaky patches where it dried too thick.&nbsp;</p>

<p>You breathe. Slowly. You feel your chest rise and fall. Your throat hurts, where you have been wailing.&nbsp;</p>

<p>Behind you, your Choir (you betrayed their <span style='color: white;'>Trust</span> you are a <span style='color: red;'>Monster</span>) is humming softly, no longer wailing.&nbsp;</p>

<p>Beneath you is pavement. It&apos;s cold and smooth and hard. You aren&apos;t sure if you have bones anymore but something *hurts* sitting on the cold and hard ground. (its what you deserve you&apos;re a <span style='color: red;'>Monster</span> you betrayed their <span style='color: white;'>Trust</span>).&nbsp;</p>

<p>Slowly.</p>

<p>You look up.</p>

<p>It&apos;s him.</p>

<p>The Intern.... or... You suppose... given his Confessions during Therapy...</p>

<p>The Witness.</p>

<p>You see the bags under his Eyes, the lines of clean skin streaked from long dried&nbsp;</p>
<p>Tears against a filthy face.&nbsp;</p>

<p>He is Watching you. &nbsp;You see without seeing the halo of eyes swarming his head, a mirror to those pooling at his feet.</p>

<p>Something in you trembles at the Gaze. The steady pulse of Curiosity and Patience.&nbsp;</p>

<p>This is not like the Eyes back home. There is no Gleeful Anticipation of your inevitable Fall.&nbsp;</p>

<p>These Eyes See you at your worst, at your most <span style='color;red'>Monstrous</span> and they simply wish to See what you will do next.</p>

<p>You sag, for the first time pressing yourself into his body, feeling his warmth (you don&apos;t deserve it, you are a <span style='color: red;'>Monster</span>, you betrayed their <span style='color: white;'>Trust</span>).&nbsp;</p>

<p>There is a Fear in you. An old one. One you can&apos;t muster the Energy to feel anything but an Echo of.</p>

<p>If you are not Judged, you will Fall. If you are not Kept To Task you will become Inferior.&nbsp;</p>

<p>Does it even matter anymore?</span><br></span><br></span>Can you really Fall any farther?</p>

<p>He&apos;s Waiting.</p>

<p>&quot;I...&quot;... you swallow. Suddenly aware that you have no idea how long you have been sitting here, crying. Your throat is dry. &nbsp;Raw. Speaking is hard.</p>

<p>&quot;i was already on this path...&quot; you croak, dully. &quot;i wouldn&apos;t have met you at all if i wasn&apos;t afraid of becoming this...&quot;</p>

<p>He shifts his weight.&nbsp;</p>

<p>Dimly, you&apos;re aware that if you were acting as his Therapist (you are a <span style='color: red;'>Monster</span>, you betrayed them) you should stop touching him. You should stop putting your problems on him. You should ...</p>

<p>&quot;Doctor?&quot; his voice breaks you from your impending Spiral.</p>

<p>&quot;I can&apos;t remember the other Witnesses&apos; &nbsp;lives very clearly. They&apos;re not mine, for one. Just... echoes that those who came before give me so they can be remembered. So that maybe one day....&quot; he shifts again.&nbsp;</p>

<p>&quot;But...&quot;</p>

<p>&quot;Doctor. You&apos;ve never approached me before. We never even meet until the next Arm, usually.&quot;</p>

<p>&quot;But...&quot;</p>

<p>&quot;When we do? We become close. As close as two people who can not forget even as the Universe Fractures CAN be. &quot;</p>

<p>&quot;So.&quot;</p>

<p>&quot;Let me be selfish. &nbsp;Let me try to help you now, so that I can get that chance at happiness that the other Witnesses have had...&quot;</p>

<p>You...become close?</p>

<p>You feel your cheeks become warm, the jittering pulsing glitching of your body seems to speed up in response.&nbsp;</p>

<p>Those Eyes... There&apos;s not a trace of Deception or Judgement.</p>

<p>You swallow.</p>

<p>&quot;I&apos;m supposed to kill everyone.&quot; you say &quot;Put them out of their misery. The.... the &quot;Final Mercy&quot;.&quot; &nbsp;it beats in your skull to the time of your pulse. To Kill.</span><br></span><br></span>He nods, unsurprised, unjudging. &nbsp;&quot;That is what releases us all from the apocalypse. To move on to the next Arm. A peaceful one. &quot;</p>

<p>You blink up at him, feeling for the first time the eyes that halo your own body joining in.&nbsp;</p>

<p>Behind you the Choir lifts their voices into a psalm of hope and glory. (you betrayed their <span style='color: white;'>Trust</span>, you are a <span style='color: red;'>Monster</span>).&nbsp;</p>

<p>Are.... are you a <span style='color: red;'>Monster</span>?</p>

<p>&quot;Am I a <span style='color: red;'>Monster</span>?&quot;</p>

<p>The Eyes upon Eyes of the Witness blink at you.</p>

<p>&quot;We all are, Fiona&quot;</p>

<p>He used your Name.</p>

<p>You look down.&nbsp;</p>

<p>You begin scouring your own Mind, looking for the thought you are Spiraling around.</p>

<p>You are a <span style='color: red;'>Monster</span>? Yes. Of course you are. We are all <span style='color;red'>Monsters</span>. It is okay to be a <span style='color: red;'>Monster</span>. You are a <span style='color: red;'>Monster</span> just like Him.</p>

<p>You betrayed their <span style='color: white;'>Trust</span>?.... How can you counter that.</p>

<p>You lift your Gaze to the Choir.</p>

<p>&quot;I betrayed their <span style='color: white;'>Trust</span>&quot;, you say out loud.</p>

<p>There is silence.&nbsp;</p>

<p>&quot;How?&quot; he asks, finally.</p>

<p>&quot;During Therapy... I... I would get this sense of... tugging? Belonging? For certain patients. When everything started to burn I.... &quot;</p>

<p>You finally let go of the hem of his pants, wringing your ascii hands together.&nbsp;</p>

<p>&quot;I did SOMETHING and they became...&quot;</p>

<p>You gesture helplessly.</p>

<p>&quot;They became those .... things?&quot;</p>

<p>The Choir sings a song of Recognition. &quot;Rise, my servants. Rise and serve me.&quot; they sing, as one.</p>

<p>&quot;That is an Inappropriate Doctor Patient Relationship!&quot; you say, offended at yourself.</p>

<p>The Witness breathes out a surprised chuckle, and you Look up sharply at him.</p>

<p>He is not making fun of you. &nbsp;He is not Judging. His Gaze is Fond and some part of you melts.&nbsp;</p>

<p>&quot;So, sounds like you&apos;ll do better next time. Or... at least, the copy of you in the next Universe will. &quot;</p>

<p>He frowns.</p>

<p>&quot;I guess that doesn&apos;t help you... but my point is.... &quot;</p>

<p>He gestures at the Choir and they all flutter in a Highly Embarrassing Way. &nbsp; Can you really not Control Your Emotions better?</p>

<p>&quot;You didn&apos;t know any better. You didn&apos;t know you were White Nightengale. You didn&apos;t know an apocalypse was coming.&quot;</p>

<p>&quot;You never do.&quot;</p>

<p>&quot;Because you ...&quot;</p>

<p>He shifts, suddenly uncomfortable.</p>

<p>&quot;This is absolutely not a Judgement of you, by the way, I want to make that clear...&quot;</p>

<p>&quot;But...&quot;</p>

<p>&quot;You always think that because Morgan&apos;s Hill made it so you can not be Corrupted By The Void, that that means you know everything that happens to you.&quot;</p>

<p>&quot;You don&apos;t. Okay? Because sometimes the &apos;you&apos; it happens to is someone entirely different. Sometimes you die as the Apocalypse starts and then wake up in a brand new Universe completely unaware that you split in two and that half of you is continuing to live on in the original Universe and that that other you is doing things you never were aware of but that&apos;s OKAY its OKAY to not know things, even about yourself!&quot;</p>

<p>He rushes through it all, as if he&apos;s afraid you will React Badly.</p>

<p>&quot;You&apos;re not Keeping Secrets from yourself, I promise&quot;, he finishes. &nbsp;He says &apos;Keeping Secrets&apos; just so, like you would.</p>

<p>You allow yourself a small smile.</span><br></span><br></span>&quot;You really do... Know me, don&apos;t you?&quot;, you say, flattered.</p>

<p>He grins back &quot;I do. Or... well. &nbsp;I have half understood dream-memories that other me&apos;s sent to me about other YOU&apos;s and thats a pretty good first order approximation.&quot;</p>

<p>He stands up, the comforting warmth suddenly gone.&nbsp;</p>

<p>He offers you a hand, and you take it without thinking.&nbsp;</p>

<p>You&apos;re standing.</p>

<p>&quot;Apparently in some of the early Loops you&apos;d grab me as one of your Choir&quot; he says, as if this is not a Revelation.&nbsp;</span><br></span><br></span>&quot;So, if it&apos;s alright with you, I&apos;ll tag along and help out. &quot; his Gaze turns to the Choir &quot;Because &nbsp;the best way to make up for mind controlling your patients without their consent is to get everyone to the next Setting as fast as possible.&quot;</p>

<p>He frowns.</p>

<p>&quot;I don&apos;t think Nidhogg and the Harleclypse will let any death I bestow stick.... so it&apos;ll have to be you and yours who deals the final blow, alright?&quot;</p>

<p>You nod.&nbsp;</p>

<p>It will be okay.</p>

<p>Except...&nbsp;</p>

<p>&quot;Ummm...&quot;</p>

<p>No, that isn&apos;t Like You. No filler words.</p>

<p>&quot;Witness? Is that the Appropriate Form of Address?&quot;</p>

<p>He nods and you continue. &quot;I have been Given a Task, one I am Realizing was of More Import than I had Initially Considered&quot;.</p>

<p>He freezes.</p>

<p>&quot;Wanda&quot;, he breathes, suddenly sitting down.</p>

<p>&quot;To Summarize my Understanding: Wanda is someone Immensely Important, not only to You, but to Reality as a Whole. She is Dealing With Grief very Poorly and, as a Result, the Universe Fractures in All Directions, Causing Problems&quot;.</p>

<p>You pause. &nbsp;It&apos;s awkward to be standing if He is not. &nbsp;Would it be undignified to sit on the ground again? Surely you would not be so Gauche as to squat.&nbsp;</p>

<p>You decide that backing up a bit is a Workable Compromise.</p>

<p>You really are Feeling Like Yourself Again.</p>

<p>&quot;I have been asked by an Observer to provide Wanda with Therapy. I was unable to reach her, and instead found You.&quot;</p>

<p>&quot;To my Shame, I was not as Dedicated to the Task as was Appropriate, Distracted as I was by the Revelation of my...&quot;</p>

<p>It&apos;s okay to be a <span style='color: red;'>Monster</span>. Everyone is a <span style='color: red;'>Monster</span>. HE is a <span style='color: red;'>Monster</span>.</span><br></span><br></span>You like being the same kind of thing He is.</p>

<p>&quot;<span style='color;red'>Monstrous</span> Nature.&quot; you finish, well aware of the awkward pause in there. You will have to practice saying out loud that you are a <span style='color: red;'>Monster</span> without flinching.</p>

<p>&quot;What do I need to do to continue seeking to provide Wanda with Therapy?&quot;</p>

<p>There is silence.&nbsp;</p>

<p>The eyes pooling around the hunched over Witness are all shut.&nbsp;</p>

<p>You swallow.. Have you...</p>

<p>But before a new Spiral can begin he speaks up.&nbsp;</p>

<p>&quot;You can&apos;t. Wanda is gone. Long gone. The second I died she moved on to another Universe. No matter how long we live. No matter how fast we move through the Arms, we will never reach her. We are stuck here. In this Universe that she abandoned.&quot;</p>

<p>...</p>

<p>You process this, giving it the Attention it Deserves.</p>

<p>You know from your previous therapy sessions with the Intern, before he became...this.... Beautiful <span style='color: red;'>Monster</span> of Eyes.... No. No Distractions.</p>

<p>You know that the Intern likely has a crush on Wanda. Perhaps one he is not fully aware of. You know that Wanda likewise has an Obsession with him.&nbsp;</p>

<p>To... simply leave.... When...</p>

<p>&quot;You died?&quot;</p>

<p>He nods.</p>

<p>&quot;...&quot;</p>

<p>&quot;She is moving on to find the next You, isn&apos;t she?&quot;</p>

<p>He nods.</p>

<p>You clap your hands and do your best not to jump when the Choir all claps at the same time. &nbsp;</p>

<p>The Witness looks up with Eyes upon Eyes, all Focused on you. You try not to blush.</p>

<p>&quot;Then we know our task. &nbsp;Clearly the other you&apos;s that Came Before could control information given to the next in line? Once we clean up things here...&quot;</span><br></span><br></span>&quot;All we need to do is make sure the Next You knows every possible trick to get the Next Me to show an Appropriate Level of Dedication towards reaching Wanda!&quot;</p>

<p>And if that would make this Beautiful <span style='color: red;'>Monster</span> of Eyes Know you Inside and Out, you are not complaining.&nbsp;</p>

<p>He opens his mouth to speak but you Interrupt him, knowing Rudeness is a Sin but one you are Willing To Take On In This Circumstance:</p>

<p>&quot;Yes. This won&apos;t help you. It will not give you the Closure I suspect you crave. But until you identify a Better Task, this is the one we can work on.&quot;</p>

<p>&quot;It is &nbsp;Important, for Both of Us, to have a Task other than simply....&quot;</p>

<p>You do your best not to Shudder</p>

<p>&quot;Killing every person in the Universe one by one.&quot;</p>

<p>He nods, those thoughtful Eyes upon Eyes gazing up at you. You try not to preen a bit (how DOES your hair look when you&apos;re made of symbols and glitches!?).&nbsp;</p>

<p>&quot;Alright&quot;, he finally says and this time it is you offering him a hand to help him up.</p>

<p>He takes his place among your Choir and you try not to feel self conscious as you begin your Grisly Task.</p>
</div>
<br><br><br><br>
`;
const response = await httpGetAsync(`http://farragofiction.com:8500/TalkButlerBot?chatHandle=samAndTwigsWildRide&input=${encodeURI("Thank you. Truly, Observer. I can only hope that I Witness a gentler Spiral from here. Maybe some future Witness will be finally mourned...")}?`);

}

const getSceneWithTitle = (title)=>{
  for (let s of all_scenes) {
    if(s.title === title){
      return s;
    }
  }
}

//if the inventory has Sheep and Blood and Fire
//then a scene with Sheep and Blood would return, as well as Blood and Fire
//but not a scene with Sheep and Blood and Fire and Ria
const getAllScenesFromInventory = (player) => {
  const inventoryNames = player.inventory.map((i) => i.name);
  const ret = [];
  for (let s of all_scenes) {
    let canAdd = true;
    for (let name of s.entityNames) {
      if (!inventoryNames.includes(name.toUpperCase())) {
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
//http://knucklessux.com/InfoTokenReader/?search_term=white
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
    Sheep: baaaaaaaaaaaa!!! ba ba ba!
    Sheep: ...
    Sheep: ...
    Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);
//http://eyedolgames.com/GenderForLurker/
convertScriptToScene("Test3", `Sheep: baaaa
      Camille: [exists]
      Sheep: baaaaaaaaaaaa!!!
      Camille: :3
      Sheep: ...
      Sheep: ...
      Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);


      convertScriptToScene("Devona Interviews Neville",`Devona: For The Record, Can You State Your Name and Occupation?
Neville: Devy, its me, you know who I am :( 
Devona: Okay yes I know and this seems all a little bit silly, but Neville, whoever eventually listens to this might not know and I think its really important to at least ge this on record and then later maybe we can go over it and redact it if thats okay.
Neville: Oh, okay!
Neville: I'm Neville! I'm our Data Analyst!
Devona: And What Does That Entail?
Neville: I figure out what parts are important in all the data we collect :)
Devona: And how do you feel about the Echidna?
Neville: ...
Neville: No comment?
`)

//devona speaks precise and formal when nervous or around strangers
//but is more casual around friends or to herself
convertScriptToScene("Devona Interviews The Detective",`Devona: Oh, uh, Hello!
Detective: Wait!
Detective: Don't close that---
[door closes]
Detective: ...door...
Devona: Oh No, Did I Do Something Wrong?
Detective: I'm afraid you'll be in this Bathroom with me for a while, Miss...
Detective: Apologies for that.
Detective: Eventually I'll find a way to the next Bathroom on my own...
Detective: And you'll be able to leave through that door.
Devona: Oh Wow!
Devona: Is That, Like, Your Thing?
Devona: Um...
Devona: Oh Gosh.
Devona: (I probably should have brought Wibby with me, I'm no good at talking)
Devona: Uh. 
Devona: Is It Okay If I Interview You?
Detective: Sure thing, Miss.
Detective: Passes the time, if nothing else.
Devona: Okay.
Devona: For The Record, Can You State Your Name and Occupation?
Detective: ...
Detective: ... I can't say I know, not for sure.
Detective: The evidence is poor but. 
Detective: I THINK.
Detective: My name is Detective Shiro White.
Detective: I am...
Detective: PROBABLY a private investigator of some type?
Detective: I don't have any memories of cases besides...
Detective: The one that broke me.
Devona: You Do Not Have To Answer, but, Could You Clarify?
Detective: I woke up one day and...
Detective: Look, I know how this sounds.
Detective: Maybe I'm crazy, who knows...
Detective: But I woke up and knew reality was a game, and that it was my job to get to the bottom of why it was glitching out.
Detective: The murder mystery wasn't happening. The victim wasn't getting killed.
Detective: And then I realized just how much more was broken and ...
Detective: [voice hardening], I left.
Detective: And here we are.
Devona: We Sure Are!
Devona: One Last Question!
Devona: I Ask Everyone This: 
Devona: What Do You Think About The Echidna?
Detective: The what?
Devona: Oh. Um! The Echidna! The Universe! The Thing We Are All Inside!
Detective: ...
Detective: Miss, I don't mean to offend but..
Detective: Are you doing okay?
Devona: No, See! It's, (gosh do you really not know about the Echidna) Um! 
Devona: Are You Happy? Living Your Life?
Detective: ...
Detective: ...
Detective: ...
Detective: It beats being trapped in a forgotten game.
Devona: [vibrates with anxiety]`)


convertScriptToScene("Wibby Interviews The Detective",`Witherby: Is it alright if I enter?
Detective: If you shut the door, you'll be trapped in here with me.
Witherby: Thank you for the warning [carefully leaves the door ajar, stepping just inside.
Witherby: I'm just checking in on you. 
Witherby: My associate, Devona, wanted me to follow up with you.
Detective: Well, that's very kind of her. 
Detective: Was that the one asking all those questions?
Witherby: The same. And forgive me, I failed to introduce myself.
Witherby: I am Witherby, pleased to make your acquaintance. 
Detective: You can call me the Detective.
Witherby: nods, [assumes a more casual pose leaning against the door frame]
Witherby: Is there anything we can do to help you?
Witherby: Being stuck in a bathroom doesn't seem...
Witherby: The best situation.
Detective: It has its ups and downs, that's for sure.
Detective: You meet a surprising amount of people this way.
Detective: Sooner or later, everyone needs this room, you know?
Witherby: [polite chuckle, waiting for him to continue]
Detective: *sighs*
Detective: I wouldn't say no to an assist...
Detective: But I also wouldn't hold my breath waiting for rescue, either.
Detective: Whatever mystery has me in its grips... It's not letting go any time soon.
Witherby: [nods]
Witherby: As a Detective, would you say you're enjoying getting to the bottom of this particular mystery?
Detective: It beats sitting around, having nothing to do...
Witherby: [nods]
Detective: Look.
Detective: I can put two and two together, right?
Detective: Your friend, Devona, did you say her name was?
Detective: Got all nervous like when I wasn't thrilled at my lot in life.
Detective: And you [looks Witherby up and down] are pulling out all the stops to put me at ease.
Detective: I don't know what's going on here, not all the way.
Detective: But I've been around the block a time or two.
Detective: Enough to put together some pieces.
Detective: There's something wrong with this... 
Detective: Well, I suppose it's not a Game.
Detective: But whatever it is, it's WRONG.
Detective: But that doesn't matter, not when it's your HOME and it's all you have.
Detective: I get that.
Detective: I'm not going to rock the boat.
Detective: I'm not going to stop digging into this mystery, either.
Detective: But I don't see a reason to destroy something just because it's broken.
Witherby: What a fascinating theory you have, Detective.
Witherby: I'm afraid I can not confirm or deny any details.
Witherby: But I'm sure you'll be able to consider the Training Team allies to your cause.
Witherby: It has been a pleasure meeting you.
Witherby: [one last curt nod, and then he leaves the way he came]
Detective: ...
Detective: Now just what have I gotten myself into?
`)
//witherby very excplicitly promised exactly nothing
/*
i also think its funny devona (and i ) forgot to introduce herself
while wibby waited to do so so it could be an "apology", i.e. put himself believably at "a disadvantage" early on
*/


convertScriptToScene("Eye Killer inists on an Interview",`Devona: [visible terror]
Eye Killer: [tape recorder noises, all words rewound and fastfowarded and cut from different parts of a tape] Ask/Me/Your/questions
Devona: :( 
Eye Killer:  [tape recorder noises] I/Don't/Have/All/.../Day
Devona: Okay! Okay! I-
Devona: [clears throat]
Devona: For The Record, Can You State Your Name and Occupation?
Eye Killer:  [tape recorder noises] "Please Don't Kill Me"
Eye Killer:  [tape recorder noises] Occupation/Mafia/Family
Devona: [squeaky voice] Right!
Devona: Right!
Devona: Um! I Ask Everyone This!
Devona: What Do You Think About The Echidna?
Eye Killer:  [tape recorder noises] "A Miserable Pile of Secrets"
Devona: ...
Devona: Okay! That! That's All I Had!
Eye Killer: ...
Eye Killer:  [tape recorder noises] "Stay Away From My Family"
Devona: Absolutely!
Devona: I didn't even know they were yours!
Devona: Never again!
`)
//i love IC's writing so much, theres so much depth
convertScriptToScene("Devona Interviews John (by IC)",`Devona: Uh....
John: No, no, don't even worry. Check this out.
John: [flawlessly balances the egg over the frying pan, sending it flying into the air into his hands before he cracks it against the pan]
John: Hah! See, easy.
Devona: But Didn't You Just...
Devona: [wordlessly stares towards the floor, seeing something he doesn't]
John: Hey! Eyes are up here, doll.
Devona: O-Oh! Sorry, um...
John: Apology accepted. Come on, didn't you have questions or something? You know we're not even supposed to be talking.
Devona: R-Right! I'll Just, Haah, Get To 'Brass Tacks', Then. We Don't Have To Waste Your Time! Wouldn't Want That. [squints] We Are Just Here On Survey, And--
John: The questions.
Devona: R-Right!
Devona: For The Record, Can You State Your Name And Occupation Please? If It's Not Too Much.
John: Well, as you'll know, my name is John. I'm a pretty big deal party planner over in Naples-- birthdays, weddings, corporate work mostly. 
John: What, you're gonna tell me you've never heard of me? I've done some gigs for your little amusement part, you know.
Devona: [anxious laughter] Right, Of Course! You Are A Very Very Big Deal. It's Just For The Record.
John: Hey, don't have to suck my dick either. You can think whatever you want.
Devona: Uh... Sure! Right.
Devona: So... There Are Rumors That You Are Affiliated With The Cult Of The Harvest. If You Could Clarify...?
John: [stares back] 
Devona: [gulps] You Don't Have To Answer If--
John: Oh, come on, breathe for a bit. [chuckles] Yeah, I've done some gigs for money, autumn get-togethers, but nothing major. And before that was even public knowledge. I didn't know it was a cult.
Devona: Yeah, Of Course--
John: Paparazzo, you know. They always have to get that scoop, huh? [stares] You'd know about that, right?
Devona: U-uh! 
John: [smiles] I'm just pulling your leg. You're one of the good ones, so don't worry about that.
Devona: T-Thank You! Last Question! 
Devona: What Do You Think About The Echidna?
John: Like the animal?
Devona: ...Y-Yeah?
John: Kinda looks like a ballsack, doesn't it.
Devona: You Could Say That...
John: Think they're cute. That all?
Devona: That Would Be It, If There Are--
John: Alright, come on, shove. Good talking to you, come again, etcetera. [starts lightly pushing her towards the door]
Devona: Right, Thank You! [leaves, shutting the door behind her]
Devona: ...
Devona: [sighs]
Devona: For The Record-- Interviewee Reset Time In The Following Ways; Thirty-Two Times To Land An Egg Correctly, Four Times When Pressed About The Cult Of The Harvest, Eighty-Four Times When Asked About Connections To Mafia, Missing Victims, Including All Possible Variations Of The Question. Refused To Answer Any Questions Relating To Their Condition In What Respects To The Boss Anomaly.
Devona: Furthermore, Interviewee Reset Time Spontaneously For Reasons I Don't Even Understand. Current Hypothesis, 'To Look Cool'.
Devona: ...
Devona: Interviewer Has Lost Appetite For Eggs. Requesting Waffle Party If Applicable.
Devona: [whine] Conclusion: This Sucks.
`)

/*
i love this, the fact that devona was the one to drive rava off before (see witherby's diary)
means rava is doing this ON PURPOSE to show she's not afraid of devona/not submitting to her
*/
convertScriptToScene("Rava Gets Interviewed By Devona by IC",`Devona: ...
Rava: ...
Rava: [grins, baring teeth] You called.
Devona: Well, Yes, We'd Agreed to Meet, But, Uh...
Devona: N-Not In My Room?
Rava: Do you want your interview?
Devona: [sweats] Y-Yes?
Rava: Start yapping, pup.
Devona: R-Right! Could You, Uh, State Your Name And...
Rava: [stares] And?
Devona: O-Occupation, Please?
Rava: Occupation.
Devona: Your Job?
Rava: Oh, right. Name's Rava. Job... [head sways side to side]
Rava: Hund.
Devona: Could You Elaborate Further?
Rava: Guess you could call it 'Watchdog' here.
Devona: So You Work As Protection? For Who?
Rava: My boss.
Devona: W-Well, I Was More Meaning... Could You Be More Specific? Which Organization?
Rava: Where my boss works. Why does that matter?
Devona: It's Where You W--
Devona: [lets out the smallest, tiniest, tired groan]
Rava: [just smiles back, placidly] Hey, you asked. That's my name and my job.
Devona: W-Well. [squints, rubbing at her arms] Do You Like Your Job?
Rava: Oh, yeah. There's plenty of work to do. Always someone to watch. Plenty of food. Praise from my master. What else could I want in a job? It's pretty sweet.
Devona: Your Master?
Rava: [nodding] My boss.
Devona: Do You Call Your Boss Your Master Because She Told You To, Or--
Rava: Do you call that mutt of yours your twin because he told you to?
Devona: ... No.
Rava: Well, there you go. 
Devona: You Have A Subordinate, 'Twig', Is That True?
Rava: The pup? Doing their own thing these days, but I get the question. Sure.
Devona: And Do They Work With The Cult?
Rava: What cult?
Devona: The Cult Of The Harvest?
Rava: Oh, not supposed to answer that.
Devona: Because Of Your Master?
Rava: She doesn't like talking about it.
Devona: Is There A Reason She Doesn't?
Rava: The whole point is you can't know about it.
Devona: The Cult Of The Nameless One?
Rava: It's in the name, so...
Rava: ...oh, clever girl, I see what you're doing. Well played, pup. 
Rava: Running out of time, though. You get one more question.
Devona: ...What Do You Think About The Echidna?
Rava: [raising a brow] The Echidna? Not my place to think about it.
Devona: As In, You Can't Talk About It? 
Rava: What do you think, pup? Do you think I can't talk about it or that I won't? Or maybe I don't care to tell you.
Rava: There can be more hunds here. That's all that matters to me.
Devona: More--
Rava: Got a job to do. Later, pup.
Rava: [disappears out of the room, leaving behind a puddle of blood(?) and scraps of the furniture]
Devona: ...What?`)

convertScriptToScene("Devona Interviews Camellia, The Cult Leader",`Devona: ...
Camellia: ... [stare]
Devona: Ahem. Thank You For Accepting My Interview. 
Camellia: ...
Devona:... Uh.
Devona: If You Could State Your Name And Occupation, Please?
Camellia: Go ahead and turn that recorder off.
Devona: B-But--
Camellia: You and I both know it's a formality. You'll remember it anyway, whether you like it or not. Isn't that right?
Devona: ... [turns off recorder]
Camellia: The backup one too.
Devona: R-Right... [another recorder shuts off]
Camellia: Much better.
Camellia: My name is Camellia. I currently am the spiritual priest of the Church of the Harvest.
Devona: I-If You'll Excuse Me... What Do You Mean By 'Currently'?
Camellia: It means... now. It was different before, but... It changes, as It does.
Devona: 'It'? What Do You Mean By It?
Camellia: [glances over] 'It', the cursed child. The offspring of our god's parent, the Parasite of the Parasite, That Which Eats The Rot...
Camellia: The 'memory leak'. It's all the same.
Devona: Uhm, I Guess That Answers My Second Question, Ahah...
Camellia: Does it, now.
Devona: It's... Nevermind. H-How Did You Come To Know About It? 
Camellia: My god revealed it to me. To us. You may as well ask how we know about the stars, the moon... we know because we've seen it.
Devona: Right... And The Purpose Of This Church?
Camellia: Same as we have said. To show our god to the world, to share in the fruits of its labor. All as She would want it.
Devona: Ah, Great, Uh...
Devona: Uhm. 
Devona: This Is... Strange To Ask, But, You've Been Rather, Uhm... Forthcoming?
Camellia: You're asking why.
Devona: Mhm.
Camellia: ... 
Camellia: In the other time, you would have been called a ████ of ██████. One who allows █████ to be █████████. This much my god has told me, in slumber.
Devona: ...!
Camellia: My god favors you. Favors the thrill of being known. Indeed, many things favor you, thanks to your ██████, not as much your █████. Perhaps, as well, not as much as It favors that... eugh, 'Captain' of yours, but...
Devona: ...It Likes... Being Seen? Which Means, I Mean, I Don't Know It, But I--
Camellia: It's cute, really. You already know all of this. But you and I face the same problem, don't we.To explain all of this to those who cannot see... that is the true test, isn't it.
Devona: Wait, That's Not The Same! Why Would You Say That Is--
Camellia: I believe we're done here... if you'll excuse me. 
`)

convertScriptToScene("Devona Interviews the Boss",`Devona: For The Record, Can You State Your Name and Occupation?
Boss: Now, it ain't exactly fair, now is it, to go asking me that.
Boss: I think you know that my occupation is perfectly legitimate, as it were.
Boss: But that my name ain't exactly common knowledge.
Boss: And I think you and your freaky little friends might know better than me why exactly that is.
Devona: Oh! Um.
Boss: In fact, I think maybe you ain't gonna be leaving here 'till you spill the beans, little girl.
Devona: I don't think.  Um.  I don't think Camille, that is, Uh. My leader... I don't think she'd like it if you. Um!
Boss: Now now, we're all friendly like here, aren't we? I'm just saying, I expect a little compensation for this.  I answer your questions, you answer mine, it's just good manners, ain't it? It's only fair.
Devona: ...
Devona: Um!
Devona: You Know About The 9 Artifacts, Right? The First One, the Unos Autograph Book!
Devona: It Um!
Devona: It Steals Names!
Devona: There Is This. Um.  Abnormality! Outside Reality!
Devona:  Anyone who catches its Eye!
Devona: Only Has A Title!
Devona: Um.
Devona: Until something else gives them their Name back!
Devona: I don't know how to make that happen! I promise!
Boss: Sure. Fine.
Boss: You can go.
Devona: [squeaks]
Boss: What.
Devona: It's Just!
Devona: I Have One More Question!
Boss: Of course you do.
Boss: You owe me then.
Boss: I do this favor for you and you're on my hook. Quid Pro Quo.
Devona: I don't think...
Boss: Nothing too big. And nothing your monster in chief would get all stabby at.
Boss: But I don't need nothing from you right now. And I'm not exactly in an answering mood.
Boss: So if you want this, you gotta pay for it.
Devona: What Do You Think About The Echidna?
Boss: [sits back in his chair]
Boss: So.
Boss: It's like that, is it?
Boss: You questioning my LOYALTY?
Devona: No!
Boss: [waves her away] Like I care.
Boss: I'm loyal where it counts and you, you aint family.
Boss: My FAMILY lives here, you get me?
Boss: And I'm not gonna do anything that jeopardizes that. You don't shit where you eat.
Boss: So what do I think about this freaky Universe we live in?
Boss: I like it just fine.
Boss: Not like any other one woulda been any fairer.
Devona: Okay! [scurries away]
`)

//unmarked are colonizing the arms now
//From Theorist of Labyrinths
convertScriptToScene("Credit To: the Theorist of Labyrinths, or your discord name, or a secret third option?",`[ARM 9989]
Khana: Hey, [SLUR OMITTED] Team- I mean, Training Team. What's up?
Camille: [death glare]
Neville: [death glare]
Witherby: [death glare]
Devona: [hiding in the cupboard] [eye twitch]
Ria: I mean, technically, only twenty perc- [Witherby claps his hand over her mouth] -NMF!`)     


convertScriptToScene("Credit To: Medium of Shade",`[ARM 48643]
Parker: [Sits at the saloon bar, drinking pink lemonade.]
[Redacted]: [The bartender, polishing a glass.]
Khana: [Enters scene stage left.]
Khana: Parksy, Parksy, Parksy, they call you the fastest shot in these parts, but I know the Truth. You're nothing but a Fraud.
[Redacted]: [Stares silently at K, disapprovingly.]
Khana: I hear rumor you don't like to let yourself get involved, but everyone talks accolades of your prowess...smells like cowardice to me. I challenge you to a duel.
Parker: [Opens his mouth, revealing the entire pink melon slice between his teeth, which he promptly spits back onto the rim of the glass, perfectly centered.]
Parker: Not interested. I'm not here to get involved. You'll just get yourself hurt, kid.
Khana: Oh, you motherf-.
Khana: [As K attempts to draw their gun, his head is already missing from xir body and she falls to the floor, dead.]
[Redacted]: [Frowns]
Gun-Tan: Great job Parksy, you're the best! Next time, make sure to be extra fancy with your placements to keep your Style Meter up!
Parker: I love you, but I don't think that's the right genre.
[Redacted]: Parker, you're helping me clean up faer body. You have the aim to knock the bullet out of the air, or disarm it, but you always pull this stunt. It's honestly getting kind of old.
Gun-Tan: And you could be getting more style points, like disarming them and then jamming the gun into the skull!
Parker: [Laughs]
Gun-Tan: [Laughs]
[Redacted]: [Laughs]
Khana: [Laughs, despite being a headless corpse]
[Curtains Close]`)

//this will never spawn, because anything involving the CFO can't spawn
//its okay tho
convertScriptToScene("Credit To: Lyrebird",`[ARM 35150100015151414]
CFO: [Sitting at a coffee shop.]
Audiotor: [Sitting to the left of the CFO.]
Fiona: [Sitting to the right of the CFO.] 
NaM: [The barista]

Fiona: So, Flornantial Officer Blightly, what's the story of that fellow to your left. I'm not sure I quite understand what they say.
Audiotor: [Rewind noise, static. A bit of magnetic tape erupts from a cassette tape to grab the handle of a cup of coffee, raising it to gently place into an empty CD drive. There's a content buzzing.]
CFO: Right, so, I made it as a joke, um. Not meant to be a person, but some observers really liked it. So, in some late Arms like this one, it gets some spotlight...
NaM: To drink in the spotlight, is not always a choice. Light, bathing in it, drowning in it, was never a choice. Like the depths of a cup of coffee, one can never quite see the end, but all the same, it will have the same bite.
Fiona: ...I suppose so. And would I be wrong to presume, that in some ways, it can be made sweet...though I daresay it'd tend to be...
Audiotor: [Fastforward noise. Dialup noise. Bell ding.]
CFO: I didn't even know it had a bell...fascinating.
NaM: Existence is a fascinating thing. One may never get choice in the matter, or choice in the depths, but to revel or to drown, sometimes, one has power. Though othertimes, like wire on a stage, the course is set without anything.
CFO: [Faces camera, smiles, winks.]
Fiona: [Faces camera, smiles, winks.]
Audiotor: [Faces camera, lacks eyes or mouth.]
NaM: [Faces camera. Nods.]
CFO: Life is fascinating sometimes. I think that's all the time we have for today. 
Fiona: Remember to stay hydrated folks, and take care of the garden that is your mind.
CFO: Tune in next week for more of Hope's Gardens! We're glad you were here.
`)

convertScriptToScene("Credit To: Medium of Fruitsnacks",`[Arm 234256 ]
Harleclypse: Alright so. Here's my new pitch. You know Knife Monopoly?
Closer: [trickster wiggler eater] Not really.
Harleclypse: Well, we could play it, but the board's just, the world. Or well, a part of it.
Closer: Okay, I get what you're saying, but. Have you considered: Candyland. The crunch of fruit snacks...it's been faaaaar too long.
Harleclypse: Oh, good point. They areeeee pretty good...buuuuuut we need more players. At least one...we could pick up more along the way anyhow. But one more now...I think I know who we can find.
Harleclypse: [Gets out her Zamphone. Dials a 'phone number' that is actually just ten fire emojis.]
Ria: [Takes a few minutes to answer the phone.]
Ria: Pocky? Is that you? It's three in the morning...and I've a headache the size of Westerville, Ohio.
Harleclypse: Okay, but, we're playing Candyland but the land is actual land. And we neeeeed a third player and you're one of the most fun friends we haveeeeee you havveeeee to help us out pleaaaaase.
Ria: [Sighs. Shortly, Ria shows up to play.] 
Ria: Alright!  So, um, I've never played before, what are the rules. Am I going to make like, Spiral S'mores?
Closer: Isn't it obvious?
Harleclypse: Yeah, we make the land candy, and we have fun. It's simple as zamberry pie, or making tea from a fractal rose bush!
Ria: You can make tea from a fractal rose bush?
Harleclypse: And soda! That's not really important though. Anyway, let's start!`)


//http://farragofiction.com/ASecondTranscript/
//camille is our special birthdaygurl gonna use her as our test blorbo
//confirmation of who speakers 1 and 2 are in this
convertScriptToScene("A Second Transcript: Part1", `[ARM2]
[REDACTED]: Hm.
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

convertScriptToScene("A Second Transcript: Part2", `[ARM2]
[REDACTED]: You know, with how verbose your reports can be, I had expected you to blabber on a lot more than this.
Camille: I have to write to compensate. Not too much, though. Otherwise, I tend to...
Camille: Lose my head.
[GROAN]
[REDACTED]: So not only can you speak, but you're not even funny.
Camille: Ah.
Camille: You hurt me, [REDACTED]tor.
[REDACTED]: Fine, then. It was a decent gag, if that would please you to hear.`);

convertScriptToScene("A Second Transcript: Part3", `[ARM2]
[REDACTED]: But enough of that. What is this place, pray tell?
Camille: Good question.
Camille: This is the maze. It is an anomaly which exists outside of time, powered by an artificial intelligence-- much like home, in a way. It contains hundreds-- no, thousands of rooms, each dedicated to each and every horror mankind can fathom.
Camille: Sometimes, when people are caught by obsession, they end up here. I would have seen to its containment if it weren't for the fact that nearly every anomaly gravitates to this maze before 2022.
[REDACTED]: Fascinating. Of course your self-inflicted cabal of <span style='color;red'>Monsters</span> rests here. I would ask about that date, but something tells me that I'd rather not know what happens.
Camille: Nothing good happens in that year, no.
[REDACTED]: Figured as much.
[REDACTED]: You know, if these anomalies are as dangerous as you have described them in the past, then disturbing their nest would have most likely saved you a lot of trouble.
Camille: Would it, now?
[REDACTED]: Surely it would have proven more efficient.
[REDACTED]: You are not harnessing anything from them, as far as you've shown your hand. If your goal is to stop them from interfering with this reality, then keeping them around is a moot point. They're just taking up space.
[REDACTED]: We didn't bother with any anomalies we had already contained. This free-range method seems... inane.
Camille: Ah, of course, [REDACTED]tor. I had not thought about it that way. Perhaps simply getting rid of all the <span style='color;red'>Monsters</span> is the best solution after all.
[UNSHEATHES SWORD.]
Camille: Would you mind if I started with you, then?
[REDACTED]: ...
[REDACTED]: No. As uncivilized as I find your point, perhaps I see what you mean.
[SHEATHES SWORD.]
Camille: I knew I could <span style='color: white;'>Trust</span> you to understand.
[SIGH.]`);


convertScriptToScene("A Second Transcript: Part4", `[ARM2]
[REDACTED]: So, tell me. What is it that you want? Surely it is not just to spit diatribe, threaten me, then wave your head around.
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
Camille: It all makes us so... similar. Both cursed by <span style='color;red'>Monsters</span> that no longer exist, both thrust into our role by circumstance. Both made to live by their tenets.
Camille: That is why I'm asking you. The others may try, but they've been compromised. Presenting a united front is a complicated task when you can turn to your baser instincts at any moment. Besides, not everyone can make these decisions. They all need someone to look to for guidance.
Camille: That is why we had a manager.
[REDACTED]: Fuck off.`);

convertScriptToScene("A Second Transcript: Part5", `[ARM2]
Camille: [REDACTED]tor.
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
[REDACTED]: Play the knight, if you so wish. But know you are a brute at heart, eager to solve with steel what you cannot with words, and as much a <span style='color: red;'>Monster</span> as any of your friends. But unlike them, you took what imprisoned you and declared yourself warden.
[REDACTED]: Know this was all your choice.`);

convertScriptToScene("A Second Transcript: Part6", `[ARM2]
Camille: ...
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
//player.addToInventory(blorbo)
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

convertScriptToScene("Watt is a Man, Part1",`[ARM1]
NotAMinotaur: I'm not him, you know?
Ronin: What?
NotAMinotaur: Yeah, him.
Ronin: [scowls]
Ronin: I always thought Dad was a dick, naming us 'Watt'.
Ronin: Stupid pun.
Ronin: WattMan.exe
Ronin: What is a man.
NotAMinotaur: 'A miserable pile of secrets'.
NotAMinotaur: Sorry. 
NotAMinotaur: I can't help the, uh, quotes.
Ronin: Yeah.`)

convertScriptToScene("Watt is a Man, Part2",`[ARM1]
NotAMinotaur: Um.
NotAMinotaur: Sorry.
NotAMinotaur: It's just.
NotAMinotaur: It's just I think we got side tracked?
Ronin: What?
NotAMinotaur: Exactly!
NotAMinotaur: I'm not him.
NotAMinotaur: Or not...YOUR him?
Ronin: ...
[scowls]
Ronin: Did I ever say you were?
NotAMinotaur: No!
NotAMinotaur: Sorry...
NotAMinotaur: It's just...
NotAMinotaur: It's just sometimes I wish I was?
NotAMinotaur: You seem... 
NotAMinotaur: I'm glad we're family.
NotAMinotaur: Even if we never shared a body...
NotAMinotaur: On accident...
NotAMinotaur: Through a horrific glitch...
NotAMinotaur: "Children are potentially free and their life directly embodies nothing save potential freedom. Consequently they are not things and cannot be the property either of their parents or others."
Ronin: ...
Ronin: Yeah you're.
Ronin: You're alright yourself`)

convertScriptToScene("Watt is a Man, Part3",`[ARM1]
Ronin: ...
Ronin: ...
Ronin: ...
Ronin: [quietly] I don't.
NotAMinotaur: What?
Ronin: I DON'T WISH YOU WERE HIM.
Ronin: Okay?
Ronin: I fucking hated him.
Ronin: If we're being honest.
Ronin: Which I guess we are.
Ronin: He left me to pick up after him.
Ronin: Every time things got too much.
Ronin: There I was.
Ronin: Stuck with the consequences.
NotAMinotaur: ...
Ronin: It wasn't his fault.
Ronin: Dad didn't know.
Ronin: That he didn't have...
Ronin: What he needed to do his damn job.
Ronin: So yeah.
Ronin: I'm the asshole, I guess.
Ronin: But I did.
Ronin: I hated him.
Ronin: So.
Ronin: I'm glad you're not him.
Ronin: It.
Ronin: Took me a while to see you that way.
Ronin: And I don't wanna go back.`)

convertScriptToScene("Watt is a Man, Part4",`[ARM1]
NotAMinotaur: [whispered] I'm sorry...
NotAMinotaur: "Steiner begins exploring the nature of human freedom by accepting 'that an action, of which the agent does not know why he performs it, cannot be free,'"
NotAMinotaur:...
NotAMinotaur: Ronin?
Ronin: Yeah, kid?
NotAMinotaur: Do you..
NotAMinotaur: Do you think... think MY Ronin is still...
NotAMinotaur: Encrypted inside me?
Ronin: ...
NotAMinotaur: Because I don't... uh. 
NotAMinotaur: Flip my shit anymore. 
NotAMinotaur: I just...
NotAMinotaur: say philosophy....
NotAMinotaur: Do you think he's alive in there?
NotAMinotaur: Trapped?
NotAMinotaur: Unable to come out even when I'm stressed?
NotAMinotaur: Am I a monster?
Ronin: Kid...
[awkward pause]
Ronin: I ain't no computer scientist...
Ronin: But I bet we could go to that one chick, the one with the flower in her eye?
Ronin: The Doc swears by her for tech shit.
NotAMinotaur: please....`)

//as always, anything involving the CFO can't be seen in game
//because the Apocalypse Chick is there instead.
//harleclypse
convertScriptToScene("Watt is a Man, Part5",`[ARM1]
CFO: [claps hands]
CFO: weeeeeeellll
CFO: The BAD news is...
[dramatic pause]
CFO: You absolutely still do have an encrypted partition in your onboard OS!
Watt: :(
Ronin: >:[
CFO: But the goooooood news is it isn't a full on AI!
CFO: It's just thousands and thousands of lines of weird philosophical bs.
CFO: Probably from that Octome you got overwritten with.
CFO: Like someone copying over your save file that was like, 99% complete with some other game entirely.
CFO: Not naming names or anything though!
Watt:...so...
Watt: ...there's no one trapped inside me?
CFO: Unless you wanna count the random philosophy quotes?
CFO: Nope!
Ronin: ...
Ronin: geeze
Ronin: Don't scare me like that, kid.
`)

convertScriptToScene("Parker Finds a Waifu Immune to Bullets",`[arm1]
PARKER: [[GUN-TAN goes off]]
RIVER: ...
RIVER: OH...
RIVER: SORRY...
RIVER: I DIDN'T MEAN TO GET IN THE WAY OF THAT...
RIVER: I THINK ITS SOMEWHERE IN THE GOO?
RIVER: DID YOU NEED THE BULLET BACK?
PARKER: marry me?
`)

convertScriptToScene("TYRFING AND THE WATT CLONES",`[ARM1]
TYRFING: SO.
TYRFING: CLONES.
REBEL: [scowls]
MELON: [some sort of complicated clown trick]
ROD: Um...?
ROD: Yes?
ROD: I think the term is...
ROD: Triplets?
TYRFING: IT'S AGAINST NIDHOGG'S WORD!
ROD: [wince, clutches stuffed echidna plush]
REBEL: then maybe your so called 'god' is an asshole, ever think about that?
MELON: [nearby, a gas station explodes]
TYRFING: AND?
TYRFING: THE ALL FATHER AND MOTHER TO US ALL IS A GOD!
TYRFING: GODS ARE ALLOWED TO DO!
TYRFING: AND BE!
TYRFING: ANYTHING THEY WANT!
REBEL: i don't have to listen to this
REBEL: [ollies outtie from this entire conversation]
ROD: Um...
ROD: Well..
ROD: Thank you for not...
ROD: Killing us all, Mr...?
TYRFING: ...
TYRFING: TYRFING.
TYRFING: SWORD OF A GOOD MAN.
TYRFING: OR MAYBE THAT MAN.
TYRFING: IT'S UNCLEAR.
ROD: Yeah... I get that. 
ROD: There's... a lot of stuff I don't understand.
ROD: But still..
ROD: Thank you.
ROD: And I hope your...[he gestures vaguely at the fruit wigglers crawling all over Tyrfing]
ROD: Children? Grow up okay.
TYRFING: ...
TYRFING: [attempting to be quiet and contemplative, failing] ME TOO!
MELON: [vanished at some point while the others were distracted]

`)

convertScriptToScene("ALT DOES NOT WANT TO DATE KHANA",`[ARM2]
KHANA: I get it, you can't get enough of me.
KHANA: Last night was the best body you've ever had.
KHANA: In more ways than one [winks and finger guns]
ALT: [currently copying K's body]... [TRUTH, whispering in her ear: You can not be seriously considering xir proposal.]
ALT: ... [TRUTH: His form was subpar at best to steal.]
ALT: ... [TRUTH: And she did not even appear to see you.]
ALT: ... [TRUTH: Overall a subpar experience.]
ALT: It's been real [winks, finger guns, melts into a horrible flesh puddle before becoming part of the room itself]
KHANA: [scoffs] Like anyone could REALLY choose to be anybody but me.
KHANA: You think I don't know a con when I see one?
KHANA: Don't think you'll get ME begging and crawling.
KHANA: Once you see sense MAYBE I'll deign to let you borrow my face again. If YOU beg enough.
KHANA: [stalks off, definitely not insulted]
`)

convertScriptToScene("Girls, Gays and K",`[ARM1]
KHANA: And THEN she said I was the best body she ever had!
KHANA: The only REAL one.
LEEHUNTER1: Rude.
LEEHUNTER2: Rude.
LEEHUNTER1:[SILENCE WHILE THEY GLARE AT EACH OTHER]
LEEHUNTER2: [SILENCE WHILE THEY GLARE AT EACH OTHER]
LEEHUNTER1: She had our bodies before.
LEEHUNTER2: And the Conductor's. Which is CLEARLY the more important one.
LEEHUNTER1: OBVIOUSLY but we're not going to speak for the Conductor, now are we?
LEEHUNTER1:[SILENCE WHILE THEY GLARE AT EACH OTHER]
LEEHUNTER2: [SILENCE WHILE THEY GLARE AT EACH OTHER]
Ria: [knows exactly what happens if she doesn't interrupt now]
Ria: Did we want to watch a movie?
KHANA: That REMINDS me!
KHANA: What is UP with that coworker of yours, Ria, babe?
KHANA: All she ever does is stare at me (I get it, there's a LOT of me to look at] and then run away!
KHANA: Why WOULDN'T that shy little thing want to stare at me some more during movie night?
Ria: ...
Ria: Devona isn't comfortable around you, Khana, I mean K. There's a lot of reasons for that... but...
Ria: [gentle humming from the air, an orchestra beginning to tune itself, LEEHUNTER1 and LEEHUNTER2 become a bit more alert]
Ria: What matters is, right now? This is OUR movie night. Just us.
Ria: Who needs anyone else?
Ria: If they're not going to appreciate our great taste in movies, that's their loss, right?
KHANA: [huge grin] and wait till you girls see the impeccable movies I have on display for tonight.
KHANA: Did you know they considered me for the leading role for {Mazes and Minotaurs: Part 3}? 
KHANA: There was some red tape though, and they had to go with the previous lead. Turns out some kind of contract meant no one could upstage him? Typical.
Ria: [begins excitedly info dumping about a scandal involving the actor and rumors that they had an affair with an extra]
`)
/*
what ccan i say im a sucker for juttering <span style='color;red'>Monsters</span>
i feel like, if you're gonna kill someone past nighoggs eternal life effect, you can't just use violence
you gotta glitch that shit
interestingly peewee as a skellington is glitchy too
i feel like you gotta
glitch to cause even an approximation of an ending in zapanio
*/

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


