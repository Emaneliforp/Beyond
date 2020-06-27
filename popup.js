let inputTask;
let taskList = document.getElementById("taskList");
let tasks = [];
let complete = [];
let images = [];
let sound;
let body = document.getElementById("body");
let total = 0;

//command
getR();

function getR(){
  chrome.storage.sync.get(['tasks'], function(result) {
    tasks = result.tasks;
    addDisplay(tasks);
    console.log(tasks);
    noTask(tasks);
  });
  chrome.storage.sync.get(['complete'], function(result) {
    complete=result.complete;
    updateCompleteTitle();
    if(d){
      d = false;
      displayComplete();
    }
    console.log(complete);
  });
  chrome.storage.sync.get(['images'], function(result) {
    images=result.images;
    console.log(images);
  });
  chrome.storage.sync.get(['sound'], function(result) {
    sound=result.sound;
  });
  chrome.storage.sync.get(['total'], function(result) {
    total=result.total;
  });
}
function setR(){
  chrome.storage.sync.set({tasks: tasks}, function() {
    console.log("setted");
  });
  chrome.storage.sync.set({complete: complete}, function() {
    console.log("setted");
  });
  chrome.storage.sync.set({images: images}, function() {
    console.log("setted");
  });
  chrome.storage.sync.set({sound: sound}, function() {
    console.log("setted");
  });
  chrome.storage.sync.set({total: total}, function() {
    console.log("setted");
  });
  getR();
}

function addDisplay(t){
  taskList.innerHTML="";
  for(let i=0; i<t.length; i++){
    let task = `<div class="taskDisplay">
                  <label class="container taskCheckbox">
                  <input type="checkbox" id=c${i}>
                  <span class="checkmark"></span>
                  <h7>${t[i]}</h7>
                  </label>
                  <img class="remove" id=t${i} src="icons/clear.png">
                <div>`
    taskList.innerHTML+=task;
  }
  loaded();
}

//add
document.getElementById('inputTask').addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode === 13) {
    inputTask = document.getElementById('inputTask').value;
    if(inputTask!=""){
      document.getElementById('inputTask').value="";
      tasks.splice(0,0,inputTask);
      setR();
    }
  }
  // do something
});

//remove
function loaded(){
  let removes = document.getElementsByClassName("remove");
  let finish = document.getElementsByClassName("taskCheckbox");
  for(let i=0; i<removes.length; i++){
    removes[i].addEventListener("click",function(target){
      tasks.splice(target.toElement.id.substring(1),1);
      setR();
    });
    finish[i].addEventListener("click",function(target){
      console.log(target);
      if(target.toElement.id.substring(1)!=""){
        complete.splice(0,0,tasks[target.toElement.id.substring(1)]);
        console.log(complete);
        tasks.splice(target.toElement.id.substring(1),1);
        target.path[2].style.background="#12e3dd";
        total++;
        setTimeout(function(){setR();if(total % 3 == 0)confettiPlay();},1000);
      }
    });
  }
}

//cremove
function cloaded(){
  let cremoves = document.getElementsByClassName("cremove");
  for(let i = 0; i<cremoves.length; i++){
    cremoves[i].addEventListener("click",function(target){
      complete.splice(target.toElement.id.substring(2),1);
      setR();
    });
  }
}

//styling
let inputBar = document.getElementById("inputBar");
let stillIn = false;
inputBar.addEventListener("mouseenter", function(){
  inputBar.style.background = "#f1f3f4";
}, false);
document.getElementById("inputTask").addEventListener("mouseenter", function(){
  stillIn = true;
}, false);
inputBar.addEventListener("mouseout", function(){
    setTimeout(function() {
      if(!stillIn){
      inputBar.style.background = "";
      }
    }, 500);
})
document.getElementById("inputTask").addEventListener("mouseout", function(){
  stillIn = false;
})

function noTask(tasks){
  if(tasks.length == 0){
    taskList.innerHTML+=`<div class="noTask">
                            <div><img src="/icons/get_started128.png">
                            <div id="gj">Good job!</div>
                            <div >You have completed your tasks.</div></div>`
  }
}
//complete
let completeTitle = document.getElementById("completeTitle");
let completeSection = document.getElementById("completeSection");
let completeList = document.getElementById('completeList');
let d = false;
let ch = 36;

function updateCompleteTitle(){
  completeTitle.innerHTML=`Completed (${complete.length})`;
}

completeTitle.addEventListener("click",function(){displayComplete()});

function displayComplete(){
  if(!d){
    completeSection.style.height = "440px";
    completeList.style.height="400px";
    completeList.innerHTML="";
    for(let i=0; i<complete.length; i++){
      let task = `<div class="completeDisplay"><h7>${complete[i]}</h7><img class="cremove" id=ct${i} src="icons/clear.png"><div>`
      completeList.innerHTML+=task;
    }
    cloaded();
    d=true;
  }
  else{
    completeList.innerHTML="";
    completeList.style.height="auto";
    taskList.style.height = "auto";
    completeSection.style.height = "auto";
    d=false;
  }
}

//confetti
let confettiTypesList = [["holy",8000],["spin",9900],["nyan",8000]];
function confettiPlay(){
  let randcon = Math.floor(Math.random()*confettiTypesList.length);
  let con = document.createElement("div");
  con.setAttribute('id',"con");
  body.appendChild(con);
  run = true;
  setup(randcon);
  setTimeout(function(){body.removeChild(con),run=false}, confettiTypesList[randcon][1], /*music()*/);
}
function music(){
  if(sound){
    let arr = [];
    arr[Math.floor(Math.random()*arr.length)].play();
  }
}
//setting
let settingBtn = document.getElementById("settingBtn");
let settingOn = false;
settingBtn.addEventListener("click",function(){displaySetting()});
function displaySetting(){
  if(!settingOn){
    let settingModal = document.createElement("div");
    settingModal.setAttribute('id',"settingModal"); 
    settingModal.innerHTML+=`<div id="settingTitle" class="title">Setting</div><div id="settingContent"><div class="headline">Confetti Images</div>
    <div>Write the file name and type according to the image in the images folder to get displayed. <br/>(Please separate names with ", ")</div>
    <div contenteditable spellcheck="false" id="imagesValue""></div>
        <label class="container" >
          <input type="checkbox" id="soundValue">
          <span class="checkmark" ><div class="headline">Music</div></span>
        </label>
    <div id="settingSave">Save</div></div>`;
    body.appendChild(settingModal);
    let imagesValue = document.getElementById("imagesValue");
    imagesValue.innerHTML+= `${images.join(', ')}`;
    let soundValue = document.getElementById("soundValue");
    soundValue.checked = sound;
    settingOpened();
    settingOn = true;
  }
  else{
    let imagesValue = document.getElementById("imagesValue").innerHTML;
    images = imagesValue.trim().split(", ");
    console.log(images);
    let soundValue = document.getElementById("soundValue");
    sound = soundValue.checked;
    let settingModal = document.getElementById("settingModal");
    body.removeChild(settingModal);
    settingOn = false;
  }
}
function settingOpened(){
  let settingTitle = document.getElementById("settingTitle");
  settingTitle.addEventListener('click', function(){displaySetting()});
  let settingSave = document.getElementById("settingSave");
  settingSave.addEventListener('click',function(){console.log("click");displaySetting();setR();})
}
