var App = App || {};
var lib = lib || new Lib();
var manager = manager || new Manager();

var Enemy = null;
(function () {

	Enemy = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	Enemy.prototype = lib.extend(AttackCharacter.prototype, {
		
		_target: null,

		/**
		 * アニメーションパターン作成
		 */
		_animPattern: {
			normal: [res.EnemyLeft1, res.EnemyLeft2],
			right: [res.EnemyRight1, res.EnemyRight2],
			left: [res.EnemyLeft1, res.EnemyLeft2]
		},

		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			self.chara = this.superclass.__construct.call(this, config);

			//初期化
			self.isUpdate = true;
			self._beforeType = null;
			self._target = config.target || {};	//ターゲットの配列を格納

			return self.chara;
		},

		/**
		 * update
		 */
		framecount: 0,
		isUpdate: false,
		update: function () {
			var self = this;

			if (self.framecount < 10) {
				self.framecount++;
				return;
			}
			self.framecount = 0;
			
			//updateの準備がOKか
			if (!self.isUpdate) {
				return;
			}

			//ターゲットまで移動
			self._moveToTarget({
				start: self._changeAnimPattern,	//アニメーションの向きを更新
				target: self._target
			});

			return;
		}

	});
	
	App.enemy = Enemy;
})();