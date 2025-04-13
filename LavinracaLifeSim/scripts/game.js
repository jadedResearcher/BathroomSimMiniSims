/*
a game keeps track of your stats and knows to
end itself if victory or defeat is over zero
*/
const shuffle = new Audio();
shuffle.src="http://farragofiction.com/CatalystsBathroomSim/audio_utils/weird_sounds/spooky_card_shuffle.mp3";

let ohgodplzletjrdebugiaskedniceys = true;
console.warn("JR NOTE: don't forget to disable debug mode")
class Game {
  cardset;//what are we actually playing with
  stats = {};// name/value pairs
  deck;
  drawAtATime = 5; //in theory we can let things change this
  discards = [];
  hand = [];
  rand;


  constructor(cardset) {

    this.cardset = cardset;
    this.deck = cardset.startingDeck;
    const allStats = getAllStatsForCardset(this.cardset);
    for (let stat of allStats) {
      this.stats[stat] = 0;
    }
    this.rand = new SeededRandom(Date.now());
    this.drawNewHand();
  }

  discardHand = () => {
    this.discard = this.discard.concat(this.hand);
    this.hand = [];
  }

  shuffleDeck = () => {
    this.deck = this.rand.shuffle(this.deck);
    shuffle.play();
  }

  shuffleDiscardIntoDeck = () => {
    console.warn("JR NOTE: give this a fancy animation or sound effect at least draw attention to the fact that something is happening")
    this.deck = this.deck.concat(this.discard);
    this.shuffleDeck();
  }

  drawOneCard =()=>{
    if(this.deck.length ===0){
      return; //should never do this.
    }

    //to draw a card pop a card out of the desk
    //push it to the hand
    this.hand.push(this.deck.pop());
  }

  drawXCards = (x) => {
    for(let i = 0; i<x; i++){
      this.drawOneCard();
    }
  }

  /*
  if there are cards in the hand, push them to the discard pile
  if there are more than drawAtATime cards in the deck, draw them
  if there are less, draw what you can, then shuffle the discards into the deck and draw the rest
  */
  drawNewHand = () => {
    if (this.hand.length > 0) {
      this.discardHand();
    }

    if (this.deck.length === 0) {
      this.shuffleDiscardIntoDeck();
    }

    if (this.deck.length < this.drawAtATime) {
      this.shuffleDeck();
      //draw what you can
      const remainder = this.drawAtATime - this.deck.length;
      this.drawXCards(this.deck.length);
      //if you can, draw the rest out of the discard pile
      if (this.discard.length > 0) {
        this.shuffleDiscardIntoDeck();
        this.drawXCards(remainder);
      }
    } else {
      this.shuffleDeck();
      this.drawXCards(this.drawAtATime)
    }

  }

  renderDiscardPile = (parent) => {
    const source = this.discards;
    const cardHolder = createElementWithClassAndParent("div", parent, "discard-pile");

    const drawCardImage = createElementWithClassAndParent("img", cardHolder, "card-back");
    drawCardImage.src = "http://www.farragofiction.com/AudioLogs/images/wallpaper.png";
    drawCardImage.style.filter = `sepia(1) contrast(0.5) saturate(0.5)`;
    drawCardImage.style.boxShadow = `-5px ${source.length}px 18px black`;
    drawCardImage.onclick = () => {
      const contentEle = document.createElement("div");
      contentEle.className = "deck-view";
      const container = createElementWithClassAndParent("div", contentEle, 'grid tiny-cards');
      if (source.length === 0) {
        container.innerText = "[NO CARDS FOUND]"
      }
      for (let card of source) {
        card.renderCard(container);
      }
      popup("Discard Pile", contentEle)
    }
    const countEle = createElementWithClassAndParent("div", cardHolder, 'cards-count-left');
    countEle.innerText = source.length;
  }

  renderDrawPile = (parent) => {
    const source = this.deck;
    const cardHolder = createElementWithClassAndParent("div", parent, "draw-pile");

    const drawCardImage = createElementWithClassAndParent("img", cardHolder, "card-back");
    drawCardImage.src = "http://www.farragofiction.com/AudioLogs/images/wallpaper.png";
    drawCardImage.style.filter = `${this.cardset.filterValues()}`;
    drawCardImage.style.boxShadow = `-5px ${source.length}px 18px black`;
    drawCardImage.onclick = () => {
      const contentEle = document.createElement("div");
      contentEle.className = "deck-view";
      const container = createElementWithClassAndParent("div", contentEle, 'grid tiny-cards');
      if (source.length === 0) {
        container.innerText = "[NO CARDS FOUND]"
      }
      for (let card of source) {
        card.renderCard(container);
      }
      popup("Draw Pile (Random Order)", contentEle)
    }

    const countEle = createElementWithClassAndParent("div", cardHolder, 'cards-count-right');
    countEle.innerText = source.length;

  }

  renderStats = (parent) => {
    const container = createElementWithClassAndParent("div", parent, 'stat-area');
    for (let [key, value] of Object.entries(this.stats)) {
      const bar = createElementWithClassAndParent("div", container, 'stat-bar');
      const colors = makeColorsForStat(key)
      bar.style.backgroundColor = colors[0];
      const nameEle = createElementWithClassAndParent("div", bar, 'stat-name');
      nameEle.innerText = `${key}:`;
      const valueEle = createElementWithClassAndParent("div", bar, 'stat-value');
      valueEle.innerText = value;

      if (ohgodplzletjrdebugiaskedniceys) {
        bar.onclick = () => {
          this.stats[key] = this.stats[key] + 1;
          this.renderStats(parent);
        }
      }
    }

  }

  renderHand = (parent)=>{
    const handEle = createElementWithClassAndParent("div", parent, "hand");
    handEle.innerText = `${this.hand.length} Cards In Hand`;

    /*
    have X cards i need to fit into Y space

    */
    const handRect = handEle.getBoundingClientRect();
    const widthToTarget = handRect.width;
    const spacePerCard = widthToTarget/this.hand.length;
    let currentX = -85;

    for(let card of this.hand){
      const cardEle = card.renderCard(handEle);
      cardEle.style.cssText  = `position: absolute; transform: scale(0.5); bottom: -500px; left: ${currentX}px`
      currentX+= spacePerCard;
    }

  }

  render = (parent) => {
    this.renderStats(parent);
    const sceneContainer = createElementWithClassAndParent("div", parent, 'game-area');
    this.renderDrawPile(parent);
    this.renderDiscardPile(parent);
    this.renderHand(sceneContainer);


  }
}