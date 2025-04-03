

class Scene {
  title = "An Example Scene";
  text = "A scene happens to [PLAYER]."
  triggerStatName = "Strength";
  triggerMax = 10;
  triggerMin = 3;
  bgAbsoluteSrc = "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png"; //can be things i don't host, go nuts, but beware the rot
  resultStatName = "Health"
  resultChangeValue = -1; //can be negative

  renderEditForm =(parent)=>{
    const container = createElementWithClassAndParent("div",parent);
    const headerEle = createElementWithClassAndParent("h2",container);
    headerEle.innerText = "Edit Card!";
    const summaryEle = createElementWithClassAndParent("div",container, 'summary');
    summaryEle.innerText = this.humanSummarySentence();

    const jsonForm = createTextAreaInputWithLabel(container,'json', "Save Data*:",JSON.stringify(this));
    const note = createElementWithClassAndParent("div",container,'sub-section');
    note.innerHTML = "* NOTE: you can edit this card either in the save data directly, or the form below. <br><br>You can copy the save data to import this into your deck as well.";
    note.style.cssText = `    font-size: 14px;
    width: fit-content;
    margin-bottom: 32px;`;
    const titleForm = createTextInputWithLabel(container,'title', "Title",this.title);
    
    const textForm = createTextAreaInputWithLabel(container,'text', "Text",this.text);
    const bgForm = createTextAreaInputWithLabel(container,'background-src', "Background Image URL",this.bgAbsoluteSrc);
    const exampleImage = createElementWithClassAndParent("img",container,"preview");
    exampleImage.src = this.bgAbsoluteSrc;


    const triggerStatNameForm = createTextInputWithLabel(container,'trigger-name', "Triggering Stat",this.triggerStatName);
    const triggerMax = createNumberInputWithLabel(container,'trigger-max', `${this.triggerStatName} Not Bigger Than`,this.triggerMax);
    const triggerMin = createNumberInputWithLabel(container,'trigger-min', `${this.triggerStatName} Not Smaller Than`,this.triggerMin);

    const resultStatNameForm = createTextInputWithLabel(container,'result-name', "Consequence Stat",this.resultStatName);
    const resultStatVvlue = createNumberInputWithLabel(container,'result-value', `${this.resultStatName} Will Change By`,this.resultChangeValue);


  }

  humanSummarySentence = ()=>{
    return `In order for ${this.title} to be drawn, ${this.humanTriggerSentence()}, and after it is played, ${this.humanResultSentence()}.`;
  }

  humanTriggerSentence = ()=>{
    return `${this.triggerStatName} has to be between ${this.triggerMin} and ${this.triggerMax}`;
  }

  humanResultSentence = ()=>{
    return `${this.resultStatName} will change by ${this.resultChangeValue} `;
  }
}