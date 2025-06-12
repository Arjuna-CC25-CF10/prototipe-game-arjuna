import { soalAktivasiSkill } from "../config/soal.js";
import { skillArjuna } from "../config/skill.js";
import { activateSkillEffect, tryActivateSkill } from "./game.js"; // Impor fungsi game

// Ambil Elemen UI sekali saja
const elements = {
  playerHpBar: document.getElementById("player-hp-bar"),
  playerSpBar: document.getElementById("player-sp-bar"),
  enemyHpBar: document.getElementById("enemy-hp-bar"),
  enemySpBar: document.getElementById("enemy-sp-bar"),
  skillButtonsContainer: document.getElementById("skill-buttons"),
  popup: document.getElementById("effect-popup"),
  quizContainer: document.getElementById("quiz-container"),
  quizQuestion: document.getElementById("quiz-question"),
  quizOptions: document.getElementById("quiz-options"),
  gameOverScreen: document.getElementById("game-over"),
  gameOverText: document.getElementById("game-over-text"),
  gameOverSubtitle: document.getElementById("game-over-subtitle"),
  nextStageBtn: document.getElementById("next-stage-btn"),
  playAgainBtn: document.getElementById("play-again-btn"),
  stageDisplay: document.getElementById("stage-display"),
};

export function setupUI() {
  const skillButtonsContainer = document.getElementById("skill-buttons");

  skillButtonsContainer.innerHTML = "";
  skillArjuna.forEach((skill, index) => {
    const btn = document.createElement("button");
    btn.id = `skill-btn-${index}`;
    btn.className = "skill-btn";
    btn.innerHTML = `${skill.namaSkill}`;
    btn.onclick = () => tryActivateSkill(index);
    skillButtonsContainer.appendChild(btn);
  });
}

export function updateUI(player, enemy) {
  if (!player.hp || !enemy.hp) return;
  elements.playerHpBar.style.width = `${(player.hp / player.maxHP) * 100}%`;
  elements.playerSpBar.style.width = `${(player.sp / player.maxSP) * 100}%`;
  elements.enemyHpBar.style.width = `${(enemy.hp / enemy.maxHP) * 100}%`;
  elements.enemySpBar.style.width = `${(enemy.sp / enemy.maxSP) * 100}%`;
  player.skills.forEach((skill, index) => {
    document.getElementById(`skill-btn-${index}`).disabled =
      player.sp < skill.tenagaSukma || skill.onCooldown;
  });
}

export function updateStageDisplay(stage) {
  elements.stageDisplay.textContent = `Stage: ${stage}`;
}

export function showEffectPopup(message) {
  elements.popup.textContent = message;
  elements.popup.classList.remove("hidden");
  elements.popup.classList.add("show");
  setTimeout(() => {
    elements.popup.classList.remove("show");
    setTimeout(() => elements.popup.classList.add("hidden"), 400);
  }, 3000);
}

export function showQuiz(skill, player) {
  const q =
    soalAktivasiSkill[Math.floor(Math.random() * soalAktivasiSkill.length)];
  elements.quizQuestion.textContent = q.pertanyaan;
  elements.quizOptions.innerHTML = "";
  q.pilihanJawaban.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      elements.quizContainer.classList.add("hidden");
      if (opt === q.jawabanBenar) {
        activateSkillEffect(player, skill);
      } else {
        showEffectPopup("Jawaban Salah!");
      }
    };
    elements.quizOptions.appendChild(btn);
  });
  elements.quizContainer.classList.remove("hidden");
}

export function updateGameOverScreen(isWin, currentStage, maxStages) {
  if (isWin) {
    if (currentStage < maxStages) {
      elements.gameOverText.textContent = `Stage ${currentStage} Selesai!`;
      elements.gameOverSubtitle.textContent =
        "Duryudana berhasil dikalahkan untuk saat ini.";
      elements.nextStageBtn.classList.remove("hidden");
      elements.playAgainBtn.classList.add("hidden");
    } else {
      elements.gameOverText.textContent = "Kemenangan Mutlak!";
      elements.gameOverSubtitle.textContent =
        "Anda telah menaklukkan semua stage!";
      elements.nextStageBtn.classList.add("hidden");
      elements.playAgainBtn.classList.remove("hidden");
    }
  } else {
    elements.gameOverText.textContent = "Anda Kalah";
    elements.gameOverSubtitle.textContent = `Anda dikalahkan di Stage ${currentStage}.`;
    elements.nextStageBtn.classList.add("hidden");
    elements.playAgainBtn.classList.remove("hidden");
  }
  elements.gameOverScreen.classList.remove("hidden");
}

// Event listener untuk tombol di layar game over disatukan di sini
export function addGameOverListeners(restartCallback, nextStageCallback) {
  elements.playAgainBtn.onclick = restartCallback;
  elements.nextStageBtn.onclick = nextStageCallback;
}
