//each mini game knows how to render itself and takes in a function to use as call back if it unlocks
const globalMiniGames = {
  "BUTTON": buttonMiniGame
}


const buttonMiniGame = (callback)=>{
  globalTabContent.innerHTML = "";
  const savedSrc = globalBGMusic.src;
  globalBGMusic.src="audio/music/i_literally_dont_even_remember_making_this_by_ic.mp3";
  globalBGMusic.play();
  const button = createElementWithClassAndParent("button", globalTabContent, "clicker-game-button");
  button.innerText = "CLICK FOR THE TRUTH";

  const quips = ["You clicked!","1 truth for you!","It tickles!","You're so smart!"];
  const quipEle = createElementWithClassAndParent("div", globalTabContent, "clicker-game-quip");

  let clicks = 0;
  button.onclick = ()=>{
    quipEle.innerText = pickFrom(quips);
    increaseTruthBy(1);
    clicks ++;
    if(clicks > 100){
      globalBGMusic.pause();
      window.alert("100 clicks in one sitting!? Wow! You beat this challenge!")
      globalBGMusic.src = savedSrc;
      globalBGMusic.play();
      callback(globalDataObject.currentMaze);
    }
  }

}