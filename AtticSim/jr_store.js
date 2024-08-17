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
const audio = new Audio("http://farragofiction.com/CatalystsBathroomSim/184438__capslok__cash-register-fake.wav");
const giggling = new Audio("http://farragofiction.com/483159__f-r-a-g-i-l-e__children-s-toys-laughing.mp3");

const everythingExtensionPattern = new RegExp(`\\\.(${everythingExtendsions.join("|")})\$`);

const store_url = "http://farragofiction.com/CatalystsBathroomSim/NORTH/EAST/EAST/SOUTH/NORTH/SOUTH/EAST/SOUTH/store_inventory/"

const LOCAL_STORAGE_KEY_CANDY = "BATHROOM_MAZE";
const LOCAL_STORAGE_KEY_PURCHASED_ITEMS = "BATHROOM_MAZE_PURCHASES";
const LOCAL_STORAGE_KEY_RUNNING_TOTAL = "BATHROOM_MAZE_POINTS";

let current_points_to_spend = localStorage[LOCAL_STORAGE_KEY_RUNNING_TOTAL];
let container;
let jrSaysEle;
let shop;

let inventory = localStorage.getItem(LOCAL_STORAGE_KEY_PURCHASED_ITEMS);

let body;
window.onload = async () => {
  body = document.querySelector("body");
  container = document.querySelector("#container");
  jrSaysEle = document.querySelector("#jr-says");
  shop = document.querySelector("#shop");

  incrementLocalStorageByAmount(LOCAL_STORAGE_KEY_CANDY, 1000); //free candy every time you visit here, but it only helps you if you then find a closer store afterwards rip
  await jrSays("JR: !!!");
  await jrSays("JR: well hello there :) :) :)");
  await jrSays("JR: did you know i voice the Closer?");
  await jrSays("JR: i really like her retreat into pretending to not have feelings to feel in control :) :) :)")
  await jrSays("JR: say...")
  await jrSays("JR: i bet it would be a funny bit to run a shop like she does!!!")
  await jrSays("JR: but...")
  await jrSays("JR: im a waste so")
  await jrSays("JR: guess i'll mimic that Gamer Gurl Flower Chick")
  await jrSays("JR: and only accept meta points (tm)")
  await jrSays(`JR: you've spent ${current_points_to_spend} in the closers bathroom shops so far`);
  await jrSays("JR: so thats what you have to spend with me")
  await jrSays("JR: don't like it? go spend more Gopher Gold with the Closer lol")
  await jrSays(`JR: hope your ${current_points_to_spend} points is enough :) :) ;)`)

  //href, size
  const data = await getGopherData(store_url);

  for (let d of data) {
    const button = createElementWithClassAndParent("button", shop);
    let price = parseFloat(d.size);
    //not exactly one point per byte of data, but still related
    if (d.size.includes("K")) {
      price = price * 100;
    }

    if (d.size.includes("M")) {
      price = price * 1000;
    }

    if (inventory.includes(d.href)) {
      price = 0; //you already own this
    }

    if (price === 0) {
      button.classList.add('purchased');
    }
    button.innerHTML = `${d.href}(${price})`

    button.onclick = () => {
      let allowed = true;
      if (price != 0) {        //you already own it, don't worry
        if (current_points_to_spend >= price) {
          purchaseItem(d.href, price);
          audio.play();
          price = 0;
          current_points_to_spend = localStorage[LOCAL_STORAGE_KEY_RUNNING_TOTAL];
          jrSays(`JR: happy to do business with you, you have ${current_points_to_spend} left`)
          button.innerHTML = `${d.href}(${price})`
        } else {
          allowed = false;
          giggling.play();
          button.remove();
          jrSays(`JR: lol you couldn't afford that you only have ${current_points_to_spend}, i'll remove the temptation :) :) :) <br><br>(if only there were SOME way you could hack your way into stealing all my secrets :) :) ;) :chrm_pot_of_gold: :chrm_moon: )`)

        }
      }
      if (allowed) {
        doPopup(d.href)
      } else {
        console.log("JR NOTE: you're not allowed to do that lol ")
      }
    }

  }

  console.log("JR NOTE: data", data)
}

const selectText = async (container, item) => {
  container.innerHTML = "Loading..."
  const rawText = await httpGetAsync(item); //only one that won't fetch itself
  container.innerHTML = `<p style="padding: 20px;">${rawText.replaceAll("\n", "<br>")}</p>`;
  const ele = document.querySelector(".text-option");
  const prev = document.querySelector(".selected");
  prev && prev.classList.remove("selected");
  ele.classList.add("selected")
}

const selectImage = (container, item) => {
  container.innerHTML = `<img style="padding: 20px;" src='${item}'>`;
  const ele = document.querySelector(".image-option");
  const prev = document.querySelector(".selected");
  prev && prev.classList.remove("selected");
  ele.classList.add("selected")
}

const selectMusic = (container, item) => {
  container.innerHTML = `<audio controls autoplay src='${item}' loop style="padding:20px;">`;
  const ele = document.querySelector(".music-option");
  const prev = document.querySelector(".selected");
  prev && prev.classList.remove("selected");
  ele.classList.add("selected")
}

const selectVideo = (container, item) => {
  container.innerHTML = `<video controls autoplay src='${item}' loop style="padding:20px;">`;
  const ele = document.querySelector(".video-option");
  const prev = document.querySelector(".selected");
  prev && prev.classList.remove("selected");
  ele.classList.add("selected")
}

const doPopup = (href) => {
  const itemPopup = createElementWithClassAndParent("div", body, 'closer-chat-container');
  const closerHeader = createElementWithClassAndParent("div", itemPopup, 'closer-chat-header');
  const closerHeaderDiv = createElementWithClassAndParent("div", closerHeader);
  closerHeaderDiv.style.display = "flex";
  closerHeaderDiv.style.justifyContent = "space-between";
  const closerHeaderItem = createElementWithClassAndParent("p", closerHeaderDiv);
  closerHeaderItem.innerHTML = href;
  const closerHeaderClose = createElementWithClassAndParent("p", closerHeaderDiv);
  closerHeaderClose.innerHTML = "X";
  closerHeaderClose.style.cursor = "pointer";

  const closerBody = createElementWithClassAndParent("div", itemPopup, 'closer-chat-body');
  const hell = createElementWithClassAndParent("div", closerBody, 'closer-customer-service-hell');
  const hellInside = createElementWithClassAndParent("div", hell);

  const textEle = createElementWithClassAndParent("div", hell, 'closer-chat-option small text-option');
  textEle.innerText = "View As Text File";
  textEle.onclick = ()=>selectText(hellInside, href);


  const imageEle = createElementWithClassAndParent("div", hell, 'closer-chat-option small image-option');
  imageEle.innerText = "View As Image File";
  imageEle.onclick = ()=>selectImage(hellInside, href);

  const musicEle = createElementWithClassAndParent("div", hell, 'closer-chat-option small music-option');
  musicEle.innerText = "View As Music File";
  musicEle.onclick = ()=>selectMusic(hellInside, href);

  const videoEle = createElementWithClassAndParent("div", hell, 'closer-chat-option small video-option');
  videoEle.innerText = "View As Video File";
  videoEle.onclick = ()=>selectVideo(hellInside, href);

  hellInside.innerHTML = "Loading..."

  closerHeaderClose.onclick = () => {
    //JR NOTE: TODO stop any audio/video playing
    itemPopup.remove();
  }
}

const jrSays = async (html) => {
  jrSaysEle.innerHTML = html;
  return new Promise(resolve => {

    const handleClick = () => {
      resolve();
      body.removeEventListener("click", handleClick);
    }

    body.addEventListener("click", handleClick);
  });


}

//record that you've unlocked the item
//remove the cost from your wallet
//add the cost to your running amount of money spent

const purchaseItem = (item, cost) => {
  //closer you spend gopher gold on, JR and the CFO are wastes, isntead you spend meta currency
  incrementLocalStorageByAmount(LOCAL_STORAGE_KEY_RUNNING_TOTAL, cost * -1);
  addStringToArrayWithKey(LOCAL_STORAGE_KEY_PURCHASED_ITEMS, item);
}



const addStringToArrayWithKey = (key, target) => {
  console.log("JR NOTE: addStringToArrayWithKey", { key, target })

  const tmp = valueAsArray(key);
  tmp.push(target);
  localStorage[key] = JSON.stringify(tmp);
}

const addNumToArrayWithKey = (key, target) => {
  const tmp = valueAsArray(key);
  tmp.push(target);
  localStorage[key] = JSON.stringify(tmp);
}


const removeStringFromArrayWithKey = (key, target) => {
  let tmp = valueAsArray(key);
  tmp = removeItemOnce(tmp, target);
  localStorage[key] = JSON.stringify(tmp);
}

const initEmptyArrayAtKey = (key) => {
  const tmp = [];
  localStorage[key] = JSON.stringify(tmp);
  return tmp;
}

const valueAsArray = (key) => {
  if (localStorage[key]) {
    return JSON.parse(localStorage[key]);
  } else {
    return initEmptyArrayAtKey(key);
  }
}


const incrementLocalStorageByAmount = (KEY, AMOUNT) => {

  let current = localStorage.getItem(KEY);
  if (!current) {
    current = AMOUNT;
  }
  console.log("JR NOTE:", KEY, " was " + current)

  localStorage.setItem(KEY, parseInt(current) + AMOUNT)

}


const getGopherData = async (url) => {
  const rawText = await httpGetAsync(url);
  const virtualDom = document.createElement("div");
  virtualDom.innerHTML = rawText;
  const rows = virtualDom.querySelectorAll("tr");
  let ret = [];
  let index = 0;
  for (let row of rows) {
    const cells = row.querySelectorAll("td");
    if (cells && cells.length) {
      let href = cells[1].querySelector("a").href.split("/");
      href = href[href.length - 1];
      console.log("JR NOTE: href is", href)
      if (href) {
        const size = cells[3].innerText;
        ret[index] = { href, size };
        index++;
      }
    }

  }
  return ret;

}

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
      console.log("JR NOTE: error", e)
      reject();
      return [];
    }
  })
  cachedEverthing[url] = promise;
  return promise;
}
