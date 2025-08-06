import "../css/style.css";
import { initGame } from "./components/game.js";

// Impor aset agar Webpack memprosesnya
import playerImgSrc from "../assets/images/arjuna.png";
import enemyImgSrc from "../assets/images/duryodana.png";

import backgroundMusicSrc from "../assets/audio/bg_battle_music.mp3";


// Deklarasikan variabel di luar fungsi main,
// agar bisa diakses oleh semua fungsi dalam file ini.
let gameHasStarted = false;

// Fungsi utama yang akan dijalankan
function main() {
  const gameRoot = document.getElementById("game-root");
  const notice = document.getElementById("compatibility-notice");


  function checkScreenSize() {
    if (window.innerWidth < 768) {
      gameRoot.classList.add("hidden");
      notice.classList.remove("hidden");
    } else {
      gameRoot.classList.remove("hidden");
      notice.classList.add("hidden");

      if (!gameHasStarted) {
        gameHasStarted = true;
        initializeAndStartGame();
      }
    }
  }

  function initializeAndStartGame() {
    // Set sumber aset
    document.getElementById("player").src = playerImgSrc;
    document.getElementById("enemy").src = enemyImgSrc;

    const backgroundMusic = document.getElementById("background-music");
    backgroundMusic.src = backgroundMusicSrc;

    // Memulai musik
    function startMusic() {
      backgroundMusic.play().catch((e) => console.error("Autoplay Error:", e));
      window.removeEventListener("click", startMusic);
      window.removeEventListener("keydown", startMusic);
    }
    window.addEventListener("click", startMusic);
    window.addEventListener("keydown", startMusic);

    // Memulai logika inti game
    initGame();
  }

  checkScreenSize(); // Cek saat pertama kali load
  window.addEventListener("resize", checkScreenSize); // Cek jika ukuran window diubah
}

// Jalankan fungsi utama setelah halaman dimuat
window.addEventListener("load", main);
