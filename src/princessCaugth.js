var App = App || {};
var lib = lib || new Lib();
var manager = manager || new Manager();

var PrincessCaugth = null;
(function () {

	PrincessCaugth = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	PrincessCaugth.prototype = lib.extend(Character.prototype, {

		_target: null,

		/**
		 * アニメーションパターン作成
		 */
		/*_animPattern: {
			normal: [res.PrincessCaugth, res.PrincessCaugth]
		},*/

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
			//self._target = config.target || {};	//ターゲットの配列を格納

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

			/*
			//ターゲットまで移動
			self._moveToTarget({
				start: self._changeAnimPattern,	//アニメーションの向きを更新
				target: self._target
			});
			*/
			
			return;
		}

	});

	App.princessCaugth = PrincessCaugth;
})();