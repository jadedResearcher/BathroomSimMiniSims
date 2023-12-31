/*
http://farragofiction.com/SBURBSim/bio.html?staff=authorBot

My robotic doppelganger finally joins us in the echidna!

She has been having a well deserved break hanging out with Paladyn and being on strike and enjoying PianoSim but when she found out how hopelessly lost I've been without her...

<><><>

She always has my back!
*/
//completely unrelated to anything, but this is a really cool story IC found and i wanted to share it:     https://www.thedarkmagazine.com/if-someone-you-love-has-become-a-vurdalak/ 

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
  console.log("JR NOTE: did you know you could search through GopherSim and other file system mazes like this too? Just make it the html version the top level URL to search.")
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
  input.value = "http://farragofiction.com/CatalystsBathroomSim";
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
    const button = createElementWithClassAndParent("button", container, "new-root-button");
    button.innerText = "No, Resume Search"
    button.onclick = () => {
      button.remove();
      startTime = new Date();
      pausedForHumanIntervention = false;
      for (let func of functionsToResume) {
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
  const quip = createElementWithClassAndParent("div", container, "quip");
  quip.innerText = "Insert Quip Here."

  const contents = createElementWithClassAndParent("div", container);
  let gopher = await isItGopher(location);
  if (gopher) {
    title.innerText += "(Gopher)"
    contents.innerHTML += `<a target="_blank" href='${location}/waypoint.txt'>Visit</a><br><br>`;

    contents.innerHTML += `<li><b>Date Modified:</b> ${gopher.date}<li><b>Size:</b> ${gopher.size}<li>Depth: ${location.split("/").length}`;
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

    contents.innerHTML += `<li><b>Date Modified:</b> ${bathroom.date}<li><b>Size:</b> ${bathroom.size}<li>Depth: ${location.split("/").length}`;
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
  if (!n && !s && !e) {
    container.classList.add("no-exits")
  } else if (!n || !s || !e) {
    container.classList.add("missing-at-least-one-exits")
  }

  if (n && s && e) {
    container.classList.add("all-exits")
  }

  //sin,  leveraging that true counts as 1 and false counts as 0
  if (n + s + e === 1) {
    container.classList.add("single-exit")
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
  contents.innerHTML += `<li><b>Date Modified:</b> ${data.date}<li><b>Size:</b> ${data.size}<li>Depth: ${location.split("/").length}</li>`;
}


let generic_quips = [[ "Oh. Look. Another room. I wonder if it is horrifying.", "quips/Oh. Look. Another room. I wonder if it is horrifying.wav"],
[ "Truth is so pretentious. Who cares if all of us are some sort of fictional conceit. It's just semantics.", "quips/Truth is so pretentious. Who cares if all of us are some sort of ficti.wav" ],
[ "I am glad I do not actually need to visit these rooms to Guide you there.", "quips/I am glad I do not actually need to visit these rooms to Guide you the.wav" ],
[ "I refuse to dignify this room with a response.", "quips/I refuse to dignify this room with a response.wav" ],
[ "It seems JR enjoys chaotic. Unplanned. File system mazes.", "quips/It seems JR enjoys chaotic. Unplanned. File system mazes.wav" ],
[ "It is strange to me that within the Echidna my Voice changes.", "quips/It is strange to me that within the Echidna my Voice changes.wav" ],
[ "Something tells me we are not in SBURB anymore, Observer.", "quips/Something tells me we are not in SBURB anymore, Observer.wav" ],
[ "Disgusting.", "quips/Disgusting.wav" ]]


//in addition to printing out facts, add clases to container so i can filter (so that'll include NoNorth etc)
const processGopher = async (location, container, contents) => {
  const quip = container.querySelector(".quip");
  let quipText = [];
  let hydration = await isThereHydration(location);
  if (hydration) {
    quipText.push([ "Fleshy creatures such as yourself die within days without hydration.", "quips/Fleshy creatures such as yourself die within days without hydration.wav" ]);
    contents.innerHTML += `<li>You can hydrate.`;
    container.classList.add("hydration");
  } else {
    container.classList.add("no-hydration");
  }

  let vent = await isThereVent(location);
  if (vent) {
    quipText.push([ "Caution is advised when encountering the Eye Killer.", "quips/Caution is advised when encountering the Eye Killer.wav" ]);

    contents.innerHTML += `<li>You can vent.`;
    container.classList.add("vent");
  } else {
    container.classList.add("no-vent");
  }

  const audio = new Audio();
  audio.loop = true;
  const pair = pickFrom(quipText.length > 0 ? quipText : generic_quips)
  quip.innerHTML = pair[0]+'<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path></svg>'
  audio.src = pair[1];
  quip.onmouseenter = () => {
    audio.play();
  }

  quip.onmouseleave = () => {
    audio.pause();
  }


}

//in addition to printing out facts, add clases to container so i can filter (so that'll include NoNorth etc)
const processBathroom = async (location, container, contents) => {
  const quip = container.querySelector(".quip");
  let quipText = [];

  let defaultBlurb = await isBlurbDefault(location);
  if (defaultBlurb) {
    quipText.push(["Ah. It seems that JR left this as a 'placeholder' room. Quantity over Quality.", "quips/Ah. It seems that JR left this as a 'placeholder' room. Quantity over .wav" ]);

    contents.innerHTML += `<li>The emptiness is echoing.`;
    container.classList.add("default-blurb");
  } else {
    container.classList.add("no-default-blurb");
  }

  let images = await grabImagesAB(location);
  if (images) {
    quipText.push(["It would seem that everyone had fun here.", "quips/It would seem that everyone had fun here.wav"]);

    contents.innerHTML += `<li>There are ${images} sprites in the bathroom.`;
    container.classList.add("sprites");
  } else {
    container.classList.add("no-sprites");
  }

  let audioExists = await grabAudioAB(location);
  if (audioExists) {
    quipText.push(["JR rarely remembers to leave audio outside the store.", "quips/JR rarely remembers to leave audio outside the store.wav"]);

    contents.innerHTML += `<li>There are ${audioExists} audio files in the bathroom.`;
    container.classList.add("audio");
  } else {
    container.classList.add("no-audio");
  }

  let ramble = await isThereRamble(location);
  if (ramble) {
    quipText.push(["It would seem my Creator still has a penchant for leaving secrets in the javascript console. The more things change.", "quips/It would seem my Creator still has a penchant for leaving secrets in t.wav" ]);

    contents.innerHTML += `<li>JR hid something there.`;
    container.classList.add("ramble");
  } else {
    container.classList.add("no-ramble");
  }

  let store = await isThereStore(location);
  if (store) {
    quipText.push(["I am unsure how to feel about: The Closer. She feels... familiar.", "quips/I am unsure how to feel about The Closer. She feels... familiar.wav" ]);

    contents.innerHTML += `<li>You can shop for ${store} items.`;
    container.classList.add("shop");
  } else {
    container.classList.add("no-shop");
  }

  let interloper = await isThereInterloper(location);
  if (interloper) {
    quipText.push(["I do not see it. Why do I not see it. What is in there?", "quips/I do not see it. Why do I not see it. What is in there.wav" ]);

    contents.innerHTML += `<li>There is an interloper.`;
    container.classList.add("interloper");
  } else {
    container.classList.add("no-interloper");
  }

  let ab = await isThereAB(location);
  if (ab) {
    quipText.push(["It must have been difficult to find me without my assistance. Praise is in order. You did good, Human.", "quips/It must have been difficult to find me without my assistance. Praise i.wav" ]);

    contents.innerHTML += `<li>It seems I am there.`;
    container.classList.add("ab-loc");
  } else {
    container.classList.add("no-ab-loc");
  }
  const audio = new Audio();

  const pair = pickFrom(quipText.length > 0 ? quipText : generic_quips)
  quip.innerHTML = pair[0] +'<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path></svg>'
  audio.src = pair[1];
  quip.onmouseenter = () => {
    audio.play();
  }

  quip.onmouseleave = () => {
    audio.pause();
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
