/*
globalMiniGames at the bottom of this file is key
*/


//JR NOTE: todo displays the fact thing and rerenders the mini game if the fact changes
const setupGameHeader = (room, winCallback, title, difficulty_guide, sprite, callback) => {
  console.log("JR NOTE: setting up game header for", callback)
  const header = createElementWithClassAndParent("div", globalTabContent, "game-header");

  const h1 = createElementWithClassAndParent("h1", header);
  h1.innerText = title
  if (globalDataObject.numberKeys > 0) {
    const skip_button = createElementWithClassAndParent("img", header, "skip-button");
    skip_button.src = "images/KeyForFriend.png";
    skip_button.onclick = () => {
      window.alert("Room Skipped With Key!!!");
      globalDataObject.numberKeys += -1;
      winCallback(globalDataObject.currentMaze);
      renderMazeTab();
    }
  }
  if (difficulty_guide) {
    const difficulty = createElementWithClassAndParent("div", globalTabContent);
    difficulty.innerHTML = difficulty_guide
  }

  if (sprite) {
    const img = createElementWithClassAndParent("img", globalTabContent, "blorbo");
    img.src = sprite;
  }

  const container = createElementWithClassAndParent("div", globalTabContent, "game-container");
  return container;
}

const eyekillerMiniGame = (room, callback) => {
  globalTabContent.innerHTML = "";
  globalBGMusic.src = "audio/music/get_it_because_pipe_organ.mp3";//pipers theme...piper being the eye killers past name, but no longer (and even that isn't their TRUE name, that is Camellia, an even more past self (time players, am i right?))
  globalBGMusic.play();

  let attack = room.difficulty * room.getAttack();
  let defense = room.difficulty * 3 * room.getDefense(); //on average three slices to kill
  let speed = 1 * room.getSpeed(); //don't mess with speed much
  let tint = room.getTint();

  const container = setupGameHeader(room,callback, "Help the Eye Killer Hunt Down the Cultists Hunting Her!!!", `Cultist HP/Speed: ${defense}/${speed}, Eye Killer Strength: ${attack}`, "images/Eye_Killer_pixel_by_the_guide.png", eyekillerMiniGame)


  let number_killed = 0;
  let dead = false;
  for (let i = 0; i < 10; i++) {
    let hp = defense;
    const img = createElementWithClassAndParent("img", container, "cultist");
    img.src = "images/CultistForFriendLARGE.png";
    if (tint) {
      img.style.filter = `hue-rotate(${tint}deg)`;

    }
    const top = getRandomNumberBetween(0, 100);
    const left = getRandomNumberBetween(0, 100);
    img.style.top = `${top}%`;
    img.style.left = `${left}%`;
    const duration = distance(0, 0, top, left) / 5 / speed;
    img.style.animationDuration = `${duration}s`
    console.log("JR NOTE: cultists constantly move towards upper left, if they reach 0,0, alert that you lost and render the maze tab without the callback (you did not win)")

    img.onanimationend = () => {
      if (!dead) {
        dead = true;
        alert("You were hunted down!");
        renderMazeTab();
      }
    }
    img.onclick = () => {
      hp += -1 * attack;
      const fx = new Audio("audio/fx/048958759-knife-draw.wav")
      fx.loop = false;
      fx.play();
      if (hp <= 0) {
        img.src = "images/HeadlessCultistForFriendLARGE.png";
        img.style.animationPlayState = "paused";
        fx.onended = () => {
          if (!dead) {
            img.remove();
          }
        }

        number_killed++;
        if (number_killed >= 10) {
          window.alert("!!! you did it!")
          callback(globalDataObject.currentMaze);
          renderMazeTab();
        }
      }
    }

  }


}

const lockMiniGame = (room, callback) => {
  //there is no way to beat this one without a key
  globalTabContent.innerHTML = "";

  const container = setupGameHeader(room, callback,"There is a lock inside.", undefined, undefined, lockMiniGame)

}


const rabbitMiniGame = (room, callback) => {
  globalTabContent.innerHTML = "";
  globalBGMusic.src = "audio/music/Drone1.mp3";
  globalBGMusic.play();

  const input = createElementWithClassAndParent("input", globalTabContent, "password-field");

  const button = createElementWithClassAndParent("button", globalTabContent, "clicker-game-button");
  button.innerText = "Submit Password"
  button.onclick = () => {

    if (input.value.toUpperCase() === "JR TEST") {
      window.alert("!!! you did it!")
      callback(globalDataObject.currentMaze);
      renderMazeTab();
    }
  }
}

const buttonMiniGame = (room, callback) => {
  globalTabContent.innerHTML = "";
  const savedSrc = globalBGMusic.src;
  globalBGMusic.src = "audio/music/i_literally_dont_even_remember_making_this_by_ic.mp3";
  globalBGMusic.play();
  const container = setupGameHeader(room, callback,"Click For Bonus Truth!!!", undefined, undefined, buttonMiniGame)

  const button = createElementWithClassAndParent("button", container, "clicker-game-button");
  button.innerText = "CLICK FOR THE TRUTH";
  console.log("JR NOTE: Room is", room)
  if (room.themeKeys && room.themeKeys.length > 0) {
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

  const quips = ["You clicked!", "1 truth for you!", "It tickles!", "You're so smart!"];
  if (room.themeKeys) {
    for (let themeKey of room.themeKeys) {
      const theme = all_themes[themeKey]
      console.log("JR NOTE: theme is", theme)
      quips.push("You're so " + theme.pickPossibilityFor(COMPLIMENT, globalRand));
      quips.push("You could be a real " + theme.pickPossibilityFor(PERSON, globalRand));
      quips.push("Wow! Why would anyone ever call you " + theme.pickPossibilityFor(INSULT, globalRand));


    }
  }
  const quipEle = createElementWithClassAndParent("div", globalTabContent, "clicker-game-quip");

  let clicks = 0;
  button.onclick = () => {
    quipEle.innerText = pickFrom(quips);
    clicks++;
    if (room.themeKeys && room.themeKeys.length > 0) {
      increaseTruthBy(13*room.timesBeaten);
      button.style.position = "absolute";
      button.style.top = `${getRandomNumberBetween(0, 100)}%`;
      button.style.left = `${getRandomNumberBetween(0, 100)}%`;

    } else {
      increaseTruthBy(1* room.timesBeaten);

    }
    if (clicks > 1) {
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
  "EYEKILLER": eyekillerMiniGame,
  "LOCKED": lockMiniGame,

}

//half as common as other rooms
const rareMiniGames = ["EYEKILLER"];

//max of once per maze
const uniqueMiniGames = ["LOCKED"];

