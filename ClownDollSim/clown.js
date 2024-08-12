const makeDollFromDirectories = async (directory_list) => {
  const doll = new Doll(directory_list.map((d) => new Layer(d)));
  await doll.init();
  return doll;
}

class Doll {
  layers = [];
  constructor(layers) {
    this.layers = layers;
  }

  init = async () => {
    for (let l of this.layers) {
      await l.init();
    }
  }


  render = async (parent, dollContainer, allowColorEditing) => {
    const fuckery = isItFriday();
    if (!dollContainer) {
      dollContainer = createElementWithClassAndParent("div", parent, "doll-container section");
    } else {
      dollContainer.innerHTML = ""; //clear it out for a rerender
    }
    const dollWrapper = createElementWithClassAndParent("div", dollContainer, "doll-wrapper");
    const doll = createElementWithClassAndParent("div", dollWrapper, "doll");


    const controls = createElementWithClassAndParent("div", dollContainer, "controls");

    let canvas = document.createElement("canvas");
    const funCanvas = document.createElement("canvas");
    funCanvas.className = "fun-canvas";

    canvas.width = 0;
    canvas.height = 0;
    if (fuckery) {
      canvas.alt = "Press Me For A Surprise :o)"
      canvas.title = "Press Me For A Surprise :o)";
    }

    for (let layer of this.layers) {
      await layer.render(doll, controls, canvas, funCanvas, fuckery, dollContainer, this.render);
    }

    doll.append(canvas);
    //upscale for maximum aliasing
    if (fuckery) {
      const funContext = funCanvas.getContext("2d");
      funContext.imageSmoothingEnabled = true; //glitch it out as much as you can please :)
      funContext.drawImage(funCanvas, 0, 0, canvas.width * 3, canvas.height * 3);
      funContext.clearRect(0, 0, canvas.width / 3, canvas.height / 3); //remove tiny version left for anti aliasing purposes

      doll.append(funCanvas);
    }

    const randomButton = createElementWithClassAndParent("button", doll, "randomize-whole-doll-button");
    randomButton.innerText = "Randomize Whole Doll";

    randomButton.onclick = () => {
      for (let l of this.layers) {
        l.chooseRandomPart();
      }
      this.render(parent, dollContainer); //rerender over the last container
    }

    const downloadButton = createElementWithClassAndParent("button", doll, "randomize-whole-doll-button");
    downloadButton.innerText = "Download Doll";
    
    downloadButton.onclick = ()=>{
      const data = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = "doll.png";
      link.href = data;
      link.click();
    }



    if (fuckery) {
      canvas.onmouseenter = () => {
        funCanvas.style.display = "block";
      }

      funCanvas.onmouseleave = () => {
        funCanvas.style.display = "none";
      }
      haveFunGlitchingCanvas(funCanvas); //:) :) ;)

    }



  }
}

class Layer {
  directory = "http://farragofiction.com/404";
  parts = []; //loaded from directory (it has to have an apache file structure type list)
  current_part = ""; //what has been chosen?
  allowColorEditing = false; //could be seriously expensive, don't do it unless the part has a limited pallete
  colorMap = {}; //unless you enable scanning it for color editing, this will be empty, otherwise its keys are parts, and their values are a map of color pairings
  constructor(directory) {
    this.directory = directory;
  }

  init = async () => {
    this.parts = await getImages(this.directory);
    this.chooseRandomPart();
  }

  chooseRandomPart = () => {
    return this.choosePart(pickFrom(this.parts));
  }

  choosePart = (part) => {
    this.current_part = this.directory + part;
    return this.current_part;
  }

  handlePartsPicking = (controls, dollContainer, callback) => {
    const label = createElementWithClassAndParent("h2", controls,"part-label");

    const select = createElementWithClassAndParent("select", controls);
    select.disabled = this.parts.length <= 1;
    for (let part of this.parts) {
      const option = createElementWithClassAndParent("option", select);
      option.value = part;
      option.innerText = part;
      option.selected = this.current_part.includes(part)
    }
    select.onchange = () => {
      this.choosePart(select.value);
      callback(parent, dollContainer); //rerender over the last container
    }

    const parts = this.directory.split("/");
    label.innerText = titleCase(parts[parts.length - 2]);
    const randomButton = createElementWithClassAndParent("button", controls);
    randomButton.innerText = "Randomize";
    randomButton.onclick = () => {
      this.chooseRandomPart();
      callback(parent, dollContainer); //rerender over the last container
    }
  }

  handleColorEditing = (layerImage, controls, dollContainer, callback) => {
    const colorContainer = createElementWithClassAndParent("div", controls, 'color-container');
    if (!this.colorMap[this.current_part]) {
      this.colorMap[this.current_part] = uniqueColors(layerImage); //expensive call, cache it as you can
    }

    if (Object.keys(this.colorMap[this.current_part]).length < 31 && Object.keys(this.colorMap[this.current_part]).length > 0) {

      const randomButton = createElementWithClassAndParent("button", colorContainer, "randomize-all-colors-button");
      randomButton.innerText = "Randomize All Colors";
      randomButton.onclick = () => {
        for (let colorKey of Object.keys(this.colorMap[this.current_part])) {
          this.colorMap[this.current_part][colorKey] = { red: getRandomNumberBetween(0, 255), green: getRandomNumberBetween(0, 255), blue: getRandomNumberBetween(0, 255) }
        }
        callback(parent, dollContainer); //rerender over the last container
      }

      const colorInputContainer = createElementWithClassAndParent("div", colorContainer, 'color-input-container');

      for (let colorKey of Object.keys(this.colorMap[this.current_part])) {
        const color = this.colorMap[this.current_part][colorKey];
        const colorPicker = createElementWithClassAndParent("input", colorInputContainer, 'color-picker');
        colorPicker.type = "color";
        colorPicker.value = `${rgbToHex(color.red, color.green, color.blue)}`;
        colorPicker.onchange = () => {
          const { red, green, blue } = hexToRgb(colorPicker.value);
          //key will always be the original but value is the new value
          this.colorMap[this.current_part][colorKey] = { red, green, blue };
          callback(parent, dollContainer); //rerender over the last container
        }
      }
    } else if (Object.keys(this.colorMap[this.current_part]).length == 0) {
      colorContainer.innerHTML = "JR NOTE: No Colors :(";

    } else {
      colorContainer.innerHTML = "JR NOTE: too many colors :(";

    }
  }

  handleActualRendering = (controls,layerImage, doll, canvas, funCanvas, fuckery) => {
    if (canvas.width == 0) {
      canvas.width = layerImage.width;
      canvas.height = layerImage.height;
      funCanvas.width = canvas.width;
      funCanvas.height = canvas.height;
      doll.style.width = layerImage.width + "px";
      doll.parentElement.style.width = layerImage.width + "px";

      controls.style.width = 1000-layerImage.width + "px";
    }

    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    if (this.allowColorEditing) {
      const recolorCanvas = document.createElement("canvas");
      recolorCanvas.width = canvas.width;
      recolorCanvas.height = canvas.height;
      const recolorContext = recolorCanvas.getContext("2d");
      recolorContext.imageSmoothingEnabled = false;
      recolorContext.drawImage(layerImage, 0, 0, canvas.width, canvas.height);

      changeColorsFromPaletteMap(recolorCanvas, this.colorMap[this.current_part]);
      context.drawImage(recolorCanvas, 0, 0, canvas.width, canvas.height);

    } else {
      context.drawImage(layerImage, 0, 0, canvas.width, canvas.height);
    }
    if (fuckery) {
      const funContext = funCanvas.getContext("2d");
      funContext.imageSmoothingEnabled = true; //glitch it out as much as you can please :)

      funContext.drawImage(layerImage, 0, 0, canvas.width / 3, canvas.height / 3); //downscale for maximum aliasing
    }
    layerImage.remove();
  }

  handleAllowingColorEdits = (controls, dollContainer, callback) => {
    const checkBoxContainer = createElementWithClassAndParent("div", controls);
    const checkboxForColorEditing = createElementWithClassAndParent("input", checkBoxContainer);
    checkboxForColorEditing.type = "checkbox";
    checkboxForColorEditing.checked = this.allowColorEditing;

    const checkLabel = createElementWithClassAndParent("span", checkBoxContainer);
    checkLabel.innerText = "Allow Color Editing (slow)"
    checkboxForColorEditing.onchange = () => {
      this.allowColorEditing = !this.allowColorEditing;
      callback(parent, dollContainer); //rerender over the last container
    }
  }

  render = async (doll, controls, canvas, funCanvas, fuckery, dollContainer, callback) => {
    const layer_controls = createElementWithClassAndParent("div", controls, "layer-controls sub-section");


    this.handlePartsPicking(layer_controls, dollContainer, callback);

    const layerImage = createElementWithClassAndParent("img", doll, "doll-layer");
    await waitForImage(layerImage, this.current_part);

    this.handleAllowingColorEdits(layer_controls, dollContainer, callback);

    if (this.allowColorEditing) {
      this.handleColorEditing(layerImage, layer_controls, dollContainer, callback); //has to happen after we have the image
    }

    this.handleActualRendering(controls,layerImage, doll, canvas, funCanvas, fuckery); //has to happen after we get the image
  }
}
