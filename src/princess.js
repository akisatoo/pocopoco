var App = App || {};
var lib = lib || new Lib();
var manager = manager || new Manager();

var Princess = null;
(function () {

	Princess = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	Princess.prototype = lib.extend(BaseCharacter.prototype, {
		
		/**
		 * アニメーションパターン作成
		 */
		_animPattern: {
			normal: [res.PrincessRight1, res.PrincessRight2]
		},
		
		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			var size = cc.winSize;	//画面サイズ
			var sceneType = config.sceneType || 'game';
			var animType = config.animType || 'normal';
			
			//スーパークラスのコンストレクタ実行
			self.chara = this.superclass.__construct.call(this, config);
			
			self.chara.x = config.x || self.chara.width / 2;
			self.chara.y = config.y || size.height / 2;

			//アニメーション開始
			self._animStart({
				type: animType
			});
			
			//ターゲット
			self._target = config.target || {x: size.width - self.chara.width / 2, y: size.height / 2};
			
			//ターゲットまで移動
			self._moveToTarget({
				target: self._target,
				duration: 5,
				complete: function () {
					if (sceneType === 'title') {
						return;
					}
					//return;
					//メインページ
					cc.director.runScene(cc.TransitionFade(1.2, new OverScene({
						level: 1
					})));
					return;
				}
			});

			return self.chara;
		},
		
		
		/**
		 * update
		 */
		update: function () {
			return;
		},
		

	});
	
	App.princess = Princess;
})();