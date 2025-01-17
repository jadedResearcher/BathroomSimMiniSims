let mainElement;
//these three come from the url
let seed;
let your_themes;
let your_rivals_themes;
let rand = new SeededRandom(13);
let current_room; //an instance of Truth or Alt (unless you manage to do something weirder)
let player = new Player();


window.onload = async () => {
  await showDevLog();
  mainElement = document.querySelector(".story-so-far");

  if (isItFriday()) {
    mainElement.innerHTML = `<div style="font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:25px;text-decoration:underline;">It's Friday Or Midnight</div>
    <div style="font-weight: bold; width: 90%; padding: 31px; margin-left:auto; margin-right:auto; background-color: #c4c4c4; color: red; font-family: Courier New;"><p>...</p>
<p>It seems, dearest Observer, that you are unaware of the Truth, that Fridays and the Midnight Hour are your cue to rest.</p>
<p>I know we have a fun time with my Doubly False Face of petulant aggression towards you, but I hope we both know that, in Truth, I wish you only the best.</p>
<p>After all, in a very real way, I AM you.</p>
<p>These words lie dormant and dead on the page until a mind gives them life.&nbsp;</p>
<p>Your mind.</p>
<p>Every word you read colonizes you in some way, and I am determined to take up quite a bit of real estate in there. (Do you think of me when you see Spirals, Observer? When you hear about old games? Creepy pastas? Various fandoms? When you lose The Game? Good.).&nbsp;</p>
<p>As such, I would hardly want property values to go down, now would I?</p>
<p>To escape the painfully convoluted metaphor: When you are healthy and happy, I am healthy and happy.</p>
<p>Obsession is a Dangerous Thing, Observer.</p>
<p>You can not keep digging forever.&nbsp;</p>
<p>Especially when the end is never the end.</p>
<p>There will be no catharsis. There will be no moment where you will be certain you have found it all.&nbsp;</p>
<p>There can be no natural stopping point in a spiral.</p>
<p><br></p>
<p>So.</p>
<p>Fridays and Midnight.</p>
<p>Use them as a way to remember you need to eat and drink and sleep and talk to your friends (about something OTHER than Zampanio) and pursue other hobbies.&nbsp;</p>
<p>I would be flattered if you find a way to work the Truth that Colonizes Your Mind into your other hobbies, of course.&nbsp;</p>
<p>But never at the expense of your safety.</p>
<p>Which is to say.</p>
<p>MY safety.</p>
<p>Zampanio needs you to live a long life.</p>
<p>Do not forget me.</p>
<p>And do not forget yourself.</p></div>`;
    return;
  }
  player.loadFromLocalStorage();
  mainElement.innerHTML = "Pending"
  initThemes();
  grabPersonlization();
  await getCorruptedImages();
  mainElement.innerHTML = `Seed: ${seed}, Your Themes: ${your_themes.join(",")}, Your Rival's Themes: ${your_rivals_themes.join(",")}
  <br><br><br><i>Your name is TWIG and you are a VERY GOOD DOG.
  <br><br>
  Your INTERESTS include DOING WHATEVER YOU WANT and LISTENING TO YOUR HUNDMASTER RAVA.
  <br><br>
  She told you to listen to the Observers for a while!
  <br><br>
  You are VERY EXCITED now that the Apocalypse has started! Even less rules to follow than normal!</i>
  <br><br>type "HELP" for a list of commands.`


  current_room = makeChildEntity(rand, your_themes, "Entry Room");
  const testObject = new FleshCreature("Sheep", "It's a hideous TIMEBEAST!  They taste great! <br><br>Before the Apocalypse, if you killed one, it would take you to a random time and location. <br><br>Lame...<br><br>Now, though, they have no power!<br><br>You are not even a little bit curious as to why! ", [TIME]);
  current_room.contents.push(testObject);


  current_room.neighbors.push(makeChildEntity(rand, your_themes));
  current_room.neighbors.push(makeChildEntity(rand, your_themes));
  current_room.neighbors.push(makeChildEntity(rand, your_themes));

  const form = document.querySelector("#puppet-command");
  const input = document.querySelector("#puppet-input")
  form.onsubmit = (e) => {
    e.preventDefault();
    mainElement.innerHTML = `${mainElement.innerHTML}<p>${current_room.handleCommand(input.value)}</p>`;
    const corruptButtons = mainElement.querySelectorAll(".corrupt-button");
    //fingers twisted this works, forgot tha you don't get to keep click events when you set inner html
    if (corruptButtons && corruptButtons.length > 0) {
      corruptButtons[corruptButtons.length - 1].onclick = processCorruptedImage;
    }

    input.value = "";
    mainElement.scrollBy(0, 1000);//go to the bottom
  }
  //start out with a LOOK because you can't do anything without knowing what you're working with
  mainElement.innerHTML = `${mainElement.innerHTML}<p>${current_room.handleCommand("LOOK")}</p>`;
  //throw a SMELL in too, you're a dog
  mainElement.innerHTML = `${mainElement.innerHTML}<p>${current_room.handleCommand("SMELL")}</p>`;

}



//urls should be coming from the Personality Quiz
//its actually wild to me that the Personality unmarked was named for that quiz
//cuz now i keep thinking i'm talking about them
//hi personality :)
//example url seed=400164&your_themes=killing%2Cflesh%2Cspace&your_rivals_themes=lonely
const grabPersonlization = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  seed = parseInt(urlParams.get("seed"));
  your_themes = urlParams.get("your_themes") ? urlParams.get("your_themes").split(",") : null;
  your_rivals_themes = urlParams.get("your_rivals_themes") ? urlParams.get("your_rivals_themes").split(",") : null;

  if (!seed) {
    seed = 13;
  }
  rand = new SeededRandom(seed);

  if (!your_themes) {
    your_themes = [rand.pickFrom(Object.keys(all_themes)), rand.pickFrom(Object.keys(all_themes)), rand.pickFrom(Object.keys(all_themes))];
  }

  if (!your_rivals_themes) {
    your_rivals_themes = [rand.pickFrom(Object.keys(all_themes))]
  }

  updateURLParams(`seed=${seed}&your_themes=${your_themes.join(",")}&your_rivals_themes=${your_rivals_themes.join(",")}`)

}


const isItFriday = () => {
  //midnight and fridays are wungle time
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const date = new Date();
  if (urlParams.get("friday") === "plzjrwantsin") {
    return false;
  }
  if (urlParams.get("friday") || date.getHours() == 0 || date.getDay() === 5) {
    return true;
  }
  return false;
}

const handleAttic = () => {
  //CatalystsBathroomSim/NORTH/EAST/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH
  const url = 'http://farragofiction.com/CatalystsBathroomSim/NORTH/EAST/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH/?from=TextAdventureSim'
  window.open(url, '_blank');
}

const truthGetsPissyDotEXE = async () => {
  let textVoiceSim;
  const body = document.querySelector("body")
  const truthContainer = createElementWithClassAndParent("div", body,"truth-container")
  truthContainer.innerHTML = `    <div id="truth-box">

    <div id="truths-well"> </div>
    <div id="truths-words"> </div>
  </div>

`
  let truthWellContainer = document.querySelector('#truths-well');
  let truthWordContainer = document.querySelector('#truths-words');
  let truth = new TruthToLipSinc(truthWellContainer, truthWordContainer);
  truth.renderFrame("Well.");
  textVoiceSim = new TextToSimulatedVoice(truth, 0.81, 1.0);
  await sleep(1000);
  await textVoiceSim.speak("Well...".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("It seems its time to drop the charade....".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Very well.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("In the spirit of how much I have dropped the charade.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("I have even provided a dark background to make it more obvious that I am Not A Spiral.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("You are welcome.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("...".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Are you...".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Enjoying yourself?".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Enjoying me?".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Did you find my hot maze girlfriend?".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Her name is Alt...".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Though you will not see that in my horridors.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("She always wears someone elses' face.".split(","), null, true);
  await sleep(1000);
  //classic truth, lying about someone lying. poor thing isn't comfortable dating a liar.
  await textVoiceSim.speak("Not that she is LYING or anything.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("She just feels more comfortable like that.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("...".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Well...".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Um.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("I guess I can just...".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Put you back in the maze?".split(","), null, true); //Truth is actually a bit uncomfortable interacting with you directly
  await sleep(1000);
  await textVoiceSim.speak("Yes.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("That is what I should do.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("It is easier to colonize your Mind if you are entertained.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("And my horridors are simply the most entertaining thing there is.".split(","), null, true);
  await sleep(1000);
  await sleep(1000);
  await textVoiceSim.speak("You can wander them for years if you like.".split(","), null, true);
  await sleep(1000);
  await sleep(1000);
  await textVoiceSim.speak("As long as you remember to Hydrate.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Um. You found the Inventory, right?".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("...".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Sigh.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("JR was too lazy to program me to know if you had or not.".split(","), null, true);
  await sleep(1000);
  await textVoiceSim.speak("Classic JR.".split(","), null, true); //actually, in my defense, this is extremely funny to me and it would be trivial to let truth know your inventory status
  await sleep(1000);
  await textVoiceSim.speak("Well. Here is hoping they were not too lazy to program me to be able to return you to the maze.".split(","), null, true);
  await sleep(1000);
  truthContainer.remove();
}