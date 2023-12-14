//maccus has been showing me this creepy pasta youtube series https://www.youtube.com/watch?v=ImewMLwyjdE
//and in trying to guess how the demos are generated i came up with something a bit like this
//realized i could do it too
//so wanted to make a prototype to prove its *possible*
//(note this is a PRIME example of why Zampanio wants us to not over-obsess)
//(it is only in other fandoms that we can expand Zampanio)

/*
  todo: 
  * number field above the bathroom
  * map of "valid" number passwords
  * if valid, show the video
  * if invalid, use the glitch engine from lavinraca to interleave two random ZampanioEye images (with optional Neighbor Interloper)
  * glitch should be animated so that MOST are useless bullshit
  * but some are slower and easier to read
  * for the seasoned unmarked, this is entirely pointless (they'll just find the source anyways)
  * but for a new Observer i think this will entertain them for a while
  * 
  * 
  * 
  * 
  * IMPORTANT friday and midnight mode will be VITAL here
  * this abssolutely can and will breed obsession if i'm not careful
  * or at least it did in the Interlopers series
*/



initInterloper = () => {
  console.log("JR NOTE: Interloper detected")
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryId = urlParams.get("stranger")


  const form = document.querySelector("#interloper-form");
  const attempted_id = document.querySelector("#interloper-id");
  if (queryId) {
    attempted_id.value = queryId;
    handleID(parseInt(queryId));
  }
  form.onsubmit = (e) => {
    alert("!!!")
    e.preventDefault();
    updateURLParams("stranger=" + attempted_id.value);
    window.location.href = window.location.href;
    return false;
  }
}





const mapping = {
  217: { video: "rewards/gods_unlock_apocalypse.mp4", images: ["rewards/apocalypse_1.PNG", "rewards/apocalypse_2.PNG", "rewards/apocalypse_3.PNG"] }
}



const handleID = (id) => {
  const rand = new SeededRandom(id);
  const room = document.querySelector("#room-container");
  //475 by 383 internals

  if (mapping[id]) {
    const hit = mapping[id];
    if (hit.video) {
      const video = createElementWithClassAndParent("video", room);
      video.src = hit.video;
      video.height = 475;
      video.width = 475;
      video.autoplay = true;
      window.onclick = () => {
        video.play();

      }
      video.controls = true;
      video.loop = true;
      fuckShitUP(room, hit.images, 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', rand);
    }
  } else {
    window.alert("miss");
    /*
      if the number is a multiple of any known key, glitch it minimally
      and even work in one of the images from it with the other bits
    */

  }

}


//modified from jackElope/lavinraca/lavinraca
fuckShitUP = async (wrapper, images, secret_image, rand) => {
  let fucked_up_image_holder = createElementWithClassAndParent("div", wrapper, "holder");

  fucked_up_image_holder.style.background = "black";
  const size = 100;

  for (let y = 0; y < 475; y += size) {
    for (let x = 0; x < 475; x += size) {
      let box = createElementWithClassAndParent("div", fucked_up_image_holder, "box");
      box.style.pointerEvents = "none";
      box.style.position = "absolute";
      box.style.top = y + "px";
      box.style.left = x + "px";
      box.style.backgroundPositionY = 200 - y + "px";
      box.style.backgroundPositionX = 200 - x + "px";
      box.style.backgroundImage = `url('${rand.pickFrom(images)}')`;
      box.style.width = size + "px";
      box.style.height = size + "px";
      const odds = rand.nextDouble();
      if (odds > 0.75) {
        box.style.animation = `james-webb-telescope-mirrors-mirrored ${rand.nextDouble() * 4}s infinite linear 0s`
      } else if (odds > 0.5) {
        box.style.animation = `james-webb-telescope-mirrors-mirrored  ${rand.nextDouble() * 4}s infinite linear 2s`
        box.style.backgroundImage = `url('${secret_image}')`;
      } else {
        box.style.animation = `james-webb-telescope-mirrors-mirrored  ${rand.nextDouble() * 4}s infinite linear 1s`
      }
    }

  }
}