 const getRandomNumberBetween =(min ,max) =>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

 const pickFrom=(array)=>{
    return array[getRandomNumberBetween(0, array.length -1)];
}

 const  getRandomSeed =()=> {
	var min = 0;
	var max = 413*612*1025;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



 const shuffle =(array)=> {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

