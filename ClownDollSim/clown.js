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

  render = async (parent) => {
    const doll = createElementWithClassAndParent("div", parent, "doll");

    let canvas = document.createElement("canvas");
    canvas.width = 0;
    canvas.height = 0;
    for (let l of this.layers) {
      const layerImage = createElementWithClassAndParent("img", doll, "doll-layer");
      console.log("JR NOTE: going to async load image")
      await waitForImage(layerImage, l.current_part);
      console.log("JR NOTE: ???")
      if (canvas.width == 0) {
        canvas.width = layerImage.width;
        canvas.height = layerImage.height;
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
