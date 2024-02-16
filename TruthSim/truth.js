const validUrl = 'https://cdn.discordapp.com/attachments/1026232338776068138/';
const key = "TOILET_TOKENS"

window.onload = ()=>{
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const bg = urlParams.get("bg") || 'https://cdn.discordapp.com/attachments/1026232338776068138/1026232935680069632/hallNEW.png';
  const enemy = urlParams.get("enemy") || 'https://cdn.discordapp.com/attachments/1026232338776068138/1152700665328574484/pumpkin.png';
  const player = urlParams.get("player") || 'https://cdn.discordapp.com/attachments/1026232338776068138/1026232841492762645/playerTest.png';
  initScene(bg, enemy, player);
}

//if invalid return blank
const validateUrl = (url)=>{
  const blankImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  if(url.includes(validUrl)){
    return url;
  }else{
    return blankImage;
  }

}

const giveToiletToken = ()=>{
  const key = "TOILET_TOKENS"
  incrementLocalStorageByOne(key);
  window.alert("YOU GOT ONE TOILET TOKEN!!!")
}

const initScene = (bg, enemy,player)=>{
  console.log("JR NOTE: validate that these came from a particular server/channel")
  const parent =document.querySelector("#container");

  const bgEle = createElementWithClassAndParent("img", parent,"bg");
  bgEle.src = validateUrl(bg);

  
  const enemyEle = createElementWithClassAndParent("img", parent,"enemy");
  enemyEle.src = validateUrl(enemy);

  const playerEle = createElementWithClassAndParent("img", parent,"player");
  playerEle.src = validateUrl(player);

  const toiletEle = createElementWithClassAndParent("img", parent,"toilet");
  toiletEle.src = "toilet.png";
  giveToiletToken();
  toiletEle.onclick = ()=>{
    flush();
  }

}

const flush = async()=>{
  let tokens = localStorage.getItem(key);
  if(!tokens || tokens <=0){
    alert("You do not have the Toilet Tokens for that!")
  }else{
    localStorage.setItem(key,parseInt(tokens)-1);
    new Audio("135439__mlsprovideos__toilet-flush-and-refilling-echo-hi-pitch.wav").play();
    const loreRaw = `Clown Classping WIP #1: Jester - Wisdom and Influence. (closer) There's the service to a Leader or Royalty, but there's distinction of not being a slave. You are a subtle influencer and advisor. You guide your leader while never breaking the illusion of an inferior.
    Clown Classping WIP #2: Harlequin - Passion and Independence. (eye killer) You embody a free spirit driven by your desires. It is the purity in your desires and expression that grants the easiest path to victory. Clearing the way for opportunities and good fortune.
    Clown Classping WIP #3: Pierrot - Duty and Destiny. (NAM) Fate is always looming over you. The puppet master has its threads around you and you are a willing servant to their whims. Orders and structure are your best friends. You take to them with solemn conviction. You do what must be done.
    Clown Classping WIP #4: August - Humility and Sacrifice. (Wanda) You are willing to suffer all for the sake of others. You are an altruist by nature. Your endurance is unlike any other, at least that's how it appears to others. Under that happy face you hide scars. The world is carried on your back and your more than happy to carry this burden if others are spared.
    Clown Classping WIP #5: Circus- Loyalty and Communion. (neighbor) You work well with others. You know that to get the most done, help from others is required. You trust and support one another. Not for any sense of self satisfaction, but to give the most to everyone you can.
    Clown Classping WIP #6: zombie is obsession and corruption, (wanda)
    Clown Classping WIP #7: slasher is empowerment and rebellion (eye killer)
    Clown Classping WIP #8: psychological is endurance and insight (closer)
    Clown Classping WIP #9: creature is instinct and innovation (neighbor)
    Clown Classping WIP #10: supernatural is adaptation and mystery (NAM)
    Clown Classping WIP #11: acting: are you the driver of the narrative, the cause of the horror and humor?
    Clown Classping WIP #12: reacting: are you a passive victim of the narraitve, the target of the horror and humor?
    Clown Classping WIP #13: Wanda is an acting august zombie
    Clown Classping WIP #14: Closer is an acting psychological jester
    Clown Classping WIP #15: The Eye Killer is a reacting slasher harlequin
    Clown Classping WIP #16: The Neighbor is a reacting circus creature
    Clown Classping WIP #17: NAM is a reacting supernatural pierrot`;
    await sleep(1000);
    window.alert(pickFrom(loreRaw.split("\n")))
    

  }

}