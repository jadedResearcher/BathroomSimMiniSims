/*
http://farragofiction.com/SBURBSim/bio.html?staff=authorBot

My robotic doppelganger finally joins us in the echidna!

She has been having a well deserved break hanging out with Paladyn and being on strike and enjoying PianoSim but when she found out how hopelessly lost I've been without her...

<><><>

She always has my back!
*/


/*
time is a flat circle. AB is back but different
*/
//god i am so lazy right now but its literally christmas so, messy code is my gift to future me
let roomsChecked = 0;
let pausedForHumanIntervention = false;
//if an exact url was in here don't do it again, just stop
let searchedLocations = [];
//if i find an identical timestamp its the same room, even if it has a different address
let timeStampsSeen = [];
let base_location = window.location.href.includes("index") ? window.location.href.split("index.html")[0] : window.location.href.split("?")[0];
let select;
let timer;

//{function, params to call later
const functionsToResume = [];

let startTime = new Date();

const timeElapsedInSeconds = (start, end) => {
  const ret = (end.getTime() - start.getTime()) / 1000;;
  timer.innerHTML = "Time Elapsed: " + ret;
  return ret;
}


const initAB = () => {
  select = document.querySelector("#filter");
  timer = document.querySelector('#timer');
  select.onchange = (e) => {
    applyFilter(e.target.value);
  }
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

const process = async () => {
  roomsChecked = 0;
  pausedForHumanIntervention = false;
  startTime = new Date();
  const input = document.querySelector("#interloper-id");

  const container = document.querySelector("#results");
  const newStuff = createElementWithClassAndParent("div", container);

  newStuff.innerHTML = `<br><br>It seems you have asked about: ${input.value}. <br><br>Please wait while I Guide you to information regarding it. JR's Mind can be a convoluted place, so this may take a few minutes. `;

  let result = await processOneLocation(input.value, roomsChecked);
  if (result && result.exits && result.exits.length > 0) {
    processAllExitsFromLocation(result, 0)
  } else {
    processExitsJustInCase(input.value, 0);
  }
}

const processExitsJustInCase = async (location) => {
  let branchPoints = await checkForCommonMazeExits(location);
  processAllExitsFromLocation({ location, exits: branchPoints });
}


const processAllExitsFromLocation = async (result) => {
  if (!result || pausedForHumanIntervention) {
    functionsToResume.push({ function: processAllExitsFromLocation, params: [result] });

    return []
  };
  let { location, exits } = result;

  if (!exits) {
    return [];
  }


  let results = [];
  for (let exit of exits) {
    let new_result = await processOneLocation(`${location}/${exit}`, roomsChecked);
    results.push(new_result);
    //let child_results = await processAllExitsFromLocation(new_result);

  }
  return results;

}

const processOneLocation = async (location, index) => {
  if (pausedForHumanIntervention) {
    functionsToResume.push({ function: processOneLocation, params: [location, index] });
    return { error: "TIMEOUT" };
  }
  const parent = document.querySelector("#results");
  //do as many as you can in 13 seconds

  const container = createElementWithClassAndParent("div", parent, "ab-entry"); //this will collect classes showing facts about it so i can filter
  if (timeElapsedInSeconds(startTime, new Date()) > 13 || index > 1113) {
    pausedForHumanIntervention = true;
    container.innerHTML = `<hr>13 seconds elapsed. Pausing for Human Evaluation. Have you found what you need yet?
    </hr>`;
    functionsToResume.push({ function: processOneLocation, params: [location, index] });
    const button = createElementWithClassAndParent("button", container,"new-root-button");
    button.innerText="No, Resume Search"
    button.onclick = ()=>{
      button.remove();
      startTime = new Date();
      pausedForHumanIntervention= false;
      for(let func of functionsToResume ){
        func.function(...func.params);
      }
    }

    return { error: "TIMEOUT" };
  }
  roomsChecked++;
  if (searchedLocations.includes(location)) {
    container.classList.add("repeat")

    container.innerHTML = `REPEAT DISCOVERED: <span style="overflow: hidden; direction: rtl; max-width: 100px; " alt="${location}" title="${location}">${location}</span> ALREADY REPORTED under the exact same address. Skipping.`;
    const body = document.querySelector("body")
    body.scrollTop = body.scrollHeight;
    return { error: "Repeat" };
  }
  searchedLocations.push(location);

  const title = createElementWithClassAndParent("h2", container);
  title.style.direction = "rtl";
  title.innerText = location;
  const contents = createElementWithClassAndParent("div", container);
  let gopher = await isItGopher(location);
  if (gopher) {
    title.innerText += "(Gopher)"
    contents.innerHTML += `<a target="_blank" href='${location}/waypoint.txt'>Visit</a><br><br>`;

    contents.innerHTML += `<li><b>Date Modified:</b> ${gopher.date}<li><b>Size:</b> ${gopher.size}`;
    if (timeStampsSeen.includes(gopher.date)) {
      container.classList.add("loop")
      container.innerHTML = `LOOP DISCOVERED: <span style="overflow: hidden; direction: rtl; max-width: 100px; " alt="${location}" title="${location}">${location}</span> ALREADY REPORTED under a different address. Skipping.`;
      return { error: "Loop" };
    }
    timeStampsSeen.push(gopher.date);
    processGopher(location, container, contents);

  }

  let bathroom = await isItBathroom(location);
  if (bathroom) {
    title.innerText += "(Bathroom)"
    contents.innerHTML += `<a target="_blank" href='${location}/bathroom.html'>Visit</a><br><br>`;

    contents.innerHTML += `<li><b>Date Modified:</b> ${bathroom.date}<li><b>Size:</b> ${bathroom.size}`;
    if (timeStampsSeen.includes(bathroom.date)) {
      container.classList.add("loop")
      container.innerHTML = `LOOP DISCOVERED: <span style="overflow: hidden; direction: rtl; max-width: 100px; " alt="${location}" title="${location}">${location}</span> ALREADY REPORTED under a different address. Skipping.`;
      return { error: "Loop" };
    }
    timeStampsSeen.push(bathroom.date);
    processBathroom(location, container, contents)

  }
  if (gopher && bathroom) {
    title.innerText += "(It is not supposed to be possible to be both.)"
    timeStampsSeen.push(bathroom.date);
    timeStampsSeen.push(gopher.date);
    contents.innerHTML += `<a target="_blank" href='${location}/bathroom.html'>Visit</a>`;
    contents.innerHTML += `<a target="_blank" href='${location}/waypoint.txt'>Visit</a><Br><Br>`;
    processGopher(location, container, contents);
    processBathroom(location, container, contents)

  }

  if (!gopher && !bathroom) {
    title.innerText += "(I don't know what this is...)"
    contents.innerHTML += `<a target="_blank" href='${location}'>Visit</a><br><br>`;
    processUnknown(location, container, contents);
  }

  title.innerText += `#${index}`


  let branchPoints = await checkForCommonMazeExits(location);

  if (branchPoints.length > 0) {
    contents.innerHTML += `<br><br><b>Exits Found</b>: ${branchPoints.map((i) => `<li>${i}</li>`).join("")}`;
  } else {
    contents.innerHTML += "<br>It seems this is a dead end. Are you sure this is part of a file system maze?";
  }

  let n = await isThereNorth(location);
  if (n) {
    container.classList.add("north");
  } else {
    container.classList.add("no-north");
  }
  let s = await isThereSouth(location);
  if (s) {
    container.classList.add("south");
  } else {
    container.classList.add("no-south");
  }
  let e = await isThereEast(location);
  if (e) {
    container.classList.add("east");
  } else {
    container.classList.add("no-east");
  }

  renderFilter();
  const body = document.querySelector("body")
  body.scrollTop = body.scrollHeight;



  processAllExitsFromLocation({ container, location, exits: branchPoints });
  return { container, location, exits: branchPoints };

}

const setCount = () => {
  const countEle = document.querySelector("#count");

  let count = 0;
  const entries = document.querySelectorAll(".ab-entry");
  if (countEle && entries) {
    for (let entry of entries) {

      if (entry.style.display !== "none") {
        count++;
      }
    }
  }
  countEle.innerText = "Count: " + count;

}


const renderFilter = () => {
  select.innerHTML = "";
  const tags = fetchTags();
  for (let tag of tags) {
    if (tag.trim()) {
      const option = createElementWithClassAndParent("option", select)
      option.value = tag;
      option.innerText = tag;
    }

  }
  setCount();

}

const applyFilter = (filter) => {
  const entries = document.querySelectorAll(".ab-entry");
  for (let entry of entries) {
    if ([...entry.classList].includes(filter)) {
      entry.style.display = "block";
    } else {
      entry.style.display = "none";
    }
  }
  setCount();
}


const fetchTags = () => {
  let ret = "";
  const entries = document.querySelectorAll(".ab-entry");
  for (let entry of entries) {
    ret += entry.className + " ";
  }
  return uniq(ret.split(" "));
}

const processUnknown = async (location, container, contents) => {

  timeStampsSeen.push(results.date);
  let data = await dataOFirstFile(location);
  contents.innerHTML += `<li><b>Date Modified:</b> ${data.date}<li><b>Size:</b> ${data.size}`;
}

//in addition to printing out facts, add clases to container so i can filter (so that'll include NoNorth etc)
const processGopher = async (location, container, contents) => {

  let hydration = await isThereHydration(location);
  if (hydration) {
    contents.innerHTML += `<li>You can hydrate.`;
    container.classList.add("hydration");
  } else {
    container.classList.add("no-hydration");
  }

  let vent = await isThereVent(location);
  if (vent) {
    contents.innerHTML += `<li>You can vent.`;
    container.classList.add("vent");
  } else {
    container.classList.add("no-vent");
  }


}

//in addition to printing out facts, add clases to container so i can filter (so that'll include NoNorth etc)
const processBathroom = async (location, container, contents) => {

  let defaultBlurb = await isBlurbDefault(location);
  if (defaultBlurb) {
    contents.innerHTML += `<li>The emptiness is echoing.`;
    container.classList.add("default-blurb");
  } else {
    container.classList.add("no-default-blurb");
  }

  let images = await grabImagesAB(location);
  if (images) {
    contents.innerHTML += `<li>There are ${images} sprites in the bathroom.`;
    container.classList.add("sprites");
  } else {
    container.classList.add("no-sprites");
  }

  let audio = await grabAudioAB(location);
  if (audio) {
    contents.innerHTML += `<li>There are ${audio} audio files in the bathroom.`;
    container.classList.add("audio");
  } else {
    container.classList.add("no-audio");
  }

  let ramble = await isThereRamble(location);
  if (ramble) {
    contents.innerHTML += `<li>JR hid something there.`;
    container.classList.add("ramble");
  } else {
    container.classList.add("no-ramble");
  }

  let store = await isThereStore(location);
  if (store) {
    contents.innerHTML += `<li>You can shop for ${store} items.`;
    container.classList.add("shop");
  } else {
    container.classList.add("no-shop");
  }

  let interloper = await isThereInterloper(location);
  if (interloper) {
    contents.innerHTML += `<li>There is an interloper.`;
    container.classList.add("interloper");
  } else {
    container.classList.add("no-interloper");
  }

  let ab = await isThereAB(location);
  if (ab) {
    contents.innerHTML += `<li>It seems I am there.`;
    container.classList.add("ab-loc");
  } else {
    container.classList.add("no-ab-loc");
  }
}

const grabImagesAB = async (location) => {
  let tmp = await getImages(location);
  return tmp.length - 1;
}

const grabAudioAB = async (location) => {
  let tmp = await getAudio(location);
  return tmp.length
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

const isBlurbDefault = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/blurb.txt`);
    if (data && data.includes("The emptiness is echoing.")) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

const dataOFirstFile = async (location) => {
  try {
    const dataLocation = gimmeFacts(location); //the location itself is a file with content

    if (dataLocation && dataLocation.date) {
      return dataLocation;
    }

    //i couldn't get data on that location (was it an index file?)
    //so instead trying for the things inside it
    const everything = await getEverything(location);
    if (everything && everything.length > 0) {
      const data = gimmeFacts(everything[0]);
      return data;
    }
  } catch (e) {
    return false;
  }

  return false;
}

const isThereStore = async (location) => {
  try {
    const everything = await getEverything(location + "/store_inventory/");
    if (everything) {
      return everything.length;
    }
  } catch (e) {
    return false;
  }
  return false;
}

const isThereInterloper = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/interloper.js`);
    if (data) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

const isThereAB = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/authorbot.js`);
    if (data) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

const isThereRamble = async (location) => {
  try {
    const data = await httpGetAsync(`${location}/ramble.txt`);
    if (data) {
      return true;
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
  const ret = [];
  let commonExits = ["NORTH", "SOUTH", "EAST", "WEST", "UP", "DOWN"]; //whats that? you only thought NORTH, SOUTH and EAST existed? :) :) ;)

  for (let exit of commonExits) {
    try {
      const data = await httpGetAsync(`${location}/${exit}`);
      if (data && data.includes("<html>")) {
        ret.push(exit);
      } else {
        ret.push(`${exit}`);
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


const cachedEverthing = {}

const everythingExtendsions = [
  "png",
  "PNG",
  "gif",
  "jpg",
  "jpeg",
  "wav",
  "mp3",
  "ogg",
  "mp4",
  "txt"
];
const everythingFilePattern = new RegExp('<a href="([^?]*?)">', 'g');

const everythingExtensionPattern = new RegExp(`\\\.(${everythingExtendsions.join("|")})\$`);


const getEverything = async (url) => {
  if (cachedEverthing[url]) {
    return cachedEverthing[url];
  }

  let promise = new Promise(async (resolve, reject) => {
    try {
      const rawText = await httpGetAsync(url);

      let files = [];
      const match = rawText.matchAll(everythingFilePattern);
      const matches = Array.from(match, (res) => res);
      for (let m of matches) {
        const item = m[1];
        if (item.match(everythingExtensionPattern)) {
          files.push(item);
        }
      }

      cachedEverthing[url] = files;
      //console.log("JR NOTE: returned from network for", url)
      resolve(files);
    } catch (e) {
      reject();
      return [];
    }
  })
  cachedEverthing[url] = promise;
  return promise;
}
