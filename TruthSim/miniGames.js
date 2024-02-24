

const rabbitMiniGame = (room, callback)=>{
  globalTabContent.innerHTML = "";
  globalBGMusic.src="audio/music/Drone1.mp3";
  globalBGMusic.play();

  const input = createElementWithClassAndParent("button", globalTabContent, "password-field");

  const button = createElementWithClassAndParent("button", globalTabContent, "clicker-game-button");
  button.onclick = ()=>{

    if(input.value.toUpperCase() === "JR TEST"){
      window.alert("!!! you did it!")
      callback(globalDataObject.currentMaze);
      renderMazeTab();
    }
  }



}

const buttonMiniGame = (room,callback)=>{
  globalTabContent.innerHTML = "";
  const savedSrc = globalBGMusic.src;
  globalBGMusic.src="audio/music/i_literally_dont_even_remember_making_this_by_ic.mp3";
  globalBGMusic.play();
  const button = createElementWithClassAndParent("button", globalTabContent, "clicker-game-button");
  button.innerText = "CLICK FOR THE TRUTH";
  console.log("JR NOTE: Room is", room)
  if(room.themeKeys && room.themeKeys.length >0){
    button.style.position = "absolute";
    button.style.backgroundColor = "#a10000"
    const rotation = room.getTint();
    //console.log("JR NOTE: setting rotation", rotation)
    if (rotation === 0) {
      button.style.backgroundColor = "grey";
    } else {
      button.style.filter = `hue-rotate(${rotation}deg)`;
    }
  }

  const quips = ["You clicked!","1 truth for you!","It tickles!","You're so smart!"];
  if(room.themeKeys){
    for(let themeKey of room.themeKeys){
      const theme = all_themes[themeKey]
      console.log("JR NOTE: theme is", theme)
      quips.push("You're so " + theme.pickPossibilityFor(COMPLIMENT,globalRand));
      quips.push("You could be a real " + theme.pickPossibilityFor(PERSON,globalRand));
      quips.push("Wow! Why would anyone ever call you " + theme.pickPossibilityFor(INSULT,globalRand));


    }
  }
  const quipEle = createElementWithClassAndParent("div", globalTabContent, "clicker-game-quip");

  let clicks = 0;
  button.onclick = ()=>{
    quipEle.innerText = pickFrom(quips);
    clicks ++;
    if(room.themeKeys && room.themeKeys.length >0){
      increaseTruthBy(13);
      button.style.position = "absolute";
      button.style.top = `${getRandomNumberBetween(0,100)}%`;
      button.style.left = `${getRandomNumberBetween(0,100)}%`;

    }else{
      increaseTruthBy(1);

    }
    if(clicks > 1){
      globalBGMusic.pause();
      window.alert("10 clicks in one sitting!? Wow! You beat this challenge!")
      globalBGMusic.src = savedSrc;
      globalBGMusic.play();
      callback(globalDataObject.currentMaze);
      renderMazeTab();
    }
  }

}

//each mini game knows how to render itself and takes in a function to use as call back if it unlocks
const globalMiniGames = {
  "BUTTON": buttonMiniGame,
  "RABBIT": rabbitMiniGame,
}

