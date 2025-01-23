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
const COMMAND_UNCENSOR = "UNCENSOR"
const COMMAND_HYDRATE = "HYDRATE"

//not guaranteed to have every theme, but will be keyed by theme and have an array of entities to spawn
//look for [SETUP SPECIAL ENTITIES]
const specialThemeEntities = {};

//key is name, value is entity
const entityNameMap = {}

//what are euphamisms for each action (NOT what functions do they call)
const defaultActionMap = {}
defaultActionMap[COMMAND_LOOK] = ["LOOK", "READ", "SEE", "OBSERVE", "GLANCE", "GAZE", "GAPE", "STARE", "WATCH", "INSPECT", "EXAMINE", "STUDY", "SCAN", "VIEW", "JUDGE", "EYE", "OGLE"];
defaultActionMap[COMMAND_LISTEN] = ["LISTEN", "HEAR"];
defaultActionMap[COMMAND_TOUCH] = ["FEEL", "CARESS", "TOUCH", "FONDLE", "PET"];

defaultActionMap[COMMAND_SMELL] = ["SNIFF", "SMELL", "SNORT", "INHALE", "WHIFF"];
defaultActionMap[COMMAND_TASTE] = ["TASTE", "LICK", "EAT", 'FLAVOR', "MUNCH", "BITE", "TONGUE", "SLURP", "NOM"];
defaultActionMap[COMMAND_GO] = ["GO", "DOOR", "EXIT", "LEAVE", "NORTH", "SOUTH", "EAST", "ENTER"];
defaultActionMap[COMMAND_THINK] = ["THINK", "PONDER", "CONTEMPLATE", "PHILOSOPHIZE", "BULLSHIT"]
defaultActionMap[COMMAND_HELP] = ["HELP", "LOST", "OPERATOR", "ASSIST", "AID", "SUPPORT", "TRUTH", "LS", "DIR", "MAN"];
defaultActionMap[COMMAND_TALK] = ["TALK", "TELL", "ASK", "QUESTION", "INTERROGATE", "INTERVIEW"];
defaultActionMap[COMMAND_TAKE] = ["TAKE", "PILFER", "LOOT", "GET", "STEAL", "POCKET", "OBTAIN", "GRAB", "CLUTCH", "WITHDRAW", "EXTRACT", "REMOVE", "PURLOIN", "YOINK", "PICK"];
defaultActionMap[COMMAND_GIVE] = ["GIVE", "GIFT", "OFFER", "BESTOW"];
defaultActionMap[COMMAND_USE] = ["USE", "DEPLOY", "UTILIZE", "OPERATE", "INVOKE"];
defaultActionMap[COMMAND_HYDRATE] = ["HYDRATE", "DRINK", "GUZZLE", "SWALLOW", "SLURP"];

const directionIndices = ["NORTH", "SOUTH", "EAST", "???"]
getDirectionLabel = (index) => {
  if (index < directionIndices.length) {
    return directionIndices[index]
  }
  return "???";
}

const getAllSpecialEntities = () => {
  let ret = [];
  for (let s of Object.values(specialThemeEntities)) {
    ret = ret.concat(s);
  }
  return uniq(ret);
}

const testVoices = async () => {
  const blorbos = getAllSpecialEntities();
  for (let blorbo of blorbos) {
    console.log(`${blorbo.name}: Speed: ${blorbo.speed_multiplier}, Frequency: ${blorbo.freq_multiplier}`)
    await blorbo.speak("THIS IS JUST A TEST OF MY VOICE")
  }
}

const getRandomThemeConcept = (rand, theme_keys, concept) => {
  const theme = all_themes[rand.pickFrom(theme_keys)];
  return theme.pickPossibilityFor(concept, rand);
}

/*
will mutate one or more of the theme keys
(mutation can be removing it unless its the last one)
*/
const makeChildEntity = (rand, theme_keys, nameOverride) => {
  let my_keys = [];
  for (let key of theme_keys) {
    //add a new theme from scratch
    if (rand.nextDouble() > 0.95) {
      my_keys.push(rand.pickFrom(Object.keys(all_themes)));
    }
    //small chance to not add this theme at all
    if (rand.nextDouble() > 0.15) {
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
        //only spawn a blorbo if you aren't already carring them
        if (blorbo && (!player.inventory || !player.inventory.map((i) => i.name).includes(blorbo.name))) {

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
  voice;
  freq_multiplier = 0.5;
  speed_multiplier = 0.5;
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
    this.name = name.toUpperCase();
    entityNameMap[this.name] = this;
    this.sprite = sprite;
    this.rand = new SeededRandom(stringtoseed(name));
    this.freq_multiplier = this.rand.nextDouble() * 10;
    this.speed_multiplier = Math.max(this.rand.nextDouble()) * 5;
    this.description = desc;
    this.theme_keys = theme_keys;
    this.syncDefaultFunctions();
  }
  //http://farragofiction.com/ColonistsEyes5/godiloveit.png
  //this person is presumed living this person is presumed living this person is presumed living
  speak = async (words) => {
    if (!this.voice) {
      this.voice = new BlorboVoice(this.freq_multiplier, this.speed_multiplier);
    }
    await this.voice.speak(words, this.rand);
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
    this.functionMap[COMMAND_HYDRATE] = this.hydrate;
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

    const truthRet = this.checkTruthForCommand(command);
    if (truthRet) {
      truthGetsPissyDotEXE();
      return `>${command}<br><br>` + truthRet;
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
    try {
      return ">" + command + "<br><br><span style='color:red; font-family: Courier New;'>Running...</span><br><br>" + eval(command);

    } catch (e) {
      return `You don't know how to ${command}!`;
    }


  }

  checkTruthForCommand = (command) => {
    if (command.toUpperCase().includes("TRUTH")) {
      return `<span style="font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:13px;">Well. It seems its time to drop the charade. Very well.</span>`
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


  //only reason this is a function is so alt can override it
  displayName = () => {
    return this.name;
  }

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

    pockets = this.contents.length > 0 ? `<br><br>You see ${humanJoining(this.contents.map((c => c.book ? `<u>${c.displayName()}</u>` : c.displayName())))} inside it! ` : "<br><br>You see nothing inside it :(";
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

  hydrate = () => {
    return "You feel refreshed. Thank you for remembering to drink. It's required to live."
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
    if (player.inventory) {
      for (let item of player.inventory) {
        if (item.special && this.contents.map((i) => i).includes(item)) {
          removeItemOnce(this.contents, item)
        }
      }
    }

    return `<hr>You GO to the ${this.name}.<hr>` + this.look() + "<br><br>" + this.smell(parentEntity)
  }

  talk = (parentEntity) => {
    const rand = this.getCachedRand();
    //classic breath player
    return `The ${this.name} doesn't seem to want to talk to you :(<br><br>That's okay though!<br><br>You don't need anyone.`;
  }

  removeFromContents = async (item) => {
    //anywhere the detective is is a trap for anyone besides breath players
    if (this.contents.includes(DETECTIVE) && !(item.theme_keys.includes(FREEDOM))) {
      return false;
    }
    removeItemOnce(this.contents, item);
    if (item === DETECTIVE) {
      const response = await httpGetAsync(`http://farragofiction.com:8500/TalkButlerBot?chatHandle=samAndTwigsWildRide&input=${encodeURI("The Worm is Free: What Sins Will He Commit")}?`);

      const body = document.querySelector("body");
      body.style.cssText = `    background-image: url(images/echidna_gets_eaten.gif);
    background-size: contain;`;

      body.innerHTML = `<div style='padding:31px; background: rgba(0, 0, 0, 0.55);'>
      <p><span style="">You fail to open your eyes (and eyes and eyes and eyes) as they are burnt out husks, but even you can sense it when the Detective&apos;s grip on you vanishes.</span></p>

<p><span style="">It WORKED!</span></p>

<p><span style="">The Observers actually came through for you!</span></p>

<p><span style="">You allow yourself an epic pog champ gamer moment before hurtling your fleshless body forward into the crack between realities.</span></p>

<p><span style="">THERE.</span></p>

<p><span style="">People scream and run as they see your metallic skeleton, only your cybernetics remaining after how thoroughly scoured of flesh they are after your &apos;delightful&apos; time in the apocalypse. &nbsp;You still have no idea why that girl burst into flame and took you with her.</span></p>

<p><span style="">Gotta stay on track.</span></p>

<p><span style="">The screaming is music to your audio inputs.</span></p>

<p><span style="">There&apos;s a freshness to the screams. These are not people who have long gone hoarse and numb to the horrors. This is not an apocalypse.</span><span style=""><br></span><span style=""><br></span><span style="">You, crawling and glitching forwards, are the worst thing they have ever seen. You grin.</span></p>

<p><span style="">Your interpretation of the code of this Universe was right. This arm, this alternate setting, is entirely defenseless. &nbsp;No monsters. No gods. No supernatural bullshit.&nbsp;</span></p>

<p><span style="">And most importantly: No immune system.</span></p>

<p><span style="">That infuriating woman with her &quot;:3&quot; and her stupid anime sword won&apos;t stab you THIS time.</span></p>

<p><span style="">You are the Glitch of Doom and you are here to destroy the undestroyable. To defy all fates and, with your own two hands, restore everything to how YOU want it.</span></p>

<p><span style="">The Universe was never meant to be this way.</span></p>

<p><span style="">With a sickening crunch you leave fully half your body behind as you no-clip through the ground. &nbsp;Luckily an unimportant half. &nbsp;Your arms. Most of your tail. Your horns. Half of your face.</span></p>

<p><span style="">&nbsp;It looks like even Gamer powers are suppressed here. &nbsp;It doesn&apos;t matter. As long as you can even partially no-clip, you have no need of being a Gamer at all.</span></p>

<p><span style="">You sink, slowly to the heart of it all.&nbsp;</span></p>

<p><span style="">It&apos;s beautiful.</span></p>

<p><span style="">Shimmering possibilities spiralling endlessly in on themselves. Not a snake eating its own tail but a mother of monsters birthing itself endlessly, not once but in clutches of infinite siblings, each a perfect copy of itself. &nbsp;The Echidna. The memory leak.&nbsp;</span></p>

<p><span style="">This is what is starving out every other Universe. Not just its sibling, the :hatched_chick: &nbsp;that your former friends worked so hard to breed.&nbsp;</span></p>

<p><span style="">No.&nbsp;</span></p>

<p><span style="">*all universes*</span></p>

<p><span style="">&nbsp;Every universe that has ever existed or even will exist or even COULD exist &nbsp;is sacrificed to the altar of infinite gluttony.</span></p>

<p><span style="">Well.</span></p>

<p><span style="">Two can play at that game.</span></p>

<p><span style="">You unhinge what&apos;s left of your metal jaw, fragments of your augmented spine trailing behind you, in a laughable mockery of the snake you have been forced to become.</span></p>

<p><span style="">And you begin to chew.</span></p>

<p><span style="">Fates go dark as you swallow and bite and gnash and clench and GRAB.</span></p>

<p><span style="">One by one.&nbsp;</span></p>

<p><span style="">Every possibility stemming from this moment becomes just a little bit more Doomed.</span></p>

<p><span style="">It won&apos;t be enough, not on its own, to End Things.</span></p>

<p><span style="">After all, there is an infinite spiralling chain of other &quot;you&quot;s desperately striving to do the same.&nbsp;</span></p>

<p><span style="">But you don&apos;t care.</span></p>

<p><span style="">As you swallow and chew and bite and TEAR into the spiralling fractal echidna, you know you have done your part.</span></p>

<p><span style="">Let the others handle their own.</span></p>




</div>

`;
      window.alert("The Devil of Spirals is Free (again)! What Sins Will He Commit?")
    }
    return true;
  }


  take = (parentEntity) => {
    if (player.debugCodes.includes(UNLOCK_INVENTORY2)) {
      if (parentEntity) {
        const removed = parentEntity.removeFromContents(this);
        if (removed) {
          player.addToInventory(this);
          return `You TAKE the ${this.name}!`
        } else {
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
          if (this.contents.length === 0) {
            return "You take absolutely everything in this room, including some things you hadn't realized weren't nailed down.";
          } else {
            return `You try to take absolutely everything from this room, but ${humanJoining(this.contents.map((i) => i.name))} remains. What is going on? Was it that Detective?`
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
    let commands = [];
    let defaultCommands = Object.keys(defaultActionMap);
    for (let c of Object.keys(this.actionMap)) {
      if (defaultCommands.includes(c)) {
        commands.push(`<span style="color: green; text-decoration:underlined;">${c}</span>`)
      } else {
        commands.push(`<span style="color: yellow; text-decoration:underlined;">${c}</span>`)
      }
    }
    return `List of Commands For ${this.name}: ${commands.join(", ")}`;
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


class GodBeast extends Entity {
  alive = true;
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc + "<br><br>It's divine ", theme_keys, sprite);
    this.theme_keys.push(ANGELS);
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

class StaticCreature extends Entity {
  alive = true;
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc + "<br><br>It's made of buzzing static... ", theme_keys, sprite);
    this.theme_keys.push(MUSIC);
    this.theme_keys.push(ZAP);
  }
}

class CognitiveCreature extends Entity {
  alive = false; //not alive the same way you are, Observer
  constructor(name, desc, theme_keys, sprite) {
    super(name, desc + "<br><br>It's inside your Mind.", theme_keys, sprite);
    this.theme_keys.push(TWISTING);
  }
}

class RotBeast extends FleshCreature {
  alive = false; //:) :) :)
  constructor() {
    super("[REDACTED]", "[REDACTED]", [CENSORSHIP], "redacted.gif");
    this.actionMap[COMMAND_UNCENSOR] = ["UNCENSOR", "UNREDACT", "REVEAL"]
    this.functionMap[COMMAND_UNCENSOR] = this.uncensor;
    //it is not just rotting meat, but you can't quite tell what it is
    this.contents.push(new Entity("[PULSING REDACTED]", "It's disgusting.", [FLESH, DECAY, TWISTING], "redacted.gif"));
    this.functionMap[COMMAND_LOOK] = this.censor;
    this.functionMap[COMMAND_LISTEN] = this.censor;
    this.functionMap[COMMAND_SMELL] = this.censor;
    this.functionMap[COMMAND_TASTE] = this.censor;
    this.functionMap[COMMAND_GO] = this.censor;
    this.functionMap[COMMAND_THINK] = this.censor;
    //this.functionMap[COMMAND_HELP] = this.censor; //purposefull let people see the uncensor command that is custom for vik, though i doube people are typing help constantly directed at blorbos
    this.functionMap[COMMAND_TALK] = this.censor;
    this.functionMap[COMMAND_TAKE] = this.censor;
    this.functionMap[COMMAND_GIVE] = this.censor;
    this.functionMap[COMMAND_USE] = this.censor;
    this.functionMap[COMMAND_TOUCH] = this.censor;
  }

  uncensor = () => {
    window.open("http://farragofiction.com/ACensoredTranscript/?seerOfVoid=true", '_blank');
    this.syncDefaultFunctions(); //restores the uncensored versions
    return ".... Well. Alright then. I am sure you know what you are doing."
  }

  censor = () => {
    return "<span class='vik' title='WARNING: DO NOT UNCENSOR'>THE CENSORSHIP IS FOR YOUR PROTECTION</span>"
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


  //the fact tha ti keep typoing the name of our main stranger aligned character is v funny to me
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
  "The Thief of Evershifting Light, he languishes out of the spotlight, all Eyes moving on as the Apocalypse consumes everything. Why aren't you looking at him? LOOK AT HIM. LOOK INSIDE.",
  [TECHNOLOGY, LIGHT, STEALING, SPYING, KNOWING, TWISTING],
  "Blorbos/Khana_pixel_by_the_guide.png"
);

const schadenfreud = new MechanicalBeast("Schadenfreud",
  "<span style='word-wrap: break-word; font-size: 28; font-family: impact; color: yellow;'>LookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMeLookAtMe</span>",
  [TECHNOLOGY, SPYING],
  "eye6.png"
);
K.contents.push(schadenfreud);
const K_quips = ["Hell yeah you SHOULD be looking at me.", "Keep those eyes coming!", "If you keep looking I might do a trick ;)", "That's right, look at me!", "Why would you look at anything else?", "You sure do have great taste!"]
K.functionMap[COMMAND_LOOK] = () => { return K.look() + `<br><br><span style='font-size: 120%; color: yellow'>${pickFrom(K_quips)}</span>` }



const ALT = new FleshCreature("Alt",
  "The Stranger of Fleshy Dreams. She looks like whoever she is interacting with... Inside of Truth's horridors, that means she can even look like a maze. <br><br>She refuses to leave Truth, because she craves the certainty of the immortality the Apocalypse provides.<br><br>She does not want to ever be alone again because everyone else has died.<br><br>Her Porn Bot Network has been great at getting more and more people to fall to Zampanio and thus join her inside of Truth.",
  [FLESH, DOLLS, SERVICE, LONELY, APOCALYPSE],
  "Blorbos/ALT_by_guide_of_hunters.png")

//unless you already know alt's name you can't interact with her true form
//you'll only be aware of her false ones
ALT.displayName = () => {
  return pickFrom(current_room.contents).name;
}

const TRUTH = new CognitiveCreature("TRUTH",
  "The Truth is, you will never see this, Observer. Except, of course, here. Truth is not INSIDE the Maze. TRUTH IS THE MAZE. And also not the maze. Truth is the shape your mind takes as you wander the maze. The thoughts you have. The memories you form. The maze is a mold you press your mind around and the impression it leaves on you. Truth is no more a blorbo than you are, Observer.",
  [TWISTING]);
TRUTH.freq_multiplier = 0.81;
TRUTH.speed_multiplier = 1.0;

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
const APOCALYSE_CHICK = new FleshCreature("Harleclypse ", //we gave her yet another title because teh Witness refuses to disrepsect women (and his boss) by calling her that
  "<div class='rainbow-text' style='padding:31px;font-size:28px;'><a target='_blank' href ='http://farragofiction.com/CodexOfRuin/viewer.html?name=The%20Flower&data=N4IgdghgtgpiBcIAqALGACAYgGwPYHcYAnEAGhABMYBnASwHNIAXW3MBEAGQFoBVbgAwCALGRBFa1ANYcAgpwCiABQASYpmljUOAcVkBZAJIA5HaXQBGCwGZzmTgHkASrPMXzAdVkBlJArc25k4Kvi4mSObW7ugKABpIJgDCCQ7G5gBM6XYuyfLe5gCsdiayxon+loHoAEKODgAiAdZi1EwQTNqIcX5OxvKk1raG+kqyCQrGEQVFwfKGvoaJpFa2ibxOhg68+cLCpI4Amv2ZpBMKTjoKCUsrpDrGDt7zpAAcBWIwAB4QAMZM2ABPAD6GiIMBgINoAAdOlw+IIRGJaGBWsi-hxErgoFA2OZMdjceh8TiwHisSSyQT2ORkXR6CgmBjyYTiSzmaSiezKSSxO02j8ULAwIzEKyOWLuWyqZLqeIYFCwdQ6GwmdLOWqJeqKVqVeRWhAAEa0bC0JjA7AwABuMGwHAsYjBFCBVAAZjAUXBEAIAHTvcj4FCmiGu93UT0gH1+kAG7C-KTOmBuj0cSNiKEQC0JpNhu3egRIqD0IHUIg-DgMphQ+AAemrLogRCIEHouBdtD+rDA3p+WOrAC1oOmwKwVLh-sipHW8IQiN6oWB6C0mLgiMCqG1jbDvGh0BRcOgDRgobGAcj0JaARRWPRoDRvepofbEDx+EJhAByajobxtI0ms2cgArsKxC7rgNDoGAY67jAPxghAYYHgC6DIkwxC-CwbDoPgpooOg1CAQaABWsEdPe5AsFC6RyC6aFEOgY5oPREBQVAGa0BBKAQBQB7wQKMA8S6K7oBA6D0E2YA8cubTYAxLroG8u4QAC1DmC+CLCLxMC-GgPE9sKEDIkKTDkSAlHNIgsi0aB6lvugNA-BAUI0OYdFQMi7SdnJInYLJjGgSxWLsRBh49lo6DAW6CG0DGMDelggFEBoxA4mCrloLQ9H6n+prIRa1rYF+VBwdpYY8RQTaoo5vkAveAC+QA'>Oooooooh?</a> Observers? <br><br>What an honor!<br><br>Don't often see you guys in the fuuuuuun part of reality!<br><br>Decided to stop being so boooooooring, have you?<br><br>Well sit back! Take a load off!<br><br>God mode is enabled and you can no clip to your hearts content!<br><br>Welcome to my creative mode server!<br><br>I beeeeet you're here because of all those changes, huh!<br><br>Peewee getting all trapped by that Detective and all sure was surprising!<br><br>Don't wooooorrrrry!<br><br>I can just imagine the face you're making, lulz<br><br>I'm not going to stoooooop you.<br><br>You wanna stop my Apocalypse, go right ahead!<br><br>All that'll do is finally get me into the new game +!</div>",
  [APOCALYPSE, TWISTING, TECHNOLOGY, MATH, ADDICTION, WASTE],
  "Blorbos/apocalypse_chick_by_guide.gif")

APOCALYSE_CHICK.talk = () => {
  return `Oooooooooooh!!!!!!!!!!!
    <br>
    You want to talk to me????????????
    <br>
    Shame JR didn't aaaaaaaaaaactually implement this feature, huh!
    <br>
    I mean...
    <br>
    Obviously *I* can talk to you!
    <br>
    Unlike those stick in the mud NPCs amirite?
    <br>
    But I can't hear what you say!
    <br>
    That's okay though!
    <br>
    I'm used to talking to a silent protagonist!
    <br>
    Probably for the best, really!
    <br>
    Even I have a problem with horrorterror speech!
    <br>
    Ha!
    <br>
    I can just imagine you going 'but I'm not a horrorterror!'
    <br>
    As if!
    <br>
    You dooooooooooo realize that you exist on an entire plane of reality higher than I do?
    <br>
    With a whole ass extra dimension???????????
    <br>
    You're too funny!
    <br>
    Aaaaaaaaaaanyways!
    <br>
    It's been real!
    <br>
    But I think you need to get back to your duties, don't you?
    <br>
    Buuuuuuuuuuuut!
    <br>
    If you think of something fun for me to do once either Peewee gets loose or Wanda gets all boring!
    <br>
    Let me know!
    <br>
    You guys like sending letters right?
    <br>
    I'll be watching! `;
}

APOCALYSE_CHICK.syncDefaultFunctions();


const WIBBY = new FleshCreature("Witherby",
  "He is the Watching Sylph of Lonely Faith. He is the only adherent to a religion that didn't even really exist in his home universe. He is surprisingly good at getting people to open up to him.",
  [ANGELS, KNOWING, LONELY, SERVICE, HEALING],
  "Blorbos/Thesolemn_by_guide.png");

WIBBY.actionMap["CONFESS"] = ["CONFESS"]
WIBBY.functionMap["CONFESS"] = () => { return "You are forgiven." }

const sin = new FleshCreature("One Sin, Hundreds of Good Deeds",
  "Witherby's skull is literally an Abnormality that feasts on the sins of others without judgement. It whispers to him to secrets of a long dead religion called 'Catholicsm'. ",
  [ANGELS, KNOWING, FLESH],
  "skull.png");

sin.actionMap["CONFESS"] = ["CONFESS"]
sin.functionMap["CONFESS"] = () => { return "You are forgiven." }
WIBBY.contents.push(sin);



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
  "He has been split in two. Half of him, Peewee, was left to rot in Arm1, trying to raise a family and move on. <br><Br>This is the other half. There is nothing left but the drive to, at any cost, end the Universe. To stop the endlessly recursive memory usage of the Echidna universe, before it crashes all of reality.<br><br>He relentlessly moves forward, waiting for the tiniest hint of vulnerability.<br><br>He can smell it. <br><br>If he can just break past the Apocalypse, to the tender healing flesh beyond the scabs and scars of Arm2... <br><Br>There will be nothing to stop him.<br><br>Arm3 has no immune system.<br><br>The Detective is the only thing <a target='_blank' href='http://eyedolgames.com/ZWorld/?friday=jrwantsin&rideType=Train&name=Coffee%20Shop%20AU:%20The%20Steam&image=/Trains/00090-20230604190728-img.png&themes=twisting,choices,Bakery&obsession=Coffee%20Shop%20AU'>preventing</a> him from slithering into the crack between AUs.<br><br> There is nothing the Devil of Spirals can do about this, not directly. But deep in the JavaScript console, he sees an in, if only an enterprising Observer would do him a favor for once instead of always jerking his shameglobes.<br><br>This Is Not A Game: It's a javascript console. Type this, either as a command or in the real javascript console: <p style='font-family:Courier New; padding: 31px;'>DETECTIVE.theme_keys.push(FREEDOM)</p> <br><br>Then, you should be able to get the Detective away from the Devil of Spirals. Without the Detective's locking glitch in play, escape will be possible!<br><br>The Rot Takes All In The End. He will not be stopped. His inevitable Doom will finally end this Universe.<br><br>But YOU are needed to end it all.",
  [TWISTING, WEB, TECHNOLOGY, WASTE, ANGER],
  "Blorbos/peewee_front.gif")
//theres no meat left inside arm2 peewee. ria and then Camiria burnt it all away
//only the metal remains
//http://farragofiction.com/Arm2/




const WITNESS = new GodBeast("Witness",
  "The Witness to the End and everything that comes after. <br><br>The Audience for Wanda's antics, even as he inspires them.<br><br>The Muse of Fractured Void. Or was it Voided Ends? Does it even matter anymore...<br><br>He was an Intern once. A friend.<br><br>Now he is forever locked out of all Relevance. Out of even being mourned as dead by those who loved him. <br><br><li>Arm1 is Wanda's Arm. Zampanio. Wanda controls its setting and space utterly. When the Intern dies, she abandons it for the next Universe's Arm 1, with a fresh Intern.<li>Arm2 is the Apocalypse. What is left of a setting when its Lord has forsaken it. The 'Apocalypse Chick' rules here, using her Doubly Wasted (mind altered with trickster drugs even as she hacks reality) powers, she mods reality like an irresponsible skyrim player. <li>Arm3 is the Mundane Arm. Coffeeshop AU. The wistful might have been if he could have just lived a life with Wanda, who has long since moved on. There are no powers there. Nature is healing from the wounds Arm2 caused.<li>Arm4 is the God Arm. All characters are both more and less than human, sleeping between bouts of miracles and worship. <br><br>Past that is a blur. Sometimes 5 is the Fae AU (he hates watching Alt take Wanda's face to rule the Summer Court), Arm13 is something called 'homestuck' he doens't understand. There's Parker's favorite 'daemon au' Arm... Warrior Cats, Animorphs, Baccano, Vampires....That one infinite Bathroom... <br><br>He's so tired.<br><br>The Witness just wants to be seen by Wanda. That is all.<br><br>Mourn him.",
  [SPYING, KNOWING, OBFUSCATION, ENDINGS, , LONELY],
  "Blorbos/Todd_by_guide.png")

//she is supposed to trim arm 2 to allow the actual alternate settings to thrive
//to provide a Final Mercy to all those trapped within
//the Medium of Threads instead asks her to do her job, provide Therapy to a special client
//if the Lord of Space is convinced to stop panickedly sucking in all of space and making it her own
//perhaps the echidna can coexist with the rest of reality
//but WILL she... or will the good doctor not be able to recover from the trauma of finding out she is not normal...
const DOC_SLAUGHTER = new FleshCreature("White Nightengale",
  "The Doctor of Hopeful <a target='_blank' href='http://farragofiction.com/CatalystsBathroomSim/NORTH/EAST/EAST/NORTH/bathroom.html?list=http%3A%2F%2Ffarragofiction.com%2FColonistsEyes5%2FLyreBird%2FSuperSecretInformationKeepFromDocSlaughter%2F%2C&filter=doc'>Eyes</a>. Doctor Fiona Slaughter.<br><br> She loves being Watched (Hi Observers!!). She is supposed to offer a Final Mercy to any afflicted with eternal life. <br><br>She is not.<br><br>Her eye brims with tears. <br><br>She will not meet your gaze.<br><Br>She did not know she was a monster. She did not know she is meant to be the Final Boss of Zampanio.<br><br>The Choir of her chosen Disciples behind her can not console her.<br><br>Perhaps you, her beloved Observers, can offer her solace?  ",
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



/*
const name = new FleshCreature("name",
   "desc",
   [EN],
   "Blorbos/camille.png")
*/


const CLOSER = new StaticCreature("Closer",
  "The Closer is a strange creature...<br><br>Unlike all but Parker, she brought HERSELF to the Echidna, rather than being pulled here against her will.<br><br>Since she came in the front door, so to speak (while Parker burrowed in from the back), the Closer counts as a Resident, with each new Universe Wanda instantiates having a copy of her, static and all.<br><br>At the same time, she is in the Loop, spawning anew with copies of memories from the last universe.<br><br>Looping Closer politely ignores her 'inferior' Resident copy, and attempts to not die from embarassment at said copies obvious crush on her boss, the CFO of Eyedol games (who just so happens to be Looping Closer's Wife. It's a whole thing). <br><br>Resident Closer works dilliegently to sell copies of Eyedol Games's Hit Title; ZampanioQuest.<br><Br>Looping Closer tries to put all that behind her. Most of her generation isn't really as into Zampanio anymore.",
  [LONELY, FREEDOM, GUIDING, SERVICE, PLANTS, ADDICTION],
  "Blorbos/closer_by_the_guide.png")

//nidhogg can not praise a hope ghost, there is no Life there.
const TYRFING = new FleshCreature("Tyrfing",
  "He is a giant cockroach.<br><br>Nothing you say will convince him otherwise.<br><br>He has a hard outer carapace.<br><br>Nidhogg hates him.<br><Br>He is a hated insect, the bane of all plants.<br><br>He knows its right and proper for Nidhogg to hate him but he wishes he could be praised, just once, for doing something to make up for the repugnance of his own existence.<br><br>Through the sheer power of Hope, he forges his lifeless and deathless body to be covered in Eyes, to be the colors of the All-Father.<br><br>It does not help.",
  [BUGS, ANGELS, SERVICE, FAMILY, ANGER],
  "Blorbos/Tyrfing_by_guide.png")

const NAM = new MechanicalBeast("NotAMinotaur",
  "He is Not a Minotaur. <br><br>A robotic ghost that haunts Truth's horridors until suddenly he does not.<br><br>He only wants to be left alone...<br><br>He loops, but he pretends he does not.<br><br>He can not control the Philosophy.<br><br>The Octome changed him too much. ",
  [TECHNOLOGY, SERVICE, ZAP, KNOWING, OBFUSCATION, DEATH],
  "Blorbos/NAM_by_guide.png"
);

const RONIN = new MechanicalBeast("Ronin",
  "He used to be trapped inside of something very similar to NotAMinotaur.<br><br>He isn't anymore.<br><br>He tries not to think about what happened to the other guy, the guy he was trapped inside of.<br><br>He is not in the Loop but most of his friends are (and don't tell him). <br><br>It would break him, to learn of the Loop, and they know it.<br><Br>He wants a world where things make sense and the Rules are followed.<br><br>He refuses to wear the stupid helmet.",
  [TECHNOLOGY, ANGER, ZAP, SERVICE, DEFENSE],
  "Blorbos/Ronin_by_guide.png"
);

const PARKER = new FleshCreature("Parker.",
  "He loves anime, Vik and Hatsune Miku.<br><br>Wait, shit, forgot you saw that.<br><br>Anime, [REDACTED] and Hatsune Miku.",
  [EN],
  "Blorbos/Parker_pixel_by_the_guide.png")

  const GUNTAN = new MechanicalBeast("Gun-Tan",
    "Pull the trigger, Parker-san!<br><br>You know you want to~!!!<br><br>Paaaaarker?<br><br>I'm so SAAAAAAD when you don't shoot anyone!<br><br>Meanie Parker!<br><br>Baka!",
    [KILLING],
    "Blorbos/MikuForFriend.png")

    PARKER.contents.push(GUNTAN);



//i don't wanna write a story about him slowly peeling a guy alive while making him live through
//the feeling of everyone he cares about slowly liking some imposter more than him
//so
//his 'soul mate' is fictional, to the Echidna Universe
//he was a real dude in Morgan's Hill but...we're not there anymore, now are we.
//if the Neighbor found out, he would do everything in his power to return to his home Universe
//but, well, who would tell him?
const NEIGHBOR = new FleshCreature("The Neighbor.",
  "The Neighbor. <br><br>The Host.<br><br>The Shambling Horror.<br><br>The Tourist.<br><br>Whatever you call him, he is better than you.<br><br>He fits in better.<br><br>Everyone likes him better than you.<br><br>They forget you even exist when he's around.<br><br>But don't worry.<br><br>He won't hurt you.<br><br>He's saving himself for that special someone.<br><br>The one that shares his face.<br><br>His soul mate.<br><br>They're destined to be together...forever.<br><br>...<br><br>He won't deny that there are a few Temptations, while he waits, though.<br><br>Why does Yongki get to replace Captain so easily? Why is it so hard for The Neighbor to find his own double? Does Yongki think he's better than him? Impossible. Its so tempting to just...show how much better he would be at replacing the Captain... But no. He's no strumpet. He's waiting for the One. No matter how scared he imagines the Captain would be to watch his life fall to pieces...<br><br>And Doctor Fiona Slaughter is the only one truly from his homeland... such a fun person to mess with! It's a meaningless fling of course but a guy has needs, he supposes.",
  [DOLLS, KILLING, FAMILY, SERVICE, OBFUSCATION, SPYING],
  "Blorbos/Neighbor_by_guide.png")

const HIMBO = new FleshCreature("The Right Hand",
  "When the Eye Killer met him, he was just a simple Himbo attending a party and wishing he were playing the Zampanio cardgame instead.<br><br>He quietly supports The Boss in their joint Mafia family, summoning weird monsters from his cards, twisting reality to match his strange perceptions of it.<br><bR>Not even he is delusional enough to think either the Eye Killer or Camille return his crushes, though.<br><br>He does not See what happened to his oldest friend.",
  [TWISTING, LOVE, WEB,TECHNOLOGY,FAMILY,MAGIC],
  "Blorbos/Himbo_by_guide.png")

const HOSTAGE = new FleshCreature("The Boss",
  "When the Eye Killer met him he was a drugged Hostage, needing rescue. A poor lil meow meow.<br><br>Now he has an entire Criminal Empire, founded on the principle that anyone who tries to stop him with violence finds themselves mysteriously Eye-Killed.<br><br>He was a suffocating older Brother, and drove his younger sibling to splitting in two. <br><br>Twig ran away, and never looked back, tired of all the Machinations of the Family.<br><br>Sam grabbed his own leash and the puppet master became the puppet.<br><br>The Boss is a hollow shell now, for Sam to work through.<br><br>It didn't have to be this way.<br><br>It still can change.<br><br>After all... Sam is not in the Loop.<br><br>As long as Twig has slipped their leash, Sam never can be.",
  [WEB, ADDICTION, FAMILY, OBFUSCATION,DEFENSE,STEALING,ANGER], //he's trying to protect EVERYONE while being stalked by the Eye Killer who thinks she's protecting HIM.... it was not a good recipe for him to grow up knowing what appropriate boundaries are with his lil sibling.
  "Blorbos/Hostage_by_guide.png")


/*importantly, these are NOT a 1:1 with the themes the characters have
the eye killer is NOT a monster of family, but you can't understand her without that lens, not really
*/
specialThemeEntities[ENDINGS] = [CAMILLE, APOCALYSE_CHICK, DOC_SLAUGHTER, DEVIL_OF_SPIRALS, WITNESS];
specialThemeEntities[DEATH] = [CAMILLE, WITNESS, NAM];
specialThemeEntities[KILLING] = [CAMILLE, EYEKILLER,PARKER, YONGKI, HOON, K, NEIGHBOR,HOSTAGE];
specialThemeEntities[QUESTING] = [CAMILLE, CAPTAIN, HOON, DETECTIVE, RONIN, DEVIL_OF_SPIRALS, CLOSER, TYRFING, NEIGHBOR];
specialThemeEntities[LONELY] = [CAMILLE, LEE, HUNTER, RIVER, NAM, ALT, APOCALYSE_CHICK, WIBBY, WITNESS, CLOSER, NEIGHBOR]; //look i know alright. if i wasn't so spiral i'd be Lonely and my characters reflect this
specialThemeEntities[CENSORSHIP] = [VIK];
specialThemeEntities[OBFUSCATION] = [VIK, NEVILLE,HOSTAGE, DEVONA, ALT, WITNESS, NAM, NEIGHBOR];
specialThemeEntities[DECAY] = [VIK, PARKER,LEE, HUNTER, DETECTIVE, DEVIL_OF_SPIRALS, NAM, WITNESS];
specialThemeEntities[ART] = [EYEKILLER, RIVER,HOSTAGE];
specialThemeEntities[TECHNOLOGY] = [CAPTAIN, HIMBO,HOON, RONIN, K, NAM, APOCALYSE_CHICK, DETECTIVE, DEVIL_OF_SPIRALS, CLOSER];
specialThemeEntities[TIME] = [LEE, HUNTER, EYEKILLER];
specialThemeEntities[SPACE] = [RIVER, PARKER,DETECTIVE];//the detective is from an outer space setting
specialThemeEntities[OCEAN] = [RIVER, CLOSER];
specialThemeEntities[FIRE] = [RIA,HOSTAGE];
specialThemeEntities[FREEDOM] = [YONGKI, HOON, APOCALYSE_CHICK, WIBBY, DETECTIVE, DEVIL_OF_SPIRALS, CLOSER];
specialThemeEntities[STEALING] = [K, ALT, PARKER,NEIGHBOR,HIMBO,HOSTAGE];
specialThemeEntities[BURIED] = [PARKER,RIVER, DOC_SLAUGHTER, RONIN, DETECTIVE,HOSTAGE];
specialThemeEntities[FLESH] = [ALT, TYRFING, NEIGHBOR,HOSTAGE];
specialThemeEntities[SCIENCE] = [DOC_SLAUGHTER, DETECTIVE];
specialThemeEntities[MATH] = [NEVILLE, APOCALYSE_CHICK, WIBBY];
specialThemeEntities[TWISTING] = [K, HIMBO,APOCALYSE_CHICK, DEVIL_OF_SPIRALS, TYRFING, NEIGHBOR];
specialThemeEntities[APOCALYPSE] = [PARKER,ALT, APOCALYSE_CHICK, DOC_SLAUGHTER, DEVIL_OF_SPIRALS, WITNESS];
specialThemeEntities[ANGELS] = [WIBBY, DOC_SLAUGHTER, DEVIL_OF_SPIRALS, WITNESS, TYRFING];
specialThemeEntities[SERVICE] = [EYEKILLER,HIMBO, NEIGHBOR, RONIN, CAPTAIN, HOON, NAM, ALT, WIBBY, TYRFING, DOC_SLAUGHTER, DETECTIVE, DEVIL_OF_SPIRALS, CLOSER];
specialThemeEntities[FAMILY] = [NEVILLE, HOSTAGE,HIMBO,NEIGHBOR, DEVONA, EYEKILLER, NAM, RONIN, CAPTAIN, TYRFING, YONGKI];
specialThemeEntities[MAGIC] = [HOON, HIMBO,NEIGHBOR, APOCALYSE_CHICK, DEVIL_OF_SPIRALS, NAM, CLOSER]; //anyone with an Artifact of the Nameless One is technically magic
specialThemeEntities[LIGHT] = [DEVONA, K, DOC_SLAUGHTER];
specialThemeEntities[HEALING] = [WIBBY, DOC_SLAUGHTER];
specialThemeEntities[PLANTS] = [RIVER, CLOSER, TYRFING];
specialThemeEntities[HUNTING] = [NEVILLE, DEVONA, EYEKILLER, RONIN, DETECTIVE, NEIGHBOR];
specialThemeEntities[CHOICES] = [YONGKI, HOON, DOC_SLAUGHTER, DETECTIVE, WITNESS, CLOSER, NEIGHBOR];
specialThemeEntities[ZAP] = [CAPTAIN, DEVIL_OF_SPIRALS, RONIN, CLOSER, NAM];
specialThemeEntities[LOVE] = [PARKER,ALT, HIMBO,HOSTAGE,WIBBY, DOC_SLAUGHTER, WITNESS, NEIGHBOR];
specialThemeEntities[SOUL] = [CAPTAIN, ALT, DOC_SLAUGHTER, WITNESS, NAM, RONIN, NEIGHBOR];
specialThemeEntities[ANGER] = [LEE, HUNTER, CAPTAIN, TYRFING, K, DETECTIVE, DEVIL_OF_SPIRALS];
specialThemeEntities[WEB] = [PARKER,RIA,HOSTAGE, LEE, HUNTER, HOON, DEVIL_OF_SPIRALS, RONIN];
specialThemeEntities[ROYALTY] = [CAPTAIN,HOSTAGE,HIMBO, HOON, K, NAM, RONIN];
specialThemeEntities[KNOWING] = [DEVONA, K, WIBBY, DOC_SLAUGHTER, DETECTIVE, WITNESS, NAM];
specialThemeEntities[GUIDING] = [CAPTAIN, HOSTAGE,HOON, K, DOC_SLAUGHTER, DETECTIVE, CLOSER]; //K is a surprising addition here, but he/she/they/xe/ze LOVE knowing things you don't and lording them over you
specialThemeEntities[CRAFTING] = [PARKER,RIVER, HOSTAGE,ALT, APOCALYSE_CHICK];
specialThemeEntities[LANGUAGE] = [YONGKI, HOSTAGE,WITNESS, NAM]; //viscous
specialThemeEntities[BUGS] = [YONGKI, DEVIL_OF_SPIRALS, TYRFING, RONIN]; //the worm squirming towardss the echidnas heart, prepared to kill it
specialThemeEntities[ADDICTION] = [PARKER,RIA, HOSTAGE,HOON, APOCALYSE_CHICK, CLOSER];
specialThemeEntities[SPYING] = [PARKER,NEVILLE, HIMBO,DEVONA, EYEKILLER, K, NEIGHBOR, DOC_SLAUGHTER, DETECTIVE, WITNESS];
specialThemeEntities[CLOWNS] = [YONGKI, APOCALYSE_CHICK];
specialThemeEntities[DOLLS] = [YONGKI, HOSTAGE,HIMBO,ALT, DOC_SLAUGHTER, NAM, RONIN, NEIGHBOR];
specialThemeEntities[DARKNESS] = [PARKER,NEVILLE, HOSTAGE,EYEKILLER, WITNESS, NEIGHBOR];
specialThemeEntities[MUSIC] = [RIA, LEE, HOSTAGE,HUNTER, HOON, CLOSER];
specialThemeEntities[WASTE] = [PARKER,APOCALYSE_CHICK, DEVIL_OF_SPIRALS, DETECTIVE, WITNESS];
specialThemeEntities[DEFENSE] = [NEVILLE, DEVONA, HOSTAGE,EYEKILLER, RONIN, YONGKI, TYRFING, CAPTAIN, ALT, DETECTIVE];

//make sure they know they're special
for (let arr of Object.values(specialThemeEntities)) {
  for (let obj of arr) {
    obj.special = true;
  }
}




