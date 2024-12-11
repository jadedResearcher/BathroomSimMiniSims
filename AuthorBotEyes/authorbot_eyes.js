//don't automatically go into directories, instead wait for a human to tell you to
//loops are not just possible but likely, i know how past jr is
//so don't send dear sweet precious AB into a possible spiral with no way out
const order = "?C=M;O=D"; //descending by date
let openPopup; //so i can close it
//clear this out when you're done fetching, replace with newEyesToFetch
const eyesToFetchReal = [
  "http://farragofiction.com/ZampanioEyes/",
  "http://farragofiction.com/ZampanioEyes2/",
  "http://farragofiction.com/ZampanioEyes3/",
  "http://farragofiction.com/ZampanioEyes4/",
  "http://farragofiction.com/ColonistsEyes5/",

];//"http://farragofiction.com/ColonistsEyes5/LyreBird/SuperSecretInformationKeepFromDocSlaughter/"
/*
  "http://lavinraca.eyedolgames.com/images/HarvestEyes/",
  "http://lavinraca.eyedolgames.com/images/secrets/Eyes/"
*/
let eyesToFetch = [];

const allEyesFetched = [];

window.onclick = () => {
  if (openPopup) {
    openPopup.remove();
  }
}//http://farragofiction.com/ColonistsEyes5/imthewebthatconnects_alltheshininglights_thatwouldotherwise_belosttothevoid___hopefully_theconnectionsyoumaketoeachother_helpssecureagainstthefuture.png

//clear this out when you add it to eyesToFetch
let newEyesToFetch = [...eyesToFetchReal];

let foundFiles = [];

const initAB = async () => {
  console.log("JR NOTE: did you know you could search through other Eyes like this (like, say, the Harvests?)")

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.get("list")) {
    newEyesToFetch = decodeURIComponent(urlParams.get("list")).split(",")
  }

  const container = document.querySelector("#room-container");
  const closerSprite = createElementWithClassAndParent("img", container, 'sprite ab');
  closerSprite.src = "http://farragofiction.com/SBURBSim/images/Credits/ab.png";
  container.append(closerSprite);

  const input = document.querySelector("#interloper-id");
  input.oninput = () => {
    newEyesToFetch = input.value.split("\n");
    console.log("JR NOTE: newEyesToFetch is", newEyesToFetch);
  }
  input.value = newEyesToFetch.length > 0 ? newEyesToFetch.join("\n") : "NO FURTHER LAYERS TO FETCH";
  const form = document.querySelector("#interloper-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    eyesToFetch = [...newEyesToFetch];
    newEyesToFetch = [];
    input.value = "loading..."
    fetchLayerOfTruth();
  }
  //fetchLayerOfTruth();
  const filterInput = document.querySelector("#filter");
  if (urlParams.get("filter")) {
    container.remove();
    form.remove();
    document.querySelector("#warning").innerHTML = `<br><br><img style="height: 75px; float: left" src='Doctor_Fiona_Slaughter_by_guide.png'>My name is Doctor Fiona Slaughter, and I do not know why your Eyes were sent to me. But I am grateful you are here.<br><br>The files you were sent to See are below:`
    filterInput.value = urlParams.get("filter")
    //too lazy to dry up my code lol
    eyesToFetch = [...newEyesToFetch];
    newEyesToFetch = [];
    await fetchLayerOfTruth();
    const filteredList = foundFiles.filter((item) => item.title.includes(filterInput.value));
    renderList(filteredList);
    return;
  }
  filterInput.oninput = () => {
    if (filterInput.value.length != 1) { //if its empty, no filter, if its a single letter thats....less useful than no filter
      updateURLParams(`?filter=${filterInput.value}`)

      const filteredList = foundFiles.filter((item) => item.title.includes(filterInput.value));
      renderList(filteredList);
    }
  }

}

const fetchLayerOfTruth = async () => {
  const input = document.querySelector("#interloper-id");
  const form = document.querySelector("#interloper-form");

  let results = [];
  for (let eye of eyesToFetch) {
    try {
      console.log("JR NOTE: trying", eye)
      const tmp = await processEye(eye);
      results = results.concat(tmp);
      allEyesFetched.push(eye);
    } catch (e) {
      console.error(`JR NOTE: something weird happened fetching ${eye} so im skipping it...`, e)
    }
  }
  //add to ones found previously
  foundFiles = foundFiles.concat(results);
  if (input) {
    input.value = newEyesToFetch.length > 0 ? newEyesToFetch.join("\n") : "NO FURTHER LAYERS TO FETCH";
  }
  const countEle = document.querySelector("#count");
  if (countEle) {
    countEle.innerText = "# Eyes Already Loaded: " + foundFiles.length;
  }


  if (form && form.querySelector("button")) {
    form.querySelector("button").innerText = `Fetch Eyes from ${newEyesToFetch.length} urls?`;
  }

  renderList(foundFiles);
  updateURLParams(`?list=${allEyesFetched.join(",")}`)



}
//http://farragofiction.com/ColonistsEyes5/LyreBird/SuperSecretInformationKeepFromDocSlaughter/
//https://archiveofourown.org/works/60983944  
//http://www.farragofiction.com/PaldemicSim/?id=258  the Unmarked have a plan afoot

//replaces list with new thing, if this ends up too slow, instead have one that concats
//or hides files
//and keep list on page without rerenders
const renderList = (list) => {
  const countEle = document.querySelector("#filter-count");
  countEle.innerText = "Filtered Eyes Count: " + list.length;

  //caching this will speed things up too but im lazy so unless i need to i won't
  const listEleParent = document.querySelector("#omni-list");
  listEleParent.innerHTML = "";
  const unorderedList = createElementWithClassAndParent("ul", listEleParent);
  const buttons = [];//lets us go left and right
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    const list_item = createElementWithClassAndParent("li", unorderedList);
    const button = createElementWithClassAndParent("button", list_item);
    buttons.push(button);
    button.style.cssText = `text-decoration: underline;margin: none; background: none; color: white;border: none;`
    button.innerHTML = `(${item.originalURL === "http://farragofiction.com/ZampanioEyes/" ? "*" : ""}${item.date}) ${item.title}`;
    
    if(item.originalURL.includes("SuperSecretInformationKeepFromDocSlaughter")){
      const panicButton = createElementWithClassAndParent("button", list_item);
      panicButton.style.display="block";
      panicButton.innerText ="What's This? Do The Eyes Have Something To Show Me? A Secret?"
      panicButton.onclick = ()=>{
        const body = document.querySelector("body")
        body.innerHTML = "";
        body.style.backgroundColor="black";
        const fullVideo = createElementWithClassAndParent("video", body);
        fullVideo.src = "whitenightengale.mp4";
        fullVideo.loop=true;
        fullVideo.autoplay =true;
        fullVideo.play();
        fullVideo.style.cssText = `height: 100%; margin-left: auto; margin-right:auto; position: relative; display: block;`;
      }

    }
    const body = document.querySelector("body");

//zampanio is the fandom we made along the way
    button.onclick = (e) => {
      e.stopPropagation();
      const popup = createElementWithClassAndParent("button", body, "gallery-popup");
      popup.focus();
      const closeButton = createElementWithClassAndParent("button", popup, "close-button");
      closeButton.innerText = "Close";
      closeButton.style.cssText = `    margin: 0px;
    padding: 0px;
    height: 50px;
    width: 50px;
`;
      //http://farragofiction.com/PaldemicSim/bio.html?target=yggdrasilsYeoman
      const navigationHolder = createElementWithClassAndParent("div", popup);
      navigationHolder.style.cssText = `    position: absolute;
    top: 34px;
    left: 0px;
    display: flex;
    justify-content: center;
    width: 100%;`

      const left = createElementWithClassAndParent("button", navigationHolder);
      left.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';
      left.onclick = (e) => {
        e.stopPropagation();
        if (i > 0) {
          popup.remove();
          buttons[i - 1].click();
        }
      }
      const right = createElementWithClassAndParent("button", navigationHolder);
      right.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
      right.onclick = (e) => {
        e.stopPropagation();
        if (i < list.length) {
          popup.remove();
          buttons[i + 1].click();
        }
      }

      const title = createElementWithClassAndParent("div", popup, "gallery-title");
      title.innerText = `(${item.date})  ${item.text}`;
      closeButton.onclick = (e) => {
        e.stopPropagation();
        popup.remove();
      }
      openPopup = popup;
      //https://archiveofourown.org/works/41083818
      const ele = createElementWithClassAndParent("img", popup, "gallery-image-fullsize");
      ele.src = item.text;
    }

  }
}

//if you find a subdirectory don't make it a clickable book
//instead add it to eyesToFetch
const processEye = async (url) => {


  const fetchDataAndMassage = async (url) => {
    const data = await findEverythingInDirectory(url + order)
    const massagedData = data.map((d, index) => {
      const isSubDirectory = d.size && d.size.trim() === "-";
      const split = d.href.split("/").reverse(); //i wanna get the final item and im too lazy to do length -1
      let title = split[0]; //last thing after the split
      if (!title && split[1]) {
        title = split[1]; //sometimes theres a trailing / 
      }
      let text = d.href.replaceAll(base_location, '');
      //sign its the back button
      if (index === 0 && isSubDirectory) { //the url this controls is shorter than where we are, which means its backwards
        title = "*" + title;
        const urlSplit = url.split("/"); //i wanna get the final item and im too lazy to do length -1

        //last one is empty after "/"
        //and one before is current directory
        urlSplit.pop()
        urlSplit.pop()

      }
      text = url + title;
      if (isSubDirectory && !title.includes("*")) {
        newEyesToFetch.push(text + "/");
      }
      return { title, text, isSubDirectory, originalURL: url, date: d.date }
    });

    return massagedData;
  }
  //https://zampaniosim.miraheze.org/wiki/ZampanioSimSouthSouth
  const initialData = await fetchDataAndMassage(url);
  return initialData;

}