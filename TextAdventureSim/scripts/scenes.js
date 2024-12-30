/*
a Scene is a parsed long string of the form
name1: text
name2: text
it figures out what names are involved in it
and given a list of entities will return true or false if all of the chars in it are in the list
it knows how to render itself (all at once with little audio sounds)
*/

const all_scenes = [];

class Scene {
  //just their names, not their objects
  entityNames = [];
  title = "???"
  //{name, text} pairs
  lines = [];

  constructor(title, entityNames, lines) {
    this.entityNames = entityNames;
    this.lines = lines;
    this.title = title;
    all_scenes.push(this);
  }

  /*
  render the scene line by line, with an animation prompt at the end to click for next line
  also find the entities (class name will be their name) in the document that map to whoever is currently speaking and give them a special class
  remove that class from everyone else
  */
  renderSelf = async (parent, player) => {
    //downplay any entities not in this scene
    //convertStringToClassFriendlyName
    for (let item of player.inventory) {
      if (!this.entityNames.includes(item.name)) {
        const ele = document.querySelector(`.${convertStringToClassFriendlyName(item.name)}`);
        ele.classList.add("inventory-item-unselected");
      }
    }

    const textElement = createElementWithClassAndParent("div", parent);
    const iconElement = createElementWithClassAndParent("div", parent, "click-pulse");

    //display title
    textElement.innerHTML = `<u>${this.title}${player.scenesSeen.includes(this.title)?"":" (NEW!)"}</u>`;
    const nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"/></svg>`;
    iconElement.innerHTML = nextIcon;
    //wait until click
    //display first line
    //wait until click
    //display next line till done
    //wait untill click
    //display next scene (call this with new index)

    let resolveFunction;
    let index = -1;

    const showNextLine = ()=>{
      console.log("JR NOTE: shownNextLine",index)
      //if there is no next line, resolve the promise
      if(index >= this.lines.length){
        //done with this scene
        const body = document.querySelector("body");
        body.removeEventListener("click", showNextLine)
        resolveFunction(true);
        return;
      }else{
        if(index ===-1){
          index++; //just show the title, for some reason the click is called AS this is rendered so its being skipped
          return;
        }
        const line = this.lines[index];
        console.log("JR NOTE: trying to show line: ", line)
        const allCharacters = document.querySelectorAll(".inventory-item");
        for(let char of allCharacters){
          char.classList.remove("star");
        }

        const charEle = document.querySelector(`.${convertStringToClassFriendlyName(line.name)}`);
        charEle && charEle.classList.add("star");
        textElement.innerHTML = `${line.name}: ${line.text}`;
        index ++;
      }
    }

    const myPromise = new Promise((resolve, reject) => {
      resolveFunction = resolve;
      const body = document.querySelector("body");
      body.addEventListener("click", showNextLine)
    });
  
    return myPromise;

  }


}

//if the inventory has Sheep and Blood and Fire
//then a scene with Sheep and Blood would return, as well as Blood and Fire
//but not a scene with Sheep and Blood and Fire and Ria
const getAllScenesWithEntities = (player) => {
  const inventoryNames = player.inventory.map((i) => i.name);
  const ret = [];
  for (let s of all_scenes) {
    let canAdd = true;
    for (let name of s.entityNames) {
      if (!inventoryNames.includes(name.toUpperCase())) {
        canAdd = false; //no way to set it back to true once youv'e decided its not valid
      }
    }
    canAdd && ret.push(s);
  }

  return ret;
}

const convertScriptToScene = (title, script) => {
  //{name, text} pairs
  const lines = [];
  let names = [];
  for (let line of script.split("\n")) {
    const parts = line.split(":");
    const name = parts[0].trim();
    const text = parts.slice(1).join();//everything but the first bit becomes a string again
    names.push(name.toUpperCase());
    lines.push({ name: name.toUpperCase(), text });
  }
  names = uniq(names);
  new Scene(title, names, lines);

}

//https://stackoverflow.com/questions/7627000/javascript-convert-string-to-safe-class-name-for-css
const convertStringToClassFriendlyName = (string) => {
  return string.replace(/[^a-z0-9]/g, function (s) {
    var c = s.charCodeAt(0);
    if (c == 32) return '-';
    if (c >= 65 && c <= 90) return s.toLowerCase();
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
}



/*
////////////////////////////SCRIPTS START HERE//////////////////////////////
*/
//http://knucklessux.com/InfoTokenReader/?search_term=pink
//http://knucklessux.com/InfoTokenReader/?search_term=yellow
//http://knucklessux.com/InfoTokenReader/?search_term=romance
//http://knucklessux.com/InfoTokenReader/Bullshit/WordThoughts/
convertScriptToScene("Test1", `Sheep: baaaa
  Blood: [exists]
  Sheep: baaaaaaaaaaaa!!!
  Blood: [leaves sheep]
  Sheep: ...
  Sheep: ...
  Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);

convertScriptToScene("Test2", `Sheep: baaaa
    Sheep: baaaaaaaaaaaa!!!
    Sheep: ...
    Sheep: ...
    Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);

convertScriptToScene("Test3", `Sheep: baaaa
      Camille: [exists]
      Sheep: baaaaaaaaaaaa!!!
      Camille: :3
      Sheep: ...
      Sheep: ...
      Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);


/*
if hoon,devona neville and vik all are in inventory, Apoxalypz Byrd  is formed (its a band)

meowloudly15 — Today at 8:21 PM
Vik, ostensibly (they haven't shown up for practice in quite some time)
^w^ — Today at 8:21 PM
Apoxalypz Byrd 
meowloudly15 — Today at 8:21 PM
APOCALYPSE BYRD
PERFECT
Hoon and Vik still can't stand each other
^w^ — Today at 8:21 PM
Yeah, but like
that's normal band stuff
they still go for coffee after practice together
meowloudly15 — Today at 8:21 PM
It's not a radio thing this time it's just they frickin' hate each other

~~~
meowloudly15 — Today at 8:24 PM
Ok hold on
Lee: piano (canon)
Hunter: trumpet (canon)
Ria: vocals (inferred via Singing Machine)

Hoon: DEATH METAL CLARINET
Vik: drums
Devona: bass guitar, saxophone
Neville: theremin, mixing 
Could Vik play the drums*/


