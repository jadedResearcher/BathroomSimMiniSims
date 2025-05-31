//a cardset should be a playstyle, along with a clown type, ask maccus what those clown types were again

/*
  <li>existence of cardset vs deck. a cardset has a title and a narrative blurb (i.e. 'a story about saving a princess', 'a story about camille going to the doctor'), while a deck is the cards you currently have available to play. you unlock cards from your cardset as you go. (after ever shuffle?)</li>

*/

const getAllStatsForCardset = (cardset)=>{
  const ret = [];
  const cards = cardset.cards;
  for(let card of cards){
    const cost = card.costStatName;
    if(cost && !ret.includes(cost)){
      ret.push(cost)
    }

    const reward = card.resultStatName;
    if(reward && !ret.includes(reward)){
      ret.push(reward)
    }
  }
  return ret;
}


class CardSet {
  title = "Test Card Set";
  //a nice bright orange for default
  //brightness(2) contrast(2) saturate(3) hue-rotate(359deg)
  hueRotate="359";
  brightness="2";
  saturation="3";
  contrast="2";

  description = "A cardset is a playstyle, mostly oriented around clown type. This cardset is based around just, normal heroic tropes. Fighting evil and all that.";
  cards = [victory, findPotato,eatPotato,defeat, evilRises, trainingStrength, fightEvilWithStrength, superTrain];

  startingDeck = [victory,findPotato,eatPotato,findPotato,findPotato,findPotato, defeat, evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises, trainingStrength, trainingStrength, fightEvilWithStrength, fightEvilWithStrength, fightEvilWithStrength, fightEvilWithStrength];

  filterValues=()=>{
    return `brightness(${this.brightness}) contrast(${this.contrast}) saturate(${this.saturation}) hue-rotate(${this.hueRotate}deg)`;
  }
  render=(parent)=>{
    const title = createElementWithClassAndParent("h2", parent);
    title.innerText = this.title;
    const description = createElementWithClassAndParent("div", parent,'sub-section');
    description.innerText = this.description;

    const container = createElementWithClassAndParent("div", parent,'grid tiny-cards');

    for(let card of this.cards){
      card.renderCard(container);
    }
  }
}

const genericCardset = new CardSet();



/*
 i need you to understand that i am adopting *kittens*

 itty bitty kittens

 they're too young to take home yet
 
 but the shelters letting me visit them tomorrow and i am so hype i can't codes

 im gonna turn their pics and videos into so many spooky things
 
*/

/*
okay actually no, that didn't work out, the kittens were too sick to visit AND someone else adopted them

but i found BETTER than them. 

(sorry jimbo, i know your name was perfect but it wasn't meant to be)

i found an eyeless kitten named hallow, claimed to be born on halloween and his best friend who breathes really loud and scary but that lets him follow her around

they're so freaking adorable and loving and cute and hallow the eyesless void is so completely my aesthetic

faceless little kitty, its like the slugcatsona the herald made for me
*/

//https://www.tumblr.com/jadedresearcher/783279833598803968/eve-is-my-other-new-kitten-and-she-is-a-seeing?source=share
//https://www.tumblr.com/jadedresearcher/783279651810377728/everyone-stop-everything-theyre-doing-and-look-at?source=share