// regular js methods available outside the app
function getRandomValue(min, max) {
	return Math.floor(Math.random() * (max - min)) + max;
}

const app = Vue.createApp({
	data() {
		return {
			playerHealth: 100,
			monsterHealth: 100,
			currentRound: 0,
			winner: null,
			minMonsterDamage: 3,
			maxMonsterDamage: 10,
			minPlayerDamage: 5,
			maxPlayerDamage: 13,
			logMessages: [],
		};
	},

	computed: {
		monsterBarStyles() {
			if (this.monsterHealth < 0) {
				return { width: '0%' };
			}
			return { width: this.monsterHealth + '%' };
		},
		playerBarStyles() {
			if (this.playerHealth < 0) {
				return { width: '0%' };
			}
			return { width: this.playerHealth + '%' };
		},
		canUseSpecialAttacks() {
			return this.currentRound % 3 !== 0;
		},
	},

	watch: {
		playerHealth(value) {
			if (value <= 0 && this.monsterHealth <= 0) {
				//draw
				this.winner = 'draw!';
			} else if (value <= 0) {
				// player loses
				this.winner = 'monstre';
			}
		},
		monsterHealth(value) {
			if (value <= 0 && this.playerHealth <= 0) {
				//draw
			} else if (value <= 0) {
				//monster loses
				this.winner = 'jouer';
			}
		},
	},

	methods: {
		attackMonster() {
			this.currentRound++;
			const attackValue = getRandomValue(this.minMonsterDamage, this.maxMonsterDamage);
			this.monsterHealth -= attackValue;
			this.addLogMessage('jouer', 'attack', attackValue);
			this.attackPlayer();
		},
		attackPlayer() {
			const attackValue = getRandomValue(this.minPlayerDamage, this.maxPlayerDamage);
			this.playerHealth -= attackValue;
			this.addLogMessage('monster', 'attack', attackValue);
		},
		specialAttackMonster() {
			const attackValue = getRandomValue(10, 25);
			this.monsterHealth -= attackValue;
			this.addLogMessage('jouer', 'attack', attackValue);
			this.attackPlayer();
		},
		healPlayer() {
			if (this.playerHealth < 100) {
				this.currentRound++;
				const healValue = getRandomValue(8, 20);
				if (this.playerHealth + healValue > 100) {
					this.playerHealth = 100;
				} else {
					this.playerHealth += healValue;
				}
				this.addLogMessage('jouer', 'heal', healValue);
				this.attackPlayer();
			}
		},
		startGame() {
			this.monsterHealth = 100;
			this.playerHealth = 100;
			this.currentRound = 0;
			this.winner = null;
			this.logMessages = [];
		},
		surrender() {
			this.winner = 'monstre';
		},
		addLogMessage(who, what, value) {
			this.logMessages.unshift({
				actionBy: who,
				actionType: what,
				actionValue: value,
			});
		},
	},
});

app.mount('#game');
