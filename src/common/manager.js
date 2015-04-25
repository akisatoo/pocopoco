var App = App || {};

var Manager = null;
(function () {

	Manager = function (config) {
		config = config || {};
		return this;
	};

	Manager.prototype = {

		/**
		 * ゲームステージ(レイヤー)
		 */
		gameStage: null,
		
		/**
		 * ゲーム中の選択中のキャラ
		 */
		currentChara: null,
		
		
		/**
		 * スコア
		 */
		gameScore: 0,
		getScore: function () {
			return this.gameScore;
		},
		
		setScore: function (score) {
			this.gameScore = score;
			return;
		},
		
		/**
		 * 資金（キャラ購入用）
		 */
		gameMoney: 0,
		getFunds: function () {
			return cc.sys.localStorage.getItem('Funds');
		},
		
		setFunds: function (funds) {
			cc.sys.localStorage.setItem('Funds', funds);
			return;
		},
		
		/**
		 * 資金パラメーターを削除
		 */
		removeFunds: function () {
			cc.sys.localStorage.removeItem('Funds');
			return;
		},
		
		/**
		 * 軍資金
		 */
		getWarfunds: function () {
			return cc.sys.localStorage.getItem('warfunds');
		},

		setWarfunds: function (money) {
			cc.sys.localStorage.setItem('warfunds', money);
			return;
		},

		/**
		 * 軍資金パラメーターを削除
		 */
		removeWarfunds: function () {
			cc.sys.localStorage.removeItem('warfunds');
			return;
		},
		
		/**
		 * キャラクターデータ
		 */
		charaDataList: {
			'princess': {
				id: 1,
				name: 'princess',
				image: res.PrincessRight1,
				animPattern: {
					normal: [res.PrincessRight1, res.PrincessRight2]
				}
			},
			'hero': {
				id: 2,
				name: 'hero',
				image: res.HeroRight1,
				animPattern: {
					normal: [res.HeroRight1, res.HeroRight2],
					right: [res.HeroRight1, res.HeroRight2],
					left: [res.HeroLeft1, res.HeroLeft2]
				},
				movePattern: 0
			},
			'magician': {
				id: 3,
				name: 'magician',
				image: res.MagicianRight1,
				animPattern: {
					normal: [res.MagicianRight1, res.MagicianRight2],
					right: [res.MagicianRight1, res.MagicianRight2],
					left: [res.MagicianLeft1, res.MagicianLeft2]
				}
			}
		},
		
		
		/**
		 * キャラクターデータ
		 */
		enemyDataList: {
			'underling': {
				id: 1,
				name: 'underling',
				image: res.EnemyLeft1,
				animPattern: {
					normal: [res.EnemyLeft1, res.EnemyLeft2],
					right: [res.EnemyRight1, res.EnemyRight2],
					left: [res.EnemyLeft1, res.EnemyLeft2]
				},
			}
		},
		

	};
})();