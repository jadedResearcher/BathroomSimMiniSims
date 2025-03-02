/*
IMPORTANT NOTE, THESE ALL NEED TO BE FUNCTIONS NOT VARIABLES WITH FAT PIPE FUNCTIONS INSIDE
SO THE GLOBAL NAMESPACE PICKS THEM UP
AND THE WASTE COMMAND CAN SEE THE AND HELP OUT

ALSO MAKE SURE THE 'HAX' KEYWORD IS IN THEM, OR IT WON'T PICK THEM UP

this genuinely is for wastes
but more than that
its easy functions for ME to make this game with and keep track of what im even doing
all without having to crack open teh console directly or read my own code
shortcuts thru the maze

(text adventure sim has taken awhile, the bones of it were fast but the meat is a lot of character dialoge writing and imm not as comfortable with that, but im using this to practice)
plus work has been stressful
point is
because text adventure sim is taking so long im kinda losing track of how things work or what im making
people are always surprsied by how fast i code but i HAVE to or i start leaking information out of my brain
*/

function haxDebugAllBlorboSceneAudit() {
  const ret = {};
  console.log(`JR NOTE: Auditing ${Object.values(entityNameMap).length} blorbos. `)
  for (let blorbo of Object.values(entityNameMap)) {
    ret[blorbo.name] = getAllScenesForBlorbo(blorbo.name).length;
  }
  console.table(ret);
  return `JR NOTE: Auditing ${Object.values(entityNameMap).length} blorbos. <br> <div class='hax-grid'>` + Object.keys(ret).map((i) => `<div class="${ret[i]===0?'empty':''}">${i},${ret[i]}</div>`).join("")+"</div>"
}

function haxGetScenesIncludingBlorbo(blorbo) {
  if (!blorbo) {
    return ("lulz you didn't give me a blorbo to check for scenes, Example: haxGetScenesForBlorbo('Neville'), it'll get you any scenes where Neville is involved (beware typoes lol) ")
  }
  const ret = getAllScenesForBlorbo(blorbo);
  return `Got ${ret.length} scenes: ` + ret.join(" ,")
}

const getAllScenesForBlorbo = (blorboName) => {
  console.log("JR NOTE: getAllScenesForBlorbo", blorboName)
  const ret = [];
  for (let s of all_scenes) {

    if (s.entityNames.includes(blorboName)) {
      ret.push(s)
    }
  }
  console.log("JR NOTE: getAllScenesForBlorbo going to return", ret)
  return ret;
}

function haxDebugGetSceneList() {
  return all_scenes.map((i) => i.title).join(",    ")
}

//getSceneWithTitle("credit to the Theorist of Labyrinths, or your discord name, or a secret third option?")
function haxDebugScene(sceneTitle) {
  if (!sceneTitle) {
    return `lulz you gotta give me a scene, Example: getSceneWithTitle("credit to the Theorist of Labyrinths, or your discord name, or a secret third option?") `
  }
  const scene = getSceneWithTitle(sceneTitle);
  //add all blorbos needed for this scene;
  if (!scene) {
    return "ERROR: SCENE NOT FOUND";
  }
  for (let e of scene.entityNames) {
    const blorbo = entityNameMap[e];
    if (blorbo) {
      player.addToInventory(blorbo);
    } else {
      console.log("JR NOTE: why can't I find: ", e)
    }
  }
  return "Blorbos added that should trigger scene " + sceneTitle;

}

//takes in a list of blorbos and adds them to inventory
//haxDebugScenes([K, GUNTAN, VIK, PARKER])
function haxDebugScenesForPlayers(blorbos) {
  if (!blorbos) {
    return "lulz, you gotta give me blorbos: haxDebugScenes([K, GUNTAN, VIK, PARKER])"
  }
  for (let blorbo of blorbos) {
    player.addToInventory(blorbo)
  }
  return "ADDED BLORBOS TO INVENTORY";
}