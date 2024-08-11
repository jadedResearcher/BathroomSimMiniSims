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
    if (!dollContainer) {
      dollContainer = createElementWithClassAndParent("div", parent, "doll-container");
    } else {
      dollContainer.innerHTML = ""; //clear it out for a rerender
    }
    const doll = createElementWithClassAndParent("div", dollContainer, "doll");

    const randomButton = createElementWithClassAndParent("button", doll);
    randomButton.innerText = "Randomize Whole Doll";
    randomButton.onclick = () => {
      for (let l of this.layers) {
        l.chooseRandomPart();
      }
      this.render(parent, dollContainer); //rerender over the last container
    }

    const controls = createElementWithClassAndParent("div", dollContainer, "controls");

    let canvas = document.createElement("canvas");
    const funCanvas = document.createElement("canvas");
    funCanvas.className="fun-canvas";

    canvas.width = 0;
    canvas.height = 0;
    canvas.alt = "Press Me For A Surprise :o)"
    canvas.title = "Press Me For A Surprise :o)";
    for (let l of this.layers) {
      const label = createElementWithClassAndParent("div", controls);

      const checkBoxContainer = createElementWithClassAndParent("div", controls);
      const checkboxForColorEditing = createElementWithClassAndParent("input", checkBoxContainer);
      checkboxForColorEditing.type = "checkbox";
      checkboxForColorEditing.checked = l.allowColorEditing;

      const checkLabel = createElementWithClassAndParent("span", checkBoxContainer);
      checkLabel.innerText = "Allow Color Editing (slow)"
      checkboxForColorEditing.onchange = () => {
        l.allowColorEditing = !l.allowColorEditing;
        this.render(parent, dollContainer); //rerender over the last container
      }


      const select = createElementWithClassAndParent("select", controls);
      select.disabled = l.parts.length <= 1;
      for (let part of l.parts) {
        const option = createElementWithClassAndParent("option", select);
        option.value = part;
        option.innerText = part;
        option.selected = l.current_part.includes(part)
      }
      select.onchange = () => {
        l.choosePart(select.value);
        this.render(parent, dollContainer, allowColorEditing); //rerender over the last container
      }

      const parts = l.directory.split("/");
      label.innerText = parts[parts.length - 2];
      const randomButton = createElementWithClassAndParent("button", controls);
      randomButton.innerText = "Randomize";
      randomButton.onclick = () => {
        l.chooseRandomPart();
        this.render(parent, dollContainer); //rerender over the last container
      }




      const layerImage = createElementWithClassAndParent("img", doll, "doll-layer");
      await waitForImage(layerImage, l.current_part);

      if (l.allowColorEditing) {
        const colorContainer = createElementWithClassAndParent("div", controls);
        if (!l.colorMap[l.current_part]) {
          l.colorMap[l.current_part] = uniqueColors(layerImage); //expensive call, cache it as you can
        }

        if (Object.keys(l.colorMap[l.current_part]).length < 31 && Object.keys(l.colorMap[l.current_part]).length > 0) {

          const randomButton = createElementWithClassAndParent("button", colorContainer);
          randomButton.innerText = "Randomize All Colors";
          randomButton.onclick = () => {
            for (let colorKey of Object.keys(l.colorMap[l.current_part])) {
              l.colorMap[l.current_part][colorKey] = { red: getRandomNumberBetween(0, 255), green: getRandomNumberBetween(0, 255), blue: getRandomNumberBetween(0, 255) }
            }
            this.render(parent, dollContainer); //rerender over the last container
          }

          for (let colorKey of Object.keys(l.colorMap[l.current_part])) {
            const color = l.colorMap[l.current_part][colorKey];
            const colorPicker = createElementWithClassAndParent("input", colorContainer, 'color-picker');
            colorPicker.type = "color";
            colorPicker.value = `${rgbToHex(color.red, color.green, color.blue)}`;
            colorPicker.onchange = () => {
              const { red, green, blue } = hexToRgb(colorPicker.value);
              console.log("JR NOTE: new red, green blue is", red, green, blue, "from", colorPicker.value)
              //key will always be the original but value is the new value
              l.colorMap[l.current_part][colorKey] = { red, green, blue };
              this.render(parent, dollContainer); //rerender over the last container
            }
          }
        } else if (Object.keys(l.colorMap[l.current_part]).length == 0) {
          colorContainer.innerHTML = "JR NOTE: No Colors :( :( :(";

        } else {
          colorContainer.innerHTML = "JR NOTE: Sorry, this part has too many colors to recolor :( :( :(";

        }
      }

      if (canvas.width == 0) {
        canvas.width = layerImage.width;
        canvas.height = layerImage.height;
        funCanvas.width = canvas.width;
        funCanvas.height = canvas.height;
        doll.style.width = layerImage.width + "px";
      }



      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = false;
      if (l.allowColorEditing) {
        console.log("JR NOTE: allowing color editing so recoloring this layer")
        const recolorCanvas = document.createElement("canvas");
        recolorCanvas.width = canvas.width;
        recolorCanvas.height = canvas.height;
        const recolorContext = recolorCanvas.getContext("2d");
        recolorContext.imageSmoothingEnabled = false;
        recolorContext.drawImage(layerImage, 0, 0, canvas.width, canvas.height);

        changeColorsFromPaletteMap(recolorCanvas, l.colorMap[l.current_part]);
        context.drawImage(recolorCanvas, 0, 0, canvas.width, canvas.height);

      } else {
        context.drawImage(layerImage, 0, 0, canvas.width, canvas.height);
      }
      const funContext = funCanvas.getContext("2d");
      funContext.imageSmoothingEnabled = true; //glitch it out as much as you can please :)

      funContext.drawImage(layerImage, 0, 0, funCanvas.width, funCanvas.height);

      layerImage.remove();

    }
    doll.append(canvas);
    doll.append(funCanvas);
    canvas.onmouseenter = ()=>{
      funCanvas.style.display = "block";
    }

    funCanvas.onmouseleave = ()=>{
      funCanvas.style.display = "none";
    }

    haveFunGlitchingCanvas(funCanvas); //:) :) ;)
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
}
