//note to future JR: "handleRewards" at the bottom you are likely to be tweaking and adding to the most in this file
//plus the "globalDataObject" which isn't too far from here

const globalBGMusic = new Audio("audio/music/funky_beat_by_ic.mp3");
let globalContainer;//the whole 'screen'
let globalTabContent; //if you are messing only with the current tab (not the header), its this
const SAVE_KEY = "TRUTH_AWAITS_INSIDE_ZAMPANIO";
const globalRand = new SeededRandom(13);


let globalDataObject = {
  truthPerSecond: 10,
  startedPlayingTimeCode: Date.now(),
  lastLoadTimeCode: 0,
  lastSaveTimeCode: 0,
  truthCurrentValue: 0,
  mazesBeaten: 0,
  mazesTried: 0,
  currentMaze: undefined, //what maze are you currently exploring (serialized)
  storedMazes: [], //up to three (or so?) mazes you stored because they are especially useful for grinding
  saveUnlocked: false,
  mapInternalSeed: globalRand.internal_seed,
  mazeUnlocked: false,
  unlockedMiniGames: ["BUTTON"],
  obviousHack: false, // :) :) ;)
  allTimeTruthValue: 0, //truth but it never goes down
  obsessionCurrentValue: 0,//lifetime  value for seconds in game
};



window.onload = () => {
  initThemes();
  load();
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

const save = () => {
  globalDataObject.lastSaveTimeCode = Date.now();
  globalDataObject.mapInternalSeed = globalRand.internal_seed;
  localStorage.setItem(SAVE_KEY, JSON.stringify(globalDataObject));
}


const load = () => {
  let data = localStorage.getItem(SAVE_KEY);
  if (data) {
    globalDataObject = JSON.parse(data);
    globalDataObject.lastLoadTimeCode = Date.now();
    let json = globalDataObject.currentMaze;
    globalDataObject.currentMaze = new Maze(globalRand,-1);
    if (json) {
      globalDataObject.currentMaze.loadFromJSON(json);
    }
  }

}

const increaseTruthBy = (amount) => {
  globalDataObject.truthCurrentValue += amount;
  globalDataObject.allTimeTruthValue += amount;

}

//takes in a positive number and subtracts it
//does not reduce all time truth value
const decreaseTruthBy = (amount) => {
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
  truthCounter.innerText = `${globalDataObject.truthCurrentValue} Truth Obtained...`;
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


}

const handleTruthTabButton = (header) => {
  const truthCounter = createElementWithClassAndParent("div", header, 'tab');
  truthCounter.id = "truth-counter";
  truthCounter.innerText = `${globalDataObject.truthCurrentValue} Truth Obtained...`
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

const renderMazeTab = () => {
  globalTabContent.innerHTML = "";
  globalBGMusic.src = "audio/music/i_literally_dont_even_remember_making_this_by_ic.mp3";
  globalBGMusic.play();
  if (!globalDataObject.currentMaze) {
    globalDataObject.currentMaze = new Maze(globalRand, globalDataObject.mazesTried);
    globalDataObject.mazesTried ++;
  }
  const header = createElementWithClassAndParent("h1", globalTabContent, "maze-title");
  header.innerText = globalDataObject.currentMaze.title;

  const restartButton = createElementWithClassAndParent("button", globalTabContent, "restart-button");
  const mazeEle = createElementWithClassAndParent("div", globalTabContent, "maze");


  let allUnlocked = true; //if we find even one locked, this is permanently false
  let allBeaten = true; //if we find evne one unbeaten this is permanetly false
  let numberBeaten = 0;
  restartButton.innerText = "Generate New Maze?"

  for (let row of globalDataObject.currentMaze.map) {
    console.log("JR NOTE: row is", row)
    for (let room of row) {
      if (room) {
        if (!room.unlocked) {
          allUnlocked = false;
        }

        if (room.timesBeaten <= 0) {
          allBeaten = false;
        }else{
          numberBeaten ++;
        }
      }

    }
  }
  if (allUnlocked) {
    restartButton.innerText += " (And Gain a Reward)"
  }

  if (allBeaten) {
    restartButton.innerText += " (And Gain a Bonus)"
  }
  restartButton.onclick = () => {
    if (allUnlocked) {
      if (confirm("Are you sure? Progress in this maze will be lost unless saved... (But you'll still get your reward).")) {

        globalDataObject.currentMaze = null;
        handleRewards(numberBeaten,allBeaten);//its own screen for rendering
      }
    } else {
      if (confirm("Are you sure? Progress in this maze will be lost unless saved...")) {
        globalDataObject.currentMaze = null;
        renderMazeTab();
      }
    }
  }

  globalDataObject.currentMaze.renderSelf(mazeEle);

  /*
    actually ask room.js what you should do
  */

}

const renderSaveTab = () => {
  globalTabContent.innerHTML = "";
  globalBGMusic.src = "audio/music/i_dont_remember_making_this_either_by_ic.mp3";
  globalBGMusic.play();
  const stats = createElementWithClassAndParent("div", globalTabContent, "stats");

  const section1 = createElementWithClassAndParent("div", stats);

  const startedPlaying = createElementWithClassAndParent("div", section1);
  startedPlaying.innerHTML = `<b>Started Playing:</b> ` + `${new Date(globalDataObject.startedPlayingTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.startedPlayingTimeCode).toLocaleTimeString()}`;
  const lastSaved = createElementWithClassAndParent("div", section1);
  lastSaved.innerHTML = `<b>Last Saved: </b>` + `${new Date(globalDataObject.lastSaveTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}`;

  const lastLoaded = createElementWithClassAndParent("div", section1);
  lastLoaded.innerHTML = `<b>Last Loaded: </b>` + `${new Date(globalDataObject.lastLoadTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.lastLoadTimeCode).toLocaleTimeString()}`;
  if (globalDataObject.lastLoadTimeCode === 0) {
    lastLoaded.innerHTML = "<b>Last Loaded: </b>Never :( Don't you know Obession Is A Dangerous Thing?<br><br> As long as it auto saved recently or you manually saved, you should be able to refresh the tab and keep everything. Unless you're in incognito mode. Better to find out now than after a power outage..."
  }

  if(globalDataObject.currentMaze){
  const mazeSection  = createElementWithClassAndParent("div", stats, "maze-section");
  const instructionsMaze  = createElementWithClassAndParent("div", mazeSection);
  instructionsMaze.innerHTML = "Do you find a particular maze too hard to beat right now? Have you found an especially useful maze you don't want to forget? The End Is Never The End with Zampanio! You can remember up to three mazes at a time to load at your leisure!<br><br><i>But be warned: The Rot Takes All In The End</i> ";
  if(!globalDataObject.storedMazes || globalDataObject.storedMazes.length === 0){
    globalDataObject.storedMazes = [globalDataObject.currentMaze, globalDataObject.currentMaze, globalDataObject.currentMaze]
  }

  for(let i = 0; i<3; i++){
    const container  = createElementWithClassAndParent("div", mazeSection, "save-maze-line");

    const input  = createElementWithClassAndParent("input", container);
    input.value = globalDataObject.storedMazes[i].title;
    const button  = createElementWithClassAndParent("button", container);
    button.innerText = `Rename and Overwrite Permanently With Current Maze (${globalDataObject.currentMaze.title})`;
    button.onclick = ()=>{
      globalDataObject.storedMazes[i] = new Maze(globalDataObject.currentMaze.rand,0);
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

}

const renderGnosisTab = () => {
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
      quipEle.innerText = `This reminds me of a man my Creator knew once who knew less than nothing, because it was less dangerous than knowing too much... Real hopeful guy. Negative gnosis was... a hell of a thing to do to yourself.... `;
    }
  }

  button3.onclick = () => {
    globalDataObject.saveUnlocked = true;
    button3.remove();
    quipEle.innerText = "Oh. Sure. Right. You humans need to do things like sleep. I remembered that. Here. You can save now. Use it wisely."
  }

  button4.onclick = () => {
    globalDataObject.mazeUnlocked = true;
    button4.remove();
    quipEle.innerText = "What are you even saying. Humans LOVE it when numbers go up. How could you POSSIBLY be bored? Ugh. Fine. I GUESS humans are only here for one thing and its disgusting. Have a maze or something."
  }


}


//uses the state of the current save data to decide what awards to apply
//if there is a bonus, give a lil more
//NOTE: does not save, auto save and manual does, this way if you get rewards you don't like can try again
const handleRewards = (numberBeaten,bonus) => {
  globalTabContent.innerHTML = "";
  globalBGMusic.src = "audio/music/dear_god.mp3";
  globalBGMusic.play();
  //calculate and hand out rewards, including if bonus
  globalDataObject.mazesBeaten = globalDataObject.mazesBeaten ? 1 : globalDataObject.mazesBeaten + 1;

  console.log("JR NOTE: handleRewards",globalDataObject.mazesBeaten)


  let truthPerSecond = 1;
  let truthBulkReward = 0; //might not get this
  //if globalDataObject.mazesBeaten is this value, add this key to the unlocked rooms please
  const rooms_to_unlock = {
    1: "RABBIT",
  };
  let unlockedRoom = rooms_to_unlock[globalDataObject.mazesBeaten]; //if its undefined ignore
  console.log("JR NOTE: unlocked room", unlockedRoom)



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

  console.log("JR NOTE: about to update, ", {truthPerSecond, truthBulkReward})
  globalDataObject.truthPerSecond += truthPerSecond;
  if (truthBulkReward) {
    increaseTruthBy(truthBulkReward);
  }

  if (unlockedRoom) {
    if (globalDataObject.unlockedMiniGames) {
      globalDataObject.unlockedMiniGames.push(unlockedRoom);

    } else {
      globalDataObject.unlockedMiniGames = [unlockedRoom];
    }
  }

  //display all rewards, specify if bonus
  const div = createElementWithClassAndParent("div", globalTabContent, "victory");
  const header = createElementWithClassAndParent("h1", div);
  header.innerText = "You did it!"

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
      truthBulkEle.innerHTML = `<b>Truth: ${truthBulkReward/2} x 2 (bonus!)`;
    } else {
      truthBulkEle.innerHTML = `<b>Truth: ${truthBulkReward}`;
    }
  }

  if (unlockedRoom) {
    const unlockEle = createElementWithClassAndParent("li", list);
    unlockEle.innerHTML = `<b>Unlocked New Room Type: ${unlockedRoom}`;
  }


  const button = createElementWithClassAndParent("button", list);
  button.style.marginTop='20px'
  button.innerText = "Start New Maze";
  button.onclick = () => {
    renderMazeTab();
  }


}