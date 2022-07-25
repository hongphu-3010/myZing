const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const heading = $("header h2");
const cdthumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const btnNext = $(".btn-next i");
const btnBack = $(".btn-prev i");
const random = $(".btn-random i");
const btnRepeat = $(".btn-repeat");
const playlist = $(".playlist");
const volumeSong = $(".volume__range");
const volumeImg = $(".volume__img");
const volume__unmute = $(".volume__unmute");
const app = {
  currentIndex: 0,
  isPause: false,
  isRandom: false,
  isRepeat: false,
  isVolume: false,
  isUnmute: false,
  config: {},
  songsRandom: [],
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    // {
    //   name: "Click Pow Get Down",
    //   singer: "Raftaar x Fortnite",
    //   // path: "https://mp3.vlcmusic.com/download.php?track_id=34737&format=320",
    //   path: "http://api.mp3.zing.vn/api/streaming/audio/ZZDI9B7U/320",
    //   image:
    //     "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/1/b/8/9/1b8958017b04a663eb8c093905dd4d85.jpg",
    // },
    {
      name: "Dancing With Your Ghost",
      singer: "Sasha Sloan",
      // path: "https://mp3.vlcmusic.com/download.php?track_id=34737&format=320",
      path: "./song/song1.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/e/1/3/6/e136efdb83afc28eefac02e8d0184cf1.jpg",
    },
    {
      name: "Send My Love",
      singer: "Sofia",
      path: "./song/song2.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/4/f/2/d/4f2d26a919af2aadc65aaba9c72e68c7.jpg",
    },
    {
      name: "I Love You 3000",
      singer: "Raftaar x Fortnite",
      // path: "https://mp3.vlcmusic.com/download.php?track_id=34737&format=320",
      path: "./song/song3.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    // {
    //   name: "Naachne Ka Shaunq",
    //   singer: "Raftaar x Brobha V",
    //   path: "https://mp3.filmysongs.in/download.php?id=Naachne Ka Shaunq Raftaar Ft Brodha V Mp3 Hindi Song Filmysongs.co.mp3",
    //   image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    // },
    {
      name: "Landslide",
      singer: "Oh Wonder",
      path: "./song/song4.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Wake Me Up",
      singer: "Avicii",
      path: "./song/song5.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Unstoppable",
      singer: "Sia",
      path: "./song/song6.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/6/3/8/8/638880effc370826ad9b12da417b631d.jpg",
    },
    {
      name: "Save Me",
      singer: "DEAMN",
      path: "./song/song7.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/covers/3/9/39247dd8f7a4a85f35647cf2d43d82ea_1487647777.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song active" data-in='${index}'>
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  checkSongUi: function () {
    $$(".song").forEach((song) => {
      if (Number(song.dataset.in) !== this.currentIndex) {
        song.classList.remove("active");
      } else {
        song.classList.add("active");
        // if (this.currentIndex >= 4) {
        song.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
        // }
      }
    });
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const cdWidth = cd.offsetWidth;
    // Xử lý quay CD
    const _this = this;
    const cdThumbAnimate = cdthumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iteratons: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // Phóng to hoặc thu nhỏ CD khi scroll
    document.onscroll = function () {
      const scroll = window.scrollY;
      const newCdWidth = cdWidth - scroll;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0 + "px";
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // Xử lý khi nhấn nút play
    playBtn.onclick = () => {
      this.isPause ? audio.pause() : audio.play();
      // Khi bài hát được chạy
    };
    audio.onplay = () => {
      player.classList.add("playing");
      this.isPause = true;
      cdThumbAnimate.play();
    };
    // Khi bài hát bị dừng
    audio.onpause = () => {
      player.classList.remove("playing");
      this.isPause = false;
      cdThumbAnimate.pause();
    };
    // Khi tiến độ của bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const percent = (audio.currentTime * 100) / audio.duration;
        progress.value = percent;
      }
    };
    // Xử lý khi thay đổi âm lượng
    // audio.onvolumechange = function () {
    //   //   setTimeout(() => {
    //   //     volumeImg.onclick();
    //   //   }, 3000);
    //   //   // volumeImg.onclick();
    // };
    // Xử lý khi tua bài hát
    progress.oninput = function (e) {
      audio.currentTime = (e.target.value * audio.duration) / 100;
    };
    // Xử lý nút volume
    volumeSong.oninput = function (e) {
      audio.volume = e.target.value / e.target.max;
    };
    // Xử lý khi bấm next bài hát
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
        console.log(_this.songsRandom);
      } else if (_this.isRepeat) {
        _this.loadCurrentSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      setTimeout(function () {
        _this.checkSongUi();
      }, 100);
    };
    // Click pre song
    btnBack.addEventListener("click", function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.backSong();
      }
      audio.play();
      setTimeout(function () {
        _this.checkSongUi();
      }, 100);
    });
    // --- Xử lý bật tắt chế độ random
    random.onclick = function () {
      _this.isRandom = !_this.isRandom;
      this.closest(".btn-random").classList.toggle("active", _this.isRandom);
    };
    // -- Xử lý khi bài hát kết thúc
    audio.onended = function () {
      btnNext.click();
    };
    // Xử lý chế độ repeat
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      this.classList.toggle("active", _this.isRepeat);
    };
    playlist.onclick = function (e) {
      if (
        Number(e.target.closest(".song").dataset.in) === _this.currentIndex ||
        e.target.closest(".fas")
      ) {
        return;
      } else {
        _this.currentIndex = Number(e.target.closest(".song").dataset.in);
        _this.loadCurrentSong();
        audio.play();
        _this.checkSongUi();
      }
    };
    volumeImg.onclick = function () {
      _this.isVolume = !_this.isVolume;
      if (_this.isVolume) {
        volumeSong.style.display = "block";
        volumeSong.style.animation = "appear linear 2s";
        console.log(1);
      } else {
        volumeSong.style.animation = "hiden linear 2s forwards";
        // setTimeout(() => {
        volumeSong.style.display = "none";
        console.log(2);
        // }, 3000);
      }
    };
    volume__unmute.onclick = function () {
      _this.isUnmute = !_this.isUnmute;
      if (_this.isUnmute) {
        volume__unmute.src = "./imgs/mute.png";
        audio.muted = true;
      } else {
        volume__unmute.src = "./imgs/unmute.png";
        audio.muted = false;
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
    this.loadCurrentSong();
  },
  backSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    let numberSong;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
      numberSong = this.songsRandom.some((number) => {
        return newIndex === number;
      });
    } while (numberSong || newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.songsRandom.push(this.currentIndex);
    console.log(this.currentIndex);
    if (this.songsRandom.length > this.songs.length - 1) this.songsRandom = [];
    this.loadCurrentSong();
  },
  //   repeatSong: function() {
  // this.loadCurrentSong()
  //   },
  start: function () {
    // Render các bài hát
    this.render();
    // Đinh nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Tải bài hát hiện tại vào html
    this.loadCurrentSong();
    // Lắng nghe và sử lý các sự kiện ( DOM event)
    this.handleEvent();
    // Trạng thái UI oạt động của bài hát
    this.checkSongUi();
  },
};
app.start();
