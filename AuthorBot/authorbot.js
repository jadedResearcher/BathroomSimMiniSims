/*
http://farragofiction.com/SBURBSim/bio.html?staff=authorBot

My robotic doppelganger finally joins us in the echidna!

She has been having a well deserved break hanging out with Paladyn and being on strike and enjoying PianoSim but when she found out how hopelessly lost I've been without her...

<><><>

She always has my back!
*/

let base_location = window.location.href.includes("index") ? window.location.href.split("index.html")[0] : window.location.href.split("?")[0];

const initAB = () => {
  const container = document.querySelector("#room-container");
  const closerSprite = createElementWithClassAndParent("img", container, 'sprite ab');
  closerSprite.src = "http://farragofiction.com/SBURBSim/images/Credits/ab.png";
  container.append(closerSprite);

  const input = document.querySelector("#interloper-id");
  input.value = window.location.href.replaceAll("bathroom.html", "");
  const form = document.querySelector("#interloper-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    process();
  }

}

const process = () => {
  let index = 0;
  const input = document.querySelector("#interloper-id");

  const container = document.querySelector("#blurb");
  container.innerHTML = `It seems you have asked about: ${input.value}. <br><br>Please wait while I Guide you to information regarding it. JR's Mind can be a convoluted place, so this may take a few minutes. `;
  let nextArray = processOneLocation(container, input.value);
}

const processOneLocation = async (parent, location) => {
  console.log("JR NOTE: processing location", location)
  const container = createElementWithClassAndParent("div", parent, "ab-entry"); //this will collect classes showing facts about it so i can filter
  const title = createElementWithClassAndParent("h2", container);
  title.style.direction = "rtl";
  title.innerText = location;
  const contents = createElementWithClassAndParent("div", container);

  let gopher = await isItGopher(location);
  if(gopher){
    title.innerText += "(Gopher)"
    contents.innerHTML += `<li><b>Date Modified:</b> ${gopher.date}<li><b>Size:</b> ${gopher.size}`;
    processGopher(location, container, contents);

  }

  let bathroom = await isItBathroom(location);
  if(bathroom){
    title.innerText += "(Bathroom)"
    contents.innerHTML += `<li><b>Date Modified:</b> ${bathroom.date}<li><b>Size:</b> ${bathroom.size}`;
    processBathroom(location, container, contents)

  }
  if(gopher && bathroom){
    title.innerText += "(It is not supposed to be possible to be both.)"
  }



  let branchPoints = await checkForCommonMazeExits(location);

  if (branchPoints.length > 0) {
    contents.innerHTML += `<br><br><b>Exits Found</b>: ${branchPoints.map((i) => `<li>${i}</li>`).join("")}`;
  } else {
    contents.innerText += "It seems this is a dead end. Are you sure this is part of a file system maze?";
  }

  let n = await isThereNorth(location);
  if(n){
    container.classList.add("north");
  }else{
    container.classList.add("no-north");
  }
  let s = await isThereSouth(location);
  if(s){
    container.classList.add("south");
  }else{
    container.classList.add("no-south");
  }
  let e = await isThereEast(location);
  if(3){
    container.classList.add("east");
  }else{
    container.classList.add("no-east");
  }

  return branchPoints;

}

const fetchTags = () => {
  let ret = "";
  const entries = document.querySelectorAll(".ab-entry");
  for (let entry of entries) {
    ret += entry.className + " ";
  }
  return uniq(ret.split(" "));
}

//in addition to printing out facts, add clases to container so i can filter (so that'll include NoNorth etc)
const processGopher = async (location, container, contents)=>{
  let hydration = await isThereHydration(location);
  if(hydration){
    contents.innerHTML += `<li>You can hydrate.`;
    container.classList.add("hydration");
  }else{
    container.classList.add("no-hydration");
  }

  let vent = await isThereVent(location);
  if(vent){
    contents.innerHTML += `<li>You can vent.`;
    container.classList.add("vent");
  }else{
    container.classList.add("no-vent");
  }


}

//in addition to printing out facts, add clases to container so i can filter (so that'll include NoNorth etc)
const processBathroom  = async (location, container, contents)=>{

}


//like the Wanderer in Eyedlr

const getFileNameFromPath = (nameString) => {
  return nameString.split("/").pop();
}

const isItGopher = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/waypoint.txt`);
    if (data) {
      return gimmeFacts(`${location}/waypoint.txt`);
    }
  } catch (e) {
    return false;
  }
  return false;
}

const isItBathroom = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/bathroom.html`);
    if (data) {
      return gimmeFacts(`${location}/bathroom.html`);
    }
  } catch (e) {
    return false;
  }
  return false;
}

const isThereNorth = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/NORTH`);
    if (data) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

const isThereSouth = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/SOUTH`);
    if (data) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

const isThereEast = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/EAST`);
    if (data) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}


const isThereHydration = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/hydration_station.txt`);
    if (data) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

const isThereVent = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/vent.txt`);
    if (data) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

const checkForCommonMazeExits = async (location) => {
  console.log("JR NOTE: checking for common exits for ", location)
  const ret = [];
  let commonExits = ["NORTH", "SOUTH", "EAST", "WEST", "UP", "DOWN"]; //whats that? you only thought NORTH, SOUTH and EAST existed? :) :) ;)

  for (let exit of commonExits) {
    try {
      const data = await httpGetAsync(`${location}/${exit}`);
      if (data && data.includes("<html>")) {
        ret.push(exit);
      } else {
        ret.push(`${exit} (FALSE PATH)`);
      }
    } catch (e) {
      //its not there, its fine
    }
  }
  return ret;
}




//useful for querying specific files.
//https://stackoverflow.com/questions/2313620/is-it-possible-to-retrieve-the-last-modified-date-of-a-file-using-javascript
gimmeFacts = (url) => {
  try {
    var req = new XMLHttpRequest();
    req.open("HEAD", url, false);
    req.send(null);
    if (req.status == 200) {
      let date = req.getResponseHeader("Last-Modified");
      let size = req.getResponseHeader("Content-Length");
      if (!date) {
        date = null;
      }
      if (!size) {
        size = null;
      }
      return { date, size };

    }
    else return { date: null, size: null }
  } catch (err) {
    console.error(err);
    return { date: null, size: null }
  }
}