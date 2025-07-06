const all_scenes = [];

const trainingStrength = new Card();
trainingStrength.syncToJSON(
  { "title": "Training Time", "text": "[PLAYER] needs to get stronger. They learn martial arts and various exercise routines to get their noodle-like appendages so much more buff.", "costStatName": "", "singleUse": false, "costStatValue": 0, "bgAbsoluteSrc": "http://farragofiction.com/LifeSim/images/LifeSimBGs/AlternianDesert.png", "resultStatName": "Strength", "resultChangeValue": 1 });
all_scenes.push(trainingStrength);

/*
const trainingStrength = new Card();
trainingStrength.syncToJSON({});
all_scenes.push(trainingStrength);
*/

const findPotato = new Card();
findPotato.syncToJSON(
  { "title": "Find a Potato", "text": "[PLAYER] trips face first and discovers a RUDE POTATO peeking out of the ground.Their Potato, now.", "costStatName": "", "singleUse": true, "autoPlay": true, "costStatValue": 0, "bgAbsoluteSrc": "http://farragofiction.com/LifeSim/images/LifeSimBGs/AlternianCliff.png", "resultStatName": "Potato", "resultChangeValue": 1 }
);
all_scenes.push(findPotato);

const eatPotato = new Card();
eatPotato.syncToJSON(
  { "title": "Eat A Potato", "text": " [PLAYER] eats a delicious potato, raw, like an apple.", "costStatName": "Potato", "singleUse": false, "autoPlay": false, "costStatValue": 1, "bgAbsoluteSrc": "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png", "resultStatName": "Strength", "resultChangeValue": 2 }
);
all_scenes.push(eatPotato);

const superTrain = new Card();
superTrain.syncToJSON(
  { "title": "Super Training Time", "text": "[PLAYER] suddenly comes to a realization. It's all connected! Strength is just the measure of how much willpower one can exert over ones muscle. They push past where they thought there limits were to reach new heights.", "costStatName": "", "singleUse": false, "costStatValue": 0, "bgAbsoluteSrc": "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png", "resultStatName": "Strength", "resultChangeValue": 3, "triggerStatName": "Strength" })
all_scenes.push(superTrain);


const fightEvilWithStrength = new Card();
fightEvilWithStrength.syncToJSON(
  { "title": "Fight Evil", "text": "[PLAYER] uses their STRENGTH to fight Evil!", "costStatName": "Strength", "singleUse": false, "costStatValue": 3, "bgAbsoluteSrc": "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png", "resultStatName": "Evil", "resultChangeValue": -3 });
all_scenes.push(fightEvilWithStrength);


const evilRises = new Card();
evilRises.syncToJSON(
  { "title": "Evil Rises", "text": "[PLAYER] watches helplessly as Evil begins to spread across the land...", "costStatName": "", "singleUse": true, "costStatValue": 0, "bgAbsoluteSrc": "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png", "resultStatName": "Evil", "resultChangeValue": 1 });
all_scenes.push(evilRises);

const victory = new Card();
victory.syncToJSON(
  { "title": "Victory", "text": "[PLAYER] has finally defeated the Evil! They celebrate a lasting peace!", "costStatName": "Strength", "singleUse": true, "costStatValue": 6, "bgAbsoluteSrc": "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png", "resultStatName": "Victory", "resultChangeValue": 1 });
all_scenes.push(victory);


const defeat = new Card();
defeat.syncToJSON(
  { "title": "Defeat", "text": "[PLAYER] kneels in defeat as the Evil spreads over them, changing them into their new Dark Champion.", "costStatName": "Evil", "singleUse": true, "autoPlay": true, "costStatValue": 13, "bgAbsoluteSrc": "http://farragofiction.com/LifeSim/images/LifeSimBGs/58.png", "resultStatName": "Defeat", "resultChangeValue": 1 });
all_scenes.push(defeat);

