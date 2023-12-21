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
    e.preventDefault();
    updateURLParams("stranger=" + attempted_id.value);
    window.location.href = window.location.href;
    return false;
  }
}





const mapping = {
  217: { video: "rewards/gods_unlock_apocalypse.mp4", images: ["rewards/apocalypse_1.PNG", "rewards/apocalypse_2.PNG", "rewards/apocalypse_3.PNG"] },
  113: { video: "rewards/will_you_become_a_waste.mp4", images: ["rewards/ifyouarecaughtbythis_youcangohere.PNG"] }
  ,1313858: { video: "rewards/graces.mp4", images: ["rewards/gnosis_is_what_wasted_players_interact_with.PNG"] }
  ,429044: { video: "rewards/cool_stairs_bro.mp4", images: ["rewards/stairs2.PNG"] }
  ,333333333: {images: ["rewards/if_itshidden_then_bydefinition_youcare_bythetimeyoufindit___youwentlooking.PNG"] }
  ,4444: {video: "rewards/ill_stop_for_now.mp4",images:["rewards/stop.PNG"] }
  ,4665: {video: "rewards/lavinraca_slash_lavinraca.mp4",images:["rewards/crowscare.png","rewards/smiley.png"] }
  ,107: {video: "rewards/k.mp4",images:["http://farragofiction.com/TwoGayJokes/Stories/gaze_ego_do_you_see_this_shit.png","rewards/k.png","http://farragofiction.com/TwoGayJokes/Stories/loop2_infoteamandother.png"]}
  ,420: {video: "rewards/match.mp4",images:["rewards/match.png","http://farragofiction.com/TwoGayJokes/Stories/fire_girl.png","http://farragofiction.com/TwoGayJokes/Stories/training_team.png"]} //blaze it
  ,101010: {video: "rewards/apocalypse_chick.mp4",images:["rewards/flowerequisde.png","rewards/its_her_the_gamer.png"]} //42 in binary, math joke for flower chick
  ,273: {video: "rewards/codex.mp4",images:["rewards/codex.png"]}
  ,1313: {video: "rewards/jr.mp4",images:["rewards/timecapsule.png","rewards/jr_contains_multitudes.png","rewards/falsejr.png","rewards/eon337.png"]}
  ,2022: {video: "rewards/end.mp4",images:["http://farragofiction.com/TwoGayJokes/Stories/THREE_HUNDRED_YEARS.gif","http://farragofiction.com/TwoGayJokes/Stories/cleaned_up.gif","http://farragofiction.com/TwoGayJokes/Stories/oh_huh_2.gif","rewards/theend.png","http://farragofiction.com/TwoGayJokes/Stories/training_team.png"]} //when it all ends
  ,1996: {video: "rewards/eye_killer.mp4",images:["rewards/FomalDARP.png"]} //eye killer is a time player, of course she'd pick the date yugioh came out
  ,1972: {video: "rewards/intern.mp4",images:["rewards/Blink1.gif","rewards/Blink2.gif","rewards/Blink3.gif","rewards/Blink4.gif"]} //when it all starts
  ,6996: {video: "rewards/mirror.mp4",images:["rewards/novummirror.png"]} //same forwards and backwards with numerals that mirror each other. also: sex number.
  ,413: {video: "rewards/justified.mp4",images:["rewards/justified.PNG"]} //i had fun making these
  ,1025: {video: "rewards/justified_laughter.mp4",images:["rewards/justified_laughter.PNG"]} //my nesting partner 3d printed the mask
  ,6262: {video: "rewards/neighbor.mp4",images:["rewards/mirror.png"]} //duo mask number and septum coin number
  ,888: {video: "rewards/omni2.mp4",images:["rewards/codex.png"]}
  ,8585: {video: "rewards/peeweereal.mp4",images:["rewards/left.gif"]}
  ,1919: {video: "rewards/quotidian.mp4",images:["http://knucklessux.com/PuzzleBox/Secrets/changeling.png"]} //this could legit be the first time a Wanderer finds  the puzzle box and this pleases me
  ,9669: {video: "rewards/reflection.mp4",images:["http://farragofiction.com/TwoGayJokes/Stories/loop2_infoteamandother.png","rewards/thereflection.png","rewards/captain.png"]} //same forwards and backwards with numerals that mirror each other. also: sex number.
  ,2007: {video: "rewards/shot.mp4",images:["http://farragofiction.com/TwoGayJokes/Stories/parkersfriends.png","http://farragofiction.com/TwoGayJokes/Stories/we_cant_expect_god_to_do_all_the_work.png","http://farragofiction.com/DehydrationSim/miku.gif","http://farragofiction.com/TwoGayJokes/Stories/the_clouds_are_open_wide.png"]}
  ,1111: {video: "rewards/twins.mp4",images:["http://farragofiction.com/TwoGayJokes/Stories/training_team.png","rewards/thetwins1.png","rewards/thetwins2.png","http://farragofiction.com/TwoGayJokes/Stories/birds.png"]}
  ,858585: {video: "rewards/tyrfing.mp4",images:["http://farragofiction.com/ZampanioHotlink/tyfing.png","http://farragofiction.com/ZampanioHotlink/panicalittlebit.png"]}
  ,"-1": {video: "rewards/underscore.mp4",images:["http://farragofiction.com/TwoGayJokes/Stories/loop2_infoteamandother.png","http://farragofiction.com/TwoGayJokes/Stories/underscore.png"]} //no you cannot reach them, its for your own protection

  ,6666: {video: "rewards/the_mediums_message.mp4",images:["rewards/medium7.png","rewards/medium6.png","rewards/medium5.png","rewards/medium4.png","rewards/medium3.png","rewards/medium2.png","rewards/medium1.png"] }

}

const blankImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

const findMultiple = (id)=>{
  if(id <0){
    console.log("JR NOTE: vik time lol")
    return mapping["-1"];
  }
  const keys = Object.keys(mapping);
  for(let key of keys){
    if(id % key === 0 && key > 0){
      return mapping[key];
    }
  }

}

const BATHROOM_KEY = "BATHROOM_MAZE";

const incrementLocalStorageByAmount = (KEY, AMOUNT) => {

  let current = localStorage.getItem(KEY);
  if (!current) {
    current = AMOUNT;
  }
  console.log("JR NOTE:", KEY, " was " + current)

  localStorage.setItem(KEY, parseInt(current) + AMOUNT)

}

const handleID = async (id) => {
  const rand = new SeededRandom(id);
  const room = document.querySelector("#room-container");
  //475 by 383 internals

  if (mapping[id]) {
    const hit = mapping[id];
    incrementLocalStorageByAmount(BATHROOM_KEY,100);
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
    }else{
      for(let image of hit.images){
        const video = createElementWithClassAndParent("img", room);
        video.style.position="absolute"
        video.style.top = "0px"
        video.src = image;
        video.width = 475;
      }
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

      const multiple = findMultiple(id);

      if(multiple){
        //so the audio plays
        incrementLocalStorageByAmount(BATHROOM_KEY,10);
        const video = createElementWithClassAndParent("video", room);
        video.src = multiple.video;
        video.height = 475;
        video.style.cursor="pointer";
        video.width = 475;
        video.autoplay = true;
        video.controls = false;
        window.onclick = () => {
          video.play();
        }
        video.loop = true;
        let tmp_images = [...multiple.images];
        rand.nextDouble()> 0.5 && tmp_images.push(blankImage);
        fuckShitUP(rand.getRandomNumberBetween(100,250),room, images,rand.pickFrom(tmp_images) , rand);

      }else{
        fuckShitUP(rand.getRandomNumberBetween(10,100),room, images,images[0] , rand);
      }




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

