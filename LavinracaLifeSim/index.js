window.onload = ()=>{
    renderTest();

}

const renderTest = ()=>{
    const contents = document.querySelector("#contents");
    const editButton = createElementWithClassAndParent("button", contents);
    editButton.innerText = "Create A Card";
    editButton.onclick = ()=>{
        contents.innerHTML = "";
        const testScene = new Scene();
        testScene.renderEditForm(contents);
    }

    const cardSetButton = createElementWithClassAndParent("button", contents);
    cardSetButton.innerText = "View Simple Cardset";
    cardSetButton.onclick = ()=>{
        contents.innerHTML = "";
        genericCardset.render(container)
    }

}