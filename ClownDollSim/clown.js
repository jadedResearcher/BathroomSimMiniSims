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

  render = async (parent, dollContainer) => {
    if (!dollContainer) {
      dollContainer = createElementWithClassAndParent("div", parent, "doll-container");
    } else {
      dollContainer.innerHTML  = ""; //clear it out for a rerender
    }
    const doll = createElementWithClassAndParent("div", dollContainer, "doll");

    const controls = createElementWithClassAndParent("div", dollContainer, "controls");

    let canvas = document.createElement("canvas");
    canvas.width = 0;
    canvas.height = 0;
    for (let l of this.layers) {
      const label = createElementWithClassAndParent("div", controls);
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
        this.render(parent, dollContainer); //rerender over the last container
      }

      const parts = l.directory.split("/");
      label.innerText = parts[parts.length - 2];

      const layerImage = createElementWithClassAndParent("img", doll, "doll-layer");
      await waitForImage(layerImage, l.current_part);
      if (canvas.width == 0) {
        canvas.width = layerImage.width;
        canvas.height = layerImage.height;
        doll.style.width = layerImage.width + "px";
      }

      const context = canvas.getContext("2d");
      context.drawImage(layerImage, 0, 0, canvas.width, canvas.height);
      layerImage.remove();
    }
    doll.append(canvas);
  }
}

class Layer {
  directory = "http://farragofiction.com/404";
  parts = []; //loaded from directory (it has to have an apache file structure type list)
  current_part = ""; //what has been chosen?
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