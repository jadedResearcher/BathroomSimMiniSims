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

const makeRandomEasyRoom = (rand, row, col) => {
  console.log("JR NOTE: making random easy room, for now they are all buttons")
  const theme = Math.random() > 0.3 ? undefined : pickFrom(Object.values(all_themes));
  return new Room(`${theme ? theme.pickPossibilityFor(ADJ, rand) + " BUTTON" : "BUTTON"} ROOM`, theme ? [theme] : [], "BUTTON", row, col);
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
const makeRandomRoom = (rand, row, col) => {
  console.log("JR NOTE: eventually if have more lifetime candy, pick harder rooms");
  return makeRandomEasyRoom(rand, row, col);
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
  title = "Firsty";
  //each row is a row in the map
  //each cell is either undefined or a room in the maze
  map = [];
  constructor(rand) {
    this.rand = rand;
    //starts out with a size of one x one.
    this.map.push([makeRandomEasyRoom()]);
    this.map[0][0].unlock(this);
  }

  loadFromJSON = (json) => {
    //console.log("JR NOTE: json is", json)
    this.map = []
    this.title = json.title ? json.title : "FIRSTY";
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

  hitMinSize = ()=>{
    return this.getRoomCount()< this.minSize;
  }

  getRoomCount = () => {
    let count = 0;
    //yes this is not efficient to loop on the map to find out how many rooms there are but this will be called only once on unlock per room, can afford to be slow
    for (let row of maze.map) {
      for (let col of row) {
        if (col) {
          count++;
        }
      }
    }
    return count;
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
  themes = [];
  unlocked = false;
  timesBeaten = 0;
  miniGameKey = "BUTTON"


  onClick; //usually will be rendering the inside of the room

  constructor(title, themes, miniGameKey, row = 0, col = 0) {
    this.row = row;
    this.col = col;
    this.title = title;
    this.themes = themes;
    this.miniGameKey = miniGameKey;
  }

  unlock = (maze) => {
    console.log("JR NOTE: unlocking", this.title)
    this.unlocked = true;

    let neighbor_count = 0;

    const processRight = () => {
      const right_row = this.row;
      const right_col = this.col + 1;
      const odds_empty = 0.25;
      if (!maze.map[right_row, right_col]) {
        //if right does not exist, check if its col index is the same or greater than the rows length
        //if so, need to add a new "undefined" cel to the end of every row in the maze
        //then, pick my index and make a new random room
        if (right_col < maze.map[right_row].length && maze.rand.nextDouble() > odds_empty) {
          maze.map[right_row][right_col] = makeRandomRoom(maze.rand, right_row, right_col);
          neighbor_count++;
        }
      }
    }

    const processLeft = () => {
      const right_row = this.row;
      const right_col = this.col - 1;
      const odds_empty = 0.75;
      if (!maze.map[right_row, right_col]) {
        //if left does not exist, check if my col index is zero (if so, stop)
        //then, pick my index and make a new random room
        if (right_col >= 0 && maze.rand.nextDouble() > odds_empty) {
          maze.map[right_row][right_col] = makeRandomRoom(maze.rand, right_row, right_col);
          neighbor_count++;
        }
      }
    }

    const processUp = () => {
      const right_row = this.row - 1;
      const right_col = this.col;
      const odds_empty = 0.75;
      if (!maze.map[right_row, right_col]) {
        //if up does not exist, proccess if my row index is zero (if so, stop)
        //then, pick my index and make a new random room
        if (maze.map[right_row] && right_row >= 0 && maze.rand.nextDouble() > odds_empty) {
          maze.map[right_row][right_col] = makeRandomRoom(maze.rand, right_row, right_col);
          neighbor_count++;
        }
      }
    }

    const processDown = (force = false) => {
      const right_row = this.row + 1;
      const right_col = this.col;
      const odds_empty = force ? 0 : 0.25;
      if (!maze.map[right_row, right_col]) {
        //if down does not exist, check if its row index is the same or greater than how many rows there are
        //if so, add a new row of all undefineds to the maze
        //then, pick my index and make a new random room
        if (maze.map[right_row] && right_row < maze.length && maze.rand.nextDouble() > odds_empty) {
          maze.map[right_row][right_col] = makeRandomRoom(maze.rand, right_row, right_col);
          neighbor_count++;
        }
      }

    }

    processRight();
    processDown();
    processLeft();
    processUp();
    console.log("JR NOTE: did we generate any rooms? ", maze.map)
    //if neighbor_count is zero and maze has not yet hit its min size yet, force a down
    if(!hitMinSize() && neighbor_count === 0){
      console.log("JR NOTE: because we haven't hit min size yet, not allowing dead ends")
      processDown(true);
    }
  }

  incrementTimesBeaten = (maze) => {
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
    let unlockOrder = [];
    //don't add undefined things (up can unlock after just one beat if its the only neighbor)
    if (right) {
      unlockOrder.push(right)
    }

    if (down) {
      unlockOrder.push(down)
    }

    if (left) {
      unlockOrder.push(left)
    }

    if (up) {
      unlockOrder.push(up)
    }
    //any of the above can be undefined

    // if i have been beaten 1 time, unlock index 0, if 2, 1, etc.
    let toUnlock = unlockOrder[this.timesBeaten - 1]
    console.log("JR NOTE: I think i need to unlock: toUnlock ", { toUnlock, unlockOrder })

    if (toUnlock) {
      toUnlock.unlock(maze);
    }



  }

  renderSelf = (maze, rowEle) => {
    const ele = createElementWithClassAndParent("div", rowEle, "maze-cell");

    const renderPending = () => {
      ele.style.backgroundColor = "grey";
    }

    const renderEmpty = () => {
      ele.classList.add("empty-cell");
      ele.innerText = ".";
    }

    const renderUnlock = () => {
      let rotation = 0;
      for (let theme of this.themes) {
        rotation += themeToColorRotation(theme.key)
      }
      //console.log("JR NOTE: setting rotation", rotation)
      if (rotation === 0) {
        ele.style.backgroundColor = "grey";
      } else {
        ele.style.filter = `hue-rotate(${rotation}deg)`;
      }

      ele.onclick = () => {
        globalMiniGames[this.miniGameKey](this.incrementTimesBeaten);
      }
      const label = createElementWithClassAndParent("div", ele);
      label.style.height = "50px";

      label.innerText = this.title;
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