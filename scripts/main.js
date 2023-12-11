const newMonster = {
  name: 'Monster Name',
  level: 1,
  health: 10,
  maxHealth: 10,
  attack: 5,
  experience: 0,
  experienceToLevelUp: 10,
  points: 0,
  currentEnemyLevel: 1,
};

const newEnemy = {
  name: `Enemy Lvl. ${newMonster.currentEnemyLevel}`,
  level: newMonster.currentEnemyLevel,
  health: newMonster.currentEnemyLevel * 5,
  attack: newMonster.currentEnemyLevel * 2,
  experienceGiven: newMonster.currentEnemyLevel * 5,
};

function resetMonster() {
  if (confirm('Are you sure you want to reset your monster?')) {
    localStorage.removeItem('monster');
    monster = createNewMonster();
    enemyLevel = 1;
    updateMonsterInfo();
  }
}

function loadMonster() {
  const savedMonster = JSON.parse(localStorage.getItem('monster'));
  return savedMonster || createNewMonster();
}

function saveMonster() {
  localStorage.setItem('monster', JSON.stringify(monster));
}

function createNewMonster() {
  return { ...newMonster };
}

let monster = loadMonster();

const gameLoopInterval = setInterval(gameLoop, 500);

// Function to handle the game loop
function gameLoop() {
  // Simulate passive income or automatic training over time
  monster.experience += 1;

  // Check for level up
  if (monster.experience >= monster.experienceToLevelUp) {
    levelUp();
  }

  // Check for defeat
  if (monster.health <= 0) {
    resetGame();
  }

  checkForPoints();
  updateMonsterInfo();
  saveMonster();
}

// Function to check for points to spend
function checkForPoints() {
  if (monster.points > 0) {
    if (monster.points >= 2) {
      document.getElementById('train-attack').disabled = false;
    } else {
      document.getElementById('train-attack').disabled = true;
    }
    if (monster.points >= 3) {
      document.getElementById('heal').disabled = false;
    } else {
      document.getElementById('heal').disabled = true;
    }
    document.getElementById('train-health').disabled = false;
  } else {
    document.getElementById('train-attack').disabled = true;
    document.getElementById('train-health').disabled = true;
    document.getElementById('heal').disabled = true;
  }
}

// Function to train the monster attack
function trainAttack() {
  if (monster.points >= 2) {
    monster.points -= 2;
    monster.attack += 2;
    updateMonsterInfo();
  }
}

// Function to train the monster health
function trainHealth() {
  if (monster.points >= 1) {
    monster.points -= 1;
    monster.maxHealth += 5;
    monster.health += 5;
    updateMonsterInfo();
  }
}

// Function to heal monster health
function heal() {
  if (monster.points >= 3) {
    monster.points -= 3;
    monster.health = monster.maxHealth;
    updateMonsterInfo();
  }
}

// Function to handle battles
function fight() {
  const enemy = generateEnemy();
  const result = performBattle(monster, enemy);

  if (result === 'win') {
    monster.experience += 5;
    if (monster.experience >= monster.experienceToLevelUp) {
      levelUp();
    }
  } else {
    if (monster.health <= 0) {
      // Player defeated
      resetGame();
    }
  }

  updateMonsterInfo();
}

// Function to generate a random enemy for battles
function generateEnemy() {
  return {
    name: 'Enemy',
    level: monster.level,
    health: monster.level * 5,
    maxHealth: monster.level * 5,
    attack: monster.level * 2,
  };
}

function performBattle(player, enemy) {
  let round = 1;
  while (player.health > 0 && enemy.health > 0) {
    player.health -= enemy.attack;
    enemy.health -= player.attack;
    updateGameLog('Round ' + round++);
    updateGameLog(
      'Your monster attacked the enemy for ' +
        player.attack +
        ', Enemy health: ' +
        enemy.health +
        '/' +
        enemy.maxHealth
    );
    updateGameLog(
      'The enemy attacked your monster for ' +
        enemy.attack +
        ', Your monster health: ' +
        player.health +
        '/' +
        player.maxHealth
    );
  }
  if (player.health <= 0) {
    return 'lose';
  } else if (enemy.health <= 0) {
    return 'win';
  }
}

function levelUp() {
  monster.level++;
  monster.experience = 0;
  monster.experienceToLevelUp *= 2;
  monster.points += 5;
  updateGameLog('Level up! Your monster is now level ' + monster.level);
}

function updateMonsterInfo() {
  document.getElementById('monster-name').textContent = monster.name;
  document.getElementById('monster-level').textContent = monster.level;
  document.getElementById('monster-health').textContent =
    monster.health + '/' + monster.maxHealth;
  document.getElementById('monster-attack').textContent = monster.attack;
  document.getElementById('monster-experience').textContent =
    monster.experience + '/' + monster.experienceToLevelUp;
  document.getElementById('monster-points').textContent = monster.points;
}

function resetGame() {
  updateGameLog('Your monster was defeated! Restarting the game.');
  monster = { ...newMonster };
  updateMonsterInfo();
}

function updateGameLog(message) {
  const gameLog = document.getElementById('game-log');
  gameLog.innerHTML = '<p>' + message + '</p>' + gameLog.innerHTML;
  const allParagraphs = gameLog.getElementsByTagName('p');
  while (allParagraphs.length > 10) {
    gameLog.removeChild(allParagraphs[allParagraphs.length - 1]);
  }
}

function renameMonster() {
  const name = prompt("What is your monster's name?");
  if (name) {
    monster.name = name;
    updateMonsterInfo();
  }
}

// Initial update of monster information
updateMonsterInfo();
