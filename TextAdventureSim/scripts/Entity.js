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
  return ret;
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
    if(item && item.name){ //could be a glitched item like for Burger
      item.themes = [chosen_theme];
      itemsButNotEntities.push(item);
    }
  }

  const ret = [];
  for (let item of itemsButNotEntities) {
    console.log("JR NOTE: making item", {item, itemsButNotEntities})
    const e = new Entity(item.name, item.desc, item.themes.map((t) => t.key), item.src);
    ret.push(e)
  }
  const books = spawnBooksAsAppropriate(rand, theme_keys)

  for (let item of books) {
    const e = new Book(item.name, item.desc, item.themes, item.src);
    ret.push(e)
  }
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



  constructor(name, desc, theme_keys, sprite="sheep.gif") {
    console.log("JR NOTE: ", { name, desc, theme_keys })
    this.name = name.toUpperCase();
    this.sprite = sprite;
    this.rand = new SeededRandom(stringtoseed(name));
    this.description = desc;
    this.theme_keys = theme_keys;
    this.rand = rand;
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

    return "You don't know how to " + command + ".";

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
    return `<hr>You GO to the ${this.name}.<hr>` + this.look() + "<br><br>" + this.smell(parentEntity)
  }

  talk = (parentEntity) => {
    const rand = this.getCachedRand();
    //classic breath player
    return `The ${this.name} doesn't seem to want to talk to you :(<br><br>That's okay though!<br><br>You don't need anyone.`;
  }


  take = (parentEntity) => {
    if (player.debugCodes.includes(UNLOCK_INVENTORY2)) {
      if (parentEntity) {
        player.addToInventory(this);
        removeItemOnce(parentEntity.contents, this);
      }else{
        if(this.contents.length >0){
          for(let c of this.contents){
            player.addToInventory(c);
          }
          this.contents = [];//empty now
          return "You take absolutely everything in this room, including some things you hadn't realized weren't nailed down.";
        }else{
          return "There's nothing left to TAKE!";
        }
      }
      return `You TAKE the ${this.name}!`
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
      fakeDevLogs[code]="pending"; //so the bug report system validates it
      handleError(`[[ ERROR CODE: ${code} ]] AT ${new Error().stack}`);
      throw `[[ ERROR CODE: ${code} ]] AT ${new Error().stack}`
    }
    return `You can't GIVE anything! You have nothing in your inventory!`
  }


  use = (parentEntity) => {
    if (player.inventory && player.inventory.length > 0) {
      //if you already have gotten jr to try to fix it once, it starts breaking down into obvious fakeness :)
      const code = player.debugCodes.includes(UNLOCK_USE) ? makeid(12) : UNLOCK_USE;
      fakeDevLogs[code]="pending"; //so the bug report system validates it
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
    this.contents.push(new Entity("Meat", "It's pink and moist. Your mouth waters thinking about it.", [FLESH],"meatslabs.png")); //you can take the meat out, twig :) :) :)
    this.theme_keys.push(FLESH);
  }
}

class RotBeast extends FleshCreature {
  alive = false;
  constructor() {
    super("[REDACTED]", "[REDACTED]", [CENSORSHIP], "redacted.gif");
    this.contents.push(new Entity("[PULSING REDACTED]", "It's disgusting.", [FLESH, DECAY],"redacted.gif"));

  }
}


/*
yeah this is really starting to come together
the webbed heir of blood connects wanda and the intern tightly, forces their pasts to bind them while using doc slaughter as a puppet
meanwhile the page of bloody breath gives freedom to something they maybe should not have, something murderous
*/
