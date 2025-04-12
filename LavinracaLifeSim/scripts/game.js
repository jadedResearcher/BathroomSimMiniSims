/*
a game keeps track of your stats and knows to
end itself if victory or defeat is over zero
*/
let ohgodplzletjrdebugiaskedniceys=true;
console.warn("JR NOTE: don't forget to disable debug mode")
class Game {
  cardset;//what are we actually playing with
  stats = {};// name/value pairs
  deck;
  discards = [];


  constructor(cardset) {
    this.cardset = cardset;
    this.deck = cardset.startingDeck;
    const allStats = getAllStatsForCardset(this.cardset);
    for (let stat of allStats) {
      this.stats[stat] = 0;
    }
  }

  renderDiscardPile = (parent)=>{
    const source = this.discards;
    const drawCardImage = createElementWithClassAndParent("img",parent,"discard-pile card-back");
    drawCardImage.src = "http://www.farragofiction.com/AudioLogs/images/wallpaper.png";
    drawCardImage.style.filter = `sepia(1) contrast(0.5) saturate(0.5)`;
    drawCardImage.style.boxShadow = `-5px ${source.length}px 18px black`;
    drawCardImage.onclick = ()=>{
      const contentEle = document.createElement("div");
      contentEle.className="deck-view";
      const container = createElementWithClassAndParent("div", contentEle,'grid tiny-cards');
      if(source.length === 0){
        container.innerText = "[NO CARDS FOUND]"
      }
      for(let card of source){
        card.renderCard(container);
      }
      popup("Discard Pile", contentEle)
    }
  }

  renderDrawPile = (parent)=>{
    const source = this.deck;
    const drawCardImage = createElementWithClassAndParent("img",parent,"draw-pile card-back");
    drawCardImage.src = "http://www.farragofiction.com/AudioLogs/images/wallpaper.png";
    drawCardImage.style.filter = `${this.cardset.filterValues()}`;
    drawCardImage.style.boxShadow = `-5px ${source.length}px 18px black`;
    drawCardImage.onclick = ()=>{
      const contentEle = document.createElement("div");
      contentEle.className="deck-view";
      const container = createElementWithClassAndParent("div", contentEle,'grid tiny-cards');
      if(source.length === 0){
        container.innerText = "[NO CARDS FOUND]"
      }
      for(let card of source){
        card.renderCard(container);
      }
      popup("Draw Pile (Random Order)", contentEle)
    }
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

      if(ohgodplzletjrdebugiaskedniceys){
        bar.onclick = ()=>{
          this.stats[key] = this.stats[key] +1;
          this.renderStats(parent);
        }
      }
    }

  }

  render = (parent) => {
    this.renderStats(parent);
    const sceneContainer = createElementWithClassAndParent("div", parent, 'game-area');
    this.renderDrawPile(parent);
    this.renderDiscardPile(parent);


  }
}