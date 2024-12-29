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
  entityNames= [];
  //{name, text} pairs
  lines = [];

  constructor(entityNames, lines){
    this.entityNames = entityNames;
    this.lines = lines;
    all_scenes.push(this);
  }

  /*
  render the scene line by line, with an animation prompt at the end to click for next line
  also find the entities (class name will be their name) in the document that map to whoever is currently speaking and give them a special class
  remove that class from everyone else
  */
  renderSelf = (parent) => {
    //convertStringToClassFriendlyName
  }


}

//if the inventory has Sheep and Blood and Fire
//then a scene with Sheep and Blood would return, as well as Blood and Fire
//but not a scene with Sheep and Blood and Fire and Ria
const getAllScenesWithEntities = (entities)=>{

}

const convertScriptToScene =(script)=>{
  //{name, text} pairs
  const lines =[];
  let names = [];
  for(let line of script.split("/n")){
    const parts = line.split(":");
    const name = parts[0];
    const text = parts.slice(1).join();//everything but the first bit becomes a string again
    names.push(name);
    lines.push(text);
  }
  names = uniq(names);
  new Scene(names, lines);

}

//https://stackoverflow.com/questions/7627000/javascript-convert-string-to-safe-class-name-for-css
const convertStringToClassFriendlyName = (string) => {
  return string.replace(/[^a-z0-9]/g, function (s) {
    var c = s.charCodeAt(0);
    if (c == 32) return '-';
    if (c >= 65 && c <= 90) return  s.toLowerCase();
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
}



/*
////////////////////////////SCRIPTS START HERE//////////////////////////////
*/

convertScriptToScene(`Sheep: baaaa
  Blood: [exists]
  Sheep: baaaaaaaaaaaa!!!
  Blood: [leaves sheep]
  Sheep: ...
  Sheep: ...
  Sheep: baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!`);


