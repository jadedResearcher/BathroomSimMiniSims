


 class TypingMiniGame {
    unique_word_map;
    callback;
    audio = new Audio("audio/511397__pjhedman__se2-ding.mp3");
    content
    wordsLeft;
    parent;
    sentences;
    //what word are you typing
    current_index = 0;
    sentenceListEle;
    timerEle;
    sentenceEle;
    original_text;
    timer;//id of the timer
    sorted_word_list; //sorted by length
    startTime;

    constructor(parent, original_text, callback) {
        this.callback = callback;
        this.parent = parent;
        this.original_text = `${original_text}`;//being lazy and avoiding having a reference to this get put here if im gonna mutate it
        this.content = createElementWithIdAndParent("div", parent);
        this.sentenceEle = createElementWithIdAndParent("div", this.parent);
        this.timerEle = createElementWithIdAndParent("div", this.parent);

        this.sentenceEle = createElementWithIdAndParent("div", this.parent);

        this.sentenceListEle = createElementWithIdAndParent("div", this.parent);

        this.wordsLeft = createElementWithIdAndParent("div", this.parent);

        this.content.style.fontSize = "42px";
        this.unique_word_map = {};
        this.sentences = [];
        this.startTime = new Date();
        this.sorted_word_list = [];
        if(original_text){
         this.parseText(original_text);
        }

    }

    wordsRemaining = () => {
        let ret = 0;
        for (let word of Object.values(this.unique_word_map)) {
            if (!word.typed) {
                ret++;
            }
        }
        return ret;
    }

    parseText = (text, start = true) => {
        this.original_text = `${text}`;
        this.content.remove();
        this.timerEle.remove();
        this.sentenceEle.remove();
        this.sentenceListEle.remove();
        this.wordsLeft.remove();
        this.wordsLeft = createElementWithIdAndParent("div", this.parent);
        this.timerEle = createElementWithIdAndParent("div", this.parent);

        this.content = createElementWithIdAndParent("div", this.parent);

        this.sentenceEle = createElementWithIdAndParent("div", this.parent);
        this.sentenceListEle = createElementWithIdAndParent("div", this.parent);

        this.sentenceEle.innerHTML = "<hr><p><i>The words you've typed could, in theory, make a sentence such as these:</i></p>";
        this.content.style.fontSize = "42px";

        this.current_index = 0;
        const first_pass_sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
        let probable_sentences = [];
        if(first_pass_sentences){
            for(let sentence of first_pass_sentences){
                probable_sentences = probable_sentences.concat(sentence.split("\n"));
            }
        }


        if (probable_sentences) {
            this.sentences = probable_sentences.filter((item)=>item.trim()!=="" && item.trim() !== '"').map((sentence) => { return { text: sentence.trim(), displayed: false } })
        } else {
            this.sentences = [];
        }

        

        text = text.replaceAll(/\n/g, " ");

        const split_words = text.split(" ");

        for (let w of split_words) {

            let word = w.replace(/[.,\/#!?$%\^&\*;:{}=_`~()"]/g, "").toLowerCase().trim();
            if (word.trim() !== "") {
                if (Object.keys(this.unique_word_map).includes(word.toLowerCase())) {
                    this.unique_word_map[word] = { word: word, typed: this.unique_word_map[word].typed, times_seen: this.unique_word_map[word].times_seen + 1 }
                } else {
                    //if start is false, then assume these were typed already adn are being loaded from a save file
                    this.unique_word_map[word] = { word: word, typed: !start, times_seen: 1 }
                }
            }

        }

        this.sorted_word_list = Object.keys(this.unique_word_map).sort((a, b) => { return a.length - b.length });
       
       if(start){
        this.startTime = new Date();
        this.timer = setInterval(this.timerFunction, 50);
        this.displayGame();
       } 
    }

    checkForSentences = () => {
        for (let sentence of this.sentences) {
            if (!sentence.displayed) {
                const split_words = sentence.text.split(" ");

                let readyToDisplay = true;
                for (let w of split_words) {
                    w = w.replaceAll(/\n/g, " ");

                    let word = w.replace(/[.,\/#!?$%\^&\*;:{}=_`~()"]/g, "").toLowerCase().trim();
                    if (word.trim() !== "") {
                        if (Object.keys(this.unique_word_map).includes(word) && !this.unique_word_map[word].typed) {

                            readyToDisplay = false;
                            break;
                        }
                    }

                }

                if (readyToDisplay) {
                    this.audio.play();
                    //display in reverse order so you can always see your newest Unlock
                    this.sentenceListEle.innerHTML = `<li>${sentence.text}</li>${this.sentenceListEle.innerHTML}`;
                    sentence.displayed = true;
                }
            }
        }
    }

    //set the current word as typed, check if the next word has been typed yet
    //if it has, go to the next word
    //if it hasn't, display the typing minigame
    //and if there ISN"T a next word, callback to your parent
    nextWord = () => {
        const current_word = this.sorted_word_list[this.current_index];
        this.unique_word_map[current_word].typed = true;
        this.wordsLeft.innerHTML = `${this.wordsRemaining()} words remaining in this Practice Level.</p>`;

        this.current_index++;

        this.checkForSentences();
        //TODO handle checking if theres any sentences, and if so , showcase it
        if (this.current_index >= this.sorted_word_list.length) {
            const time = this.getTimeNumber();

            clearInterval(this.timer);

            const helpfulHint = createElementWithIdAndParent("div", this.content);
            helpfulHint.innerHTML = `<p>You must really believe in these words if you spent so long typing them yourself :) :) :)</p>`;
            helpfulHint.style.fontSize = "18px";
            const button = createElementWithIdAndParent("button", this.content);
            button.className="normal"
            this.callback(time);

            button.onclick = () => {
                this.callback();
            }
            this.audio.play();

            button.innerText = "Load Next Level For Practice";
            const story = createElementWithIdAndParent("div", this.content, undefined, "storyOfSlaughter");

            let lines = this.original_text.split("\n");
            for (let line of lines) {
                story.innerHTML += `<p>${line}</p>`;
            }
  
            return;
        }
        const next_word = this.sorted_word_list[this.current_index];

        //keep 
        if (this.unique_word_map[next_word].typed) {
            this.nextWord();
        } else {
            this.displayGame();
        }
    }

    findFirstIndex = () => {
        const current_word = this.sorted_word_list[this.current_index];
        if (this.unique_word_map[current_word].typed) {
            this.current_index++;
            this.findFirstIndex();
        } else {
            return;
        }
    }

    getTimeNumber = ()=>{
        return (new Date((new Date()) - (this.startTime)).valueOf())

    }

    getTimeString = () => {
        return getTimeStringBuff(new Date((new Date()) - (this.startTime)))
    }

    timerFunction = () => {
        this.timerEle.innerHTML = `${this.getTimeString()}`;
    }

    displayGame = () => {
        this.findFirstIndex();
        this.content.innerHTML = ("");
        this.wordsLeft.innerHTML = `${this.wordsRemaining()} words remaining in this Practice Level.`;
        new WordToType(this.content, this.sorted_word_list[this.current_index], this.nextWord);

    }


}

class WordToType {
    stringTypedSoFar = "";
    stringRemaining;
    callback;
    element;

    constructor(parent, text, callback) {
        this.stringRemaining = text.toLowerCase();
        this.callback = callback;
        this.element = createElementWithIdAndParent("p", parent);
        this.setup();
        this.render();
    }

    listen = (event) => {
        if (event.key.toLowerCase() === this.stringRemaining[0]) {
            this.stringTypedSoFar += event.key.toLowerCase();
            this.stringRemaining = this.stringRemaining.substring(1);
            this.render();
        }
        if (this.stringRemaining.trim() === "") {
            this.teardown();
        }
    }


    setup = () => {
        window.addEventListener('keydown', this.listen);

    }

    teardown = () => {
        window.removeEventListener('keydown', this.listen);
        this.callback();
    }


    render = () => {
        this.element.innerHTML = `<span style="color:white">${this.stringTypedSoFar.toUpperCase()}</span><span>${this.stringRemaining.toUpperCase()}</span>`;
    }
}