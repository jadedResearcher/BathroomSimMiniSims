const all_dev_logs = [];

//gosh this does look familiar
const jrLog = (text) => {
  const jrCSSTitle = "font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:25px;text-decoration:underline;";
  const jrCSSBody = "font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:13px;";
  console.log(`%c${"JR NOTE:"}%c  ${text}`, jrCSSTitle, jrCSSBody);

}

//blocks until you click, so long as you await 
const jrPopup = async (title, contentEle, secret) => {
  const popup = createElementWithClassAndParent("div", document.querySelector("body"), "jr-popup");

  popup.focus();
  const titleSection = createElementWithClassAndParent("div", popup, "popup-title-container");
  const titleEle = createElementWithClassAndParent("div", titleSection, "popup-title");
  titleEle.innerText = title;

  const closeButton = createElementWithClassAndParent("button", titleSection, "popup-button");
  closeButton.innerText = "X";

  const popupbody = createElementWithClassAndParent("div", popup);
  //truths arc number is 42. answer to life, the universe and everything.
  popupbody.append(contentEle);
  jrLog(secret);

  const myPromise = new Promise((resolve, reject) => {
    popup.onclick = () => {
      popup.remove();
      //just in case somehow theres multiple
      document.querySelectorAll(".jr-popup").forEach((x) => x.remove());
      resolve(true);
    }
  });

  return myPromise;
}

const showDevLog = () => {
  const contentEle = document.createElement("div");
  for(let log of all_dev_logs){
    const container = createElementWithClassAndParent("li", contentEle, "dev-log");
    container.innerHTML=`<b><u>${log.date}</u></b>: ${log.text}`;
    container.onmouseover=()=>{
      log.secret && jrLog(log.secret);
    }

  }

  jrPopup("JR Dev Log",contentEle)
}

class DevLog {
  date;
  text;
  secret;
  constructor(date, text, secret) {
    this.date = date;
    this.text = text;
    this.secret = secret;
    all_dev_logs.push(this);
  }
}
//new DevLog("12/17/2024","")
//newest on top
new DevLog("12/17/2024", "lol realized i should probably have some kinda bug report form<br><br>plus this devlog<br><br>gotta get my RAMBLE on<br><br>you know?", "gonna have FUN with this<br><br>Its not enough to have a game that's broken, we need to rub it in your face, after all.\n\nHopefully my fake 'responses' to bug reports won't be TOO cruel if someone believes them?\n\nI promise, I'm a weirdly fast and responsive dev but Obsession is a Dangerous Thing and i'm not THAT responsive")
new DevLog("12/15/2024", "Got the bones in place, you can submit commands and they print text on the screen. it's all default text tho")
new DevLog("12/14/2024", "got the page more or less created<br><br>super excited about getting to actually play around with North again. Don't get me wrong, Eyedlr was a great time, 10/10, but it wasn't really ZAMPANIOSIM you know? it was just me spiralling around my own branch in a highly selfindulgent way.<br><br>This is me trying to get back to basics. I tried my hand at making a simulation of what Zampanio would look like if it were an RPGMaker game, so how about a Text Adventure?", "PLUS the Medium and the Anon and a few otheres are trying to end the story :) :) :)\n\nTHAT'll be fun to bounce off of")

