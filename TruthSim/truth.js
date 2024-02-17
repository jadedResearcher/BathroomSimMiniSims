const globalBGMusic = new Audio("audio/music/funky_beat.mp3");
let globalContainer;//the whole 'screen'
let globalTabContent; //if you are messing only with the current tab (not the header), its this
const SAVE_KEY = "TRUTH_AWAITS_INSIDE_ZAMPANIO"
let globalDataObject = {
  truthPerSecond: 1,
  startedPlayingTimeCode: Date.now(),
  lastLoadTimeCode: 0,
  lastSaveTimeCode: 0,
  truthCurrentValue: 0,
  obviousHack: false, // :) :) ;)
  allTimeTruthValue: 0, //truth but it never goes down
  obsessionCurrentValue: 0,//lifetime  value for seconds in game
};

window.onload = () => {
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
  localStorage.setItem(SAVE_KEY, JSON.stringify(globalDataObject));
}


const load = () => {
  let data = localStorage.getItem(SAVE_KEY);
  if (data) {
    globalDataObject = JSON.parse(data);
    globalDataObject.lastLoadTimeCode = Date.now();
  }

}

const increaseTruthBy = (amount) => {
  globalDataObject.truthCurrentValue += amount;
  globalDataObject.allTimeTruthValue += amount;

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

}

const handleTruthTabButton = (header) => {
  const truthCounter = createElementWithClassAndParent("div", header, 'tab');
  truthCounter.id = "truth-counter";
  truthCounter.innerText = `${globalDataObject.truthCurrentValue} Truth Obtained...`
  truthLoop(truthCounter);
  truthCounter.onclick = () => {
    renderGnosisTab();
  }
}

const handleSaveTabButton = (header) => {
  const saveTab = createElementWithClassAndParent("div", header, 'tab');
  saveTab.id = "save-tab-button";
  saveTab.onclick = () => {
    renderSaveTab();
  }
  const status = createElementWithClassAndParent("div", saveTab);



  status.innerText = `Last Save ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}.`;

  if (globalDataObject.obsessionCurrentValue < 13) {
    saveTab.style.display = "none";
    const monitorObsession = () => {
      if (globalDataObject.obsessionCurrentValue > 13) {
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

  const saveButton = createElementWithClassAndParent("button", saveTab);
  saveButton.innerText = "Manually Save";
  saveButton.onclick = () => {
    save();
    status.innerText = `Last Save ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}.`;
  }

}

const renderSaveTab = () => {
  globalTabContent.innerHTML = "";
  const stats = createElementWithClassAndParent("div", globalTabContent, "stats");

  const section1 = createElementWithClassAndParent("div", stats);

  const startedPlaying = createElementWithClassAndParent("div", section1);
  startedPlaying.innerHTML = `<b>Started Playing:</b> ` + `${new Date(globalDataObject.startedPlayingTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.startedPlayingTimeCode).toLocaleTimeString()}`;
  const lastSaved = createElementWithClassAndParent("div", section1);
  lastSaved.innerHTML = `<b>Last Saved: </b>` + `${new Date(globalDataObject.lastSaveTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}`;

  const lastLoaded = createElementWithClassAndParent("div", section1);
  lastLoaded.innerHTML = `<b>Last Loaded: </b>` + `${new Date(globalDataObject.lastLoadTimeCode).toLocaleDateString()},  ${new Date(globalDataObject.lastLoadTimeCode).toLocaleTimeString()}`;
  if(globalDataObject.lastLoadTimeCode === 0){
    lastLoaded.innerHTML = "<b>Last Loaded: </b>Never :( Don't you know Obession Is A Dangerous Thing?<br><br> As long as it auto saved recently or you manually saved, you should be able to refresh the tab and keep everything. Unless you're in incognito mode. Better to find out now than after a power outage..."
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
  const button = createElementWithClassAndParent("button", globalTabContent, "gnosis-button");
  button.innerText = "Surely this is enough Truth to know what is REALLY going on...";

  const quipEle = createElementWithClassAndParent("div", globalTabContent, "gnosis-quip");

  if (globalDataObject.obsessionCurrentValue < 10) {
    button.style.display = "none";
    const monitorObsession = () => {
      if (globalDataObject.obsessionCurrentValue > 10) {
        button.style.display = "block";
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

  button.onclick = () => {
    //display the biggest value you can currently afford.
    for (let k of Object.keys(gnosisQuips)) {
      if (k < globalDataObject.truthCurrentValue) {
        quipEle.innerHTML = gnosisQuips[k];
      }
    }
  }

}