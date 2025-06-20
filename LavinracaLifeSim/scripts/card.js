
const VICTORY = "Victory";
const DEFEAT = "Defeat";


const makeColorsForStat = (stat)=>{
  const seed =  (stringtoseed(stat)%360);
  const hue =  seed%360;
  const rand = new SeededRandom(seed);
  let saturation = 0.5 + rand.nextDouble()/2;
  let value = 0.65 + rand.nextDouble()/4;

  const colors = Please.make_scheme(
    {
      h: hue,
      s: saturation,
      v: value 
    },
    {
      scheme_type: 'analogous',
      format: 'hex'
    }
  );
  return colors;
}

class Card {
  title = "An Example Scene";
  text = "A scene happens to [PLAYER]."
  costStatName = "Strength";
  singleUse = false;
  autoPlay = false;
  costStatValue = 3;
  bgAbsoluteSrc = "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png"; //can be things i don't host, go nuts, but beware the rot
  resultStatName = "Health"
  resultChangeValue = -1; //can be negative

  syncToJSONString = (jsonString) => {
    const json = JSON.parse(jsonString);
    for (let key of Object.keys(json)) {
      this[key] = json[key];
    }
  }


  renderCard = (parent)=>{

    const costColors = makeColorsForStat(this.costStatName)

    const resultColors = makeColorsForStat(this.resultStatName)

    const container = parent;
    const outerCardBoxWithRoundedEdges = createElementWithClassAndParent("div", container, 'outer-card');
    outerCardBoxWithRoundedEdges.style.backgroundColor = costColors[0];

    const innerCardBoxWithSquareEdges = createElementWithClassAndParent("div", outerCardBoxWithRoundedEdges, 'inner-card');
    innerCardBoxWithSquareEdges.style.backgroundColor = costColors[1];

    const headerSection = createElementWithClassAndParent("div", innerCardBoxWithSquareEdges,'card-header');
    const victoryOrDefeatOrAutoOrSingleIcon = createElementWithClassAndParent("div", headerSection); //ascii check, x, * or 1 or infinity symbol 
    
    victoryOrDefeatOrAutoOrSingleIcon.innerText = `${this.resultStatName===VICTORY?"✔":""}${this.resultStatName===DEFEAT?"X":""}${this.autoPlay?"*":""}${this.singleUse?"1":"∞"}`;
    const cardTitle = createElementWithClassAndParent("div", headerSection,'card-title');
    cardTitle.innerText = this.title;
    const costText = createElementWithClassAndParent("div", headerSection,'cost-text'); //i.e. 5 Strength
    costText.innerText = `${this.costStatValue} ${this.costStatName}`;

    const contentBox = createElementWithClassAndParent("div", innerCardBoxWithSquareEdges,"content-box");

    const boxForImage = createElementWithClassAndParent("div", contentBox,"card-image-box");
    const bgImage = createElementWithClassAndParent("img", boxForImage);
    bgImage.src = this.bgAbsoluteSrc;

 

    const boxForSummaryText = createElementWithClassAndParent("div", contentBox,'summary-text-box');
    const resultSummaryText = createElementWithClassAndParent("div", boxForSummaryText, 'summary-text');
    resultSummaryText.style.color = resultColors[0];

    resultSummaryText.innerText = this.humanResultSentence() +".";
    const textForResultStat = createElementWithClassAndParent("div", boxForSummaryText,'result-text');
    textForResultStat.innerText = this.resultStatName;
    textForResultStat.style.backgroundColor = resultColors[0];
    return outerCardBoxWithRoundedEdges;


  }

  renderEditForm = (parent) => {
    const container = createElementWithClassAndParent("div", parent);
    const headerEle = createElementWithClassAndParent("h2", container);
    headerEle.innerText = "Edit Card!";
    const summaryEle = createElementWithClassAndParent("div", container, 'summary');
    summaryEle.innerHTML = this.humanSummarySentence();

    const jsonForm = createTextAreaInputWithLabel(container, 'json', "Save Data*:", JSON.stringify(this,null,4));
    const note = createElementWithClassAndParent("div", container, 'sub-section');
    note.innerHTML = "* NOTE: you can edit this card either in the save data directly, or the form below. <br><br>You can copy the save data to import this into your deck as well.";
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
      if(!this.costStatName){
        this.costStatValue = 0;
      }
      container.remove();
      this.renderEditForm(parent);
    }


    const titleForm = createTextInputWithLabel(container, 'title', "Title", this.title);
    titleForm.input.onchange = () => syncThisToForm("title", titleForm.input.value);

    const textForm = createTextAreaInputWithLabel(container, 'text', "Text", this.text);
    textForm.input.onchange = () => syncThisToForm("text", textForm.input.value);

    const singleUseEle = createCheckboxInputWithLabel(container, 'single-use', "Single Use:", this.singleUse);
    singleUseEle.input.onchange = () => syncThisToForm("singleUse", !this.singleUse);

    const autoPlayEle = createCheckboxInputWithLabel(container, 'single-use', "Autoplay:", this.autoPlay);
    autoPlayEle.input.onchange = () => syncThisToForm("autoPlay", !this.autoPlay);

    const bgForm = createTextInputWithLabel(container, 'background-src', "Background Image URL", this.bgAbsoluteSrc);
    bgForm.input.onchange = () => syncThisToForm("bgAbsoluteSrc", bgForm.input.value);
    bgForm.input.style.width="40%"

    const exampleImage = createElementWithClassAndParent("img", container, "preview");
    exampleImage.src = this.bgAbsoluteSrc;


    const costStatNameForm = createTextInputWithLabel(container, 'trigger-name', "Cost Name (Can Be Empty)", this.costStatName);
    costStatNameForm.input.onchange = () => syncThisToForm("costStatName", costStatNameForm.input.value);

    const costValueForm = createNumberInputWithLabel(container, 'trigger-max', `How Much ${this.costStatName} Required To Play`, this.costStatValue);
    costValueForm.input.onchange = () => syncThisToForm("costStatValue", parseInt(costValueForm.input.value));


    const resultStatNameForm = createTextInputWithLabel(container, 'result-name', "Consequence Stat", this.resultStatName);
    resultStatNameForm.input.onchange = () => syncThisToForm("resultStatName", resultStatNameForm.input.value);

    const resultStatValue = createNumberInputWithLabel(container, 'result-value', `${this.resultStatName} Will Change By`, this.resultChangeValue);
    resultStatValue.input.onchange = () => syncThisToForm("resultChangeValue", parseInt(resultStatValue.input.value));

    const note2 = createElementWithClassAndParent("div", container, 'sub-section');
    note2.innerHTML = "** NOTE: Stats can have whatever name you like (though if you typo, it will consider Strength and Strangth to be two separate stats). If the Player does not already have a stat named that, congrats, now they do.<br><br>Cost can also be empty, this just means the card can be played for free.";
    note2.style.cssText = `    font-size: 14px;
    width: fit-content;
    margin-bottom: 32px;`;

    this.renderCard(container);

  }

  humanSummarySentence = () => {
    return `<u>${this.title}</u> ${this.humanTriggerSentence()}, and after it is played, ${this.humanResultSentence()}. ${this.autoPlay?"It will play itself automatically if its cost can be paid. ":""} ${this.singleUse?"It will destroy itself after use.":""}`;
  }

  humanTriggerSentence = () => {
    if(!this.costStatName){
      return 'can be played for free'
    }
    return `requires the player to spend ${this.costStatValue} ${this.costStatName}`;
  }

  humanResultSentence = () => {
    return `${this.resultStatName} will change by ${this.resultChangeValue} `;
  }
}