
/*
whole facts are stored to memory which makes them resistent to patches but ALSO means we can 
have rooms where you can define your own facts
zampanio style
*/

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

//title should be unique
const TESTFACT = new Fact("Test Fact", "This is just a test of the emergency fact system.",[GUIDING], 1, 10, 1);

//the eye killer considers herself the Final Girl of a horror movie. she is desparate and scared and willing to kill to survive. and so full of adrenaline and fear that the slightest surprise is treated as a jump scare you should stab. 
const KILLEROWNSBLADE = new Fact("The Eye Killer Wields the Quatro Blade", "A dull straight razor stained with blood, a number 4 is etched onto the side of the blade. Any cut made with it can not be perceived, even as blood loss slowly builds up. Anyone who dies while bleeding from this blade will not be percieved by any means. It is said the Eye Killer does not even know she wields it. All she knows is that the kills she makes to warn off Hunters never seem to get found. Never seem to scare off predators. So her kills get more and more gruesome, more and more artistic,  to try to acomplish her goals. Do not look for her. Do not Hunt her. Do not make Wodin's mistake.",[KILLING, OBFUSCATION], 10, 0.5, 0.5)