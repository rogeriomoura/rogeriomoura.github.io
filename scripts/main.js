const newMonster = {
  name: 'Monster Name',
  level: 1,
  health: 10,
  maxHealth: 10,
  attack: 5,
  experience: 0,
  experienceToLevelUp: 10,
  points: 0,
  enemyLevel: 1,
  xpModifier: 1,
  attackModifier: 2,
  healthModifier: 5,
  pointsModifier: 5,
};

function resetMonster() {
  if (confirm('Are you sure you want to reset your monster?')) {
    localStorage.removeItem('monster');
    monster = createNewMonster();
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
  monster.experience += 1 * monster.xpModifier;

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
  updateEnemyInfo();
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
    if (monster.points >= 25) {
      document.querySelectorAll('.sacrifice').forEach((button) => {
        button.disabled = false;
      });
    } else {
      document.querySelectorAll('.sacrifice').forEach((button) => {
        button.disabled = true;
      });
    }
    document.getElementById('train-health').disabled = false;
  } else {
    document.getElementById('train-attack').disabled = true;
    document.getElementById('train-health').disabled = true;
    document.getElementById('heal').disabled = true;
    document.querySelectorAll('.sacrifice').forEach((button) => {
      button.disabled = true;
    });
  }
}

function evolveAttack() {
  if (monster.points >= 2) {
    monster.points -= 2;
    monster.attack += monster.attackModifier + Math.round(monster.level * 0.5);
    updateMonsterInfo();
  }
}

function evolveHealth() {
  if (monster.points >= 1) {
    const healthIncrease =
      monster.healthModifier + Math.round(monster.level * 0.5);
    monster.points -= 1;
    monster.maxHealth += healthIncrease;
    monster.health += healthIncrease;
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
  const enemy = generateEnemy(monster.enemyLevel);
  const result = performBattle(enemy);
  if (result === 'win') {
    monster.experience += enemy.experienceGiven;
    monster.enemyLevel++;
    if (Math.random() > 0.55) {
      monster.health = monster.maxHealth;
      updateGameLog(
        'Your monster ATE the enemy and fully recovered from the fight!'
      );
    }
  } else {
    resetGame();
  }
  updateMonsterInfo();
}

function generateEnemy(enemyLevel) {
  return {
    name: `Enemy Lvl. ${enemyLevel}`,
    level: enemyLevel,
    health: enemyLevel * 5,
    maxHealth: enemyLevel * 5,
    attack: enemyLevel * 2,
    experienceGiven: enemyLevel * 5 + monster.level * 5,
  };
}

function performBattle(enemy) {
  let round = 1;
  while (monster.health > 0 && enemy.health > 0) {
    monster.health -= enemy.attack;
    enemy.health -= monster.attack;
    updateGameLog('Round ' + round++);
    updateGameLog(
      'Your monster attacked the enemy for ' +
        monster.attack +
        ', Enemy health: ' +
        enemy.health +
        '/' +
        enemy.maxHealth
    );
    updateGameLog(
      'The enemy attacked your monster for ' +
        enemy.attack +
        ', Your monster health: ' +
        monster.health +
        '/' +
        monster.maxHealth
    );
  }
  if (monster.health <= 0) {
    return 'lose';
  } else if (enemy.health <= 0) {
    return 'win';
  }
}

function levelUp() {
  monster.level++;
  monster.health += monster.level;
  monster.maxHealth += monster.level;
  monster.attack += monster.level;
  monster.experience = 0;
  monster.experienceToLevelUp *= 2;
  monster.points += monster.pointsModifier;
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

function updateEnemyInfo() {
  const enemy = generateEnemy(monster.enemyLevel);
  document.getElementById('enemy-level').textContent = enemy.level;
  document.getElementById('enemy-health').textContent = enemy.health;
  document.getElementById('enemy-attack').textContent = enemy.attack;
  document.getElementById('enemy-experience').textContent =
    enemy.experienceGiven;
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

function sacrificeMonster(modifier) {
  if (
    confirm(
      `Are you sure you want to sacrifice your monster for more ${modifier}?`
    )
  ) {
    let { xpModifier, attackModifier, healthModifier, pointsModifier } =
      monster;
    switch (modifier) {
      case 'xpModifier':
        xpModifier += 1;
        break;
      case 'attackModifier':
        attackModifier += 1;
        break;
      case 'healthModifier':
        healthModifier += 1;
        break;
      case 'pointsModifier':
        pointsModifier += 1;
        break;
      default:
        break;
    }
    monster = createNewMonster();
    monster = {
      ...monster,
      xpModifier,
      attackModifier,
      healthModifier,
      pointsModifier,
    };
    updateMonsterInfo();
  }
}

// Initial update of monster information
updateMonsterInfo();
updateEnemyInfo();
checkForPoints();
