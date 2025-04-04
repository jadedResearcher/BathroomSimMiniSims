const all_scenes = [];


const trainingStrength = new Scene();
trainingStrength.syncToJSONString(`
  {"title":"Training Time","text":"[PLAYER] needs to get stronger. They learn martial arts and various exercise routines to get their noodle-like appendages so much more buff.","triggerStatName":"Strength","triggerMax":3,"triggerMin":0,"bgAbsoluteSrc":"http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png","resultStatName":"Strength","resultChangeValue":1}
  `);
all_scenes.push(trainingStrength);
