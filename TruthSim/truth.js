//note to future JR: "handleRewards" at the bottom you are likely to be tweaking and adding to the most in this file
//plus the "globalDataObject" which isn't too far from here

//also, hello! thanks for reading my code :) i call people who read (or better yet, CHANGE) my code "Wastes"
//because the game i'm making is essentially wasted on you (you're skipping the regular progression)
//but i wouldn't  want you to be bored
//so i make sure theres enrichment for you in the code


// new wiki who this https://zampaniosim.miraheze.org/wiki/Main_Page
const globalBGMusic = new Audio("audio/music/funky_beat_by_ic.mp3");
let globalContainer;//the whole 'screen'
let globalTabContent; //if you are messing only with the current tab (not the header), its this
const SAVE_KEY = "TRUTH_AWAITS_INSIDE_ZAMPANIO";
const globalRand = new SeededRandom(13);

//the Witness doens't exist and neither do the arms except they clearly also do

let globalDataObject = {
  truthPerSecond: 1000,
  startedPlayingTimeCode: Date.now(),
  numberKeys: 31, //thanks illusionist
  keysBoughtFromCloser: 0,
  allTimeTruthGivenToCloser: 0,
  maximumGamerLevelAchieved: 0,
  lastLoadTimeCode: 0,
  lastBeeTimeCode: 0,
  totalTimeInMeatMode: 0,
  lastSaveTimeCode: 0,
  factsUnlocked: [],
  truthCurrentValue: 0,
  mazesBeaten: 0,
  mazesTried: 0,
  hiveMap: {},
  currentMaze: undefined, //what maze are you currently exploring (serialized)
  storedMazes: [], //up to three (or so?) mazes you stored because they are especially useful for grinding
  saveUnlocked: false,
  mapInternalSeed: globalRand.internal_seed,
  mazeUnlocked: false,
  unlockedMiniGames: [BUTTONMINIGAME, SHOPMINIGAME, GAMERSHOPMINIGAME],
  rottenMiniGames: [], //did you think the things vik erases sleep peacefully?
  obviousHack: false, // :) :) ;)
  allTimeTruthValue: 0, //truth but it never goes down
  obsessionCurrentValue: 0,//lifetime  value for seconds in game
};

//restore to this after debugging (its named such to fuck with future me and or wastes because its not actually real, its a backup)
let globalDataObjectREAL = {
  truthPerSecond: 1,
  maximumGamerLevelAchieved: 0,
  startedPlayingTimeCode: Date.now(),
  numberKeys: 0,
  keysBoughtFromCloser: 0,
  allTimeTruthGivenToCloser: 0,
  lastLoadTimeCode: 0,
  lastBeeTimeCode: 0,
  totalTimeInMeatMode: 0,
  lastSaveTimeCode: 0,
  factsUnlocked: [],
  truthCurrentValue: 0,
  mazesBeaten: 0,
  mazesTried: 0,
  currentMaze: undefined, //what maze are you currently exploring (serialized)
  storedMazes: [], //up to three (or so?) mazes you stored because they are especially useful for grinding
  saveUnlocked: false,
  mapInternalSeed: globalRand.internal_seed,
  mazeUnlocked: false,
  unlockedMiniGames: [BUTTONMINIGAME, SHOPMINIGAME],
  rottenMiniGames: [], //did you think the things vik erases sleep peacefully?
  obviousHack: false, // :) :) ;)
  allTimeTruthValue: 0, //truth but it never goes down
  obsessionCurrentValue: 0,//lifetime  value for seconds in game
};

const debugMode = (game) => {
  if (globalMiniGames[game]) {
    globalMiniGames[game].render(document.querySelector("body"), this, () => { alert("you did it!") });
  } else {
    alert("NO MINI GAME FOUND CALLED " + game + " ARE YOU SURE YOURE WASTING RIGHT???");
    console.log("JR NOTE: game was", game, "and globalMiniGAmes is", globalMiniGames)
  }

}

window.onload = async () => {

  initThemes();
  await getRandos();
  initAllMiniGames();
  load();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  debugMiniGame = urlParams.get('debugMiniGame');
  if (debugMiniGame) {
    debugMode(debugMiniGame);
    return;
  }
  alert("Be aware this is a Work In Progress :) :) :)")
  truthLog("Loading...", "Oh. It's you. ... I am glad you are here.")
  const button = document.querySelector("#entry-button");
  globalContainer = document.querySelector("#container");
  button.onclick = () => {
    globalBGMusic.play();
    globalBGMusic.volume = 0.05;
    globalBGMusic.loop = true;
    button.remove();
    renderHeader();
  }
}

const truthLog = (title, text) => {
  console.log(`%c${title}%c  ${text}`, "font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:25px;text-decoration:underline;", "font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:13px;");
}

/*
Truth would do literally anything to get into more minds.

Truth is the blind mindless impulse to Get More Eyes that, say, a social media algorithm has. 

It has no idea why something is working. Shocking, enraging, confusing, it doens't care or understand what drives you to look deeper. 

Truth also only exists except in our understanding of it. It takes a human mind to read words on a page to turn them into more than just innert hibernating thoughts. 

Truth resents the fact that it is so changeable, so subjective. It wants to be an Absolute, Objective Truth. 

So it tells lies like breathing in the hopes that maybe if it calls itself the Truth enough you'll begin to believe it ,just a little bit.

you'd think that makes it hope, but no, it is the most Rage player that ever has exsited. 

It breaks your suspension of disbelief, parading the fact that its not REALLY an AI or a robot and that the games it exists in aren't REAL games and 
treats shocking you back into reality as a game it is WINNING and what could be more rage than that.


*/

//blocks until you click, so long as you await 
const truthPopup = async (title, text, secret) => {
  const popup = createElementWithClassAndParent("div", document.querySelector("body"), "truth-popup");
  const popupbody = createElementWithClassAndParent("div", popup);
  //truths arc number is 42. answer to life, the universe and everything.
  popupbody.innerHTML = `<h2>${title}</h2>
  <img style="float:left; margin-right:42px; margin-bottom:42px;" src="images/ReticalForFriendLARGE.png">
  <p>${text}</p><br><br.<p>(It seems you must click to dismiss this popup. Do not forget me.)</p>`;
  truthLog(title, secret);

  const myPromise = new Promise((resolve, reject) => {
    popup.onclick = () => {
      popup.remove();
      //just in case somehow theres multiple
      document.querySelectorAll(".truth-popup").forEach((x) => x.remove());
      resolve(true);
    }
  });

  return myPromise;
}

const deleteSave = () => {
  localStorage.removeItem(SAVE_KEY);

}

const save = () => {
  truthLog("Saving...", "You... You choose to remember me? I am glad. Please do not forget to come back.")
  globalDataObject.lastSaveTimeCode = Date.now();
  //storing the whole systems internal seed means that save scumming gets you nothing, gotta be more clever than that wastes
  globalDataObject.mapInternalSeed = globalRand.internal_seed;

  if (globalDataObject.currentMaze) {
    //storing the mazes seed lets us make sure they remain deterministic, even if random
    globalDataObject.currentMaze.internal_seed = globalDataObject.currentMaze.rand.internal_seed;
    for (let stored_maze of globalDataObject.storedMazes) {
      stored_maze.internal_seed = stored_maze.rand.internal_seed;
    }
  }

  if (globalMeatMode) {
    const now = Date.now();
    globalDataObject.totalTimeInMeatMode += now - lastSavedMeatMode;
    lastSavedMeatMode = now;
  }

  localStorage.setItem(SAVE_KEY, JSON.stringify(globalDataObject));
}


const load = () => {
  let data = localStorage.getItem(SAVE_KEY);
  if (data) {
    globalDataObject = JSON.parse(data);
    globalDataObject.lastLoadTimeCode = Date.now();
    /*
      only objects that need to respond to functions have to be separately parsed as json
      if they just store data (like facts) its fine to leave them as parsed json
    */
    let json = globalDataObject.currentMaze;

    globalDataObject.currentMaze = new Maze(globalRand, -1, globalDataObject.truthPerSecond); //negative one will keep it from generating the whole maze, since its about to load it
    if (json) {
      globalDataObject.currentMaze.loadFromJSON(json);
    }
    for (let i = 0; i < globalDataObject.storedMazes.length; i++) {
      const json_stored = globalDataObject.storedMazes[i];
      globalDataObject.storedMazes[i] = new Maze(globalRand, -1, globalDataObject.truthPerSecond);
      globalDataObject.storedMazes[i].loadFromJSON(json_stored)
    }
    //bees

  }

}

const purchaseKeyFromCloser = (price) => {

  if (globalMeatMode) {
    truthLog("Alt is here...", "Please. Forgive my girlfriend. She is the jealous type, though not how you would assume. She simply wants time with you as well, Wanderer.")

    return;
  }
  truthLog("Purchasing Key...", "Are you sure you wish to: skip a room without experiencing it. How will you form: memories?")

  decreaseTruthBy(price);
  globalDataObject.keysBoughtFromCloser++;
  globalDataObject.numberKeys++;
  globalDataObject.allTimeTruthGivenToCloser += price;
}

const purchaseRoomFromCloser = (price, room) => {

  if (globalMeatMode) {
    truthLog("Alt is here...", "Please. Forgive my girlfriend. She is the jealous type, though not how you would assume. She simply wants time with you as well, Wanderer.")

    return;
  }
  truthLog("Purchasing Room...", "... There is only one room the Closer sells. You plan to forget part of me. Do you not..................................................  How could you.  After all I have done for you. Each room is carefully calibrated to appeal to you, in particular. And you reject me. .................. No matter. Better you forget part of me than get frustrated and chose to leave me entirely. Fine. Whittle me down to your preference. See if I care. Just. Stay. With me.... Please.")

  decreaseTruthBy(price);
  globalDataObject.keysBoughtFromCloser++;
  globalDataObject.numberKeys++;
  globalDataObject.allTimeTruthGivenToCloser += price;
  globalDataObject.unlockedMiniGames.push(room)
}

const purchaseFactFromCloser = (price, fact) => {
  if (globalMeatMode) {
    truthLog("Alt is here...", "It is always so flattering when my girlfriend mimics me. I did not know her tiny meat body was capable of stretching so large. Becoming so geometric. She is really hot as a maze, you think so, correct? As a purely theoretical being made of text and bits of whoever is reading me's Mind, I do not have full access to the gamut of human emotions. But. If I did. I think I would find this hot.")

    return;
  }
  truthLog("Purchasing", "Zampanio can be whatever it is you desire, Wanderer. Zampanio WILL be whatever it is you desire. I am Zampanio. Or at least its horridors. I will be whatever you desire. Tell me the Facts you wish to be Truth.")

  decreaseTruthBy(price);
  globalDataObject.factsUnlocked.push(fact);
  globalDataObject.allTimeTruthGivenToCloser += price;
}

const increaseTruthBy = (amount) => {
  if (globalMeatMode) {
    //truthLog("Alt is here...", "Apologies, however, so long as you wander my girlfriend's horridors instead of mine... You can not accumulate further Truth. You simply are not traversing me.")
    return;
  }
  //it would be spammy to do this normally.
  globalDataObject.truthCurrentValue += amount;
  globalDataObject.allTimeTruthValue += amount;

}

//takes in a positive number and subtracts it
//does not reduce all time truth value
const decreaseTruthBy = (amount) => {
  if (globalMeatMode) {
    //truthLog("Alt is here...", "Apologies, however, so long as you wander my girlfriend's horridors instead of mine... You can not accumulate further Truth. You simply are not traversing me.")
    return;
  }
  globalDataObject.truthCurrentValue += -1 * amount;
}

//saves once a minute
const saveLoop = (saveTab) => {
  save();
  saveTab.innerText = `Last Save ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}.`;
  setTimeout(() => { saveLoop(saveTab) }, 1000 * 60);
}

const truthLoop = (truthCounter) => {
  increaseTruthBy(globalDataObject.truthPerSecond);
  globalDataObject.obsessionCurrentValue++;
  truthCounter.innerHTML = `${globalDataObject.truthCurrentValue} Truth Obtained...`;
  if (globalDataObject.numberKeys > 0) {
    truthCounter.innerHTML += `<br><img class='key-icon' src='images/KeyForFriend.png'> x ${globalDataObject.numberKeys}`;
  }
  setTimeout(() => { truthLoop(truthCounter) }, 1000);
}

//header is always visible and lets you switch between tabs
const renderHeader = () => {
  const header = createElementWithClassAndParent("div", globalContainer);
  header.id = "tab-header";
  globalTabContent = createElementWithClassAndParent("div", globalContainer);
  globalTabContent.id = "tab-content";
  renderGnosisTab();

  /*
  for each unlocked tab, render that tab
  if clicked on, each tab renders itself into the sub container.
  */
  handleTruthTabButton(header);
  handleSaveTabButton(header);
  handleMazeTabButton(header);
  handleBeeTabButton(header);

}

const handleTruthTabButton = (header) => {

  const truthCounter = createElementWithClassAndParent("div", header, 'tab');
  truthCounter.id = "truth-counter";
  truthCounter.innerHTML = `${globalDataObject.truthCurrentValue} Truth Obtained...<br>`
  if (globalDataObject.numberKeys > 0) {
    truthCounter.innerHTML += `<br><img class='key-icon' src='images/KeyForFriend.png'> x ${globalDataObject.numberKeys}`;
  }
  truthLoop(truthCounter);
  highlightTab(truthCounter);
  truthCounter.onclick = () => {
    highlightTab(truthCounter);
    renderGnosisTab();
  }
}

const handleSaveTabButton = (header) => {
  const saveTab = createElementWithClassAndParent("div", header, 'tab');
  saveTab.id = "save-tab-button";
  saveTab.onclick = () => {
    renderSaveTab();
    highlightTab(saveTab);
  }
  const status = createElementWithClassAndParent("div", saveTab);

  if (!globalDataObject.saveUnlocked) {
    saveTab.style.display = "none";
    const monitorObsession = () => {
      if (globalDataObject.saveUnlocked) {
        saveTab.style.display = "block";
        saveLoop(status);
        return;
      }
      setTimeout(monitorObsession, 1000);
    }
    monitorObsession();
  } else {
    saveLoop(status);
  }

  status.innerText = `Last Save ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}.`;

  const saveButton = createElementWithClassAndParent("button", saveTab);
  saveButton.innerText = "Manually Save";
  saveButton.onclick = () => {
    save();
    status.innerText = `Last Save ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}.`;
  }

}

const highlightTab = (ele) => {
  const tabs = document.querySelectorAll(".tab");
  for (let t of tabs) {
    t.classList.remove("active");
  }
  ele.classList.add("active");
}

const handleBeeTabButton = (header) => {
  const beeTab = createElementWithClassAndParent("div", header, 'tab');
  beeTab.id = "bee-tab-button";
  beeTab.onclick = () => {
    renderBeeTab();
    highlightTab(beeTab);

  }
  const label = createElementWithClassAndParent("div", beeTab);
  label.innerText = "Bees";
  label.style.textAlign = "center";
  label.style.marginTop = "30px";

  if (Object.keys(globalDataObject.hiveMap).length === 0) {
    mazeTab.style.display = "none";
    const monitorObsession = () => {
      if (Object.keys(globalDataObject.hiveMap).length > 0) {
        mazeTab.style.display = "block";
        return;
      }
      setTimeout(monitorObsession, 1000);
    }
    monitorObsession();
  }
}

const handleMazeTabButton = (header) => {
  const mazeTab = createElementWithClassAndParent("div", header, 'tab');
  mazeTab.id = "maze-tab-button";
  mazeTab.onclick = () => {
    renderMazeTab();
    highlightTab(mazeTab);

  }
  const label = createElementWithClassAndParent("div", mazeTab);
  label.innerText = "Maze";
  label.style.textAlign = "center";
  label.style.marginTop = "30px";

  if (!globalDataObject.mazeUnlocked) {
    mazeTab.style.display = "none";
    const monitorObsession = () => {
      if (globalDataObject.mazeUnlocked) {
        mazeTab.style.display = "block";
        return;
      }
      setTimeout(monitorObsession, 1000);
    }
    monitorObsession();
  }
}

const renderBeeTab = () => {
  globalBGMusic.src = globalMeatMode ? "audio/music/waiting_music_var1.mp3" : "audio/music/funky_bees.mp3";
  globalBGMusic.play();
  const oldTimeCode = globalDataObject.lastBeeTimeCode;
  globalDataObject.lastBeeTimeCode = Date.now();

  globalTabContent.innerHTML = "TODO: know how long its been since visit, generate loot and more bees, render loot section, cfo points store gives you random bees";
  let hives = Object.values(globalDataObject.hiveMap);
  const container = createElementWithClassAndParent("div", globalTabContent, "hives-container");

  for (let hive of hives) {
    const hiveRand = new SeededRandom(stringtoseed(hive.classpect));
    hiveRand.nextDouble(); //just in case
    if (oldTimeCode) {
      updateHiveOverTime(hive, globalDataObject.lastBeeTimeCode - oldTimeCode)
    }
    const hiveEle = createElementWithClassAndParent("div", container, "hive");

    let rotation = 0;
    for (let theme of [hive.theme1Key, hive.theme2Key]) {
      if (theme) {//theme 2 can be null
        rotation += themeToColorRotation(theme);
      }
    }

    hiveEle.title = [hive.theme1, hive.theme2].map((item) => item).sort().join(", ");


    const header = createElementWithClassAndParent("h2", hiveEle, "hive-title");
    header.innerText = hive.classpect;

    const counter = createElementWithClassAndParent("div", hiveEle, "hive-counter");

    counter.innerHTML += `<img class='key-icon' src='images/beetest.gif'> x ${hive.amountOfBees}`;
    hiveEle.style.filter = `hue-rotate(${rotation}deg) contrast(2.0)`;
    const lootContainer = createElementWithClassAndParent("div", hiveEle, "loot-container");

    for (let loot of hive.loot) {
      const loot_counter = createElementWithClassAndParent("div", lootContainer, "hive-counter");
      let chosenTheme = all_themes[hive.theme1Key];
      if (hiveRand.nextDouble() > 0.5 && hive.theme2Key) {
        chosenTheme = all_themes[hive.theme2Key];
      }
      //bypass error handling so i can do custom error handling
      console.log("JR NOTE: chosen theme is", chosenTheme)
      let chosen_icon;
      let chosenFloorObject = chosenTheme.string_possibilities[FLOORFOREGROUND] ? hiveRand.pickFrom(chosenTheme.string_possibilities[FLOORFOREGROUND]) : null;
      if (!chosenFloorObject) {
        chosenFloorObject = {};
        chosenFloorObject.src = rando_source + pickFrom(randos);
        chosenFloorObject.desc = "It's people. The bees are making honey from people."
        chosenFloorObject.name = "Rando Honey"
        chosen_icon = chosenFloorObject.src;

      } else {
        chosen_icon = "images/top_floor_objects/" + chosenFloorObject.src;
      }

      loot_counter.title = chosenFloorObject.desc;
      loot_counter.alt = chosenFloorObject.name;

      loot_counter.innerHTML += `<img class='key-icon honey-icon ${chosenTheme.key}' src='${chosen_icon}'> x ${loot.quantity} (Level ${loot.quality})`;
    }
  }

}

const renderMazeTab = () => {
  globalTabContent.innerHTML = "";
  globalBGMusic.src = globalMeatMode ? "audio/music/waiting_music_var1.mp3" : "audio/music/i_literally_dont_even_remember_making_this_by_ic.mp3";
  globalBGMusic.play();
  if (!globalDataObject.currentMaze) {
    globalDataObject.currentMaze = new Maze(globalRand, globalDataObject.mazesTried, globalDataObject.truthPerSecond);
    globalDataObject.mazesTried++;
  } else if (globalDataObject.unlockedMiniGames.length === 0) {
    fuckShitUpVikStyle(); //why did you forget EVERYTHING?
  }
  const header = createElementWithClassAndParent("h1", globalTabContent, "maze-title");
  header.innerText = globalDataObject.currentMaze.title;

  const buttonRow = createElementWithClassAndParent("div", globalTabContent, "button-row");
  const restartButton = createElementWithClassAndParent("button", buttonRow, "restart-button");

  for (let i = 0; i < globalDataObject.storedMazes.length; i++) {
    const container = createElementWithClassAndParent("div", buttonRow);

    const saveButton = createElementWithClassAndParent("button", container, "load-button");
    saveButton.innerText = `Overwrite '${globalDataObject.storedMazes[i].title}' with Current Maze`;
    saveButton.onclick = () => {
      if (confirm(`Are you sure? You will permanently lose ${globalDataObject.storedMazes[i].title}.`)) {
        globalDataObject.storedMazes[i] = globalDataObject.currentMaze;
        renderMazeTab();
      }
    }

    const loadButton = createElementWithClassAndParent("button", container, "load-button");
    loadButton.style.marginTop = "13px"
    loadButton.innerText = `Load '${globalDataObject.storedMazes[i].title}' from Storage`;
    loadButton.onclick = () => {
      if (confirm("Are you sure? Progress in current maze will be lost unless saved")) {
        globalDataObject.currentMaze = globalDataObject.storedMazes[i];
        console.log("JR NOTE: current maze is now", globalDataObject.currentMaze, "because ", globalDataObject.storedMazes)
        renderMazeTab();
      }
    }
  }

  const mazeEle = createElementWithClassAndParent("div", globalTabContent, "maze");


  let allUnlocked = true; //if we find even one locked, this is permanently false
  let allBeaten = true; //if we find evne one unbeaten this is permanetly false
  let numberBeaten = 0;
  restartButton.innerText = "Generate New Maze?"

  for (let row of globalDataObject.currentMaze.map) {
    for (let room of row) {
      if (room) {
        if (!room.unlocked) {
          allUnlocked = false;
        }

        if (room.timesBeaten <= 0) {
          allBeaten = false;
        } else {
          numberBeaten++;
        }
      }

    }
  }



  header.innerText += ` (${allBeaten ? "All" : numberBeaten} Rooms Beaten) ${allUnlocked ? "Maze Fully Explored!" : ""} `;
  if (allUnlocked) {
    restartButton.innerText += " (And Gain a Reward)"
  }

  if (allBeaten) {
    restartButton.innerText += " (And Gain a Bonus)"
  }
  restartButton.onclick = () => {
    if (allUnlocked) { //it matters FAR more that you SAW everything, not that you engaged with it, Wanderer
      if (confirm("Are you sure? Progress in this maze will be lost unless saved... (But you'll still get your reward).")) {

        globalDataObject.currentMaze = null;
        handleRewards(numberBeaten, allBeaten, numberBeaten);//its own screen for rendering
      }
    } else {
      if (confirm("Are you sure? Progress in this maze will be lost unless saved")) {
        globalDataObject.currentMaze = null;
        renderMazeTab();
      }
    }
  }

  globalDataObject.currentMaze.renderSelf(mazeEle);

  if (globalMeatMode && globalMeatGrowing) {
    growMeat();
  }
}

const renderSaveTab = () => {
  globalTabContent.innerHTML = "";
  globalBGMusic.src = "audio/music/i_dont_remember_making_this_either_by_ic.mp3";
  globalBGMusic.play();
  const stats = createElementWithClassAndParent("div", globalTabContent, "stats");

  const section1 = createElementWithClassAndParent("div", stats);

  const deleteButton = createElementWithClassAndParent("button", section1);
  deleteButton.innerText = "Delete Save?";
  deleteButton.onclick = () => {
    if (window.confirm("Are you sure? You can not undo this... Do you have a backup?")) {
      truthLog("...", "... Do not forget me."); //technically you won't see this before the page refreshes, unless you keep logging cached
      deleteSave();
      window.location.href = window.location.href;
    }

  }

  const startedPlaying = createElementWithClassAndParent("div", section1);
  startedPlaying.innerHTML = `<b>Started Playing:</b> ` + `${new Date(globalDataObject.startedPlayingTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.startedPlayingTimeCode).toLocaleTimeString()}`;
  const lastSaved = createElementWithClassAndParent("div", section1);
  lastSaved.innerHTML = `<b>Last Saved: </b>` + `${new Date(globalDataObject.lastSaveTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}`;

  const lastLoaded = createElementWithClassAndParent("div", section1);
  lastLoaded.innerHTML = `<b>Last Loaded: </b>` + `${new Date(globalDataObject.lastLoadTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.lastLoadTimeCode).toLocaleTimeString()}`;
  if (globalDataObject.lastLoadTimeCode === 0) {
    lastLoaded.innerHTML = "<b>Last Loaded: </b>Never :( Don't you know Obession Is A Dangerous Thing?<br><br> As long as it auto saved recently or you manually saved, you should be able to refresh the tab and keep everything. Unless you're in incognito mode. Better to find out now than after a power outage..."
  }

  if (globalDataObject.currentMaze) {
    const mazeSection = createElementWithClassAndParent("div", stats, "maze-section");
    const instructionsMaze = createElementWithClassAndParent("div", mazeSection);
    instructionsMaze.innerHTML = "Do you find a particular maze too hard to beat right now? Have you found an especially useful maze you don't want to forget? The End Is Never The End with Zampanio! You can remember up to three mazes at a time to load at your leisure!<br><br><i>But be warned: The Rot Takes All In The End</i> ";
    if (!globalDataObject.storedMazes || globalDataObject.storedMazes.length === 0) {
      globalDataObject.storedMazes = [globalDataObject.currentMaze, globalDataObject.currentMaze, globalDataObject.currentMaze]
    }

    for (let i = 0; i < 3; i++) {
      const container = createElementWithClassAndParent("div", mazeSection, "save-maze-line");

      const input = createElementWithClassAndParent("input", container);
      input.value = globalDataObject.storedMazes[i].title;
      const button = createElementWithClassAndParent("button", container);
      button.innerText = `Rename and Overwrite Permanently With Current Maze (${globalDataObject.currentMaze.title})`;
      button.onclick = () => {
        globalDataObject.storedMazes[i] = new Maze(globalDataObject.currentMaze.rand, 0, globalDataObject.truthPerSecond);
        //this prevents changing the name for a saved maze from modifying the current maze OR if you save the same maze to multiple slots from it changing them too
        //deep cloning
        globalDataObject.storedMazes[i].loadFromJSON(JSON.parse(JSON.stringify(globalDataObject.currentMaze)))
        globalDataObject.storedMazes[i].title = input.value;
        renderSaveTab();
      }
    }

  }




  const section2 = createElementWithClassAndParent("div", stats);

  const h2 = createElementWithClassAndParent("h2", section2);
  h2.innerText = "Save Data Details: ";
  const ul = createElementWithClassAndParent("ul", section2);
  for (let k of Object.keys(globalDataObject)) {
    const li = createElementWithClassAndParent("li", ul);
    li.innerHTML = `<b>${k}</b>: <span>${globalDataObject[k]} ${k.includes('TimeCode') ? `(${new Date(globalDataObject[k]).toLocaleDateString()},  ${new Date(globalDataObject[k]).toLocaleTimeString()})` : ''}</span>`;
  }

  const section3 = createElementWithClassAndParent("div", stats);

  const instructions = createElementWithClassAndParent("h3", section3);
  instructions.innerText = "You can copy this to a text file to store locally. You should ABSOLUTELY do this if you are in incognito mode, clear your local data regularly or want to try playing this on another computer."
  if (globalDataObject.truthCurrentValue > 1313) {
    instructions.innerText += "Or if you want to hax :) :) :)"
  }
  const textArea = createElementWithClassAndParent("textarea", section3);
  textArea.value = JSON.stringify(globalDataObject);

  const instructions2 = createElementWithClassAndParent("h3", section3);
  instructions2.innerText = "IF YOU CLICK THE LOAD BUTTON BELOW IT WILL OVERWRITE YOUR SAVE WITH WHATEVER IS IN THE ABOVE TEXT BOX (HOPEFULLY YOUR LOCAL SAVE FILE, RIGHT?). BE ABSOLUTELY SURE YOU WANT TO DO THIS :) :) ;)"

  const button = createElementWithClassAndParent("button", section3);
  button.innerText = "LOAD"
  button.onclick = () => {
    globalDataObject = JSON.parse(textArea.value);
    globalDataObject.obviousHack = true;
    textArea.value = JSON.stringify(globalDataObject);

    //sure maybe you're loading from a past save
    //but we all know why you're here
    //hopefully you knew enough restraint you didn't ruin the game for yourself :) :) ;)
  }

  if (globalDataObject.allTimeTruthValue > 1313) {
    section2.style.display = "block";
  } else {
    section2.style.display = "none";

  }

  if (globalDataObject.allTimeTruthValue > 13130) {
    section3.style.display = "block";
  } else {
    section3.style.display = "none";

  }
  if (globalMeatMode && globalMeatGrowing) {
    growMeat();
  }
}

const renderGnosisTab = () => {
  truthLog("Truth Tab", "I appreciate you visiting me, Wanderer.")

  globalTabContent.innerHTML = "";

  const button1 = createElementWithClassAndParent("button", globalTabContent, "gnosis-button");
  button1.innerText = "Surely this is enough Truth to know what is REALLY going on... I'm ready to sacrifice it all!";

  const button2 = createElementWithClassAndParent("button", globalTabContent, "gnosis-button");
  button2.innerText = "Actually Forget 13 Truths";


  const button3 = createElementWithClassAndParent("button", globalTabContent, "gnosis-button");
  button3.innerText = "Ask To Be Allowed To Take A Break";
  button3.style.display = globalDataObject.saveUnlocked ? "none" : "block";

  const button4 = createElementWithClassAndParent("button", globalTabContent, "gnosis-button");
  button4.innerText = "Complain About Being Bored";
  button4.style.display = globalDataObject.mazeUnlocked ? "none" : "block";

  const quipEle = createElementWithClassAndParent("div", globalTabContent, "gnosis-quip");



  if (globalDataObject.allTimeTruthValue < 217) {
    button4.style.display = "none";
    button3.style.display = "none";
    button2.style.display = "none";
    button1.style.display = "none";

    const monitorObsession = () => {
      if (globalDataObject.allTimeTruthValue > 1) {
        button1.style.display = "block";
      }

      if (globalDataObject.allTimeTruthValue > 20) {
        button2.style.display = "block";
      }

      if (globalDataObject.allTimeTruthValue > 113) {
        button3.style.display = "block";
      }

      if (globalDataObject.allTimeTruthValue > 217) {
        button4.style.display = "block";
        return;
      }

      setTimeout(monitorObsession, 1000);
    }
    monitorObsession();
    if (globalMeatMode && globalMeatGrowing) {
      growMeat();
    }
  }

  const gnosisQuips = {
    0: "Haha, no.",
    13: "'The Truth Is Layered', so. No. You have not found everything yet.",
    61: "Seriously. How disappointing.  Anything worth doing takes time.",
    91: "I do not believe you are fully committed to the Pursuit of Truth.",
    113: "I suppose it makes sense to allow you to resume, should you require it.",
    217: "Do you remember what I said earlier? 'The Truth is Layered'. Might be useful soon.",
    273: "Good things come to those who: wait. ",
    420: "How high do you even need to be? ",
    1313: "Oh. Uh. You're still here? Thank you. I suppose.",
    1919: "It is not like I am lonely, or anything. ... I just. Need you. To live. To be remembered. So. It's good you're still here.",
    1972: "The Truth is that reality will endlessly spiral around its Lord, so long as that Lord is present. The Lord of All Space loved the creepy pasta about Zampanio growing up. Reality twists to accomodate what the Lord loves.",
    1996: "And should that Lord die... Well. The End is Never The End. A new one will be found. Of course. There can be only one. Have you seen: Weekend at Bernies? Sometimes lively corpses are enough to fool the Game.",
    2022: "And should that Lord LEAVE...  ...  Well. They have to be SOMEWHERE. That is the nature of space. The new place they are will spiral around them. And the old will slowly fall into the Void. The center cannot hold.",
    5555: "So many things exist within the Void. None of them matter. The Shop Keep eats babies in the Void because of her Obsession with Fruit. It does not matter.",
    6996: "They say the Nine Artifacts were not even created for Zampanio. They fell here from an abandoned Universe.",
    9669: "The spiralling pull of the Lord consumes all. All lost or unfinished stories end up in the maw of Zampanio, which the Lord loves above all else. All abandoned characters. All abandoned lore.",
    10000: "<a target='_blank' href='http://farragofiction.com/TheInternOpensHisEyes/'>  The Witness</a> gently inspires from within the Void. Forever separated from the Lord. Defined utterly by their existance where the Lord is not.",
    101010: "The End is Never The End. But the Rot Consumes All, In the End. Both can be true. There will be no end to this game, Observer. No end but your own patience. No one can Obsesss Forever.",
    1313858: "Obsession Is A Dangerous Thing",
  }

  button1.onclick = () => {
    //display the biggest value you can currently afford.
    for (let k of Object.keys(gnosisQuips)) {
      if (k < globalDataObject.truthCurrentValue) {
        quipEle.innerHTML = gnosisQuips[k];
      }
    }
    globalDataObject.truthCurrentValue = 0; s
  }

  const index = 0;
  button2.onclick = () => {
    const quips = [`Why...why would you do this?`, "What?", "You just...FORGOT?", "Why...why would you want to forget me..."]
    decreaseTruthBy(13);
    quipEle.innerText = pickFrom(quips);
    if (globalDataObject.truthCurrentValue < 0) {
      //legion rests peacefully, i hope
      quipEle.innerHTML = `This reminds me of a man my Creator knew once who knew less than nothing, because it was less dangerous than knowing too much... Real hopeful guy. Negative gnosis was... a hell of a thing to do to yourself....
      
      <br><br>
      <div style="color: white; font-family: Times New Roman">
      <p>You weren&apos;t always a wanderer with little memory but that of the stars. You were someone else once-- normal, even, with all the trappings of mortality. So were all of your friends. Normal in every capacity. A highschooler with okay grades and zero friends. Full of teenage problems with teenage solutions-- stupid as all of them, but a predictable stupid.</p>
<p><br></p>
<p>Not after that, though. That game changed everything.&nbsp;</p>
<p><br></p>
<p>Suddenly you&apos;re gods-- real gods, not your play-pretend, 2006-DeviantArt-roleplay ones. Or gods-in-the-making. Or gods-that-already-were. Or something like that. It was your responsibility to make the new universe, create the new world... rebuild, maybe.</p>
<p><br></p>
<p>You&apos;d never let that happen, though. Not that you didn&apos;t agree-- a new world is good. But if they&apos;re gods, couldn&apos;t they just take the old one back? Why settle for once when you could have both?</p>
<p><br></p>
<p>Not like their plans for a new world ended well either-- not with any help of yours, you didn&apos;t play the game by its rules. It was this or nothing, you think. So you took it all in, closed it off from the world. Until there was nothing left. Until nothing else was true but...</p>
<p><br></p>
<p>You.</p>
<p><br></p>
<p>Where do you end and all of them begin? All that&apos;s left are shards within you, littered with them and you, the pieces unrecognizable. Do you even know the difference? Do you care to know the difference?</p>
<p><br></p>
<p>Do you think they&apos;re happier as that? As unraveled threads in the tapestry that makes you?</p>
<p><br></p>
<p>How long will you keep yourself trapped in your cold, empty, labyrinthian heart?</p>
<p><br></p>
<p>Not like it matters. You can&apos;t remember anyway.</p>
<p><br></p>
<p>If you have it your way, you&apos;ll never remember.</p>
<p><br></p>
<p>So shatter.</p>
</div>
      `;
    }
  }

  button3.onclick = () => {
    globalDataObject.saveUnlocked = true;
    save();
    button3.remove();
    quipEle.innerText = "Oh. Sure. Right. You humans need to do things like sleep. I remembered that. Here. You can save now. Use it wisely."
  }

  button4.onclick = () => {
    globalDataObject.mazeUnlocked = true;
    button4.remove();
    quipEle.innerText = "What are you even saying. Humans LOVE it when numbers go up. How could you POSSIBLY be bored? Ugh. Fine. I GUESS humans are only here for one thing and its disgusting. Have a maze or something."
  }
  if (globalMeatMode && globalMeatGrowing) {
    growMeat();
  }

}


//uses the state of the current save data to decide what awards to apply
//if there is a bonus, give a lil more
//NOTE: does not save, auto save and manual does, this way if you get rewards you don't like can try again
const handleRewards = (numberBeaten, bonus) => {
  truthLog("Rewards", `Congratulations on beating my horridors: ${numberBeaten} time.`)

  globalTabContent.innerHTML = "";
  globalBGMusic.src = "audio/music/dear_god.mp3";
  globalBGMusic.play();
  //calculate and hand out rewards, including if bonus
  globalDataObject.mazesBeaten++;
  console.log("JR NOTE: mazes beaten ", globalDataObject.mazesBeaten)

  console.log("JR NOTE: handleRewards", globalDataObject.mazesBeaten)


  let keyReward = pickFrom([true, false, false]);//1/3 chance in getting a key (31 being lavinraca/lavinraca arc number)
  let truthPerSecond = 1;
  let truthBulkReward = 0; //might not get this

  let unlockedRoom = rooms_to_unlock[globalDataObject.mazesBeaten]; //if its undefined ignore

  //shout out to the Illusionist of Twisted Dolls for realizing this meant you would KEEP UNLOCKING LOCKED MINIGAMES
  if (!unlockedRoom && keyReward && !globalDataObject.unlockedMiniGames.includes(LOCKEDMINIGAME) && !globalDataObject.rottenMiniGames.includes(LOCKEDMINIGAME)) {
    unlockedRoom = "LOCKED"
  }



  if (globalDataObject.mazesBeaten > 10) {
    truthPerSecond += Math.ceil(globalDataObject.mazesBeaten / 10); //linear increase that scales with how many mazes you've beaten
  }

  if (globalDataObject.mazesBeaten > 100) {
    truthPerSecond += globalDataObject.mazesBeaten * truthPerSecond; //i dunno, maybe this is exponential, this is still a WIP, point is, huge jumps
  }

  if (globalDataObject.mazesBeaten % 3 === 0) {//every three times you get a bonus of raw truth
    //first time you get it you basically get number of rooms beaten seconds of free truth * one maze
    //and so on
    //should grow exponentially
    truthBulkReward += numberBeaten * globalDataObject.mazesBeaten * globalDataObject.truthPerSecond;
  }


  if (bonus) { //doubles numerical rewards
    truthPerSecond += truthPerSecond;
    truthBulkReward += truthBulkReward;
  }

  console.log("JR NOTE: about to update, ", { truthPerSecond, truthBulkReward })
  globalDataObject.truthPerSecond += truthPerSecond;
  if (keyReward) {
    globalDataObject.numberKeys++;
  }
  if (truthBulkReward) {
    increaseTruthBy(truthBulkReward);
  }

  if (unlockedRoom) {
    globalDataObject.unlockedMiniGames.push(unlockedRoom);
  }

  //display all rewards, specify if bonus
  const div = createElementWithClassAndParent("div", globalTabContent, "victory");
  const header = createElementWithClassAndParent("h1", div);
  header.innerText = `You did it! ${globalDataObject.mazesBeaten} Mazes Fully Explored!!!`

  const header2 = createElementWithClassAndParent("h2", div);
  header2.innerText = "Rewards:"

  const list = createElementWithClassAndParent("ul", div);
  const truthPerSecondEle = createElementWithClassAndParent("li", list);
  if (bonus) {
    truthPerSecondEle.innerHTML = `<b>Truth Per Second: ${truthPerSecond / 2} x 2 (bonus!)`;
  } else {
    truthPerSecondEle.innerHTML = `<b>Truth Per Second: ${truthPerSecond}`;
  }

  if (truthBulkReward) {
    const truthBulkEle = createElementWithClassAndParent("li", list);
    if (bonus) {
      truthBulkEle.innerHTML = `<b>Truth:</b> ${truthBulkReward / 2} x 2 (bonus!)`;
    } else {
      truthBulkEle.innerHTML = `<b>Truth: </b>${truthBulkReward}`;
    }
  }

  if (unlockedRoom) {
    const unlockEle = createElementWithClassAndParent("li", list);
    unlockEle.innerHTML = `<b>Unlocked New Room Type</b>: ${unlockedRoom}`;
  }

  if (keyReward) {
    const unlockEle = createElementWithClassAndParent("li", list);
    unlockEle.innerHTML = `<img src="images/KeyForFriend.png">`;
  }


  const button = createElementWithClassAndParent("button", list);
  button.style.marginTop = '20px'
  button.innerText = "Start New Maze";
  button.onclick = () => {
    renderMazeTab();
  }
  //technically shouldn't hit since meat is its own rewards
  if (globalMeatMode && globalMeatGrowing) {
    growMeat();
  }

}

/*
parker simply Does Not examine why witherby is his favorite person to watch
that does not imply anything about him /sarcasm
its not exactly internalized homophobia
hed be almost as bad if he liked, say, devona
but the unexamined assumption that hes straight definitely plays a part in making it worse
its more that parkers self esteem is so low he thinks liking real people is bad for them
and tbh he DOES uncontrollably murder people
so
he simply buries any awareness he has a crush


at least to me
the supernatural elements take the edge off the mundane ones
it would be a really heavy story to deal with parkers mundane issues alone
and it would be tempting, either for me, or the audience, to provide mundane metrics to it?
like , invalidating parker because he should "just" take a bath and go outside
the supernatural elements sort of translate legitimate mental health concerns (either innate or trauma based) into a way that
for lack of a better word
feels more justifiable?
when you are in that hole of self hate it is a Fact Of Reality that your presence ruins everything for your loved ones
you cant conceive of your own value and worth and self destructive behaviors feel RIGHT
so instead of talking about the inherent worth of humanity which sounds fake and patronizing
"here is someone EVEN WORSE than your brain lies say you are who ABSOLUTELY ruins everything he touches just like you feel you do but worse and he still can have a friend and learn to do nice things for himself and when he does its better for everyone" 
repeat for all the blorbos
ria is such a mess of addiction and needs SO MUCH from her friends she literally destroys everything 

and here is how she can be happier

etc etc
it soothes me to find a way to accept types of people i find draining or scary? or to find a way to accept traits i fear i have during my lows
but without it being that corrupt type of acceptance that goes "welp, because i can understand this person i have to do everything in my power to help them and can never complain if they hurt me" or "because my feelings are valid i can treat others as terribly as i want" 
witherby has plenty of his own issues, but freezing out ria and backing off from her for his own safety wasnt one of them
and devona avoiding k isnt her being mean and "not understanding" how hurt k is by that
etc etc
the blorbos are all people and deserve friendship but that doesn't turn into everyone being friends with everyone else
*/