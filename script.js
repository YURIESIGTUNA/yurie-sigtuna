let player;
let playing = false;
let isLoop = false;
let flowerCooldown = false;
let currentIndex = 0;


const MUTE_RATE = 0.2;


const playlist = [
  { title: "Lữ khách qua thời gian", id: "mdnmmFakN7Y" },
  { title: "Cữu vĩ hồ", id: "bRsqpJUNUnI" },
  { title: "Trả cho anh", id: "qkjZSgK6HTo" },
  { title: "Hẹn hò không yêu", id: "D-ocSsuMETI" }
];


const bar = document.getElementById("bar");
const playBtn = document.getElementById("play");
const loopBtn = document.getElementById("loop");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const current = document.getElementById("current");
const durationText = document.getElementById("duration");
const status = document.querySelector(".status");
const progress = document.querySelector(".progress");
const volSlider = document.getElementById("profileVolume");
const titleText = document.querySelector(".title");


function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt", {
    height: "0",
    width: "0",
    videoId: playlist[currentIndex].id,
    playerVars: { controls: 0 },
    events: {
      onReady: () => {
        titleText.textContent = playlist[currentIndex].title;
        gachaVolume(); 
        setInterval(update, 500);
      },
      onStateChange
    }
  });
}


function gachaVolume() {
  if (!player) return;

  let volume;
  if (Math.random() < MUTE_RATE) {
    volume = 0; 
  } else {
    volume = Math.floor(Math.random() * 101); 
  }

  player.setVolume(volume);
  volSlider.value = volume;
  volSlider.style.setProperty("--vol", volume + "%");
  volSlider.title = volume === 0
    ? "🔇 MUTED (GACHA)"
    : `🎲 Volume: ${volume}%`;
}


function loadSong(index) {
  currentIndex = index;
  player.loadVideoById(playlist[currentIndex].id);
  titleText.textContent = playlist[currentIndex].title;
  playing = true;
  playBtn.textContent = "⏸";
  updateStatus();
}

function nextSong() {
  loadSong((currentIndex + 1) % playlist.length);
}

function prevSong() {
  loadSong((currentIndex - 1 + playlist.length) % playlist.length);
}

function onStateChange(e) {
  if (e.data === YT.PlayerState.ENDED) {
    if (isLoop) {
      player.playVideo();
    } else {
      nextSong();
    }
  }
}


function update() {
  if (!player || !player.getDuration) return;
  const cur = player.getCurrentTime();
  const dur = player.getDuration();
  if (dur) {
    bar.style.width = (cur / dur) * 100 + "%";
    current.textContent = format(cur);
    durationText.textContent = format(dur);
  }
}

function format(t) {
  return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");
}

function updateStatus() {
  const h = new Date().getHours();
  status.textContent = playing
    ? h >= 22 ? "● LATE NIGHT" : "● LISTENING"
    : "● IDLE";
}


playBtn.onclick = () => {
  if (!player) return;
  if (!playing) {
    player.playVideo();
    playBtn.textContent = "⏸";
  } else {
    player.pauseVideo();
    playBtn.textContent = "▶";
  }
  playing = !playing;
  updateStatus();
};

loopBtn.onclick = () => {
  isLoop = !isLoop;
  loopBtn.classList.toggle("active", isLoop);
};

nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;

progress.onclick = e => {
  const r = progress.getBoundingClientRect();
  const p = (e.clientX - r.left) / r.width;
  player.seekTo(player.getDuration() * p, true);
};


volSlider.addEventListener("click", () => {
  gachaVolume();
});


volSlider.addEventListener("mousedown", e => e.preventDefault());

updateStatus();
