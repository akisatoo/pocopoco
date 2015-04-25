var lib = lib || new Lib();
var manager = manager || new Manager();

var BaseEnemy = null;
(function () {

	BaseEnemy = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	BaseEnemy.prototype = lib.extend(Character.prototype, {

		_target: null,	//ターゲット
		_reactionflug: null, //はじかれる処理用フラグ

		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			self.chara = BaseEnemy.prototype.superclass.__construct.call(this, config);

			//初期化
			self.isUpdate = true;
			self._beforeType = null;
			self._target = config.target || {};	//ターゲットの配列を格納
			
			return self.chara;
		},

		/**
		 * update
		 */
		isUpdate: false,
		update: function () {
			var self = this;

			//updateの準備がOKか
			if (!self.isUpdate) {
				return;
			}

			//最短のターゲットを見つける
			self._searchTarget();
			
			return;
		},



		/**
		 * ターゲットを検索し移動
		 */
		_searchTarget: function () {
			var self = this;

			//あたり判定
			if (self._hitTest({target: self._target})) {
				//TODO:ゲームオーバーに飛ばす
				//console.log('GAME OVER...');
			}

			//updateで移動
			self._updateMove({
				target: self._target
			});

			return;
		},
		

		/**
		 * updateでの移動法
		 */
		_updateMove: function (config) {
			config = config || {};
			var self = this;
			var target = config.target;

			var disX = target.x - self.chara.x;
			var disY = target.y - self.chara.y;

			self._changeAnimPattern({}, {target: target});

			if (disX > 0) {
				//ターゲットが右
				self.chara.x = self.chara.x + 1;
			} else if (disX < 0) {
				//ターゲットが左
				self.chara.x = self.chara.x - 1;
			}

			if (disY > 0) {
				//ターゲットが上
				self.chara.y = self.chara.y + 1;
			} else if (disY < 0) {
				//ターゲットが
				self.chara.y = self.chara.y - 1;
			}

			return;
		},

	});

	App.baseenemy = BaseEnemy;
})();