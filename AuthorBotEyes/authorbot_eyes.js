//don't automatically go into directories, instead wait for a human to tell you to
//loops are not just possible but likely, i know how past jr is
//so don't send dear sweet precious AB into a possible spiral with no way out
const order = "?C=M;O=D"; //descending by date
//clear this out when you're done fetching, replace with newEyesToFetch
const eyesToFetchReal = [
  "http://farragofiction.com/ZampanioEyes/",
  "http://farragofiction.com/ZampanioEyes2/",
  "http://farragofiction.com/ZampanioEyes3/",
  "http://farragofiction.com/ZampanioEyes4/",
  "http://farragofiction.com/ColonistsEyes5/",
  "http://lavinraca.eyedolgames.com/images/HarvestEyes/",
  "http://lavinraca.eyedolgames.com/images/secrets/Eyes/"
];

const eyesToFetch = [...eyesToFetchReal];

//clear this out when you add it to eyesToFetch
const newEyesToFetch = [];

let foundFiles = [];

const initAB = async () => {
  alert("JR NOTE: work in progress :) :) ;)")
  console.log("JR NOTE: did you know you could search through GopherSim and other file system mazes like this too? Just make it the html version the top level URL to search.")



  const container = document.querySelector("#room-container");
  const closerSprite = createElementWithClassAndParent("img", container, 'sprite ab');
  closerSprite.src = "http://farragofiction.com/SBURBSim/images/Credits/ab.png";
  container.append(closerSprite);

  const input = document.querySelector("#interloper-id");
  input.value = "loading..."
  const form = document.querySelector("#interloper-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    alert("TODO: move the next eyes to the current and loop")
  }

  let results = [];
  for (let eye of eyesToFetch) {
    const tmp = await processEye(eye);
    results = results.concat(tmp);
  }
  foundFiles = foundFiles.concat(results);
  input.value = newEyesToFetch.join("\n");
  const countEle = document.querySelector("#count");
  countEle.innerText = "# Eyes Already Loaded: " + foundFiles.length;


  form.querySelector("button").innerText = `Fetch Eyes from ${newEyesToFetch.length} urls?`;
  console.log("JR NOTE: results is", results);
  console.log("JR NOTE: i need to iterate on the results and write them to screen as text previews");
  renderList(foundFiles);

  const filterInput = document.querySelector("#filter");
  filterInput.oninput = () => {
    if (filterInput.value.length != 1) { //if its empty, no filter, if its a single letter thats....less useful than no filter
      const filteredList = foundFiles.filter((item) => item.title.includes(filterInput.value));
      renderList(filteredList);
    }
  }

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

  for (let item of list) {
    const list_item = createElementWithClassAndParent("li", unorderedList);
    const button = createElementWithClassAndParent("button", list_item);
    button.style.cssText = `    background: none;
    color: white;
    border: none;`
    button.innerHTML = `${item.title}`;
    const body = document.querySelector("body");
    button.onclick = (e) => {
      e.stopPropagation();
      const popup = createElementWithClassAndParent("button", body, "gallery-popup");
      const button = createElementWithClassAndParent("button", popup, "close-button");
      button.innerText = "Close";


      const title = createElementWithClassAndParent("div", popup, "gallery-title");
      title.innerText = item.text;
      popup.onclick = () => {
        popup.remove();
      }
      openPopup = popup;

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
        newEyesToFetch.push(text);
      }
      return { title, text, isSubDirectory, originalURL: url }
    });

    return massagedData;
  }

  const initialData = await fetchDataAndMassage(url);
  return initialData;

}