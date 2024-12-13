
    const TYPING_KEY = "SLAUGHTER_BREAKDOWN";


    let current_index = 0;
    let minigame;
    let terminal;
    let saveData = [];




    const saveCurrentData = () => {
      localStorage.setItem(TYPING_KEY, JSON.stringify(saveData))
    }

    const loadSaveData = () => {
      saveData = JSON.parse(localStorage.getItem(TYPING_KEY));

      if (!saveData) {
        saveData = [];
        saveCurrentData();
      }

    }

    const levelSelect = () => {

      const terminal = document.querySelector("#terminal");

      const div = createElementWithIdAndParent("div", terminal);
      div.innerHTML = `
  
   <p>${saveData.length} out of ${stories.length} Levels Unlocked! Click one to resume gameplay from it! Don't worry about trying to do all of them in one sitting, your level progress will be saved!</p>


  `;



      const parent = createElementWithIdAndParent("ol", terminal);

      for (let index = 0; index < saveData.length; index++) {
        let value = saveData[index];
        const ele = createElementWithIdAndParent("li", parent);
        ele.innerHTML = `<a href = '#'>${getTimeStringBuff(new Date(value))}</a>`;
        ele.onclick = () => {
          loadVocabularyFromPreviousLevels(index);
          loadPassword(index);
        }
      }


      if (saveData.length !== stories.length) {
        const ele = createElementWithIdAndParent("li", parent);
        ele.innerHTML = `<a href = '#'>TBD</a>`;
        ele.onclick = () => {
          loadVocabularyFromPreviousLevels(saveData.length)
          loadPassword(saveData.length);
        }
      }


    }


    const makeMiniGame = () => {
      if (!terminal) {
        terminal = document.querySelector("#terminal");
      }
      if (!minigame) {
        const youWon = (tmp) => {
          if (tmp) {
            saveData[current_index] = tmp;
            saveCurrentData();
          } else {
            current_index++;
            if (current_index >= stories.length) {
              alert('you did it')
              window.location.href=window.location.href;
            } else {
              loadPassword(current_index);
            }
          }
        }
        minigame = new TypingMiniGame(terminal, null, youWon);
      }
    }

    const loadPassword = (index) => {

      if (!minigame) {
        makeMiniGame();
      }


      terminal.innerHTML = "";

      current_index = index;
      minigame.parseText(stories[current_index]);
    }

    const loadVocabularyFromPreviousLevels = (up_to_level) => {
      if (!minigame) {
        makeMiniGame();
      }
      for (let i = 0; i < up_to_level; i++) {
        const secret = stories[i];
        console.log("JR NOTE: loading vocab from level", i, secret)
        minigame.parseText(secret, false); //make sure it doesn't try to start the game, just loading the text so i don't have to keep typing common words
      }
    }

    const playTyping = () => {
      const hidden_input_for_mobile = document.querySelector("#hidden-input");
      hidden_input_for_mobile.focus();
      loadSaveData();

      if (saveData.length > 0) {
        levelSelect();
        return;
      }

      const terminal = document.querySelector("#terminal");

      loadPassword(current_index);
    }
    