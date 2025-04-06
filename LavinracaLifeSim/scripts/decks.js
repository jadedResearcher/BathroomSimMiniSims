//a cardset should be a playstyle, along with a clown type, ask maccus what those clown types were again


class CardSet {
  title = "Test Card Set"
  description = "A cardset is a playstyle, mostly oriented around clown type. This cardset is based around just, normal heroic tropes. Fighting evil and all that.";
  cards = [victory, defeat, evilRises, trainingStrength, fightEvilWithStrength, superTrain];

  startingDeck = [victory, defeat, evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises,evilRises, trainingStrength, trainingStrength, fightEvilWithStrength, fightEvilWithStrength, fightEvilWithStrength, fightEvilWithStrength];

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
