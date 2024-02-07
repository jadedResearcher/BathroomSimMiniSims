
//https://progur.com/2017/02/create-mandelbrot-fractal-javascript.html <--shamlessly copied this
//https://github.com/HackerPoet/FractalSoundExplorer/blob/main/Main.cpp  <-- inspired by this
class Fractal {
  height = 500;
  width = 1000;
  autoMode = true;
  autoX = -0.8;
  autoY = -0.8;
  panX = 1.25;
  rand = new Random();
  panY = 1.25;
  context = new AudioContext();
  mouseDown = false;
  svg = new SvgElement.tag("svg");
  canvas = new CanvasElement({width: 1000, height: 500});
  magnificationFactor = 300;
  parent;
  maxDrawIterations = 10;
  maxOrbitIterations = 255;
  path = new PathElement();
  fractals;
  fractalChoiceIndex = 0;
  osc;
  audio_playing = false;
  debugArea = new DivElement();
  container = new DivElement();

  attach(parent) {
    container.classList.add("container");
    parent.append(debugArea);
    parent.append(container);
    fractals = [burning_ship, mandelbrot, sfx];
    osc = context.createOscillator();
    canvas.onmousedown = ((event) => {
      mouseDown = true;
      autoMode = false;
      if (!audio_playing) {
        osc.start2(0);
        audio_playing = true;
      }
    });


    canvas.ontouchstart = ((event) => {
      mouseDown = true;
      autoMode = false;
      if (!audio_playing) {
        osc.start2(0);
        audio_playing = true;
      }
    });
    window.onmouseup = ((event) => mouseDown = false);
    window.ontouchend = ((event) => mouseDown = false);

    canvas.onmousemove = ((event) => {
      let point_x = event.page.x - canvas.offset.left;
      point_x = point_x / magnificationFactor - panX;
      let point_y = event.page.y - canvas.offset.top;
      point_y = point_y / magnificationFactor - panY;
      mouseDown ? drawOrbit(point_x, point_y) : null;
    });
    canvas.ontouchmove = ((event) => {
      let point_x = event.touches.first.page.x - canvas.offset.left;
      point_x = point_x / magnificationFactor - panX;
      let point_y = event.touches.first.page.y - canvas.offset.top;
      point_y = point_y / magnificationFactor - panY;
      mouseDown ? drawOrbit(point_x, point_y) : null;
    });

    window.onkeydown = ((event) => {
      print("key press");
      fractalChoiceIndex = (fractalChoiceIndex + 1) % fractals.length;
      render(0);
    });

    this.parent = parent;
    container.append(canvas);
    container.append(svg);
    svg.append(path);
    render(0);
    doAutoMode(0);
  }

  doAutoMode(frame) {
    if (!autoMode) return;
    const maxNum = 1.0;
    const minNum = -1.0;
    autoX = max(minNum, autoX);
    autoX = min(maxNum, autoX);
    autoY = max(minNum, autoX);
    autoY = min(maxNum, autoX);
    const ratio = 30;
    if (rand.nextDouble() > 0.5) {
      autoX += rand.nextDouble() / ratio;
    } else {
      autoX += -1 * rand.nextDouble() / ratio;
    }

    if (rand.nextDouble() > 0.5) {
      autoY += rand.nextDouble() / ratio;
    } else {
      autoY += -1 * rand.nextDouble() / ratio;
    }

    drawOrbit(autoX, autoY);
    new Timer(new Duration({milliseconds: 60}), () => window.requestAnimationFrame(doAutoMode));
  }

  xPtToScreen( x) {
    return magnificationFactor * x;
  }

  yPtToScreen( y) {
    return magnificationFactor * y;
  }

  beep(orbits) {
    let reals = orbits.map((item) =>
      item.realComponentOfResult).toList();
    let fakes = orbits.map((item) =>
      item.imaginaryComponentOfResult).toList();
    let breadcrumbs = ["echidna", "[REDACTED]", "null", "dark", "friendless", "alone", "minotaur", "hunt", "flesh", "changeling", "distortion", "watcher", "filth", "minotaur", "worm", "bug", "gas", "flavor", "evil fox", "lazy dog", "quick fox", "dead fox", "terrible fox", "bad fox", "fox", "untrustworthy fox", "taste", "smell", "feeling", "failure", "fear", "horror", "mistake", "line", "stay", "good dog", "canine", "good boy", "good boi", "bark", "garbage", "curious dog", "squirming dog", "make dog", "dog CODE", "artist", "musician", "programmer", "console", "hacker", "secret", "gaslight", "robot", "dog", "boredom", "corridor", "hallway", "backroom", "labyrinth", "minotaur", "maze", "door", "distortion", "spiral", "gravestone", "dinner", "ThisIsNotABG", "player", "ThisIsNotAGame", "ThisIsNotABlog", "situation", "canada", "bot", "observer", "camera", "watcher", "ThisIsNotAnEye", "ThisIsNotASpiral", "wednesday", "trumpets", "sunflower", "dinosaur"];

    if (!autoMode) {
      debugArea.setInnerHtml("Unique Points: ${orbits.toSet().length} ${new Random(orbits.toSet().length).pickFrom(breadcrumbs)}");
    }

    var wave = context.createPeriodicWave(reals, fakes);

    osc.setPeriodicWave(wave);
    osc.frequency.value = 9;
    osc.connectNode(context.destination);
    new Timer(new Duration({milliseconds: 60}), () => osc.disconnect());

  }

  drawOrbit(point_x, point_y) {
    let orbits = getOrbit(point_x, point_y, fractals[fractalChoiceIndex]);
    beep(orbits);
    let uniqueOrbitLength = orbits.toSet().length;
    let red = uniqueOrbitLength;
    if (red < 50) red = 50;
    if (red > 255) red = 255;
    path.attributes["stroke"] = "rgb($red,0,0)";
    path.attributes["stroke-width"] = "1";
    let pathString = "";

    for (let res in orbits) {
      let x = res.realComponentOfResult * width + (0.75 * width);
      let y = res.imaginaryComponentOfResult * height + 3 * height / 4;
      if (pathString.isEmpty) {
        pathString = "M $x,$y";
      }
      pathString = "${pathString} L${x},${y} M${x},${y}";
    }
    pathString = "$pathString Z";
    path.attributes["d"] = pathString;
  }

  debug() {
    canvas.context2D.fillRect(0, 0, 500, 500);
  }

  //no side effects bro
  mandelbrot(x, y, res) {
    tempRealComponent = res.realComponentOfResult * res.realComponentOfResult
      - res.imaginaryComponentOfResult * res.imaginaryComponentOfResult
      + x;
    let tempImaginaryComponent = 2 * res.realComponentOfResult * res.imaginaryComponentOfResult
      + y;

    return new Result(res.iteration + 1, tempRealComponent, tempImaginaryComponent);
  }

  /*
  void sfx(double& x, double& y, double cx, double cy) {
std::complex<double> z(x, y);
std::complex<double> c2(cx*cx, cy*cy);
z = z * (x*x + y*y) - (z * c2);
x = z.real();
y = z.imag();
}
   */

  sfx(x, y, res) {
    let z = new Complex(x, y);
    let c2 = new Complex(res.realComponentOfResult * res.realComponentOfResult, res.imaginaryComponentOfResult * res.imaginaryComponentOfResult);
    let tmp = z * (x * x + y * y) - (z * c2);
    let tempRealComponent = tmp.real;
    let tempImaginaryComponent = tmp.imaginary;

    return new Result(res.iteration + 1, tempRealComponent, tempImaginaryComponent);
  }

  burning_ship(x, y, res) {
    let tempRealComponent = res.realComponentOfResult * res.realComponentOfResult
      - res.imaginaryComponentOfResult * res.imaginaryComponentOfResult
      + x;
    let tempImaginaryComponent = 2 * (res.realComponentOfResult * res.imaginaryComponentOfResult).abs()
      + y;

    return new Result(res.iteration + 1, tempRealComponent, tempImaginaryComponent);
  }

  getOrbit(x, y, equation) {
    let orbits = []
    let ongoingResult = new Result(0, x, y);
    for (let i = 0; i < maxOrbitIterations; i++) {
      ongoingResult = equation(x, y, ongoingResult);
      if (typeof ongoingResult.realComponentOfResult === "number" && typeof ongoingResult.imaginaryComponentOfResult === "number") {
        //plz no infinity for graphics OR sound
        orbits.add(ongoingResult);
      }
      // Return a number as a percentage
      if (ongoingResult.realComponentOfResult * ongoingResult.imaginaryComponentOfResult > 5)
        return orbits;
    }
    return orbits;
  }

  checkIfBelongsToSet(x, y, equation) {
    let ongoingResult = new Result(0, x, y);
    for (let i = 0; i < maxDrawIterations; i++) {
      ongoingResult = equation(x, y, ongoingResult);
      // Return a number as a percentage
      if (ongoingResult.realComponentOfResult * ongoingResult.imaginaryComponentOfResult > 5)
        return (i / maxDrawIterations * 100);
    }
    return 0.0;   // Return zero if in set
  }

  render(placeholder) {
    let ctx = canvas.context2D;
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        let belongsToSet =
          checkIfBelongsToSet(x / magnificationFactor - panX,
            y / magnificationFactor - panY, fractals[fractalChoiceIndex]);

        if (belongsToSet == 0) {
          ctx.fillStyle = '#000';
          ctx.fillRect(x, y, 1, 1); // Draw a black pixel
        } else {
          ctx.fillStyle = 'hsl(0, 100%, ${belongsToSet/10}%)';
          ctx.fillRect(x, y, 1, 1); // Draw a colorful pixel
        }
      }
    }
  }
}


class Result {
    iteration = 0;
    realComponentOfResult;
    imaginaryComponentOfResult;
  Result(iteration, realComponentOfResult, imaginaryComponentOfResult) {
        //preserve sign but don't let get too big
        let cap = 1000;
    if (realComponentOfResult.abs() > cap) {
      realComponentOfResult = cap * realComponentOfResult / realComponentOfResult.abs();
    }
    if (imaginaryComponentOfResult.abs() > cap) {
      imaginaryComponentOfResult = cap * imaginaryComponentOfResult / imaginaryComponentOfResult.abs();
    }

  }

}