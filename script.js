let player;
let playing = false;

const bar = document.getElementById("bar");
const playBtn = document.getElementById("play");
const current = document.getElementById("current");
const durationText = document.getElementById("duration");

function onYouTubeIframeAPIReady(){
  player = new YT.Player('yt', {
    height: '0',
    width: '0',
    videoId: 'V92cBlohd5M',
    playerVars:{
      autoplay: 0,
      controls: 0
    },
    events:{
      onReady: () => {
        setInterval(update, 500);
      }
    }
  });
}

function update(){
  if(!player || !player.getDuration) return;

  const cur = player.getCurrentTime();
  const dur = player.getDuration();

  if(dur){
    bar.style.width = (cur/dur)*100 + "%";
    current.textContent = format(cur);
    durationText.textContent = format(dur);
  }
}

function format(t){
  return Math.floor(t/60)+":"+
         String(Math.floor(t%60)).padStart(2,"0");
}


playBtn.addEventListener("click", () => {
  if(!player) return;

  if(playing){
    player.pauseVideo();
    playBtn.textContent = "▶";
  }else{
    player.playVideo();
    playBtn.textContent = "⏸";
  }
  playing = !playing;
});

function seek(e){
  if(!player) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  player.seekTo(player.getDuration() * percent, true);
}
