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
				type: 'defence',
				level: 3
			},
			{
				id: 2,
				name: 'ダンジョン2',
				type: 'straight',
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
			{
				id: 5,
				name: 'BOSSダンジョン',
				type: 'rescue',
				level: 3
			},
		],
		
		/**
		 * キャラクターデータ
		 */
		charaDataList: function() {
			var list = cc.sys.localStorage.getItem('charaDataList');
			
			if (!list || list === '') {
				list = this.charaBaseDataList;
				this.setCharaDataList(list);
			}else {
				//文字列からJSON形式に変換
				list = JSON.parse(list);
			}
			return list;
		},
		
		removeCharaDataList: function() {
			cc.sys.localStorage.removeItem('charaDataList');
			return;
		},
		
		
		/**
		 * キャラクタデータの保持
		 */
		setCharaDataList: function(data) {
			var list = JSON.stringify(data);
			cc.sys.localStorage.setItem('charaDataList', list);
			return;
		},
		
		
		/**
		 * キャラクター情報
		 */
		charaBaseDataList: {
			"1": {
				"id": 1,
				"name": "princess",
				"lock": false,
				"value": 1,
				"image": "res/princess/princess_right1.png",
				"animPattern": {
					"normal": ["res/princess/princess_right1.png", "res/princess/princess_right2.png"]
				}
			},
			"2": {
				"id": 2,
				"name": "hero",
				"lock": false,
				"value": 2,
				"count": 0,
				"image": "res/hero/hero_right1.png",
				"animPattern": {
					"normal": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"right": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"left": ["res/hero/hero_left1.png", "res/hero/hero_left2.png"]
				},
				"movePattern": 0,
				"hitpoint": 100,
				"attack": 80,
				"speed": 1,
				"level": 1,
				"growth": 0.1,
				"exp": 80
			},
			"3": {
				"id": 3,
				"name": "magician",
				"lock": false,
				"value": 3,
				"count": 0,
				"image": "res/magician/magician_right1.png",
				"animPattern": {
					"normal": ["res/magician/magician_right1.png", "res/magician/magician_right2.png"],
					"right": ["res/magician/magician_right1.png", "res/magician/magician_right2.png"],
					"left": ["res/magician/magician_left1.png", "res/magician/magician_left2.png"]
				},
				"attackPattern": 0,
				"hitpoint": 2,
				"attack": 1,
				"speed": 1,
				"level": 1,
				"growth": 0.1,
				"exp": 50
			},
			"4": {
				"id": 4,
				"name": "hero2",
				"lock": false,
				"value": 4,
				"count": 0,
				"image": "res/hero/hero_right1.png",
				"animPattern": {
					"normal": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"right": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"left": ["res/hero/hero_left1.png", "res/hero/hero_left2.png"]
				},
				"movePattern": 0,
				"hitpoint": 2,
				"attack": 1,
				"speed": 1,
				"level": 1,
				"growth": 0.1,
				"exp": 100
			},
			"5": {
				"id": 5,
				"name": "hero3",
				"lock": false,
				"value": 5,
				"count": 0,
				"image": "res/hero/hero_right1.png",
				"animPattern": {
					"normal": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"right": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"left": ["res/hero/hero_left1.png", "res/hero/hero_left2.png"]
				},
				"movePattern": 0,
				"hitpoint": 10,
				"attack": 1,
				"speed": 1,
				"level": 1,
				"growth": 0.1,
				"exp": 99
			},
			"6": {
				"id": 6,
				"name": "hero4",
				"lock": true,
				"value": 5,
				"count": 0,
				"image": "res/hero/hero_right1.png",
				"animPattern": {
					"normal": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"right": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"left": ["res/hero/hero_left1.png", "res/hero/hero_left2.png"]
				},
				"movePattern": 0,
				"hitpoint": 10,
				"attack": 1,
				"speed": 1,
				"level": 1,
				"growth": 0.1,
				"exp": 0
			},
			"7": {
				"id": 7,
				"name": "hero5",
				"lock": true,
				"value": 5,
				"count": 0,
				"image": "res/hero/hero_right1.png",
				"animPattern": {
					"normal": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"right": ["res/hero/hero_right1.png", "res/hero/hero_right2.png"],
					"left": ["res/hero/hero_left1.png", "res/hero/hero_left2.png"]
				},
				"movePattern": 0,
				"hitpoint": 10,
				"attack": 1,
				"speed": 1,
				"level": 1,
				"growth": 0.1,
				"exp": 0
			},
		},
		
		
		/**
		 * キャラクターデータ
		 */
		enemyDataList: {
			"underling": {
				"id": 1,
				"name": "underling",
				"image": "res/enemy/Kaijin_1.png",
				"animPattern": {
					"normal": ["res/enemy/Kaijin_1.png", "res/enemy/Kaijin_2.png"],
					"right": ["res/enemy/Kaijin_3.png", "res/enemy/Kaijin_4.png"],
					"left": ["res/enemy/Kaijin_1.png", "res/enemy/Kaijin_2.png"]
				},
				"movePattern": 0,
				"hitpoint": 100,
				"attack": 1,
				"speed": 1,
				"level": 1,
				"exp": 0
			},
			"caughtprincess": {
				"id": 2,
				"name": "caughtprincess",
				"image": "res/princess_caught/princess_caught.png",
				"animPattern":{
					"normal": ["res/princess_caught/princess_caught.png"],
					"right": ["res/princess_caught/princess_caught.png"],
					"left": ["res/princess_caught/princess_caught.png"]
				},
				"movePattern": 0,
				"hitpoint": 200,
				"attack": 0,
				"speed": 0,
				"level": 1,
				"exp": 100
			}
		},
		
		/**
		 * BGM再生のON,OFF用
		 */
		getBgm: function () {
			bgmState = cc.sys.localStorage.getItem('bgmState');
			return bgmState;
		},

		setBgm: function (bgmState) {
			cc.sys.localStorage.setItem('bgmState', bgmState);
			return;
		},

	};
})();