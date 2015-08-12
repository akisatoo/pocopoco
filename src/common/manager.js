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
			n = cc.sys.localStorage.getItem('funds');
			return Number(n);
		},
		
		setFunds: function (funds) {
			cc.sys.localStorage.setItem('funds', funds);
			return;
		},
		
		/**
		 * 資金パラメーターを削除
		 */
		removeFunds: function () {
			cc.sys.localStorage.removeItem('funds');
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
		 * パーティーリストの取得
		 * 注意：Stringで保存されているみたい
		 */
		getPartyList: function () {
			//パーティーの設定がなければ初期キャラクタで返す
			return [
			    parseInt(cc.sys.localStorage.getItem('party0')) || 2,
			    parseInt(cc.sys.localStorage.getItem('party1')) || null,
			    parseInt(cc.sys.localStorage.getItem('party2')) || null,
			    parseInt(cc.sys.localStorage.getItem('party3')) || null,
			];
		},

		
		/**
		 * パーティーリストを保持
		 * 注意；Stringで保存されているみたい
		 */
		setPartyList: function (list) {
			_.each(list, function (id, index) {
				cc.sys.localStorage.setItem('party' + index, String(id) || null);
				return;
			});
			return;
		},
		
		
		/**
		 * ダンジョンデータ
		 */
		dungeonList: [
			{
				id: 1,
				name: 'ダンジョン1',
				type: 'vertical',
				level: 3
			},
			{
				id: 2,
				name: 'ダンジョン2',
				type: 'vertical',
				level: 3
			},
			{
				id: 3,
				name: 'ダンジョン3',
				type: 'vertical',
				level: 3
			},
			{
				id: 4,
				name: 'ダンジョン4',
				type: 'vertical',
				level: 3
			},
		],
		
		/**
		 * キャラクターデータ
		 */
		charaDataList: {
			1: {
				id: 1,
				name: 'princess',
				value: 1,
				image: res.PrincessRight1,
				animPattern: {
					normal: [res.PrincessRight1, res.PrincessRight2]
				}
			},
			2: {
				id: 2,
				name: 'hero',
				value: 1,
				image: res.HeroRight1,
				animPattern: {
					normal: [res.HeroRight1, res.HeroRight2],
					right: [res.HeroRight1, res.HeroRight2],
					left: [res.HeroLeft1, res.HeroLeft2]
				},
				movePattern: 0
			},
			3: {
				id: 3,
				name: 'magician',
				value: 1,
				image: res.MagicianRight1,
				animPattern: {
					normal: [res.MagicianRight1, res.MagicianRight2],
					right: [res.MagicianRight1, res.MagicianRight2],
					left: [res.MagicianLeft1, res.MagicianLeft2]
				},
				//movePattern: 0,
				attackPattern: 0
			},
			4: {
				id: 4,
				name: 'hero2',
				value: 1,
				image: res.HeroRight1,
				animPattern: {
					normal: [res.HeroRight1, res.HeroRight2],
					right: [res.HeroRight1, res.HeroRight2],
					left: [res.HeroLeft1, res.HeroLeft2]
				},
				movePattern: 0
			},
			5: {
				id: 5,
				name: 'hero3',
				image: res.HeroRight1,
				animPattern: {
					normal: [res.HeroRight1, res.HeroRight2],
					right: [res.HeroRight1, res.HeroRight2],
					left: [res.HeroLeft1, res.HeroLeft2]
				},
				movePattern: 0
			},
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
				movePattern: 0
			}
		},
		

	};
})();