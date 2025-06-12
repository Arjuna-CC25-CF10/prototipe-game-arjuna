// Impor data dan konstanta
import { baseStats } from "../config/stats.js";
import { skillArjuna, skillDuryudana } from "../config/skill.js";
import { MAX_STAGES } from "../config/constants.js";
import attackImgSrc from "../../assets/images/attack.png";

// Impor fungsi-fungsi UI
import * as UI from "./ui.js";

// State Utama Game
let currentStage = 1;
let gameIsOver = false;
let player = {};
let enemy = {};
let gameIntervals = {
  tick: null,
  regen: null,
  playerAttack: null,
  enemyAttack: null,
};

// Ambil Elemen Game
const playerElement = document.getElementById("player");
const enemyElement = document.getElementById("enemy");
const projectilesContainer = document.getElementById("projectiles");

// Fungsi yang diekspor untuk dipanggil dari file lain
export function initGame() {
  UI.setupUI();
  UI.addGameOverListeners(
    () => setupStage(1),
    () => setupStage(currentStage + 1)
  );
  setupStage(1);
  addEventListeners();
}

export function tryActivateSkill(skillIndex) {
  const skill = player.skills[skillIndex];
  if (player.sp >= skill.tenagaSukma && !skill.onCooldown) {
    player.sp -= skill.tenagaSukma;
    skill.onCooldown = true;
    skill.cooldownTimer = skill.cooldown;
    UI.showQuiz(skill, player);
  }
}

export function activateSkillEffect(character, skill) {
  // Format notifikasi baru sesuai permintaan
  UI.showEffectPopup(
    `${character.name} mengaktifkan skill ${skill.namaSkill} dengan efek ${skill.efekText}`
  );

  // Logika untuk berbagai tipe efek
  if (skill.efek.heal) {
    character.hp = Math.min(
      character.maxHP,
      character.hp + character.maxHP * (skill.efek.heal / 100)
    );
  }

  // PENAMBAHAN: Logika untuk skill serangan langsung (Gada Wisa Astina)
  if (skill.efek.baseDamage) {
    const target = character === player ? enemy : player;
    const bonusDamage = character.atk * (skill.efek.bonusDamagePercent / 100);
    const totalSkillDamage = skill.efek.baseDamage + bonusDamage;

    // Langsung panggil dealDamage dengan damage spesifik
    dealDamage(character, target, totalSkillDamage);
  }

  // Logika untuk buff (efek berdurasi)
  if (skill.durasi) {
    character.buffs.push({ ...skill, durationTimer: skill.durasi });
    // PENAMBAHAN: Logika untuk buff kecepatan serang
    if (skill.efek.atkSpd) {
      updateAttackSpeed(character, true);
    }
  }
}

// Fungsi Internal Game
function getEnemyStatsForStage(stage) {
  const scalingFactor = stage - 1;
  return {
    def: scalingFactor * 2,
    atkSpd: baseStats.atkSpd + scalingFactor * 0.2,
    moveSpd: baseStats.moveSpd + scalingFactor * 0.5,
  };
}

function setupStage(stage) {
  gameIsOver = false;
  currentStage = stage;
  UI.updateStageDisplay(currentStage);
  document.getElementById("game-over").classList.add("hidden");
  projectilesContainer.innerHTML = "";

  player = {
    ...baseStats,
    hp: baseStats.maxHP,
    sp: baseStats.maxSP,
    y: 200,
    element: playerElement,
    skills: skillArjuna.map((s) => ({
      ...s,
      onCooldown: false,
      cooldownTimer: 0,
    })),
    buffs: [],
    name: "Arjuna",
  };
  const enemyStageStats = getEnemyStatsForStage(currentStage);
  enemy = {
    ...baseStats,
    ...enemyStageStats,
    hp: baseStats.maxHP,
    sp: baseStats.maxSP,
    y: 200,
    direction: 1,
    element: enemyElement,
    skills: skillDuryudana.map((s) => ({
      ...s,
      onCooldown: false,
      cooldownTimer: 0,
    })),
    buffs: [],
    name: "Duryudana",
  };

  playerElement.style.top = player.y + "px";
  enemyElement.style.top = enemy.y + "px";

  Object.values(gameIntervals).forEach(clearInterval);
  gameIntervals.tick = setInterval(gameTick, 100);
  gameIntervals.regen = setInterval(regenerateSP, 2000);
  gameIntervals.playerAttack = setInterval(playerAttack, 1000 / player.atkSpd);
  gameIntervals.enemyAttack = setInterval(enemyAttack, 1000 / enemy.atkSpd);

  UI.updateUI(player, enemy);
}

function gameTick() {
  if (gameIsOver) return;
  moveEnemy();
  enemyAI();
  updateCooldowns();
  updateBuffs();
  UI.updateUI(player, enemy);
}

function dealDamage(attacker, defender, specificDamage = null) {
  if (defender.buffs.some((b) => b.efek.immuneDamage)) return;

  let finalDamage;

  if (specificDamage) {
    // Jika damage dari skill, langsung gunakan
    finalDamage = specificDamage;
  } else {
    // Jika dari serangan biasa, hitung seperti biasa
    const atkBuff = attacker.buffs
      ? attacker.buffs.find((b) => b.efek.atk)
      : null;
    const totalAttack =
      attacker.atk + (atkBuff ? attacker.atk * (atkBuff.efek.atk / 100) : 0);
    finalDamage = Math.max(1, totalAttack - (defender.def || 0));
  }

  defender.hp -= finalDamage;
  defender.element.classList.add("hit");
  setTimeout(() => defender.element.classList.remove("hit"), 300);
  checkGameOver();
}

function endGame(isWin) {
  if (gameIsOver) return;
  gameIsOver = true;
  Object.values(gameIntervals).forEach(clearInterval);
  UI.updateGameOverScreen(isWin, currentStage, MAX_STAGES);
}

function checkGameOver() {
  if (player.hp <= 0) endGame(false);
  else if (enemy.hp <= 0) endGame(true);
}

function addEventListeners() {
  document.addEventListener("keydown", (e) => {
    if (gameIsOver) return;
    const gameBounds = document
      .getElementById("game-container")
      .getBoundingClientRect();
    if (e.key === "ArrowUp") player.y = Math.max(0, player.y - 20);
    if (e.key === "ArrowDown")
      player.y = Math.min(
        gameBounds.height - player.element.clientHeight,
        player.y + 20
      );
    playerElement.style.top = player.y + "px";
  });
}

function playerAttack() {
  if (gameIsOver) return;
  createProjectile(playerElement.offsetLeft + 60, player.y + 30, 1, player);
}
function enemyAttack() {
  if (gameIsOver) return;
  createProjectile(enemyElement.offsetLeft, enemy.y + 30, -1, enemy);
}

function createProjectile(x, y, direction, owner) {
  const proj = document.createElement("img");
  proj.src = attackImgSrc; // Gambar proyektil
  proj.className = "projectile"; // Gambar akan di-set dari index.js
  proj.style.left = x + "px";
  proj.style.top = y + "px";
  if (direction === -1) proj.style.transform = "scaleX(-1)";
  projectilesContainer.appendChild(proj);
  const speed = 8;
  const interval = setInterval(() => {
    let left = parseInt(proj.style.left);
    proj.style.left = left + speed * direction + "px";
    if (left < -40 || left > 800) {
      clearInterval(interval);
      proj.remove();
    } else {
      const currentTarget = owner === player ? enemy : player;
      if (!currentTarget || currentTarget.hp <= 0) {
        clearInterval(interval);
        proj.remove();
        return;
      }
      checkCollision(proj, currentTarget.element, () => {
        clearInterval(interval);
        proj.remove();
        dealDamage(owner, currentTarget);
      });
    }
  }, 20);
}

function checkCollision(proj, target, onHit) {
  const pRect = proj.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  if (
    pRect.left < tRect.right &&
    pRect.right > tRect.left &&
    pRect.top < tRect.bottom &&
    pRect.bottom > tRect.top
  ) {
    onHit();
  }
}

function moveEnemy() {
  const gameBounds = document
    .getElementById("game-container")
    .getBoundingClientRect();
  enemy.y += enemy.direction * enemy.moveSpd;
  if (
    enemy.y <= 0 ||
    enemy.y >= gameBounds.height - enemy.element.clientHeight
  ) {
    enemy.direction *= -1;
  }
  enemyElement.style.top = enemy.y + "px";
}

function enemyAI() {
  enemy.skills.forEach((skill) => {
    if (!skill.onCooldown && enemy.sp >= skill.tenagaSukma) {
      let useSkill = false;

      // Untuk menaikkan kemungkinan, NAIKKAN angka desimal c
      // Contoh: 0.015 (1.5% kemungkinan) -> 0.03 (3% kemungkinan)

      // Peluang skill serang
      if (skill.tipe === "Attack" && Math.random() < 0.015) {
        useSkill = true;
      }
      // Peluang skill bertahan
      if (
        skill.tipe === "Defence" &&
        enemy.hp < enemy.maxHP * 0.4 &&
        Math.random() < 0.02 //
      ) {
        useSkill = true;
      }
      // Peluang skill buff
      if (skill.tipe === "Buff" && Math.random() < 0.01) {
        useSkill = true;
      }

      if (useSkill) {
        enemy.sp -= skill.tenagaSukma;
        activateSkill(enemy, skill);
      }
    }
  });
}

function activateSkill(character, skill) {
  activateSkillEffect(character, skill);
  skill.onCooldown = true;
  skill.cooldownTimer = skill.cooldown;
}

function updateAttackSpeed(character, isBuffed) {
  const intervalId = character === player ? "playerAttack" : "enemyAttack";
  const attackFunction = character === player ? playerAttack : enemyAttack;

  clearInterval(gameIntervals[intervalId]); // Hentikan interval serangan saat ini

  let currentAtkSpd = character.atkSpd;
  if (isBuffed) {
    const atkSpdBuff = character.buffs.find((b) => b.efek.atkSpd);
    if (atkSpdBuff) {
      currentAtkSpd *= 1 + atkSpdBuff.efek.atkSpd / 100;
    }
  }

  gameIntervals[intervalId] = setInterval(attackFunction, 1000 / currentAtkSpd);
}

function updateBuffs() {
  [player, enemy].forEach((character) => {
    if (!character.buffs) return;

    // Temukan buff yang sudah habis durasinya
    const expiredBuffs = character.buffs.filter(
      (buff) => (buff.durationTimer -= 0.1) <= 0
    );

    // Jika ada buff yang habis...
    if (expiredBuffs.length > 0) {
      // Buat array baru yang hanya berisi buff yang masih aktif
      character.buffs = character.buffs.filter(
        (buff) => buff.durationTimer > 0
      );

      // Cek apakah di antara buff yang habis ada yang meningkatkan kecepatan serang
      const hadAtkSpdBuff = expiredBuffs.some((b) => b.efek.atkSpd);
      if (hadAtkSpdBuff) {
        // Jika ya, kembalikan kecepatan serang karakter ke normal
        updateAttackSpeed(character, false);
      }
    }
  });
}

function updateCooldowns() {
  [player, enemy].forEach((character) => {
    if (!character.skills) return;
    character.skills.forEach((skill) => {
      if (skill.onCooldown) {
        skill.cooldownTimer -= 0.1;
        if (skill.cooldownTimer <= 0) {
          skill.onCooldown = false;
          skill.cooldownTimer = 0;
        }
      }
    });
  });
}

function regenerateSP() {
  if (gameIsOver || !player.sp) return;
  if (player.sp < player.maxSP) player.sp += baseStats.spRegen;
  if (enemy.sp < enemy.maxSP) enemy.sp += baseStats.spRegen;
}
