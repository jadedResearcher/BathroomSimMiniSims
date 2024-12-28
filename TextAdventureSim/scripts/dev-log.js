const all_dev_logs = [];

//gosh this does look familiar
const jrLog = (text) => {
  const jrCSSTitle = "font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:25px;text-decoration:underline;";
  const jrCSSBody = "font-weight: bold;font-family: 'Courier New', monospace;color:red; font-size:13px;";
  console.log(`%c${"JR NOTE:"}%c  ${text}`, jrCSSTitle, jrCSSBody);

}

/*
taking in a content ele is a pattern i learned from work, feels weird using it in vanilla
*/
const jrPopup =  (title, contentEle, secret) => {
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

  closeButton.onclick = () => {
    popup.remove();
    //just in case somehow theres multiple
    document.querySelectorAll(".jr-popup").forEach((x) => x.remove());
  }

  return popup;
}

const showBugForm = () => {
  const bugIcon = document.querySelector("#bug-report");
  bugIcon.classList.remove("bug-pulse")

  const contentEle = document.createElement("div");

  const form = createElementWithClassAndParent("form", contentEle);

  const line1 = createElementWithClassAndParent("div", form);
  line1.style.marginLeft = "13px"

  const label = createElementWithClassAndParent("label", line1);
  label.innerText = "Error Code: "
  label.style.width = "100px"
  label.style.display = "inline-block"


  const input = createElementWithClassAndParent("input", line1);
  input.placeholder = "(find in error reports)"

  const line2 = createElementWithClassAndParent("div", form);
  line2.style.marginLeft = "13px"


  const label2 = createElementWithClassAndParent("label", line2);
  label2.innerText = "Comments: "
  label2.style.width = "100px"
  label2.style.display = "inline-block"


  const area = createElementWithClassAndParent("textarea", line2);
  area.placeholder = "What were you doing when it hit?"

  const button = createElementWithClassAndParent("button", form);
  button.innerText = "Submit"

  form.onsubmit = (e) => {
    e.preventDefault();
    for(const key of Object.keys(fakeDevLogs)){
      console.log("JR NOTE: does key match input?",{key,input:input.value})
      if(key.toUpperCase().trim() ===input.value.toUpperCase().trim()){
        console.log("JR NOTE: yes!")
        player.debugCodes.push(key);//save it exactly in the form its mapped
        player.saveToLocalStorage();
      }
    }
    alert("Thanks! (If I fix this bug I'll make a devlog about it)")
    contentEle.parentElement.parentElement.remove();
  }


  jrPopup("Submit Bug Report", contentEle)

}

const showDevLog = () => {
  const contentEle = document.createElement("div");

  for (let fakeLogCode of player.debugCodes.reverse()) {
    //WHY YES! it converting it to to the local date format means the fake jr devlogs might look different than the real ones
    //secret gigglesnort just for people not in my region :) :) :)
    const log = {date: new Date().toLocaleDateString(), text: fakeDevLogs[fakeLogCode]};
    const container = createElementWithClassAndParent("li", contentEle, "dev-log");
    container.innerHTML = `<b><u>${log.date}</u></b>: ${log.text}`;
    container.onmouseover = () => {
      log.secret && jrLog(log.secret);
    }
  }

  for (let log of all_dev_logs) {
    const container = createElementWithClassAndParent("li", contentEle, "dev-log");
    container.innerHTML = `<b><u>${log.date}</u></b>: ${log.text}`;
    container.onmouseover = () => {
      log.secret && jrLog(log.secret);
    }
  }

  const popup = jrPopup("JR Dev Log", contentEle);
  //just for me cuz i have to refresh the page a lot to develop
  const body = document.querySelector("body");
  const closePopup = () => {
    popup.remove();
    body.removeEventListener("click", closePopup)
    body.removeEventListener("keydown", closePopup)
  }
  body.addEventListener("click", closePopup)
  body.addEventListener("keydown", closePopup)

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
//fake devlogs will get added to the top as well

new DevLog("12/28/2024","I was GONNA work on the inventory more yesterday, but totally forgot it was a friday, so I had to rest.", "zampanio needs you to live a long life. it's a marathon not a sprint.")
new DevLog("12/26/2024","lol, the inventory is a little more complicated than I thought, disabling it for now, need to remember to enable it when i release<br><br>I am a GENIUS!")
new DevLog("12/24/2024","Wiring up the inventory now, more complicated than expected lol", "by which i mean i'm wiring up all the fakey fake bugs for it :) :) :)")
new DevLog("12/23/2024","Now you can actually move around in this maze!<br><br>Apocalypse chick has been a HUGE help here, cuz the recursion, as it turns out, is NOT always justified :) :) ;)")
new DevLog("12/22/2024", "Guess who's got a whole week off to obsess over making a shitty zampanio fangame?<br><br>having a lot of fun realizing that our protag should be twig cuz of how freaking weird it is to go around smelling things", "its me<br><br>i'm the one on vacation")
new DevLog("12/17/2024", "lol, realized i should probably have some kinda bug report form<br><br>plus this devlog<br><br>gotta get my RAMBLE on<br><br>you know?", "gonna have FUN with this<br><br>Its not enough to have a game that's broken, we need to rub it in your face, after all.\n\nHopefully my fake 'responses' to bug reports won't be TOO cruel if someone believes them?\n\nI promise, I'm a weirdly fast and responsive dev but Obsession is a Dangerous Thing and i'm not THAT responsive")
new DevLog("12/15/2024", "Got the bones in place, you can submit commands and they print text on the screen. it's all default text tho")
new DevLog("12/14/2024", "Got the page more or less created<br><br>Super excited about getting to actually play around with North again. Don't get me wrong, Eyedlr was a great time, 10/10, but it wasn't really ZAMPANIOSIM you know? it was just me spiralling around my own branch in a highly selfindulgent way.<br><br>This is me trying to get back to basics. I tried my hand at making a simulation of what Zampanio would look like if it were an RPGMaker game, so how about a Text Adventure?", "PLUS the Medium and the Anon and a few otheres are trying to end the story :) :) :)\n\nTHAT'll be fun to bounce off of")

