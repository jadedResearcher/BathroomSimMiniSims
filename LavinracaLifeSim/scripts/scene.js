

class Scene {
  title = "An Example Scene";
  text = "A scene happens to [PLAYER]."
  triggerStatName = "Strength";
  singleUse = false;
  triggerMax = 10;
  triggerMin = 3;
  bgAbsoluteSrc = "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png"; //can be things i don't host, go nuts, but beware the rot
  resultStatName = "Health"
  resultChangeValue = -1; //can be negative

  syncToJSONString = (jsonString) => {
    const json = JSON.parse(jsonString);
    for (let key of Object.keys(json)) {
      this[key] = json[key];
    }
  }

  renderEditForm = (parent) => {
    const container = createElementWithClassAndParent("div", parent);
    const headerEle = createElementWithClassAndParent("h2", container);
    headerEle.innerText = "Edit Card!";
    const summaryEle = createElementWithClassAndParent("div", container, 'summary');
    summaryEle.innerHTML = this.humanSummarySentence();

    const jsonForm = createTextAreaInputWithLabel(container, 'json', "Save Data*:", JSON.stringify(this));
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
      container.remove();
      this.renderEditForm(parent);
    }


    const titleForm = createTextInputWithLabel(container, 'title', "Title", this.title);
    titleForm.input.onchange = () => syncThisToForm("title", titleForm.input.value);

    const textForm = createTextAreaInputWithLabel(container, 'text', "Text", this.text);
    textForm.input.onchange = () => syncThisToForm("text", textForm.input.value);

    const singleUseEle = createCheckboxInputWithLabel(container, 'single-use', "Single Use:", this.singleUse);
    singleUseEle.input.onchange = () => syncThisToForm("singleUse", !this.singleUse);

    const bgForm = createTextAreaInputWithLabel(container, 'background-src', "Background Image URL", this.bgAbsoluteSrc);
    bgForm.input.onchange = () => syncThisToForm("bgAbsoluteSrc", bgForm.input.value);

    const exampleImage = createElementWithClassAndParent("img", container, "preview");
    exampleImage.src = this.bgAbsoluteSrc;


    const triggerStatNameForm = createTextInputWithLabel(container, 'trigger-name', "Triggering Stat", this.triggerStatName);
    triggerStatNameForm.input.onchange = () => syncThisToForm("triggerStatName", triggerStatNameForm.input.value);

    const triggerMax = createNumberInputWithLabel(container, 'trigger-max', `${this.triggerStatName} Not Bigger Than`, this.triggerMax);
    triggerMax.input.onchange = () => syncThisToForm("triggerMax", parseInt(triggerMax.input.value));

    const triggerMin = createNumberInputWithLabel(container, 'trigger-min', `${this.triggerStatName} Not Smaller Than`, this.triggerMin);
    triggerMin.input.onchange = () => syncThisToForm("triggerMin", parseInt(triggerMin.input.value));

    const resultStatNameForm = createTextInputWithLabel(container, 'result-name', "Consequence Stat", this.resultStatName);
    resultStatNameForm.input.onchange = () => syncThisToForm("resultStatName", resultStatNameForm.input.value);

    const resultStatValue = createNumberInputWithLabel(container, 'result-value', `${this.resultStatName} Will Change By`, this.resultChangeValue);
    resultStatValue.input.onchange = () => syncThisToForm("resultChangeValue", parseInt(resultStatValue.input.value));

    const note2 = createElementWithClassAndParent("div", container, 'sub-section');
    note2.innerHTML = "** NOTE: Stats can have whatever name you like (though if you typo, it will consider Strength and Strangth to be two separate stats). If the Player does not already have a stat named that, congrats, now they do.";
    note2.style.cssText = `    font-size: 14px;
    width: fit-content;
    margin-bottom: 32px;`;

  }

  humanSummarySentence = () => {
    return `In order for <u>${this.title}</u> to be drawn, ${this.humanTriggerSentence()}, and after it is played, ${this.humanResultSentence()}. ${this.singleUse?"It will destroy itself after use.":""}`;
  }

  humanTriggerSentence = () => {
    return `${this.triggerStatName} has to be between ${this.triggerMin} and ${this.triggerMax}`;
  }

  humanResultSentence = () => {
    return `${this.resultStatName} will change by ${this.resultChangeValue} `;
  }
}