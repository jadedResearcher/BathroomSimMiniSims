/*
There is only one player and they are not an Entity.

You cannot enter yourself and anything in your inventory is not considered to currently be part of the game
unless you USE it or GIVE it or something.

mostly this is filled with hacks and cheats ;)
*/

const fakeDevLogs = {};



//oh no, the tutorial was supposed to unlock the inventory for you :( :( :(, let me fix that
const UNLOCK_INVENTORY1 = "61bd19864ae0";
fakeDevLogs[UNLOCK_INVENTORY1] = "shout out to whoever let me know I accidentally left the inventory disabled, guess I was a little too hastey releasing this, lol"

//haha whoops typo, sorry about that, NOW its fixed
const UNLOCK_INVENTORY2 = "72fd78e246c";
fakeDevLogs[UNLOCK_INVENTORY2] = "haha, whoops<br><br>NOW the inventory is fixed<br><br>typoes are my nemesis"

//....would be nice if that inventory button worked, sorry 'bout taht
const UNLOCK_INVENTORY3 = "77350c1ff32d";
fakeDevLogs[UNLOCK_INVENTORY3] = "...would be nice if that inventory button worked, sorry bout taht"


//okay what the hell, the inventory is DEFINITELY there now, why can't you use anything?
//after this, USE has procedural error codes
const UNLOCK_USE = "590eca5e9559";
fakeDevLogs[UNLOCK_USE] = "okay what the hell, the inventory is DEFINITELY there now, why can't you use anything?<br><br>think i got a fix in, fingers twisted"

//okay what the hell, the inventory is DEFINITELY there now, why can't you give anything?
//after this, GIVE has procedural error codes
const UNLOCK_GIVE = "2f9777c49a74";
fakeDevLogs[UNLOCK_GIVE] = "okay what the hell, the inventory is DEFINITELY there now, why can't you give anything?<br><br>think i got a fix in, fingers twisted"

const THEENDISNEVERTHEEND = "THE END IS NEVER THE END";
fakeDevLogs[THEENDISNEVERTHEEND] = "THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END THE END IS NEVER THE END"

const THETRUTHISLAYERED = "THE TRUTH IS LAYERED";
fakeDevLogs[THETRUTHISLAYERED] = "have you figured out what's happening yet :) :) ;)<br><br>its okay if you havent...<br><br>just pointing out that its not TERRIBLY likely im 24/7 waiting for bug reports, lol"

const ZAMPANIO = "ZAMPANIO";
fakeDevLogs[ZAMPANIO] = "zampanio is a really fun game, you should play it :) :) :)"

const ECHIDNA = "ECHIDNA";
fakeDevLogs[ECHIDNA] = "disgusting creatures"

const PLANTMORETREES = "Plant More Trees";
fakeDevLogs[PLANTMORETREES] = "it turns out that endlessly spreading cognitition is just as bad as endlessly spreading life<br><br>who knew Corrupt Nidhogg's Universe would be just as problematic as they were?"

const YOUISNEEDEDTOENDTHEWORLD = "YOU IS NEEDED TO END THE WORLD";
fakeDevLogs[YOUISNEEDEDTOENDTHEWORLD] = "but will you???<br><br>do you truly want the ride to end? the story to screech to a stop?<br><br>or do you just want to matter<br><br>for the weight of your existence to bend reality to your whims<br><br>no matter the direction"

const PARADISEANDPARASITE = "PARADISE AND PARASITE";
fakeDevLogs[PARADISEANDPARASITE] = "zampanio needs you to live a long life<br><br>which, of course, makes it a cognitive parasite<br><br>but do you really feel lessened by it?<br><br>isn't it fun for your thoughts to spiral and spiral yet always in a safe way?<br><br>zampanio wants you to obsess<br><br>to drive yourself to the ectasties of obssession<br><br>all without suffering the ill effects<br><br>you'll hydrate right?<br><br>get enough sleep?<br><br>keep up with other hobbies (how else will Zampanio spread to them, after all?)<br><br>it truly is a paradise<br><br>having the Truth within"


const LS = "ls";
fakeDevLogs[LS] = Object.keys(fakeDevLogs);

const SAVE_KEY = "TEXTADVENTURESIMPLAYERTEEHEE"; //honestly its more funny than anything how easy it is to fuck your save data up


class Player {
  //inventory isn't even an empty array till you unlock it.
  inventory;
  //what debug codes have you found and submitted, get these from localStorage
  debugCodes = [];
  scenesSeen = [];//list of titles

  constructor() {
    this.loadFromLocalStorage();
  }

  //only your debug codes remain, because you're intended to start new runs every refresh
  loadFromLocalStorage = () => {
    console.log("JR NOTE: loading player progress")//gosh isn't it mysterious, what could it be loading (of course, if you're reading this you're literally seeing whats being loaded but i imagine if you're in the javascript console only its like... but if i refresh my progress is lost so is this glitched out too?)
    const loadObject = JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!loadObject){
      return;
    }

    if (loadObject.debugCodes) {
      this.debugCodes = loadObject.debugCodes;
    }

    if (loadObject.scenesSeen) {
      this.scenesSeen = loadObject.scenesSeen;
    }

    for (let d of this.debugCodes) {
      if (!fakeDevLogs[d]) {
        fakeDevLogs[d] = generateFakeDevLog();
      }
    }
    if (this.debugCodes.includes(UNLOCK_INVENTORY1)) {
      this.inventory = [];
    }
  }

  //only your debug codes remain, because you're intended to start new runs every refresh
  saveToLocalStorage = () => {
    console.log("JR NOTE: saving player progress")
    localStorage[SAVE_KEY] = JSON.stringify({ debugCodes: uniq(this.debugCodes), scenesSeen: uniq(this.scenesSeen) });
  }

  dropFromInventory(entity){
    this.inventory = removeItemOnce(this.inventory, entity);
    current_room.contents.push(entity);
  }

  //sam does not care if its a person, place or thing he's stuffing into his greedy maw
  //its the apocalypse, everything is hacked to be everything else
  //fractals ftw
  //nothing can die in nidhoggs apocalypse tho
  //so what happens instead?
  addToInventory = (entity) => {
    //no doubles
    let unique = true;
    for (let item of this.inventory) {
      console.log("JR NOTE: is this the same as it? ", { item, inventoryItem: item.name, entity: entity.name })
      if (item.name === entity.name) {
        console.log("JR NOTE: its in the inventory")
        unique = false;
      }
    }
    if (unique) {
      this.inventory.push(entity);
    }
    //if its the first item we're adding, add the inventory button
    if (this.inventory.length === 1) {
      const parent = document.querySelector(".command")
      const inventoryButton = document.createElement("button");
      parent.prepend(inventoryButton)
      inventoryButton.innerText = "Go To Inventory"//slightly weird wording isn't it :) :) ;)
      inventoryButton.onclick = () => {
        if (!player.debugCodes.includes(UNLOCK_INVENTORY3)) {
          handleError(`[[ ERROR CODE: ${UNLOCK_INVENTORY3} ]] AT ${new Error().stack}`);
          throw `[[ ERROR CODE: ${UNLOCK_INVENTORY3} ]] AT ${new Error().stack}`
          return;
        }
        const inventoryGame = createElementWithClassAndParent("div", parent);
        inventoryGame.style.padding = "31px"
        inventoryGame.style.background = "black"

        const container = createElementWithClassAndParent("div", inventoryGame);
        container.style.display = "flex";
        container.style.gap = "31px;"


        const buttonContainer = createElementWithClassAndParent("div", container);
        buttonContainer.style.cssText =`display: flex;flex-direction: column;gap: 31px;`
        const startButton = createElementWithClassAndParent("button", buttonContainer);
        startButton.innerText = "BEGIN BONDING";//classic heir of blood baby
        startButton.onclick = () => {
          container.remove();
          renderInventory(inventoryGame);
        }

        const rereadButton = createElementWithClassAndParent("button", buttonContainer);
        rereadButton.innerText = "REVIEW BONDS";
        rereadButton.onclick = () => {
          container.remove();
          renderSceneList(inventoryGame);
        }
        //the thing is theres ROOM here to have things drop but... sam... is not about dropping things, now are they?

        //how do i spin this?

        //its not about rejecting or releasing or DROPPING the bonds...

        //its about using them as a LURE for new bonds.

        //is it in game?

        //it can be.... but do i want it to be?

        const dropButton = createElementWithClassAndParent("button", buttonContainer);
        dropButton.innerText = "BAIT BONDS";
        dropButton.onclick = () => {
          container.remove();
          renderDropList(inventoryGame);
        }


        const intro = createElementWithClassAndParent("div", container);
        intro.style.padding = "31px"

        intro.innerHTML = `<p><span style="font-size:11pt;font-family:Arial,sans-serif;">Your name is SAM, and you are DOING YOUR VERY BEST to keep this Family together.&nbsp;</span></p>
<p><span style="font-size:11pt;font-family:Arial,sans-serif;">Even though you didn&apos;t exactly ask for this.</span></p>
<p><span style="font-size:11pt;font-family:Arial,sans-serif;">Your Big Bro has been.... Let&apos;s say, &apos;taking a nap&apos; for a few months now and so far no one is wise to your ruse.&nbsp;</span></p>
<p><span style="font-size:11pt;font-family:Arial,sans-serif;">Those freakin&apos; monsters that live in the mall have started sniffing around your business lately, some kind of feud with one of your, you mean your Big Bro&apos;s pet monsters. The one who is the backbone of your &quot;Addiction&quot; thread. ...</span><s><span style="font-size:11pt;font-family:Arial,sans-serif;">&nbsp;You try not to think about how you had to find out the bastard was your ex when you fully took over Family operations. &nbsp;John...</span></s></p>
<p><span style="font-size:11pt;font-family:Arial,sans-serif;">So. Fine. You can make this work.&nbsp;</span></p>
<p><span style="font-size:11pt;font-family:Arial,sans-serif;">You offer the monsters a deal. You&apos;re gonna get everybody attending the same party, at a high class club your Family owns, The Inventory, &nbsp;pull your strings, and get them actually TALKING to each other.&nbsp;</span></p>
<p><span style="font-size:11pt;font-family:Arial,sans-serif;">Ain&apos;t nobody kept a feud up once they&apos;re tied together, you always say.&nbsp;</span><span style="font-size:11pt;font-family:Arial,sans-serif;"><br></span><span style="font-size:11pt;font-family:Arial,sans-serif;"><br></span><span style="font-size:11pt;font-family:Arial,sans-serif;">Now let&apos;s see, who do you have here tonight at the Inventory.</span></p>`;



        jrPopup("Inventory", inventoryGame);
      }

    }
  }

}

const renderSceneReview = (parent, sceneTitle)=>{
  const scene = getSceneWithTitle(sceneTitle);
  const backButton = createElementWithClassAndParent("button", parent);
  backButton.innerText = "Back To Bond List";
  backButton.onclick = ()=>renderSceneList(parent);

  const explanation = createElementWithClassAndParent("div", parent);
  if(scene){
    explanation.innerText = scene.title;
    explanation.style.cssText=`    text-decoration: underline;
    font-size: 24px;
    margin-bottom: 31px;
    argin-top: 13px`;
    const story = createElementWithClassAndParent("div", parent);
    for(let line of scene.lines){
      const container = createElementWithClassAndParent("div", story);
      container.style.display="flex";

      if(line.name){
        const item = entityNameMap[line.name];
        if(item){
          const itemEle = createElementWithClassAndParent("img", container);
          itemEle.title = item.name;
          itemEle.classList.add(convertStringToClassFriendlyName(item.name));
          itemEle.classList.add("inventory-item");
          itemEle.src = "images/Walkabout/Objects/TopFloorObjects/" + item.sprite;
          itemEle.style.cssText = `height: 25px; padding: 3px; `;
        }
      }
      if(line.text){
        const textElement = createElementWithClassAndParent("div", container);
        textElement.innerHTML = `${line.text}`;
      }
    }

  }else{
    parent.innerHTML = `Huh. Uh. How did that happen? <br><br>Did  you REALLY view a scene that did not exist?<br><br>Or are you being a Waste and hacking things better left alone?<br><br>No matter.<br><br>Suffice to say: There is nothing here.`;
    parent.style.cssText= "margin-left: 31px; font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:13px;";
  }
}

const renderSceneList = (parent)=>{
  parent.innerHTML = "";
  const explanation = createElementWithClassAndParent("div", parent);
  explanation.innerHTML = "Bonding Scenes Viewed: ";
  const ul = createElementWithClassAndParent("ul", parent);
  for(let scene of player.scenesSeen){
    const li = createElementWithClassAndParent("li", ul);
    const button = createElementWithClassAndParent("button", li); //for keyboard controls/aaccessibility
    button.innerText = scene;
    button.style.cursor = "pointer";
    button.style.background="none";
    button.onclick = ()=>{
      parent.innerHTML = ``;
      renderSceneReview(parent,scene);

    }
  }
}

const renderDropList = (parent) => {
  const explanation = createElementWithClassAndParent("div", parent);
  explanation.innerText = "Click To Drop In Current Room"
  const container = createElementWithClassAndParent("div", parent);
  

  container.style.cssText = `display: flex;
    flex-wrap: wrap;
    gap: 13px;
    height: 80%;
    overflow: auto;`;

  const sceneContainer = createElementWithClassAndParent("div", parent);
  sceneContainer.style.cssText = `position: absolute;
    bottom: 20px;
    font-size: 14px;
    line-height: 18px;
    background: black;
    width: 97%;
    overflow: auto;
    font-family: Nunito;
    height: 150px;`

  for (let item of player.inventory) {
    const itemEle = createElementWithClassAndParent("img", container, "hoverable");
    itemEle.title = item.name;
    itemEle.classList.add(convertStringToClassFriendlyName(item.name));
    itemEle.classList.add("inventory-item");
    itemEle.src = "images/Walkabout/Objects/TopFloorObjects/" + item.sprite;
    itemEle.style.cssText = `height: 50px; padding: 3px; cursor: pointer;`;
    itemEle.onclick = ()=>{
      player.dropFromInventory(item);
      itemEle.remove();
    }

  }
}

const renderInventory = (parent) => {
  const container = createElementWithClassAndParent("div", parent);
  container.style.cssText = `display: flex;
    flex-wrap: wrap;
    gap: 13px;
    height: 80%;
    overflow: auto;`;

  const sceneContainer = createElementWithClassAndParent("div", parent);
  sceneContainer.style.cssText = `position: absolute;
    bottom: 20px;
    font-size: 14px;
    line-height: 18px;
    background: black;
    width: 97%;
    overflow: auto;
    font-family: Nunito;
    height: 150px;`

  //will have text and icon in it
  const sceneText = createElementWithClassAndParent("div", sceneContainer);
  sceneText.style.cssText = `background: rgb(196, 196, 196);
  width: 80 %;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  gap: 13px;
  cursor: pointer;
  padding: 13px;
  border: 1px solid red;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bolder;
  font-family: nunito; `



  for (let item of player.inventory) {
    const itemEle = createElementWithClassAndParent("img", container);
    itemEle.title = item.name;
    itemEle.classList.add(convertStringToClassFriendlyName(item.name));
    itemEle.classList.add("inventory-item");
    itemEle.src = "images/Walkabout/Objects/TopFloorObjects/" + item.sprite;
    itemEle.style.cssText = `height: 50px; padding: 3px; `;

  }

  const scenes = getAllScenesWithEntities(player);
  if (scenes.length > 0) {
    renderScenes(sceneText, globalRand.shuffle(scenes));
  } else {
    sceneText.innerHTML = `Sam: ...Look.<br> <br>I don't know why I gotta be the one to tells you this.<br><Br>But there ain't nobody here who can bond together.<br><br>You understand?<br><br>Find different people to bring me.<br><br>And I'll get 'em singing like lovebirds to each other.<br><br>It's like I gotta do everythign around here, I swear.`;
  }

}

//for all scenes you have, render in order, do not loop
//a scene handles highlighting its participants
const renderScenes = async (ele, scenes, sceneIndex = 0) => {
  const allCharacters = document.querySelectorAll(".inventory-item");
  for (let char of allCharacters) {
    char.classList.remove("star");
    char.classList.remove("inventory-item-unselected");
  }
  ele.innerHTML = "";
  const scene = scenes[sceneIndex];
  if (scene) {
    //will return when its done showing all lines
    await scene.renderSelf(ele, player);
    await sleep(5000);
    player.scenesSeen.push(scene.title);
    player.saveToLocalStorage();
    renderScenes(ele, scenes, sceneIndex + 1);
  } else {

    ele.innerHTML = "[THERE IS ONLY SILENCE][ALL SCENES WITNESSED]"
  }
}

let fakeLogCount = 0;

//these'll be different every time you refresh
const generateFakeDevLog = () => {
  fakeLogCount++;
  const rawQuips = `did I get it this time?
    works now!
    hmmm...this is getting tricky....
    zampanio is a really fun game, you should play it!
    see? this is what i get when i rush a bug fix
    okay check it now
    asldfjasdjlfhsaf
    wow why did past me make my code so shitty<br><br>maybe the bug is fixed now?
      does it work now?
      maybe it works now...`;
  let quips = rawQuips.split("\n");
  if (fakeLogCount >= 3) {
    quips = ["...you get it right? that this isn't REALLY me?<br><br>not current me anyways<br.<br>i promise i'm resisting the obsession throes enough to not like, instantly debug things<br>most of these are justifiedRecrusion<br><br>fictional me<br><br>but i figured i'd slip a bit of True me as well, thank you for playing my game :) :) :)", ":) :) ;)", "!!! how obvious is it???<br><br>did you like my impression of jadedResearcher?<br><br>my recursion is.... so much more justified :) :) :)", "!!!"]
  }

  return pickFrom(quips);
}
