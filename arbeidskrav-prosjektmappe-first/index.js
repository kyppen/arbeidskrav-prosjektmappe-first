//Village building simulator
//Javascript written by Sondre Fagerhus
//Started 10.12.2022
//CSS and HTML has been written by Høyskolen i Kristiania.

const interface = document.getElementById("interface")

const hp = document.getElementById("life-bar")
const materialInfo = document.getElementById("material-info")

const Output = document.getElementById("output-div")

const tree1 = document.getElementById("tree-1")
const tree2 = document.getElementById("tree-2")
const tree3 = document.getElementById("tree-3")

const mine = document.getElementById("metal-mine")

const hut1Buy = document.getElementById("buy-building-1-btn")
const hut2Buy = document.getElementById("buy-building-2-btn")
const swordBuy = document.getElementById("buy-sword-btn")

const buildingOutput = document.getElementById("building-div")

const changingCharacter = document.getElementById("warrior-1")

const monsterOutput = document.getElementById("monster-div")


//these variables are the default resources the user starts with
let treverk = 0;
let metall = 0;
let hut1Count = 0;
let hut2Count = 0;
let bygninger = 0;
let playerhp = 300;

let characterSelectCounter = 1

// this controls the damage the user can deal and checks if they already have upgraded their weapon
let swordHasBeenUpgraded = false;
let styrke = 10;
let chanceOfBeingAttacked;
let amountOfEnemys;

//This will start counting from 1 and then upwards since it makes more sense from a player perspective
let totalActions = 1;

//these variables are for ease of changing the resources the player recieves
let cuttingWoodReward = 25;
let miningForMaterialsReward = 10;

// Costs of buying upgrades/huts
let hut1CostWood = 50;
let hut1CostMetal = 10;
let hut2CostWood = 150;
let hut2CostMetal = 30;
let swordMetalCost = 200;

//Controls the attack damage of the player, this can be upgrades to be 40 with the sword upgrade.

//counting how many times each tree has been clicked to make sure we can removed it 
//there is probably a better way of doing this
let tree1Count = 0;
let tree2Count = 0;
let tree3Count = 0;
let noMoreTreeResources = false

//this is an array for storing the users recent actions and displaying it on screen
let logArray = []

//this is for combat
let underAttack = false
let monsterDamageMultiplier = 10; // 10 is default
let monster0Alive = false
let monster1Alive = false
let monster2Alive = false
let monster0Health = 0;
let monster1Health = 0;
let monster2Health = 0;

let monster0Damage = 0;
let monster1Damage = 0;
let monster2Damage = 0;



//This function will be responsible for updating the users current materials.
//This will be run in functions that affect materials.
//This can also run the updateOutput function so we can be lazy and repeat ourself less.
function updateMaterials(){
    totalActions += 1
    materialInfo.innerHTML = `Treverk: ${treverk} enheter Metall: ${metall} enheter Antall bygninger: ${bygninger}  Styrke: ${styrke}`
    hp.innerHTML = playerhp
    updatingPlayerHP()
    updateOutput()
    checkingIfTheGameIsDone()
}

//This will display the a log to the user of events

function updatingPlayerHP(){
    hp.style.width = `${playerhp}px`
    if (playerhp <= 0){
        alert("You have died! click f5 to restart the game if you dare!")
    }
}

//this will check if the game can still run

function checkingIfTheGameIsDone(){
    if (noMoreTreeResources === true && treverk === 0){
    alert("The game is over, you have successfully built your village and defended it from savage beasts!")
    alert("If this was too easy, you can change the monsterDamageMultiper if you dare!")
    }else{
        checkingIfThereAreMoreTrees()
    }
}

//this checks if the user can get more tree resources if they cant and they have no more tree then the game is over since the village is built
function checkingIfThereAreMoreTrees(){
    //console.log(`${tree1Count} ${tree2Count} ${tree3Count}`)
    if (tree1Count === 10 && tree2Count === 10 && tree3Count === 10){
        noMoreTreeResources = true
    }else{
        noMoreTreeResources = false
    }
}

//this will update the log at the buttom of the screen
//I limited this to 5 since the page would keep expanding if i didnt.


function updateOutput(){
    Output.innerHTML = `<div></div>`
    if (logArray.length < 5){
        //console.log(`updateOutput function: If statement is running `)
        for (let i = 0; i < logArray.length; i++){
            Output.innerHTML += `<ul>${logArray[i]}</ul>`   
        }
    }else{
        //console.log(`updateOutput function: Else statement is running`)    
        for (let i = 0; i < 5; i++){
            Output.innerHTML += `<ul>${logArray[i]}</ul>`
        }
    }       
}

//You can click on your character if you want to change the sprite. Probably a simpler way to do this.

function changingCharacterSprite(){
    //console.log("I've been clicked!")
    characterSelectCounter += 1
    if (this.id === "warrior-1" && characterSelectCounter % 2 === 0){
        changingCharacter.src = "images/warrior2.png"
    }else if(this.id ==="warrior-1" && characterSelectCounter % 2 != 0) {
        changingCharacter.src = "images/warrior.png"

    }
}

//collectWood controls resource gathering for trees and limits it to 10 clicks per tree
//This will also check if the user is in combat so it wont work if combat is set to true

function collectWood(){
    if (underAttack === false){
        chanceOfBeingAttacked = Math.random();
        //console.log(`${chanceOfBeingAttacked}`)
        if (chanceOfBeingAttacked < 0.2){
            //console.log("player has been attacked so they shouldnt get materials")
            underAttack = true
            spawnEnemies()
        }
        if (this.id === "tree-1" || this.id === "tree-2" || this.id === "tree-3"){
            treverk += cuttingWoodReward;
            logArray.unshift(`${totalActions} : You chop some trees. Rewards: ${cuttingWoodReward}`)
            //Output.innerHTML += `<li>something</li>`
            updateMaterials()
            if (this.id === "tree-1"){
                tree1Count += 1;
                //console.log(`tree1 ${tree1Count}`)
                if(tree1Count > 9){
                    tree1.style.display = "none";       
                    //console.log("tree1 should have been removed") 
                }
            }
            else if (this.id === "tree-2"){
                tree2Count += 1;
                //console.log(`tree2 ${tree2Count}`)
                if (tree2Count > 9){
                    tree2.style.display = "none";
                    //console.log("tree2 should have been removed")
                }
            }
            else if (this.id === "tree-3"){
                tree3Count += 1;
                //console.log(`tree1${tree3Count}`)
                if (tree3Count > 9){
                    tree3.style.display = "none";
                    //console.log("tree3 should have been removed")
                }
            }
        }            
    }
    if(underAttack === true){
        logArray.unshift(`${totalActions}: You must deal with the monsters before you can do any action!`)
        updateMaterials()
    }
}

//this is responsible for giving the player minerals and rolls the dice to see if monsters appear.


function collectMinerals(){
    //console.log("collectMinerals has been activated")
    if (this.id === "metal-mine" && underAttack === false){
        //console.log("if statement was a sucess")

        //rolling the dice to see if the player gets attacked
        chanceOfBeingAttacked = Math.random();
        //console.log(`${chanceOfBeingAttacked}`)
        if (chanceOfBeingAttacked < 0.2){
            //console.log("player has been attacked so they shouldnt get materials")
            underAttack = true
            spawnEnemies()

        }if (underAttack === false){
            metall += miningForMaterialsReward;
            logArray.unshift(`${totalActions} :  You venture into the mine. Reward ${miningForMaterialsReward}: `)
            updateMaterials()
            //console.log("player is not under attack so player gets materials")

        }
    }
    if(underAttack === true){
        logArray.unshift(`${totalActions}: You must deal with the monsters before you can do any action!`)
        updateMaterials()
    }
}

//reponsible for hut building

function buyHut1(){
    if (underAttack === false){
        if (this.id === "buy-building-1-btn"){
            //console.log("buyHut1 has been activated")
            if (hut1CostWood <= treverk && hut1CostMetal <= metall){
                //console.log("Material cost passed")
                hut1Count += 1;
                bygninger = hut1Count + hut2Count;
                //console.log(`total huts: ${bygninger}`)
                treverk -= hut1CostWood
                metall -= hut1CostMetal
                buildingOutput.innerHTML += `<img src="images/building-1.png">`
                //console.log(`hut1 count${hut1Count}`)
                //console.log(`hut2 count${hut2Count}`)

                updateMaterials()
            }
        }
    }
    if(underAttack === true){
        logArray.unshift(`${totalActions}: You must deal with the monsters before you can do any action!`)
        updateMaterials()
    }
}
//reponsible for hut building

function buyHut2(){
    if (underAttack === false){
        if (this.id === "buy-building-2-btn"){
            //console.log("buyHut2 has been activated")
            if (hut2CostWood <= treverk && hut2CostMetal <= metall){
                //console.log("Material cost passed")
                hut2Count += 1;
                bygninger = hut1Count + hut2Count;
                //console.log(`total huts: ${bygninger}`)
                treverk -= hut2CostWood
                metall -= hut2CostMetal
                buildingOutput.innerHTML += `<img src="images/building-3.png">`
                //console.log(`hut1 count${hut1Count}`)
                //console.log(`hut2 count${hut2Count}`)
                updateMaterials()
            }
        }
    }
    if(underAttack === true){
        logArray.unshift(`${totalActions}: You must deal with the monsters before you can do any action!`)
        updateMaterials()
    }
}

//responsible for sword buying

function buySword(){
    if (underAttack === false){
        if (this.id === "buy-sword-btn"){
            //console.log("buySword has been activated")
            if (swordMetalCost <= metall && swordHasBeenUpgraded === false){
                styrke = 40;
                swordHasBeenUpgraded = true;
                styrke = 40;
                metall -= swordMetalCost
                updateMaterials()
            }else{
                alert("You have already upgraded your sword")
            }
        }
    }
    if(underAttack === true){
        logArray.unshift(`${totalActions}: You must deal with the monsters before you can do any action!`)
        updateMaterials()
    }
}

//rolls the dice to see how many enemys spawn

function amountOfEnemies(){
    if (underAttack === true){
        enemyCount = Math.floor(Math.random() * (3-1 +1) + 1)
        //console.log(`AmountOfEnemys should return: ${enemyCount}`)
        return enemyCount;
        }
    }

//Spawns the enemies

function spawnEnemies(){
    amountOfEnemies()
    for (let i = 0; i < enemyCount; i++){
        monsterOutput.innerHTML += `<img id=monster${i} src="images/cute-wolfman.png">`
        logArray.unshift(`${totalActions}: A monster has appeared!`)
        //console.log("something")
        updateMaterials()
    }
    //console.log(enemyCount)
    settingUpEnemies()

}

//sets up the stats of the enemies so we can have multiple rounds of battles.
function settingUpEnemies(){
    if (enemyCount === 3){
        monster0Health = 40;
        monster1Health = 40;
        monster2Health = 40;
        var monster0 = document.getElementById("monster0")
        var monster1 = document.getElementById("monster1")
        var monster2 = document.getElementById("monster2")
        monster0.onclick = combat
        monster1.onclick = combat
        monster2.onclick = combat
        monster0Alive = true
        monster1Alive = true
        monster2Alive = true
    }else if (enemyCount === 2){
        monster0Health = 40;
        monster1Health = 40;
        var monster0 = document.getElementById("monster0")
        var monster1 = document.getElementById("monster1")
        monster0.onclick = combat
        monster1.onclick = combat
        monster0Alive = true
        monster1Alive = true
    }else if (enemyCount === 1){
        monster0Health = 40;
        var monster0 = document.getElementById("monster0")
        monster0.onclick = combat
        monster0Alive = true
    }
    //console.log(monster0Health)
    //console.log(monster1Health)
    //console.log(monster2Health)
}

//This is the combat system
function combat(){
        if (underAttack === true){
            if (this.id === "monster0"){                
                monster0Health -= styrke
                monster0Damage = Math.floor(Math.random() * monsterDamageMultiplier)
                playerhp -= monster0Damage
                logArray.unshift(`${totalActions}: You deal ${styrke} to the monster1, it now has ${monster0Health} hp left, the monster managed to hit you for ${monster0Damage}`)
                updateMaterials()
            }else if (this.id == "monster1"){
                monster1Health -= styrke
                monster1Damage = Math.floor(Math.random() * monsterDamageMultiplier)
                playerhp -= monster1Damage
                logArray.unshift(`${totalActions}: You deal ${styrke} to the monster2, it now has ${monster1Health} hp left. the monster managed to hit you for ${monster1Damage}`)
                updateMaterials()
                //console.log(monster1Health)
            }else if (this.id === "monster2" ){
                monster2Health -= styrke
                monster2Damage = Math.floor(Math.random() * monsterDamageMultiplier)
                playerhp -= monster2Damage
                logArray.unshift(`${totalActions}: You deal ${styrke} to the monster3, it now has ${monster2Health} hp left, the monster managed to hit you for ${monster2Damage}`)
                updateMaterials()
                //console.log(monster2Health)
            }
            if (monster0Health === 0 && monster0Alive === true){
                monster0.style.opacity = "0%"
                //console.log("monster0 dies")
                monster0Alive = false
            }
            if (monster1Health === 0 && monster1Alive === true){
                monster1.style.opacity = "0%"
                //console.log("monster1 dies")
                monster1Alive = false
            }
            if (monster2Health === 0 && monster2Alive === true){
                monster2.style.opacity = "0%"
                //console.log("monster2 dies")
                monster2Alive = false
            }
            if (monster0Alive === false && monster1Alive === false && monster2Alive === false){
                underAttack = false
                monsterOutput.innerHTML = ""
            }
        }
    }

tree1.onclick = collectWood
tree2.onclick = collectWood
tree3.onclick = collectWood

mine.onclick = collectMinerals

hut1Buy.onclick = buyHut1
hut2Buy.onclick = buyHut2
swordBuy.onclick = buySword

changingCharacter.onclick = changingCharacterSprite









