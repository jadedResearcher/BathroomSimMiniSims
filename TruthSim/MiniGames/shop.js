/*
very lore heavy, just lil cutscenes of characters confession to witherby
need to find that confession fic IC wrote and feed on it


*/

const fruit_source = `http://farragofiction.com/DollSource/images/Fruit/Body/`;
let fruit;

const getFruit = async()=>{
    fruit = await getImages(fruit_source);
}



class ShopMiniGame extends MiniGame {
    constructor() {
        super(SHOPMINIGAME);
        getFruit();
    }

    valuableCustomer = (ele, callback) => {
        const button = createElementWithClassAndParent("button", ele);
        button.innerText = "Thank You Valuable Customer: Click Here To Complete This Room";
        button.onclick = () => {
            callback(globalDataObject.currentMaze);
            renderMazeTab();
        }

    }

    sellRooms = (ele, callback) => {
        console.log("JR NOTE: sell rooms")
        const sales_floor = createElementWithClassAndParent("div", ele, "sales-floor");
        sales_floor.innerText = "COMING SOON!!!";

    }

    sellFacts = (ele, callback) => {
        console.log("JR NOTE: remove closer eats babies, she'd never reveal that, but need it for testing")
        //TODO list of facts closer can sell, each one costs exponentially more, start with eye killer fact
        const unlockedFacts = getAllUnlockedFactTitles();
        const sales_floor = createElementWithClassAndParent("div", ele, "sales-floor");

        let index = 0;
        let anythingInShop = false;
        //this is specifically pulling from the bathroom sim to link the two for wastes. if you didn't know this existed before, well, now you do
        const audio = new Audio("http://farragofiction.com/CatalystsBathroomSim/184438__capslok__cash-register-fake.wav");
        for (let fact of factsForSale) {
            const price = 2 ** index;
            index++;
            if (price <= globalDataObject.truthCurrentValue) {
                const button = createElementWithClassAndParent("button", sales_floor, 'shop-button');
                const purchased = unlockedFacts.includes(fact.title);
                button.innerHTML = `<p>${fact.title.substring(fact.length - 21, fact.length)} </p>`
                if (purchased) {
                    button.remove();
                } else {
                    anythingInShop = true;
                    button.innerHTML += `<p style="text-align:center;font-weight: bolder;">${price} Truth</p>`;
                    button.onclick = () => {
                        button.remove();
                        purchaseFactFromCloser(price, fact);
                        this.valuableCustomer(ele, callback); //she'll spam it if you buy a lot, its fine
                    }
                }
            }
        }
        if (!anythingInShop) {
            const empty = createElementWithClassAndParent("div", sales_floor);
            empty.innerText = "No Items In Shop??? How did you afford them all?";
            this.valuableCustomer(ele, callback);

        }
    }

    sellKeys = (ele, callback) => {
        //TODO list of facts closer can sell, each one costs exponentially more, start with eye killer fact
        const unlockedFacts = getAllUnlockedFactTitles();
        const sales_floor = createElementWithClassAndParent("div", ele, "sales-floor");

        let anythingInShop = false;
        //this is specifically pulling from the bathroom sim to link the two for wastes. if you didn't know this existed before, well, now you do
        const audio = new Audio("http://farragofiction.com/CatalystsBathroomSim/184438__capslok__cash-register-fake.wav");
        for (let index = 0; index < 31; index++) {//halloween number
            const price = 2 ** index;
            index++;
            if (price <= globalDataObject.truthCurrentValue && globalDataObject.keysBoughtFromCloser < index) {
                const button = createElementWithClassAndParent("button", sales_floor, 'shop-button');
                const skip_button = createElementWithClassAndParent("img", button, "skip-button");
                skip_button.src = "images/KeyForFriend.png";

                anythingInShop = true;
                button.innerHTML += `<p style="text-align:center;font-weight: bolder;">${price} Truth</p>`;
                button.onclick = () => {
                    button.remove();
                    purchaseKeyFromCloser(price);
                    this.valuableCustomer(ele, callback); //she'll spam it if you buy a lot, its fine
                }

            }
        }
        if (!anythingInShop) {
            const empty = createElementWithClassAndParent("div", sales_floor);
            empty.innerText = "No Items In Shop??? How did you afford them all?";
            this.valuableCustomer(ele, callback);
        }
    }

    trickster = (ele, callback) => {
        const header = document.querySelector(".game-header h1");
        header.classList.add("rainbowTextAnimated")
        header.innerText = "SELL ME FRUIT!!!!!!!!!!! TRUTH FOR FRUIT!!!!!!!!!!! COMMERCE!!!!!!!!!!!!"
        //basically staticky fruit goes everywhere like in fruit sim and if you click one you get some truth
        const bounce_container = createElementWithClassAndParent("div", ele, `bounce-container`);


        const bounceTime = (canvas) => {
            console.log("JR NOTE: bounce time")

            let animation_frame_sheet = transformCanvasIntoAnimationWithTransform(canvas, [turnToPureStatic, turnToPartialStatic, turnToPureStatic]);
            ele.append(animation_frame_sheet);

            ele.append(canvas);
            //multiple things we wanna do. first is just bounce it around as is
            //then give it three frames of animation (same as LOGAC) that makes it staticky

            /*
            <div class="el-wrap x">
              <div class="el y"></div>
            </div>
            */
            //ternary is so i can debug it without it zipping about
            const xAnimations = false ? ["x-turtle"] : ["x", "x-fast", "x-zip", "x-turtle"];
            const yAnimations = false ? ["y-turtle"] : ["y", "y-fast", "y-zip", "y-turtle"];
            const elWrap = createElementWithClassAndParent("div", bounce_container, `el-wrap ${pickFrom(xAnimations)}`);
            elWrap.style.left = `${getRandomNumberBetween(0, 100)}vw`;
            elWrap.style.top = `${getRandomNumberBetween(0, 100)}vh`;
            const el = createElementWithClassAndParent("div", elWrap, `el ${pickFrom(yAnimations)}`);
            el.style.width = "50px";
            el.style.height = "50px";
          
            const graphic = createElementWithClassAndParent("div", el, `animated_bg`);
            graphic.style.backgroundImage = `url(${animation_frame_sheet.toDataURL()})`;
            const audio = new Audio("audio/fx/275015__wadaltmon__bite-apple.wav");
            elWrap.onclick = () => {
                audio.play();
                const dmg = createElementWithClassAndParent("div", elWrap, "damage-counter");
                const amount = 11 * globalDataObject.truthPerSecond;
                increaseTruthBy(amount);
                dmg.innerText = `+ Tasty Tasty Fruit! Have Truth! ${amount} Truth For Fruit!!!`;
                elWrap.remove();
                if(!document.querySelector(".el")){
                    this.valuableCustomer(ele, callback);
                }
            }
          
            //JR NOTE: to debug
            //bounce_container.append(animation_frame_sheet);
          
          }

        const addFruit = async () => {
            const image = fruit_source + pickFrom(fruit)
            let canvas = document.createElement("canvas");
            canvas.width = 50;
            canvas.height = 50;
            await kickoffImageRenderingToCanvas(image, canvas);
            bounceTime(canvas);


        }

        const max = 113;
        for(let i = 0;  i< max; i++){
            addFruit();
        }

    }


    startGame = (ele, room, callback) => {
        globalBGMusic.src = "http://farragofiction.com/CatalystsBathroomSim/seeking_help.mp3";
        globalBGMusic.loop = true;
        globalBGMusic.play();
        const parent = createElementWithClassAndParent("div", ele, "shop");

        const kiosk = createElementWithClassAndParent("img", parent, "shop-kiosk");
        kiosk.src = "images/expobyfriendLARGE.png";

        const closer = createElementWithClassAndParent("img", parent, "shop-keep");
        closer.src = "images/closer_by_the_guide.png";
        if (this.fact && this.fact.title.includes("The Closer Provides You With Best Value KEYS")) {
            this.sellKeys(ele, callback);
        } else if (this.fact && this.fact.title.includes("The Closer Provides You With Best Value ROOMS")) {
            this.sellRooms(ele, callback);
        } else if (this.fact && (this.fact.title.includes("The Closer Eats Babies") || this.fact.title.includes("The Closer Is Addicted To Fruit"))) {
            closer.src = "http://farragofiction.com/ZampanioHotlink/trickster_closer_transparency.gif";
            this.trickster(ele, callback);
        } else {
            this.sellFacts(ele, callback);
        }



    }

    render = (ele, room, callback) => {
        //there is no way to beat this one without a keyz
        this.initializeRender(ele);
        const container = this.setupGameHeader(ele, room, callback, "The Closer Is Here To Meet All Your Shopping Needs", undefined)

    }
}