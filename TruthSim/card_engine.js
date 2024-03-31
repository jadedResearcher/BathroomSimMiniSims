/*
NOTE: trying not to use utils for this, all vanilla js

can be used for ANY stand alone system that needs playing cards.
grabs a playing card sprite sheet of a specific size and maps positions in that sheet to numerical values

1-12
jokers are -1

(does not include the logic for any GAMES you could play with it)

*/

//assumes this url has folders in it called Hearts, Clubs, Diamonds, Spades
//which has pngs in them labeled 1-13
//as well as back.png
//and a pair of jokers
const createDeckFromSource = (url)=>{
  console.log("JR NOTE: grabbing cards from ", url)
  let back;
  let cards = []

  const grabCardBack = ()=>{
    back = url + "back.png"
  }


  const grabSuit = (name)=>{
    for(let i = 1; i<14; i++){
      //    constructor(src, suit, value){
      cards.push(new PlayingCard(`${url}/${name}/${i}.png`, name, i))
    }
  }


  grabCardBack();
  //grabJokers(); if i design a game that needs jokers wire this up plz
  grabSuit(PLAYING_CARD_DIAMONDS)
  grabSuit(PLAYING_CARD_HEARTS)
  grabSuit(PLAYING_CARD_CLUBS)
  grabSuit(PLAYING_CARD_SPADES)


  return new DeckOfPlayingCards(back, cards);
}



//try to keep a really specific name space, since this'll be global (yeah i could put it in an object but im not gonna future me)
const PLAYING_CARD_HEARTS = "Hearts"
const PLAYING_CARD_DIAMONDS = "Diamonds"
const PLAYING_CARD_SPADES = "Spades"
const PLAYING_CARD_CLUBS = "Clubs"

class DeckOfPlayingCards{
  cardBackSrc = "";
  all_cards = [];
  
  constructor(back, cards){
    this.cardBackSrc = back;
    this.all_cards = cards;
  }

  renderDebug = (ele)=>{
    const container = document.createElement("div");
    ele.append(container);
    container.style.display="flex";
    container.style.flexWrap="wrap";
    container.style.gap="10px";
    container.style.width="100%";


    const backContainer = document.createElement("div");
    backContainer.className="debug-container"
    const backLabel = document.createElement("div");
    backLabel.innerText = "Back of Card"
    backContainer.append(backLabel)

    const back = document.createElement("img");
    back.className="playing-card";
    back.style.width="100px";
    back.src = this.cardBackSrc;
    backContainer.append(back)
    container.append(backContainer);

    for(let card of this.all_cards){
      const backContainer = document.createElement("div");
      backContainer.className="debug-container"
      const backLabel = document.createElement("div");
      backLabel.innerText = card.getName();
      backContainer.append(backLabel)
  
      const back = document.createElement("img");
      back.className="playing-card";
      back.style.width="100px";
      back.src = card.src;
      backContainer.append(back)
      container.append(backContainer);
    }
    


  }
}

class PlayingCard{
    src;
    suit;
    value=-1; //if its negative its a joker, the specific game can decide if it should be removed
    constructor(src, suit, value){
      this.src = src;
      this.suit = suit;
      this.value = value;
    }

    getName = ()=>{
      return `${this.getValueName()} of ${this.suit}`
    }

    getValueName = ()=>{
      const value = this.value;
      if (!value || value <0){
        return "Joker"
      }if(value === 1){
        return "Ace"
      }else if(value ===11){
        return "Jack"
      }else if(value ===12){
        return "Queen"
      }else if(value ===13){
        return "King"
      }else{
        const human = ["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"]
        return human[value-2];
      }
    }
}