//a cardset should be a playstyle, along with a clown type, ask maccus what those clown types were again

/*
  <li>existence of cardset vs deck. a cardset has a title and a narrative blurb (i.e. 'a story about saving a princess', 'a story about camille going to the doctor'), while a deck is the cards you currently have available to play. you unlock cards from your cardset as you go. (after ever shuffle?)</li>

*/

const getAllStatsForCardset = (cardset) => {
  const ret = [];
  const cards = cardset.cards;
  for (let card of cards) {
    const cost = card.costStatName;
    if (cost && !ret.includes(cost)) {
      ret.push(cost)
    }

    const reward = card.resultStatName;
    if (reward && !ret.includes(reward)) {
      ret.push(reward)
    }
  }
  return ret;
}

/*
its june 2025 now, i have three kittens (Alya, Hallow and Eve) and they aaaalmost get along (hallow and eve are still besties tho). 

i made the new eyedol games landing page and a BUNCH of kitten related things while i was focusing my spoons onto them but
i think im ready to get back into this


*/

const getCardWithTitle = (title, cardArray) => {
  return cardArray.find((i) => i.title === title);
}

//array of [title, number] pairs
const howManyOfThisCardTitleInStartingDeck = (title, deckArray) => {
  return deckArray.find((i) => i[0] === title)[1];
}

class CardSet {
  title = "Test Card Set";
  description = "A cardset is a playstyle, mostly oriented around a narrative theme or clown type. This cardset is based around just, normal heroic tropes. Fighting evil and all that.";
  //all cards possibly to find in a cardset
  cards = [victory, findPotato, eatPotato, defeat, evilRises, trainingStrength, fightEvilWithStrength, superTrain];
  //a nice bright orange back for the cards for default
  //brightness(2) contrast(2) saturate(3) hue-rotate(359deg)
  hueRotate = "359";
  brightness = "2";
  saturation = "3";
  contrast = "2";
  //what cards you begin the game with
  //pairs of card title
  //its a bit awkward to use but doesn't make us have to encode the cards multiple times (inefficient)
  startingDeck = [[victory.title, 1], [findPotato.title, 4], [eatPotato.title, 2], [defeat.title, 1], [evilRises.title, 2], [trainingStrength.title, 3], [fightEvilWithStrength.title, 3], [superTrain.title, 0]]

  constructor(title, description, cards, startingDeck) {
    this.title = title ? title : this.title;
    this.cards = cards ? cards : this.cards;
    this.description = description ? description : this.description;
    this.startingDeck = startingDeck ? startingDeck : this.startingDeck;
  }

  //the color of the card deck's back
  filterValues = () => {
    return `brightness(${this.brightness}) contrast(${this.contrast}) saturate(${this.saturation}) hue-rotate(${this.hueRotate}deg)`;
  }

  startingDeckToCards = () => {
    const ret = [];
    for (let category of this.startingDeck) {
      for (let i = 0; i < category[1]; i++) {
        ret.push(getCardWithTitle(category[0], this.cards));
      }
    }
    return ret;
  }


  render = (parent) => {
    const title = createElementWithClassAndParent("h2", parent);
    title.innerText = this.title;
    const description = createElementWithClassAndParent("div", parent, 'sub-section');
    description.innerText = this.description;


    const label = createElementWithClassAndParent("div", parent);
    label.innerText = "All Possible Cards:"
    label.style.marginTop = "31px"
    const cardsContainer = createElementWithClassAndParent("div", parent, 'grid tiny-cards');

    for (let card of this.cards) {
      card.renderCard(cardsContainer);
    }

    const label2 = createElementWithClassAndParent("div", parent);
    label2.innerText = "Starting Deck:"
    label2.style.marginTop = "31px"

    const deckContainer = createElementWithClassAndParent("div", parent, 'grid tiny-cards');

    const hydratedDeck = this.startingDeckToCards();
    for (let card of hydratedDeck) {
      card.renderCard(deckContainer);
    }

  }

  syncCardsToJSONString = (jsonArray) => {
    this.cards = []
    for (let card of jsonArray) {
      const tmp = new Card();
      tmp.syncToJSONString(JSON.stringify(card));
      this.cards.push(tmp);
    }
    console.log("JR NOTE: after cards sync i am", this)
  }

  syncStartingDeckToJSONString = (jsonArray) => {
    this.startingDeck = []
    for (let card of jsonArray) {
      const tmp = new Card();
      tmp.syncToJSONString(JSON.stringify(card));
      this.startingDeck.push(tmp);
    }
    console.log("JR NOTE: after deck sync i am", this)
  }

  syncToJSONString = (jsonString) => {
    const json = JSON.parse(jsonString);
    for (let key of Object.keys(json)) {
      if (key === "cards") {


      } else if (key === "startingDeck") {

      } else {
        this[key] = json[key]; //default behavior
      }
    }
  }


  renderEditForm = (parent) => {
    const container = createElementWithClassAndParent("div", parent, 'edit-container');
    //make a new one for each game
    let gameContainer;

    const headerEle = createElementWithClassAndParent("h2", container);
    headerEle.innerText = "Edit CardSet!";

    const summaryEle = createElementWithClassAndParent("div", container, 'summary');
    summaryEle.innerHTML = `${this.title}, ${this.cards.length} unique cards and ${this.startingDeck.length} cards in starting deck.`;

    const gameTestButton = createElementWithClassAndParent("button", container);
    gameTestButton.innerText = "Play Test Game With This Deck";
    gameTestButton.onclick = () => {
      gameContainer = createElementWithClassAndParent("div", parent, 'game-container');
      const quitButton = createElementWithClassAndParent("button", parent);
      const game = new Game(this);
      container.style.display = "none";
      game.render(gameContainer);
      quitButton.innerText = "Quit Game And Go Back To Editing";
      quitButton.style.position = "fixed";
      quitButton.style.top = "31px"
      quitButton.onclick = ()=>{
        gameContainer.remove();
        container.style.display = "block";
        quitButton.remove();
      }

    }


    const jsonForm = createTextAreaInputWithLabel(container, 'json', "Save Data*:", JSON.stringify(this, null, 4), 31);
    const note = createElementWithClassAndParent("div", container, 'sub-section');
    note.innerHTML = "* NOTE: you can edit this card either in the save data directly, or the form below.";
    note.style.cssText = `    font-size: 14px;
    width: fit-content;
    margin-bottom: 32px;`;



    jsonForm.input.onchange = () => {
      this.syncToJSONString(jsonForm.input.value)
      container.remove();
      this.renderEditForm(parent);
    }

    const syncThisToForm = (attributeName, value) => {

      this[attributeName] = value;
      //no cost
      if (!this.costStatName) {
        this.costStatValue = 0;
      }
      container.remove();
      this.renderEditForm(parent);
    }


    const titleForm = createTextInputWithLabel(container, 'title', "Title", this.title);
    titleForm.input.onchange = () => syncThisToForm("title", titleForm.input.value);

    const textForm = createTextAreaInputWithLabel(container, 'text', "Text", this.description);
    textForm.input.onchange = () => syncThisToForm("description", textForm.input.value);

    //brightness(2) contrast(2) saturate(3) hue-rotate(359deg)
    const brightnessInput = createNumberInputWithLabel(container, 'brightness', `# 'Card Back Brightness`, this.brightness);
    brightnessInput.input.onchange = () => syncThisToForm("brightness", brightnessInput.input.value);

    const contrastInput = createNumberInputWithLabel(container, 'contrast', `# 'Card Back Contrast`, this.contrast);
    contrastInput.input.onchange = () => syncThisToForm("contrast", contrastInput.input.value);

    const saturateInput = createNumberInputWithLabel(container, 'saturate', `# 'Card Back Saturation`, this.saturation);
    saturateInput.input.onchange = () => syncThisToForm("saturation", saturateInput.input.value);

    const hueInput = createNumberInputWithLabel(container, 'hue', `# 'Card Back Hue Rotation`, this.hueRotate);
    hueInput.input.onchange = () => syncThisToForm("hueRotate", hueInput.input.value);


    const drawCardImage = createElementWithClassAndParent("img", container, "card-back");
    drawCardImage.src = "http://www.farragofiction.com/AudioLogs/images/wallpaper.png";
    drawCardImage.style.filter = `${this.filterValues()}`;
    drawCardImage.style.boxShadow = `-5px 3px 18px black`;


    const jsonFormCards = createTextAreaInputWithLabel(container, 'json', "Cards in This Set:", JSON.stringify(this.cards, null, 4), 31);

    jsonFormCards.input.onchange = () => {
      this.syncCardsToJSONString(JSON.parse(jsonFormCards.input.value))
      container.remove();
      this.renderEditForm(parent);
    }

    const cardsNote = createElementWithClassAndParent("div", container, 'sub-section');
    cardsNote.innerHTML = "* NOTE: Each card shoulud only appear a single time unless you have a good reason. These will be the cards that the shop pulls from.";
    cardsNote.style.cssText = `    font-size: 14px;
    width: fit-content;
    margin-bottom: 32px;`;

    let index = 0;
    for (let card of this.cards) {
      index++;
      const numberInput = createNumberInputWithLabel(container, 'card-count' + index, `# '${card.title}' Cards In Starting Deck`, howManyOfThisCardTitleInStartingDeck(card.title, this.startingDeck));
    }



    this.render(container);

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