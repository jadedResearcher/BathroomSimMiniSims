const click = new Audio();
click.src = "http://farragofiction.com/CatalystsBathroomSim/audio_utils/weird_sounds/chip.mp3"
window.onload = ()=>{
    renderTest();
    window.onclick =()=>{
        click.play();
    }

}

const renderTest = ()=>{
    const contents = document.querySelector("#contents");
    const editButton = createElementWithClassAndParent("button", contents);
    editButton.innerText = "Create A Card";
    editButton.onclick = ()=>{
        contents.innerHTML = "";
        const testScene = new Card();
        testScene.renderEditForm(contents);
    }

    const cardSetButton = createElementWithClassAndParent("button", contents);
    cardSetButton.innerText = "View Simple Cardset";
    cardSetButton.onclick = ()=>{
        contents.innerHTML = "";
        genericCardset.render(contents)
    }

    const gameTestButton = createElementWithClassAndParent("button", contents);
    gameTestButton.innerText = "Play Test Game";
    gameTestButton.onclick = ()=>{
        contents.innerHTML = "";
        const game = new Game(genericCardset);
        game.render(contents)
    }

}