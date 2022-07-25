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
const app = {
  currentIndex: 0,
  isPause: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      // path: "https://mp3.vlcmusic.com/download.php?track_id=34737&format=320",
      path: "http://api.mp3.zing.vn/api/streaming/audio/ZZDI9B7U/320",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./song/song2.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "https://mp3.filmysongs.in/download.php?id=Naachne Ka Shaunq Raftaar Ft Brodha V Mp3 Hindi Song Filmysongs.co.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg",
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
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
        console.log(12);
      } else {
        song.classList.add("active");
        song.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
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
    // Xử lý khi tua bài hát
    progress.oninput = function (e) {
      audio.currentTime = (e.target.value * audio.duration) / 100;
    };
    // Xử lý khi bấm next bài hát
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      }
      if (_this.isRepeat) {
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
      console.log(e.target.closest(".song"));
      if (
        Number(e.target.closest(".song").dataset.in) === _this.currentIndex ||
        e.target.closest(".fas")
      ) {
        console.log(e.target.closest(".fas"));
        return;
      } else {
        _this.currentIndex = Number(e.target.closest(".song").dataset.in);
        console.log(_this.currentIndex);
        _this.loadCurrentSong();
        audio.play();
        _this.checkSongUi();
        console.log(e.target.className);
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
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
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
