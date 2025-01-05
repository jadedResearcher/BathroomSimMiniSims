const COMMAND_LOOK = "LOOK";
const COMMAND_LISTEN = "LISTEN";
const COMMAND_SMELL = "SMELL";
const COMMAND_TASTE = "TASTE";
const COMMAND_TOUCH = "TOUCH";
const COMMAND_GO = "GO";
const COMMAND_TALK = "TALK";
const COMMAND_TAKE = "TAKE";
const COMMAND_GIVE = "GIVE";
const COMMAND_USE = "USE";
const COMMAND_THINK = "THINK";
const COMMAND_HELP = "HELP";

//not guaranteed to have every theme, but will be keyed by theme and have an array of entities to spawn
//look for [SETUP SPECIAL ENTITIES]
const specialThemeEntities = {};

//what are euphamisms for each action (NOT what functions do they call)
const defaultActionMap = {}
defaultActionMap[COMMAND_LOOK] = ["LOOK", "READ", "SEE", "OBSERVE", "GLANCE", "GAZE", "GAPE", "STARE", "WATCH", "INSPECT", "EXAMINE", "STUDY", "SCAN", "VIEW", "JUDGE", "EYE", "OGLE"];
defaultActionMap[COMMAND_LISTEN] = ["LISTEN", "HEAR"];
defaultActionMap[COMMAND_TOUCH] = ["FEEL", "CARESS", "TOUCH", "FONDLE", "PET"];

defaultActionMap[COMMAND_SMELL] = ["SNIFF", "SMELL", "SNORT", "INHALE", "WHIFF"];
defaultActionMap[COMMAND_TASTE] = ["TASTE", "LICK", "EAT", 'FLAVOR', "MUNCH", "BITE", "TONGUE", "SLURP", "NOM"];
defaultActionMap[COMMAND_GO] = ["GO", "DOOR", "EXIT", "LEAVE", "NORTH", "SOUTH", "EAST"];
defaultActionMap[COMMAND_THINK] = ["THINK", "PONDER", "CONTEMPLATE", "PHILOSOPHIZE", "BULLSHIT"]
defaultActionMap[COMMAND_HELP] = ["HELP", "LOST", "OPERATOR", "ASSIST", "AID", "SUPPORT", "TRUTH", "LS", "DIR", "MAN"];
defaultActionMap[COMMAND_TALK] = ["TALK", "TELL", "ASK", "QUESTION", "INTERROGATE", "INTERVIEW"];
defaultActionMap[COMMAND_TAKE] = ["TAKE", "PILFER", "LOOT", "GET", "STEAL", "POCKET", "OBTAIN", "GRAB", "CLUTCH", "WITHDRAW", "EXTRACT", "REMOVE", "PURLOIN", "YOINK", "PICK"];
defaultActionMap[COMMAND_GIVE] = ["GIVE", "GIFT", "OFFER", "BESTOW"];
defaultActionMap[COMMAND_USE] = ["USE", "DEPLOY", "UTILIZE", "OPERATE", "INVOKE"];

const directionIndices = ["NORTH", "SOUTH", "EAST", "???"]
getDirectionLabel = (index) => {
  if (index < directionIndices.length) {
    return directionIndices[index]
  }
  return "???";
}

const getRandomThemeConcept = (rand, theme_keys, concept) => {
  console.log("JR NOTE: getRandomThemeConcept", rand, concept, theme_keys, all_themes)
  const theme = all_themes[rand.pickFrom(theme_keys)];
  return theme.pickPossibilityFor(concept, rand);
}

/*
will mutate one or more of the theme keys
(mutation can be removing it unless its the last one)
*/
const makeChildEntity = (rand, theme_keys, nameOverride) => {
  console.log("JR NOTE:makeChildEntity ", theme_keys)
  let my_keys = [];
  for (let key of theme_keys) {
    //add a new theme from scratch
    if (rand.nextDouble() > 0.95) {
      console.log("JR NOTE: adding mutation", all_themes)
      my_keys.push(rand.pickFrom(Object.keys(all_themes)));
    }
    //small chance to not add this theme at all
    if (rand.nextDouble() > 0.15) {
      console.log("JR NOTE: adding", key)
      my_keys.push(key)
    }
  }

  if (my_keys.length == 0) {
    my_keys = [rand.pickFrom(theme_keys)];
  } else if (my_keys.length > 8) {
    my_keys = my_keys.slice(2, 5); //grab a middle-ish chunk
  }
  my_keys = uniq(my_keys);
  const name = `${titleCase(getRandomThemeConcept(rand, my_keys, ADJ))} ${titleCase(getRandomThemeConcept(rand, my_keys, LOCATION))}`;
  const ret = new Entity(nameOverride ? nameOverride : name, "It's a room...", my_keys);
  ret.contents = spawnItemsForThemes(ret.rand, ret.theme_keys);
  return ret;
}

/*
one thing i find interesting is that if you have decided to pick a blorbo up you can no longer wander arund inside of them
so you have to choose, for each blorbo in a run through, whether you want to explore them via sam or via twig
*/

/*
and its interesting that....
the Freedom/Breath aligned copy gives you this meaningless, dreamlike expereience free of everything but associations, bonds.  you might find neville inside devona because they are connected

blood
while the Binding/Blood aligned copy doubles down and gives you this incredibly rigid, pre-scripting sequence of the bonds a character has
no matter how far twig runs, they still are defined by their bonds, even if its no longer strangling them
*/

//specialThemeEntities technically not all are blorbos
const spawnSpecialEntities = (rand, theme_keys) => {
  const odds = 1.5; //not guaranteed but it shouldn't be terribly hard to find blorbos etc
  const ret = [];
  for (let i = 0; i < 3; i++) {
    const roll = rand.nextDouble();
    if (roll < odds) {
      const theme = rand.pickFrom(theme_keys);
      if (specialThemeEntities[theme]) {
        const blorbo = rand.pickFrom(specialThemeEntities[theme]);//for example this could pick either devona, neville or eye killer for HUNTING
        if (blorbo && !player.inventory.map((i) => i.name).includes(blorbo.name)) {
          ret.push(blorbo);
        }
      }
    }
  }
  if (ret.includes(DEVIL_OF_SPIRALS)) {
    ret.push(DETECTIVE)
  }
  return uniq(ret);
}

//books have a random Fact inside them, mostly so that you can, in theory, read about Sam and Twig's backstories 
//the Harvest's influence is spreading, even as she sleeps
const spawnBooksAsAppropriate = (rand, theme_keys) => {
  let odds = 0.01;
  const singleOdd = 0.15;

  //for each theme you have that is compatible with knowledge, increase odds of book

  //don't you want to know all the blorbo secrets, the sweet ARG lore you crave? 
  if (theme_keys.includes(KNOWING)) {
    odds += singleOdd;
  }

  //so much of what is in here, the blorbos wouldn't want you to know
  if (theme_keys.includes(SPYING)) {
    odds += singleOdd;
  }

  //they are books after all
  if (theme_keys.includes(LANGUAGE)) {
    odds += singleOdd;
  }
  //you are going to be inspired to hunt these down, find the nuggets
  if (theme_keys.includes(HUNTING)) {
    odds += singleOdd;
  }

  //lets be honest, questing is just hunting but more civilized
  if (theme_keys.includes(QUESTING)) {
    odds += singleOdd;
  }


  const ret = [];
  //three chances to spawn a book
  for (let i = 0; i < 3; i++) {
    const roll = rand.nextDouble();
    if (roll < odds) {
      const theme = rand.pickFrom(theme_keys);
      let fact = rand.pickFrom(getAllFactsWithTheme(theme)); //at least somewhat themed book
      if (!fact || rand.nextDouble() > 0.75) {
        fact = rand.pickFrom(all_facts);//just grab something
      }
      //no doubles
      if (!ret.map((r) => r.name).includes(fact.title)) {
        ret.push({ name: fact.title, src: `Artifacts/Zampanio_Artifact_08_Tome.png`, themes: fact.theme_key_array, desc: "<br><hr><br><p style='padding:31px;'>" + fact.lore_snippet + "</p><br><hr><br>" });
      }
    }
  }
  //only one chance for a secret
  if (rand.nextDouble() < odds) {
    const secret = rand.pickFrom(all_secrets);
    const secretEle = document.createElement("div");//unattached
    renderSecret(secret, secretEle);
    ret.push({ name: "Secret Tome", src: `Artifacts/secret_book.gif`, themes: [OBFUSCATION], desc: "<br><hr><br>" + secretEle.innerHTML + "<br><hr><br>" });
  }
  return uniq(ret);
}

const spawnItemsForThemes = (rand, theme_keys) => {
  const itemsButNotEntities = [];
  const amount = rand.getRandomNumberBetween(0, 5);
  const artifacts = [
    { name: "Unos Artifact Book", layer: 1, src: `Artifacts/Zampanio_Artifact_01_Book.png`, themes: [all_themes[SOUL], all_themes[OBFUSCATION]], desc: "A tattered cardboard book filled with signatures with an ornate serif '1' embossed onto it. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    , { name: "Duo Mask", layer: 1, src: `Artifacts/Zampanio_Artifact_02_Mask.png`, themes: [all_themes[CLOWNS], all_themes[OBFUSCATION]], desc: "A faceless theater mask with a 2 on the inside of the forehead. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    , { name: "Tres Bottle", layer: 1, src: `Artifacts/Zampanio_Artifact_03_Bottle.png`, themes: [all_themes[OBFUSCATION]], desc: "A simple glass milk bottle with a 3 emblazoned on it. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    , { name: "Quatro Blade", layer: 1, src: `Artifacts/Zampanio_Artifact_04_Razor.png`, themes: [all_themes[KILLING], all_themes[OBFUSCATION]], desc: "A dull straight razor stained with blood, a number 4 is etched onto the side of the blade. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    , { name: "Quinque Cloak", layer: 1, src: `Artifacts/Zampanio_Artifact_05_Cloak.png`, themes: [all_themes[OBFUSCATION]], desc: " A simple matte blue cloak with a 5 embroidered on the back in shiny red thread. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    , { name: "Sextant", layer: 1, src: `Artifacts/Zampanio_Artifact_06_Sextant.png`, themes: [all_themes[OBFUSCATION]], desc: "A highly polished brass sextant. There is a 6 carved onto the main knob. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    , { name: "Septum Coin", layer: 1, src: `Artifacts/Zampanio_Artifact_07_Coin_Bronze.png`, themes: [all_themes[OBFUSCATION]], desc: "An old bronze coin. There is a theater mask on one side, and a 7 on the other. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    , { name: "Octome", layer: 1, src: `Artifacts/Zampanio_Artifact_08_Tome.png`, themes: [all_themes[KNOWING], all_themes[OBFUSCATION]], desc: "A crumbling leather book with seemingly latin script, with messily torn pages.  There is an 8 embossed onto the back. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
    , { name: "Novum Mirror", layer: 1, src: `Artifacts/Zampanio_Artifact_09_Mirror.png`, themes: [all_themes[OBFUSCATION]], desc: "An ornate but tarnished silver mirror, with a 9 carved onto the back. It is said to reflect everything but faces. It is said that if all 9 Artifacts are united, the Apocalypse will begin." }
  ];
  //apocalypse chick is having a great time
  for (let a of artifacts) {
    a.desc = "lol did you reaaaaaaaaaaaaaaaally think these still have power here? The apocalypse is upon us alreaaaaaaady !!!!!!!!!!!!!!";
  }

  for (let i = 0; i < amount; i++) {
    //true random chance of useless artifacts
    if (Math.random() > 0.9) {
      itemsButNotEntities.push(pickFrom(artifacts));
    }
    const chosen_theme = all_themes[rand.pickFrom(theme_keys)];
    let item = chosen_theme.pickPossibilityFor(FLOORFOREGROUND, rand);
    if (item && item.name) { //could be a glitched item like for Burger
      item.themes = [chosen_theme];
      itemsButNotEntities.push(item);
    }
  }

  let ret = [];
  for (let item of itemsButNotEntities) {
    console.log("JR NOTE: making item", { item, itemsButNotEntities })
    const e = new Entity(item.name, item.desc, item.themes.map((t) => t.key), item.src);
    ret.push(e)
  }
  const books = spawnBooksAsAppropriate(rand, theme_keys)

  for (let item of books) {
    const e = new Book(item.name, item.desc, item.themes, item.src);
    ret.push(e)
  }

  const blorbos = spawnSpecialEntities(rand, theme_keys);//already entity form
  ret = ret.concat(blorbos);
  return ret;
}

/*
Arm2 is a spiralling fractal of madness because of Apocalypse Chick. 

You ever hear of this: https://www.raphkoster.com/2014/08/16/random-uo-anecdote-2/

TLDR the player was technically a container which held equipped items.
"When you rode a horse, we simply put the horse inside the player, and spawned a pair of pants that looked like your horse, which you then equipped and wore."

except there could be glitches where the horse would start moving around inside you, eating your stuff.

Apocalypse Chick LOVES this shit so obviously she's remaking reality to do it.

Truth and Alt don't really care so long as they get to be immortal, infinite mazes together. 

And I mean, from THEIR point of view of COURSE a person is the same thing as a box is the same thing as a room.
*/



class Entity {
  alive = false;
  book = false;
  sprite = "sheep.gif"; //gosh why does THIS exist?
  description = "It's so perfectly generic."
  name = "Perfectly Generic Entity";
  durability = 113;//(nothing can die in arm2 but if you take enough damage you're not exactly coherent anymore)
  theme_keys = [];
  rand;
  //NOTE: VICS CONTENTS SHOULD BE FUCKED UP
  contents = [];//list of other entities. If you're, say, Ria, its whats in your pockets. If you're, say, Truth, it's what's wandering around your horridors.
  actionMap = { ...defaultActionMap } //honestly there may never be a non default action map 
  functionMap = {}//what do we DO for each possible action?
  neighbors = []; //similar to contents, but these are the things you can move into from this entity



  constructor(name, desc, theme_keys, sprite = "sheep.gif") {
    console.log("JR NOTE: ", { name, desc, theme_keys })
    this.name = name.toUpperCase();
    this.sprite = sprite;
    this.rand = new SeededRandom(stringtoseed(name));
    this.description = desc;
    this.theme_keys = theme_keys;
    this.syncDefaultFunctions();
  }
  //this will be the same every time i call this function (unless i refresh the page)
  //as opposed to the non cached rand that changes over time
  //useful for, say, making sure the room always smells the same
  getCachedRand = () => {
    return new SeededRandom(stringtoseed(this.name)); //the initial rand is keyed off your name
  }

  //if an instance has a new look function, for example, you need to recall this or it'll have a ghost reference (it'll keep being the original version)
  syncDefaultFunctions = () => {
    //doing it this way means if i want an especially customized entity i can do so
    //but otherwise all entities will call their functions for the base stuff (which i can also customize)
    this.functionMap[COMMAND_LOOK] = this.look;
    this.functionMap[COMMAND_LISTEN] = this.listen;
    this.functionMap[COMMAND_SMELL] = this.smell;
    this.functionMap[COMMAND_TASTE] = this.taste;
    this.functionMap[COMMAND_GO] = this.go;
    this.functionMap[COMMAND_THINK] = this.think;
    this.functionMap[COMMAND_HELP] = this.help;
    this.functionMap[COMMAND_TALK] = this.talk;
    this.functionMap[COMMAND_TAKE] = this.take;
    this.functionMap[COMMAND_GIVE] = this.give;
    this.functionMap[COMMAND_USE] = this.use;
    this.functionMap[COMMAND_TOUCH] = this.touch;

  }
  /*
  i want a function that handles parsing a command
  
  for a given entity, if i gets something like "Give Ball To Ria"
  
  it takes the first word as the command, and then scans the rest of the words for a name that matches its contents. 
  
  if it finds one, it hands the command to the thing inside it.
  
  So Truth would pass "Give Ball To Ria" to ria
  
  ria would check her inventory for a "ball" or  a "ria" or a "to" and , not finding it, will put the ball in her inventory (give will ALWAYS assume its from the players inventory, unlike the more general ai i did for EastEast where anyone can be the owner)
  problem:
  
  if ria DOES have a ball in her inventory, or say, apocalypse chick has herself in her inventory, it will start recursing
  will need to have some kind of counter so i can't go deeper than say, three levels at a time, have a fun apocalypse chick warning if you do
  so lets stub this function out
  */
  //parentEntity will be usually be null, only set if we are contents or neighbors of wherever player is (or deeper)
  handleCommand = (command, parentEntity, count = 0, justifiedRecursion = true) => {
    if (count > 13) {
      return "Haha, wow! How did you manage to recurse thaaaaaaaaaaaaat many times. Surely even YOU can't justify that one, lol. imma just...stop that. Only I get to cause fractal game crashing bugs like that, lulz. It's been real!"
    }
    //first word is what command it is
    //but do not rush and try to do something with it, it might be for one of your contents
    //this also means your contents may respond to a command that you don't and thats fine
    const contentRet = this.checkContentsForCommand(command, count, justifiedRecursion);
    if (contentRet) {
      return contentRet;
    }

    const neighborRet = this.checkNeighborForCommand(command, count, justifiedRecursion);
    if (neighborRet) {
      return neighborRet;
    }

    //if we haven't returned yet, its for me to handle (not something INSIDE me or NEAR me)
    const first_word = command.split(" ")[0].toUpperCase();
    for (const [key, value] of Object.entries(this.actionMap)) {
      if (value.includes(first_word)) {
        //we found it
        return `>${command}<br><br>` + this.functionMap[key](parentEntity);
      }
    }
    try{
      return ">"+ command +"<br><br><span style='color:red; font-family: Courier New;'>Running...</span><br><br>" + eval(command);

    }catch(e){
      return `You don't know how to ${command}!`;
    }


  }
  //if these recurse, THEY are the parent, not their parent
  checkContentsForCommand = (command, count, justifiedRecursion) => {
    if (!justifiedRecursion) { //its not justified, don't check
      return;
    }

    for (let c of this.contents) {
      if (command.toUpperCase().includes(c.name.toUpperCase())) {//the name of the entity in its entirity
        return c.handleCommand(command, this, count + 1, justifiedRecursion);
      }
    }
  }
  //if these recurse, THEY are the parent, not their parent
  //do NOT recurse on neighbors because they will always have loops
  checkNeighborForCommand = (command, count, justifiedRecursion) => {
    if (!justifiedRecursion) { //its not justified, don't check
      return;
    }
    let index = -1;
    for (let i = 0; i < directionIndices.length; i++) {
      if (command.toUpperCase().includes(directionIndices[i])) {
        index = i;
        break;
      }
    }
    //now that we have the direction index, use it to call go on that neighbor
    if (index > -1 && this.neighbors[index]) {
      console.log("JR NOTE: think i found a direction word")
      if (index >= 3) {
        handleAttic();
        return `>${command}<br><br>` + "Oh??? What's this??? You want to wander into my attic??? :) :) ;) "
      }
      //neighbors we NEVER recurse on (because your neighbors have you as neighbors)
      return this.neighbors[index].handleCommand(command, this, count + 1, false);
    }

    //okay well did we try a neighbor by name?
    index = 0;
    for (let c of this.neighbors) {
      index++;
      if (command.toUpperCase().includes(c.name.toUpperCase())) {//the name of the entity in its entirity
        if (index >= 3) {
          handleAttic();
          return `>${command}<br><br>` + "Oh??? What's this??? You want to wander into my attic??? :) :) ;) "
        }
        //neighbors we NEVER recurse on (because your neighbors have you as neighbors)
        return c.handleCommand(command, this, count + 1, false);
      }
    }
  }


  //some objects might have their own custom functions for these, like specific triggers/effects
  //like, ria being on fire (having fire in her inventory) isn't going to behave the same as anyone else 


  /*
  i think its funny
  there ARE no procedural "sight" words
  mostly because if a room contains things then those things can tell you their names
  but as a Hund, twig WOULD be mostly not sight based
  but also twig/sam have themes of being blindfolded
  twig shook free of the cobwebs sure, but the ironiy that they replaced it with
   basically losing a lot of their eyesight to be a weird dog person
   is choice
  */
  look = (parentEntity) => {
    const rand = this.getCachedRand();
    let directions;
    let pockets;

    pockets = this.contents.length > 0 ? `<br><br>You see ${humanJoining(this.contents.map((c => c.book ? `<u>${c.name}</u>` : c.name)))} inside it! ` : "<br><br>You see nothing inside it :(";
    directions = this.neighbors.length > 0 ? `<br><br>Obvious exits are ${humanJoining(this.neighbors.map((n, i) => `${n.name} (${getDirectionLabel(i)})`))}!` : "<br><br>There's no where to go from it :(";
    return `You look carefully at the ${this.book ? `<u>${this.name}</u>` : this.name}. ${this.book ? "You only have enough attention span to read a little bit:" : "It's hard to see!"} ${this.description}. ${pockets} ${directions}`;
  }

  listen = (parentEntity, recursionJustified = true) => {
    const rand = this.getCachedRand();
    let sounds = this.theme_keys.map((t) => all_themes[t].pickPossibilityFor(SOUND, rand));
    let directions;

    //if we're close by its clear, and we can smell a bit of our neighbors
    if (recursionJustified) {
      directions = this.neighbors.map((n, i) => `To the ${getDirectionLabel(i)} you faintly hear ${n.listen(parentEntity, false)}.`)
      return `You prick your ears towards the ${this.name}, taking in the sounds of ${humanJoining(uniq(sounds))}.  ${directions}`

    } else { //if we're not we can only smell a bit
      return sounds[0]; //just return the smell word.
    }
  }

  /*
  so in theory when we smell where we are standing or focusing on we get as much info as possible, but from things further away we only learn a bit
  i don't think i want to smell things in someones pockets???
  ............................................
  but wouldn't that be funny
  actually
  if we were playing as Twig all along
  just
  weirdly good sense of smell
  its decided
  see this is why i don't flesh things all the way out before starting, 
  sometimes you want room to take advangate of lucky lil coincidences
  :chrm_horseshoes:
  */
  smell = (parentEntity, recursionJustified = true) => {
    const rand = this.getCachedRand();
    let scents = this.theme_keys.map((t) => all_themes[t].pickPossibilityFor(SMELL, rand));
    let directions;
    let pockets;

    //if we're close by its clear, and we can smell a bit of our neighbors
    if (recursionJustified) {
      pockets = this.contents.map((c) => c.smell(parentEntity, false));
      directions = this.neighbors.map((n, i) => `To the ${getDirectionLabel(i)} you faintly smell ${n.smell(parentEntity, false)}.`)
      return `You breathe deeply at the ${this.name}, taking in the scents of ${humanJoining(uniq(scents))}. ${pockets && pockets.length > 0 ? `Is that a faint whiff of ${humanJoining(uniq(pockets))} you detect?` : ""} ${directions}`

    } else { //if we're not we can only smell a bit
      scents = [scents[0]];
      return scents[0]; //just return the smell word.
    }
  }

  //taste isn't recursive. if you lick a person you can't taste whats in their pockets
  taste = (parentEntity) => {
    const rand = this.getCachedRand();
    let tastes = this.theme_keys.map((t) => all_themes[t].pickPossibilityFor(TASTE, rand));
    return `You happily lick at the ${this.name}, taking in the flavors of ${humanJoining(uniq(tastes))}. ${this.alive ? `The ${this.name} seems really upset about this.` : "No one can stop you."}`
  }

  touch = (parentEntity) => {
    const rand = this.getCachedRand();
    let touch = this.theme_keys.map((t) => all_themes[t].pickPossibilityFor(FEELING, rand));
    return `You happily paw at the ${this.name}, taking in the textures of ${humanJoining(uniq(touch))}. ${this.alive ? `The ${this.name} seems really upset about this.` : "No one can stop you."}`
  }

  /*
  yeah okay if i call "go" on an object we're going to move to it
  this MEANS we can "go ria" by default but honestly, im fine with this
  the recursion is justified
  */
  go = (parentEntity) => {
    if (this === current_room) {
      const directions = this.neighbors.length > 0 ? `<br><br>Obvious exits are ${humanJoining(this.neighbors.map((n, i) => `${n.name} (${getDirectionLabel(i)})`))}!` : "<br><br>There's no where to go from it :(";
      return `You don't know how to do that! (You're PRETTY sure you're already at ${this.name}!) ${directions}`
    }

    /*
    before you go there make sure you spawn its neighbors via makeChildEntity (if it does not have any)
      (this way you never have to worry about infinitely recursing)
      //ONE of its neighbors (it does not matter which one) should be THIS
      //so when its done making neighbors pick one at random to replace with yourself
      //(if it had only one neighbor then its a dead end now, rip)
      //just like in east east each time you go to a location that already has neighbors theres a small chance of it spawning new ones, so its never fininite
    */
    if (this.neighbors.length === 0) {
      //guaranteed neighbor to the north (the current room you got here from)
      //yes this means that "NORTH" is now defined as the illusion you carefully don't poke at
      //didn't you think you got here from the EAST? Dont' worry about that. that's not real :) :) :)
      this.neighbors.push(current_room);

      //possible branch point is fairly common
      if (this.rand.nextDouble() > 0.05) {
        this.neighbors.push(makeChildEntity(rand, this.theme_keys));
      }

      //less likely to have a third path
      if (this.rand.nextDouble() > 0.5) {
        this.neighbors.push(makeChildEntity(rand, this.theme_keys));
      }
    } else if (this.neighbors.length < 4) {
      //we aren't maxed out yet? lets add some gaslight engine goodness
      //are you SURE there was always a door here?
      //and just for extra funseies lets have a small chance of there being an impossible direction door
      //by which i mean
      //'west'
      //any door there should lead to attic JR
      if (this.rand.nextDouble() > 0.5) {
        this.neighbors.push(makeChildEntity(rand, this.theme_keys));
      }
    }


    current_room = this;
    //if we have already picked this up AND its special(specialThemeEntities) (not generic), ignore it
    for (let item of player.inventory) {
      if (item.special && this.contents.map((i) => i).includes(item)) {
        removeItemOnce(this.contents, item)
      }
    }
    return `<hr>You GO to the ${this.name}.<hr>` + this.look() + "<br><br>" + this.smell(parentEntity)
  }

  talk = (parentEntity) => {
    const rand = this.getCachedRand();
    //classic breath player
    return `The ${this.name} doesn't seem to want to talk to you :(<br><br>That's okay though!<br><br>You don't need anyone.`;
  }

  removeFromContents = (item) => {
    //anywhere the detective is is a trap for anyone besides breath players
    if(this.contents.includes(DETECTIVE) && !(item.theme_keys.includes(FREEDOM))){ 
      return false;
    }
    removeItemOnce(this.contents, item);
    return true;
  }


  take = (parentEntity) => {
    if (player.debugCodes.includes(UNLOCK_INVENTORY2)) {
      if (parentEntity) {
        const removed = parentEntity.removeFromContents(this);
        if (removed) {
          player.addToInventory(this);
          return `You TAKE the ${this.name}!`
        }else{
          return `You try to take the ${this.name}, but it remains. What is going on? Was it that Detective?`
        }
      } else {
        if (this.contents.length > 0) {
          for (let c of [...this.contents]) {
            const removed = this.removeFromContents(c);
            if (removed) {
              player.addToInventory(c);
            }
          }
          if(this.contents.length === 0){
            return "You take absolutely everything in this room, including some things you hadn't realized weren't nailed down.";
          }else{
            return `You try to take absolutely everything from this room, but ${humanJoining(this.contents.map((i)=>i.name))} remains. What is going on? Was it that Detective?`
          }
        } else {
          return "There's nothing left to TAKE!";
        }
      }
    } else if (player.debugCodes.includes(UNLOCK_INVENTORY1)) {
      handleError(`[[ ERROR CODE: ${UNLOCK_INVENTORY2} ]] AT ${new Error().stack}`);
      throw `[[ ERROR CODE: ${UNLOCK_INVENTORY2} ]] AT ${new Error().stack}`
    } else {
      handleError(`[[ ERROR CODE: ${UNLOCK_INVENTORY1} ]] AT ${new Error().stack}`);
      throw `[[ ERROR CODE: ${UNLOCK_INVENTORY1} ]] AT ${new Error().stack}`

    }

  }

  give = (parentEntity) => {
    if (player.inventory && player.inventory.length > 0) {
      //if you already have gotten jr to try to fix it once, it starts breaking down into obvious fakeness :)
      const code = player.debugCodes.includes(UNLOCK_GIVE) ? makeid(12) : UNLOCK_GIVE;
      fakeDevLogs[code] = "pending"; //so the bug report system validates it
      handleError(`[[ ERROR CODE: ${code} ]] AT ${new Error().stack}`);
      throw `[[ ERROR CODE: ${code} ]] AT ${new Error().stack}`
    }
    return `You can't GIVE anything! You have nothing in your inventory!`
  }


  use = (parentEntity) => {
    if (player.inventory && player.inventory.length > 0) {
      //if you already have gotten jr to try to fix it once, it starts breaking down into obvious fakeness :)
      const code = player.debugCodes.includes(UNLOCK_USE) ? makeid(12) : UNLOCK_USE;
      fakeDevLogs[code] = "pending"; //so the bug report system validates it
      handleError(`[[ ERROR CODE: ${code} ]] AT ${new Error().stack}`);
      throw `[[ ERROR CODE: ${code} ]] AT ${new Error().stack}`
    }
    return `You can't USE anything! You have nothing in your inventory!`
  }

  think = (parentEntity) => {
    //this one isn't cached, your thoughts can change
    const theme = all_themes[this.rand.pickFrom(this.theme_keys)]
    return `You think about the ${this.name}... Haha, wow, that's hard actually!  In the distance, you can hear a mournful voice droning on and on about something? "${theme.pickPossibilityFor(PHILOSOPHY, this.rand)}"<br><br>Boring!`
  }

  //JR NOTE: this should be tutorial shit or maybe hints if i can manage it
  help = (parentEntity) => {
    return `List of Commands For ${this.name}: ${Object.keys(this.actionMap).join(", ")}`;
  }
}


class Book extends Entity {
  alive = false;
  book = true;
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc, theme_keys, sprite);
    this.theme_keys.push(LANGUAGE);
    this.theme_keys.push(KNOWING);
  }
}



class FleshCreature extends Entity {
  alive = true;
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc + "<br><br>It's made of meat :) ", theme_keys, sprite);
    this.contents.push(new Entity("Blood", "It's red and vibrant. Salty and Metallic. Blood.", [FLESH], "bloodpuddle.png")); //you can take the blood out, twig :) :) :)
    this.contents.push(new Entity("Meat", "It's pink and moist. Your mouth waters thinking about it.", [FLESH], "meatslabs.png")); //you can take the meat out, twig :) :) :)
    this.contents.push(new Entity("Bone", "It's white and hard. Your mouth waters thinking about it.", [FLESH], "skeleton1.png")); //you can take the bones out, twig :) :) :)

    this.theme_keys.push(FLESH);
  }
}

class FireBeast extends FleshCreature {
  alive = true;
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc + "<br><br>It's made of fire :() ", theme_keys, sprite);
    //singing , singeing whats the difference
    this.contents.push(new Entity("Singing Flame", "It's hot.", [FIRE, MUSIC], "redacted.gif"));
    this.theme_keys.push(FIRE);

  }
}

class ShadowBeast extends Entity {
  alive = true;
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc + "<br><br>It's made of darkness... ", theme_keys, sprite);
    //its not made of anything at all, no meat or bones or organs
  }
}


class GooCreature extends Entity {
  alive = true;
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc + "<br><br>It's made of slime... ", theme_keys, sprite);
    this.contents.push(new Entity("Goo Drone", "It is one of River's slime bodies, melted down.", [CRAFTING], "Science_Object.gif"));

  }
}


class MechanicalBeast extends Entity {
  alive = true;
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc + "<br><br>It's made of metal... ", theme_keys, sprite);
    this.theme_keys.push(ZAP);
    this.theme_keys.push(TECHNOLOGY);
  }
}

class RotBeast extends FleshCreature {
  alive = false; //:) :) :)
  constructor() {
    super("[REDACTED]", "[REDACTED]", [CENSORSHIP], "redacted.gif");
    //it is not just rotting meat, but you can't quite tell what it is
    this.contents.push(new Entity("[PULSING REDACTED]", "It's disgusting.", [FLESH, DECAY, TWISTING], "redacted.gif"));

  }
}


/*
yeah this is really starting to come together
the webbed heir of blood connects wanda and the intern tightly, forces their pasts to bind them while using doc slaughter as a puppet
meanwhile the page of bloody breath gives freedom to something they maybe should not have, something murderous
*/

//[SETUP SPECIAL ENTITIES]


const CAMILLE = new FleshCreature("Camille",
  "She is the Lone Knight of Fated Death, the beloved Immune System of the Echidna.<br><br>If she finds Ria, they will merge together and become more powerful.<br><br>If she finds Peewee, she will kill him.<br><br>She tries to enjoy the Apocalypse, for Ria's sake, but it is hard not to lose her head.",
  [ENDINGS, KILLING, QUESTING, LONELY, DEATH],
  "Blorbos/camille.png");

const VIK = new RotBeast("[Redacted]");

const RIA = new FireBeast("Ria",
  "She is the Burning Witch of Threaded Rage.<br><br>If she finds Camille, they will merge together and become even more dedicated to burning it all down."
  , [FIRE, MUSIC, WEB, ADDICTION], "Blorbos/RiabyGuide.png")

const LEE = new FleshCreature("LeeHunter1",
  "They are the Pages of Time Coruption. LeeHunter play a trumpet that makes you older and a piano that makes you younger. They are always looking for new members of their Orchestra.",
  [TIME, MUSIC, WEB, LONELY, ANGER, DECAY],
  "Blorbos/Lee_byGuide.png")

const HUNTER = new FleshCreature("LeeHunter2",
  "They are the Pages of Time Corruption. LeeHunter play a trumpet that makes you older and a piano that makes you younger. They are always looking for new members of their Orchestra.",
  [TIME, MUSIC, WEB, LONELY, ANGER, DECAY],
  "Blorbos/Hunter_by_Guide.png")

const NEVILLE = new FleshCreature("Neville",
  "The Bard of Hunting Night. If anything happens to Devona, he cracks.",
  [HUNTING, OBFUSCATION, DARKNESS, SPYING, MATH],
  "Blorbos/neville_twin_by_guide.png")

const DEVONA = new FleshCreature("Devona",
  "The Bard of Hunting Day. If anything happens to Neville, she will stop at nothing for revenge.",
  [HUNTING, KNOWING, LIGHT, SPYING, OBFUSCATION],
  "Blorbos/devona_twin_by_guide.png")

const EYEKILLER = new ShadowBeast("Eye Killer",
  "She is the Killer of Stalking Time. Made of Shadows. You are either the hunter or the hunted.",
  [KILLING, ART, TIME, DARKNESS],
  "Blorbos/Eye_Killer_pixel_by_the_guide.png");

const YONGKI = new FleshCreature("Yongki",
  "He is the Scholar of Strange Minds. He can not be defeated. He only wants to learn about the world and the wonders within it.",
  [DOLLS, CLOWNS, CHOICES, DEFENSE, FREEDOM],
  "Blorbos/Yongki_byGuide.png"
);


//how obvious is it that the captain is fused with the All Around Helper (it sure is not obvious to him)
const CAPTAIN = new FleshCreature("Captain",
  "He is the Watcher of Strange Hearts. He can not be defeated. He only wants to figure out who he is and what he must do.",
  [TECHNOLOGY, SOUL, DEFENSE, SERVICE, GUIDING],
  "Blorbos/Captain_by_guide.png"
);
const helper = new MechanicalBeast("All-Around Helper",
  "Lurking inside Captain is the machine society has compressed him into. No feelings. No weakness. Only the desire to do as he's told. To HELP. He does not know this lurks within him. ",
  [TECHNOLOGY, SERVICE],
  "laundry.png"
);
CAPTAIN.contents.push(helper);


const RIVER = new GooCreature("River",
  "The Maid of Vast Space. River is new and old and big and small. Nothing can really matter to her in the face of how insignificant it all is.<br><br>Time moves too quickly for her unless she listens to LeeHunter's music. ",
  [SPACE, OCEAN, LONELY, MUSIC, ART, CRAFTING], //she is made of herself
  "Blorbos/River_byGuide.png"
);

const HOON = new FleshCreature("Hoon",
  "The Prince of Slaughtered Breath. She has long since surrendered her freedom to make Judgements to the Radio. If it says to Kill, she simply will.",
  [WEB, ROYALTY, KILLING, QUESTING, SERVICE],
  "Blorbos/Hoon_by_guide.png")

//k KNOWS something is wrong with the world the Muse of Void provides, but in no arm (besides 13) does he quite no why
//also if i call him "K" he thinks any word with a K in it (including LOOK) is about him
const K = new FleshCreature("Khana",
  "The Thief of Evershifting Light, he languishes out of the spotlight, all Eyes moving on as the Apocalypse consumes everything. Why aren't you looking at him? LOOK AT HIM.",
  [TECHNOLOGY, LIGHT, STEALING, SPYING, KNOWING, TWISTING],
  "Blorbos/Khana_pixel_by_the_guide.png"
);

const schadenfreud = new MechanicalBeast("Schadenfreud",
  "LookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMe",
  [TECHNOLOGY, SPYING],
  "eye6.png"
);
K.contents.push(schadenfreud);



const ALT = new FleshCreature("Alt",
  "The Stranger of Fleshy Dreams. She looks like whoever she is interacting with... Inside of Truth's horridors, that means she looks like a maze. <br><br>She refuses to leave Truth, because she craves the certainty of the immortality the Apocalypse providdes.<br><br>She does not want to ever be alone again because everyone else has died.",
  [FLESH, DOLLS, SERVICE, LONELY, APOCALYPSE],
  "Blorbos/ALT_by_guide_of_hunters.png")

//cfo is does not exist past arm1, much like wanda does not
//but unlike wanda its because she breaches into her trickster form, the apocalpyse chick

/*
cfo breaches fully any time the apocalypse hits
apocalypse chick is just.... trickster CFO
she spends her whole existence terrified of apocalypse, she was literally DESIGNED to bring it about in her home universe, she works tirelessly to prevent it
and her trickster arc is just "fixing" all her problems by deciding actually apocalypses are cooooool and why was she worrying about it so much? have fuuuuun, live a little
ic was describing her to me back in the day and i went "wow she is such an extiniction avatar it burns" when infodumping about magnus archives to him
*/

//apocalypse chick, more than anyone else, rules arm2. 
//a permeanently wasted, permanently trickster god of reality itself
//is not a recipe for a stable narrative
//she's BORED, the way you'd be bored if you already 100%ed skyrim and installed all the mods and cheats and bullshit you wanted but still for some reason couldn't stop playing
//she is like wanda that way, the way she gets a thrill when something out of her control finally shows up
//you.
const APOCALYSE_CHICK = new FleshCreature("Apocalypse Chick",
  "<div class='rainbow-text' style='padding:31px;font-size:28px;'><a target='_blank' href ='http://farragofiction.com/CodexOfRuin/viewer.html?name=The%20Flower&data=N4IgdghgtgpiBcIAqALGACAYgGwPYHcYAnEAGhABMYBnASwHNIAXW3MBEAGQFoBVbgAwCALGRBFa1ANYcAgpwCiABQASYpmljUOAcVkBZAJIA5HaXQBGCwGZzmTgHkASrPMXzAdVkBlJArc25k4Kvi4mSObW7ugKABpIJgDCCQ7G5gBM6XYuyfLe5gCsdiayxon+loHoAEKODgAiAdZi1EwQTNqIcX5OxvKk1raG+kqyCQrGEQVFwfKGvoaJpFa2ibxOhg68+cLCpI4Amv2ZpBMKTjoKCUsrpDrGDt7zpAAcBWIwAB4QAMZM2ABPAD6GiIMBgINoAAdOlw+IIRGJaGBWsi-hxErgoFA2OZMdjceh8TiwHisSSyQT2ORkXR6CgmBjyYTiSzmaSiezKSSxO02j8ULAwIzEKyOWLuWyqZLqeIYFCwdQ6GwmdLOWqJeqKVqVeRWhAAEa0bC0JjA7AwABuMGwHAsYjBFCBVAAZjAUXBEAIAHTvcj4FCmiGu93UT0gH1+kAG7C-KTOmBuj0cSNiKEQC0JpNhu3egRIqD0IHUIg-DgMphQ+AAemrLogRCIEHouBdtD+rDA3p+WOrAC1oOmwKwVLh-sipHW8IQiN6oWB6C0mLgiMCqG1jbDvGh0BRcOgDRgobGAcj0JaARRWPRoDRvepofbEDx+EJhAByajobxtI0ms2cgArsKxC7rgNDoGAY67jAPxghAYYHgC6DIkwxC-CwbDoPgpooOg1CAQaABWsEdPe5AsFC6RyC6aFEOgY5oPREBQVAGa0BBKAQBQB7wQKMA8S6K7oBA6D0E2YA8cubTYAxLroG8u4QAC1DmC+CLCLxMC-GgPE9sKEDIkKTDkSAlHNIgsi0aB6lvugNA-BAUI0OYdFQMi7SdnJInYLJjGgSxWLsRBh49lo6DAW6CG0DGMDelggFEBoxA4mCrloLQ9H6n+prIRa1rYF+VBwdpYY8RQTaoo5vkAveAC+QA'>Oooooooh?</a> Observers? <br><br>What an honor!<br><br>Don't often see you guys in the fuuuuuun part of reality!<br><br>Decided to stop being so boooooooring, have you?<br><br>Well sit back! Take a load off!<br><br>God mode is enabled and you can no clip to your hearts content!<br><br>Welcome to my creative mode server!<br><br>I beeeeet you're here because of all those changes, huh!<br><br>Peewee getting all trapped by that Detective and all sure was surprising!<br><br>Don't wooooorrrrry!<br><br>I can just imagine the face you're making, lulz<br><br>I'm not going to stoooooop you.<br><br>You wanna stop my Apocalypse, go right ahead!<br><br>All that'll do is finally get me into the new game +!</div>",
  [APOCALYPSE, TWISTING, TECHNOLOGY, MATH, ADDICTION, WASTE],
  "Blorbos/apocalypse_chick_by_guide.gif")


const WIBBY = new FleshCreature("Witherby",
  "He is the Watching Sylph of Lonely Faith. He is the only adherent to a religion that didn't even really exist in his home universe. He is surprisingly good at getting people to open up to him.",
  [ANGELS, KNOWING, LONELY, SERVICE, HEALING],
  "Blorbos/Thesolemn_by_guide.png");

const sin = new FleshCreature("One Sin, Hundreds of Good Deeds",
  "Witherby's skull is literally an Abnormality that feasts on the sins of others without judgement. It whispers to him to secrets of a long dead religion called 'Catholicsm'. ",
  [ANGELS, KNOWING, FLESH],
  "skull.png");
WIBBY.contents.push(sin);

/*
new FleshCreature("name",
   "desc",
   [EN],
   "Blorbos/camille.png")
*/

//http://farragofiction.com/MurderOnTheScorpiusExpressSim/
//sorry detectivee
//you're still needed
//you can't escape the narrative quite yet, no pink frog for you
//choke out every escape of the Witnesses' enemy
//counter his glitches with your own
const DETECTIVE = new FleshCreature("Detective",
  "The Guiding Detective of Trapped Breath. His character portrait was never created before his game of origin was abandoned.<br><br> He escaped one claustrophobic bathroom only to find an infinitely spiralling one.<br><br>As long as he is in a room, no one can leave it.<br><br>The Devil of Spirals is NOT happy about this.",
  [GUIDING, BURIED, HUNTING, DECAY, WASTE], //he is breath, but there is no freedom within him. 
  "Blorbos/404.png")

//the Echidna universe is a fractal spiral of infinite universes layered on top of each other
//the Universe was not meant to be this way
//a thousand thousand copies of arm1, each with their own arm2 and arm 3 and arms spiralling out into infinity, each other with their own setting and premise.  Arm 1 is Zampanio. Arm2 is the Apocalypse. Arm3 is the Mundane Universe.  Arm4 is the one filled with Gods.  There's a Daemon Arm. A Fae one. A space one. A homestuck one. A space one a pirate one an enemies to lovers one a smutty one a puppet one a warriors cat one it goes forever and ever not just one but infinity. There's a warriors cat au where parker dies a warriors cats au where parker lives a warriors cats one where parker never botheres showing up do you see how far the spiral goes?
//the Witness watches them all.
//the twin universe of the Echidna, the :hatched_chick: can not grow up so long as all its memory is being eaten by its sibling
//Peewee didn't want to do this but there was no other way. The Echidna *has* to die.
//..............or does it
//the Medium of Threads offers Doc Slaughter another option.
const DEVIL_OF_SPIRALS = new MechanicalBeast("Devil of Spirals",
  "He has been split in two. Half of him, Peewee, was left to rot in Arm1, trying to raise a family and move on. <br><Br>This is the other half. There is nothing left but the drive to, at any cost, end the Universe. To stop the endlessly recursive memory usage of the Echidna universe, before it crashes all of reality.<br><br>He relentlessly moves forward, waiting for the tiniest hint of vulnerability.<br><br>He can smell it. <br><br>If he can just break past the Apocalypse, to the tender healing flesh beyond the scabs and scars of Arm2... <br><Br>There will be nothing to stop him.<br><br>Arm3 has no immune system.<br><br>The Detective is the only thing <a target='_blank' href='http://eyedolgames.com/ZWorld/?friday=jrwantsin&rideType=Train&name=Coffee%20Shop%20AU:%20The%20Steam&image=/Trains/00090-20230604190728-img.png&themes=twisting,choices,Bakery&obsession=Coffee%20Shop%20AU'>preventing</a> him from slithering into the crack between AUs.<br><br> There is nothing the Devil of Spirals can do about this, not directly. But deep in the JavaScript console, he sees an in, if only an enterprising Observer would do him a favor for once instead of always jerking his shameglobes.<br><br> Type this, either as a command or in the Javascript console: <p style='font-family:Courier New; padding: 31px;'>DETECTIVE.theme_keys.push(FREEDOM)</p> <br><br>Then, you should be able to get the Detective away from the Devil of Spirals.<br><br>The Rot Takes All In The End. He will not be stopped. His inevitable Doom will finally end this Universe.<br><br>But YOU are needed to end it all.",
  [TWISTING, WEB, TECHNOLOGY, WASTE, ANGER],
  "Blorbos/peewee_front.gif")




//she is supposed to trim arm 2 to allow the actual alternate settings to thrive
//to provide a Final Mercy to all those trapped within
//the Medium of Threads instead asks her to do her job, provide Therapy to a special client
//if the Lord of Space is convinced to stop panickedly sucking in all of space and making it her own
//perhaps the echidna can coexist with the rest of reality
//but WILL she... or will the good doctor not be able to recover from the trauma of finding out she is not normal...
const DOC_SLAUGHTER = new FleshCreature("White Nightengale",
  "The Doctor of Hopeful <a target='_blank' href='http://farragofiction.com/CatalystsBathroomSim/NORTH/EAST/EAST/NORTH/bathroom.html?list=http%3A%2F%2Ffarragofiction.com%2FColonistsEyes5%2FLyreBird%2FSuperSecretInformationKeepFromDocSlaughter%2F%2C&filter=doc'>Eyes</a>. Doctor Fiona Slaughter.<br><br> She loves being Watched (Hi Observers!!). She is supposed to offer a Final Mercy to any afflicted with eternal life. <br><br>She is not.<br><br>Her eye brims with tears. <br><br>She will not meet your gaze.<br><Br>She did not know she was a monster. She did not know she is meant to be the Final Boss of Zampanio.<br><br>The Choir of her chosen Disciples behind her can not console her.  ",
  [ANGELS, KNOWING, SERVICE, HEALING, SPYING, APOCALYPSE],
  "Blorbos/white_nightengale_by_guide_chosen.gif"); //the only one shown as breeched because she doesn't have a CHOICE. this is her life if its arm2.  actually cfo should be too, brb
/*
doc slaughter's not even trying to be cruel (by dating captain and seeing the Neighbor on the side)
she just
it doesn't even occur to her theres rules she's breaking
and to be fair captain should have tried to lay out his expectations
but the problem here
the fundamental problem
that the Neighbor is absolutely feasting on
is that the both fiona and captain are strangers in a strange land, used to blindly conforming to things, but completely lost now that their "obvious normalness" is wrong for this world
the "common sense" each is following is both completely wild to the other and to the universe they find themselves in
the neighbor loves that they are the strange ones and not him
*/




/*importantly, these are NOT a 1:1 with the themes the characters have
the eye killer is NOT a monster of family, but you can't understand her without that lens, not really
*/
specialThemeEntities[ENDINGS] = [CAMILLE, APOCALYSE_CHICK, DOC_SLAUGHTER, DEVIL_OF_SPIRALS];
specialThemeEntities[DEATH] = [CAMILLE];
specialThemeEntities[KILLING] = [CAMILLE, EYEKILLER, YONGKI, HOON, K];
specialThemeEntities[QUESTING] = [CAMILLE, CAPTAIN, HOON, DETECTIVE, DEVIL_OF_SPIRALS];
specialThemeEntities[LONELY] = [CAMILLE, LEE, HUNTER, RIVER, ALT, APOCALYSE_CHICK, WIBBY];
specialThemeEntities[CENSORSHIP] = [VIK];
specialThemeEntities[OBFUSCATION] = [VIK, NEVILLE, DEVONA, ALT];
specialThemeEntities[DECAY] = [VIK, LEE, HUNTER, DETECTIVE, DEVIL_OF_SPIRALS];
specialThemeEntities[ART] = [EYEKILLER, RIVER];
specialThemeEntities[TECHNOLOGY] = [CAPTAIN, HOON, K, APOCALYSE_CHICK, DETECTIVE, DEVIL_OF_SPIRALS];
specialThemeEntities[TIME] = [LEE, HUNTER, EYEKILLER];
specialThemeEntities[SPACE] = [RIVER, DETECTIVE];//the detective is from a space setting
specialThemeEntities[OCEAN] = [RIVER];
specialThemeEntities[FIRE] = [RIA];
specialThemeEntities[FREEDOM] = [YONGKI, HOON, APOCALYSE_CHICK, WIBBY, DETECTIVE, DEVIL_OF_SPIRALS];
specialThemeEntities[STEALING] = [K, ALT];
specialThemeEntities[BURIED] = [RIVER, DOC_SLAUGHTER, DETECTIVE];
specialThemeEntities[FLESH] = [ALT];
specialThemeEntities[SCIENCE] = [DOC_SLAUGHTER, DETECTIVE];
specialThemeEntities[MATH] = [NEVILLE, APOCALYSE_CHICK, WIBBY];
specialThemeEntities[TWISTING] = [K, APOCALYSE_CHICK, DEVIL_OF_SPIRALS];
specialThemeEntities[APOCALYPSE] = [ALT, APOCALYSE_CHICK, DOC_SLAUGHTER, DEVIL_OF_SPIRALS];
specialThemeEntities[ANGELS] = [WIBBY, DOC_SLAUGHTER, DEVIL_OF_SPIRALS];
specialThemeEntities[SERVICE] = [EYEKILLER, CAPTAIN, HOON, ALT, WIBBY, DOC_SLAUGHTER, DETECTIVE, DEVIL_OF_SPIRALS];
specialThemeEntities[FAMILY] = [NEVILLE, DEVONA, EYEKILLER, CAPTAIN, YONGKI];
specialThemeEntities[MAGIC] = [HOON, APOCALYSE_CHICK, DEVIL_OF_SPIRALS];
specialThemeEntities[LIGHT] = [DEVONA, K, DOC_SLAUGHTER];
specialThemeEntities[HEALING] = [WIBBY, DOC_SLAUGHTER];
specialThemeEntities[PLANTS] = [RIVER];
specialThemeEntities[HUNTING] = [NEVILLE, DEVONA, EYEKILLER, DETECTIVE];
specialThemeEntities[CHOICES] = [YONGKI, HOON, DOC_SLAUGHTER, DETECTIVE];
specialThemeEntities[ZAP] = [CAPTAIN, DEVIL_OF_SPIRALS];
specialThemeEntities[LOVE] = [ALT, WIBBY, DOC_SLAUGHTER];
specialThemeEntities[SOUL] = [CAPTAIN, ALT, DOC_SLAUGHTER];
specialThemeEntities[ANGER] = [LEE, HUNTER, CAPTAIN, K, DETECTIVE, DEVIL_OF_SPIRALS];
specialThemeEntities[WEB] = [RIA, LEE, HUNTER, HOON, DEVIL_OF_SPIRALS];
specialThemeEntities[ROYALTY] = [CAPTAIN, HOON, K];
specialThemeEntities[KNOWING] = [DEVONA, K, WIBBY, DOC_SLAUGHTER, DETECTIVE];
specialThemeEntities[GUIDING] = [CAPTAIN, HOON, K, DOC_SLAUGHTER, DETECTIVE]; //K is a surprising addition here, but he/she/they/xe/ze LOVE knowing things you don't and lording them over you
specialThemeEntities[CRAFTING] = [RIVER, ALT, APOCALYSE_CHICK];
specialThemeEntities[LANGUAGE] = [YONGKI]; //viscous
specialThemeEntities[BUGS] = [YONGKI, DEVIL_OF_SPIRALS]; //the worm squirming towardss the echidnas heart, prepared to kill it
specialThemeEntities[ADDICTION] = [RIA, HOON, APOCALYSE_CHICK];
specialThemeEntities[SPYING] = [NEVILLE, DEVONA, EYEKILLER, K, DOC_SLAUGHTER, DETECTIVE];
specialThemeEntities[CLOWNS] = [YONGKI, APOCALYSE_CHICK];
specialThemeEntities[DOLLS] = [YONGKI, ALT, DOC_SLAUGHTER];
specialThemeEntities[DARKNESS] = [NEVILLE, EYEKILLER];
specialThemeEntities[MUSIC] = [RIA, LEE, HUNTER, HOON];
specialThemeEntities[WASTE] = [APOCALYSE_CHICK, DEVIL_OF_SPIRALS, DETECTIVE];
specialThemeEntities[DEFENSE] = [NEVILLE, DEVONA, EYEKILLER, YONGKI, CAPTAIN, ALT, DETECTIVE];

//make sure they know they're special
for (let arr of Object.values(specialThemeEntities)) {
  for (let obj of arr) {
    console.log("JR NOTE: making this as special", obj)
    obj.special = true;
  }
}




