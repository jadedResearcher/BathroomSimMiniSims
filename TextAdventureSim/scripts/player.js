/*
There is only one player and they are not an Entity.

You cannot enter yourself and anything in your inventory is not considered to currently be part of the game
unless you USE it or GIVE it or something.

mostly this is filled with hacks and cheats ;)
*/

//oh no, the tutorial was supposed to unlock the inventory for you :( :( :(, let me fix that
const UNLOCK_INVENTORY1 = "61bd19864ae0";

//haha whoops typo, sorry about that, NOW its fixed
const UNLOCK_INVENTORY2 = "72fd78e246c";

//....would be nice if that inventory button worked, sorry 'bout taht
const UNLOCK_INVENTORY3 = "77350c1ff32d";

//okay what the hell, the inventory is DEFINITELY there now, why can't you get anything?
//after this, GET has procedural error codes
const UNLOCK_GET = "c5cb2934ca17";

//okay what the hell, the inventory is DEFINITELY there now, why can't you use anything?
//after this, USE has procedural error codes
const UNLOCK_USE = "590eca5e9559";

//okay what the hell, the inventory is DEFINITELY there now, why can't you give anything?
//after this, GIVE has procedural error codes
const UNLOCK_GIVE = "2f9777c49a74";


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
    this.debugCodes =valueAsArray(SAVE_KEY);
  }

  //only your debug codes remain, because you're intended to start new runs every refresh
  saveToLocalStorage = () => {
    localStorage[key] = JSON.stringify(this.debugCodes);

  }

}

