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
  allTimeTruthValue: 0, //truth but it never goes down
  obsessionCurrentValue: 0,//lifetime  value for seconds in game
  tabsUnlocked: []
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
  setTimeout(() => { saveLoop(saveTab) }, 1000*60);
}

const truthLoop = (truthCounter) => {
  increaseTruthBy(1);
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
  }else{
    saveLoop(status);
  }

  const saveButton = createElementWithClassAndParent("button", saveTab);
  saveButton.innerText = "Manually Save";
  saveButton.onclick = ()=>{
    save();
    status.innerText = `Last Save ${new Date(globalDataObject.lastSaveTimeCode).toLocaleTimeString()}.`;
  }

}

const renderGnosisTab = () => {

  const button = createElementWithClassAndParent("button", globalTabContent, "gnosis-button");
  button.innerText = "Surely this is enough Truth to know what is REALLY going on...";

  const quipEle = createElementWithClassAndParent("div", globalTabContent, "gnosis-quip");

  if (globalDataObject.obsessionCurrentValue < 13) {
    button.style.display = "none";
    const monitorObsession = () => {
      if (globalDataObject.obsessionCurrentValue > 13) {
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