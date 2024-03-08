import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-champions-realtimedb-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListDB = ref(database, "endorsementList")

const endorsementAreaEl = document.getElementById("endorsementArea-el")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")
const publishButton = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list")

publishButton.addEventListener("click", function(){
    let endorsementValue = endorsementAreaEl.value
    let fromValue = fromEl.value
    let toValue = toEl.value
    
    if(!(endorsementValue ==="") && !(fromValue==="") && !(toValue==="")){
        let newEndorsement = createEndorsement(endorsementValue, fromValue, toValue)
        push(endorsementListDB, newEndorsement)
        clearInputFields()
    }
})

function createEndorsement(message, sender, receiver){
    let endorsement = {
        "endorsementMessage" : message,
        "from" : sender,
        "to" : receiver,
        "likes" : 0
    }
    return endorsement;
}

onValue(endorsementListDB, function(snapshot) {
    if (snapshot.exists()){
        clearEndorsementList()
        let itemsArr = Object.entries(snapshot.val())
        
        for ( let i = itemsArr.length-1; i>=0;i--){
            let currentItem = itemsArr[i];
           appendEndorsement(currentItem)
        }
    }
})

function clearInputFields() {
    endorsementAreaEl.value="";
    fromEl.value="";
    toEl.value="";
}

function clearEndorsementList() {
    endorsementListEl.innerHTML="";
}

function appendEndorsement(item){
    
    let endorsementID = item[0]
    let endorsementMessage = item[1].endorsementMessage
    let endorsementFrom = item[1].from
    let endorsementTo = item[1].to
    let endorsementLikes = item[1].likes
    
    let newLi = document.createElement("li")
    
    let newEndorsementContainer = document.createElement("div")
    newEndorsementContainer.setAttribute("class","endorsement-container")
    
    let newTo = document.createElement("p")
    let newFrom = document.createElement("p")
    let newLikes = document.createElement("p")
    let newMessage = document.createElement("p")
    newMessage.setAttribute("class", "message")
    
    let newFromLikesContainer = document.createElement("div")
    newFromLikesContainer.setAttribute("class", "from-likes")
    
    newTo.innerText= `To ${endorsementTo}`;
    newFrom.innerText= `From ${endorsementFrom}`;
    newLikes.innerText= `❤ ${endorsementLikes}`;
    newMessage.innerText=endorsementMessage;
    
    newFromLikesContainer.appendChild(newFrom)
    newFromLikesContainer.appendChild(newLikes)
    
    newEndorsementContainer.appendChild(newTo)
    newEndorsementContainer.appendChild(newMessage)
    newEndorsementContainer.appendChild(newFromLikesContainer)
    
    newLi.appendChild(newEndorsementContainer)
    
    let hasBeenLiked=false
    newLi.addEventListener("dblclick", function(){
        if(!hasBeenLiked){
            let exactLocationOfItemInDB = ref(database, `endorsementList/${endorsementID}`)
            incrementLike(exactLocationOfItemInDB)
        }
    })
    
    endorsementListEl.appendChild(newLi)
}

function incrementLike(item){
    console.log(item)
}