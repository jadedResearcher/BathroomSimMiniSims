/*
  the current maze we are exploring is stored in save data. 

  up to THREE other mazes can be stored as well (new tab) and loaded at will.
*/

/*
      <li>ROOM</li>
      <ul>
        <li>knows how to render itself (change TINT based on assigned fact themes) and runs a lil mini game</li>
        <li>special rooms are bespoke (rabbit, shop, blorbos, etc)</li>
        <li>ProceduralRooms are entirely procedural (combat, tiny minigames)</li>
        <li>most of maze is procedural rooms</li>
        <li>knows unlock level (number between 0 and number of child rooms)</li>
        <li>list of facts currently assigned to room</li>
        <li>each time you beat the mini game, unlocks one new room from it till fully unlocked</li>
        <li>can ALWAYS play the mini game, but for each unlock level can choose to move on N,S or E (i.e. you beat it once you can go north, if you beat it twice can go north or south ) (obviously only if it HAS those directions as non dead ends)</li>
        <li>Button to ASSIGN A FACT from your inventory to this room, which will alter it based on themes or title  (removes it from inventory and instead stores it in this room) </li>
        <li>button to take a fact currently assigned to the room and put in your inventory instead</li>
        <li>has list of 0-3 rooms it adds to the unlocked pool on unlock (and are its exits) (random which is mapped to which exit tho)</li>
        <li>some rooms only care about SPECIFIC facts being assigned to them (like closer being wiggler eater)</li>
        <li>some rooms respond to a handful of themes in new ways (like lonely plus religion)</li>
        <li>others have tiny little changes that can happen based on ANY theme you give it (tyfings combat alters what enemies based on themes) (defeating a specific enemy for the first time might drop a new fact)</li>
      </ul>
*/


const getNewBabyMaze = () => {
  return new Maze(globalRand);
}

const makeRandomEasyRoom = (maze, row, col) => {
  const theme = maze.rand.nextDouble() > 0.3 ? undefined : pickFrom(Object.keys(all_themes));
  let possibleGames = [...globalDataObject.unlockedMiniGames];
  if (globalSkippedK) {
    possibleGames = [LAUNDRYMINIGAME]
  }

  if (!globalSkippedK) { //k doesn't fucking care about the odds, he's LUCKY and he's MAD and you are GOING TO LOOK AT HIM
    for (let game of maze.miniGamesWithin) {

      if (uniqueMiniGames.includes(game) && possibleGames.includes(game)) {
        possibleGames = removeItemOnce(possibleGames, game);
      }

      if (rareMiniGames.includes(game) && possibleGames.includes(game) && maze.rand.nextDouble() > 0.5) {
        possibleGames = removeItemOnce(possibleGames, game);
      }
    }
  }
  const chosen_mini_game_key = maze.rand.pickFrom(possibleGames);
  return new Room(`${theme ? `${all_themes[theme].pickPossibilityFor(ADJ, maze.rand)} ${chosen_mini_game_key}` : chosen_mini_game_key} ROOM`, theme ? [theme] : [], chosen_mini_game_key, row, col);
}

const makeRoomFromJSon = (json) => {
  //console.log("JR NOTE: the json to make a room from is", json)
  const room = new Room();
  for (let key of Object.keys(json)) {
    //console.log("JR NOTE: cloning key",key)
    room[key] = json[key];
  }
  return room;
}

//mostly basic procedural rooms but occasionally special ones
const makeRandomRoom = (maze, row, col) => {
  const room = makeRandomEasyRoom(maze, row, col);
  maze.miniGamesWithin.push(room.miniGameKey);
  return room;
}



/*
 a maze knows how to render itself and will RE-render itself any time you view it
 the way a maze renders itself will only change inside specific rooms (so it wont be rendering then)
 a maze also knows the algorithms it uses to select rooms to place down
 for example, rare for a room to the north to be generated
*/
class Maze {
  rand;
  minSize = 13; //later mazes can be bigger but for now, small
  maxSize = 23; // no infinite mazes rip, makes saving dumb
  title = "Firsty";
  miniGamesWithin = [];//useful for handling rare or unique mini games in a maze
  internal_seed = 13;
  roomPlaying; //what room are you currently in?
  //each row is a row in the map
  //each cell is either undefined or a room in the maze
  map = [];
  constructor(rand, number, difficulty) {
    //bigger with more truthPerSecond
    this.maxSize = Math.min(23, Math.max(3, globalDataObject.truthPerSecond * 3));
    this.minSize = Math.min(13, Math.max(3, globalDataObject.truthPerSecond));
    //console.log("JR NOTE: maze max size is", this.maxSize, this.minSize)

    this.rand = rand;
    this.difficulty = difficulty;
    this.title = "MAZE #" + number;
    //starts out with a size of one x one.
    this.map.push([makeRandomEasyRoom(this, 0, 0)]);
    const entrance = this.map[0][0];
    this.miniGamesWithin.push(entrance.miniGameKey);
    entrance.title += " (ENTRANCE)";
    //it'll be negative if its intended to be a placeholder before loading
    if (number >= 0) {
      //will recursively fill out the whole maze without getting bigger than maxSize;
      entrance.makeNeighbors(this);
    }
    entrance.unlock(this);
    this.miniGamesWithin = uniq(this.miniGamesWithin)

    if (globalSkippedK) {
      globalSkippedK = false; //only a single time
    }

  }

  loadFromJSON = (json) => {
    //console.log("JR NOTE: json is", json)
    this.map = []
    this.title = json.title ? json.title : "FIRSTY";
    this.difficulty = json.difficulty;
    this.internal_seed = json.internal_seed;
    this.rand.internal_seed = this.internal_seed;
    for (let row of json.map) {
      //console.log("JR NOTE: row is", row)
      const map_row = [];
      for (let cell of row) {
        //console.log("JR NOTE: cell is", cell)
        if (cell) {
          //console.log("JR NOTE: because the cell is, going to make it from json")
          map_row.push(makeRoomFromJSon(cell));
        } else {
          map_row.push(undefined)
        }
      }
      // console.log("JR NOTE: going to add a new row to the map:", map_row)
      this.map.push(map_row)
    }
  }

  hitMinSize = () => {
    return this.getRoomCount() > this.minSize;
  }

  hitMaxSize = () => {
    return this.getRoomCount() > this.maxSize;

  }

  getRoomCount = () => {
    let count = 0;
    //yes this is not efficient to loop on the map to find out how many rooms there are but this will be called only once on unlock per room, can afford to be slow
    for (let row of this.map) {
      for (let col of row) {
        if (col) {
          count++;
        }
      }
    }
    return count;
  }

  //if i add something to the left or up all the indices the rooms know about are no longer valid
  recalcIndices = () => {
    for (let row_index = 0; row_index < this.map.length; row_index++) {
      for (let col_index = 0; col_index < this.map[row_index].length; col_index++) {
        if (this.map[row_index][col_index]) {
          this.map[row_index][col_index].row = row_index;
          this.map[row_index][col_index].col = col_index;
        }
      }
    }
  }


  renderSelf(parent) {
    for (let row of this.map) {
      const rowEle = createElementWithClassAndParent("div", parent, "maze-row");
      //console.log("JR NOTE: rendering map, row is ", row)

      for (let cell of row) {
        //console.log("JR NOTE: rendering map cell is ", cell)

        if (cell) {
          cell.renderSelf(this, rowEle);
        } else {
          const ele = createElementWithClassAndParent("div", rowEle, "maze-cell");
          ele.classList.add("empty-cell");
          ele.innerText = ".";
        }

      }


    }
  }

}

//really just making a system that knows how to render boxes so i can wrap my head around it
//this is created BEFORE i have a room element
const testMazeRender = (parent) => {

  const rand = new SeededRandom(13);

  const sampleMaze = [
    [makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), undefined]
    , [undefined, makeRandomTestRoom(rand), undefined, makeRandomTestRoom(rand), undefined]
    , [undefined, makeRandomTestRoom(rand), undefined, makeRandomTestRoom(rand), makeRandomTestRoom(rand), undefined]
    , [undefined, makeRandomTestRoom(rand), undefined, makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom()]
    , [undefined, makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), undefined]
    , [undefined, makeRandomTestRoom(rand), undefined, makeRandomTestRoom(rand), undefined, undefined]
    , [undefined, makeRandomTestRoom(rand), undefined, makeRandomTestRoom(rand), undefined, undefined]
    , [undefined, makeRandomTestRoom(rand), undefined, makeRandomTestRoom(rand), undefined, undefined]
    , [undefined, makeRandomTestRoom(rand), undefined, makeRandomTestRoom(rand), undefined, undefined]
    , [makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), undefined, undefined, undefined]
  ];

  console.log("JR NOTE: going to try a maze")

  for (let row of sampleMaze) {
    const rowEle = createElementWithClassAndParent("div", parent, "maze-row");
    console.log("JR NOTE: row made from ", row)

    for (let cell of row) {
      console.log("JR NOTE: cell made  from", cell)

      if (cell) {
        cell.renderSelf(rowEle);
      } else {
        const ele = createElementWithClassAndParent("div", rowEle, "maze-cell");
        ele.classList.add("empty-cell");
        ele.innerText = ".";
      }

    }


  }



}




class Room {
  title = "???"
  row = 0;
  col = 0;
  difficulty = 1;
  themeKeys = [];
  unlocked = false;
  timesBeaten = 0;
  miniGameKey = "BUTTON"


  onClick; //usually will be rendering the inside of the room

  constructor(title, themeKeys, miniGameKey, row = 0, col = 0) {
    this.row = row;
    this.col = col;
    this.title = title;
    this.themeKeys = themeKeys;
    this.miniGameKey = miniGameKey;
  }

  unlock = (maze) => {
    if (globalMeatMode) {
      return;
    }
    //console.log("JR NOTE: unlocking", this.title)
    this.unlocked = true;
  }


  //makes neighbors and calls makeNeighbors on them
  //but won't go above a mazes max size
  makeNeighbors = (maze) => {
    this.difficulty = maze.difficulty; //recursively sets it for all rooms
    console.log("JR NOTE: making neighbors for", this.title)
    if (maze.hitMaxSize()) {//no infinite mazes
      return;
    }
    const hitMinSize = maze.hitMinSize();

    //will be doubled for placing in an EXISTING empty slot, prefers to make new slots
    const oddsEmpty = hitMinSize ? 0.9 : 0.5;
    const oddsEmptyBackTrack = hitMinSize ? 1.0 : 0.85;


    let neighbor_count = 0;

    const processRight = (force = false) => {
      let right_row = this.row;
      let right_col = this.col + 1;
      const odds_empty = force ? 0 : oddsEmpty - 0.5;//slightly higher chance of going right, because this will be East
      console.log("JR NOTE: processing right, force is", force, odds_empty, maze.rand.internal_seed)

      if (!maze.map[right_row][right_col]) {
        //if right does not exist, check if its col index is the same or greater than the rows length
        //if so, need to add a new "undefined" cel to the end of every row in the maze
        //then, pick my index and make a new random room
        if (right_col < maze.map[right_row].length && maze.rand.nextDouble() > oddsEmptyBackTrack) {
          maze.map[right_row][right_col] = makeRandomRoom(maze, right_row, right_col);
          maze.map[right_row][right_col].makeNeighbors(maze);
          neighbor_count++;
        } else {
          if (right_col == maze.map[right_row].length && maze.rand.nextDouble() > odds_empty) {
            for (let row of maze.map) {
              row.push(undefined);
            }
            maze.map[right_row][right_col] = makeRandomRoom(maze, right_row, right_col);
            maze.map[right_row][right_col].makeNeighbors(maze);

            neighbor_count++;
          }
        }
      }
    }

    const processLeft = (force = false) => {

      let right_row = this.row;
      let right_col = this.col - 1;
      const odds_empty = force ? 0 : oddsEmpty;
      console.log("JR NOTE: processing left, force is", force, odds_empty, maze.rand.internal_seed)

      if (!maze.map[right_row][right_col]) {
        //if left does not exist, check if my col index is zero (if so, stop)
        //then, pick my index and make a new random room
        if (right_col >= 0 && maze.rand.nextDouble() > oddsEmptyBackTrack) {
          console.log("JR NOTE: adding a room to the left without making a new col")

          maze.map[right_row][right_col] = makeRandomRoom(maze, right_row, right_col);
          maze.map[right_row][right_col].makeNeighbors(maze);

          neighbor_count++;
        } else {
          if (right_col == -1 && maze.rand.nextDouble() > odds_empty) {
            console.log("JR NOTE: adding a room to the left while making a new col")

            for (let row of maze.map) {
              row.unshift(undefined);
            }
            right_col = 0;
            maze.map[right_row][right_col] = makeRandomRoom(maze, right_row, right_col);
            maze.map[right_row][right_col].makeNeighbors(maze);

            neighbor_count++;
            maze.recalcIndices();

          }
        }
      }
    }

    const processUp = (force = false) => {

      let right_row = this.row - 1;
      let right_col = this.col;
      const odds_empty = force ? 0 : oddsEmpty;
      console.log("JR NOTE: processing up, force is", force, odds_empty, maze.rand.internal_seed)

      //if the row doesn't even exist OR it does but theres nothing in the column
      if (!maze.map[right_row] || (maze.map[right_row] && !maze.map[right_row][right_col])) {
        //if up does not exist, proccess if my row index is zero (if so, stop)
        //then, pick my index and make a new random room
        if (maze.map[right_row] && right_row >= 0 && maze.rand.nextDouble() > oddsEmptyBackTrack) {
          maze.map[right_row][right_col] = makeRandomRoom(maze, right_row, right_col);
          maze.map[right_row][right_col].makeNeighbors(maze);

          neighbor_count++;
        } else {
          if (right_row == -1 && maze.rand.nextDouble() > odds_empty) {
            const new_row = [];
            for (let cel of maze.map[0]) {
              new_row.push(undefined);
            }
            right_row = 0;
            maze.map.unshift(new_row);
            maze.map[right_row][right_col] = makeRandomRoom(maze, right_row, right_col);
            maze.map[right_row][right_col].makeNeighbors(maze);

            neighbor_count++;
            maze.recalcIndices();
          }
        }
      }
    }

    const processDown = (force = false) => {
      let right_row = this.row + 1;
      let right_col = this.col;
      const odds_empty = force ? 0 : oddsEmpty;
      console.log("JR NOTE: processing down, force is", force, odds_empty, maze.rand.internal_seed)
      //if the row doesn't even exist OR it does but theres nothing in the column
      if (!maze.map[right_row] || (maze.map[right_row] && !maze.map[right_row][right_col])) {        //if down does not exist, check if its row index is the same or greater than how many rows there are
        //if so, add a new row of all undefineds to the maze
        //then, pick my index and make a new random room
        if (maze.map[right_row] && right_row < maze.map.length && maze.rand.nextDouble() > oddsEmptyBackTrack) {
          maze.map[right_row][right_col] = makeRandomRoom(maze, right_row, right_col);
          maze.map[right_row][right_col].makeNeighbors(maze);

          neighbor_count++;
        } else {
          if (right_row == maze.map.length && maze.rand.nextDouble() > odds_empty) {
            const new_row = [];
            for (let cel of maze.map[0]) {
              new_row.push(undefined);
            }
            maze.map.push(new_row);
            maze.map[right_row][right_col] = makeRandomRoom(maze, right_row, right_col);
            maze.map[right_row][right_col].makeNeighbors(maze);

            neighbor_count++;
          }
        }
      }

    }

    processRight();
    processDown();
    processLeft();
    processUp();
    console.log("JR NOTE: did we generate any rooms? ", neighbor_count, maze.map, maze.hitMinSize());
    //if neighbor_count is zero and maze has not yet hit its min size yet, force a down
    if (!hitMinSize && neighbor_count === 0) {
      console.log("JR NOTE: because we haven't hit min size yet, not allowing dead ends")
      let options = [processRight, processDown, processLeft, processUp]
      options = maze.rand.shuffle(options);
      for (let attempt of options) {
        attempt(true);
        if (neighbor_count > 0) {
          break;
        }
      }
    }
  }

  incrementTimesBeaten = (maze) => {
    console.log("JR NOTE: i am", this.title, "and my position is", this.row, this.col, "and maze is", maze.map)
    this.timesBeaten++;
    /*
      so my problem with directions doesn't fuck me over, i can refer to this
        []
      [][][]
        []
    */
    //right ,down, left,up is the order (makes going to bottom right corner (where it grows) easiest)
    const right = maze.map[this.row][this.col + 1];
    const down = maze.map[this.row + 1] ? maze.map[this.row + 1][this.col] : undefined;
    const left = maze.map[this.row][this.col - 1];
    const up = maze.map[this.row - 1] ? maze.map[this.row - 1][this.col] : undefined;
    console.log("JR NOTE: i am", this.title, "and here is my possibile unlocks", [right, down, left, up])
    let unlockOrder = [right, down, left, up];

    //any of the above can be undefined

    //confirm everything correct is unlocked
    for (let i = 0; i < unlockOrder.length; i++) {
      const room = unlockOrder[i];
      //if you're not already unlocked, unlock yourself
      room && !room.unlocked && room.unlock(maze);
    }
  }

  getAttack = () => {
    let rotation = 1;
    const themes = this.themeKeys.map((item) => all_themes[item])
    for (let theme of themes) {
      rotation += themeToAttackMultiplier(theme.key)
    }
    return rotation;
  }

  getDefense = () => {
    let rotation = 1;
    const themes = this.themeKeys.map((item) => all_themes[item])
    for (let theme of themes) {
      rotation += themeToDefenseMultiplier(theme.key)
    }
    return rotation;
  }

  getSpeed = () => {
    let rotation = 1;
    const themes = this.themeKeys.map((item) => all_themes[item])
    for (let theme of themes) {
      rotation += themeToSpeedMultiplier(theme.key)
    }
    return rotation;
  }

  getTint = () => {
    let rotation = 0;
    const themes = this.themeKeys.map((item) => all_themes[item])
    for (let theme of themes) {
      rotation += themeToColorRotation(theme.key)
    }
    return rotation;
  }

  renderSelf = (maze, rowEle) => {
    const ele = createElementWithClassAndParent("div", rowEle, "maze-cell");
    this.unlocked ? ele.classList.add("room-unlocked") : ele.classList.add("room-locked");

    const renderPending = () => {
      ele.style.backgroundColor = "grey";
      const label = createElementWithClassAndParent("div", ele, "room-label");
      label.innerText = "LOCKED";
    }

    const renderEmpty = () => {
      ele.classList.add("empty-cell");
      ele.innerText = ".";
    }



    const renderUnlock = () => {

      const rotation = this.getTint();
      //console.log("JR NOTE: setting rotation", rotation)
      if (rotation === 0) {
        ele.style.backgroundColor = "grey";
      } else {
        ele.style.filter = `hue-rotate(${rotation}deg)`;
      }

      ele.onclick = () => {
        //no. you forgot this. i don't care if you found some other way to access it, the part of your soul that recognizes this has rotten away
        //did you really think there would be no consequences to using [CENSORED] so blithely?
        if (globalDataObject.rottenMiniGames.includes(this.miniGameKey)) {
          fuckShitUpVikStyle();
          return;
        }
        globalMiniGames[this.miniGameKey].render(globalTabContent, this, this.incrementTimesBeaten);
        if (globalMeatMode && globalMeatGrowing) {
          growMeat();
        }
      }
      const label = createElementWithClassAndParent("div", ele, "room-label");

      label.innerText = this.title + ` (${this.timesBeaten})`;
    }

    if (this.unlocked) {
      renderUnlock();
    } else {
      const right = maze.map[this.row][this.col + 1];
      const down = maze.map[this.row + 1] ? maze.map[this.row + 1][this.col] : undefined;
      const left = maze.map[this.row][this.col - 1];
      const up = maze.map[this.row - 1] ? maze.map[this.row - 1][this.col] : undefined;
      const neighbors = [right, down, left, up];
      for (let neighbor of neighbors) {
        if (neighbor && neighbor.unlocked) {
          renderPending();
          return;
        }
      }
      renderEmpty();
    }


  }

}

/*
suddenly im thinking of an au where like
wodin and todd were twins purely so wodin can starve todd in the womb and then be fucked up about it later, like that stephen king book
the dark half or whatever
the Witness doens't exist and neither do the arms except they clearly also do
the Thief of Space hoards what fragments he can find and the Maid of Space spreads the out as far as she can
and the Witness provides a realm for the forgotten and irrelevant to tell their own stories  (dream bubbles, aproximately)
but thats the point of west right now: we only get flashes
*/


/*

despap, as the resident grace, provides their team with various hacking tools
i.e how you are PLAYING tge various games instead of merely observing
the pap hands on lohae or butlerbot on lomat are examples
for peewee, despap "helpfully" provided various cybernetics to help his streaming career
but once he enters sburb the observers past the furthest ring squirm their way inside
*/

/*
theres an area of gopher where the wanderer finds themselves pouring over information and unresponsive
and if you go in the right order
you BECOME that self pouring over information
reading it as the wanderer sort of half remembering regrets about wodin
is fun
*/

/*

the god that never was
thats always been how wodin and todd worked really
todd pushed to the edges of relevance while wodin took up all the room
wodin never meant for that to be how it went
but it always was*/

/*
East was about the Intern, and how they related to Wodin/The Wanderer/Wanda.EastEast was about Peewee and how they related to the Echidna Universe from outside it (West).EastEastEast, which is to say, this bathroom, is about combinbing the two.The Intern, now the Witness, following the thread created by Peewee in the East and the Observers in the west in order to bridge the gap.The Witness will be our next viewpoint character to the West.From West: ```In the split second before the Observers leave you WITNESS their boogie through the void. This changes EVERYTHING.```.East and West are now connected sufficiently. The Bathroom is the bridge.
*/


/*
the INTERN has witnessed the path through which the observers travel the void

an invite the observers in to similarly witness the various arms

wants to show them the memory leak

the arms might exist only for a few days or weeks but spawn with history, like sburb lands

the universe spins and whatever arm is in the present slot is rendered

wanda makes a whole new universe any time arm2 hits , its a memory leak.

if she is in a universe it doesnt spin, it is stuck on her preferred setting

once she leaves it spins back up. arm2 is just whats left of arm1 , no reset history, special case
*/

/*

next south:

a train in the void helmed by the time player Ambrose that can help the witness finally directly contact the next todd

to beg they disrupt the spiral

to confess to wanda they Know
*///

//http://farragofiction.com/CodexOfRuin/viewer.html?name=_&data=N4IgdghgtgpiBcIBa0AOEwEsD2ACAytgK6ogA0IAJjAM6YDmkALjmAsgLQDyHAqhwAUOABlHkQAJ0w0A1uwCCAGQCiAgBLimACxiwaCsrgCMRgMyGAasoBKATUMnzuACrz8z+8bOH8XXgIdvAj8BAEkAOWV8fEMAJlFhQ1sow0TccK5UwwBxADFeZUUHUzNxGiYIJn1EZQANZxtwpTIORzIBeWdQ5XDnMjbrZSVQ91CAYX7vMd5rUL8Y1u9FLltmtp6bbOUuibbcbIz8EdwOWMMkQ5H4YxLTcRgADwgAYyYAGwBPAH1tCRgYH6YVDVECKEQiYSxXBQIgSagSGi4AAsAE5cAA3TCvTBQREwdEwCQfXB0MD0N4wXBvbDYVAAOlw8jeb1w2AAZrhtLpcFoIJRcJgmLhntgoJgyXSyGDhBDYgByRH4CoAI0wb0FxLGxDATEJuGozz+EBotFwAHcdGABULlTARXoSUw-jQTfzsBJhe6wISYJRJQB1S24ZVG55acX0XDS2XmtUsmRxzlabAm3AQCTa-mC3BEHVq624Nn-N6ImgQIt08Ti8ri17sCyE4lqBhaSyN3DN+it3ANokdlttvud7vOY1MD5VsB0LtMdhaqBQbBgQyKbBmwfE1frnvtrcrmDaCBvcSVCph2A69jDwzXqNrjd37e9zdr8R-VDOuhL+u7+87vt7v+L5Pr+27WNgTC6mwFDlBAqrquOXwUgSx6ILEb6+l81BFlOcCIMIdLCOIFqCgC2EwLh7AEURFDKm8LwyFhMA4SaVGEeI6AUkxLF4SA1FVlA9BfDQEjPOwWiQag8AAPTSTAHy+tgbz0NAtB0va0koFA6BYFg0k4hA9C0NJ+BEDQ4bSQkABsRgcDiQnxLEpjCEYkImLEACswgABx0qgZJlEw7rfNQFRqiCoRMAquAAF7EKgFQ1s8lYUCwqBGOwSDcHwggQsIAqIgSfaJeOKUgGl6GILYxAksmRBvPyTrEjQoowGVaV3IggYUcGobhmS5zZfwQgJLGzK9RGuAfDVZZvOilSsIYoTQjAGCGLNmDzSwS6VgAvkAA