/*
proof of concept was in east, http://farragofiction.com/CatalystsBathroomSim/EAST/NORTH/SOUTH/EAST/NORTH/EAST/SOUTH/?seed=1972000401&themes=endings%2Cweb%2Ctechnology
http://farragofiction.com/AntSim/ <-- that is DEFINITELY not the proof of concept, those aren't bees those are ants, how did you get so confused?

*map of themes and theme oairings like east poc but crucially in addition to bee title it stores number of bees
if bee > 2 for theme  once a UNIT (where unit has a min of 60s if you have 113 bees and   a max of one hour if you have two bees) you get one new bee. bee has 1/13 chance of being a hybrid (possibly starting a new hive)
once a minute, theme produces x * #of bees in theme hive units of THEME HONEY
truth tab displays amount of honey (but doesn't care about theme)
GAMBLING room lets you put honey into single themed slot machines to get truth, facts (locked by theme) , rooms and keys (have list of all facts and rooms AND can be won by the slot machine if it matches theme) (even if its otherwise not wired to be won or you could buy from closer but super expensive)
can put in multiple units of honey  just plays the game that many times and collates rewards
cant win a room if vik ate it
which blorbo
can feed a THEME HIVE a fact that shares its themes to get one minute of progress from it instantly
*/


class ThemeHoney {
  classpect; //same as hive
  theme1Key;
  theme2Key;  //can be used in EITHER slot machine if multiple themes
  quality; // quality = prize lot for slot machine
  /*
25% of facts automatically map to an Eyes or an INFINITE ART MACHINE image if they have no secret for docs room.  honey tier 2 only grabs these facts

tier 3 grabs ones with actual Secrets
  */
  quantity; //you can have more than one in a stack, but all must be at some quality
  constructor(classpect, theme1Key, theme2Key, quality, quantity) {
    this.classpect = classpect;
    this.theme1Key = theme1Key;
    this.theme2Key = theme2Key;
    this.quality = quality;
    this.quantity = quantity;
  }
}

const getBeeKeyFromThemes = (theme1Key, theme2Key) => theme1Key + (theme2Key ? "+" + theme2Key : "");

/*
if you find a bee, add it to the hive that matches its theming. 
if no hive does, generate one and set its classpect and make its amountOfBees be 1. 
*/
const processBee = (theme1Key, theme2Key) => {
  if (!globalDataObject.hiveMap) {
    globalDataObject.hiveMap = {};
  }
  const hive = globalDataObject.hiveMap[getBeeKeyFromThemes(theme1Key, theme2Key)];
  if (hive) {
    hive.amountOfBees += 1;
  } else {
    globalDataObject.hiveMap[getBeeKeyFromThemes(theme1Key, theme2Key)] = new BeeHive(globalRand, theme1Key, theme2Key);
  }

}

//no matter what, always have "Hive" in your classpect
//if you pass in an adj i'll assume the object is Bee, otherwise work it into your object
const beeClasspecting = (rand, themes) => {

  const generateTemplates = (rand, person, object, adj) => {
    let templates = [`${person} of ${object}`, `${object} ${person}`, `${object} ${person}`];
    if (adj) {
      templates = [];
      templates.push(`${adj} ${person} of ${object}`);
      templates.push(`${person} of ${adj} ${object}`)
      templates.push(`${adj} ${person}`)
      templates.push(`${adj} ${object} ${person}`)
    }
    return rand.pickFrom(templates);
  }

  if (themes.length === 1) {
    const nouns = [themes[0].pickPossibilityFor(OBJECT, rand), themes[0].pickPossibilityFor(LOCATION, rand), themes[0].pickPossibilityFor(PERSON, rand)]
    return generateTemplates(rand, "Hive", rand.pickFrom(nouns))
  } else if (themes.length === 2) {
    let nouns;
    let adj;
    if (rand.nextDouble() > 0.5) {
      nouns = [themes[1].pickPossibilityFor(OBJECT, rand), themes[1].pickPossibilityFor(LOCATION, rand), themes[1].pickPossibilityFor(PERSON, rand)]
      adj = [themes[0].pickPossibilityFor(ADJ, rand), themes[0].pickPossibilityFor(ADJ, rand), themes[0].pickPossibilityFor(ADJ, rand), themes[0].pickPossibilityFor(ADJ, rand), themes[0].pickPossibilityFor(COMPLIMENT, rand), themes[0].pickPossibilityFor(INSULT, rand)]
    } else {
      nouns = [themes[0].pickPossibilityFor(OBJECT, rand), themes[0].pickPossibilityFor(LOCATION, rand), themes[0].pickPossibilityFor(PERSON, rand)]
      adj = [themes[1].pickPossibilityFor(ADJ, rand), themes[1].pickPossibilityFor(ADJ, rand), themes[1].pickPossibilityFor(ADJ, rand), themes[1].pickPossibilityFor(ADJ, rand), themes[1].pickPossibilityFor(COMPLIMENT, rand), themes[1].pickPossibilityFor(INSULT, rand)]
    }
    return generateTemplates(rand, "Hive", rand.pickFrom(nouns), rand.pickFrom(adj))

  }
  return "??? Bee";
}

const updateHiveOverTime = (hive, timeInMillis) => {
  //if a stack of honey already exists for the given quality in the hive just up its quantity
  const addLootHoneyOfQualityAndQuantity = (hive, quantity, quality) => {
    let found = false;
    for (let loot of hive.loot) {
      if (loot.quality === quality) {
        found = true;
        loot.quantity += quantity;
      }
    }
    if (!found) {
      hive.loot.push(new ThemeHoney(hive.classpect + " Honey", hive.theme1Key, hive.theme2Key, quality, quantity))
    }
  }

  console.log(`JR NOTE:  ${hive.classpect} is trying to update from ${timeInMillis} ms. I should give it loot and more bees, as appropriate.`)
  console.log("JR NOTE: actually do the math for amount of bees and loot")
  hive.amountOfBees++;
  addLootHoneyOfQualityAndQuantity(hive, 1, 1);
  addLootHoneyOfQualityAndQuantity(hive, 1, 2);

}


//if this has any functions in it it can't be laoded for free
class BeeHive {
  theme1Key;
  theme2Key;//could be null or undefined
  classpect; //if its a hive of Stolen Fire then it make Stolen Fire Honey and if you find a Fire/Thief bee it will be called a Stolen Fire bee. 
  amountOfBees = 1; // every X minutes, generates a new bee (iff there are 2+ bees)
  loot = []; //every minute generates more ThemeHoney (but the tab handles that, not the bee)

  constructor(rand, theme1Key, theme2Key) {
    this.theme1Key = theme1Key;
    this.theme2Key = theme2Key;
    const themes = [all_themes[theme1Key]];
    theme2Key && themes.push(all_themes[theme2Key])
    this.classpect = titleCase(beeClasspecting(rand, themes));
  }



}