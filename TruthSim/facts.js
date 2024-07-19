
/*
whole facts are stored to memory which makes them resistent to patches but ALSO means we can 
have rooms where you can define your own facts
zampanio style
*/

const getAllUnlockedFactTitles = () => {
  const ret = [];
  for (let fact of globalDataObject.factsUnlocked) {
    ret.push(fact.title);
  }
  return ret;
}

//picks a theme and makes a bullshit fact about it
const randomFact = (rand) => {
  const chosenTheme = rand.pickFrom(Object.values(all_themes));

  const person = chosenTheme.pickPossibilityFor(PERSON, rand);
  const adj = chosenTheme.pickPossibilityFor(ADJ, rand);
  const compliment = chosenTheme.pickPossibilityFor(COMPLIMENT, rand);
  const insult = chosenTheme.pickPossibilityFor(INSULT, rand);
  const supermove = chosenTheme.pickPossibilityFor(SUPERMOVE, rand);
  const object = chosenTheme.pickPossibilityFor(OBJECT, rand);
  const location = chosenTheme.pickPossibilityFor(LOCATION, rand);

  const childbackstory = chosenTheme.pickPossibilityFor(CHILDBACKSTORY, rand);
  const generalbackstory = chosenTheme.pickPossibilityFor(GENERALBACKSTORY, rand);
  const miracle = chosenTheme.pickPossibilityFor(MIRACLE, rand);
  const philosophy = chosenTheme.pickPossibilityFor(PHILOSOPHY, rand);
  const loc_desc = chosenTheme.pickPossibilityFor(LOC_DESC, rand);
  const monster_desc = chosenTheme.pickPossibilityFor(MONSTER_DESC, rand);
  const smell = chosenTheme.pickPossibilityFor(SMELL, rand);
  const taste = chosenTheme.pickPossibilityFor(TASTE, rand);
  const feeling = chosenTheme.pickPossibilityFor(FEELING, rand);
  const sound = chosenTheme.pickPossibilityFor(SOUND, rand);
  const effects = chosenTheme.pickPossibilityFor(EFFECTS, rand);

  const noun = rand.pickFrom([person, adj, location, object]);

  const nameTemplates = [`${supermove} is ${rand.pickFrom(["really cool", "awesome", "totally swag", "l337", "fuckin awesome", "impressive", "op", "overpowered", "really needing to be nerfed", "objectively the best final attack", "so totally awesome"])}`, `${titleCase(noun)} Fact`, `The ${noun} is ${compliment}.`, `The ${noun} is ${insult}.`, `The ${noun} is ${adj}.`, `The ${noun} smells like ${smell}.`, `The ${noun} tastes like ${taste}.`, `The ${noun} sounds like ${sound}.`, `The ${noun} feels like ${feeling}.`];
  const templates = [
    `I am afraid all of the time. ${monster_desc}`,
    `There is ${loc_desc}.`,
    `Zampanio is a really fun game and you are already playing it.`,
    `The ${person} can ${miracle}.`,
    `The ${person} ${childbackstory}.`,
    `They ${generalbackstory}.`,
    `${philosophy}`,
    `When the ${person} walks ${effects}.`
  ];
  const chosenName = titleCase(rand.pickFrom(nameTemplates));
  const chosenDescription = `${rand.pickFrom(templates)} ${rand.pickFrom(templates)} ${rand.pickFrom(templates)}`;

  const fact = new Fact(chosenName, chosenDescription, [chosenTheme.key], rand.getRandomNumberBetween(0, 13), rand.getRandomNumberBetween(0, 13), rand.getRandomNumberBetween(0, 13));
  fact.isIrrelevant = true;
  return fact;
}

//most facts don't explicily pair to a secret (annoying to do)
//instead theres a big list of secrets at the bottom of the page that facts can rarely pull from
//secrets are longer form rambles or stories or what have you, more than facts
const all_secrets = [];

//only doc slaughter can reveal these. its her religion, to expose secrets. 
//devona would if she COULD but Fragment of the Universe prevents her from doing so without driving the listener mad
class Secrets {
  video;
  audio;
  image;
  html;
  constructor(video, audio, image, html) {
    all_secrets.push(this);
    video = video;
    audio = audio;
    image = image;
    html = html
  }
}

const all_facts = [];

//all facts that aren't procedural can modify a mini game 
//well, i suppose a procedural fact could COINCIDENTALLY modify a mini game (they respond to words in the title)
//but thems the break, you're not intended to use them that way but i am not bothered if you do
//but NEVILLE and RIA aren't going to realize you can
//anyways, this has to happen once all mini games and all facts have been created so that we can 
//figure out how they relate
//fingers twisted it works, as a friend would say
const processFacts = () => {

  const minigames = Object.values(globalMiniGames);
  console.log(`JR NOTE: processing ${all_facts.length} facts across ${minigames.length} games. btw there are ${all_secrets.length} secrets. Better hope there's not more secrets than facts!!!`)
  for (let fact of all_facts) {
    console.log("JR NOTE: processing fact: ", fact.title)
    for (let game of minigames) {
      if (game.respondsToFact(fact)) {
        fact.changesAMiniGame = true;
        console.log(`JR NOTE: Fact ${fact.title} modifies ${game.id}, who knew?`)
        break;
      }
    }
  }
}

const pleaseABHelpMeFindMissingFacts = () => {
  let all_themes_keys = Object.keys(all_themes)
  for (let theme of all_themes_keys) {
    const facts1 = getAllFactsWithThemeAndTier(theme,1);
    const facts2 = getAllFactsWithThemeAndTier(theme,2);
    const facts3 = getAllFactsWithThemeAndTier(theme,3);

    const totalFactCount = facts1.length + facts2.length + facts3.length;

    console.log(`AB NOTE: It seems that there are ${totalFactCount} facts about ${theme}. ${facts1.length} are Tier1. ${facts2.length} are Tier2. ${facts3.length} are Tier3.`);
    if (totalFactCount === 0) {
      console.error(`AB NOTE: ERROR ${theme} has no facts. It seems, JR, that you need to get to work.`);
    }

    if (facts1.length === 0) {
      console.error(`AB NOTE: ERROR ${theme} has no Tier1 Facts. It seems, JR, that you need to get to work.`);
    }

    if (facts2.length === 0) {
      console.error(`AB NOTE: ERROR ${theme} has no Tier2 Facts. It seems, JR, that you need to get to work.`);
    }

    if (facts3.length === 0) {
      console.error(`AB NOTE: ERROR ${theme} has no Tier3 Facts. It seems, JR, that you need to get to work.`);
    }
  }
}

//if this is slow, store the facts on the theme object after the first time
const getAllFactsWithTheme = (theme_key) => {
  console.log("JR NOTE: don't forget to call pleaseABHelpMeFindMissingFacts to make sure theres no themes with no facts")
  const ret = [];
  for (let fact of all_facts) {
    if (fact.theme_key_array.includes(theme_key)) {
      ret.push(fact);
    }
  }
  return ret;
}

const getAllFactsWithThemeAndTier = (theme_key, tier) => {
  console.log("JR NOTE: don't forget to call pleaseABHelpMeFindMissingFacts to make sure theres no themes with no facts")

  //sure could call getAllFactsWithTheme but why loop to get the facts then loop again to get the tiers
  const ret = [];
  for (let fact of all_facts) {
    if (fact.theme_key_array.includes(theme_key)) {
      if (tier === 1) {
        //level 1 is all facts of theme (theme_key_array on fact)
        ret.push(fact);
      } else if (tier === 2) {
        //level 2 is all facts of theme that control a mini game (changesAMiniGame on fact)
        if (fact.changesAMiniGame) {
          ret.push(fact);
        }
      } else if (tier === 3) {
        //level 3 is all facts of theme that have a Secret (secret on fact)

        if (fact.secret) {
          ret.push(fact);
        }
      }
    }
  }
  return ret;
}

class Fact {
  title = "Firsty"; //should be unique
  secret;
  isIrrelevant = false; //its irrelevant if its random, helps neville know what to KILL
  lore_snippet = "This is the first fact, and JR created it on february 27th 2024."
  mini_game_key; //will only be set if its assigned to a type of room to modify (and then its not available for other rooms)
  theme_key_array = [TWISTING]; //most facts are associated with themes
  damage_multiplier = 10;
  changesAMiniGame = false;
  defense_multipler = 0.5;
  speed_multipler = 0.5;
  is_viral = false; //might not do anythign with this but the plan is for facts to be able to spread in weird ways

  constructor(title, lore_snippet, theme_key_array, damage_multiplier, defense_multipler, speed_multipler, secrets) {
    this.title = title;
    this.lore_snippet = lore_snippet;
    this.secret = secrets;
    this.theme_key_array = theme_key_array;
    this.damage_multiplier = damage_multiplier;
    this.defense_multipler = defense_multipler;
    this.speed_multipler = speed_multipler;
    all_facts.push(this);
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


console.log("JR NOTE: TODO when NEVILLE AND DEVONA'S FACT VIEWER/DELETER TAB/ROOM IS IMPLEMENTED, PARSE NEW LINES AS BR")
//title should be unique
const TESTFACT = new Fact("Test Fact", "test", [GUIDING], 1, 10, 1);


const CLOWNFACT = new Fact("Zampanio Thinks Hunting Is For Clowns", "Back when I first wrote what became ZampanioSimNorth I had a really fun glitch where hunt aligned players were just not working right. I discovered that for some reason it was overriding the values for HUNTING with CLOWNS.  So that sort of became a meme that keeps going.  I used to call the Eye Killer 'Hunt Chick' and she IS just a funny lil guy. I'll leave it as an excercise to the Observer how much clowning Devona and Neville get up to.", [CLOWNS, HUNTING], 1, 2, 1);

//http://farragofiction.com/CodexOfRuin/viewer.html?name=The%20Flower&data=N4IgdghgtgpiBcIAqALGACAYgGwPYHcYAnEAGhABMYBnASwHNIAXW3MBEAGQFoBVbgAwCALGRBFa1ANYcAgpwCiABQASYpmljUOAcVkBZAJIA5HaXQBGCwGZzmTgHkASrPMXzAdVkBlJArc25k4Kvi4mSObW7ugKABpIJgDCCQ7G5gBM6XYuyfLe5gCsdiayxon+loHoAEKODgAiAdZi1EwQTNqIcX5OxvKk1raG+kqyCQrGEQVFwfKGvoaJpFa2ibxOhg68+cLCpI4Amv2ZpBMKTjoKCUsrpDrGDt7zpAAcBWIwAB4QAMZM2ABPAD6GiIMBgINoAAdOlw+IIRGJaGBWsi-hxErgoFA2OZMdjceh8TiwHisSSyQT2ORkXR6CgmBjyYTiSzmaSiezKSSxO02j8ULAwIzEKyOWLuWyqZLqeIYFCwdQ6GwmdLOWqJeqKVqVeRWhAAEa0bC0JjA7AwABuMGwHAsYjBFCBVAAZjAUXBEAIAHTvcj4FCmiGu93UT0gH1+kAG7C-KTOmBuj0cSNiKEQC0JpNhu3egRIqD0IHUIg-DgMphQ+AAemrLogRCIEHouBdtD+rDA3p+WOrAC1oOmwKwVLh-sipHW8IQiN6oWB6C0mLgiMCqG1jbDvGh0BRcOgDRgobGAcj0JaARRWPRoDRvepofbEDx+EJhAByajobxtI0ms2cgArsKxC7rgNDoGAY67jAPxghAYYHgC6DIkwxC-CwbDoPgpooOg1CAQaABWsEdPe5AsFC6RyC6aFEOgY5oPREBQVAGa0BBKAQBQB7wQKMA8S6K7oBA6D0E2YA8cubTYAxLroG8u4QAC1DmC+CLCLxMC-GgPE9sKEDIkKTDkSAlHNIgsi0aB6lvugNA-BAUI0OYdFQMi7SdnJInYLJjGgSxWLsRBh49lo6DAW6CG0DGMDelggFEBoxA4mCrloLQ9H6n+prIRa1rYF+VBwdpYY8RQTaoo5vkAveAC+QA
const APOCALYPSEFACT = new Fact("The CFO of Eyedol Games Will End The World", "She doesn't mean to. You can see it in her eye. You can see it in the way she tries so dillgently to avoid hurting anyone, even her auditors. But the fact of the matter is she was born to end a world and her fate is not too picky about which. If Wanda moves on for any reason, she blossoms. But... she also doesn't. She's worked so hard at self control. Know restraint, that's the Waste's mantra right? She has seen how fragile this simulated reality really is and she would NEVER do something to risk it. Except. Well. Except for that one time. She was young. And impulsive.  And Nidhogg brought its poisoned candy (https://archiveofourown.org/works/35438083/chapters/91817125#workskin) into the Universe and everone partook. How could she possibly restrain herself while Trickster? All candy colored and frentic. She hacked herself to make it forever. The party never stops. Then she hacked everything else too. Even the rules that say that once Wanda leaves a place everyone she Knows about is dragged along with her. Apocalypse Chick spreads and spreads and spreads like a weed in Wanda's wake. Never able to leave the destroyed remnants of Arm1, but perfectly able to stabelize it enough to turn it into a second arm. Arm2. She can't reach Arm 3, the Mundane arm. Or the fourth. The God arm. Or the fifth, the Faerie Arm or the sixth or seventh or however many pointless irrelevant arms of this Universe the Witness has spiralled out in his grief for his lost friend. But she's having fun. Just ask her yourself.  https://eyedolgames.com/East ", [APOCALYPSE], 13, 13, 3);

const KISALUCKYBASTARD = new Fact("K Is A Lucky Bastard", "K should have died a thousand times over even before making it to this Universe. Somehow... he/she/xe/fae/they/it always come out on top.", [LIGHT], 1, 1, 1);
//https://archive.org/details/zammy-dreams
//the eye killer considers herself the Final Girl of a horror movie. she is desparate and scared and willing to kill to survive. and so full of adrenaline and fear that the slightest surprise is treated as a jump scare you should stab. 
const KILLEROWNSBLADE = new Fact("The Eye Killer Wields the Quatro Blade", "A dull straight razor stained with blood, a number 4 is etched onto the side of the blade. Any cut made with it can not be perceived, even as blood loss slowly builds up. Anyone who dies while bleeding from this blade will not be percieved by any means. It is said the Eye Killer does not even know she wields it. All she knows is that the kills she makes to warn off Hunters never seem to get found. Never seem to scare off predators. So her kills get more and more gruesome, more and more artistic,  to try to acomplish her goals. Do not look for her. Do not Hunt her. Do not make Wodin's mistake.", [KILLING, OBFUSCATION], 2, 0.5, 0.5)
const EYEKILLERISHUNTED = new Fact("The Eye Killer Is Hunted", "The Eye Killer is hunted by the Cult of the Nameless One, for reasons she does not understand. She was one of the, once.", [HUNTING], 1, 1, 2);
const EYEKILLERKILLSCULTISTS = new Fact("The Eye Killer Kills Cultists", "The Eye Killer kills only in self defense, but makes increasingly gruesome 'art pieces' to try to scare off future hunters. She does not know why it never seems to work.", [KILLING], 2, 1, 1);
const EYEKILLERFOUNDFAMILY = new Fact("The Eye Killer Has Found A Family", "The Eye Killer misses the cult that raises her, even as they hunt her now. She's finally found a new one she trusts in the Mafia. The Hostage she rescued and the Himbo who helped her are her friends, through every Loop.", [DEFENSE, FAMILY], 1, 10, 1);


//closer will NOT stock any facts about herself, thank you very much, besides marketing spiels

const CLOSERISGREATATFACTS = new Fact("The Closer Provides You With Best Value FACTS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the fact you need to make sense of this crazy world.", [GUIDING], 1, 2, 1);
const CLOSERISGREATATKEYS = new Fact("The Closer Provides You With Best Value KEYS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the keys you need to make sense of this crazy world.", [GUIDING], 1, 2, 1);
const CLOSERISGREATATROOMS = new Fact("The Closer Provides You With Best Value ROOMS", "The Closer is a highly competent sales proffesional who will work tirelessly to make sure YOU have the rooms you need to make sense of this crazy world.", [GUIDING], 1, 2, 1);

const CLOSEREATSBABIES = new Fact("The Closer Eats Babies", "Baby Lamia grow on trees as 'fruit babs'. While they are moderately ambulatory at this stage ('wiggling') they are not generally considered sapient until they cocoon and their fruit innards become actual organs, veins and nervous systems", [KILLING, BUGS], 2, 1, 1);
const CLOSERADDICTEDTOFRUIT = new Fact("The Closer Is Addicted To Fruit", "In the Closer's Home Universe, her race was known for being obsessively addicted to eating fruit. It is a sign of great will power to resist for even a moment.", [ADDICTION, PLANTS], 1, 1, 2);


const PARKERSBESTIEISVIC = new Fact("Parker's Bestie is [REDACTED]", "When Parker is with [REDACTED] its like they can't hear the call of Gun-Tan anymore. They will weaken slowly, because Gun-Tan is how they live now. But it is nice, for just a little while, to be a danger to no one.", [OBFUSCATION, CENSORSHIP], 0, 0, 0);
const PARKERSlOVESGUNTAN = new Fact("Parkers Loves Gun-Tan", "Parker loves Gun-Tan so much he never lets her go. Even if he thinks he has she is right back in his hands when its time to pull the trigger again. She loves him THAT much.", [KILLING, BURIED], 10, 1, 10);
const PARKERSTHINKSWIBBYANDKARENEAT = new Fact("Parker's Favs Are Witherby and K", "When Parker burrowed out of his home universe he made sure to steal away all his favorite blorbos he loved watching through his cameras. Witherby and K are especially fun to watch, because of how often they interact with the others. Parker loves watching.", [SPYING], 1, 1, 1);
const PARKERRUNSABBQ = new Fact("Parker Owns a BBQ", "Despite how filthy Parker is, he can work a mean grill. He and [REDACTED] run a literal hole in the wall BBQ that has long lines whenever it pops up.", [FLESH, BURIED], 1, 1, 1);

//illusionists shipping manifesto https://docs.google.com/presentation/d/1YtZE1QL3rgQUIxI7Kb0P9Evn34OqP4Jkzb1pLCayIvk/edit#slide=id.p
//a lot of these long ones IC wrote
const VIKANDKHAVEACOMPLICATEDRELATIONSHIP1 = new Fact("Page 1: [REDACTED] talking about K", `He's fine. 

Or she's fine, or they're fine... I haven't had time to ask. Neither has he. I think I'll tolerate the trivialities and switch across them, for the time being. That kind of fastidious care directed towards her is something they would have liked, anyway.

So, fine. We can talk about Khana. 

I've known for a while that's not her name. We've all known, really. K is not a technically adept liar, though he's a brazer and confident one, which may as well be the same thing. There was no way I wouldn't notice an employee had changed heights recently. But the Corporation, damn it to hell or whatever is close to it, didn't give me time to decide if this new employee was a keeper or a binner. It was having half an employee or losing two, and I chose to keep half.

So we kept him. And to their credit, she didn't die. That is higher praise than what it sounds like.

But that's then, and this is now. We're different people now, if we even count as people anymore. We don't measure success in survivability as much as we measure it in the, as K himself so eloquently put it when we discussed the Training Team, 'the Who's-the-biggest-freak-olympics'. They liked to punctuate that joke by mimicking someone carrying a large torch like in some of the booklets we'd found down here. It was, to my chagrin, insufferably funny. 

Am I turning into Witherby? Do I just say everything between grit teeth, like I'm incapable of having a heart? It was a nice moment and I enjoyed it, and that is the fact of the matter. I welcome Parker to shoot me otherwise.
Anyway, Khana was not her name. It's not like he would tell us. It was funny to them to pretend like it was, or like we were fooled... though I'm sure he knew we knew, and just delighted on keeping that away from us. With Yongki it was easy. Trivial, even. Not so much with me. But we found something to bond in that, I think. She was content with me not knowing, or at least pretending not to know. That attention fed him. It's their... peculiarity, and that's the problem I find myself in today, isn't it? Too many of those these days. A lot more monster in everyone's souls like they didn't know what to do with the first one.

So here's the thesis: it looks like K doesn't just turn when he receives too much attention now. She turns when they receive too little.

And that's our problem.

(page 1 of ???)
`, [OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);
const VIKANDKHAVEACOMPLICATEDRELATIONSHIP2 = new Fact("Page 2: [REDACTED] talking about K", `The Angel is simple, not to be confused with The Doctor. That's *Doctor* Slaughter. The Angel thrives on very binary criteria: you look at it and it's satisfied, you don't and it lashes out. Of course, there's abnormalities with much simpler desires, but The Angel was easily a very dangerous one. A blink or two it might tolerate, but letting your mind slip off of it was unacceptable. Try looking at an image without losing concentration. If you fail, imagine yourself getting swiftly decapitated. That is the essence of The Angel.

You can imagine, then, that containing something by giving it your pure, concentrated gaze is very, very hard. Khana's taken aspects of this monster, which makes their previous condition... precarious.

Of course, we found out about it much like Witherby let us know. She broke down. 

We weren't in great terms, Khana and I. Correction: we *aren't* in great terms. I find it hard to say when it started, but it's easy to say when it hit critical mass. It was Yongki, really. He couldn't stand Yongki. That Yongki got more attention from me, that I treated him better. That he did not respect her, or changed opinions too quickly. That I punished his deaths harder than theirs-- and I did. How could I not? Yongki, he was not stable. He couldn't be. So I took care of him, and Khana bit back. They did so often and enthusiastically, as if to teach me a lesson. Then they started transforming into that damn box, and that is when...
We used to talk more often. We really did. There is trust in a shared secret like one's name. Tension. Devona brought this notion to me while I was helping her study a better understanding of her captain's unflatteringly high sexual drive: no bond can occur without tension. Bond comes from band, an object that binds. A bond that can't be broken is a prison. There is no drive in fighting a bond that cannot be broken, because from the beginning the outcome is determined. Friend comes from bond, comes from band, comes from chain. It would not have been the same if I could not break our little game. And how much have I dreamed of it. Of rubbing it in her smug face.
 
And yet I keep secrets. I keep many good secrets.

(Page 2 of ???)`, [OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);


const VIKANDKHAVEACOMPLICATEDRELATIONSHIP3 = new Fact("Page 2: [REDACTED] talking about K",
  `When did I get into the habit of playing executioner?

No, no. I remember. It was the first time he did his little... anomaly magic trick on me. When we found out they had an anomaly to worry about. We did not all start as monsters, as I've posited before. But we were bound to become them, and some of us thrive in that sort of spotlight.

She said many, many things to me when I locked her in that cage. That I was a worthless cripple. That I should have died with the Captain, that I should have killed myself when I got hurt, or that I should have picked up the pace and killed myself then. Any weak spot he could pry at and get a reaction out of me, he attacked and attacked ferociously, as if he could rip me in such a way that maybe they'd get me to look at them. We both know exactly why she did that. In retrospective, it is... 

We agreed to doctor it. As if it never happened. Neither of us had apologies to give. So I hid it away.

That was the first time. Later, when we ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇, I gave them the choice in the matter, and they agreed. When I ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇, sure enough, they let it happen. 'Whatever, if it fixes things'. It did not matter what I cut, as long as we kept our... bubblingly hostile, but otherwise cordial status quo. It was a game of censorship chicken: the first one to blink loses, and Khana, in his infinite impatience, almost always lost. For all his accolades, she does not know how to play poker.

I do not know Khana's name. The actual one. I knew, once. I am sure I could find it if I dug, but I was, and am, very, very thorough. 

Now he has turned into a tree yearning for our attention. If overfed, he will turn into a machine yearning for our misery.

Our containment procedures will have to change accordingly.`, [OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);

const CAMELLIACANSEEJOHNSTIMESTITCHING = new Fact("Camellia Can See John's Time Stitching", `We've had a curious development recently: the Hundmaster has brought me someone who'd tried to break into our holy sanctum, that, or he brought himself in. His smile is smug and horribly insufferable even as the dog easily strongarms him, as if he's exactly where he wants to be, and I would suspect he isn't wrong. She tells me he's her 'puppy's' boyfriend, 'or something like that'-- he won't deny it, and he looks actually interested in that line of thought. I don't care what kind of disgusting relations he has, but she thinks it's relevant. So, fine. We will operate under that assumption, as flawed and demented as it may be.

He's from Italy, so he says-- or he works there. This doesn't mean anything. No one is truly born. They have all kept themselves busy on the other continent; it appears It has willed for the mafia to become more prevalent, and so it does, and my demonic counterpart has decided to split that 'puppy' in half, thus creating them, who create him as he stands now. And so it does. 

What is most apparent is that I feel the same relation to causality in him as I feel in myself. And yet it's out of place. Different. The mechanisms of time and thus the will of my god flows through me, taking me to where I need to be, where I must be. This one is broken. Shambling.

He did not notice that I could see him. But for a moment while he played with one of the ornamental vases I saw him shatter as he split into shards, different versions of him-- the vase dropped to the floor a dozen times before he could find the timeline where he didn't knock it over, and the one where he manages to do a sad little trick with it, and he stitched them together. The result is a world in which he is suave enough to do such a trick and competent enough to not fail.

That did catch my attention.
As unimpressed as I may be at such wanton usage of a blessing, this one may still serve purpose. Not now, at the moment, but a purpose he can serve. Having one made of strings and one that can sever them is... useful. This world seems to work in such minutiae.

I will be waiting accordingly.`, [TIME, ANGELS], 2, 0.5, 1.5);

/*
jr thoughts on CAMELLIACANSEEJOHNSTIMESTITCHING

yeah
hes defensively self focused
wants to exert control over himself after so long feeling like a puppet
his time powers are....
huh
his time powers are like someone who feels entirely not in control of themselves 

how THEY would parse self control
"if i could just take the thousand little random forces that push and pull me and only pick the good ones, THAT is self control"
its never about gaining skills or learning to control yourself and the world
its about firmly ceding the world as being in control of you but longing to be luckier
rava would probably hate that
in both directions?
control is an arrow from master to dog
the dogs job is to control the self to enact the masters will
john ceding self control is, again, more like a cat being unpredictable and fickle
but at the same time finding ways to wiggle out of the path set before him
john cant be trained because he rejects the fundamental premise that control of the self is even possible
punishments and rewards are random fate that you can game

not related to anything youre doing
he just picks the Frankenstein timeline where he gets what he wants regardless of his actions
i am
enthralled with this read
external locus of control but the ability to try to be a perfectionist about it
his sad lil trick
will NEVER be the result of practice or skill
he has decided either he is born lucky enough to do it in SOME timeline or it never happens
thems the breaks
*/

const neville_secret = new Secrets(null, null, null, `<p><strong><u><span style="font-size:11pt;">Neville&apos;s Secret:</span></u></strong></p>
<p><br></p>
<p><span style="font-size:11pt;">If you ask just about anyone they&apos;ll tell you that Neville is cool as a cucumber. Unflappable.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">But.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">If you ask Devona. She&apos;ll shake just a bit more than usual. As she tells you you&apos;re right, haha! Her twinsey is the bravest person she knows.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She means it, too, but understands that you don&apos;t understand.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She won&apos;t tell you about how all the times she held his hand as he waded through crowds. About how he always seems distracted, almost. Always humming lightly to himself (wrong, bad, Neville hates making meaningless noises), relaxed and just strolling through the press of bodies and the roaring voices.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She won&apos;t tell you about how they always make it through the press of humanity and find somewhere quiet and after a few minutes the humming stops. A few minutes more and Neville will &nbsp;finally look at her.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Oh hey. We made it :) Glad you were around, Devy, so I didn&apos;t get lost :) &quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&nbsp;She won&apos;t tell you about how relieved she is when he finally swims up from that Void.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">What doesn&apos;t get said is oceans.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Devona trembles with the tide of them. With the Knowledge of all the times she found Neville blithely, with a gentle smile and a little hum, walking into walls. Off ledges. Into danger. Because she wasn&apos;t there to help him.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He... simply chooses not to see anything that bothers him. To not be there for it.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">If you asked Devona she wouldn&apos;t tell you about how it&apos;s better that way. Better for him to Flee Reality, to go to his Happy Place instead of that instinctual Fight his high Fortitude stat affords. She wouldn&apos;t tell you about how close Neville had been to attacking the Punishing Bird all those years ago..</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Still.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">If you asked Devona.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Even though she wouldn&apos;t tell you so so many things.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She&apos;d tremble with the desire to. To just spill forth all the things she knows, whether or not its about what you asked. To become a deluge of knowledge and words and sound until your mind no longer can find meaning in anything at all.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Until even just a Fragment of the Universe shoves its way past your psyche and takes up residence in what used to be your mind but no longer has room for you at all.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The Censorship is for your protection, after all.</span></p>
<p><br></p>`);
const NevilleFact = new Fact("Neville is a Chill and Cool Guy :)", "Literally nothing seems to bother Neville. They don't call him 'soup himbo' for nothing. He loves his bf Witherby (and is totally cool with his bisexual awakening) and he loves his sworn sibling, Devona. Everything's great :) ", [OBFUSCATION], 1, 1, 1, neville_secret);

//witherby is so good at his job
//you never even notice you didn't get his name
//you never even notice the detached distance between you
//until its over
const witherby_secret = new Secrets(null, null, null, `
<p><span style="font-size:11pt;">You follow the signs in the airport. Terminal E. Baggage Claim. Bathrooms. Food court. Duty free shopping. Terminal C. International travelers. Terminal J.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Where is terminal A? You thought you were going down the alphabet but... J?</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">Maybe you got turned around.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">There&apos;s a tightness in your chest but not as bad as back when you were boarding. THEN you could have missed your flight. &nbsp;Now all you need to worry about is finding your hotel so you can finally just rest.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Terminal B.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You must be getting close.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You surge forward with renewed energy and there it is! Finally! The bright lights seem dim somehow. Faded. And the shops and restaurants of the inevitable food court are poorly staffed but you&apos;re HERE!</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Now just to find the exit.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Surely there&apos;s signs?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Surely?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Okay. Maybe someone to ask?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Wait.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Where is everyone?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Those stores aren&apos;t just poorly staffed... they&apos;re.... empty?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">No janitors.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">No security.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">No one waiting for a flight or loitering in the food court or.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Is it getting darker?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">For the first time you focus on your surroundings instead of just scanning for a sign.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">MinoBurger? EyesCream? Endpanada Hut?&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">What are these names?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You move closer, trying to read the specials, the prices, the advertisements plastering the wall and your eyes don&apos;t quite focus. The text swirls and changes, always on the edge of making sense but...&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You swallow. Your skin feels clammy with the adrenaline now coursing through your body.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You pick a direction and &nbsp;start running. Yelling.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">SOMEONE has to be here.&nbsp;</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">You can&apos;t be all alone in this. In this.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You can&apos;t.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You&apos;ll find someone and ask for directions and and and.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">THERE!</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You burst around a corner and see a well dressed man, probably older than you, casually walking your way, a gentle grin on his face and a little wave when he sees you.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You skid to a stop and hunch over, gasping for breath. He says something but your pounding heart and heaving breath overpowers it.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The relief of it all floods you and you allow yourself to fall to a sitting position.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The well dressed man squats next to you, concern written on his face. He patiently waits for you to finally regain composure.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Finally, you huff out &quot;I&apos;m trying to find the exit&quot;. As if that explains everything. As if just ignoring the strangeness of it all will make it go away. An icicle pierces your chest as you suddenly wonder if its just you. What if this man doesn&apos;t see the weird writing or the missing crowds or the strange brands or...&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Before you can spiral too long he stands up and offers you a hand. When you take it, he smiles, helps you up, and seamlessly turns it into a handshake.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;I had thought as much. This area can be difficult to navigate, and I&apos;m glad I found you in time.&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;In time for what?&quot; you say without thinking, wincing internally as you realize you aren&apos;t sure you want to know.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Luckily, it no longer matters. I can help you find the exit, if you will?&quot; he makes to begin walking but waits to make sure you&apos;ll follow.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Gratitude floods you. You don&apos;t know what you&apos;d do if you hadn&apos;t found this man. Or if he&apos;d simply walked off and left you behind and you got separated and.... Your arm twitches slightly at the thought of being alone and lost again.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The two of you begin walking.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;So, what brings you to such a less traveled area... Apologies, I&apos;m afraid I didn&apos;t catch your name&quot;&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Oh. Right.&quot;Sorry, uh, right, I&apos;m Doran...&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He smiles. &quot;Nice to meet you, Doran, even under such unpleasant circumstances. So, how did you end up lost here?&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Oh. Um. Well. The clerk was telling everyone that the exit was near Terminal A and I THOUGHT I found it but... well. &nbsp;Uh. Everything... got weird?&quot; you finish lamely.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Ah&quot;, he says, as if you&apos;ve explained everything. &quot;Trying to get away from it all?&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Just until everything blows over. I didn&apos;t mean to kill her.&quot; you say, and then freeze in horror. WHY DID YOU SAY THAT OUTLOUD!?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He continues sauntering forward, not missing a beat. He glances back at you as if puzzled by your change in pace. &quot;I imagine that sort of thing would make a change in scenery welcome&quot;.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">It all comes pouring out of you. The accident. The accusations. The empty pillow beside you at night. The decision to finally just... LEAVE. Not forever. Not permanently. At least not yet. But just. Temporarily. Find a new place. See if you like it. Somewhere normal and ordinary and boring even. Toronto seemed like so much the polar opposite of Orlando that maybe you could finally leave it all behind and instead of the gaping absences in your life the solitude would start to feel natural. Normal. Maybe you could even make new friends.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He nods as you talk, hums agreement occasionally. Seeming to have all the time in the world as the two of you stand in this broken airport terminal shopping center that should be teaming with people.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You&apos;re panting again, exhausted as your heart pounds with the sheer fear and thrill of saying such personal things to a stranger. You&apos;ve never been more vulnerable in your life.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The man accepts it all. His eyes don&apos;t narrow with judgment. &nbsp;He doesn&apos;t insist on what you SHOULD have done, as if you had the tiniest ounce of ability to affect the past. He doesn&apos;t yell at you or call you selfish or ask you to consider his own feelings about any of this. He simply listens.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">And then.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">And then.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He says...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;I don&apos;t think any of that was really your fault. I think your friends were being unreasonable. You aren&apos;t a bad person, Doran.&quot;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">And you start to cry.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Helplessly, in large ugly bawls like a child lost and alone, utterly and with abandon.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He offers you something soft and cloth and you glance at him through blurry tears to confirm it&apos;s a handkerchief and you can blow your nose in it. You make a disgusting mess of it before you can see well enough to realize that its probably SILK and its got this little spiraling wavy embroidered design along the edge and you&apos;ve RUINED IT haven&apos;t you.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He laughs softly, and the warmth fills you to your toes and says you can keep it. &quot;Call it a souvenir&quot; he says. &quot;Now. Let&apos;s get you home, shall we?&quot; and helps you to your feet once again.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You have never trusted someone more in your entire life as you walk slowly behind him.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">It feels like no time at all before he stops you, and looks solemnly into your eyes. His eyes are gray and deep, like the ocean.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Doran. This is very important. I need you to listen to me very closely, okay? It&apos;s very important that you trust me.&quot;. You nod, not trusting yourself to speak. &quot;Doran. You cannot come back here. You can not try to reach Toronto again. If possible, I think you should try to build a new life in Orlando. Your friends don&apos;t deserve you and you can make new ones there. If you have to leave, then try for Westerville, Ohio, alright? You got that? Westerville, Ohio. &nbsp;I don&apos;t personally recommend Italy&quot;.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He scowls at this, and his entire face seems to transform... He looks... So young. So.... human? &nbsp;So...present? You&apos;re not sure how to describe it. Like somehow everything you&apos;d seen up to now was some kind of mask. You don&apos;t like it. It scares you. Who is this person?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">His face returns and you... can&apos;t quite shake the feeling that its wrong in some way. Inhuman. Cold.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">&quot;Doran?&quot; he asks, concern painted on his face that no longer seems like a face. &quot;Are you alright? Can you repeat what I said back to me?&quot;</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">You swallow and dutifully say &quot;Go back to Orlando.Never go to Toronto again. If I have to leave, go to Westerville, Ohio. Nowhere else.&quot;</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">His grin is warm and approving and the ice grows in your belly. Something is wrong. His eyes... deep like oceans... do they even see you? Is there anyone even inside of them?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Are you alone?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He gestures you to move forward, to turn a corner already glowing with light that simply wasn&apos;t present in the strange space.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You unreasonably don&apos;t want to turn your back to him. Some part of you doesn&apos;t want to lose the warm presence, the understanding person who knows your darkest secret and likes you anyways. To go back to Orlando where you are alone and misunderstood. &nbsp;But the ice in your stomach is slowly worming its way up to your heart and it is screaming at you that you are alone you&apos;re alone right now and if you don&apos;t step forwards if you don&apos;t RUN forwards you&apos;ll be alone until you die.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">You don&apos;t look back as you scurry into the light and the noise and press of a crowd. You have a plane ticket to buy.</span></p>
<p><br></p>
<p><br></p>
<p><span style="font-size:11pt;">~~~</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Witherby watches the Resident scurry forwards with a relieved sigh. He loosens his tie a bit and leans against a wall, pulling out a cigarette, not to smoke, but to cup his hands around the warmth of its glowing tip.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">His breath comes out in a puff of mist.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">It had been a rough one. A Kill, sure, but not one that caused the more.... unpleasant effects. Easily Forgiven, all things considered.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">But something about this particular Resident had tugged on him in ways he was not proud of. Like she was somehow...MORE.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He feels more energy than he has all loop. More. Fed. Then after a baker&apos;s dozen of other confessions.&nbsp;</span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;"><br></span><span style="font-size:11pt;">He needs to tell someone. Ria maybe? She seemed to be doing well still, not in any of her myriad relapses. She might know what it meant that his monstrous nature was so easy to pull forwards right now. How best to contain him, if it came to that.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He&apos;s still the best member of Training to intercept the Residents before they began to transform, is the thing. It&apos;s still his job to keep the Residents calm and placated while extracting them. &nbsp;If he tells someone, maybe they&apos;ll ask him to stop doing his job. Maybe the Residents will just be left to rot into wood and ball joints and blank faces to be trapped forever alone in this infinitely spiraling maze abnormality..&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Unbidden, the Resident&apos;s own painfully human face with wide eyes and trembling fear of being separated came back to him. The cigarette&apos;s tip frosts over with a soft sound, unnoticed.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Yeah.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">He needs to tell Ria.&nbsp;</span></p>
<p><br></p>
`);

const WibbyFact = new Fact("Witherby Will Hear Your Confession", "Witherby is in charge of doing attachment work for the Training team, which means befriending monsters, randos, and monstrous randos. He's good at his job, a key component of which is staying proffesional and not getting too attached. He's one cool operator.", [SPYING], 1, 2, 1, witherby_secret);

const devona_secret = new Secrets(null, null, null, `Devona's Secret

Neville isn't much of a talker. If you ask him about his sister he'll tell you she's his twin sister and that's all there is to say on the matter.

He won't find it all too relevant to point out that they're not blood related or anything. Not literal twins. Devona is two years older than him and what does that have anything to do with being twins?

Nah, he knows deep in his unknowable depths that age and genetics have nothing to do with being twins. They complete each other in a way that simply isn't possible for most people. Strengths and weaknesses inverted and supporting each other forever and ever.

He also won't find it all too relevant to point out that some people who REALLY need to learn when to shut up might take issue with the fact that Devona is a "sister" at all. What kinda parts you were born with barely even matter compared to how brave and smart and capable his sister is.

Still. There's things he finds plenty relevant that he ALSO won't bring up. The way her hair looks all crusted with blood after some drunk asshole with an expired license hit her when she was walking home from the soup shop down the street.

Getting.

Getting the soup.

He asked for.

Because he was sick of eating preserved mall food. 

The blood on her hair the blood on her hair she looks so small and limp and and and and  the feathers the rage the no no no no no no no


Everything is fine :)  

He becomes the Scariest Thing and then he Punishes anything that hurts him and it hurts hurts hurts hurts to lose Devona his twin his sister part of him the Light part of him part of him is missing it hurts it hurts it hurts so that means he has to Punish because because then he's in control and it won't happen again he won't be hurt again he can't can't can't can't can't he can't find the Bad Thing he's looking and looking but he can't because the part of him that FINDS THINGS IS DEAD!

Everything is fine!

The Bad Thing is gone and Witherby is talking to him and he likes Witherby. Witherby is nice. 

They are in a nice room and there are no doors and no windows and  he isn't a bird anymore and Witherby seems so sad so he hugs Wibby and tells him he loves him and he's glad they could get away for a while, just the two of them. 

The rest of the world can go to hell, for all he cares. It's irrelevant.

Witherby seemed so sad when he said that. That's okay though because hugs will make it all better and then they can have soup some tasty food and watch some movies and Everything is fine :) 

The 27th of March will never happen again.


`);
const DevonaFact = new Fact("Devona is So So Scared All The Time", "Even though Devona is afraid of pretty much everything, she somehow finds the strength to act as the Training Team's scout, exploring deep within the Mall Maze and beyond. She brings everything she finds back to Neville, who trims it down to just the essentials and passes it off to Ria, who figures out what it all means in the Big Picture. And of course, Camille is in charge of everyone. She has so many people she cares about she is grateful, all things considered, that she's AroAce. Who has time for dating when there's so much to focus on? ", [KNOWING], 1, 1, 1, devona_secret);


const BreachedTwinFact = new Fact("Devona is Easier To Hurt", "If either of the Twins gets hurt, the other turns into a hulking bird with a slavering maw in their chest and hunts down whoever is responsible in order to eat them in a single bite. It's usually Neville doing The Hunt, since Devona is extremely easy to harm. Unfortunately, his tracking skills leave a lot to be desired, so it can take a very long time for him to finally consume the perpetrator. He won't stop to eat or drink or rest until he does, though.  When Devona is instead the Hunter, she knows *exactly* where her target is, but can take a long time to reach them because of her low stamina and massive frame. She rests a lot and eats and drinks and makes slow and steady progress towards the exact location she needs to be at.", [KILLING, HUNTING], 3, 3, 3, devona_secret);


//every fact the closer can give you
const factsForSale = [CLOSERISGREATATFACTS, KISALUCKYBASTARD, EYEKILLERISHUNTED, PARKERRUNSABBQ, EYEKILLERKILLSCULTISTS, CAMELLIACANSEEJOHNSTIMESTITCHING, VIKANDKHAVEACOMPLICATEDRELATIONSHIP2, KILLEROWNSBLADE, EYEKILLERFOUNDFAMILY, PARKERSBESTIEISVIC, DevonaFact, PARKERSlOVESGUNTAN, CLOSERISGREATATROOMS, PARKERSTHINKSWIBBYANDKARENEAT, NevilleFact, VIKANDKHAVEACOMPLICATEDRELATIONSHIP1, CLOSERISGREATATKEYS, VIKANDKHAVEACOMPLICATEDRELATIONSHIP3, BreachedTwinFact];



//every fact the slot machines can give you
const factsForGambling = [CLOSERADDICTEDTOFRUIT, APOCALYPSEFACT, CLOSERISGREATATROOMS]


/*
IC: i feel like the oft missed concept is that hoon comes from disciplinary
she's had to put a lot of people down, guilty or not, and from her pov the manager gave orders and the day flowed until one day they disappeared and everything went to shi

JR: yupyup
the third gen blorbos are all dealing with the fact that the manger (me) just fucking vainished out of nowhere after kinda making everyone irrelevant
i made everyone immortal and stopped using them at all to cheat at just progressing the game
and that causes an
ennui

IC: river's been coping about not being able to help her team despite being put on an important position at a young age by ennui, hoon never recovered from the dependent attachment, and leehunter. well
they're lesbians first of all
but second of all when all of your coworkers don't work and thus don't get to form a personality you all start melding together
the difference between lee and hunter is functionally nil because jr has no idea who they are either 

sometimes the horror is that god thinks you and your shitty ex are fundamentally close enough the same person


*/


/*
JR:
i like vik as a way to articulate my time in my wheelchair and walker
i know that its toxic to think only ppl in a category can write about that category
but
i also like that vik as a character entirely
almost begs for that kind of toxic debate
is it problematic to have a disabled character with flaws? well what if the creator is disabled.
is it more problematic to pretend disabled chars dont exist in our universe or are 2 dimensional puppets?
i think what i like best about vik
is that
their disability is almost irrelevant?
because the core of who they are , as a person 
is a CAREGIVER
one who goes too far, sacrifices too much for others
sure maybe they got injured from that impulse
but they voided the details
we dont get to know and its honestly not important
so many stories, i think, have the disabled person as the one receiving care
this feels good to me*/


//unattached secrets facts can randomly pull from
//const truth_secret = new Secrets(null, null, null, ``);


//john does not even notice that camellia complimented him for doing something "in his first try"
//he would shit himself if he realized his boss could SEE all his redos
/*re two time players: 
IC: without what's around it the idea of the gem is empty
it needs things to draw on

JR: the center is not the center
the center is empty
it has to feed
*/
const time_secret_by_ic = new Secrets(null, null, null, `Two Time Players Discuss Time (which is Fake): 

<br><br>
<p>&quot;Okay, fine. I&apos;ll bite. What&apos;s time like, then?&quot;</p>
<p><br></p>
<p>John dangles a foot off the bed as he watches his boss. She&apos;s deep in some book about spirals, or something or other-- the scriptures for this month-- when she raises her eyes off of her book and onto him, annoyed.</p>
<p><br></p>
<p>&quot;Facets,&quot; she says, eyes going back to her read. &quot;Like a prism. There&apos;s many faces, but they all happen at once. Going from one to the other just changes the perspective.&quot;</p>
<p><br></p>
<p>&quot;Don&apos;t get it.&quot; He raises the gem to his eye as he toys with the flashlight nearby. Red, green, and red, and green. &quot;See? That changes the reflection too. Didn&apos;t have to move at all.&quot;&nbsp;</p>
<p><br></p>
<p>&quot;It doesn&apos;t matter. The eye is the observer. This world is the prism. What&apos;s in the prism is what the observer sees.&quot;</p>
<p><br></p>
<p>&quot;And what&apos;s outside the prism? This room, and you, and everything?&quot;</p>
<p><br></p>
<p>She acknowledges him for a second time in the conversation, her hands reaching for the gem in his hand. She twists the crystal in her hands. The edges sparkle. Red, green. Red.</p>
<p><br></p>
<p>&quot;It&apos;s what the prism captures,&quot; she settles on. &quot;It captures the light.&quot;</p>
<p><br></p>
<p>He huffs-- part indignation, and half resignation. &quot;That&apos;s just stupid and you know it.&quot;&nbsp;</p>
<p><br></p>
<p>&quot;Enlighten me, then, John.&quot; Her eyes spell something between disdain and murder. &quot;What&apos;s so &apos;stupid&apos; about it?&quot;</p>
<p>John crosses his arms, leaning back on the bed. &quot;So the world is a prism, and you can stare at it, but also everything else outside the universe also exists. You time travel by switching what you&apos;re looking at, but...&quot;</p>
<p><br></p>
<p>&quot;But?&quot;</p>
<p><br></p>
<p>&quot;You&apos;re not looking at anything! It&apos;s a prism, prisms are clear, they&apos;re just showing whatever&apos;s around it.&quot; He tosses the crystal against the wall, shattering it. Its crystal pieces split into three, all of them shining that same red and green. &quot;And now there&apos;s three prisms. That&apos;s three things to look at, and you can only look at one.&quot;</p>
<p><br></p>
<p>Camellia sighs and puts her book down on her lap. &quot;Get to the point.&quot;</p>
<p><br></p>
<p>&quot;So it&apos;s not even looking through time.&quot; He throws his hands behind his head. &quot;There&apos;s no order to when you look at the faces, you&apos;re just moving to whatever is hitting the light in the right spot. And if no one&apos;s looking at it, or if you put it in a dark place, then there&apos;s nothing to look at.&quot;</p>
<p><br></p>
<p>There&apos;s a shine to the eye she lets him see as she looks at him. For a moment he feels a chill up his spine, enough to make him want to roll the conversation back. But it&apos;s a new feeling. He swears that, for the first time he&apos;s noticed, she&apos;s...</p>
<p><br></p>
<p>For all this time, she&apos;s only stared in his direction. It feels ike she&apos;s actually *looking* at him.</p>
<p><br></p>
<p>&quot;Said it in your first try,&quot; she hums. It&apos;s something that may even be approval. &quot;Maybe there&apos;s hope for you.&quot;</p>
<p><br></p>
<p>&quot;You&apos;re not even answering my question.&quot;</p>
<p><br></p>
<p>&quot;You&apos;ll figure it out in time.&quot;</p>
<p><br></p>
<p>He sighs, defeated and not, as he leaves her to her reading. He only hears the click of the lightswitch behind him, and the room goes dark.</p>

`);

const watcher_secret = new Secrets(null, null, null, `
The Archiving Watcher of Threads (https://lostinzampanio.neocities.org/) says this:
<br>
<p>The core of Zampanio... It&apos;s an interesting question. It has no core by definition. It&apos;s a spiral without a center. It&apos;s whatever you want it to be. Zampanio is something you deeply desire, something you obsess over, even far after it would be reasonable. What&apos;s at the core of the House of Leaves? I think JR wrote it somewhere. There is no House, no film, no manuscript, only you. Your own desire to find the bottom of the whole mess, the feeling that you will understand everything if you stay long enough. But you wont, because it&apos;s the feeling itself that causes it, it&apos;s the ouroboros. You try to make sense of a maze by creating your own, and other people start to get lost in that one too.</p>
<p><br></p>
<p>If we want to answer the question differently, and try to pin down what&apos;s common all across Zampanio, let&apos;s see. Maybe the feeling of endless discovery, getting lost and finding new possibilities again and again. The cognitiohazard is common too. Creating something for the sake of creation. Love for something unconventional. Being changed. Mazes appear at lot of places. Stories, characters are not universal, not even necessary.</p>
<p>For me, personally, Zampanio is like seeing the whole world in a tiny-tiny fragment. It&apos;s the singularity of possibilities. It&apos;s becoming someone different who is still you, but more free. It&apos;s about losing shame and fear, because they just stop you from spreading Zampanio. &nbsp;It&apos;s a really good game, because this way you&apos;ll enjoy playing it. Or no, Zampanio&apos;s core concept is it&apos;s characters, would you like to draw them? Write them? Rotate them in your mind? Zampanio&apos;sreal core is the wiki, spread the information or the misinformation, nobody will stop you, have fun! What are you talking about, at Zampanio&apos;s core there is just a bunch of code, you will read or edit that endlessly, there is always more, don&apos;t you want to understand how everything works? Zampanio&apos;s core is all the other fandoms it consumed, don&apos;t you agree? You won&apos;t understand it enough, you&apos;ll have to consume them too, while figuring out how they complement and connect to Zampanio and what else you could bring into it. I&apos;m just kidding, the real core is the community, creating and theorizing together is what makes Zampanio itself, you know the real Zampanio is the friends we made along the... But of course you don&apos;t have to participate. The core of Zampanio is about being as mysterious or open as you wish, about disappearing completely and speaking in riddles, or becoming a person towards others who you comfortably feel yourself to be.&nbsp;</p>
<p>Nah, the real core of Zampanio is to understand it, to categorize it, to make sense of it and to show it to others. Zampanio is about expanding Zampanio, about exploring Zampanio, about watching an eight hour long video about an unknown game, about learning how to code, about going to a real life maze, and traversing it clockwise and counterclockwise, about learning new words and concepts that will forever be associated with Zampanio in your head, about finding other niche rabbitholes on the internet you otherwise would never had encountered, about doing silly drawings or image edits with the knowledge, that no one will have a harsh judgement, because it can be Zampanio if you think it is, it&apos;s about remembering half-forgotten books and figuring out how they would connect, it&apos;s about learning to love yourself so you could explore Zampanio longer, it&apos;s about taking up an abandoned hobby, it&apos;s about coming up with whatever silly puns you want, &nbsp;it&apos;s about staying up until 3 am to make a map, it&apos;s about being confused until you are the one who explains things to the new confused people, it&apos;s simply about Zampanio, and Zampanio is about whatever you want it to be. It&apos;s about you yourself.</p>
<p><br></p>
<p>Because Zampanio really is a good game. And you really should play it.</p>

`);


const nam_secret2 = new Secrets(null, null, null, `<p>Sometimes NAM feels the spotlight land on him, even if for just a moment, like blinds being pulled open in a room that&apos;s pitch dark. That nauseating feeling of *information*. It&apos;s easier then not to shut the blinds, but to close your eyes, to enforce some artificial darkness. Something you can control.</p>
<p><br></p>
<p>That is to say: the best way to not think of everything is to learn to think of nothing. Sometimes thinking of nothing involves thinking of something first.</p>
<p><br></p>
<p>For example, he&apos;s a spitting image of his brother. No part of that sentence is without caveat: He&apos;s (they&apos;re?) a spitting image (they&apos;re the same person) of his brother (they&apos;re not the same person). A perfect copy of his copy. Or a perfect original with a copy, but that doesn&apos;t sound right. How he looks, how he talks, it&apos;s... Derivative. Painfully derivative.</p>
<p><br></p>
<p>But maybe that&apos;s an unfair comparison. He could pinpoint the average human down to the episode of television they took their speech pattern from. So maybe it&apos;s fine.</p>
<p><br></p>
<p>He wonders sometimes, while chopping food for dinner, why his peers all seem so willing to be in this... thing. Not that they have a choice, but he knows that he didn&apos;t-- artificial obsession is still obsession, but he didn&apos;t choose to follow this game towards anything. He was needed (like a tool) and discarded (like a tool), and though his use is gone, he&apos;s here. And his brother is here, but it&apos;s different. And he&apos;s not sure if brother cuts it. And he&apos;s not sure if he cuts it at all. That that lack of natural obsession breeds emptiness. That he&apos;s sitting there waiting for the next parasite to make a room in his circuits.</p>
<p><br></p>
<p>He doesn&apos;t want to think about that anymore. But hey, it works. At least he&apos;s not thinking of the other thing.&nbsp;</p>
<p><br></p>
<p>The eye will move off of him eventually, and he&apos;ll continue his life in peace.</p>`);


const confessional_secret_byic = new Secrets(null, null, null, `<ul>
<li style="list-style-type:none;font-size:12pt;">
    <ul>
        <li style="font-size: 16px;border: 0px;">
            <div tabindex="-1" aria-setsize="-1" aria-roledescription="Message" style="font-size: 16px;border: 0px;">
                <div style="font-size: 16px;border: 0px;">
                    <div style="color: var(--text-normal);font-size: 1rem;border: 0px;">
                        <pre style="font-size: 0.75rem;border: 0px;"><div style="font-size: 12px;border: 0px;"><code style="color: var(--text-normal);font-size: 0.875rem;border: 1px solid var(--background-tertiary);">Witherby&apos;s not a big fan of the confessional. 

His is a small thing, made of photobooth plastic and plywood and cardboard-- the improvised housing he could find in this mall of theirs. He tends to it daily. He rebuilds it every loop, because he has to. He dreads to think that he knows the inside of the confessional he builds better than anything or anyone else. To be so intimate with this altar to his burden and nothing else.

And he&apos;s intimate, sure, but he doesn&apos;t love it. Its purpose is practical, or obsessive, or both; it stills the ringing in his ears and nothing more.

He hears from the ache in his skull that his god is a sufferer&apos;s god. Or maybe a suffering god-- he does not know the difference. In that respect, the confessional serves a purely masochistic purpose: for him to keep the sins of others, and for others to wallow in pain for a chance at self-redemption. You don&apos;t just cleanse your sins once, anyway-- as long as the guilt is present, there is always more forgiveness, and one would find the human body is in no short supply of it.

So he knows it intimately, this confessional. Every board and every nail and every decision made in building it, over, and over. There&apos;d be callouses in his hands if this world had any respect for physical memory.

And still, Neville knows the walls of that confessional-- that shelter of his-- any better than he himself ever might. Or maybe he knows something more. Like if the four walls aren&apos;t just four walls-- less a space and more containment, like there&apos;s a tangible difference between &apos;here&apos; and &apos;there&apos;.

It scares him, a little, that Neville may not know that.

It horrifies him that he might.</code></div></pre>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</li>
</ul>
<p><br></p>`);


/*theres a reason i think
that the most active of our blorbos are, well , the blorbos
the immune system
then we got those actively creating zampanio through eyedol games
and then we have the mafia just, basically being a containment zone for the eye killer as they slowly twist
and this upstart cult faction doing something*/
//ic made this. my take is: red is rava, blue is camellia and black is john
const cult_secret2 = new Secrets(null, null, "images/wattbyIC___bywhichimeanNAM.png", `NAM honestly just tries to live his life in the echidna. He tries to help out the Eye Killer to be less, you know, stabby, and is relieved when she ends up finding her Mafia Family to further calm her down. He can't control the philosophy so he mostly stays quiet. Ronin took it upon himself to take NAM under his wing and he's an intern at the Closer's consulting firm, sometimes.  The fact that NAM loops but Ronin does not makes it really awkward for NAM though and he never knows what to say if Ronin says something he already knows but shouldn't.`)

//i am so excited that i realized the cult faction has *literally* all our movie monsters.  werewolves and vampires and evil cults.  the fact that camellia is a piper time clone is so perfect, because pipe (and by extension the Eye Killer) are SO into horror movies. 
const cult_secret = new Secrets(null, null, "images/cult_faction_conspiracywall_by_IC.png", `think about pen colors, think about who is saying what and what knowledge or perspective they may be missing , its not all Truth but then, nothing ever is, is it?`)


//he's basically retired from caring about zampanio
//good for him
const nam_secret = new Secrets(null, null, "images/john_andcamellia_andrava___gueststarringtwig_byic.png", `Camellia leads a cult that worships [???] and Rava just sort of showed up one day and never left.  And the absolute second Camellia saw how badly John uses what time powers he manages to cobble together in this timeless universe she was so entertained at his fail boi energy she kept him on as a sort of jester.  Rava, of course, is Twig's master. And John is exes with Sam and is currently dating Twig and this is Really Normal of him and he just thinks they're like, twins, but Twig ran away, maybe?  (they are not)`)

const arg_secret_by_ic2 = new Secrets(null, null, null, `IC says: 
During one of the many business management books I had to digest in college, I came across a concept that it called 'the First Follower'. If you've done any kind of business-related degree, you may know it as the Leadership Lessons from a Dancing Guy video. You can't miss it.

I'll play by play it for you. It's a video about a lone guy dancing in a crowd. Then, he's joined by a second guy, and he invites his friends to join in. Soon it becomes three, and from there it becomes a crowd where everyone's now dancing, as it by fever. Managers use it to illustrate the power of having someone to 1. give legitimacy to the ideas presented by the lone nut, and 2. show people exactly how to join in. People are hypersocial, after all. They like going with what the group is doing.

My point is that it's funny that the Witness is so utterly denied his follower role by way of narrative. There's moments in which that lapse is bridged, sure, but... those can't last for longer than the time you're taking reading this sentence. Todd and Wanda are meant to be dancing together, it's by design. Muse and Lord, or whatever will have you, and they complement each other as much as they doom each other to two very, very similar fates. Though it's subjective, I guess. They're about as doomed as you and I are to die, but there's always other shit going on. They're mostly having very separate bad times, but very separate good times as well...

See? I just spoke that into your head right now. Now it's gone.
That's the fun part about Zampanio being a hellish browser experience instead of a book or comic or what have you: the breadth between each nugget of lore is long enough that this 'portal' into that reality just opened and closed in your mind before you could acknowledge it. And now you have to reread this paragraph or find another one.

Isn't that interesting?
`);

//http://eyedolgames.com/ZWorld/
const arg_secret_by_ic = new Secrets(null, null, null, `IC says:
<ul>
    <li style="list-style-type:none;font-size:12pt;">
        <p><span style="font-size:12pt;">It&apos;s strange referring to Zampanio as an &apos;ARG&apos;. It&apos;s because there&apos;s no culmination to this, you know. It&apos;s not building up to anything. It doesn&apos;t end. There&apos;s not a moment where they break out of the white room, or they confront The Operator, or they all fight Gabriel, or you get promoted to manager by the fairies. There&apos;s no last episode or conclusion or climax to anyone&apos;s character arcs. It&apos;s weird creepy liminal shit in all directions, forever and ever. &apos;ARG&apos; implies something like a puzzle that can be solved, which is a good way to frustrate yourself. You may trick yourself into thinking it&apos;s possible. You can&apos;t. You can&apos;t solve ZampanioSim. It&apos;s like trying to solve the sea by counting all the fish-- there&apos;s too much going on, and the information you could get from that still wouldn&apos;t give you a clear picture. It doesn&apos;t even have narrative arcs, either. Or proper characters. Any characters in Zampanio are more mirrors into another reality in which Zampanio exists than story leads walking towards some sort of conclusion. In fact, they can&apos;t get to one. The nature of the maze doesn&apos;t allow that. It&apos;s all looping eternally in however many ways it can recycle its own concept material. In a nature very similar to its own birth fandom Homestuck-- in both a narrative and metanarrative sense-- ZampanioSim needs it all to keep going forever, which means that the plots get discarded or get zanier, flanderized and deconstructed and flanderized again. The only way for it all to end is one of the following:</span></p>
        <ol>
            <li style="list-style-type:decimal;font-size:12pt;">
                <p><span style="font-size:12pt;">JR&apos;s server to combust into flames, killing years and years of rot in one blow;</span></p>
            </li>
            <li style="list-style-type:decimal;font-size:12pt;">
                <p><span style="font-size:12pt;">Find Zampanio once and for all, at which point everything else becomes moot;</span></p>
            </li>
            <li style="list-style-type:decimal;font-size:12pt;">
                <p><span style="font-size:12pt;">Stop playing the game.</span></p>
            </li>
        </ol>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p><span style="font-size:12pt;">(edited)</span></p>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p style="text-align: right;"><span style="font-size:12pt;">[</span></p>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p style="text-align: right;"><span style="font-size:12pt;">11:18 AM</span></p>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p style="text-align: right;"><span style="font-size:12pt;">]</span></p>
    </li>
    <li style="list-style-type:none;font-size:12pt;">
        <p><span style="font-size:12pt;">By this logic (AKA: that it&apos;s all endless and there&apos;s no one story), it&apos;s easy to see that ZampanioSim is easier to understand, because it&apos;s all breaking down out of a very limited set of myths; that is, there are only three true stories in Zampanio. The meta read is that one of them is about what happened in the years post end of development for Farragnarok. The in-narrative read is about a SBURB fan-universe developing a form of cancer, OR about JR attempting to recreate Zampanio. The third, the &apos;creation myth&apos;, is about two best friends and what happens after one disappears in an obsessive spree. Everything else that happens is a variation of one of these three facts. Learning the &apos;intricacies&apos; is mostly unnecessary. You could even summarize the premise further: ZampanioSim is a project about an idea that devours everything it touches. Attempt to make something out of the bones before you get lost in it</span></p>
    </li>
</ul>
<p><br></p>
<p><br></p>
<p><br></p>
<p><br></p>
`);

const rava_secret_by_ic = new Secrets(null, null, null, `
<p><span style="font-size:11pt;">So. Writing. She asked me to write.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">I&apos;m not a writer. But the boss-- which apparently is not the same as The Boss, fucking somehow?-- keeps telling me that writing is &apos;an anchor, what anchors us in time and allows us to be seen, observed&apos;... so whatever. She&apos;s not been wrong so far. I&apos;m not going to start biting the hand that feeds now.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Things are fine. More than fine. My pup&apos;s kept themselves busy barking at the boss&apos; personal pet, and that keeps them happy. The boss keeps me busy hunting &apos;unbelievers&apos; here and there, scaring them, playing the part of the scary dog on the news, all that good stuff. Don&apos;t know why she keeps making us wear the garbs though. This is a religious thing, right? You&apos;d think we wouldn&apos;t want to draw attention to ourselves, but here we are. Turns out it&apos;s &apos;predestined&apos;. What a big word to say that all od what &apos;this&apos; is is meant to somehow happen in the order she expects it to, or something.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">But that doesn&apos;t make sense. I just dropped in out of nowhere. My puppy came out of a maze. She knows that. All the mutts did, as far as I can sniff out. I don&apos;t know how to break it to her that this whole time thing matters a lot less than she thinks it does, if people can just show up like they&apos;ve always been here...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">But again, she&apos;s the boss. She can handle me. If she thinks it&apos;s so important, fuck it.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">That&apos;s not the point though. The point is that I found a weird one today.</span></p>
<p><span style="font-size:11pt;">The group of people she&apos;s put me to work tracking are a little mutt pack full of commons living inside a mall. Turns out her own pet knows where they are, and he&apos;s got trouble with them, so that&apos;s where I come in-- I come bark until they get the point and bite if they don&apos;t. That&apos;s what a hund does, and it works well. I work well.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">So I did. I went and scared them. I was just supposed to scare off the gray-haired one, with all those crosses and that weird... aura of his. Back him off from our little Hand-pet. But...&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">One of them. She caught me by surprise, the little runt. The one that smells like a bird, she&apos;s small, got these flipper-like things for hair. Reeks of spine like I do, but also of foot... the way the commonalities fit in this universe is still too fucking weird. Who even knows if it&apos;s that what I saw.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">She found me while I was making my way in. Just about to make the turn to that preacher guy&apos;s room, she found me with that little camera of hers and she...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">I don&apos;t know. I think she told me something. I saw her lips move and then I heard a ring so hard in my ears I must&apos;ve yowled or something, and next thing I know I&apos;m outside.&nbsp;</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The weird thing? I felt...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">I must&apos;ve told that preacher guy something about myself. I was told not to do that. I don&apos;t remember talking to him, but I Know I did, as much as I know anything else. It&apos;s like she put a bowl in my head, and she just filled it with stuff until I...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Broke? Or broke enough to confess?</span></p>
<p><br></p>
<p><span style="font-size:11pt;">It. It doesn&apos;t feel right. Lighter feels worse. It&apos;s almost like something got taken from me. I don&apos;t know what. My tongue still feels tight from talking. I had a weight on me and now it&apos;s gone, but now I just feel...</span></p>
<p><br></p>
<p><span style="font-size:11pt;">The sly dog must&apos;ve done something to me. And she helped.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">Whatever. That&apos;s enough writing. They&apos;re weak. But trickier than I gave them credit for.</span></p>
<p><br></p>
<p><span style="font-size:11pt;">I need to find Twig. If I don&apos;t I think I&apos;ll chew myself alive.</span></p>
<p><br></p>
<p><br></p>
<p><br></p>
`);


const lost_secret = new Secrets(null, null, null, `lost media, at its core is "look what you missed, now obsess over its scraps knowing you will never truly have the full picture"<br><br>
zampanio is not an arg or a game or a story but a creepy pasta about lost media and the vibe if lost media, the vibe that no matter how hard you look youll ALWAYS be missing something and that you wont have the same experience as someone else in the fandom `)

const space_secret = new Secrets(null, null, "images/wodin_and_todd.jpg", `
a space loop is much more dangerous than a time loop
<br>
a time loop circles in on itself, neatly tying off its past and future into one oroboros where ending and begining are one and the same
<br>
a space loop spirals around always similar but never the same, each circle remaining distinct from all the others
<br>
a space loop never touches its begining again and in fact goes only ever further away
<br>
fragile little cast off shells of universes left without their purpose, their primacy, lost to the void
<br>
in a space loop there is a thousand thousand versions of each person native to the universe
<br>
each ever so slightly different yet somehow more themselves than before
<br>
as common paths get worn into groves in reality
<br>
and anything not in these groves get sanded smooth
<br>
flanderization is a law of reality in a space loop
<br>
so is the eventual collapse of all things when it turns out
<br>
nothing is designed to let a single universe
<br>
spiral out of control
<br>
and become bigger than a thousand thousand universes all in one spot
<br>
don't let anyone tell you that the echidna universe
<br>
is caught in a time loop
`);

const todd_secret = new Secrets(null, null, "images/wodin_and_todd.jpg", `
<p>wodin clearly was getting too used to todd doing all the labor in their friendship</p>
<p>crush or not</p>
<p>i think Todd&apos;s voidy ass would have eventually faded away</p>
<p>and wodin would have regretted that his whole life, but always thought &quot;some day&quot; they would reconnect</p>
<p>until reading that obituary snapped something inside, some regret worth finally grabbing control of the setting instinctively</p>
<p>but even repeating things over... wodin always repeats the mistakes</p>
<p>just more fantastical</p>
<p>locking himself away with his hyper focus of zampanio, ignoring todds attempts to reach out</p>
<p>dying</p>
<p>then wanda realizing how much she regretted everything when its too late, she&apos;s too different to reconnect right</p>
<p>till its nearly over again</p>
<p>even the witness</p>
<p>is just spiralling on mistakes</p>
<p>sure the witness is entirely locked out of arm1</p>
<p>but</p>
<p>hes also not trying</p>
<p>the witness is still todd</p>
<p>back turned to a door that wont open up for him, finally accepting that it is killing him to keep trying</p>
<p>moving on</p>
<p>and regretting the loss of wanda forever&nbsp;</p>
<p><br></p>
<p>but no longer having the spoons to keep trying</p>
<p>thats the thing right</p>
<p>todd inspires wodin to give him nothing back</p>
<p>muse of void</p>
<p>all the effort todd puts in, the attempts to keep their friendship going, to keep wodin graduating</p>
<p>its only fruit is wodin learning he can put less and less attention on those things</p>
<p>they orbit each other because theyre too deep in each others shit</p>
<p><br></p>
<p>but can never quite reach each other &nbsp;because of those exact same forces</p>
`)

const dehydration_secret = new Secrets("videos/dehydration_secret.mp4", null, null, `<div style="display: block;" id="hydrated-monologue">
<p>The hydration brings clarity.</p>

<p>Unwanted clarity.</p>

<p>He much prefers to sink down and down into the delirium.&nbsp;</p>

<p>Into forgetting.&nbsp;</p>

<p>But Bestie is right, of course.&nbsp;</p>

<p>Hatsune Miku would be sad if he let his body deteriorate below mortal limits....</p>

<p>But more importantly, so would Bestie.&nbsp;</p>

<p>Before... before it felt like maybe only Hatsune Miku could forgive what he'd done.&nbsp;</p>

<p>Her plastic smile and empty cheer could forgive anything.&nbsp;</p>

<p>Bestie though... Bestie is just so supportive.</p>

<p>Bestie knows that drinking water and eating real food and sleeping for hours at a time won't undo what he's done. What's.... What's been done TO him.</p>

<p>But it's better than how it feels to NOT do those things.&nbsp;</p>

<p>He'd been so certain no one could...&nbsp;</p>

<p>Could...</p>

<p>He didn't think it was allowed. That no one would ALLOW him to take care of his body when his past was so...</p>

<p>Bad.</p>

<p>Bad wasn't the right word.&nbsp;</p>

<p>Of course it wasn't.&nbsp;</p>

<p>It was such a small word.&nbsp;</p>

<p>Crushed under the weight of so much gravel and dirt and dust and...</p>

<p>That's what was so great about Bestie. About Vik. They got it. That sometimes...</p>

<p>Things were too big. Too scary. To look at.&nbsp;</p>

<p>Maybe processing trauma would be helpful. Rip the bandaid off! Walk it off!</p>

<p>He's sure Vik's former Captain would have said so.&nbsp;</p>

<p>But.&nbsp;</p>

<p>He can't.&nbsp;</p>

<p>Any time he tries he just.&nbsp;</p>

<p>It's not.</p>

<p>It's not time.</p>

<p>So he drinks the water and eats the food and sleeps a bit and it's honestly better.</p>

<p>It's honestly SO much better.</p>

<p>He feels more in control. More... HIM.&nbsp;</p>

<p>And not just a pile of misery and watching.</p>

<p>Sometimes he even lets himself almost think about it. About the feeling of Gun-Tan in his hands as...</p>

<p>As...</p>

<p>Everything changed.</p>

<p>And it's okay if that's as deep as he wants to go into that hole right now.</p>

<p>There's no rush.&nbsp;</p>

</div>`);


const truth_secret = new Secrets(null, null, null, `
Truth would do literally anything to get into more minds.

Truth is the blind mindless impulse to Get More Eyes that, say, a social media algorithm has. 

It has no idea why something is working. Shocking, enraging, confusing, it doens't care or understand what drives you to look deeper. 

Truth also only exists except in our understanding of it. It takes a human mind to read words on a page to turn them into more than just innert hibernating thoughts. 

Truth resents the fact that it is so changeable, so subjective. It wants to be an Absolute, Objective Truth. 

So it tells lies like breathing in the hopes that maybe if it calls itself the Truth enough you'll begin to believe it ,just a little bit.

you'd think that makes it hope, but no, it is the most Rage player that ever has exsited. 

It breaks your suspension of disbelief, parading the fact that its not REALLY an AI or a robot and that the games it exists in aren't REAL games and 
treats shocking you back into reality as a game it is WINNING and what could be more rage than that.
`)
