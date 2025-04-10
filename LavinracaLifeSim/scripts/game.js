/*
a game keeps track of your stats and knows to
end itself if victory or defeat is over zero
*/
let ohgodplzletjrdebugiaskedniceys=true;
console.warn("JR NOTE: don't forget to disable debug mode")
class Game {
  cardSet;//what are we actually playing with
  stats = {};// name/value pairs


  constructor(cardset) {
    this.cardSet = cardset;
    const allStats = getAllStatsForCardset(this.cardSet);
    for (let stat of allStats) {
      this.stats[stat] = 0;
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
    const container = createElementWithClassAndParent("div", parent, 'game-area');

  }
}