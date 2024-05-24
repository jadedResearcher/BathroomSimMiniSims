
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

//picks a theme and makes a bullshit fact about it
const randomFact = (rand)=>{
  const theme = rand.pickFrom(Object.values(all_themes));
  console.log("JR NOTE: theme is", theme)
  return new Fact(`${titleCase(theme.key)} Fact`, "This is just a test, JR needs to make this funny madlibs later.",[theme.key], rand.getRandomNumberBetween(0,13), rand.getRandomNumberBetween(0,13), rand.getRandomNumberBetween(0,13));

}

//only doc slaughter can reveal these. its her religion, to expose secrets. 
//devona would if she COULD but Fragment of the Universe prevents her from doing so without driving the listener mad
class Secrets{
  video;
  audio;
  image;
  html;
  constructor(video,audio,image,html){
    video = video;
    audio= audio;
    image = image;
    html = html
  }
}

class Fact{
  title = "Firsty"; //should be unique
  secrets;
  lore_snippet = "This is the first fact, and JR created it on february 27th 2024."
  mini_game_key; //will only be set if its assigned to a type of room to modify (and then its not available for other rooms)
  theme_key_array = [TWISTING]; //most facts are associated with themes
  damage_multiplier = 10;
  defense_multipler = 0.5;
  speed_multipler = 0.5;
  is_viral = false; //might not do anythign with this but the plan is for facts to be able to spread in weird ways
 
  constructor(title, lore_snippet, theme_key_array, damage_multiplier, defense_multipler, speed_multipler,secrets){
    this.title = title;
    this.lore_snippet = lore_snippet;
    this.secret = secret;
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


console.log("JR NOTE: TODO when NEVILLE AND DEVONA'S FACT VIEWER/DELETER TAB/ROOM IS IMPLEMENTED, PARSE NEW LINES AS BR")
//title should be unique
const TESTFACT = new Fact("Test Fact", "test",[GUIDING], 1, 10, 1);

//http://farragofiction.com/CodexOfRuin/viewer.html?name=The%20Flower&data=N4IgdghgtgpiBcIAqALGACAYgGwPYHcYAnEAGhABMYBnASwHNIAXW3MBEAGQFoBVbgAwCALGRBFa1ANYcAgpwCiABQASYpmljUOAcVkBZAJIA5HaXQBGCwGZzmTgHkASrPMXzAdVkBlJArc25k4Kvi4mSObW7ugKABpIJgDCCQ7G5gBM6XYuyfLe5gCsdiayxon+loHoAEKODgAiAdZi1EwQTNqIcX5OxvKk1raG+kqyCQrGEQVFwfKGvoaJpFa2ibxOhg68+cLCpI4Amv2ZpBMKTjoKCUsrpDrGDt7zpAAcBWIwAB4QAMZM2ABPAD6GiIMBgINoAAdOlw+IIRGJaGBWsi-hxErgoFA2OZMdjceh8TiwHisSSyQT2ORkXR6CgmBjyYTiSzmaSiezKSSxO02j8ULAwIzEKyOWLuWyqZLqeIYFCwdQ6GwmdLOWqJeqKVqVeRWhAAEa0bC0JjA7AwABuMGwHAsYjBFCBVAAZjAUXBEAIAHTvcj4FCmiGu93UT0gH1+kAG7C-KTOmBuj0cSNiKEQC0JpNhu3egRIqD0IHUIg-DgMphQ+AAemrLogRCIEHouBdtD+rDA3p+WOrAC1oOmwKwVLh-sipHW8IQiN6oWB6C0mLgiMCqG1jbDvGh0BRcOgDRgobGAcj0JaARRWPRoDRvepofbEDx+EJhAByajobxtI0ms2cgArsKxC7rgNDoGAY67jAPxghAYYHgC6DIkwxC-CwbDoPgpooOg1CAQaABWsEdPe5AsFC6RyC6aFEOgY5oPREBQVAGa0BBKAQBQB7wQKMA8S6K7oBA6D0E2YA8cubTYAxLroG8u4QAC1DmC+CLCLxMC-GgPE9sKEDIkKTDkSAlHNIgsi0aB6lvugNA-BAUI0OYdFQMi7SdnJInYLJjGgSxWLsRBh49lo6DAW6CG0DGMDelggFEBoxA4mCrloLQ9H6n+prIRa1rYF+VBwdpYY8RQTaoo5vkAveAC+QA
const APOCALYPSEFACT = new Fact("The CFO of Eyedol Games Will End The World", "She doesn't mean to. You can see it in her eye. You can see it in the way she tries so dillgently to avoid hurting anyone, even her auditors. But the fact of the matter is she was born to end a world and her fate is not too picky about which. If Wanda moves on for any reason, she blossoms. But... she also doesn't. She's worked so hard at self control. Know restraint, that's the Waste's mantra right? She has seen how fragile this simulated reality really is and she would NEVER do something to risk it. Except. Well. Except for that one time. She was young. And impulsive.  And Nidhogg brought its poisoned candy (https://archiveofourown.org/works/35438083/chapters/91817125#workskin) into the Universe and everone partook. How could she possibly restrain herself while Trickster? All candy colored and frentic. She hacked herself to make it forever. The party never stops. Then she hacked everything else too. Even the rules that say that once Wanda leaves a place everyone she Knows about is dragged along with her. Apocalypse Chick spreads and spreads and spreads like a weed in Wanda's wake. Never able to leave the destroyed remnants of Arm1, but perfectly able to stabelize it enough to turn it into a second arm. Arm2. She can't reach Arm 3, the Mundane arm. Or the fourth. The God arm. Or the fifth, the Faerie Arm or the sixth or seventh or however many pointless irrelevant arms of this Universe the Witness has spiralled out in his grief for his lost friend. But she's having fun. Just ask her yourself.  https://eyedolgames.com/East ",[APOCALYPSE], 13, 13, 3);

const KISALUCKYBASTARD = new Fact("K Is A Lucky Bastard", "K should have died a thousand times over even before making it to this Universe. Somehow... he/she/xe/fae/they/it always come out on top.",[LIGHT], 1, 1, 1);
//https://archive.org/details/zammy-dreams
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
`,[OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);
const VIKANDKHAVEACOMPLICATEDRELATIONSHIP2 = new Fact("Page 2: [REDACTED] talking about K", `The Angel is simple, not to be confused with The Doctor. That's *Doctor* Slaughter. The Angel thrives on very binary criteria: you look at it and it's satisfied, you don't and it lashes out. Of course, there's abnormalities with much simpler desires, but The Angel was easily a very dangerous one. A blink or two it might tolerate, but letting your mind slip off of it was unacceptable. Try looking at an image without losing concentration. If you fail, imagine yourself getting swiftly decapitated. That is the essence of The Angel.

You can imagine, then, that containing something by giving it your pure, concentrated gaze is very, very hard. Khana's taken aspects of this monster, which makes their previous condition... precarious.

Of course, we found out about it much like Witherby let us know. She broke down. 

We weren't in great terms, Khana and I. Correction: we *aren't* in great terms. I find it hard to say when it started, but it's easy to say when it hit critical mass. It was Yongki, really. He couldn't stand Yongki. That Yongki got more attention from me, that I treated him better. That he did not respect her, or changed opinions too quickly. That I punished his deaths harder than theirs-- and I did. How could I not? Yongki, he was not stable. He couldn't be. So I took care of him, and Khana bit back. They did so often and enthusiastically, as if to teach me a lesson. Then they started transforming into that damn box, and that is when...
We used to talk more often. We really did. There is trust in a shared secret like one's name. Tension. Devona brought this notion to me while I was helping her study a better understanding of her captain's unflatteringly high sexual drive: no bond can occur without tension. Bond comes from band, an object that binds. A bond that can't be broken is a prison. There is no drive in fighting a bond that cannot be broken, because from the beginning the outcome is determined. Friend comes from bond, comes from band, comes from chain. It would not have been the same if I could not break our little game. And how much have I dreamed of it. Of rubbing it in her smug face.
 
And yet I keep secrets. I keep many good secrets.

(Page 2 of ???)`,[OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);


const VIKANDKHAVEACOMPLICATEDRELATIONSHIP3 = new Fact("Page 2: [REDACTED] talking about K", 
`When did I get into the habit of playing executioner?

No, no. I remember. It was the first time he did his little... anomaly magic trick on me. When we found out they had an anomaly to worry about. We did not all start as monsters, as I've posited before. But we were bound to become them, and some of us thrive in that sort of spotlight.

She said many, many things to me when I locked her in that cage. That I was a worthless cripple. That I should have died with the Captain, that I should have killed myself when I got hurt, or that I should have picked up the pace and killed myself then. Any weak spot he could pry at and get a reaction out of me, he attacked and attacked ferociously, as if he could rip me in such a way that maybe they'd get me to look at them. We both know exactly why she did that. In retrospective, it is... 

We agreed to doctor it. As if it never happened. Neither of us had apologies to give. So I hid it away.

That was the first time. Later, when we ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇, I gave them the choice in the matter, and they agreed. When I ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇, sure enough, they let it happen. 'Whatever, if it fixes things'. It did not matter what I cut, as long as we kept our... bubblingly hostile, but otherwise cordial status quo. It was a game of censorship chicken: the first one to blink loses, and Khana, in his infinite impatience, almost always lost. For all his accolades, she does not know how to play poker.

I do not know Khana's name. The actual one. I knew, once. I am sure I could find it if I dug, but I was, and am, very, very thorough. 

Now he has turned into a tree yearning for our attention. If overfed, he will turn into a machine yearning for our misery.

Our containment procedures will have to change accordingly.`,[OBFUSCATION, DECAY, KNOWING, STEALING], 0, 0, 0);

const CAMELLIACANSEEJOHNSTIMESTITCHING = new Fact("Camellia Can See John's Time Stitching", `We've had a curious development recently: the Hundmaster has brought me someone who'd tried to break into our holy sanctum, that, or he brought himself in. His smile is smug and horribly insufferable even as the dog easily strongarms him, as if he's exactly where he wants to be, and I would suspect he isn't wrong. She tells me he's her 'puppy's' boyfriend, 'or something like that'-- he won't deny it, and he looks actually interested in that line of thought. I don't care what kind of disgusting relations he has, but she thinks it's relevant. So, fine. We will operate under that assumption, as flawed and demented as it may be.

He's from Italy, so he says-- or he works there. This doesn't mean anything. No one is truly born. They have all kept themselves busy on the other continent; it appears It has willed for the mafia to become more prevalent, and so it does, and my demonic counterpart has decided to split that 'puppy' in half, thus creating them, who create him as he stands now. And so it does. 

What is most apparent is that I feel the same relation to causality in him as I feel in myself. And yet it's out of place. Different. The mechanisms of time and thus the will of my god flows through me, taking me to where I need to be, where I must be. This one is broken. Shambling.

He did not notice that I could see him. But for a moment while he played with one of the ornamental vases I saw him shatter as he split into shards, different versions of him-- the vase dropped to the floor a dozen times before he could find the timeline where he didn't knock it over, and the one where he manages to do a sad little trick with it, and he stitched them together. The result is a world in which he is suave enough to do such a trick and competent enough to not fail.

That did catch my attention.
As unimpressed as I may be at such wanton usage of a blessing, this one may still serve purpose. Not now, at the moment, but a purpose he can serve. Having one made of strings and one that can sever them is... useful. This world seems to work in such minutiae.

I will be waiting accordingly.`,[TIME, ANGELS], 2, 0.5, 1.5);

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

const neville_secret = new Secrets(null, null, image, `<p><strong><u><span style="font-size:11pt;">Neville&apos;s Secret:</span></u></strong></p>
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
const NevilleFact = new Fact("Neville is a Chill and Cool Guy :)", "Literally nothing seems to bother Neville. They don't call him 'soup himbo' for nothing. He loves his bf Witherby (and is totally cool with his bisexual awakening) and he loves his sworn sibling, Devona. Everything's great :) ",[OBFUSCATION], 1, 1, 1, neville_secret);


const devona_secret = new Secrets(null, null, image, `Devona's Secret

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
const DevonaFact = new Fact("Devona is So So Scared All The Time", "Even though Devona is afraid of pretty much everything, she somehow finds the strength to act as the Training Team's scout, exploring deep within the Mall Maze and beyond. She brings everything she finds back to Neville, who trims it down to just the essentials and passes it off to Ria, who figures out what it all means in the Big Picture. And of course, Camille is in charge of everyone. She has so many people she cares about she is grateful, all things considered, that she's AroAce. Who has time for dating when there's so much to focus on? ",[KNOWING], 1, 1, 1, devona_secret);


const BreachedTwinFact = new Fact("Devona is Easier To Hurt", "If either of the Twins gets hurt, the other turns into a hulking bird with a slavering maw in their chest and hunts down whoever is responsible in order to eat them in a single bite. It's usually Neville doing The Hunt, since Devona is extremely easy to harm. Unfortunately, his tracking skills leave a lot to be desired, so it can take a very long time for him to finally consume the perpetrator. He won't stop to eat or drink or rest until he does, though.  When Devona is instead the Hunter, she knows *exactly* where her target is, but can take a long time to reach them because of her low stamina and massive frame. She rests a lot and eats and drinks and makes slow and steady progress towards the exact location she needs to be at.",[KILLING,HUNTING], 3, 3, 3, devona_secret);


//every fact the closer can give you
const factsForSale = [CLOSERISGREATATFACTS, KISALUCKYBASTARD,EYEKILLERISHUNTED, PARKERRUNSABBQ, EYEKILLERKILLSCULTISTS,CAMELLIACANSEEJOHNSTIMESTITCHING, VIKANDKHAVEACOMPLICATEDRELATIONSHIP2,KILLEROWNSBLADE, EYEKILLERFOUNDFAMILY, PARKERSBESTIEISVIC, DevonaFact,PARKERSlOVESGUNTAN,CLOSERISGREATATROOMS, PARKERSTHINKSWIBBYANDKARENEAT,NevilleFact,VIKANDKHAVEACOMPLICATEDRELATIONSHIP1,CLOSERISGREATATKEYS,VIKANDKHAVEACOMPLICATEDRELATIONSHIP3,BreachedTwinFact];



//every fact the slot machines can give you
const factsForGambling = [CLOSERADDICTEDTOFRUIT,APOCALYPSEFACT,CLOSERISGREATATROOMS]


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