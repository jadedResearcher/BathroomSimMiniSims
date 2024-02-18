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

//really just making a system that knows how to render boxes so i can wrap my head around it
//this is created BEFORE i have a room element
const testMazeRender = (parent) => {

  const rand = new SeededRandom(13);

  const sampleMaze = [
    [makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), makeRandomTestRoom(rand), undefined]
    , [undefined, makeRandomTestRoom(rand), undefined,  makeRandomTestRoom(rand), undefined]
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
      }

    }


  }



}

const makeRandomTestRoom = (rand) => {
  const theme = pickFrom(Object.values(all_themes));
  return new Room(`${theme.pickPossibilityFor(ADJ,rand)} ROOM`, [theme], ()=>{window.alert("TODO")});
}


class Room {
  title = "???"
  themes = [];

  onClick; //usually will be rendering the inside of the room

  constructor(title, themes, onClick) {
    this.title = title;
    this.themes = themes;
    this.onClick = onClick;
  }

  renderSelf = (rowEle) => {
    const ele = createElementWithClassAndParent("div", rowEle, "maze-cell");
    let rotation = 0;
    for (let theme of this.themes) {
      rotation += themeToColorRotation(theme.key)
    }
    //console.log("JR NOTE: setting rotation", rotation)
    ele.style.filter = `hue-rotate(${rotation}deg)`;

  }

} 