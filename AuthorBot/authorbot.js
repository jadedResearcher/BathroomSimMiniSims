/*
http://farragofiction.com/SBURBSim/bio.html?staff=authorBot

My robotic doppelganger finally joins us in the echidna!

She has been having a well deserved break hanging out with Paladyn and being on strike and enjoying PianoSim but when she found out how hopelessly lost I've been without her...

<><><>

She always has my back!
*/
const initAB = ()=>{
  const container = document.querySelector("#room-container");
  const closerSprite = createElementWithClassAndParent("img", container, 'sprite ab');
  closerSprite.src = "http://farragofiction.com/SBURBSim/images/Credits/ab.png";
  container.append(closerSprite);

  const input = document.querySelector("#interloper-id");
  input.value = window.location.href;
}