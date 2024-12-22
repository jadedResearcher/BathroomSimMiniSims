let mainElement;
//these three come from the url
let seed;
let your_themes;
let your_rivals_themes;
let rand = new SeededRandom(13);
let current_room; //an instance of Truth or Alt (unless you manage to do something weirder)


window.onload = async () => {
  await showDevLog();
  mainElement = document.querySelector(".story-so-far");

  if (isItFriday()) {
    mainElement.innerHTML = `<p>...</p>
<p>It seems, dearest Observer, that you are unaware that Fridays and the Midnight Hour are your cue to rest.</p>
<p>I know we have a fun time with my False Face of petulant aggression towards you, but I hope we both know that, in Truth, I wish you only the best.</p>
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
<p>And do not forget yourself.</p>`;
return;
  }

  mainElement.innerHTML = "Pending"
  initThemes();
  grabPersonlization();
  mainElement.innerHTML = `Seed: ${seed}, Your Themes: ${your_themes.join(",")}, Your Rival's Themes: ${your_rivals_themes.join(",")}
  <br><br><br><i>Your name is TWIG and you are a VERY GOOD DOG.
  <br><br>
  Your INTERESTS include DOING WHATEVER YOU WANT and LISTENING TO YOUR HUNDMASTER RAVA.
  <br><br>
  You are VERY EXCITED now that the Apocalypse has started! Even less rules to follow than normal!</i>
  <br><br>type "HELP" for a list of commands.`
  
  
  current_room = new Entity("Entry Room", your_themes, rand);
  const testObject = new FleshCreature("Sheep", [TIME], rand);
  const testNeighbor = new Entity("TEST Neighbor (MAKE THIS PROCEDURAL)", your_rivals_themes, rand);


  current_room.contents.push(testObject);
  current_room.neighbors.push(testNeighbor);
  
  const form =document.querySelector("#puppet-command");
  const input = document.querySelector("#puppet-input")
  form.onsubmit=(e)=>{
    e.preventDefault();
    mainElement.innerHTML = `${mainElement.innerHTML}<p>${current_room.handleCommand(input.value)}</p>`;
    input.value ="";
    mainElement.scrollBy(0,1000);//go to the bottom
  }

}

//urls should be coming from the Personality Quiz
//its actually wild to me that the Personality unmarked was named for that quiz
//cuz now i keep thinking i'm talking about them
//hi personality :)
//example url seed=400164&your_themes=killing%2Cflesh%2Cspace&your_rivals_themes=lonely
const grabPersonlization = ()=>{
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  seed = parseInt(urlParams.get("seed"));
  your_themes = urlParams.get("your_themes")?urlParams.get("your_themes").split(","):null;
  your_rivals_themes = urlParams.get("your_rivals_themes")?urlParams.get("your_rivals_themes").split(","):null;

  if(!seed){
    seed = 13;
  }
  rand = new SeededRandom(seed);

  if(!your_themes){
    your_themes = [rand.pickFrom(Object.keys(all_themes)),rand.pickFrom(Object.keys(all_themes)),rand.pickFrom(Object.keys(all_themes))];
  }

  if(!your_rivals_themes){
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