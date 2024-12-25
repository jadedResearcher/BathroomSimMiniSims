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
fakeDevLogs[UNLOCK_GIVE] = "okay what the hell, the inventory is DEFINITELY there now, why can't you use anything?<br><br>think i got a fix in, fingers twisted"

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

  constructor(){
    this.loadFromLocalStorage();
  }

  //only your debug codes remain, because you're intended to start new runs every refresh
  loadFromLocalStorage = () => {
    console.log("JR NOTE: loading player progress")//gosh isn't it mysterious, what could it be loading (of course, if you're reading this you're literally seeing whats being loaded but i imagine if you're in the javascript console only its like... but if i refresh my progress is lost so is this glitched out too?)
    this.debugCodes =valueAsArray(SAVE_KEY);
    for(let d of this.debugCodes){
      if(!fakeDevLogs[d]){
        fakeDevLogs[d] = "JR NOTE: make this spooky and procedural and maybe glitch effect occasionally"
      }
    }
    if(this.debugCodes.includes(UNLOCK_INVENTORY1)){
      this.inventory = [];
    }
  }

  //only your debug codes remain, because you're intended to start new runs every refresh
  saveToLocalStorage = () => {
    console.log("JR NOTE: saving player progress")
    localStorage[SAVE_KEY] = JSON.stringify(uniq(this.debugCodes));
  }

}

