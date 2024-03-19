
/*
whole facts are stored to memory which makes them resistent to patches but ALSO means we can 
have rooms where you can define your own facts
zampanio style
*/

const getAllUnlockedFactTitles = ()=>{
  const ret = [];
  for(let fact of globalDataObject.factsUnlocked){
    ret.push(fact.title);
  }
  return ret;
}

class Fact{
  title = "Firsty"; //should be unique
  lore_snippet = "This is the first fact, and JR created it on february 27th 2024."
  mini_game_key; //will only be set if its assigned to a type of room to modify (and then its not available for other rooms)
  theme_key_array = [TWISTING]; //most facts are associated with themes
  damage_multiplier = 10;
  defense_multipler = 0.5;
  speed_multipler = 0.5;
  is_viral = false; //might not do anythign with this but the plan is for facts to be able to spread in weird ways
 
  constructor(title, lore_snippet, theme_key_array, damage_multiplier, defense_multipler, speed_multipler){
    this.title = title;
    this.lore_snippet = lore_snippet;
    this.theme_key_array = theme_key_array;
    this.damage_multiplier = damage_multiplier;
    this.defense_multipler = defense_multipler;
    this.speed_multipler = speed_multipler;
  }
}

/*
    artifacts = [
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
*/

//  constructor(title, lore_snippet, theme_key_array, damage_multiplier, defense_multipler, speed_multipler){

//title should be unique
const TESTFACT = new Fact("Test Fact", "This is just a test of the emergency fact system.",[GUIDING], 1, 10, 1);

//the eye killer considers herself the Final Girl of a horror movie. she is desparate and scared and willing to kill to survive. and so full of adrenaline and fear that the slightest surprise is treated as a jump scare you should stab. 
const KILLEROWNSBLADE = new Fact("The Eye Killer Wields the Quatro Blade", "A dull straight razor stained with blood, a number 4 is etched onto the side of the blade. Any cut made with it can not be perceived, even as blood loss slowly builds up. Anyone who dies while bleeding from this blade will not be percieved by any means. It is said the Eye Killer does not even know she wields it. All she knows is that the kills she makes to warn off Hunters never seem to get found. Never seem to scare off predators. So her kills get more and more gruesome, more and more artistic,  to try to acomplish her goals. Do not look for her. Do not Hunt her. Do not make Wodin's mistake.",[KILLING, OBFUSCATION], 2, 0.5, 0.5)
const EYEKILLERISHUNTED = new Fact("The Eye Killer Is Hunted", "The Eye Killer is hunted by the Cult of the Nameless One, for reasons she does not understand. She was one of the, once.",[HUNTING], 1, 1, 2);
const EYEKILLERKILLSCULTISTS = new Fact("The Eye Killer Kills Cultists", "The Eye Killer kills only in self defense, but makes increasingly gruesome 'art pieces' to try to scare off future hunters. She does not know why it never seems to work.",[KILLING], 2, 1, 1);
const EYEKILLERFOUNDFAMILY = new Fact("The Eye Killer Has Found A Family", "The Eye Killer misses the cult that raises her, even as they hunt her now. She's finally found a new one she trusts in the Mafia. The Hostage she rescued and the Himbo who helped her are her friends, through every Loop.",[DEFENSE, FAMILY], 1, 10, 1);


//closer will NOT stock any facts about herself, thank you very much, besides marketing spiels

const CLOSERISGREATATFACTS = new Fact("The Closer Provides You With Best Value FACTS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the fact you need to make sense of this crazy world.",[GUIDING], 1, 2, 1);
const CLOSERISGREATATKEYS = new Fact("The Closer Provides You With Best Value KEYS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the keys you need to make sense of this crazy world.",[GUIDING], 1, 2, 1);
const CLOSERISGREATATROOMS = new Fact("The Closer Provides You With Best Value ROOMS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the rooms you need to make sense of this crazy world.",[GUIDING], 1, 2, 1);

const CLOSEREATSBABIES = new Fact("The Closer Eats Babies", "Baby Lamia grow on trees as 'fruit babs'. While they are moderately ambulatory at this stage ('wiggling') they are not generally considered sapient until they cocoon and their fruit innards become actual organs, veins and nervous systems",[KILLING, BUGS], 2, 1, 1);
const CLOSERADDICTEDTOFRUIT = new Fact("The Closer Is Addicted To Fruit", "In the Closer's Home Universe, her race was known for being obsessively addicted to eating fruit. It is a sign of great will power to resist for even a moment.",[ADDICTION, PLANTS], 1, 1, 2);


const PARKERSBESTIEISVIC = new Fact("Parker's Bestie is [REDACTED]", "When Parker is with [REDACTED] its like they can't hear the call of Gun-Tan anymore. They will weaken slowly, because Gun-Tan is how they live now. But it is nice, for just a little while, to be a danger to no one.",[OBFUSCATION, CENSORSHIP], 0, 0, 0);
const PARKERSlOVESGUNTAN = new Fact("Parkers Loves Gun-Tan", "Parker loves Gun-Tan so much he never lets her go. Even if he thinks he has she is right back in his hands when its time to pull the trigger again. She loves him THAT much.",[KILLING, BURIED], 10, 1,10);
const PARKERSTHINKSWIBBYANDKARENEAT = new Fact("Parker's Favs Are Witherby and K", "When Parker burrowed out of his home universe he made sure to steal away all his favorite blorbos he loved watching through his cameras. Witherby and K are especially fun to watch, because of how often they interact with the others. Parker loves watching.",[SPYING], 1, 1,1);
const PARKERRUNSABBQ = new Fact("Parker Owns a BBQ", "Despite how filthy Parker is, he can work a mean grill. He and [REDACTED] run a literal hole in the wall BBQ that has long lines whenever it pops up.",[FLESH, BURIED], 1, 1, 1);


//every fact the closer can give you
const factsForSale = [CLOSERISGREATATFACTS, EYEKILLERISHUNTED, PARKERRUNSABBQ, EYEKILLERKILLSCULTISTS, KILLEROWNSBLADE, EYEKILLERFOUNDFAMILY, PARKERSBESTIEISVIC, PARKERSlOVESGUNTAN, PARKERSTHINKSWIBBYANDKARENEAT,CLOSERISGREATATKEYS];

//every fact the CFO can give you
const factsForGaming = [CLOSERISGREATATROOMS];

//every fact the slot machines can give you
const factsForGambling = [CLOSERADDICTEDTOFRUIT]