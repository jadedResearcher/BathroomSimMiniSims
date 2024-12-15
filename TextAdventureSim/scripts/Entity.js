const COMMAND_LOOK = "LOOK";
const COMMAND_LISTEN = "LISTEN";
const COMMAND_SMELL = "SMELL";
const COMMAND_TASTE = "TASTE";
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
defaultActionMap[COMMAND_SMELL] = ["SNIFF", "SMELL", "SNORT", "INHALE", "WHIFF"];
defaultActionMap[COMMAND_TASTE] = ["TASTE", "LICK", "EAT", 'FLAVOR', "MUNCH", "BITE", "TONGUE", "SLURP", "NOM"];
defaultActionMap[COMMAND_GO] = ["GO", "DOOR", "EXIT", "LEAVE", "NORTH", "SOUTH", "EAST"];
defaultActionMap[COMMAND_THINK] = ["THINK", "PONDER", "CONTEMPLATE", "PHILOSOPHIZE", "BULLSHIT"]
defaultActionMap[COMMAND_HELP] = ["HELP", "LOST", "OPERATOR", "ASSIST", "AID", "SUPPORT", "TRUTH", "LS", "DIR", "MAN"];
defaultActionMap[COMMAND_TALK] = ["TALK", "TELL", "ASK", "QUESTION", "INTERROGATE", "INTERVIEW"];
defaultActionMap[COMMAND_TAKE] = ["TAKE", "PILFER", "LOOT", "GET", "STEAL", "POCKET", "OBTAIN", "GRAB", "CLUTCH", "WITHDRAW", "EXTRACT", "REMOVE", "PURLOIN", "YOINK", "PICK"];
defaultActionMap[COMMAND_GIVE] = ["GIVE", "GIFT", "OFFER", "BESTOW"];
defaultActionMap[COMMAND_USE] = ["USE", "DEPLOY", "UTILIZE", "OPERATE", "INVOKE"];

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
    this.name = name;
    this.theme_keys = theme_keys;
    this.rand = rand;
    this.syncDefaultFunctions();
  }

  //if an instance has a new look function, for example, you need to recall this or it'll have a ghost reference (it'll keep being the original version)
  syncDefaultFunctions = ()=>{
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
  handleCommand = (command) => {
    //first word is what command it is
    //but do not rush and try to do something with it, it might be for one of your contents
    //this also means your contents may respond to a command that you don't and thats fine
    for (let c of this.contents) {
      if (command.includes(c.name)) {//the name of the entity in its entirity
        return c.handleCommand(command);
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

  }

  //some objects might have their own custom functions for these, like specific triggers/effects
  //like, ria being on fire (having fire in her inventory) isn't going to behave the same as anyone else 

  look = () => {
    return `You LOOK at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  listen = () => {
    return `You LISTEN at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  smell = () => {
    return `You SMELL at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  taste = () => {
    return `You TASTE at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  go = () => {
    return `You GO at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  talk = () => {
    return `You talk at the ${this.name} and think about how JR still needs to wire up default theme things.`
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
    return `You think at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }

  //JR NOTE: this should be tutorial shit or maybe hints if i can manage it
  help = () => {
    return `You help at the ${this.name} and think about how JR still needs to wire up default theme things.`
  }
}