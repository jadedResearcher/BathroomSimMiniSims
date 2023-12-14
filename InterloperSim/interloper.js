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

const blankImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';



const handleID = async (id) => {
  const rand = new SeededRandom(id);
  const room = document.querySelector("#room-container");
  //475 by 383 internals

  if (mapping[id]) {
    const hit = mapping[id];
    if (hit.video) {
      const video = createElementWithClassAndParent("video", room);
      video.src = hit.video;
      video.height = 475;
      video.style.cursor="pointer";
      video.width = 475;
      video.autoplay = true;
      video.controls = false;
      window.onclick = () => {
        video.play();

      }
      video.loop = true;
      //fuckShitUP(100,room, hit.images,blankImage , rand);
    }
  } else {
    await grabEyesImages();
    let images = [rand.pickFrom(eyes1)];
    if(rand.nextDouble()>0.5){
      images.push(rand.pickFrom(eyes2));
    }

    if(rand.nextDouble()>0.5){
      images.push(rand.pickFrom(eyes3));
    }

    if(rand.nextDouble()>0.5){
      images.push(rand.pickFrom(eyes4));
    }

    /*
      if the number is a multiple of any known key, glitch it minimally
      and even work in one of the images from it with the other bits
    */

    fuckShitUP(rand.getRandomNumberBetween(10,100),room, images,images[0] , rand);


  }

}

let eyes1 = [];
let eyes2 = [];
let eyes3 = [];
let eyes4 = [];


const grabEyesImages = async () => {
  let image_root = "http://farragofiction.com/ZampanioEyes/"
  let tmp = await getImages(image_root);
  eyes1 = tmp.map((item) => image_root + item);

  image_root = "http://farragofiction.com/ZampanioEyes2/"
  tmp = await getImages(image_root);
  eyes2 = tmp.map((item) => image_root + item);

  image_root = "http://farragofiction.com/ZampanioEyes3/"
  tmp = await getImages(image_root);
  eyes3 = tmp.map((item) => image_root + item);

  image_root = "http://farragofiction.com/ZampanioEyes4/"
  tmp = await getImages(image_root);
  eyes4 = tmp.map((item) => image_root + item);


}


//modified from jackElope/lavinraca/lavinraca
//fuckery_quotient smaller is more fucky
fuckShitUP = async (fuckery_quotient, wrapper, images, secret_image, rand) => {
  let fucked_up_image_holder = createElementWithClassAndParent("div", wrapper, "holder");

  fucked_up_image_holder.style.background = "black";
  const size = fuckery_quotient;

  for (let y = 0; y < 475; y += size) {
    for (let x = 0; x < 475; x += size) {
      let box = createElementWithClassAndParent("div", fucked_up_image_holder, "box");
      box.style.pointerEvents = "none";
      box.style.position = "absolute";
      box.style.top = y + "px";
      box.style.left = x + "px";
      box.style.backgroundPositionY = 475 - y + "px";
      box.style.backgroundPositionX = 475 - x + "px";
      box.style.backgroundImage = `url('${rand.pickFrom(images)}')`;
      box.style.width = size + "px";
      box.style.height = size + "px";
      const odds = rand.nextDouble();
      if (odds > 0.95) {
        box.style.animation = `james-webb-telescope-mirrors-mirrored ${rand.nextDouble() * fuckery_quotient}s infinite linear 0s`
      } else if (odds > 0.5) {
        box.style.animation = `james-webb-telescope-mirrors-mirrored  ${rand.nextDouble() * fuckery_quotient}s infinite linear 2s`
        box.style.backgroundImage = `url('${secret_image}')`;
      } else {
        box.style.animation = `james-webb-telescope-mirrors-mirrored  ${rand.nextDouble() * fuckery_quotient}s infinite linear 1s`
      }
    }

  }
}

