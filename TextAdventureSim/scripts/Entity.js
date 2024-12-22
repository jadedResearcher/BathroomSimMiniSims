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
defaultActionMap[COMMAND_LOOK] = ["LOOK", "SEE", "OBSERVE", "GLANCE", "GAZE", "GAPE", "STARE", "WATCH", "INSPECT", "EXAMINE", "STUDY", "SCAN", "VIEW", "JUDGE", "EYE", "OGLE"];
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

getDirectionLabel = (index) => {
  if (index === 0) {
    return "NORTH";
  } else if (index === 1) {
    return "SOUTH";
  } else if (index === 2) {
    return "EAST";
  } else {
    return "???";
  }
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
//every entity can access a stable seed for its randomness
const seedCache = {};


class Entity {
  alive = false;
  name = "Perfectly Generic Entity";
  durability = 113;//(nothing can die in arm2 but if you take enough damage you're not exactly coherent anymore)
  theme_keys = [];
  rand;
  //NOTE: VICS CONTENTS SHOULD BE FUCKED UP
  contents = [];//list of other entities. If you're, say, Ria, its whats in your pockets. If you're, say, Truth, it's what's wandering around your horridors.
  actionMap = { ...defaultActionMap } //honestly there may never be a non default action map 
  functionMap = {}//what do we DO for each possible action?
  neighbors = []; //similar to contents, but these are the things you can move into from this entity



  constructor(name, theme_keys, rand) {
    this.name = name.toUpperCase();
    this.theme_keys = theme_keys;
    this.rand = rand;
    if (!seedCache[this.name]) {
      seedCache[this.name] = rand.internal_seed;
    }
    this.syncDefaultFunctions();
  }
  //this will be the same every time i call this function (unless i refresh the page)
  //as opposed to the non cached rand that changes over time
  //useful for, say, making sure the room always smells the same
  getCachedRand = () => {
    return new SeededRandom(seedCache[this.name]);
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
  handleCommand = (command, count = 0) => {
    if (count > 13) {
      return "Haha, wow! How did you manage to recurse thaaaaaaaaaaaaat many times. Surely even YOU can't justify that one, lol. imma just...stop that. Only I get to cause fractal game crashing bugs like that, lulz. It's been real!"
    }
    //first word is what command it is
    //but do not rush and try to do something with it, it might be for one of your contents
    //this also means your contents may respond to a command that you don't and thats fine
    for (let c of this.contents) {
      if (command.toUpperCase().includes(c.name.toUpperCase())) {//the name of the entity in its entirity
        return c.handleCommand(command, count + 1);
      }
    }
    //if we haven't returned yet, its for me to handle
    const first_word = command.split(" ")[0].toUpperCase();
    for (const [key, value] of Object.entries(this.actionMap)) {
      if (value.includes(first_word)) {
        //we found it
        return this.functionMap[key]();
      }
    }

    return "You don't know how to " + command + ".";

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
  look = () => {
    const rand = this.getCachedRand();
    let directions;
    let pockets;

    pockets = this.contents.length > 0 ? `You see ${humanJoining(this.contents.map((c => c.name)))}! ` : "You see nothing :(";
    directions = this.neighbors.length > 0 ? `Obvious exits are ${humanJoining(this.neighbors.map((n, i) => `${n.name} (${getDirectionLabel(i)})`))}!` : "There's no where to go from here :(";
    return `You look carefully at the ${this.name}. It's hard to see! ${pockets} ${directions}`;
  }

  listen = (recursionJustified = true) => {
    const rand = this.getCachedRand();
    let sounds = this.theme_keys.map((t) => all_themes[t].pickPossibilityFor(SOUND, rand));
    let directions;

    //if we're close by its clear, and we can smell a bit of our neighbors
    if (recursionJustified) {
      directions = this.neighbors.map((n, i) => `To the ${getDirectionLabel(i)} you faintly hear ${n.listen(false)}.`)
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
  smell = (recursionJustified = true) => {
    const rand = this.getCachedRand();
    let scents = this.theme_keys.map((t) => all_themes[t].pickPossibilityFor(SMELL, rand));
    let directions;
    let pockets;

    //if we're close by its clear, and we can smell a bit of our neighbors
    if (recursionJustified) {
      pockets = this.contents.map((c) => c.smell(false));
      directions = this.neighbors.map((n, i) => `To the ${getDirectionLabel(i)} you faintly smell ${n.smell(false)}.`)
      return `You breath deeply at the ${this.name}, taking in the scents of ${humanJoining(uniq(scents))}. ${pockets ? `Is that a faint whiff of ${humanJoining(uniq(pockets))} you detect?` : ""} ${directions}`

    } else { //if we're not we can only smell a bit
      scents = [scents[0]];
      return scents[0]; //just return the smell word.
    }
  }

  //taste isn't recursive. if you lick a person you can't taste whats in their pockets
  taste = () => {
    const rand = this.getCachedRand();
    let tastes = this.theme_keys.map((t) => all_themes[t].pickPossibilityFor(TASTE, rand));
    return `You happily lick at the ${this.name}, taking in the flavors of ${humanJoining(uniq(tastes))}. ${this.alive ? `The ${this.name} seems really upset about this.` : "No one can stop you."}`
  }

  touch = () => {
    const rand = this.getCachedRand();
    let touch = this.theme_keys.map((t) => all_themes[t].pickPossibilityFor(FEELING, rand));
    return `You happily paw at the ${this.name}, taking in the textures of ${humanJoining(uniq(touch))}. ${this.alive ? `The ${this.name} seems really upset about this.` : "No one can stop you."}`
  }

  go = () => {
    return `You GO at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  talk = () => {
    const rand = this.getCachedRand();
    return `The ${this.name} doesn't seem to want to talk to you :(`;
  }


  take = () => {
    return `You take at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  give = () => {
    return `You give at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  use = () => {
    return `You use at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  think = () => {
    //this one isn't cached, your thoughts can change
    const theme = all_themes[this.rand.pickFrom(this.theme_keys)]
    return `You think about the ${this.name}... Haha, wow, that's hard actually!  In the distance, you can hear a mournful voice droning on and on about something? "${theme.pickPossibilityFor(PHILOSOPHY, this.rand)}"<br><br>Boring!`
  }

  //JR NOTE: this should be tutorial shit or maybe hints if i can manage it
  help = () => {
    return `List of Commands For ${this.name}: ${Object.keys(this.actionMap).join(", ")}`;
  }
}


class FleshCreature extends Entity {
  alive = true;
  constructor(name, theme_keys, rand) {
    super(name, theme_keys, rand);
    this.contents.push(new Entity("Blood", [FLESH], rand)); //you can take the blood out, twig :) :) :)
    this.contents.push(new Entity("Meat", [FLESH], rand)); //you can take the meat out, twig :) :) :)
    this.theme_keys.push(FLESH);
  }
}
