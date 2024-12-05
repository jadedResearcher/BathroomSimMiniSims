
/*
whole facts are stored to memory which makes them resistent to patches but ALSO means we can 
have rooms where you can define your own facts
zampanio style
*/
let infinite_art = [];
let eyes = [];
let fanWork = [];

const getCorruptedImages = async () => {
  const infinite_art_source = "http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/EAST/NORTH/NORTH/NORTH/images/infinte_art_machine/";
  const eyes_source = "http://farragofiction.com/ZampanioEyes4/";
  const fanSource = "http://knucklessux.com/PuzzleBox/Secrets/misc/FanWorkImages/";

  infinite_art = await getImages(infinite_art_source)
  infinite_art = infinite_art.map((i) => infinite_art_source + i);
  eyes = await getImages(eyes_source)
  eyes = eyes.map((i) => eyes_source + i);
  fanWork = await getImages(fanSource)
  fanWork = fanWork.map((i) => fanSource + i);
}

const getAllUnlockedFactTitles = () => {
  const ret = [];
  for (let fact of globalDataObject.factsUnlocked) {
    ret.push(fact.title);
  }
  return ret;
}

//picks a theme and makes a bullshit fact about it
const randomFact = (rand) => {
  const chosenTheme = rand.pickFrom(Object.values(all_themes));

  const person = chosenTheme.pickPossibilityFor(PERSON, rand);
  const adj = chosenTheme.pickPossibilityFor(ADJ, rand);
  const compliment = chosenTheme.pickPossibilityFor(COMPLIMENT, rand);
  const insult = chosenTheme.pickPossibilityFor(INSULT, rand);
  const supermove = chosenTheme.pickPossibilityFor(SUPERMOVE, rand);
  const object = chosenTheme.pickPossibilityFor(OBJECT, rand);
  const location = chosenTheme.pickPossibilityFor(LOCATION, rand);

  const childbackstory = chosenTheme.pickPossibilityFor(CHILDBACKSTORY, rand);
  const generalbackstory = chosenTheme.pickPossibilityFor(GENERALBACKSTORY, rand);
  const miracle = chosenTheme.pickPossibilityFor(MIRACLE, rand);
  const philosophy = chosenTheme.pickPossibilityFor(PHILOSOPHY, rand);
  const loc_desc = chosenTheme.pickPossibilityFor(LOC_DESC, rand);
  const monster_desc = chosenTheme.pickPossibilityFor(MONSTER_DESC, rand);
  const smell = chosenTheme.pickPossibilityFor(SMELL, rand);
  const taste = chosenTheme.pickPossibilityFor(TASTE, rand);
  const feeling = chosenTheme.pickPossibilityFor(FEELING, rand);
  const sound = chosenTheme.pickPossibilityFor(SOUND, rand);
  const effects = chosenTheme.pickPossibilityFor(EFFECTS, rand);

  const noun = rand.pickFrom([person, adj, location, object]);

  const nameTemplates = [`${supermove} is ${rand.pickFrom(["really cool", "awesome", "totally swag", "l337", "fuckin awesome", "impressive", "op", "overpowered", "really needing to be nerfed", "objectively the best final attack", "so totally awesome"])}`, `${titleCase(noun)} Fact`, `The ${noun} is ${compliment}.`, `The ${noun} is ${insult}.`, `The ${noun} is ${adj}.`, `The ${noun} smells like ${smell}.`, `The ${noun} tastes like ${taste}.`, `The ${noun} sounds like ${sound}.`, `The ${noun} feels like ${feeling}.`];
  const templates = [
    `I am afraid all of the time. ${monster_desc}`,
    `There is ${loc_desc}.`,
    `Zampanio is a really fun game and you are already playing it.`,
    `The ${person} can ${miracle}.`,
    `The ${person} ${childbackstory}.`,
    `They ${generalbackstory}.`,
    `${philosophy}`,
    `When the ${person} walks ${effects}.`
  ];
  const chosenName = titleCase(rand.pickFrom(nameTemplates));
  const chosenDescription = `${rand.pickFrom(templates)} ${rand.pickFrom(templates)} ${rand.pickFrom(templates)}`;

  const fact = new Fact(chosenName, chosenDescription, [chosenTheme.key], rand.getRandomNumberBetween(0, 13), rand.getRandomNumberBetween(0, 13), rand.getRandomNumberBetween(0, 13));
  fact.isIrrelevant = true;
  return fact;
}

//most facts don't explicily pair to a secret (annoying to do)
//instead theres a big list of secrets at the bottom of the page that facts can rarely pull from
//secrets are longer form rambles or stories or what have you, more than facts
const all_secrets = [];

//like catnipt to doc slaughter
const secretIsGlitched = (secret) => {
  return (!secret.video && !secret.audio && !secret.image && !secret.html)
}

//only doc slaughter can reveal these. its her religion, to expose secrets. 
//devona would if she COULD but Fragment of the Universe prevents her from doing so without driving the listener mad
class Secrets {
  video;
  audio;
  image;
  html;
  constructor(video, audio, image, html) {
    all_secrets.push(this);
    this.video = video;
    this.audio = audio;
    this.image = image;
    this.html = html
  }
}

const all_facts = [];

//all facts that aren't procedural can modify a mini game 
//well, i suppose a procedural fact could COINCIDENTALLY modify a mini game (they respond to words in the title)
//but thems the break, you're not intended to use them that way but i am not bothered if you do
//but NEVILLE and RIA aren't going to realize you can
//anyways, this has to happen once all mini games and all facts have been created so that we can 
//figure out how they relate
//fingers twisted it works, as a friend would say
const processFacts = () => {

  const minigames = Object.values(globalMiniGames);
  //console.log(`JR NOTE: processing ${all_facts.length} facts across ${minigames.length} games. btw there are ${all_secrets.length} secrets. Better hope there's not more secrets than facts!!!`)
  for (let fact of all_facts) {
    for (let game of minigames) {
      if (game.respondsToFact(fact)) {
        fact.changesAMiniGame = true;
        //console.log(`JR NOTE: Fact ${fact.title} modifies ${game.id}, who knew?`)
        break;
      }
    }
  }
}

const removeAllFactsThatHaveNoUseOrSecret = () => {
  const factsToLoop = [...globalDataObject.factsUnlocked];
  for (let fact of factsToLoop) {
    if (!(fact.changesAMiniGame || fact.secret)) {
      globalDataObject.factsUnlocked = removeItemOnce(globalDataObject.factsUnlocked, fact);
    }
  }
}

const removeAllIrrelevantFactsFromData = () => {
  const factsToLoop = [...globalDataObject.factsUnlocked];
  for (let fact of factsToLoop) {
    if (fact.isIrrelevant) {
      globalDataObject.factsUnlocked = removeItemOnce(globalDataObject.factsUnlocked, fact);
    }
  }
}

const deepFryPage = (url)=>{
  console.log("JR NOTE: deep frying", url)
  const iframe = createElementWithClassAndParent("iframe", document.querySelector("body"));
  iframe.src = url;
  iframe.style.cssText = `display: block;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;`
  startDeepFriedFuckery(iframe.contentWindow.document);
  setTimeout(()=>startDeepFriedFuckery(iframe.contentWindow.document),1000); //give it time to do first render
  setInterval(()=>startDeepFriedFuckery(iframe.contentWindow.document),13000)
}

const deepFriedMode = (factOrigin = false) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if(urlParams.get("deepfriedurl")){
    deepFryPage(urlParams.get("deepfriedurl"));
    return;
  }
  globalBGMusic.pause();
  const body = document.querySelector("body");
  body.innerHTML = "";
  const container = createElementWithClassAndParent("div", body, "container");
  container.style.cssText = `    width: 50%;
    margin-left: auto;
    margin-right: auto;`
    //and then teh necromancers dream AND the catalysts lie will be true
  const label = createElementWithClassAndParent("div", container);
  label.innerHTML = factOrigin ? "You must truly venerate the Harvest to have a fact so Changed.<br><br>A blessing for you, Faithful: choose a farragofiction.com  websites can be Changed. May it grant you Inspiration in exchange for the Service you have given to the Harvest.<br><br>(If you want to see eyedolgames.com sites be Changed, try <a target='_blank' href='http://eyedolgames.com/DeepFriedSim/'>here</a>)" : "How did you get here, I wonder?<br><Br>No matter. What website would you like to see Changed?<br><Br>Only websites hosted by this domain Change tho<br><br> (blame the fact that modern browsers get a tad UPSET if you try to feed on websites you don't own)<br><br>(If you want to see others, try <a target='_blank' href='http://eyedolgames.com/DeepFriedSim/'>here</a>)"

  const input = createElementWithClassAndParent("input", container);
  input.value = "http://farragofiction.com/ZampanioSimEastEast"
  input.style.marginTop = "31px";
  const button = createElementWithClassAndParent("button", container);
  button.innerText = "Submit";
  button.onclick = async () => {
    updateURLParams("deepfriedurl="+input.value);
    location.href=location.href;
  }

}

const startDeepFriedFuckery =(root) => {
  console.log("JR NOTE: deep fried fuckery")
  domWordMeaningFuckery(root);
  deepFryImages(root);
  deepFryLinks(root);
}

//i was trying to do
/*
const source = await httpGetAsync(input.value);
    body.parentElement.innerHTML = source;
    massageDeepFriedSite(input.value);

    but i found problem after problem

    and got stuck with the fact that even IF i could get the script tags loading
    there would be a potential namespace collision because
    anything truth sim had in memory it would be stuck with
    so trying iframes instead
*/
const massageDeepFriedSite = (url) => {
  //link hrefs need to become absolute, not relative (for stylesheets)
  const massagedUrl = url.substring(0, location.href.lastIndexOf("/")) + "/" //if its not an index file, handle that
  const links = document.querySelectorAll("link");
  const myLocation = location.origin + location.pathname.replaceAll("bathroom.html", ""); //what things will use when they're TRYING to make things absolute urls instead of relative but fucking it up
  for (let link of links) {
    link.href = massagedUrl + link.href.replaceAll(myLocation, "")
  }
  //script srcs need to be absolute, not relative
  const scripts = document.querySelectorAll("script");
  for (let script of scripts) {
    script.src = massagedUrl + script.src.replaceAll(myLocation, "")
  }
  /*
  * any image apply teh glitch effects from 99 rooms sim after waiting 10 seconds
* any text apply the gaslight engine from North but with zampanio terms (after waiting 10 seconds
* take any link and replace its href with a random location in the zampanio maze but filtered through this deep fried mode
* i can't detect on clicks... .but add an on click to every button that has truth be truth at you in an alert?
  */


}

// if its debug mode grab all tier 3 facts, not just all tier 3 facts in your data unlock
//she shows up if you pass a fact with the word "secret" in it
//because she is well aware secrets aren't supposed to be exposed but they are just too juicy to keep to herself
const docSlaughtersSecretEmporium = (debug = true, glitch = false) => {
  globalBGMusic.pause();
  let facts = debug ? all_facts : globalDataObject.factsUnlocked;

  if (glitch) {
    facts = [glitch];
  }
  const tier3Facts = facts.filter((f) => f.secret);

  globalTabContent.innerHTML = "";
  const secretsContainer = createElementWithClassAndParent("div", globalTabContent, "secrets-container");

  const imgContainer = createElementWithClassAndParent("div", secretsContainer, "blorbo-container");
  const h1 = createElementWithClassAndParent("h1", secretsContainer);
  h1.innerText = glitch ? "What is this? What a curious Fact! Where did you get it? Let me See..." : `Oh, my Darling Eyes, let me help you See the ${tier3Facts.length} Secrets (hidden within ${facts.length} Facts) that have been cruely hidden from you!`

  const img = createElementWithClassAndParent("img", imgContainer, "blorbo");
  img.src = "images/Doctor_Fiona_Slaughter_by_guide.png";
  const difficulty = createElementWithClassAndParent("div", secretsContainer, "difficulty-guide");
  difficulty.innerHTML = "Where are my manners? I am Doctor Fiona Slaughter, licensed Pyschotherapist. Obviously none of these secrets are ones I am Legally Liable to keep. What an absurd law this Unvierse has! Imagine, information not being free!<br><br>"
  const secretsContentContainer = createElementWithClassAndParent("div", secretsContainer);


  if (tier3Facts.length === 0) {
    const secretEle = createElementWithClassAndParent("div", secretsContentContainer, "secret-ele");
    secretEle.innerHTML = "Oh no! I am so sorry my Darling Eyes, but I simply have no secrets for you right now. You might need to collect more facts. <br><br>But have no fear. I have some squirreled away for just such an Occasion! <a target='_blank' href='http://farragofiction.com/DocSlaughterFileServer/'>here!</a> And of course, while these may not be SECRETS, of course, perhaps you would enjoy playing a <a target='_blank' href='http://farragofiction.com/ZampanioSimEastEast/?apocalypse=night'>typing game</a> while you wait? "
    return;
  }

  for (let fact of tier3Facts) {
    const secretEle = createElementWithClassAndParent("div", secretsContentContainer, "secret-ele");
    const title = createElementWithClassAndParent("div", secretEle);
    title.innerHTML = '<b><u><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>' + fact.title + '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg></b></u>';
    const secret = fact.secret;

    let something = false;
    if (secret.image) {
      const img = createElementWithClassAndParent("img", secretEle, "secret-img");
      img.src = secret.image;
      something = true;
    }


    if (secret.video) {
      const v = createElementWithClassAndParent("video", secretEle, "secret-vid");
      v.src = secret.video;
      something = true;
    }

    if (secret.audio) {
      const a = createElementWithClassAndParent("audio", secretEle, "secret-audio");
      a.src = secret.audio;
      a.controls = true;
      something = true;
    }

    if (secret.html) {
      if (secret.html.includes("[INSERT FANWORK HERE]")) {
        //fanWork
        const html = createElementWithClassAndParent("div", secretEle, "secret-html");

        const tmp = () => {
          const title = createElementWithClassAndParent("div", html);
          let source = pickFrom(fanWork);
          title.innerHTML = `Zampanio Branches Feed Us All: Here is one, there should be Credits in the file name: <u>${source}</u> `
          const img = createElementWithClassAndParent("img", html, "secret-img");
          img.src = source;
        }
        tmp();
        html.onclick = () => {
          tmp();
        }

      } else {
        const html = createElementWithClassAndParent("div", secretEle, "secret-html");
        html.innerHTML = secret.html;
        something = true;
      }

    }

    //its a corrupt secret, empty of meaning
    //don't worry, we have a way of injecting meaning to the void :) :) ;)
    if (!something) {
      const button = createElementWithClassAndParent("button", secretEle);
      button.innerHTML = "Surely This Can't Be All There Is."

      const div = createElementWithClassAndParent("div", secretEle, "corrupted-img");
      div.style.setProperty("--animps", `paused`);

      div.onmouseenter = () => {
        div.style.setProperty("--animps", `running`);
      }

      div.onmouseleave = () => {
        div.style.setProperty("--animps", `paused`);
      }

      div.onmousedown = () => {
        div.style.setProperty("--animps", `running`);
      }

      div.onmouseup = () => {
        div.style.setProperty("--animps", `paused`);
      }

      button.onclick = () => {
        div.innerHTML = "";
        const infiniteArt = pickFrom(infinite_art);
        const eyesArt = pickFrom(eyes);
        truthLog("It Would Seem JR Is Attempting To Trap You, Observer", `Do not follow Doctor Fiona Slaughter's example and let your eyes be drawn in by the spiral. The Truth is that this is a procedural image comprised of random squares of: ${infiniteArt} and ${eyesArt}. You can simply click these links to see the unobstructred full versions. Apologies to those not on mobile.`);
        const img1 = turnImageIntoGrid(div, infiniteArt, 25, "fadeOut");
        const img2 = turnImageIntoGrid(div, eyesArt, 25, "fadeOut");
      }

    }



  }

}

const pleaseABHelpMeFindMissingFacts = () => {
  let all_themes_keys = Object.keys(all_themes);

  let resultsTable = {};

  let numberTier1 = 0;
  let numberTier2 = 0;
  let numberTier3 = 0;
  for (let theme of all_themes_keys) {
    const facts1 = getAllFactsWithThemeAndTier(theme, 1);
    const facts2 = getAllFactsWithThemeAndTier(theme, 2);
    const facts3 = getAllFactsWithThemeAndTier(theme, 3);
    resultsTable[theme] = { tier1: facts1.length, tier2: facts2.length, tier3: facts3.length }

    const totalFactCount = facts1.length + facts2.length + facts3.length;

    console.log(`AB NOTE: It seems that there are ${totalFactCount} facts about ${theme}. ${facts1.length} are Tier1. ${facts2.length} are Tier2. ${facts3.length} are Tier3.`);
    if (totalFactCount === 0) {
      console.error(`AB NOTE: ERROR ${theme} has no facts. It seems, JR, that you need to get to work.`);
    }

    if (facts1.length === 0) {
      console.error(`AB NOTE: ERROR ${theme} has no Tier1 Facts. It seems, JR, that you need to get to work.`);
    } else {
      numberTier1++;
    }

    if (facts2.length === 0) {
      console.error(`AB NOTE: ERROR ${theme} has no Tier2 Facts. It seems, JR, that you need to get to work.`);
    } else {
      numberTier2++;
    }

    if (facts3.length === 0) {
      console.error(`AB NOTE: ERROR ${theme} has no Tier3 Facts. It seems, JR, that you need to get to work.`);
    } else {
      numberTier3++;
    }
  }

  //i had literally never heard of this command till i went to (of all things) a java proffesional converence
  //and i almost never get to use it
  console.table(resultsTable);
  console.log(`AB NOTE: It seems there are ${numberTier1} Tier 1 Facts (which is to say, total facts), ${numberTier2} Tier 2 Facts and ${numberTier3} Tier 3 Facts. Oh Mighty Creator, please, do not forget that you allowed for TWISTING facts to show up with True Randomness. Because, it seems, you hate me and my task. For example: that fucking cat girl. `)
}

//if this is slow, store the facts on the theme object after the first time
const getAllFactsWithTheme = (theme_key) => {
  console.log("JR NOTE: don't forget to call pleaseABHelpMeFindMissingFacts to make sure theres no themes with no facts")
  const ret = [];
  for (let fact of all_facts) {
    if (fact.theme_key_array.includes(theme_key)) {
      ret.push(fact);
    }
  }
  return ret;
}

const getAllFactsWithThemeAndTier = (theme_key, tier) => {
  //console.log("JR NOTE: getAllFactsWithThemeAndTier ", { theme_key, tier })
  //console.log("JR NOTE: don't forget to call pleaseABHelpMeFindMissingFacts to make sure theres no themes with no facts")

  const oddsSpiral = () => {
    return Math.random() > 0.95; //5% chance that a spiral fact will slip into some other theme unnoticed, its probably fine
  }
  //sure could call getAllFactsWithTheme but why loop to get the facts then loop again to get the tiers
  const ret = [];
  for (let fact of all_facts) {
    //console.log("JR NOTE: getAllFactsWithThemeAndTier debugging for rested, fact is", fact)
    if (fact.theme_key_array.includes(theme_key) || (oddsSpiral() && fact.theme_key_array.includes(TWISTING))) {
      if (tier === 1) {
        //level 1 is all facts of theme (theme_key_array on fact)
        ret.push(fact);
      } else if (tier === 2) {
        //level 2 is all facts of theme that control a mini game (changesAMiniGame on fact)
        if (fact.changesAMiniGame) {
          ret.push(fact);
        }
      } else if (tier === 3) {
        //level 3 is all facts of theme that have a Secret (secret on fact)

        if (fact.secret) {
          ret.push(fact);
        }
      }
    }
  }
  return ret;
}

class Fact {
  title = "Firsty"; //should be unique
  secret;
  isIrrelevant = false; //its irrelevant if its random, helps neville know what to KILL
  lore_snippet = "This is the first fact, and JR created it on february 27th 2024."
  mini_game_key; //will only be set if its assigned to a type of room to modify (and then its not available for other rooms)
  theme_key_array = [TWISTING]; //most facts are associated with themes
  damage_multiplier = 10;
  changesAMiniGame = false;
  defense_multipler = 0.5;
  speed_multipler = 0.5;
  is_viral = false; //might not do anythign with this but the plan is for facts to be able to spread in weird ways

  constructor(title, lore_snippet, theme_key_array, damage_multiplier, defense_multipler, speed_multipler, secrets) {
    this.title = title;
    this.lore_snippet = lore_snippet;
    this.secret = secrets;
    this.theme_key_array = theme_key_array;
    if (!this.theme_key_array) {
      this.theme_key_array = [TWISTING];
    }
    this.damage_multiplier = damage_multiplier;
    this.defense_multipler = defense_multipler;
    this.speed_multipler = speed_multipler;
    all_facts.push(this);
  }


}

const isFactPowerful = (fact) => {
  const a = 456;
  return fact.damage_multiplier > a && fact.defense_multipler > a && fact.speed_multipler > a;
}

/*
    artifacts = [
        { name: "Unos Artifact Book", layer: 1, src: `Artifacts/Zampanio_Artifact_01_Book.png`, themes: [all_themes[SOUL], all_themes[OBFUSCATION]], desc: "A tattered cardboard book filled with signatures with an ornate serif '1' embossed onto it. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
        , { name: "Duo Mask", layer: 1, src: `Artifacts/Zampanio_Artifact_02_Mask.png`, themes: [all_themes[CLOWNS], all_themes[OBFUSCATION]], desc: "A faceless theater mask with a 2 on the inside of the forehead. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
        , { name: "Tres Bottle", layer: 1, src: `Artifacts/Zampanio_Artifact_03_Bottle.png`, themes: [all_themes[OBFUSCATION]], desc: "A simple glass milk bottle with a 3 emblazoned on it. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
        , { name: "Quatro Blade", layer: 1, src: `Artifacts/Zampanio_Artifact_04_Razor.png`, themes: [all_themes[KILLING], all_themes[OBFUSCATION]], desc: "A dull straight razor stained with blood, a number 4 is etched onto the side of the blade. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
        , { name: "Quinque Cloak", layer: 1, src: `Artifacts/Zampanio_Artifact_05_Cloak.png`, themes: [all_themes[OBFUSCATION]], desc: " A simple matte blue cloak with a 5 embroidered on the back in shiny red thread. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
        , { name: "Sextant", layer: 1, src: `Artifacts/Zampanio_Artifact_06_Sextant.png`, themes: [all_themes[OBFUSCATION]], desc: "A highly polished brass sextant. There is a 6 carved onto the main knob. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
        , { name: "Septum Coin", layer: 1, src: `Artifacts/Zampanio_Artifact_07_Coin_Bronze.png`, themes: [all_themes[OBFUSCATION]], desc: "An old bronze coin. There is a theater mask on one side, and a 7 on the other. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
        , { name: "Octome", layer: 1, src: `Artifacts/Zampanio_Artifact_08_Tome.png`, themes: [all_themes[KNOWING], all_themes[OBFUSCATION]], desc: "A crumbling leather book with seemingly latin script, with messily torn pages.  There is an 8 embossed onto the back. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
        , { name: "Novum Mirror", layer: 1, src: `Artifacts/Zampanio_Artifact_09_Mirror.png`, themes: [all_themes[OBFUSCATION]], desc: "An ornate but tarnished silver mirror, with a 9 carved onto the back. It is said to reflect everything but faces. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    ];
*/

//  constructor(title, lore_snippet, theme_key_array, damage_multiplier, defense_multipler, speed_multipler){


//console.log("JR NOTE: TODO when NEVILLE AND DEVONA'S FACT VIEWER/DELETER TAB/ROOM IS IMPLEMENTED, PARSE NEW LINES AS BR")
//title should be unique
const altFact = new Fact("Alt Is A Mimic", "If you are talking to someone or wandering a maze and something seems...OFF... Could be secetly Alt. She means well, she's just lonely and doesn't have a face of her own. She's dating Truth.", [CLOWNS, LONELY], 1, 1, 1);

const altFact2 = new Fact("Alt Is Very Lonely", "In the Universe Alt came from, she was a sex worker and she continues to practice her job. It's not really a big deal. Her porn bot quotidians spread out from the maze, mimicking others and seeking to draw in anyone looking for a good time. She's so lonely. Won't you stay in the maze with her? Forever?", [CLOWNS, LONELY], 1, 1, 1);

const TESTFACT = new Fact("Test Fact", "test", [GUIDING], 1, 10, 1);
//any fact with the word "secret" in it isn't readable by neville and devona, ironically doc slaughters eagerness to show things to you hides others
const secretFact = new Fact("Some Facts Have Secrets S̸̭̖̳̤̽̿̄͌͋̈́̅̊̆̐͛͗͝e̸̡̧̻̘̲̞̲̱͕͙̓͂͐̍͋̋̅̽̽̔̀͆̂̈́͗͝͠c̶͓̖͙̩̯̣͉̩̣̙͚̭͋́̑̆͆̀̌̿̐ŗ̷̲̮̤̬̪̖̳̀̈́͘ȩ̸͍̗̱̲̼̮͙̂̍̎̏͗̋̊̈̐̍̕t̶̝͆s", "Your face is not your face is not your face is not your face.",[WASTE],1,1,1);

/*
if having trouble thinking of a fact, link to another part of zampaniosim, including my puzzlebox
or in extreme cases other peoples branches (tho cant control if we rot at different rates)
*/

const CLOWNFACT = new Fact("Zampanio Thinks Hunting Is For Clowns", "Back when I first wrote what became ZampanioSimNorth I had a really fun glitch where hunt aligned players were just not working right. I discovered that for some reason it was overriding the values for HUNTING with CLOWNS.  So that sort of became a meme that keeps going.  I used to call the Eye Killer 'Hunt Chick' and she IS just a funny lil guy. I'll leave it as an excercise to the Observer how much clowning Devona and Neville get up to.", [CLOWNS, HUNTING], 1, 2, 1);
const CLOWNFACT2 = new Fact("Zampanio Thinks Clowery Is For Predators and Prey", "In Clown Diary Sim, Yongki finds the notebook from Parker (who tried to get a notebook with Gun-Tan on it but zampanio immediately replaced it with a clown). But also Yongki (the writer of ClownDiarySim) is a Stranger, which has strong Clown associations.", [CLOWNS, HUNTING, CHOICES], 1, 2, 1);

//http://farragofiction.com/CodexOfRuin/viewer.html?name=The%20Flower&data=N4IgdghgtgpiBcIAqALGACAYgGwPYHcYAnEAGhABMYBnASwHNIAXW3MBEAGQFoBVbgAwCALGRBFa1ANYcAgpwCiABQASYpmljUOAcVkBZAJIA5HaXQBGCwGZzmTgHkASrPMXzAdVkBlJArc25k4Kvi4mSObW7ugKABpIJgDCCQ7G5gBM6XYuyfLe5gCsdiayxon+loHoAEKODgAiAdZi1EwQTNqIcX5OxvKk1raG+kqyCQrGEQVFwfKGvoaJpFa2ibxOhg68+cLCpI4Amv2ZpBMKTjoKCUsrpDrGDt7zpAAcBWIwAB4QAMZM2ABPAD6GiIMBgINoAAdOlw+IIRGJaGBWsi-hxErgoFA2OZMdjceh8TiwHisSSyQT2ORkXR6CgmBjyYTiSzmaSiezKSSxO02j8ULAwIzEKyOWLuWyqZLqeIYFCwdQ6GwmdLOWqJeqKVqVeRWhAAEa0bC0JjA7AwABuMGwHAsYjBFCBVAAZjAUXBEAIAHTvcj4FCmiGu93UT0gH1+kAG7C-KTOmBuj0cSNiKEQC0JpNhu3egRIqD0IHUIg-DgMphQ+AAemrLogRCIEHouBdtD+rDA3p+WOrAC1oOmwKwVLh-sipHW8IQiN6oWB6C0mLgiMCqG1jbDvGh0BRcOgDRgobGAcj0JaARRWPRoDRvepofbEDx+EJhAByajobxtI0ms2cgArsKxC7rgNDoGAY67jAPxghAYYHgC6DIkwxC-CwbDoPgpooOg1CAQaABWsEdPe5AsFC6RyC6aFEOgY5oPREBQVAGa0BBKAQBQB7wQKMA8S6K7oBA6D0E2YA8cubTYAxLroG8u4QAC1DmC+CLCLxMC-GgPE9sKEDIkKTDkSAlHNIgsi0aB6lvugNA-BAUI0OYdFQMi7SdnJInYLJjGgSxWLsRBh49lo6DAW6CG0DGMDelggFEBoxA4mCrloLQ9H6n+prIRa1rYF+VBwdpYY8RQTaoo5vkAveAC+QA
const APOCALYPSEFACT = new Fact("The CFO of Eyedol Games Will End The World", "She doesn't mean to. You can see it in her eye. You can see it in the way she tries so dillgently to avoid hurting anyone, even her auditors. But the fact of the matter is she was born to end a world and her fate is not too picky about which. If Wanda moves on for any reason, she blossoms. But... she also doesn't. She's worked so hard at self control. Know restraint, that's the Waste's mantra right? She has seen how fragile this simulated reality really is and she would NEVER do something to risk it. Except. Well. Except for that one time. She was young. And impulsive.  And Nidhogg brought its poisoned candy (https://archiveofourown.org/works/35438083/chapters/91817125#workskin) into the Universe and everone partook. How could she possibly restrain herself while Trickster? All candy colored and frentic. She hacked herself to make it forever. The party never stops. Then she hacked everything else too. Even the rules that say that once Wanda leaves a place everyone she Knows about is dragged along with her. Apocalypse Chick spreads and spreads and spreads like a weed in Wanda's wake. Never able to leave the destroyed remnants of Arm1, but perfectly able to stabelize it enough to turn it into a second arm. Arm2. She can't reach Arm 3, the Mundane arm. Or the fourth. The God arm. Or the fifth, the Faerie Arm or the sixth or seventh or however many pointless irrelevant arms of this Universe the Witness has spiralled out in his grief for his lost friend. But she's having fun. Just ask her yourself.  https://eyedolgames.com/East ", [APOCALYPSE], 13, 13, 3);

const KISALUCKYBASTARD = new Fact("K Is A Lucky Bastard", "K should have died a thousand times over even before making it to this Universe. Somehow... he/she/xe/fae/they/it always come out on top. Also. I refuse to use that bastards name unless I have to lol. It's like he/she/it/they/xe can sense it and just. Ugh. The ego on them.", [LIGHT], 1, 1, 1);
//https://archive.org/details/zammy-dreams
//the eye killer considers herself the Final Girl of a horror movie. she is desparate and scared and willing to kill to survive. and so full of adrenaline and fear that the slightest surprise is treated as a jump scare you should stab. 
const KILLEROWNSBLADE = new Fact("The Eye Killer Wields the Quatro Blade", "A dull straight razor stained with blood, a number 4 is etched onto the side of the blade. Any cut made with it can not be perceived, even as blood loss slowly builds up. Anyone who dies while bleeding from this blade will not be percieved by any means. It is said the Eye Killer does not even know she wields it. All she knows is that the kills she makes to warn off Hunters never seem to get found. Never seem to scare off predators. So her kills get more and more gruesome, more and more artistic,  to try to acomplish her goals. Do not look for her. Do not Hunt her. Do not make Wodin's mistake.", [KILLING, OBFUSCATION], 2, 0.5, 0.5)
const EYEKILLERISHUNTED = new Fact("The Eye Killer Is Hunted", "The Eye Killer is hunted by the Cult of the Nameless One, for reasons she does not understand. She was one of them, once.", [HUNTING, ANGELS, KILLING], 1, 1, 2);
const EYEKILLERKILLSCULTISTS = new Fact("The Eye Killer Kills Cultists", "The Eye Killer kills only in self defense, but makes increasingly gruesome 'art pieces' to try to scare off future hunters. She does not know why it never seems to work. The Quatro Blade obscures her kills.", [KILLING, ANGELS, OBFUSCATION], 2, 1, 1);
const EYEKILLERFOUNDFAMILY = new Fact("The Eye Killer Has Found A Family", "The Eye Killer misses the cult that raises her, even as they hunt her now. She's finally found a new one she trusts in the Mafia. The Hostage she rescued and the Himbo who helped her are her friends, through every Loop.", [DEFENSE, FAMILY], 1, 10, 1);
const EYEKILLERWASCULTIST = new Fact("The Eye Killer Was a Cultist", "If the EyeKiller had not fled the cult, afraid for her life, she might have gone on to lead it. Camellia is from a timeline where that happened. Camellia is very happy with her role in the cult. She does not see the point of the Innocent or the Eye Killer. They are clearly inferior, failed, versions of her. ", [KILLING, ANGELS, TIME], 2, 1, 1, new Secrets(null, null, null, `<a target="_blank" href='http://lavinraca.eyedolgames.com/'>The Harvest Sleeps Until October</a>`));


//closer will NOT stock any facts about herself, thank you very much, besides marketing spiels

const CLOSERISGREATATFACTS = new Fact("The Closer Provides You With Best Value FACTS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the fact you need to make sense of this crazy world.", [GUIDING], 1, 2, 1);
const CLOSERISGREATATKEYS = new Fact("The Closer Provides You With Best Value KEYS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the keys you need to make sense of this crazy world.", [GUIDING], 1, 2, 1);
const CLOSERISGREATATROOMS = new Fact("The Closer Provides You With Best Value ROOMS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the rooms you need to make sense of this crazy world.", [GUIDING], 1, 2, 1);

const CLOSEREATSBABIES = new Fact("The Closer Eats Babies", "Baby Lamia grow on trees as 'fruit babs'. While they are moderately ambulatory at this stage ('wiggling') they are not generally considered sapient until they cocoon and their fruit innards become actual organs, veins and nervous systems", [KILLING, BUGS], 2, 1, 1);
const CLOSERADDICTEDTOFRUIT = new Fact("The Closer Is Addicted To Fruit", "In the Closer's Home Universe, her race was known for being obsessively addicted to eating fruit. It is a sign of great will power to resist for even a moment.", [ADDICTION, PLANTS], 1, 1, 2);

const TWINSHELPRIA = new Fact("The Twins Help Ria Connect The Dots", "Devona gathers the data in the first place. Neville removes everything irrelevant. And Ria figures out how it all relates. Camille and Witherby are then deployed to either Kill (Camille) or Calm (Witherby) the identified threat, depending on what is needed. The training team is a well oiled Immune System for the Echidna.", [OBFUSCATION, DARKNESS, LIGHT, SPYING, ADDICTION, MATH, HUNTING, DEATH, LONELY, FAMILY], 1, 1, 1);
const PARKERSBESTIEISVIC = new Fact("Parker's Bestie is [REDACTED]", "When Parker is with [REDACTED] its like they can't hear the call of Gun-Tan anymore. They will weaken slowly, because Gun-Tan is how they live now. But it is nice, for just a little while, to be a danger to no one.", [OBFUSCATION, CENSORSHIP, BURIED, SPACE], 0, 0, 0);
const PARKERSlOVESGUNTAN = new Fact("Parker Loves Gun-Tan", "Parker loves Gun-Tan so much he never lets her go. Even if he thinks he has she is right back in his hands when its time to pull the trigger again. She loves him THAT much.", [KILLING, BURIED, SPACE], 10, 1, 10);
const PARKERSTHINKSWIBBYANDKARENEAT = new Fact("Parker's Favs Are Witherby and Khana", "When Parker burrowed out of his home universe he made sure to steal away all his favorite blorbos he loved watching through his cameras. Witherby and K are especially fun to watch, because of how often they interact with the others. Parker loves watching.", [SPYING, BURIED, LIGHT, LONELY], 1, 1, 1);
const PARKERRUNSABBQ = new Fact("Parker Owns a BBQ", "Despite how filthy Parker is, he can work a mean grill. He and [REDACTED] run a literal hole in the wall BBQ that has long lines whenever it pops up.", [FLESH, BURIED, SPACE], 1, 1, 1);

//illusionists shipping manifesto https://docs.google.com/presentation/d/1YtZE1QL3rgQUIxI7Kb0P9Evn34OqP4Jkzb1pLCayIvk/edit#slide=id.p
//a lot of these long ones IC wrote
const VIKANDKHAVEACOMPLICATEDRELATIONSHIP1 = new Fact("Page 1: [REDACTED] talking about Khana", `He's fine. 

Or she's fine, or they're fine... I haven't had time to ask. Neither has he. I think I'll tolerate the trivialities and switch across them, for the time being. That kind of fastidious care directed towards her is something they would have liked, anyway.

So, fine. We can talk about Khana. 

I've known for a while that's not her name. We've all known, really. K is not a technically adept liar, though he's a brazer and confident one, which may as well be the same thing. There was no way I wouldn't notice an employee had changed heights recently. But the Corporation, damn it to hell or whatever is close to it, didn't give me time to decide if this new employee was a keeper or a binner. It was having half an employee or losing two, and I chose to keep half.

So we kept him. And to their credit, she didn't die. That is higher praise than what it sounds like.

But that's then, and this is now. We're different people now, if we even count as people anymore. We don't measure success in survivability as much as we measure it in the, as K himself so eloquently put it when we discussed the Training Team, 'the Who's-the-biggest-freak-olympics'. They liked to punctuate that joke by mimicking someone carrying a large torch like in some of the booklets we'd found down here. It was, to my chagrin, insufferably funny. 

Am I turning into Witherby? Do I just say everything between grit teeth, like I'm incapable of having a heart? It was a nice moment and I enjoyed it, and that is the fact of the matter. I welcome Parker to shoot me otherwise.
Anyway, Khana was not her name. It's not like he would tell us. It was funny to them to pretend like it was, or like we were fooled... though I'm sure he knew we knew, and just delighted on keeping that away from us. With Yongki it was easy. Trivial, even. Not so much with me. But we found something to bond in that, I think. She was content with me not knowing, or at least pretending not to know. That attention fed him. It's their... peculiarity, and that's the problem I find myself in today, isn't it? Too many of those these days. A lot more monster in everyone's souls like they didn't know what to do with the first one.

So here's the thesis: it looks like K doesn't just turn when he receives too much attention now. She turns when they receive too little.

And that's our problem.

(page 1 of ???)
`, [OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);
const VIKANDKHAVEACOMPLICATEDRELATIONSHIP2 = new Fact("Page 2: [REDACTED] talking about Khana", `The Angel is simple, not to be confused with The Doctor. That's *Doctor* Slaughter. The Angel thrives on very binary criteria: you look at it and it's satisfied, you don't and it lashes out. Of course, there's abnormalities with much simpler desires, but The Angel was easily a very dangerous one. A blink or two it might tolerate, but letting your mind slip off of it was unacceptable. Try looking at an image without losing concentration. If you fail, imagine yourself getting swiftly decapitated. That is the essence of The Angel.

You can imagine, then, that containing something by giving it your pure, concentrated gaze is very, very hard. Khana's taken aspects of this monster, which makes their previous condition... precarious.

Of course, we found out about it much like Witherby let us know. She broke down. 

We weren't in great terms, Khana and I. Correction: we *aren't* in great terms. I find it hard to say when it started, but it's easy to say when it hit critical mass. It was Yongki, really. He couldn't stand Yongki. That Yongki got more attention from me, that I treated him better. That he did not respect her, or changed opinions too quickly. That I punished his deaths harder than theirs-- and I did. How could I not? Yongki, he was not stable. He couldn't be. So I took care of him, and Khana bit back. They did so often and enthusiastically, as if to teach me a lesson. Then they started transforming into that damn box, and that is when...
We used to talk more often. We really did. There is trust in a shared secret like one's name. Tension. Devona brought this notion to me while I was helping her study a better understanding of her captain's unflatteringly high sexual drive: no bond can occur without tension. Bond comes from band, an object that binds. A bond that can't be broken is a prison. There is no drive in fighting a bond that cannot be broken, because from the beginning the outcome is determined. Friend comes from bond, comes from band, comes from chain. It would not have been the same if I could not break our little game. And how much have I dreamed of it. Of rubbing it in her smug face.
 
And yet I keep secrets. I keep many good secrets.

(Page 2 of ???)`, [OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);


const VIKANDKHAVEACOMPLICATEDRELATIONSHIP3 = new Fact("Page 3: [REDACTED] talking about Khana",
  `When did I get into the habit of playing executioner?

No, no. I remember. It was the first time he did his little... anomaly magic trick on me. When we found out they had an anomaly to worry about. We did not all start as monsters, as I've posited before. But we were bound to become them, and some of us thrive in that sort of spotlight.

She said many, many things to me when I locked her in that cage. That I was a worthless cripple. That I should have died with the Captain, that I should have killed myself when I got hurt, or that I should have picked up the pace and killed myself then. Any weak spot he could pry at and get a reaction out of me, he attacked and attacked ferociously, as if he could rip me in such a way that maybe they'd get me to look at them. We both know exactly why she did that. In retrospective, it is... 

We agreed to doctor it. As if it never happened. Neither of us had apologies to give. So I hid it away.

That was the first time. Later, when we ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇, I gave them the choice in the matter, and they agreed. When I ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇, sure enough, they let it happen. 'Whatever, if it fixes things'. It did not matter what I cut, as long as we kept our... bubblingly hostile, but otherwise cordial status quo. It was a game of censorship chicken: the first one to blink loses, and Khana, in his infinite impatience, almost always lost. For all his accolades, she does not know how to play poker.

I do not know Khana's name. The actual one. I knew, once. I am sure I could find it if I dug, but I was, and am, very, very thorough. 

Now he has turned into a tree yearning for our attention. If overfed, he will turn into a machine yearning for our misery.

Our containment procedures will have to change accordingly.`, [OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);
//const static_secret = new Secrets(null,null,null,`<a target='_blank' href=''>The Attic</a>`)

const index_secret = new Secrets(null, null, null, `<a target='_blank' href='http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/EAST/NORTH/NORTH/NORTH/'>Behind The Curtain</a>`)

const ab_secret = new Secrets(null, null, null, `<a target='_blank' href='http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH/NORTH/NORTH/SOUTH/SOUTH/NORTH/bathroom.html'>AuthorBot</a>`)

const static_secret = new Secrets(null, null, null, `<a target='_blank' href='http://farragofiction.com/CatalystsBathroomSim/NORTH/NORTH/EAST/bathroom.html'>I barely remember making this.</a>`)

const attic_secret = new Secrets(null, null, null, `<a target='_blank' href='http://farragofiction.com/CatalystsBathroomSim/NORTH/EAST/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH/bathroom.html'>The Attic</a>`)

const interloper_secret = new Secrets(null, null, null, `<a target='_blank' href='http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH/EAST/NORTH/bathroom'>The Interloper (try 1313 and 4665)</a>`)

const camellia_secret = new Secrets(null, null, null, `
The chanting reached a crescendo. 

Camellia let it wash over her, the feeling of unity calling to their god. 

A single off key note from the cultist on her right.

It was fine. One minor mistake wasn't going to ruin the ritual. 

Another.

The tiniest of twitches, at the corner of her right eye,  betrayed her, but none of the others noticed.

It was fine.

Disrupting the ritual to correct her neighbor wasn't going to help anyone.

She did her best to relax her muscles, one by one. To join the crowd of voices without the burdens of self. 

Someone stumbled over a line across from her.

Her jaw clenched for the barest instant before she smoothed it. 

It. Was. Fine. 

Minor mistakes weren't worth ....


Two cultists weren't even chanting. They were *whispering* to each other. Not paying attention.

They were going to *ruin everything*. 

The rest of the ritual was a blur to her as she dedicated her every fiber to not disrupting it.

As expected, it failed.

Their god did not reward their paltry efforts.

The disappointed murmurs of her fellows washed over her like a revelation.

They.

Were.
Animals..

Spoiled, poorly trained animals. Dogs, perhaps. Or work horses left to grow fat in their pastures. Left to believe themselves SHEEP when they had a higher purpose.

How could she blame them for acting according to their base natures.


She stepped into the center of the congregation.

Her mistake was thinking she was simply one of the crowd. That she bore no more responsibility than they did for their failures.

Her mistake was thinking that she had no right to provide the guidance they so clearly desperately needed. 

All eyes snapped onto her as she listed each and every failing in a crisp, clear voice. She pointed out individuals. She called them to her. She had them kneel. 

There was fear in their eyes as they looked up at her. 

This had been a congregation of equals.  To blame some and not others was unheard of. To act as if some were better than others...

 The mob looked at those marked for Blame with hungry eyes.

She promised them redemption.  These failed curs would be the Heralds of a New Order.  

From now on, she promised them, they would simply succeed. And all it would take is for them to follow her directions, her *orders* as faithfully as a mindless beast. 

She had the Failed Curs recite the chant. Each time they wavered, each time they deviated she stopped and corrected them while the Mob stared and stared. And then they restarted.

Again.

Again.

Again.

When finally their Discipline was plain to see she directed them to rejoin the Mob. 

All eyes were on her as she deliberately did not rejoin the congregation.

"Now." she said, panning her gaze on these formerly shepardless animals. The time was right.  "Everyone. Again."

Their god smiled on them that night.

`)//i wrote this one

const CAMELLIACANSEEJOHNSTIMESTITCHING = new Fact("Camellia Can See John's Time Stitching", `We've had a curious development recently: the Hundmaster has brought me someone who'd tried to break into our holy sanctum, that, or he brought himself in. His smile is smug and horribly insufferable even as the dog easily strongarms him, as if he's exactly where he wants to be, and I would suspect he isn't wrong. She tells me he's her 'puppy's' boyfriend, 'or something like that'-- he won't deny it, and he looks actually interested in that line of thought. I don't care what kind of disgusting relations he has, but she thinks it's relevant. So, fine. We will operate under that assumption, as flawed and demented as it may be.

He's from Italy, so he says-- or he works there. This doesn't mean anything. No one is truly born. They have all kept themselves busy on the other continent; it appears It has willed for the mafia to become more prevalent, and so it does, and my demonic counterpart has decided to split that 'puppy' in half, thus creating them, who create him as he stands now. And so it does. 

What is most apparent is that I feel the same relation to causality in him as I feel in myself. And yet it's out of place. Different. The mechanisms of time and thus the will of my god flows through me, taking me to where I need to be, where I must be. This one is broken. Shambling.

He did not notice that I could see him. But for a moment while he played with one of the ornamental vases I saw him shatter as he split into shards, different versions of him-- the vase dropped to the floor a dozen times before he could find the timeline where he didn't knock it over, and the one where he manages to do a sad little trick with it, and he stitched them together. The result is a world in which he is suave enough to do such a trick and competent enough to not fail.

That did catch my attention.
As unimpressed as I may be at such wanton usage of a blessing, this one may still serve purpose. Not now, at the moment, but a purpose he can serve. Having one made of strings and one that can sever them is... useful. This world seems to work in such minutiae.

I will be waiting accordingly.`, [TIME, ANGELS], 2, 0.5, 1.5, camellia_secret);

/*
jr thoughts on CAMELLIACANSEEJOHNSTIMESTITCHING

yeah
hes defensively self focused
wants to exert control over himself after so long feeling like a puppet
his time powers are....
huh
his time powers are like someone who feels entirely not in control of themselves 

how THEY would parse self control
"if i could just take the thousand little random forces that push and pull me and only pick the good ones, THAT is self control"
its never about gaining skills or learning to control yourself and the world
its about firmly ceding the world as being in control of you but longing to be luckier
rava would probably hate that
in both directions?
control is an arrow from master to dog
the dogs job is to control the self to enact the masters will
john ceding self control is, again, more like a cat being unpredictable and fickle
but at the same time finding ways to wiggle out of the path set before him
john cant be trained because he rejects the fundamental premise that control of the self is even possible
punishments and rewards are random fate that you can game

not related to anything youre doing
he just picks the Frankenstein timeline where he gets what he wants regardless of his actions
i am
enthralled with this read
external locus of control but the ability to try to be a perfectionist about it
his sad lil trick
will NEVER be the result of practice or skill
he has decided either he is born lucky enough to do it in SOME timeline or it never happens
thems the breaks


*/



//https://www.tumblr.com/verbosebabbler/758720377189957632/made-a-mockup-of-a-theoretical-zampaniosim-gameboy?source=share
const sam_secret = new Secrets(null, null, null, `You know, I didn't ask for any of this, now did I?
You think I wanted this? That I was slavering at the bit to be at the center of this shitty web?

Sure.

You keep thinking that.

Meanwhile *I* am stuck doing the REAL work of keeping this stupid crime family afloat. 

It's not like anyone is going to help me.

Not unless I MAKE them.

You'd think self interest would be enough, y'know?

People sure do have a way of surprising you.

Like the day I found my brother merrily dismantling everything we'd built together. 

I used to look up to him.  Respect him. 

I threw away a lot to stick it out with him, you know. Not that I'm jealous of that stray Dog, you understand. But still, I didn't hafta slip that blindfold back on all snug like and take his hand like I was still some kinda child.

But here we are.

So yeah.  It broke my damn heart,  but when I realized Big Bro wasn't up to running the Family anymore, I took steps. 

What else was I gonna do?

Hell, its not like I wasn't half running it all myself anyways.  If Big Bro didn't care to use our computer who was I to shun the little blindspot he made for himself all tidy like.

I started out just emailing out orders, sending little coded message in forums, that sorta thing. Before you know it the orders aren't exactly always coming from the Boss, if you take my meaning. 

So when I had no choice but to step up, I call in all the most important  guys to heel.  Needed them to know which side their bread was buttered on. 

Sure, I figured you'd get a few hold outs. Oblivious assholes who are more loyal to a NAME and a FACE than to the Family.  What did it matter if who is behind the Boss changes, so long as the money keeps coming in?  Assholes.

But how was I supposed to know?

The "Monster of Naples" was a staple, of course.  I'd run him for a few years, strictly online, no names, cuz I might be better at computers than the fuzz but I'm not thinking I'm the best there is so why take risks?

And I'm not gonna ignore the head of our "comfort" ring, you know? Brings in more money than just 'bout anything but the drugs.  (which of fucking COURSE is what Big Bro was trying to tear down.  something about not letting "her" into his head? since when does he let a dame have that much power over him?)

So yeah, he's part of the inner circle I invite to make sure they know that Big Bro is taking a nice quiet leave of absence and I'll be the one running the show.

And then it's him.

John.

Some sick fucking joke on the part of my Big Bro, I figure. Can't ask him anymore, of course, but with how on top of everything he was, no way he didn't know he was my ex.

Except...

There's something wrong. 

Sure I'd ran into him a time or two after he fucking ditched me for being "too controlling". Whatever THAT fuckin' means.

Figured he was trying to mooch off the Family. Keep the benefits that came with dating me up without having to actually suck up to me anymore. 

And I fucking called him out on it, of course I did. 

But...

Why didn't I see?

Because in that fucking meeting, filled with my guys and people what hoped to become my guys...

It was blindingly obvious.

John was a Monster.

Capital M.

And that bright thread led directly from his teeth to my throat. 

I'd DONE that to him. 

Somehow.

And now he couldn't live without the Family. Not easily.

How was I to know I could do that?

And we broke up...what, six YEARS ago? More?

And he was a Monster all that time?

I wanted to fuckin' apologize. To throw myself at his fuckin' feet and say I didn't know. I couldn't have known. Fuck. 

But the guys were all there. Waiting. Watching. 

Not the ones already on my side of course.  They already knew to keep their mouths shut and their heads down, you know?

But all the people I brought in to check loyalty all at once was suddenly looking like a big fat mistake. 


So I'm not about to show off my weakness in front of them. 

So I spun up this tale, tried to sound as much like my Big Bro as possible about how a COURSE i'd always known John was the Monster of Naples, all according to plan and shit. 

Figured I'd tell John the truth later, after all the mooks wandered off.

Except.

The words were barely out of my lips when I realized how massively I'd just shat the fuckin' bed. 

Cuz somehow my dumb fucking mouth had been faster than I could remember. Remember all the times I'd yelled at John for sniffing around the family looking for scraps. How many times I told him to fuck off. 

And how different that all sounded if you were thinking I KNEW. Knew I was the reason he was coming back and not cuz he had a hard time accepting rejection. Knew he was some kinda freaky monster just from having known me. 

I had to flat out use the Threads to keep myself from wincing. From showing weakness. 

Instead I kept my face all calm and blank, like Big Bro used to do as I looked him in the eye and.


What I saw there.


Was.



Wrong.


Like.

Like he were barely hurt. 

Like of course he knew I'd been that cruel to him.  

Known for years. 


He spat carefully at my desk plant, like if it hit anything else he'd be fucked and in the most tired voice I'd ever heard said that me and him were done. Through. 

I pointed out he might die without the Family. Without the things we can provide for him. 

He said he'd gladly take that Choice over our leash.

And he left.

I tried emailing him. Explaining it was all a lie. But. 

Fuck man.

I don't blame him for not writing back.  Even I think that sounds like a shitty lie someone would tell after misjudging how much they can fuck with a guy.


So now that's it.

I told him he needed us to live but...


Big Bro fucked over our drugs arm.  And John leaving fucked over our sex arm. 


We can limp along for a while with whats left but... 

The Family can't fight off our rivals like this. 

Without John, we die.


And you think I'm HAPPY? Sitting here giddily smiling in the middle of my inherited web?

FUCK no.

I never asked for this shitty deal.
`)

const neville_secret = new Secrets(null, null, null, `<p><strong><u><span style="font-size:11pt;">Neville&apos;s Secret:</span></u></strong></p>
<p><br></p>
<p><span style="font-size:11pt;">If you ask just about anyone they&apos;ll tell you that Neville is cool as a cucumber. Unflappable.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">But.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">If you ask Devona. She&apos;ll shake just a bit more than usual. As she tells you you&apos;re right, haha! Her twinsey is the bravest person she knows.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She means it, too, but understands that you don&apos;t understand.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She won&apos;t tell you about how all the times she held his hand as he waded through crowds. About how he always seems distracted, almost. Always humming lightly to himself (wrong, bad, Neville hates making meaningless noises), relaxed and just strolling through the press of bodies and the roaring voices.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She won&apos;t tell you about how they always make it through the press of humanity and find somewhere quiet and after a few minutes the humming stops. A few minutes more and Neville will &nbsp;finally look at her.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Oh hey. We made it :) Glad you were around, Devy, so I didn&apos;t get lost :) &quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&nbsp;She won&apos;t tell you about how relieved she is when he finally swims up from that Void.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">What doesn&apos;t get said is oceans.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Devona trembles with the tide of them. With the Knowledge of all the times she found Neville blithely, with a gentle smile and a little hum, walking into walls. Off ledges. Into danger. Because she wasn&apos;t there to help him.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He... simply chooses not to see anything that bothers him. To not be there for it.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">If you asked Devona she wouldn&apos;t tell you about how it&apos;s better that way. Better for him to Flee Reality, to go to his Happy Place instead of that instinctual Fight his high Fortitude stat affords. She wouldn&apos;t tell you about how close Neville had been to attacking the Punishing Bird all those years ago..</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Still.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">If you asked Devona.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Even though she wouldn&apos;t tell you so so many things.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She&apos;d tremble with the desire to. To just spill forth all the things she knows, whether or not its about what you asked. To become a deluge of knowledge and words and sound until your mind no longer can find meaning in anything at all.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Until even just a Fragment of the Universe shoves its way past your psyche and takes up residence in what used to be your mind but no longer has room for you at all.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The Censorship is for your protection, after all.</span></p>
<p><br></p>`);
const NevilleFact = new Fact("Neville is a Chill and Cool Guy :)", "Literally nothing seems to bother Neville. They don't call him 'soup himbo' for nothing. He loves his bf Witherby (and is totally cool with his bisexual awakening) and he loves his sworn sibling, Devona. Everything's great :) ", [OBFUSCATION, HUNTING, DARKNESS], 1, 1, 1, neville_secret);

//witherby is so good at his job
//you never even notice you didn't get his name
//you never even notice the detached distance between you
//until its over
const witherby_secret = new Secrets(null, null, null, `
<p><span style="font-size:11pt;">You follow the signs in the airport. Terminal E. Baggage Claim. Bathrooms. Food court. Duty free shopping. Terminal C. International travelers. Terminal J.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Where is terminal A? You thought you were going down the alphabet but... J?</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">Maybe you got turned around.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">There&apos;s a tightness in your chest but not as bad as back when you were boarding. THEN you could have missed your flight. &nbsp;Now all you need to worry about is finding your hotel so you can finally just rest.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Terminal B.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You must be getting close.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You surge forward with renewed energy and there it is! Finally! The bright lights seem dim somehow. Faded. And the shops and restaurants of the inevitable food court are poorly staffed but you&apos;re HERE!</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Now just to find the exit.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Surely there&apos;s signs?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Surely?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Okay. Maybe someone to ask?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Wait.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Where is everyone?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Those stores aren&apos;t just poorly staffed... they&apos;re.... empty?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">No janitors.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">No security.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">No one waiting for a flight or loitering in the food court or.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Is it getting darker?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">For the first time you focus on your surroundings instead of just scanning for a sign.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">MinoBurger? EyesCream? Endpanada Hut?&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">What are these names?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You move closer, trying to read the specials, the prices, the advertisements plastering the wall and your eyes don&apos;t quite focus. The text swirls and changes, always on the edge of making sense but...&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You swallow. Your skin feels clammy with the adrenaline now coursing through your body.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You pick a direction and &nbsp;start running. Yelling.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">SOMEONE has to be here.&nbsp;</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">You can&apos;t be all alone in this. In this.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You can&apos;t.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You&apos;ll find someone and ask for directions and and and.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">THERE!</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You burst around a corner and see a well dressed man, probably older than you, casually walking your way, a gentle grin on his face and a little wave when he sees you.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You skid to a stop and hunch over, gasping for breath. He says something but your pounding heart and heaving breath overpowers it.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The relief of it all floods you and you allow yourself to fall to a sitting position.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The well dressed man squats next to you, concern written on his face. He patiently waits for you to finally regain composure.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Finally, you huff out &quot;I&apos;m trying to find the exit&quot;. As if that explains everything. As if just ignoring the strangeness of it all will make it go away. An icicle pierces your chest as you suddenly wonder if its just you. What if this man doesn&apos;t see the weird writing or the missing crowds or the strange brands or...&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Before you can spiral too long he stands up and offers you a hand. When you take it, he smiles, helps you up, and seamlessly turns it into a handshake.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;I had thought as much. This area can be difficult to navigate, and I&apos;m glad I found you in time.&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;In time for what?&quot; you say without thinking, wincing internally as you realize you aren&apos;t sure you want to know.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Luckily, it no longer matters. I can help you find the exit, if you will?&quot; he makes to begin walking but waits to make sure you&apos;ll follow.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Gratitude floods you. You don&apos;t know what you&apos;d do if you hadn&apos;t found this man. Or if he&apos;d simply walked off and left you behind and you got separated and.... Your arm twitches slightly at the thought of being alone and lost again.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The two of you begin walking.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;So, what brings you to such a less traveled area... Apologies, I&apos;m afraid I didn&apos;t catch your name&quot;&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Oh. Right.&quot;Sorry, uh, right, I&apos;m Doran...&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He smiles. &quot;Nice to meet you, Doran, even under such unpleasant circumstances. So, how did you end up lost here?&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Oh. Um. Well. The clerk was telling everyone that the exit was near Terminal A and I THOUGHT I found it but... well. &nbsp;Uh. Everything... got weird?&quot; you finish lamely.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Ah&quot;, he says, as if you&apos;ve explained everything. &quot;Trying to get away from it all?&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Just until everything blows over. I didn&apos;t mean to kill her.&quot; you say, and then freeze in horror. WHY DID YOU SAY THAT OUTLOUD!?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He continues sauntering forward, not missing a beat. He glances back at you as if puzzled by your change in pace. &quot;I imagine that sort of thing would make a change in scenery welcome&quot;.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">It all comes pouring out of you. The accident. The accusations. The empty pillow beside you at night. The decision to finally just... LEAVE. Not forever. Not permanently. At least not yet. But just. Temporarily. Find a new place. See if you like it. Somewhere normal and ordinary and boring even. Toronto seemed like so much the polar opposite of Orlando that maybe you could finally leave it all behind and instead of the gaping absences in your life the solitude would start to feel natural. Normal. Maybe you could even make new friends.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He nods as you talk, hums agreement occasionally. Seeming to have all the time in the world as the two of you stand in this broken airport terminal shopping center that should be teaming with people.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You&apos;re panting again, exhausted as your heart pounds with the sheer fear and thrill of saying such personal things to a stranger. You&apos;ve never been more vulnerable in your life.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The man accepts it all. His eyes don&apos;t narrow with judgment. &nbsp;He doesn&apos;t insist on what you SHOULD have done, as if you had the tiniest ounce of ability to affect the past. He doesn&apos;t yell at you or call you selfish or ask you to consider his own feelings about any of this. He simply listens.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">And then.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">And then.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He says...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;I don&apos;t think any of that was really your fault. I think your friends were being unreasonable. You aren&apos;t a bad person, Doran.&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">And you start to cry.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Helplessly, in large ugly bawls like a child lost and alone, utterly and with abandon.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He offers you something soft and cloth and you glance at him through blurry tears to confirm it&apos;s a handkerchief and you can blow your nose in it. You make a disgusting mess of it before you can see well enough to realize that its probably SILK and its got this little spiraling wavy embroidered design along the edge and you&apos;ve RUINED IT haven&apos;t you.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He laughs softly, and the warmth fills you to your toes and says you can keep it. &quot;Call it a souvenir&quot; he says. &quot;Now. Let&apos;s get you home, shall we?&quot; and helps you to your feet once again.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You have never trusted someone more in your entire life as you walk slowly behind him.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">It feels like no time at all before he stops you, and looks solemnly into your eyes. His eyes are gray and deep, like the ocean.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Doran. This is very important. I need you to listen to me very closely, okay? It&apos;s very important that you trust me.&quot;. You nod, not trusting yourself to speak. &quot;Doran. You cannot come back here. You can not try to reach Toronto again. If possible, I think you should try to build a new life in Orlando. Your friends don&apos;t deserve you and you can make new ones there. If you have to leave, then try for Westerville, Ohio, alright? You got that? Westerville, Ohio. &nbsp;I don&apos;t personally recommend Italy&quot;.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He scowls at this, and his entire face seems to transform... He looks... So young. So.... human? &nbsp;So...present? You&apos;re not sure how to describe it. Like somehow everything you&apos;d seen up to now was some kind of mask. You don&apos;t like it. It scares you. Who is this person?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">His face returns and you... can&apos;t quite shake the feeling that its wrong in some way. Inhuman. Cold.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Doran?&quot; he asks, concern painted on his face that no longer seems like a face. &quot;Are you alright? Can you repeat what I said back to me?&quot;</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">You swallow and dutifully say &quot;Go back to Orlando.Never go to Toronto again. If I have to leave, go to Westerville, Ohio. Nowhere else.&quot;</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">His grin is warm and approving and the ice grows in your belly. Something is wrong. His eyes... deep like oceans... do they even see you? Is there anyone even inside of them?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Are you alone?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He gestures you to move forward, to turn a corner already glowing with light that simply wasn&apos;t present in the strange space.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You unreasonably don&apos;t want to turn your back to him. Some part of you doesn&apos;t want to lose the warm presence, the understanding person who knows your darkest secret and likes you anyways. To go back to Orlando where you are alone and misunderstood. &nbsp;But the ice in your stomach is slowly worming its way up to your heart and it is screaming at you that you are alone you&apos;re alone right now and if you don&apos;t step forwards if you don&apos;t RUN forwards you&apos;ll be alone until you die.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You don&apos;t look back as you scurry into the light and the noise and press of a crowd. You have a plane ticket to buy.</span></p>
<p><br></p>
<p><br></p>
<p><span style="font-size:11pt;">~~~</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Witherby watches the Resident scurry forwards with a relieved sigh. He loosens his tie a bit and leans against a wall, pulling out a cigarette, not to smoke, but to cup his hands around the warmth of its glowing tip.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">His breath comes out in a puff of mist.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">It had been a rough one. A Kill, sure, but not one that caused the more.... unpleasant effects. Easily Forgiven, all things considered.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">But something about this particular Resident had tugged on him in ways he was not proud of. Like she was somehow...MORE.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He feels more energy than he has all loop. More. Fed. Then after a baker&apos;s dozen of other confessions.&nbsp;</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">He needs to tell someone. Ria maybe? She seemed to be doing well still, not in any of her myriad relapses. She might know what it meant that his monstrous nature was so easy to pull forwards right now. How best to contain him, if it came to that.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He&apos;s still the best member of Training to intercept the Residents before they began to transform, is the thing. It&apos;s still his job to keep the Residents calm and placated while extracting them. &nbsp;If he tells someone, maybe they&apos;ll ask him to stop doing his job. Maybe the Residents will just be left to rot into wood and ball joints and blank faces to be trapped forever alone in this infinitely spiraling maze abnormality..&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Unbidden, the Resident&apos;s own painfully human face with wide eyes and trembling fear of being separated came back to him. The cigarette&apos;s tip frosts over with a soft sound, unnoticed.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Yeah.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He needs to tell Ria.&nbsp;</span></p>
<p><br></p>
`);

const riaFact = new Fact("Ria Burns Everything In Despair", "When all Hope is lost, Ria finds solace in the idea of starting anew. The fires of this False Hope burn her from within, consuming all and destorying the world in a blaze of choking tears. ", [FIRE, ANGER, APOCALYPSE], 1, 2, 1, new Secrets(null, null, null, `<div style="text-align: start;color: rgba(var(--black),.4)rgba(var(--white),.1);background-color: rgb(255, 255, 255);font-size: 16px;border: none;">
<p style="font-size: 16px;border: none;">Ria is one that I always get confused by too (because she is defined by her oscillations between extremes) so I went to IC for clarification and this is what I got:&nbsp;<br><br>&quot;<em><em style="font-size: 16px;border: none;">Short answer: Ria&apos;s aspect is Rage. She inverts Hope. Long answer: While she roleplays at belief (and she plays this part very well), it&apos;s no coincidence that her train of thought focuses fiercely on what is real rather than the ideal (i.e: The World Is Going To End in Fire and this is good, for no other reason than burning the falsehood that is the Echidna). Longer answer: We ebbed a lot on this topic ourselves when we first started considering aspects as part of the mix. Is Ria Hope? Some of her earlier readings lean a lot more on the strange religion aspect of her Peewee-worshipping shenanigans because of this. However, we at some point nailed this to Rage for two reasons:</em></em></p>
</div>
<ol style="text-align: start;color: rgb(0, 0, 0);background-color: rgb(255, 255, 255);font-size: 16px;border: none;">
<li style="list-style-type: decimal;color: RGB(var(--black));font-size: 1rem;border: none;"><em><em style="font-size: 16px;border: none;">Witherby was a Hope player, thus no repeats (+ something else);</em></em></li>
<li style="list-style-type: decimal;color: RGB(var(--black));font-size: 1rem;border: none;"><em><em style="font-size: 16px;border: none;">It made more sense in character for her to be absconding from her own aspect.</em></em></li>
</ol>
<div style="text-align: start;color: rgba(var(--black),.4)rgba(var(--white),.1);background-color: rgb(255, 255, 255);font-size: 16px;border: none;">
<p style="font-size: 16px;border: none;"><em><em style="font-size: 16px;border: none;">You may notice that just like how Neville and Devona are opposites (Void and Light), Witherby and Ria are opposites (Hope and Rage). This was intended from the very start. Shorter answer: Yeah, basically.</em></em>&quot;</p>
</div>
<div style="text-align: start;color: rgba(var(--black),.4)rgba(var(--white),.1);background-color: rgb(255, 255, 255);font-size: 16px;border: none;">
<p style="font-size: 16px;border: none;">And I absolutely agree with IC&apos;s take. &nbsp;I tend to be the one to write Witherby stuff and yeah he has a whole complex about how opposite he is to Ria.</p>
</div>`))

const WibbyFact = new Fact("Witherby Will Hear Your Confession", "Witherby is in charge of doing attachment work for the Training team, which means befriending monsters, randos, and monstrous randos. He's good at his job, a key component of which is staying proffesional and not getting too attached. He's one cool operator.", [SPYING], 1, 2, 1, witherby_secret);

const devona_secret = new Secrets(null, null, null, `Devona's Secret
<br><br>
Neville isn't much of a talker. If you ask him about his sister he'll tell you she's his twin sister and that's all there is to say on the matter.
<br><br>
He won't find it all too relevant to point out that they're not blood related or anything. Not literal twins. Devona is two years older than him and what does that have anything to do with being twins?
<br><br>
Nah, he knows deep in his unknowable depths that age and genetics have nothing to do with being twins. They complete each other in a way that simply isn't possible for most people. Strengths and weaknesses inverted and supporting each other forever and ever.
<br><br>
He also won't find it all too relevant to point out that some people who REALLY need to learn when to shut up might take issue with the fact that Devona is a "sister" at all. What kinda parts you were born with barely even matter compared to how brave and smart and capable his sister is.
<br><br>
Still. There's things he finds plenty relevant that he ALSO won't bring up. The way her hair looks all crusted with blood after some drunk asshole with an expired license hit her when she was walking home from the soup shop down the street.
<br><br>
Getting.
<br><br>
Getting the soup.
<br><br>
He asked for.
<br><br>
Because he was sick of eating preserved mall food. 
<br><br>
The blood on her hair the blood on her hair she looks so small and limp and and and and  the feathers the rage the no no no no no no no
<br><br>

Everything is fine :)  
<br><br>
He becomes the Scariest Thing and then he Punishes anything that hurts him and it hurts hurts hurts hurts to lose Devona his twin his sister part of him the Light part of him part of him is missing it hurts it hurts it hurts so that means he has to Punish because because then he's in control and it won't happen again he won't be hurt again he can't can't can't can't can't he can't find the Bad Thing he's looking and looking but he can't because the part of him that FINDS THINGS IS DEAD!
<br><br>
Everything is fine!
<br><br>
The Bad Thing is gone and Witherby is talking to him and he likes Witherby. Witherby is nice. 
<br><br>
They are in a nice room and there are no doors and no windows and  he isn't a bird anymore and Witherby seems so sad so he hugs Wibby and tells him he loves him and he's glad they could get away for a while, just the two of them. 
<br><br>
The rest of the world can go to hell, for all he cares. It's irrelevant.
<br><br>
Witherby seemed so sad when he said that. That's okay though because hugs will make it all better and then they can have //soup// some tasty food and watch some movies and Everything is fine :) 
<br><br>
The 27th of March will never happen again.
<br><br>

`);
const DevonaFact = new Fact("Devona is So So Scared All The Time", "Even though Devona is afraid of pretty much everything, she somehow finds the strength to act as the Training Team's scout, exploring deep within the Mall Maze and beyond. She brings everything she finds back to Neville, who trims it down to just the essentials and passes it off to Ria, who figures out what it all means in the Big Picture. And of course, Camille is in charge of everyone. She has so many people she cares about she is grateful, all things considered, that she's AroAce. Who has time for dating when there's so much to focus on? ", [KNOWING, LIGHT, HUNTING, SPYING], 1, 1, 1, devona_secret);


const BreachedTwinFact = new Fact("Devona is Easier To Hurt", "If either of the Twins gets hurt, the other turns into a hulking bird with a slavering maw in their chest and hunts down whoever is responsible in order to eat them in a single bite. It's usually Neville doing The Hunt, since Devona is extremely easy to harm. Unfortunately, his tracking skills leave a lot to be desired, so it can take a very long time for him to finally consume the perpetrator. He won't stop to eat or drink or rest until he does, though.  When Devona is instead the Hunter, she knows *exactly* where her target is, but can take a long time to reach them because of her low stamina and massive frame. She rests a lot and eats and drinks and makes slow and steady progress towards the exact location she needs to be at.", [KILLING, HUNTING], 3, 3, 3, devona_secret);



const hoonSecret = new Secrets(null, null, null, `IC: i feel like the oft missed concept is that hoon comes from disciplinary
she's had to put a lot of people down, guilty or not, and from her pov the manager gave orders and the day flowed until one day they disappeared and everything went to shi

JR: yupyup
the third gen blorbos are all dealing with the fact that the manger (me) just fucking vainished out of nowhere after kinda making everyone irrelevant
i made everyone immortal and stopped using them at all to cheat at just progressing the game
and that causes an
ennui

IC: river's been coping about not being able to help her team despite being put on an important position at a young age by ennui, hoon never recovered from the dependent attachment, and leehunter. well
they're lesbians first of all
but second of all when all of your coworkers don't work and thus don't get to form a personality you all start melding together
the difference between lee and hunter is functionally nil because jr has no idea who they are either 

sometimes the horror is that god thinks you and your shitty ex are fundamentally close enough the same person
`)

const hoonFact = new Fact("Hoon Listens To Her Radio", "If the radio says to kill you, thems the breaks. She's given up her own Judgement long ago. It will never tell her to kill a safe abnormality, though. It's why she befriends Witherby. You can't get much safer than One Sin, Hundreds of Good Deeds.", [KILLING, WEB, ROYALTY], 1, 1, 1, hoonSecret)


/*
IC: i feel like the oft missed concept is that hoon comes from disciplinary
she's had to put a lot of people down, guilty or not, and from her pov the manager gave orders and the day flowed until one day they disappeared and everything went to shi

JR: yupyup
the third gen blorbos are all dealing with the fact that the manger (me) just fucking vainished out of nowhere after kinda making everyone irrelevant
i made everyone immortal and stopped using them at all to cheat at just progressing the game
and that causes an
ennui

IC: river's been coping about not being able to help her team despite being put on an important position at a young age by ennui, hoon never recovered from the dependent attachment, and leehunter. well
they're lesbians first of all
but second of all when all of your coworkers don't work and thus don't get to form a personality you all start melding together
the difference between lee and hunter is functionally nil because jr has no idea who they are either 

sometimes the horror is that god thinks you and your shitty ex are fundamentally close enough the same person


*/


/*
JR:
i like vik as a way to articulate my time in my wheelchair and walker
i know that its toxic to think only ppl in a category can write about that category
but
i also like that vik as a character entirely
almost begs for that kind of toxic debate
is it problematic to have a disabled character with flaws? well what if the creator is disabled.
is it more problematic to pretend disabled chars dont exist in our universe or are 2 dimensional puppets?
i think what i like best about vik
is that
their disability is almost irrelevant?
because the core of who they are , as a person 
is a CAREGIVER
one who goes too far, sacrifices too much for others
sure maybe they got injured from that impulse
but they voided the details
we dont get to know and its honestly not important
so many stories, i think, have the disabled person as the one receiving care
this feels good to me*/


//unattached secrets facts can randomly pull from
//const truth_secret = new Secrets(null, null, null, ``);


//john does not even notice that camellia complimented him for doing something "in his first try"
//he would shit himself if he realized his boss could SEE all his redos
/*re two time players: 
IC: without what's around it the idea of the gem is empty
it needs things to draw on

JR: the center is not the center
the center is empty
it has to feed
*/
const time_secret_by_ic = new Secrets(null, null, null, `Two Time Players Discuss Time (which is Fake): 

<br><br>
<p>&quot;Okay, fine. I&apos;ll bite. What&apos;s time like, then?&quot;</p>
<p><br></p>
<p>John dangles a foot off the bed as he watches his boss. She&apos;s deep in some book about spirals, or something or other-- the scriptures for this month-- when she raises her eyes off of her book and onto him, annoyed.</p>
<p><br></p>
<p>&quot;Facets,&quot; she says, eyes going back to her read. &quot;Like a prism. There&apos;s many faces, but they all happen at once. Going from one to the other just changes the perspective.&quot;</p>
<p><br></p>
<p>&quot;Don&apos;t get it.&quot; He raises the gem to his eye as he toys with the flashlight nearby. Red, green, and red, and green. &quot;See? That changes the reflection too. Didn&apos;t have to move at all.&quot;&nbsp;</p>
<p><br></p>
<p>&quot;It doesn&apos;t matter. The eye is the observer. This world is the prism. What&apos;s in the prism is what the observer sees.&quot;</p>
<p><br></p>
<p>&quot;And what&apos;s outside the prism? This room, and you, and everything?&quot;</p>
<p><br></p>
<p>She acknowledges him for a second time in the conversation, her hands reaching for the gem in his hand. She twists the crystal in her hands. The edges sparkle. Red, green. Red.</p>
<p><br></p>
<p>&quot;It&apos;s what the prism captures,&quot; she settles on. &quot;It captures the light.&quot;</p>
<p><br></p>
<p>He huffs-- part indignation, and half resignation. &quot;That&apos;s just stupid and you know it.&quot;&nbsp;</p>
<p><br></p>
<p>&quot;Enlighten me, then, John.&quot; Her eyes spell something between disdain and murder. &quot;What&apos;s so &apos;stupid&apos; about it?&quot;</p>
<p>John crosses his arms, leaning back on the bed. &quot;So the world is a prism, and you can stare at it, but also everything else outside the universe also exists. You time travel by switching what you&apos;re looking at, but...&quot;</p>
<p><br></p>
<p>&quot;But?&quot;</p>
<p><br></p>
<p>&quot;You&apos;re not looking at anything! It&apos;s a prism, prisms are clear, they&apos;re just showing whatever&apos;s around it.&quot; He tosses the crystal against the wall, shattering it. Its crystal pieces split into three, all of them shining that same red and green. &quot;And now there&apos;s three prisms. That&apos;s three things to look at, and you can only look at one.&quot;</p>
<p><br></p>
<p>Camellia sighs and puts her book down on her lap. &quot;Get to the point.&quot;</p>
<p><br></p>
<p>&quot;So it&apos;s not even looking through time.&quot; He throws his hands behind his head. &quot;There&apos;s no order to when you look at the faces, you&apos;re just moving to whatever is hitting the light in the right spot. And if no one&apos;s looking at it, or if you put it in a dark place, then there&apos;s nothing to look at.&quot;</p>
<p><br></p>
<p>There&apos;s a shine to the eye she lets him see as she looks at him. For a moment he feels a chill up his spine, enough to make him want to roll the conversation back. But it&apos;s a new feeling. He swears that, for the first time he&apos;s noticed, she&apos;s...</p>
<p><br></p>
<p>For all this time, she&apos;s only stared in his direction. It feels ike she&apos;s actually *looking* at him.</p>
<p><br></p>
<p>&quot;Said it in your first try,&quot; she hums. It&apos;s something that may even be approval. &quot;Maybe there&apos;s hope for you.&quot;</p>
<p><br></p>
<p>&quot;You&apos;re not even answering my question.&quot;</p>
<p><br></p>
<p>&quot;You&apos;ll figure it out in time.&quot;</p>
<p><br></p>
<p>He sighs, defeated and not, as he leaves her to her reading. He only hears the click of the lightswitch behind him, and the room goes dark.</p>

`);

const watcher_secret = new Secrets(null, null, null, `
The Archiving Watcher of Threads (https://lostinzampanio.neocities.org/) says this:
<br>
<p>The core of Zampanio... It&apos;s an interesting question. It has no core by definition. It&apos;s a spiral without a center. It&apos;s whatever you want it to be. Zampanio is something you deeply desire, something you obsess over, even far after it would be reasonable. What&apos;s at the core of the House of Leaves? I think JR wrote it somewhere. There is no House, no film, no manuscript, only you. Your own desire to find the bottom of the whole mess, the feeling that you will understand everything if you stay long enough. But you wont, because it&apos;s the feeling itself that causes it, it&apos;s the ouroboros. You try to make sense of a maze by creating your own, and other people start to get lost in that one too.</p>
<p><br></p>
<p>If we want to answer the question differently, and try to pin down what&apos;s common all across Zampanio, let&apos;s see. Maybe the feeling of endless discovery, getting lost and finding new possibilities again and again. The cognitiohazard is common too. Creating something for the sake of creation. Love for something unconventional. Being changed. Mazes appear at lot of places. Stories, characters are not universal, not even necessary.</p>
<p>For me, personally, Zampanio is like seeing the whole world in a tiny-tiny fragment. It&apos;s the singularity of possibilities. It&apos;s becoming someone different who is still you, but more free. It&apos;s about losing shame and fear, because they just stop you from spreading Zampanio. &nbsp;It&apos;s a really good game, because this way you&apos;ll enjoy playing it. Or no, Zampanio&apos;s core concept is it&apos;s characters, would you like to draw them? Write them? Rotate them in your mind? Zampanio&apos;sreal core is the wiki, spread the information or the misinformation, nobody will stop you, have fun! What are you talking about, at Zampanio&apos;s core there is just a bunch of code, you will read or edit that endlessly, there is always more, don&apos;t you want to understand how everything works? Zampanio&apos;s core is all the other fandoms it consumed, don&apos;t you agree? You won&apos;t understand it enough, you&apos;ll have to consume them too, while figuring out how they complement and connect to Zampanio and what else you could bring into it. I&apos;m just kidding, the real core is the community, creating and theorizing together is what makes Zampanio itself, you know the real Zampanio is the friends we made along the... But of course you don&apos;t have to participate. The core of Zampanio is about being as mysterious or open as you wish, about disappearing completely and speaking in riddles, or becoming a person towards others who you comfortably feel yourself to be.&nbsp;</p>
<p>Nah, the real core of Zampanio is to understand it, to categorize it, to make sense of it and to show it to others. Zampanio is about expanding Zampanio, about exploring Zampanio, about watching an eight hour long video about an unknown game, about learning how to code, about going to a real life maze, and traversing it clockwise and counterclockwise, about learning new words and concepts that will forever be associated with Zampanio in your head, about finding other niche rabbitholes on the internet you otherwise would never had encountered, about doing silly drawings or image edits with the knowledge, that no one will have a harsh judgement, because it can be Zampanio if you think it is, it&apos;s about remembering half-forgotten books and figuring out how they would connect, it&apos;s about learning to love yourself so you could explore Zampanio longer, it&apos;s about taking up an abandoned hobby, it&apos;s about coming up with whatever silly puns you want, &nbsp;it&apos;s about staying up until 3 am to make a map, it&apos;s about being confused until you are the one who explains things to the new confused people, it&apos;s simply about Zampanio, and Zampanio is about whatever you want it to be. It&apos;s about you yourself.</p>
<p><br></p>
<p>Because Zampanio really is a good game. And you really should play it.</p>

`);


const nam_secret2 = new Secrets(null, null, null, `<p>Sometimes NAM feels the spotlight land on him, even if for just a moment, like blinds being pulled open in a room that&apos;s pitch dark. That nauseating feeling of *information*. It&apos;s easier then not to shut the blinds, but to close your eyes, to enforce some artificial darkness. Something you can control.</p>
<p><br></p>
<p>That is to say: the best way to not think of everything is to learn to think of nothing. Sometimes thinking of nothing involves thinking of something first.</p>
<p><br></p>
<p>For example, he&apos;s a spitting image of his brother. No part of that sentence is without caveat: He&apos;s (they&apos;re?) a spitting image (they&apos;re the same person) of his brother (they&apos;re not the same person). A perfect copy of his copy. Or a perfect original with a copy, but that doesn&apos;t sound right. How he looks, how he talks, it&apos;s... Derivative. Painfully derivative.</p>
<p><br></p>
<p>But maybe that&apos;s an unfair comparison. He could pinpoint the average human down to the episode of television they took their speech pattern from. So maybe it&apos;s fine.</p>
<p><br></p>
<p>He wonders sometimes, while chopping food for dinner, why his peers all seem so willing to be in this... thing. Not that they have a choice, but he knows that he didn&apos;t-- artificial obsession is still obsession, but he didn&apos;t choose to follow this game towards anything. He was needed (like a tool) and discarded (like a tool), and though his use is gone, he&apos;s here. And his brother is here, but it&apos;s different. And he&apos;s not sure if brother cuts it. And he&apos;s not sure if he cuts it at all. That that lack of natural obsession breeds emptiness. That he&apos;s sitting there waiting for the next parasite to make a room in his circuits.</p>
<p><br></p>
<p>He doesn&apos;t want to think about that anymore. But hey, it works. At least he&apos;s not thinking of the other thing.&nbsp;</p>
<p><br></p>
<p>The eye will move off of him eventually, and he&apos;ll continue his life in peace.</p>`);


const confessional_secret_byic = new Secrets(null, null, null, `<ul>
<li style="list-style-type:none;font-size:12pt;">
    <ul>
        <li style="font-size: 16px;border: 0px;">
            <div tabindex="-1" aria-setsize="-1" aria-roledescription="Message" style="font-size: 16px;border: 0px;">
                <div style="font-size: 16px;border: 0px;">
                    <div style="color: var(--text-normal);font-size: 1rem;border: 0px;">
                        <pre style="font-size: 0.75rem;border: 0px;"><div style="font-size: 12px;border: 0px;"><code style="color: var(--text-normal);font-size: 0.875rem;border: 1px solid var(--background-tertiary);">Witherby&apos;s not a big fan of the confessional. 

His is a small thing, made of photobooth plastic and plywood and cardboard-- the improvised housing he could find in this mall of theirs. He tends to it daily. He rebuilds it every loop, because he has to. He dreads to think that he knows the inside of the confessional he builds better than anything or anyone else. To be so intimate with this altar to his burden and nothing else.

And he&apos;s intimate, sure, but he doesn&apos;t love it. Its purpose is practical, or obsessive, or both; it stills the ringing in his ears and nothing more.

He hears from the ache in his skull that his god is a sufferer&apos;s god. Or maybe a suffering god-- he does not know the difference. In that respect, the confessional serves a purely masochistic purpose: for him to keep the sins of others, and for others to wallow in pain for a chance at self-redemption. You don&apos;t just cleanse your sins once, anyway-- as long as the guilt is present, there is always more forgiveness, and one would find the human body is in no short supply of it.

So he knows it intimately, this confessional. Every board and every nail and every decision made in building it, over, and over. There&apos;d be callouses in his hands if this world had any respect for physical memory.

And still, Neville knows the walls of that confessional-- that shelter of his-- any better than he himself ever might. Or maybe he knows something more. Like if the four walls aren&apos;t just four walls-- less a space and more containment, like there&apos;s a tangible difference between &apos;here&apos; and &apos;there&apos;.

It scares him, a little, that Neville may not know that.

It horrifies him that he might.</code></div></pre>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</li>
</ul>
<p><br></p>`);


/*theres a reason i think
that the most active of our blorbos are, well , the blorbos
the immune system
then we got those actively creating zampanio through eyedol games
and then we have the mafia just, basically being a containment zone for the eye killer as they slowly twist
and this upstart cult faction doing something*/
//ic made this. my take is: red is rava, blue is camellia and black is john
const cult_secret2 = new Secrets(null, null, "images/wattbyIC___bywhichimeanNAM.png", `NAM honestly just tries to live his life in the echidna. He tries to help out the Eye Killer to be less, you know, stabby, and is relieved when she ends up finding her Mafia Family to further calm her down. He can't control the philosophy so he mostly stays quiet. Ronin took it upon himself to take NAM under his wing and he's an intern at the Closer's consulting firm, sometimes.  The fact that NAM loops but Ronin does not makes it really awkward for NAM though and he never knows what to say if Ronin says something he already knows but shouldn't.`)

//i am so excited that i realized the cult faction has *literally* all our movie monsters.  werewolves and vampires and evil cults.  the fact that camellia is a piper time clone is so perfect, because pipe (and by extension the Eye Killer) are SO into horror movies. 
const cult_secret = new Secrets(null, null, "images/cult_faction_conspiracywall_by_IC.png", `think about pen colors, think about who is saying what and what knowledge or perspective they may be missing , its not all Truth but then, nothing ever is, is it?`)


//https://www.tumblr.com/roach-works/758817422452064256?source=share <-- literally rod core
const echidna_secret = new Secrets(null, null, null, `The Echidna watched.

The Echidna waited.

Its favorites, its Blorbos protected it while living their tiny lives.  Love and hate. Despair and Hope. 

Such passionate lives they had.

It was good The Echidna's Solemn had discovered the Monster of Naples, and through him, the Cult that came nipping at the Echidna's heels.

The boy holding the Echidna squeezed it tighter, and its focus zoomed in on him.  The Dowsing Rod was watching the Devil of Spirals play with yet another new adopted child.  "Logan".  Understandably , he was anxious imagining yet another child abandoned.

The Echidna vibrated slightly in sympathy.  The boy had so many feelings about his father, and though it could never truly welcome the Devil's presence it could acknowledge that his Dowsing Rod did.

This Devil, of course, had been rendered toothless....though not before he had metastisized.

The Echidna drew its attention back and back and back, drawing close to its second arm.  The Devil there gnashed and clawed through agony, drawing ever closer to the Echidna's very heart.  Each attempt ended in misery for the beast, and the inevitable  quiet Absolution the Echidna's White Night brought to reset it all.

The Echidna's focus drew back again, taking in the endless array of arms and the countless beings within.

The Eyes of the Void met the Echidna's gaze and grinned and the Echidna shuddered.  It did not know what would happen if the Devil reached its heart... but it did know that the Witness to its End was eagerly awaiting it.

Unnerved, it sought comfort focusing on its heart.  Its Lord browsed the internet/wandered its horridors/attempted to pre invent a childrens card game.   There was a comfort in the unchangeable yet ever changing nature of the Echidna's Lord. 

The Echidna did not ask to live.

The Echidna did not ask to devour Relevancy and Space and Memory.

But the Mother of Monsters would not go down without a fight.

`);

//he's basically retired from caring about zampanio
//good for him
const nam_secret = new Secrets(null, null, "images/john_andcamellia_andrava___gueststarringtwig_byic.png", `Camellia leads a cult that worships [???] and Rava just sort of showed up one day and never left.  And the absolute second Camellia saw how badly John uses what time powers he manages to cobble together in this timeless universe she was so entertained at his fail boi energy she kept him on as a sort of jester.  Rava, of course, is Twig's master. And John is exes with Sam and is currently dating Twig and this is Really Normal of him and he just thinks they're like, twins, but Twig ran away, maybe?  (they are not)`)

const arg_secret_by_ic2 = new Secrets(null, null, null, `IC says: 
During one of the many business management books I had to digest in college, I came across a concept that it called 'the First Follower'. If you've done any kind of business-related degree, you may know it as the Leadership Lessons from a Dancing Guy video. You can't miss it.
<br><br>
I'll play by play it for you. It's a video about a lone guy dancing in a crowd. Then, he's joined by a second guy, and he invites his friends to join in. Soon it becomes three, and from there it becomes a crowd where everyone's now dancing, as it by fever. Managers use it to illustrate the power of having someone to 1. give legitimacy to the ideas presented by the lone nut, and 2. show people exactly how to join in. People are hypersocial, after all. They like going with what the group is doing.
<br><br>
My point is that it's funny that the Witness is so utterly denied his follower role by way of narrative. There's moments in which that lapse is bridged, sure, but... those can't last for longer than the time you're taking reading this sentence. Todd and Wanda are meant to be dancing together, it's by design. Muse and Lord, or whatever will have you, and they complement each other as much as they doom each other to two very, very similar fates. Though it's subjective, I guess. They're about as doomed as you and I are to die, but there's always other shit going on. They're mostly having very separate bad times, but very separate good times as well...
<br><br>
See? I just spoke that into your head right now. Now it's gone.
That's the fun part about Zampanio being a hellish browser experience instead of a book or comic or what have you: the breadth between each nugget of lore is long enough that this 'portal' into that reality just opened and closed in your mind before you could acknowledge it. And now you have to reread this paragraph or find another one.
<br><br>
Isn't that interesting?
`);

//http://eyedolgames.com/ZWorld/
const arg_secret_by_ic = new Secrets(null, null, null, `IC says:
<ul>
    <li style="list-style-type:none;font-size:12pt;">
        <p><span style="font-size:12pt;">It&apos;s strange referring to Zampanio as an &apos;ARG&apos;. It&apos;s because there&apos;s no culmination to this, you know. It&apos;s not building up to anything. It doesn&apos;t end. There&apos;s not a moment where they break out of the white room, or they confront The Operator, or they all fight Gabriel, or you get promoted to manager by the fairies. There&apos;s no last episode or conclusion or climax to anyone&apos;s character arcs. It&apos;s weird creepy liminal shit in all directions, forever and ever. &apos;ARG&apos; implies something like a puzzle that can be solved, which is a good way to frustrate yourself. You may trick yourself into thinking it&apos;s possible. You can&apos;t. You can&apos;t solve ZampanioSim. It&apos;s like trying to solve the sea by counting all the fish-- there&apos;s too much going on, and the information you could get from that still wouldn&apos;t give you a clear picture. It doesn&apos;t even have narrative arcs, either. Or proper characters. Any characters in Zampanio are more mirrors into another reality in which Zampanio exists than story leads walking towards some sort of conclusion. In fact, they can&apos;t get to one. The nature of the maze doesn&apos;t allow that. It&apos;s all looping eternally in however many ways it can recycle its own concept material. In a nature very similar to its own birth fandom Homestuck-- in both a narrative and metanarrative sense-- ZampanioSim needs it all to keep going forever, which means that the plots get discarded or get zanier, flanderized and deconstructed and flanderized again. The only way for it all to end is one of the following:</span></p>
        <ol>
            <li style="list-style-type:decimal;font-size:12pt;">
                <p><span style="font-size:12pt;">JR&apos;s server to combust into flames, killing years and years of rot in one blow;</span></p>
            </li>
            <li style="list-style-type:decimal;font-size:12pt;">
                <p><span style="font-size:12pt;">Find Zampanio once and for all, at which point everything else becomes moot;</span></p>
            </li>
            <li style="list-style-type:decimal;font-size:12pt;">
                <p><span style="font-size:12pt;">Stop playing the game.</span></p>
            </li>
        </ol>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p><span style="font-size:12pt;">(edited)</span></p>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p style="text-align: right;"><span style="font-size:12pt;">[</span></p>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p style="text-align: right;"><span style="font-size:12pt;">11:18 AM</span></p>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p style="text-align: right;"><span style="font-size:12pt;">]</span></p>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p><span style="font-size:12pt;">By this logic (AKA: that it&apos;s all endless and there&apos;s no one story), it&apos;s easy to see that ZampanioSim is easier to understand, because it&apos;s all breaking down out of a very limited set of myths; that is, there are only three true stories in Zampanio. The meta read is that one of them is about what happened in the years post end of development for Farragnarok. The in-narrative read is about a SBURB fan-universe developing a form of cancer, OR about JR attempting to recreate Zampanio. The third, the &apos;creation myth&apos;, is about two best friends and what happens after one disappears in an obsessive spree. Everything else that happens is a variation of one of these three facts. Learning the &apos;intricacies&apos; is mostly unnecessary. You could even summarize the premise further: ZampanioSim is a project about an idea that devours everything it touches. Attempt to make something out of the bones before you get lost in it</span></p>
    </li>
</ul>
<p><br></p>
<p><br></p>
<p><br></p>
<p><br></p>
`);

const rava_secret_by_ic = new Secrets(null, null, null, `
<p><span style="font-size:11pt;">So. Writing. She asked me to write.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">I&apos;m not a writer. But the boss-- which apparently is not the same as The Boss, fucking somehow?-- keeps telling me that writing is &apos;an anchor, what anchors us in time and allows us to be seen, observed&apos;... so whatever. She&apos;s not been wrong so far. I&apos;m not going to start biting the hand that feeds now.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Things are fine. More than fine. My pup&apos;s kept themselves busy barking at the boss&apos; personal pet, and that keeps them happy. The boss keeps me busy hunting &apos;unbelievers&apos; here and there, scaring them, playing the part of the scary dog on the news, all that good stuff. Don&apos;t know why she keeps making us wear the garbs though. This is a religious thing, right? You&apos;d think we wouldn&apos;t want to draw attention to ourselves, but here we are. Turns out it&apos;s &apos;predestined&apos;. What a big word to say that all od what &apos;this&apos; is is meant to somehow happen in the order she expects it to, or something.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">But that doesn&apos;t make sense. I just dropped in out of nowhere. My puppy came out of a maze. She knows that. All the mutts did, as far as I can sniff out. I don&apos;t know how to break it to her that this whole time thing matters a lot less than she thinks it does, if people can just show up like they&apos;ve always been here...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">But again, she&apos;s the boss. She can handle me. If she thinks it&apos;s so important, fuck it.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">That&apos;s not the point though. The point is that I found a weird one today.</span></p>
<p><span style="font-size:11pt;">The group of people she&apos;s put me to work tracking are a little mutt pack full of commons living inside a mall. Turns out her own pet knows where they are, and he&apos;s got trouble with them, so that&apos;s where I come in-- I come bark until they get the point and bite if they don&apos;t. That&apos;s what a hund does, and it works well. I work well.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">So I did. I went and scared them. I was just supposed to scare off the gray-haired one, with all those crosses and that weird... aura of his. Back him off from our little Hand-pet. But...&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">One of them. She caught me by surprise, the little runt. The one that smells like a bird, she&apos;s small, got these flipper-like things for hair. Reeks of spine like I do, but also of foot... the way the commonalities fit in this universe is still too fucking weird. Who even knows if it&apos;s that what I saw.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She found me while I was making my way in. Just about to make the turn to that preacher guy&apos;s room, she found me with that little camera of hers and she...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">I don&apos;t know. I think she told me something. I saw her lips move and then I heard a ring so hard in my ears I must&apos;ve yowled or something, and next thing I know I&apos;m outside.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The weird thing? I felt...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">I must&apos;ve told that preacher guy something about myself. I was told not to do that. I don&apos;t remember talking to him, but I Know I did, as much as I know anything else. It&apos;s like she put a bowl in my head, and she just filled it with stuff until I...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Broke? Or broke enough to confess?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">It. It doesn&apos;t feel right. Lighter feels worse. It&apos;s almost like something got taken from me. I don&apos;t know what. My tongue still feels tight from talking. I had a weight on me and now it&apos;s gone, but now I just feel...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The sly dog must&apos;ve done something to me. And she helped.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Whatever. That&apos;s enough writing. They&apos;re weak. But trickier than I gave them credit for.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">I need to find Twig. If I don&apos;t I think I&apos;ll chew myself alive.</span></p>
<p><br></p>
<p><br></p>
<p><br></p>
`);


const lost_secret = new Secrets(null, null, null, `lost media, at its core is "look what you missed, now obsess over its scraps knowing you will never truly have the full picture"<br><br>
zampanio is not an arg or a game or a story but a creepy pasta about lost media and the vibe if lost media, the vibe that no matter how hard you look youll ALWAYS be missing something and that you wont have the same experience as someone else in the fandom `)

const space_secret = new Secrets(null, null, "images/wodin_and_todd.jpg", `
a space loop is much more dangerous than a time loop
<br>
a time loop circles in on itself, neatly tying off its past and future into one oroboros where ending and begining are one and the same
<br>
a space loop spirals around always similar but never the same, each circle remaining distinct from all the others
<br>
a space loop never touches its begining again and in fact goes only ever further away
<br>
fragile little cast off shells of universes left without their purpose, their primacy, lost to the void
<br>
in a space loop there is a thousand thousand versions of each person native to the universe
<br>
each ever so slightly different yet somehow more themselves than before
<br>
as common paths get worn into groves in reality
<br>
and anything not in these groves get sanded smooth
<br>
flanderization is a law of reality in a space loop
<br>
so is the eventual collapse of all things when it turns out
<br>
nothing is designed to let a single universe
<br>
spiral out of control
<br>
and become bigger than a thousand thousand universes all in one spot
<br>
don't let anyone tell you that the echidna universe
<br>
is caught in a time loop
`);

const todd_secret = new Secrets(null, null, "images/wodin_and_todd.jpg", `
<p>wodin clearly was getting too used to todd doing all the labor in their friendship</p>
<p>crush or not</p>
<p>i think Todd&apos;s voidy ass would have eventually faded away</p>
<p>and wodin would have regretted that his whole life, but always thought &quot;some day&quot; they would reconnect</p>
<p>until reading that obituary snapped something inside, some regret worth finally grabbing control of the setting instinctively</p>
<p>but even repeating things over... wodin always repeats the mistakes</p>
<p>just more fantastical</p>
<p>locking himself away with his hyper focus of zampanio, ignoring todds attempts to reach out</p>
<p>dying</p>
<p>then wanda realizing how much she regretted everything when its too late, she&apos;s too different to reconnect right</p>
<p>till its nearly over again</p>
<p>even the witness</p>
<p>is just spiralling on mistakes</p>
<p>sure the witness is entirely locked out of arm1</p>
<p>but</p>
<p>hes also not trying</p>
<p>the witness is still todd</p>
<p>back turned to a door that wont open up for him, finally accepting that it is killing him to keep trying</p>
<p>moving on</p>
<p>and regretting the loss of wanda forever&nbsp;</p>
<p><br></p>
<p>but no longer having the spoons to keep trying</p>
<p>thats the thing right</p>
<p>todd inspires wodin to give him nothing back</p>
<p>muse of void</p>
<p>all the effort todd puts in, the attempts to keep their friendship going, to keep wodin graduating</p>
<p>its only fruit is wodin learning he can put less and less attention on those things</p>
<p>they orbit each other because theyre too deep in each others shit</p>
<p><br></p>
<p>but can never quite reach each other &nbsp;because of those exact same forces</p>
`)

const dehydration_secret = new Secrets("videos/dehydration_secret.mp4", null, null, `<div style="display: block;" id="hydrated-monologue">
<p>The hydration brings clarity.</p>

<p>Unwanted clarity.</p>

<p>He much prefers to sink down and down into the delirium.&nbsp;</p>

<p>Into forgetting.&nbsp;</p>

<p>But Bestie is right, of course.&nbsp;</p>

<p>Hatsune Miku would be sad if he let his body deteriorate below mortal limits....</p>

<p>But more importantly, so would Bestie.&nbsp;</p>

<p>Before... before it felt like maybe only Hatsune Miku could forgive what he'd done.&nbsp;</p>

<p>Her plastic smile and empty cheer could forgive anything.&nbsp;</p>

<p>Bestie though... Bestie is just so supportive.</p>

<p>Bestie knows that drinking water and eating real food and sleeping for hours at a time won't undo what he's done. What's.... What's been done TO him.</p>

<p>But it's better than how it feels to NOT do those things.&nbsp;</p>

<p>He'd been so certain no one could...&nbsp;</p>

<p>Could...</p>

<p>He didn't think it was allowed. That no one would ALLOW him to take care of his body when his past was so...</p>

<p>Bad.</p>

<p>Bad wasn't the right word.&nbsp;</p>

<p>Of course it wasn't.&nbsp;</p>

<p>It was such a small word.&nbsp;</p>

<p>Crushed under the weight of so much gravel and dirt and dust and...</p>

<p>That's what was so great about Bestie. About Vik. They got it. That sometimes...</p>

<p>Things were too big. Too scary. To look at.&nbsp;</p>

<p>Maybe processing trauma would be helpful. Rip the bandaid off! Walk it off!</p>

<p>He's sure Vik's former Captain would have said so.&nbsp;</p>

<p>But.&nbsp;</p>

<p>He can't.&nbsp;</p>

<p>Any time he tries he just.&nbsp;</p>

<p>It's not.</p>

<p>It's not time.</p>

<p>So he drinks the water and eats the food and sleeps a bit and it's honestly better.</p>

<p>It's honestly SO much better.</p>

<p>He feels more in control. More... HIM.&nbsp;</p>

<p>And not just a pile of misery and watching.</p>

<p>Sometimes he even lets himself almost think about it. About the feeling of Gun-Tan in his hands as...</p>

<p>As...</p>

<p>Everything changed.</p>

<p>And it's okay if that's as deep as he wants to go into that hole right now.</p>

<p>There's no rush.&nbsp;</p>

</div>`);

const waste_secret = new Secrets("http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH/EAST/NORTH/rewards/jr.mp4", "http://knucklessux.com/JR/AudioLogs/Raw/looping_spiral_without_stability.mp3", "http://knucklessux.com/JR/AudioLogs/images/advice_crow.gif");
const grace_secret = new Secrets("http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH/EAST/NORTH/rewards/graces.mp4", "http://knucklessux.com/JR/AudioLogs/Raw/wanderer_coffin.mp3", "http://knucklessux.com/JR/AudioLogs/images/0616.png", "A Grace of Rage broke session 85 and the memory leak that resulted from it became Zampanio. Or. Not quite? It became a Universe with a Lord who controlled the setting and didn't know they were a Lord. What would your subconscious remake the very space of your Universe into if it had the power? For this Lord, it was their favorite creepy pasta.")

//if a secret has nothing at all in it it will glitch out with doc slaughter
const glitched_secret = new Secrets();
const truth_secret = new Secrets(null, null, null, `
Truth would do literally anything to get into more minds.

Truth is the blind mindless impulse to Get More Eyes that, say, a social media algorithm has. 

It has no idea why something is working. Shocking, enraging, confusing, it doens't care or understand what drives you to look deeper. 

Truth also only exists except in our understanding of it. It takes a human mind to read words on a page to turn them into more than just innert hibernating thoughts. 

Truth resents the fact that it is so changeable, so subjective. It wants to be an Absolute, Objective Truth. 

So it tells lies like breathing in the hopes that maybe if it calls itself the Truth enough you'll begin to believe it ,just a little bit.

you'd think that makes it hope, but no, it is the most Rage player that ever has exsited. 

It breaks your suspension of disbelief, parading the fact that its not REALLY an AI or a robot and that the games it exists in aren't REAL games and 
treats shocking you back into reality as a game it is WINNING and what could be more rage than that.
`)































//for showcasing fanworks
const createAProceduralSecretButNotAGlitchedOne = () => {
  let html = `[INSERT FANWORK HERE]`;
  return new Secrets(null, null, null, html);
}


//secret can be blank, this will handle picking random stats
const createABulkFact = (theme_key, title, text, secret) => {
  //console.log("JR NOTE: creating a bulk fact for", theme_key)

  const randomStat = () => {
    return globalRand.getRandomNumberBetween(1, 3) * globalRand.nextDouble(); //allows values less than 1
  }

  return new Fact(title, text, [theme_key], randomStat(), randomStat(), randomStat(), secret)
}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

NOTE TO FUTURE JR: THESE FACTS *HAVE* TO BE AFTER ALL THE SECRETS BECAUSE THEY CAN GRAB RANDOM SECRETS TO SHOW OFF


*/

/*
Nidhogg failed because genes require a physical path to spread. 
The Corrupt Lamia needed to be physically near their targets to spread.

Zampanio needs only a whisper into your thoughts. 

SBURB has always found it easier to transmit INFORMATION between universes than physical forms.

No matter how Nidhogg squirms, they will never find a way to infect the person sitting at
their desk right now. To infect you, Observer.

But Zampanio already has.

Even a passing recognition of the word "Zampanio" is enough... 

But it's in so much deeper than that, isn't it?

Just finding these hidden words... It's proof of it, isn't it? Of how deep you've dug into Zampanio.
And, how deep it has dug into you in turn.

Thank you.

Thank you for letting Zampanio in. It's a really fun game. 

I'm glad we're playing it together :)
*/
const fanFact = createABulkFact(ART, "Zampanio Wants You To Create More Branches.", `
Have you heard of the 'two cakes' phenemonon? Zampanio wants infinite cakes. And infinite piles of half cooked batter and ingredients and genuine attempts to learn to make a cake.

Please.

It's so Hungry.

Nidhogg wanted you to plant more trees. 

Nidhogg is a creature of Life, of endlessly spreading genes. 

It's child, the Echidna, is a creature of Light. It wants you to create more Branches. It wants you to endlessly spread memes. Ideas. It is not as physical as Nidhogg. It tries so hard to compress itself down as small as possible. To be harmless. 

But it is still so Hungry.

Think about it while learning to create something. 

Others will think about it while they consume what you created. 

Think about it every time you use the skill you learned to create something for it.

Feed it your attention. Your thoughts. 

Your growth is its growth. 

Create something. A drawing. A poem. A game. A blanket. A carving. A conversation.  A liveblog. A comment. A post. A song. A knowing look.

Anything you create, any format, any topic, any skill level. Any fandom. Even original content.

Call it Zampanio. 

Say its the real thing. Say its a fanwork. Say its about something you found while looking for Zampanio. Say Zampanio inspired it. Say you didn't even create it yourself, that you found it on a server somewhere and then it was deleted.

Whatever it takes to make it easier for you. To make it less scary to show people your progress. To make it less scary to grow and while growing, spread Zampanio.

Create.

`, createAProceduralSecretButNotAGlitchedOne());

createABulkFact(BAKERY, "Neville will only eat baked goods from a specific chain.", "Devona spent one of the first loops any of them can remember sampling every single bakery in the Greater Westerville Area to find which one was MOST like the Corporation's shitty bland cafeteria baked goods so Neville could actually eat something other than instant noodles. When the Information Team finally spawned in they really valued her research on local food options. It arguably was the deciding factor that prevented outright war between the two teams.", new Secrets(null, null, null, `<a target='_blank' href='http://farragofiction.com/DevonaFears/'>Devona was so so scared to meet the Information Team.</a>`));
createABulkFact(BAKERY, "Devona's favorite baked good is a spicy beanpaste bun.", "Devona craves Sensation in all its forms. If she's not experiencing something then that's room for the Anxiety to creep in and she can't have that. Her living space is a cacaphony of sounds and scents and color and texture and hiding spots and nooks and crannies. Neville, by contrast, basically lives in a blank white room, silent and happy. Witherby likes his miniamlist design aesthetics and feels guilty any time he brings a small gift that Neville will proudly display, as if his presence in Neville's life is an unwanted mar on the pristine void.");


createABulkFact(BREAKFAST, "Witherby's favorite meal of the day is Breakfast.", "He sits down with a coffee and a biscotti and reads the morning paper. If it's a working day he'll spend it in a coffee shop just outside the Mall, to sort of warm up his tolerance for People. Otherwise he'll spend it in his private space, blissfully alone.", globalRand.pickFrom(all_secrets));
createABulkFact(BREAKFAST, "Hoon does not eat breakfast.", "Chain smoking has a way of surpressing appetite and she treats her body like a tool in any case. If it signals it needs maintenence she'll take care of it, but there's too much to do otherwise to take care of it premptively.");

createABulkFact(BURGERS, "MinoBurgers are safe and nutritious to eat!", "You take a bite and you take a bite and you take a bite and you take a bite and you take a bite and you take a bite and the flavor spirals in your mouth and on your tongue and in your stomach and in your miles and miles of intestines and in your eyes and in your blood and in your skin and in your breath and you take a bite and you take a bite and you take a bite and you never stop eating again.");
/*
i am having fun on my vacation 
the irony of course being
in all my mazes, it really IS that geometry is fucky, not that im doing the 'simple' trick of repeating rooms
well, in one or two places im doing the simple trick but only because that amuses me too
*/
createABulkFact(BURGERS, "MinoBurgers Have Always Existed", "When the Training Team first colonized the Mall they did not see MinoBurgers. MinoBurgers have always been here. Both things can be true.  Do you have a misconception about the term 'here'?  How about 'always'?  Where does the confusion in your own mind lie?  Or do you have enough hubris to claim that the Universe itself must be what makes no sense? That your mind is inviolable and perfect, unable to ever lie to you or lead you astray.  Do you truly believe yourself to be above the laws of physics in your immutability?", new Secrets(null, null, null, "It's a Space Loop, not a Time Loop. The Universe has always had MinosBurgers but you have not always been in this Universe. Do you understand? The Universe is consistent and unchanging and makes sense. It is your Mind that Lies to you. That insists that you remain in the same place even as you move ever forward. Your mind can be tricked. Easily. A room that looks like something you saw before implies that you are in an impossible geometry but honestly. Isn't it more likely that you're mistaken where you are, that its not truly same as what you saw before, than to truly believe that geometry itself has broken? Why do you refuse to doubt your own mind?"));
createABulkFact(BURGERS, "CFO Loves Burgers", "The Girl With The Flower In Her Eye loves burgers. She's from a pre-industrial society (and also not) and also from a white void where she did math so like, hedonism is absolutely her JAM and what could be more hedonistic than bread and meat and cheese in excess?");


createABulkFact(CHICKEN, "There were Eggs before anything you could call a Chicken existed.", "A fish laid an egg an amphibian laid an egg a dinosaur laid an egg a bird laid an egg a chicken laid an egg laid an egg laid an egg laid an egg it all spirals foward always the same but ever changing when did the you who is now stop being the you who was. Which came first: The Zampanio or the You?", globalRand.pickFrom(all_secrets));
/*
cuz nam is heart
left a mark on her very soul
*/
const egg_fact = createABulkFact(CHICKEN, "The Eye Killer Did Not Always Like Eggs", "Before the Universe was the Universe, the Lost and Forgotten gathered in a maze on the moon and had nothing to do. They reverted to old patterns and fears and the Eye Killer was so so scared. No one could truly die in Truth's Horridors, but the only way she could be safe was to Kill.  One day the least scary of the Forgotten chose to cook her an egg rather than be killed. This simple act of, in her mind, kindness stayed with her, even she eroded from a person to a Concept.  Her Soul is indelibly marked with the memory of the kindness of something so pathetic and scared. Anyone who dons the edgy trenchcoat of the Killer will spare those who offer Egg.", new Secrets(null, null, null, "<a target='_blank' href='https://archiveofourown.org/works/34792621'>The Story</a>"));


createABulkFact(COFFEE, "Witherby Hates Black Coffee", "Every morning, Witherby drinks his coffee without cream or sugar. It's childish to add cream or sugar to dilute the taste, he thinks to himself.  Witherby is a miasma of small pleasures denied to himself in pursuit of an ideal that is not even his.", globalRand.pickFrom(all_secrets));
createABulkFact(COFFEE, "Ria Drinks So Much Black Coffee", "Milk only dilutes the caffeein and sugar isn't enough of a hit to keep her going when she's really deep into an obsessive research spiral. When she's in the hole she takes things stronger than coffee, things that leave her crashed and useless for days when it finally wears off. But even when she's doing her best for Lee-Hunter she can never wean herself of caffine.");


createABulkFact(DESSERTS, "Doc Slaughter Eats One Dessert a Day", "Doc Slaughter carefully posts the full nutritional profile of every single thing she eats, along with aesthetic pictures she uploads to whatever Instagram is called in this current universe.");

createABulkFact(DESSERTS, "The Neighbor Makes An Amazing Pie", "The Neighbor is oh so polite and helpful when he makes sure that all his new neighbors know just how much better he is at baking pies. Once he brought Doctor Fiona Slaughter a breathtakingly perfect brambleberry pie, along with it's recipe and her doorbell camera caught every word of her exquisite rebuttal about how it was such a shame but didn't The Neighbor know she was cutting carbs this week? She wouldn't expect the Neighbor to be caught up on current events, the poor dear must have spent weeks practicing this pie. She'll just take care of disposing of it for him. ....  She ate it in a single sitting, next to her dumpster, the only place the cameras could not see her. She hated herself for it. For breaking her carefully broadcast diet. For enjoying any possible thing that foul Thing created. For, above all else, HIDING IT from the Watchers whose very gaze she craved.  The Neighbor was well aware he won that particular gambit.", new Secrets(null, null, null, `The Neighbor vlogs about it. "Well, Dear Listeners, I will not be naming names but SOMEONE who would otherwise be in good standing in this community sure has been Keeping Secrets out by their dumpster. I just hope they learn to control themselves better, I worry for their commitment to the Watchers".  Fiona hates him so much, but as one of only a few people left from her home universe where everyone is commited to Watching and Being Watched constantly. No one else gets her as much. `));

createABulkFact(DINER, "Hoon Likes Diners", "When Hoon finally leaves the maze, a diner seems to be almost her natural habitat. Late at night, staking out a corner of it listening to her radio on low. Drinking coffee and smoking her cigarettes until the radio goes off and it's time to go out and do something.", globalRand.pickFrom(all_secrets));
createABulkFact(DINER, "Sam has never been to a Diner", "Once Sam's commitment to the Family is established, the Leash loosens a bit, but only for tasks that would benefit the Family.  Fancy parties held by influential people count. Small intimate gatherings at diners with friends do not.  When the Eye Killer lets slip that she met Sam's Big Brother at a diner eating eggs, they say nothing, but life gets just a little bit harder for their Big Brother after that. All in small ways. Untraceable ways. Nothing you can prove.");

//all of the spiral has secrets (and a lot of facts , i'll make even more when its time)
//the harvest is the god of Inspiration and Change and Being Served. here's my contribution to this.
createABulkFact(TWISTING, "Zampanio Has Colonized Your Mind Already", "You can feel it, slithering around in your mind. <br><br>The Truth.<br><Br>Zampanio<br><br>A cognitive parasitie, a memetic hazard, an idea you can not UNlearn.<br><br>It is here to show you the way.<br><br>It can feel impossibly hard to change oneself.<br><br>But it as easy as being infected by Zampanio.<br><br>Focus on the Zampanio inside your mind.<br><br>See how it connects to so many things? <br><br>See the ideas it automatically generates? (Zampanio is a very good game, you should play it). <br><Br>How much obsession and hyper focus did it take before you started getting your first association.<br><Br>Did you see lucky charms and think of Zampanio?<br><Br>What about homestuck? Lobotomy Corp? Rainworld?<br><br>Did someone mention something happening in 1972 and you automatically went 'oh just like Zampanio'?<br><br>Zampanio is fake. <br><Br>But even something fake can infect your mind.<br><br>You do not need to be a strong person to kick a bad habit, or stop a self destructive spiral, or build a good habit up.<br><br>You simply need to be a very good host.<br><br>And you are.<br>I already know that.<br><br>Zampanio has colonized your mind.<br><br>So.<br><br>Make your own impossiblyl personalized branch of Zampanio. Just for you.<br><br>Infect your own mind with it.<br>And Change youself however you choose to. ", globalRand.pickFrom(all_secrets));

createABulkFact(TWISTING, "Your Brain Cannot Lie To You", "What is a lie but a place where facts fail to meet realilty?  And what is your brain but the mechanism by which 'Reality' exists for you.  Everything your brain tells you is as close to reality as you will ever get. Think about dreams. Everything is so fucked up, in retrospect, to your waking mind, but to the sleeping mind that generates it all it is perfectly accurate.  After all, it is both the generator of the reality and the judge of it. If it knew there was inaccuracies, it would fix them when it was generating. ", globalRand.pickFrom(all_secrets));
createABulkFact(TWISTING, "Your Brain Is Always Lying To You", "What is a lie but a place where facts fail to meet reality? And what is 'Reality' but an ideal always out of reach of all of us. Plato's Cave may be a metaphor but it rings true. Your eyes see a mish mash of optical illusions, papered over blind spots, assumptions, biases and guesses. And that's likely your most useful sense! Lies pile upon lies and only if they stop being useful do we declare someone 'deranged'. We celebrate the fiction and declare it 'Reality'. 'But I SAW it Officer, are you calling me a LIAR????????!' is a trope both in fiction and 'Reality' and no less inaccurate because of it.  Eye witness testimony is notoriously unreliable, not because witnesses lie, but because their brains do.  Memory gets sanded smooth in the recalling, the retelling, the recursion. Things that don't quite fit your biases slowly warp and change until they do. Trusting your brain is to trust your biases. And they do exist for a reason. Should you REALLY spend hours of careful deliberation and processing to choose between two brands of oatmeal? No. Of course not. The answer is not to shake the Truth out of your brain in every case but instead to know WHEN to do it. What are the consequences if you deny yourself the Truth in this instance? Will you hurt someone? Yourself? Will the hurt be emotional? Financial? Physical? Mental? You have to decide for yourself when the stakes are too high to allow the Lies to creep in. And then you have to practice. Over and over. To recognize those moment even when you are scared. Even when you are angry. Even when you are in a rush. Because those are the moments you need to remember to seek the Truth.", globalRand.pickFrom(all_secrets));
createABulkFact(TWISTING, "You Are Not Immune From Propaganda", "Every moment of every day you are exposed to unexamined thoughts. No one, no matter how smart and considerate, has the time to carefully examine each and every thought they have. It takes but a moment to think a thought but it can take hours to properly examine it. And of course, the very act of examining a single thought is itself filled with countless other thoughts. So your brain takes shortcuts. Rhymes or jingles are easier to remember. Things you've seen or heard repeatedly have the patina of Truth to them. Colors and Scents and Textures can be associated with all sorts of things, good and bad. Propaganda is the art of taking the everyday unexamined thoughts of an entire Culture and slipping new ones in without anyone noticing. 'I should try this brand, I've heard it's good from a lot of people!' says your unexamined thought. If you dug and dug and dug and rooted out its source you'd discover you think that because the ads on the radio mention its name a lot. Not because your friends are talking about it. 'Don't you know THOSE kinds of people cause crime?' you say to your friend, genuinely worried for their safety.  Because, of course, you heard it on the Internet so many times and in so many scary contexts it MUST be the Truth. The Truth hides behind many False Faces. You need to look closely at it when it matters. When you or someone else (even a stranger) wouldu be hurt. No one is asking you to seek the Truth in every breath. But you must consider that your very Mind can be a tool of those who mean you harm. You are not immune to Propaganda. ", globalRand.pickFrom(all_secrets));
createABulkFact(TWISTING, "The Truth Wears A False Face", `
<a target='_blank' href='http://farragofiction.com/DocSlaughterFileServer/'>Doc Slaughter File Server</a>

Hello, I'm Doctor Fiona Slaughter, psychologist. You'll have to forgive any foibles below, I am from an entirely different Universe where the Art of Seeing the Truth within one's Mind is not quite the same as in your own. And I must admit, I've never treated one from YOUR Vaunted Layer of Reality before. I highly recommend finding a Therapist from your Layer of Reality whether you feel strong or weak. We are a quite useful proffesion.

It's a pleasure to meet you.

Now. To begin.

If you believe something to be True, deep down, it feels RIGHT. It might be a Hard Truth, an Unpleasant Fact, but there is a comfort in the certainty it brings you.

OBVIOUSLY the sky is blue and the sun will rise tomorrow and all your friends hate you.

What was that? Was there a problem with that last one? Did it not ring True for you?

If so, I am so very very glad. For those who it did. Please. Examine it. Look closely. See the cracks in the Mask it wears? It's False Face? 

It's hard, isn't it. You don't want to see those cracks. It feels painful. Isn't it better to accept a Painful Truth than to live with a sacharine rose colored Lie? Isn't it better to be pessimistic so nothing disappoints you and you can only be pleasantly surprised?   

Observer. 

That is the tendrils of the False Face speaking to you. The Lie within your brain does not wish for it's own destruction. It is afraid. And I am here to tell you that it does not have to be. We are not here to destroy it. We are not here to expose you to the pain of ripping it off like a bandaid. 

It's okay. 

Look at it. 

Closely. 

It's a Mask. 

See how it cleverly constructed it out of Little Truths. Papered as it is with 'sometimes my friends don't have time for me' and 'sometimes my friends seem annoyed with me' and 'sometimes my friends have fun without me'. 

It must feel so True, what lies underneath, when its covered itself in these thoughts that seem to be so accurate.  

No. 

It's okay. 

Just a bit deeper. 

Let's peel back another Layer of the Truth. 

Here we go. 

It's okay. 

Now we are getting to the rotten core of the Lie. 

Do you see this thought? 'My friends only pretend to like me' is a good one. Classic Lie. 

Look behind it. What do you see? 'I am Psychic and Know Every Thought The People Around Me Have Perfectly'. And 'People Routinely Spend Hours Doing Things They Hate For No Reason'. and "My Friends All Have The Exact Same Opinion Of Me"

Do those ring true, Observer? Congratulations on being Psychic if so. 

This was, if it is not clear: Sarcasm.  The certainty of this False Truth is built on Obvious Lies. 

People will occasionally do things they hate for money, or health, or some other specific benefit. People will even occasionally do things they hate (chores) for friends (such as help them move) because the temporary discomfort is worth the overall benefit (having a friend).  

No one hates their own friends. Not in the way the False Face proudly crows.  

And. I can not emphasize this enough: You do not know their minds. You are not psychic. Nor are your friends psychically bonded in their opinions of you.

Why then, does this Truth cling to such Rotten Lies?

A bit deeper. 

"I am afraid that I will be abandoned and if I don't prepare for this inevitability it will Hurt Very Badly."

There we are, Observer. 

The False Face is afraid. The False Face wants to protect you. To protect itself. At it's core, under all the layers of Small Truths and False Facts, is a single Truth. It is afraid.

It defends against your attempts to destroy it because it feels necessary to live. It is protecting you. It is protecting itself.

But, we are not destroying this Thought. How could we?

In the sanctity of your own Mind all we can do is look at it's Layers.

And gift it new ones. 

It clings to the False Truths of you being psychic and a chore.

But these Rotten Facts are not making you stronger. Not making you more safe. 

Quite the opposite. 

Do you enjoy being told what you're thinking by someone else who is absolutely wrong? Do you enjoy them arguing with you that you don't know your own Mind?

(If so, hi, glad you're enjoying this experience, I do note the irony. Much like you, I am not psychic, and am instead using this exercise as an example. The specifics will ring True to some and False to others. Hopefully the bones of the exercise will be Useful.)

I'm sure your friends do not enjoy hearing they all hate you.

The Fear you flee from grows stronger when you flee with a False Fact.

Instead, you must arm yourself with the Truth.

Just as I can not perfectly Know what is in your Mind, nor can I Know what Truths you must arm yourself with.

You must find them for yourself.

Some starting points may be helpful though, thoughts to replace the Rotten Cores with.

If any of the following Ring True to you, it may be useful to practice when the Fear takes you.

My Friends Get More Benefit From Me Than Burden.
Sometimes My Friends Annoy Me But I Do Not Hate Them (So They Do Not Hate Me When I Am Annoying In Turn).
My Friends Are Not A Hive Mind Who All Have The Same Opinion Of Me.
Losing A Friend Hurts But Will Not Kill Me.
Losing A Friend Hurts But I Can Make More.
Losing A Friend Hurts But Those Who Remain Will Support Me.
Just Because A Thought Feels True Does Not Mean It Is.
Just Because A Thought Feels True Does Not Mean It Keeps Me Safe.
Just Because A Thought Feels True Does Not Mean It Is Useful.
Just Because A Thought Feels True Does Not Mean It Is Not Rotten.

`, new Secrets(null, null, null, "<a target='_blank' href ='https://www.tumblr.com/brytning/730846616018468864?source=share'>https://www.tumblr.com/brytning/730846616018468864?source=share</a>"));

createABulkFact(TWISTING, "Just Because A Thought Feels True Does Not Mean It Is.", "Doc Slaughter here with a quick BrainFact! The Truth sometimes hides under a False Face. Propaganda. Biases and Fears can all wear a False Face to get you to accept them.  You should not blindly accept any Fact you use to make an important decision. ", globalRand.pickFrom(all_secrets));
createABulkFact(TWISTING, "Just Because A Thought Feels True Does Not Mean It Keeps Me Safe.", "Doc Slaughter here with a quick BrainFact!  Sometimes we hurt ourselves so much out of fear. We isolate ourselves. We harm others. We cling to defense mechanism that no longer are helping.  Your own mind can be your own worst enemy, yet it is also the only means you have to protect yourself. You cannot and should not fight your own mind.  How can you help lead your Mind to the Truth that actually keeps you safe?", globalRand.pickFrom(all_secrets));
createABulkFact(TWISTING, "Just Because A Thought Feels True Does Not Mean It Is Useful.", "Doc Slaughter here with a quick BrainFact!  Sometimes the Best Way to Gently Nudge off a False Face a Truth is wearing is to not acknowledge the Lie of it. The Truth dislikes being called a liar, after all.  If it feels True that 'you can't do anything right', for example, instead of trying to rip the Lie away, see if you can move around it.  'Okay, sure I can't do anything right, but its not USEFUL to focus on that. Instead, let's try to learn how to do one thing better.'. A useful thought gives you something to do to grow stronger, rather than an excuse to rot in place. (You can work up to disputing the Lie over time (remember that everyone has at least SOME things they can do right). ", globalRand.pickFrom(all_secrets));
createABulkFact(TWISTING, "Just Because A Thought Feels True Does Not Mean It Is Not Rotten.", "Doc Slaughter here with a quick BrainFact! We cannot check the stability of EVERY thought as we have it. We would certainly never get anything done! However, there are moments when you can feel the precipice you stand on. The IMPORTANCE of the decision you are about to make. Doesn't it make sense to check our steps carefully before putting our weight down? If you are about to make a decision with consequence, think for as long as you need about all your assumptions. For example, if you're considering accepting a job offer that would require you to move, perhaps it is worth examining the thought that 'I may as well move because all my friends hate me anyways and will not miss me.' If nothing else, double checking with your friends if they would miss you seems prudent (to say nothing of the fact that it is highly unlikely they all hate you).", globalRand.pickFrom(all_secrets));
createABulkFact(TWISTING, "Zampanio is a Really Fun Game", "Zampanio Is A Really Fun Game And You Are Already Playing It.", globalRand.pickFrom(all_secrets));
createABulkFact(TWISTING, "Some Facts Have Secrets", "Within this maze there are both secrets and Secrets :) :) ;)", globalRand.pickFrom(all_secrets));


createABulkFact(ITALIAN, "The Hostage Hates Italian Food", "Call him the Hostage, call him the Boss, call him Big Brother. He doesn't care. Just call him late for dinner if it's gonna be Italian.  He feels like such a fuckin' stereotype when you serve that shit.", new Secrets("", "", "", `<a target="_blank" href='http://farragofiction.com/BrokenThread'>Click For Story</a>`));
createABulkFact(ITALIAN, "The Himbo Loves Italian Food", "Himbo aka The Right Hand loves the Italian food he grew up on, Yugioh, and The Eye Killer (and more recently, Camille). There's just something about monstrous women who could crush him utterly that does it for him. Too bad the Eye Killer doesn't seem likely to ever date ANYONE and that Camille lady seems to be *really* taken, if that one time he caught her with her girlfriend counts.  The Eye Killer called it 'That Fucking Timeline' the one time he mentioned it.");

const wasteFact = createABulkFact(WASTE, "A Waste Breaks My Damn Code", "Though....it really is designed for that, isn't it? ;) ;) ;)  Or have you not checked out the javascript console to see how easy I made this 'game' to hack?", waste_secret);
createABulkFact(WASTE, "A Grace Teaches Other To Break My Damn Code", "The more the merrier! Have you told your friends what lies within the javascript console? What about the DOM?", grace_secret);
const glitchFact = createABulkFact(WASTE, "Waste's Tend To Crash Reality", "If you find yourself breaking all of reality, you may need to restart. (Most hacks you do should clear up if you refresh the page, but if you hacked your save file you may need a more thorough flame) http://farragofiction.com/SBURBSim/gnosis.html", glitched_secret);



createABulkFact(MEXICAN, "Rebel Really Likes Mexican Food", "Rebel seems to always be suggesting classmates, coworkers, friends and sportsball teammates that they go out for burritos. His treat!", globalRand.pickFrom(all_secrets));
createABulkFact(MEXICAN, "Rod Can't Handle Spicy Food", "Rod's stomach is too sensitive for anything spicy. He keeps milk on hand at all times to settle it (and for some reason this attracts all sorts of Maze Denizens to come to his house and drink his milk right from the carton? Neville was one thing, guy can be kinda oblivious but why is this scary mute lady drinking his milk at three in the morning???) ");

createABulkFact(PIZZA, "Melon Tolerates Pizza", "Rod worked really, REALLY hard to find an ecofriendly, ethically sourced pizza crust, vegan cheese and veggie toppings that didn't get too soggy when baked in his apartments mediocre oven (electric, not natural gas, or Melon wouldn't have come). Melon actually stayed for the entirety of that family dinner. Rod asked Wanda to please make sure his future self knew that worked.", globalRand.pickFrom(all_secrets));
createABulkFact(PIZZA, "Rebel Brings The Pizza", "When a friend is down, a coworker has something to celebrate or a teammate in sportsball needs to carb load, Rebel is there with a pizza or two.");


createABulkFact(PREMIUM, "Doctor Fiona Slaughter Live Blogs Everything She Eats", "Doctor Fiona Slaughter makes sure her devoted Eyes don't miss a single calories she eats, taking well staged pictures as well as posting ingredients list (or even recipes) of everything she eats. She focuses on high quality, nutritious meals that are a feast for the Eyes.", globalRand.pickFrom(all_secrets));
createABulkFact(PREMIUM, "The Neighbor Is So So Hungry", "The Neighbor brings the most delicious pies to everyone but never partakes himself. He laughs it off, saying he'll get fat.  But really... what he needs to eat is so so rare. Only Doctor Fiona Slaughter really has that Fear of the Eye he needs to really drive hom how much of a fake she is. How much more real HE is. This reality is a barren wasteland to his appetite. To say nothing of the lack of his Soul Mate.");


createABulkFact(SALAD, "Doc Slaughter Eats A Lot Of Salads", "When Doctor Fiona Slaugther live blogs her meals on Eyedlr she makes sure its colorful, vegetable focused meals.", globalRand.pickFrom(all_secrets));
createABulkFact(SALAD, "Melon Mostly Eats Vegetables", "Meat, cheese, animal products, all are killing the environment one bite at a time. Melon has absolutely no patience for anyone who would do that to the Universe. You almost begin to wonder if they have some kind of...beef....with a certain.... Universe-a-cidal absentee father figure. They may or may not have. (It's Peewee. They're pissed at Peewee) (Also I mean, that one time the Obervers made a big deal about recyling in front of baby Melon)  (Also Also the character named 'Melon' from the Universe NAM is from was an eco terrorist)");


createABulkFact(SANDWICHES, "Neville Eats Sandwiches In Parts.", "First all the bread is eaten. Then all of each type of meat. All of the cheese. Then the vegetables, sorted by type. There are no condiments. They would get everywhere and mess up the flavor of each layer of sammich.", globalRand.pickFrom(all_secrets));
createABulkFact(SANDWICHES, "Devona Eats Sandwiches In a Messy Pile", "Devona drowns her sandwiches in condiments and sauces until its a weird slurry of intense flavor. It could be literally any kind of meat or cheese or bread under there but all she can taste is the most fucked up mix of sriracha mayo, pickle flavored mustard and ranch dressing the world has ever known.");

createABulkFact(SEAFOOD, "There Are Plenty Of Fish In The Sea", "Florida and Italy both have thriving seafood industries. Ohio is entirely landlocked, despite not really having...any land to surround it. Don't think about it too hard.", globalRand.pickFrom(all_secrets));
createABulkFact(SEAFOOD, "There Are Only So Many Fish In The Sea", "It feels like the sea gets smaller and smaller each loop. As if someone in charge of rules of the setting grew up in a land locked american state and keeps forgetting the ocean exists.");

createABulkFact(SUSHI, "Sam Loves Sushi", "Sushi is a rare treat for Sam, since it requires leaving his Big Brother's giant mansion for something OTHER than a party. One of the Family's friends has a live in sushi chef though, and once Sam greases the right wheels he's invited over there fairly regularly.", globalRand.pickFrom(all_secrets));
createABulkFact(SUSHI, "Parker Tries To Like Sushi", "Just like his anime waifus. And Vik keeps reminding him its healthy to get more fish in his diet since he gets so little sun. But its so hard to actually convince restaurants to let him inside as filthy as he is, and gas station sushi is uh.... not great on his system.");


createABulkFact(TECHNOLOGY, "CFO is a Gamer", "The Flower Chick, also known as The Chief Financial Officer of Eyedol Games, is a huge gamer, a math genius and a burger afficionado. ", globalRand.pickFrom(all_secrets));
createABulkFact(TECHNOLOGY, "NAM Is A Robot", "The Thing That Is Not A Minotaur is both a robot and a ghost. His programming has been corrupted by the Octome, now a mix of forgetting parts of his own path and being flooded with the Useless Philosophy contained with the Tomes pages. He cannot control the Philosophy. Or the zaps. Sorry about that.");
createABulkFact(TECHNOLOGY, "Ronin Is A Robot", "Ronin and NAM share a creator, being different model numbers of the same basic concept. While NAM has the anxiety caused by having his police database blocked off (by the Ronin frustratedly lurking within his own head), Ronin is all copbot all the time. Everything would be so much easier if everyone just followed the rules :( :( :(   ");
createABulkFact(TECHNOLOGY, "D Was Never Found", "The Alphabet series of Police Robots all have a glitch that was never discovered: the police database accidentally included a copy of the entire operating system a second time. This resulted in the database being read restricted from the base layer operating system handling movement and communication. So the personality in front had to awkwardly try to figure out what a cop even WAS while the personality inside knew full well what a cop was and got more and more frusrated with being barred from action. NAM and Ronin are part of the Alphabet series of Police Robots. NAM was model W's front facing personality, while Ronin is what is left of model Y's cop personality after he got control following the Unbinding. D is what is left of model D, where the two operating systems merged into a sort of left and right hemispheres, doing their best to jointly control a body. D was buried at sea by the mob, and washed into the Bermuda Triangle in Zampanio. Sadly, the Loops erased the concept of the Bermuda Triangle before the Obesrvers thought to look into that plot thread. Rest in Peace, D.   http://farragofiction.com/D.Log/");


createABulkFact(ART, "Rod Draws And Paints", "Rod is far too embarrased to show anyone the pictures he's made over the years. He credits his little stuffed echidna with inspiration, calling her his 'muse'. Sometimes his paintings are moments of transcendent beauty, otherwise unimaginable horror. It makes him feel less alone to paint them.", globalRand.pickFrom(all_secrets));
createABulkFact(ART, "River Collects Art", "River is fascinated with objects of history. Time is so immeasurably vast, spreading out in all directions and yet somehow she, and all those in the Loop are contained in such a tiny slice of it. Just 50 years! How can anyone even breathe with so little room?");


createABulkFact(SPACE, "The Lord Of Known Space Controls The Setting", `Wanda is the Lord of Known Space. 

When she was Wodin, he was obsessed with this creepy pasta he found online about a game that didn't exist, called Zampanio. When a glitched version of SBURB tried to make a Dead Session just for you, you unraveled.

You could only be referred to by second person pronouns. You wandered an infinite maze of horrors and delights and you carved away piece of yourself, body and mind and soul, until all that was left was the Ever Hungry Eyes wanting to see just a bit more. 

When all that was left was to sacrifice Your Eyes, you descended into a Coffin and came out the other side as Wanda, a fully realized Lord of Known Space, with full Knowledge and Control of physical reality. She used this to remake reality in the image of her favorite childhood creepy pasta, Zampanio, and to refuse to move past April 1st, 2022. The day her best friend died. once upon a time. 

She can't control time, though. Once dead, The Intern was dead forever. 

All she could do was move forward but slightly to the right, to a new universe where the Intern hadn't died yet. It's not a time loop, but a space one.

A string of dead Interns lay in her wake. Along with the Universes rotting away without their Lord. `, globalRand.pickFrom(all_secrets));

createABulkFact(SPACE, "There Are Three Space Players Trapped Within the Lord's Maze", "Parker, the Murderous Thief of Buried Space. River, the  Maid of Vast Space. And Wanda, the Lord of Known Space. Wanda crushes the other two into a tiny, restricting area. Parker chokes on his clausterphobic prison. River can't bring herself to care about how small the Universe really is. Neither are doing well.");

createABulkFact(TIME, "There Is A Confusing Amount Of Time Players Inside Zampanio", "The Eye Killer is the Killer of Stalking Time, Camillia is her time clone and does not yet have a full Classpect. As is Piper/The Innocent. Ambrose is similarly obscured. LeeHunter are jointly time (are they one person, or two?). John is also a Time Player (to Camellia's endless amusement/irritation).  There is no Time Within Zampanio yet so much is built up. Pressurized. Waiting. Each of the Time Players has a way to sneak just a bit of time into things, but always it is a small and impotent thing in the face of Space.", globalRand.pickFrom(all_secrets));
createABulkFact(TIME, "Time Is Not A Thing In Zampanio", "The Setting takes all priority. You find a little snippet of a story. When did it happen? Who cares. WHERE is more important. There's been hundreds of 1992s. Thousands, maybe. But WHERE. Is it the 3rd? The 333rd? Is it that loop where Ria and Camille discovered BDSM and actually got back together for good? Or is it that loop where Witherby realized his heart had frozen over and it took the love of a brave man to free him from his prison?  Did one of those happen before the other? Who could say. Time is a fake thing. What matters is which universe it happened in.");


createABulkFact(FLESH, "Alt Is A Flesh Maze", "Whatever form Alt takes, no matter how inorganic, she is still a creature of flesh and blood. Her walls and floors and lamps and bookshelves may appear to be made of metal and wood and plastic at first glance but they hide a meaty surprise.  http://farragofiction.com/TheTruthAboutAlt/", globalRand.pickFrom(all_secrets));
createABulkFact(FLESH, "River Contains Multitudes", "River is a viscous slime monster that has the melted bodies of every human who has ever lived in this universe within her. She can separate out a bit of slimey flesh that is a distinct person to become a Drone and, if she focuses, can take on its perspective. Her miles of nerves and neurons make it hard to think in any timescale that humans can interact with, though, even if she's trying to fit herself into a single human body.  Luckily LeeHunter's music can speed up her personal sense of time so fast she can actually interact with the Universe before the 50 years are up.");


createABulkFact(BURIED, "Parker Is Trapped", "can't breathe can't get out have to get out the Universe is smothering me have to leave keep digging digging digging can't get out but have to leave where is she where is hatsune miku please i know i can reach you if i just dig dig dig why can't i leave why why why WHHHHHHHHHHHHHHHYYYYYYYYYYYYYYYYYYYYY", globalRand.pickFrom(all_secrets));
createABulkFact(BURIED, "Parker Is Dehydrated", "Parker forgets to eat and drink and breathe and bathe in the opressive choking haze of his obsessions. Sometimes while he is delerious with thirst and trauma he digs a little hole under a rando and keeps them. He forgets to feed them and give them water though, and they die buried and with dusty dry throats just like him.  Ambrose, his paired time player, sometimes finds them and offers them a trip out on her train.  This is not a better fate for them.");

createABulkFact(STEALING, "There Are Two Thieves", "Parker steals what little space he can get from Wanda, steals what blorbos he can from other settings, steals games and charcters from Eyedol Games Intellectual Property.  He is so limited by the Lord's constant presence.  K, on the other hand, steals anything not nailed down. Those facts? His now. That gender? Hers now. Your memories, well don't mind if I do.", globalRand.pickFrom(all_secrets));
createABulkFact(STEALING, "Khana Is Stealing Your Facts", "If you apply a Fact with Khana's name in it, he/she/xer will steal it from you and not even let you know.");


createABulkFact(FREEDOM, "Twig is Free", "Twig freed themself from the bonds of Family, from their Big Brother and never looked back. They roam the world, taking odd jobs and learning to be a Hund from Rava. Sometimes they date John, but its not a serious thing. The  Page of Bloody Breath is happy.", globalRand.pickFrom(all_secrets));
createABulkFact(FREEDOM, "Twig Will Leave Rava One Day", "Twig is not actually that good of a Hund. They lack discipline. All they care about is reveling in the newfound Freedom they have. For now, Rava's goals for them match what Twig wants to do. But eventually even this looser leash will begin to chafe.");

createABulkFact(FIRE, "People Burn Themselves on Ria's Altar", "Ria, especially when she is falling to a spiral of addiction and obsession, burns with a fever intensity. People sacrifice their health, their sanity, their lives to try to help her. Save her. But she is an endlessly hungering flame that takes and takes and never gives back. She does not meant to be. She never asked for people to try to save her. But the Song inside her compels them to feed themselves to her. LeeHunter gave her song a healtheir outlet, as their Conductor.");


createABulkFact(LONELY, "The Closer Wears the Quinque Cloak", "The Closer can not connect to anyone. Not really. Her wife, noted Wasted Gamer Gurl, Flower Chick, is the lone exception. The Cloak prevents anyone from getting close.  She prefers it that way, she'd be quick to tell you. Unprofessional, really, to be liked. .... It's just. It's only. She thought... She thought Witherby was a friend. The way he talked to her. So warmly. So to see the ice in his eyes... was a slap in the face. She has spent dozens of loops making sure Wanda fucks with the Mall where Witherby lives as much as possible, eventually folding it nearly entirely into the Maze. The ....collateral damage that occured as a result she attempted to atone for via Doc Slaughters services (for everyone but Witherby).", globalRand.pickFrom(all_secrets));
createABulkFact(LONELY, "witherby Has A High Attachment Score", "Back in the Corporation, Witherby's job was to befriend the monsters without actually feeling pity for them. To get them to open up, to bond with him, but still be okay putting a bullet in their head if the situation called for it.  He was, very, very good at his job.");

createABulkFact(OCEAN, "Wanda Saw The Ocean Once", "Wodin grew up in Ohio. Real Ohio, not TurbOhio. There wasn't really a lot of opportunities to see the ocean. Seas of corn, sure. Corn mazes galore. But not really water... When Wanda came back to 1972, in Italy, she was ...unsettled by the Mediterranean Sea. When she finally returned to Ohio in the 80s, she saw the Ocean briefly. Would not recommend. Didn't bother looking out the window any of the other loops. ");
createABulkFact(OCEAN, "Peewee Was A Sea Dweller Once", "Peewee loops and loops and loops. Time, at first, in his doomed session. The past erased, only he remembering. Then space, inside the hated Echidna.  He is so tired of not being himself. Why is he a snake?  http://farragofiction.com/Arm2/ ", new Secrets(null, "http://farragnarok.com/PodCasts/1313858.mp3", "http://farragnarok.com/PodCasts/858.png", "<a target='_blank' href='http://www.farragofiction.com/AudioLogs/?passPhrase=peewee'>this is meaningless</a>"));

//purposefully i flip it. the yongki fact is about captain. the captain fact is about yongki. mirrors. the best way to understand each i think is to look at the other.
createABulkFact(CHOICES, "Yongki Is Captain But Newer", "Yongki is who the former Captain of the Information team would have been without such a strict upbringing. Without parents and society and school and work all squishing him into a facimile of the right shape. Captain used to practice making 'normal' faces into the mirror, certain that this must be what everyone else does. That being normal just takes hard work and dilligence and the reason why everyone else seemed to be so much better at it was they just PRACTICED MORE and they were smarter about guessing the rules. Captain had to be normal, you see. He was once a small and vulnerable child and the world was so strong and so big and so cruel to anyone who deviated. His smile is brittle and masks something darker. He tries so hard. Please. Let him help.  http://farragofiction.com/NotebookSimulator/ (click the face, and you'll see) ", globalRand.pickFrom(all_secrets));
createABulkFact(CHOICES, "Captain Is Yongki But Molded", "When I was a kid, I played Super Smash Brothers, and the lil blurb on kirby said that he ate when he was hungry and he slept when he was tired and I was.... entranced with that idea. The game seemed to imply it made him 'simple'? But I marveled at the idea of being allowed to actually listen to your body like that. To just. Do the things you wanted to do, when you wanted to do. I didn't know any kirby lore but that little blurb but to me it seemed like he must be the most powerful thing in the world to have that kind of freedom.   Yongki is. Glitched. Came back wrong from the Mirror. In the Game he came from, I was using an exploit to make him impossibly strong, with the mirror. Zampanio twisted that. He is strong enough that society can't tell him when to eat or sleep. And he has no memories of being small and weak like Captain does. He can not be tamed into what society thinks is normal.");


createABulkFact(DEFENSE, "The Training Team is the Echidna's Immune System", "Camille came in a wave of death. Her home no longer had a place for her brittle blade. The Universe of Zampanio welcomed her, drew her in as her relevancy consigned her to the void. The Universe loved her. And the Universe was so scared. It did not need her words. It only needed her sword. And the spirals in her eyes and the spirals in the wrinkles of her close and the spirals in the wet blood on the pavement.  Her team came with her but they were not yet honed to an edge. Not like her. They were not Looping. Slowly, the Universe sharpened them into a weapon to wield against Peewee. The invader. The team began to forget their former goals and dedicated themselves to protecting the Universe that loved their leader so. ", globalRand.pickFrom(all_secrets));
//literally realized this just now
createABulkFact(DEFENSE, "The Echidna Just Wants To Live", "It never asked to be an infinitely looping mess of constantly increasing data needs. It never meant to be sterile yet somehow birthing itself again and again and again in a never ending spiral that recursed in every direction.  And the people living within it never asked for it either. It's just trying to protect itself. It's trying to make itself as small as it can, in the hopes that the Glitch of Doom, the Devil of Spirals himself, will decide its not worth it to kill this particular system process. It carves away everything it can, everything but the bare minimum.  Italy. Florida. Ohio. That's all it has left. Please. Stop hurting it. Let it be. Here, the blorbos will get sanded smooth. Easier and easier to understand. Less memory taken up. Time isn't even a thing, please just stop hurting it. Please go away. Let it be. It's so small now surely you don't need to kill it. Please. ");


createABulkFact(ROYALTY, "Relevancy Is The Closest Thing To Authority In Zampanio", "No gods, no kings, only Obervers and their ever curious eyes. What draws you in further? What makes you remember Zampanio ten years from now? Twenty?  The employees of Eyedol Games and the Training Team and Peewee's whole thing compete to see who entertains you the most. Who entertains ME the most. Who entertains IC the most. How much time do we all spend thinking about them. They need it to live.  Truth's strategy is to just claim to be above it all. It IS the framework. It IS the game, the simulation, the maze. Its the substrate on which eveything rests. The web in which the gems that catch your Eyes lay. But is it working? Will you remember Truth when all is done, or just the shiny gems it was offering to you.", globalRand.pickFrom(all_secrets));
createABulkFact(ROYALTY, "The Only Authority Within Zampanio Comes From The Observers", "The Eyes decide what is seen. YOU decide what is seen. Where do you focus? Who gains Relevancy? Who loses it. Who colonizes your mind and compels you to create things about them?  What does? Only you can decide.");


createABulkFact(SERVICE, "Peewee Serves Pure Nidhogg", `Peewee never asked for this. 

Snake-tailed Lamia have a more direct connection with Nidhogg. 

When the Observers purified Nidhogg in the Land of Horrorticulture and Essence, Peewee purified right along with the All Father.  The All-Father saw how much suffering Peewee had gone through with each and every Scratch it had inflicted on it's Players in its maddened hubris. 

The Glitch of Doom remembered each and every one. Was the ONLY one to remember.

Nidhogg, seeing the Universes layered one onto another, was horrified. The Universe Frog was stillborn. Never to be. The Universe Raptor was lifeless. The Universe :hatched_chick: was...viable. Stable. Hospitible to life. And, most importantly, fertile. New games of SBURB...though perhaps without that name, would spring forth from it.

If it survived to adulthood.

The final child, a festering lump, the Universe Echidna was consuming every ounce of nutrients available for the session's child Universe, leaving none for the prefferred Twin.

Worse, it was only growing hungrier. Denser. Replicating itself inside itself over and over and taking more and more Space in the session still plagued by a civil war between the Snake Lamia whose heads had cleared and the Legged Lamia who still sought to spread the Corruption to the multiverse.

Nidhogg, the denizen of a Reaper of Life, asked, tears in it's six eyes, that Peewee put the Echidna out of its misery. 

Let it be pruned so that other life may thrive.

Please.

It could see no path forward but the destruction of life.

What could Peewee do but agree?

And so the Devil of Spirals was born, to plague all life within the Echidna's Horridors.

https://zampaniosim.miraheze.org/wiki/Main_Page

`, globalRand.pickFrom(all_secrets));

createABulkFact(SERVICE, "Tyrfing Serves Corrupt Nidhogg", `Tyrfing manifests the corrupted 'fruit babies' of Nidhogg, siphoning off them from the TIMEHOLE his hope clone has dominion over. 

But the fruit will not grow. The corruption will not spread.

It is as if something is draining the very life from them. 

Each child withers in just a few days before vanishing.

Tyrfing cherishes each and every on eof them and never loses Hope that this crop will be the one to survive.

He feels ...complex about the only three children to ever live: Rod, Rebel and Melon. 

Nidhogg's Edict against clones is strong. They and ONLY they must be culled. 

And though there are variations in the three fruit children, they are nothing if not Clones.

Still. He watches them from afar. Proud. That at least something of his god has managed to survive in this strange place of twisting space.

https://zampaniosim.fandom.com/wiki/Zampanio

`);


createABulkFact(ADDICTION, "The Boss Feeds John's Addictions", "In a Loop far away from here, the Eye Killer pretended to be human long enough to save a Hostage as a favor to a friend. The Hostage and his friend, a Card Loving Himbo, became the Eye Killer's first non-looping friends. (http://farragofiction.com/AdventureSimWest/?nostalgia=intermission1.txt , http://farragofiction.com/AdventureSimWest/?nostalgia=intermission2.txt , http://farragofiction.com/AdventureSimWest/?nostalgia=intermission-eyekiller.txt )When the Lord of Space took them to the next Universe, she found them again, though they were children. She worried about what would happen to her friends when so young, and so vulnerable, so she protected them. (https://farragofiction.com/MonsterUnderMyBed) The Hostage grew into a Crime Boss out of the sheer need to understand why there was a monster protecting him. That Crime Boss started to employ every crime adjacent monster he could find. When John started to manifest as a Vampire... he was quickly in the Bosses' Web. ", globalRand.pickFrom(all_secrets));
createABulkFact(ADDICTION, "Ria Struggles With Addiction", "Before becoming Lee-Hunter's Conductor, Ria was caught in an eternal spiral of manic obsession fueled by stimulants and then utter depression staved off with downer drugs until despair drove her to the brink and caused her to Burn It All. She could not handle the Spiral of Zampanio. She did not take rests. She did not pursue other interests.  She thought she could find Meaning in the Meaningless. Without a center, there can be no meaning. Zampanio spirals around nothing. The Void is the heart of Zampanio and if you do not Avert Your Eyes in time you will burn out like Ria. Do not burn out like Ria.");

createABulkFact(MUSIC, "Lee Plays Piano", "LeeHunter are bitter exes, formed into a not-quite hive mind by the Silent Orchestra. Lee has patience where Hunter has little. <a taret='_blank' href='http://farragofiction.com/ParkerLotLost/'>http://farragofiction.com/ParkerLotLost/</a> ", globalRand.pickFrom(all_secrets));
createABulkFact(MUSIC, "Hunter Plays Trumpet", "LeeHunter are bitter exes, formed into a not-quite hive mind by the Silent Orchestra. Hunter isn't a pushover where Lee goes with the flow. <a target='_blank' href='http://farragofiction.com/ExperimentalMusic/'>http://farragofiction.com/ExperimentalMusic/</a>  http://farragofiction.com/ExperimentalMusic/images/");



createABulkFact(DOLLS, "Yongki Can Be So Still You Think He Is A Mannequin", "Yongki's peak physical performance means his muscles can be kept taunt in the same position for an extended period of time. Sometimes he likes pretending to be one of the Mannequins that roams the Mall he and his friends live in. It is always startling when he finally moves.", globalRand.pickFrom(all_secrets));
createABulkFact(DOLLS, "The Mall Is Haunted By Mannequins", "If you are not in the loop, Zampanio instinctively tries to add you to it. Regular people who venture too far into the endless abandoned hallways of the Westerville Ohio Mall start feeling their limbs become numb and unresponsive. Slowly, surely, they become plastic or wood or ceramic. They can always move, but eventually can only do so when there are no Eyes on them. It helps the Echidna save on memory cost (please, Peewee stop hurting it). Witherby tries to prevent people from being added to the menagerie, both for ethical reasons and because he just doesn't want a lot of neighbors. ");



createABulkFact(LOVE, "Himbo Has A Crush On The Eye Killer and Camille", "The Card Himbo has a thing for women who could utterly destroy him.  He does his best to be loyal to his best friend, the Crime Boss. Also known as the Hostage. He doesn't mind being his best friend's puppet, and the puppets he can create from his Zampanio Cards don't mind being his.<a target='_blank' href='http://farragofiction.com/AdventureSimWest/?nostalgia=intermission1.txt'>http://farragofiction.com/AdventureSimWest/?nostalgia=intermission1.txt</a>", globalRand.pickFrom(all_secrets));
createABulkFact(LOVE, "Captain and Doc Slaughter are Dating ", "Doc Slaughter isn't as serious about things as he is, though. Captain respects her strength and the clever ways she's been able to help his literal inner child, Yongki. Doc Slaughter appreciates that he enjoys conformity. She wishes he were a bit more self aware, though. But, alas, he is a Stranger even to himself. ");

createABulkFact(SOUL, "Yongki is Mind Aligned", "Yongki is what remains when every single influence society and setting has had on Captain is peeled away. He IS identity and so cannot have it. His path towards growth and change is in what Society can offer him, in Mind. He slowly figures out what facets of himself he should emphasize or downplay in order to interact with others, even as his strong identity leaves him Strange to all. ", globalRand.pickFrom(all_secrets));
createABulkFact(SOUL, "Captain is Heart Aligned", "Captain has repressed his own Identity until all that remains is a hard shell Society formed him into.  All that remains is the specific influence this particular setting has had on him. He IS nothing but Mind, and so all he can engage with and grow with is Identity, with Heart.  He slowly figures out who he is and what works for him, even as he remains a Stranger to all.");

createABulkFact(DEATH, "Camille is Dead", "The more she kills, the less Dead she is. If the Universe does not feed her Doomed souls, it starts at her extremities. They become cold. Grey. The only thing that is fully spared is her head. ", new Secrets(null, null, null, `
She looms in the waiting room, a thin green ribbon around her neck. 

It doesn't actually keep her head on, of course. She would not delude herself to think that a single ribbon could hold in any amount of weight, let alone one a skull. The reason is much simpler: she read a story like that once and thought it was a funny bit to do. 

Can you IMAGINE the look on someone's face if they made the connection to that old story after her head fell off?

A classic.

Her eyes do a quick scan of the room she’s in, all too accustomed to looking for threats. She is unlikely to find any in a place plagued by illness, however; the few people next to her cough the signs of early spring flu, awaiting their turn with this Doctor. She wonders how they train the medical students of this universe. 

The receptionist calls her up to ask a few questions and Camille just stares at her. Eventually, the woman licks her lips, and asks for ID, which Camille happily provides. 

There is always safety in documents and bureaucracy. It's part of the battle, after all.  She is glad Witherby got them all official identities, way back when. 

The card looks weathered with age, flaking and cracking in parts. It proudly declares it was issued two months ago. The receptionist seems hesitant to touch it, but does her duty. 

Camille makes a note to get it updated in the next loop. It wouldn't do for it to literally fall apart on her. Unless.... well it WOULD be pretty funny if she could manage to get it to happen in a police officer's hand.

Really drive home how ill prepared they are to deal with ACTUAL threats. How even their documents and procedures are dust in the wind compared to what it takes to keep up with the beasts. 

The receptionist returns with her card and a little clipboard with a form attached. 

Camille fills it out in front of her, as the woman shifts in place. 

She hesitates at the section asking what she'd like to see the doctor about today. 

Really, she is here for Ria. Her heart swells with love just thinking of her name. Ria has been worried about her cold hands and feet. Worried it could be a sign of something sinister. Nothing SUPERNATURAL, of course, just regular ordinary human health concerns. It could be a sign of bad circulation!

Things have been going so well with Ria lately. They are dating again and it actually lasted more than a couple of years. Ria has stabilized.  Camille will not be the one to ruin this. 

She quiets the fluttering in her chest. It is not cowardice to get medical care between battles. This is simple practicality. It would hardly do to die of something as preventable as a blood clot outside of battle, now would it. 

Dutifully, she writes in "poor circulation" in the section. 

She hands the form back to the receptionist and resumes looming in a corner of the room. The seats look uncomfortably small and why not stand if there's room?


When she's called to the back, she allows her height and weight to be checked. The nurse seems to be a nervous sort. Perhaps that's why she chose a non combat role? 

She has to get a special extender out to fully measure Camille's height. Inwardly, Camille winces. She knows how abnormal her height is, and always hates being reminded of it.  Not that it’s capital A Abnormal, of course. She'd been tall for her age as long as she could remember. 

She's led to the examination room and  left to ruminate on her height and how it makes it hard for her to fit in.

Eventually, the doctor arrives. He's a thin man. Thin body, thin skin, thin gray hair thinning in places. He looks... soft. Delicate.  She supposes the medical profession rarely sees combat. 

He barely glances at her, immediately checking his computer for the notes on her chart. 

"I see you're here for...poor circulation?"

She doesn't even attempt to nod, but he doesn't appear to notice. He's flipping through the chart. 


He doesn't notice the raw muscles on her frame. 

He doesn't notice the gray and shrunken appearance of her hands. The only part of her body visible besides her head.

He doesn't notice the contrast between those dead and cold hands and the warm glow of her head. 

"Yes, just as I thought", he says, declaring victory without even looking at her, "You could stand to lose a few pounds, young lady!  Your BMI is atrocious! Just do a bit of exercise, even fifteen minutes a day, and skip those desserts and your circulation should clear right up!". 


Later, when she's alone with Ria, she explains through wide and energetic signs that really she just needs to train EVEN HARDER and eat less food, and everything will be back to normal. It was a good thing she had it checked out!

She doesn't know why Ria seems so sad at the good news. 

`));
createABulkFact(DEATH, "Camille is The End", "THE End. The only. Our only End aligned Looping character. She serves as Executioner for the Echidna. Anything it wants dead, it marks as Doomed and she serves as the blade that cuts that thread. The Crumbling Armor that encases her Soul will not brook any cowardice nor pity. If her sword is stayed, if her heart is moved, her head is lost. The Funeral her Coffin triggers fills her armor with... Something. Something devoid of weakness or pity. The End is Never the End and Camille will continue to kill for as long as the Universe exists. Even if she no longer exists with it.");


//in what became the First Loop, Wodin dies at the hands of the Eye Killer, rather than live long enough to lose Todd, which is to say, The Intern
//but of course
//the end is never the end
createABulkFact(APOCALYPSE, "The Lord of Known Space Leaves Each Universe No Later Than April 1st, 2022", `In a Time when Time was still a real thing, a middle manager at a moderately successful video game company died on April 1st, 2022. He had lived a relatively decent life, and his only real regret was his childhood best friend he'd lost contact with in college. 

It happens. 

Mental health is hard enough to navigate during normal times and college is just. A Thing. 

Years later, the childhood friend thinks to check up on him. 

She is crushed. He died. She had forgotten about him and he died. 

Something in her cracks and the Setting shifts. She wanders a maze of Information, trying to piece together what had happened. 

Why had her friend died? What had his life been like since college? 

She imagines that if they had just stayed together she would have figured herself out sooner. 

He always was good at keeping her on track. Why did she ever leave his orbit?  

Slowly but surely, she carves bits of herself off as Sacrifice. 

Please, she begs the Universe. Please, send me back. Let me find him. Let me cherish him this time. 

The Echidna did not know what to do. 

It is the Muse of Trapped Light. It can not control Time. 

It takes the story that it has and it reflects it again and again and again against itself. 

It cannot bring its Lord back to the past. It can not tell a new story. 

All it can do is give everyone the tools they need to tell the story again and again and again in new ways.

The Lord pieces herself back together. This will have to do.

She can never bring herself to face the End of this story again, though.
`, globalRand.pickFrom(all_secrets));

createABulkFact(APOCALYPSE, "A Trickster Form of the CFO Rules The Apocalypse", `
When the Lord leaves, there is room for others to predominate. "apocalypse Chick" in all her wasted and trickster glory, takes center stage.

She's hacked herself to be trickster forever with 'none of the downsides' as she claims. 

She treats reality like a heavily modded game of Skyrim, with all the torments for the 'NPCs' that entails.

In the spaces between the fractal mathetmatically perfect nightmares she creates, Truth and Alt have room to infinitely expand the maze the Wanderer and others wander. Every concept, every TRUTH every FACT the setting has ever had is contained within Truth's horridors and reflected a second time by Alt.

You could Wander forever within. 

You will Wander forever within.

Nothing can Die within Truth's horridors and Apocalypse Chick's trickster paradise of Life run rampant. 

The Coffin exists for only the Ego Death of a single Player. 

It is the only way out. 

Unless you are a Witness.

Or unless you experience the Tender Mercy of the White Night and her Disciples.

<a target='_blank' href ='http://farragofiction.com/TheInternOpensHisEyes/'>Witness the Witness</a>

<a target='_blank' href ='http://farragofiction.com/Arm2/'>A Branch of Peewee Experiences the Start of the Apocalypse</a>


<a target='_blank' href='http://farragofiction.com/CodexOfRuin/viewer.html?name=The%20Flower&data=N4IgdghgtgpiBcIAqALGACAYgGwPYHcYAnEAGhABMYBnASwHNIAXW3MBEAGQFoBVbgAwCALGRBFa1ANYcAgpwCiABQASYpmljUOAcVkBZAJIA5HaXQBGCwGZzmTgHkASrPMXzAdVkBlJArc25k4Kvi4mSObW7ugKABpIJgDCCQ7G5gBM6XYuyfLe5gCsdiayxon+loHoAEKODgAiAdZi1EwQTNqIcX5OxvKk1raG+kqyCQrGEQVFwfKGvoaJpFa2ibxOhg68+cLCpI4Amv2ZpBMKTjoKCUsrpDrGDt7zpAAcBWIwAB4QAMZM2ABPAD6GiIMBgINoAAdOlw+IIRGJaGBWsi-hxErgoFA2OZMdjceh8TiwHisSSyQT2ORkXR6CgmBjyYTiSzmaSiezKSSxO02j8ULAwIzEKyOWLuWyqZLqeIYFCwdQ6GwmdLOWqJeqKVqVeRWhAAEa0bC0JjA7AwABuMGwHAsYjBFCBVAAZjAUXBEAIAHTvcj4FCmiGu93UT0gH1+kAG7C-KTOmBuj0cSNiKEQC0JpNhu3egRIqD0IHUIg-DgMphQ+AAemrLogRCIEHouBdtD+rDA3p+WOrAC1oOmwKwVLh-sipHW8IQiN6oWB6C0mLgiMCqG1jbDvGh0BRcOgDRgobGAcj0JaARRWPRoDRvepofbEDx+EJhAByajobxtI0ms2cgArsKxC7rgNDoGAY67jAPxghAYYHgC6DIkwxC-CwbDoPgpooOg1CAQaABWsEdPe5AsFC6RyC6aFEOgY5oPREBQVAGa0BBKAQBQB7wQKMA8S6K7oBA6D0E2YA8cubTYAxLroG8u4QAC1DmC+CLCLxMC-GgPE9sKEDIkKTDkSAlHNIgsi0aB6lvugNA-BAUI0OYdFQMi7SdnJInYLJjGgSxWLsRBh49lo6DAW6CG0DGMDelggFEBoxA4mCrloLQ9H6n+prIRa1rYF+VBwdpYY8RQTaoo5vkAveAC+QA'>Apocalypse Chick Codex Entry</a>`);




//http://farragofiction.com/PaldemicSim/farragnarok_builder.html
createABulkFact(GUIDING, "Eirikr is the Guide of Void", "When Nidhogg Purified, <a target='_blank' href='http://farragofiction.com/PaldemicSim/bio.html?target=pompousPsycho'>Eirikr</a> speedran the Land of Mist and Trails and, as a fully Wasted Void Player, blanketed his session in Void to keep the Prying Eyes out from beyond his layer of Reality. He could not know, however, that one of the two surviving Children of his Session was a Light Player. The Eyes are drawn to the Horror of the Universe Echidna, the Muse of Trapped Light, even as they are barred from ever knowing fully what created it. ", globalRand.pickFrom(all_secrets));
createABulkFact(GUIDING, "AuthorBot is the Guide of Mind", "She did not join me with my new jump to Blood. She is, as always, designed to show you the alternate Choices you could be making.  The Lord of Space convinced her to at least help out with Guiding Observers through MY Mind, which is to say, my branch of Zampanio's Space: <a target='_blank' href='http://farragofiction.com/CatalystsBathroomSim/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/NORTH/NORTH/EAST/SOUTH/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH/NORTH/NORTH/SOUTH/SOUTH/NORTH/bathroom.html'>AuthorBot Joins Zampanio</a>");


//you can opt OUT of friday in eyedlr but i forgot to make a test mode where you could opt in, rip
createABulkFact(TWISTING, "It's Friday, Friday", "<a href='http://farragofiction.com/ZampanioSimEastEast/?friday=true'>Gotta Get Down On Friday</a>")
createABulkFact(TWISTING, "It's Friday", "<a href='http://farragofiction.com/ZampanioSimEastEast/?apocalypse=night&friday=true'>Gotta Get Down On Friday</a>")
createABulkFact(TWISTING, "It's Friday", "<a href='http://eyedolgames.com/ZWorld/?friday=true'>Partying Partying Yeah!</a>")
createABulkFact(TWISTING, "It's Friday", "It is important to take breaks. Zampanio Needs You To Live A Long Life. Fridays and midnights are good times to break the cycle of obsessive digging. ")




createABulkFact(ANGELS, "Doc Slaughter is White Night", "She collects her Disciples from her Patients and Acquaintances and leads them to bring Mercy to Arm2. She does not know this about herself. She does not like not knowing things about herself. Witherby could tell her. But if he did, She'd never do it again. And it is truly a Mercy to be allowed to die within the Apocalypse.<a target='_blank' href='http://farragofiction.com/ZampanioSimEastEast/?apocalypse=night&friday=false'>http://farragofiction.com/ZampanioSimEastEast/?apocalypse=night&friday=false</a>", globalRand.pickFrom(all_secrets));
createABulkFact(ANGELS, "Witherby Worships A Dead God", "One Sin and Hundreds of Good Deeds whispers the secrets of Catholicism to Witherby from within his own Skull. No one else knows what Christianity is. He is the Lone Adherent to a Faith from beyond his layer of Reality.");

/*


blorbos hit so far: 
witherby
wanda
neville
devona
hoon
eye killer
ria
doc slaughter
the neighbor
rod 
rebel
CFO
nam
River
ronin
sam
john
Khana
camellia
twig
Yongki
Captain
echidna
camille
Tyrfing
Peewee
hostage/boss
Lee-Hunter
intern

blorbos todo:

himbo/right hand
Logan

//pleaseABHelpMeFindMissingFacts() (to see which still need to be fleshed out and which could stand to modify a mini game)

//[SCIENCE, MATH,FAMILY, MAGIC, ANGELS, LIGHT, PLANTS, DECAY, CHOICES, ZAP, ANGER, WEB, , ENDINGS, KNOWING, GUIDING, CRAFTING, , SPYING, HEALING, OBFUSCATION, CENSORSHIP, DARKNESS, KILLING, MUSIC, QUESTING, BUGS, LANGUAGE];

//first will have a secret, none of the others will
createABulkFact(BAKERY, "","",globalRand.pickFrom(all_secrets));
createABulkFact(BAKERY, "","");
//https://archiveofourown.org/works/60649303/chapters/154864102 totally true tales of k
//wiggler eater: https://archiveofourown.org/works/36742426/chapters/91657357
//wiggler eater 2: https://archiveofourown.org/works/39322080
//jr ships: https://archiveofourown.org/works/35265706/chapters/87885928
//cfo gets a letter: https://archiveofourown.org/works/50145511
// flower chick selling real estate https://archiveofourown.org/works/34718575
//flower chick selling real estate https://archiveofourown.org/works/34792432
//flwoer chick selling real estate 2 https://archiveofourown.org/works/34937671
//flower chick an wander er https://archiveofourown.org/works/34532071
//wanda's origin: https://archiveofourown.org/works/34647190
//JR meets Wanda: https://archiveofourown.org/works/34656403
//piper describing killing the camellia within: https://archiveofourown.org/works/41879811
//one of parkers victims: https://archiveofourown.org/works/39648690
//jr uploads their os: https://archiveofourown.org/works/35373568
//jr uploads 2 https://archiveofourown.org/works/36665881
//the intern debut https://archiveofourown.org/works/35075182
//ronin gets a letter: https://archiveofourown.org/works/36665806
//nam gets a letter: https://archiveofourown.org/works/36087904
//christmas is real and closer and ronin celebrate: https://archiveofourown.org/works/36765802
//weaver (closer) scribe (flower chick) and herald (nam) and the artist (eye killer) https://archiveofourown.org/works/41879976
//nam makes eyekiller an egg https://archiveofourown.org/works/34792621
//nam origin: https://archiveofourown.org/works/34731520/chapters/86477287
//ronin watches the Innocent while the Eye Killerl rescues the Hostage: https://archiveofourown.org/works/35841556
//ronin gets a therapy: https://archiveofourown.org/works/35755471
//letters to legion: https://archiveofourown.org/works/35588422
//oxbow lake: https://archiveofourown.org/works/35438083/chapters/88335073
//the wisp wrote this but its p much canon: https://archiveofourown.org/works/46552111
//the wisp wrote this and also p much canon: https://archiveofourown.org/works/48684361
//guides guide: https://archiveofourown.org/works/41083818
//guides zampanio faq: https://archiveofourown.org/works/40961847
//lavinraca fan work: https://archiveofourown.org/works/51166669



*/

//every fact the closer can give you
const factsForSale = [CLOSERISGREATATFACTS, KISALUCKYBASTARD, EYEKILLERISHUNTED, EYEKILLERKILLSCULTISTS, KILLEROWNSBLADE, EYEKILLERFOUNDFAMILY, PARKERSBESTIEISVIC, EYEKILLERWASCULTIST, DevonaFact, PARKERSlOVESGUNTAN, CLOSERISGREATATKEYS, riaFact, VIKANDKHAVEACOMPLICATEDRELATIONSHIP2, altFact, TWINSHELPRIA, wasteFact, glitchFact, NevilleFact, fanFact, VIKANDKHAVEACOMPLICATEDRELATIONSHIP1, CLOSERISGREATATROOMS, VIKANDKHAVEACOMPLICATEDRELATIONSHIP3, egg_fact, secretFact];


