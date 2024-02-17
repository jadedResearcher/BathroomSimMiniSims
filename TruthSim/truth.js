const globalBGMusic = new Audio("audio/music/funky_beat.mp3");
let globalContainer;//the whole 'screen'
let globalTabContent; //if you are messing only with the current tab (not the header), its this

let globalDataObject = {
  truthPerSecond:1,
  truthCurrentValue: 0,
  tabsUnlocked: []
};

window.onload = () => {
  const button = document.querySelector("#entry-button");
  globalContainer = document.querySelector("#container");
  button.onclick = () => {
    globalBGMusic.play();
    globalBGMusic.volume=0.05;
    globalBGMusic.loop = true;
    button.remove();
    renderHeader();
  }
}

const truthLoop = (truthCounter)=>{
  globalDataObject.truthCurrentValue ++;
  truthCounter.innerText = `${globalDataObject.truthCurrentValue} Truth Obtained...`;
  setTimeout(()=>{truthLoop(truthCounter)},1000);
}

//header is always visible and lets you switch between tabs
const renderHeader = () => {
  const header = createElementWithClassAndParent("div", globalContainer);
  header.id = "tab-header";
  globalTabContent = createElementWithClassAndParent("div", globalContainer);
  globalTabContent.id = "tab-content";

  const truthCounter = createElementWithClassAndParent("div", header, 'tab');
  truthCounter.id = "truth-counter";
  truthCounter.innerText = `${globalDataObject.truthCurrentValue} Truth Obtained...`
  truthLoop(truthCounter);


  /*
  for each unlocked tab, render that tab
  if clicked on, each tab renders itself into the sub container.
  */

}

const renderGnosisTab = () => {

}