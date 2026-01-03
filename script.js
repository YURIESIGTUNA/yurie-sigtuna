let player;
let playing = false;
let isLoop = false;
let flowerCooldown = false;

const bar = document.getElementById("bar");
const playBtn = document.getElementById("play");
const loopBtn = document.getElementById("loop");
const current = document.getElementById("current");
const durationText = document.getElementById("duration");
const status = document.querySelector(".status");
const progress = document.querySelector(".progress");

function onYouTubeIframeAPIReady(){
  player = new YT.Player("yt",{
    height:"0",
    width:"0",
    videoId:"V92cBlohd5M",
    playerVars:{ controls:0 },
    events:{
      onReady:()=>setInterval(update,500),
      onStateChange:onStateChange
    }
  });
}

function update(){
  if(!player || !player.getDuration) return;
  const cur = player.getCurrentTime();
  const dur = player.getDuration();
  if(dur){
    bar.style.width = (cur/dur)*100+"%";
    current.textContent = format(cur);
    durationText.textContent = format(dur);
  }
}

function format(t){
  return Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");
}

function updateStatus(){
  const h = new Date().getHours();
  if(playing){
    status.textContent = h>=22 ? "● LATE NIGHT" : "● LISTENING";
  }else{
    status.textContent = "● IDLE";
  }
}

playBtn.onclick = ()=>{
  if(!player) return;

  if(!playing){
    player.playVideo();
    playBtn.textContent="⏸";
    spawnFlowers(2,4);

    if(!flowerCooldown){
      flowerCooldown=true;
      setTimeout(()=>{
        spawnFlowers(1,2);
        flowerCooldown=false;
      },30000+Math.random()*30000);
    }
  }else{
    player.pauseVideo();
    playBtn.textContent="▶";
  }

  playing=!playing;
  updateStatus();
};

loopBtn.onclick = ()=>{
  isLoop=!isLoop;
  loopBtn.classList.toggle("active",isLoop);
};

function onStateChange(e){
  if(e.data===YT.PlayerState.ENDED && isLoop){
    player.playVideo();
  }
}

progress.onclick = e=>{
  const rect=progress.getBoundingClientRect();
  const percent=(e.clientX-rect.left)/rect.width;
  player.seekTo(player.getDuration()*percent,true);
};

function spawnFlowers(min,max){
  const amount=min+Math.floor(Math.random()*(max-min+1));
  for(let i=0;i<amount;i++) spawnFlower();
}

function spawnFlower(){
  const f=document.createElement("div");
  f.className="flower";
  f.style.left=Math.random()*100+"vw";
  f.style.animationDuration=4+Math.random()*2+"s";
  document.body.appendChild(f);
  setTimeout(()=>f.remove(),6000);
}

updateStatus();
