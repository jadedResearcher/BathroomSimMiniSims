/*
IMPORTANT NOTE, THESE ALL NEED TO BE FUNCTIONS NOT VARIABLES WITH FAT PIPE FUNCTIONS INSIDE
SO THE GLOBAL NAMESPACE PICKS THEM UP
AND THE WASTE COMMAND CAN SEE THE AND HELP OUT

ALSO MAKE SURE THE 'HAX' KEYWORD IS IN THEM, OR IT WON'T PICK THEM UP
*/

function haxDebugBlorboSceneAudit(){
  const ret = {};
  console.log(`JR NOTE: Auditing ${Object.values(entityNameMap).length} blorbos. `)
  for(let blorbo of Object.values(entityNameMap)){
    ret[blorbo.name] ="TODO: ???"
  }
  console.table(ret);
  return `JR NOTE: Auditing ${Object.values(entityNameMap).length} blorbos. <br> ` + Object.keys(ret).map((i)=>`${i},${ret[i]}`).join("<br>")
}

function haxDebugGetSceneList(){
  return all_scenes.map((i)=>i.title).join(",    ")
}

//getSceneWithTitle("credit to the Theorist of Labyrinths, or your discord name, or a secret third option?")
function  haxDebugScene(sceneTitle){
  if(!sceneTitle){
    return `lulz you gotta give me a scene, Example: getSceneWithTitle("credit to the Theorist of Labyrinths, or your discord name, or a secret third option?") `
  }
  const scene =  getSceneWithTitle(sceneTitle);
  //add all blorbos needed for this scene;
  if(!scene){
    return "ERROR: SCENE NOT FOUND";
  }
  for(let e of scene.entityNames){
    const blorbo = entityNameMap[e];
    if(blorbo){
      player.addToInventory(blorbo);
    }else{
      console.log("JR NOTE: why can't I find: ", e)
    }
  }
  return "Blorbos added that should trigger scene " + sceneTitle;

}

//takes in a list of blorbos and adds them to inventory
//haxDebugScenes([K, GUNTAN, VIK, PARKER])
function haxDebugScenesForPlayers(blorbos){
  if(!blorbos){
    return "lulz, you gotta give me blorbos: haxDebugScenes([K, GUNTAN, VIK, PARKER])"
  }
  for(let blorbo of blorbos){
    player.addToInventory(blorbo)
  }
  return "ADDED BLORBOS TO INVENTORY";
}