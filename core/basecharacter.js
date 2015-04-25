var BaseCharacter = null;
(function () {

	BaseCharacter = function (config) {
		config = config || {};
		return;
	};
	
	BaseCharacter.prototype = {
			
		/**
		 * 体力
		 */
		_hitpoint: 1,
		
		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			
			var x = config.x || null,
				y = config.y || null;
			
			var image = config.image || '';
			
			var size = cc.winSize;	//画面サイズ
			
			//初期化
			self._moveAnim = null;
			self._hitpoint = 1;
			
			//キャラ生成
			self.chara = new cc.Sprite(image);
			self.chara.x = x || 0;
			self.chara.y = y || 0;
			
			//初期化
			//self._init(config);
			
			//インスタンスにthisを設定
			self.chara._instance = self;
					
			return self.chara;
		},
		
		/**
		 * 初期化処理
		 */
		_init: function () {},
		
		
		/**
		 * アニメーション
		 */
		_animAction: null,
		_animPattern: {},
		_animStart: function (config) {
			config = config || {};
			var self = this;
			var type = config.type;
			var delay = config.delay || 0.1;
			
			if (self._animAction) {
				//アニメーションの初期化
				self.chara.stopAction(self._animAction);
				self._animAction = null;
			}
			
			//パターンが設定されていなければreturn
			if (!self._animPattern[type]) {
				return;
			}
			
			var animation = new cc.Animation();
			//アニメーションフレーム登録
			_.each(self._animPattern[type], function (pattern) {
				animation.addSpriteFrameWithFile(pattern);
			});
			
			//Delayを設定
			animation.setDelayPerUnit(delay);
			
			var anim = new cc.Animate(animation);
			//繰り返しアニメーション
			self._animAction = new cc.RepeatForever(anim);
			self.chara.runAction(self._animAction);
			
			return;
		},
		
		
		/**
		 * ターゲットを指定してそこまで移動
		 */
		_moveAnim: null,
		_moveToTarget: function (config) {
			config = config || {};
			var self = this;
			var duration = config.duration || 4;
			var target = config.target || null;
			var startFunc = config.start || function () {};
			var completeFunc = config.complete || function () {};
			
			if (!self.chara) {
				return;
			}
			
			//移動アニメーションがあれば停止、初期化
			if (self._moveAnim) {
				self.chara.stopAction(self._moveAnim);
				self._moveAnim = null;
			}
			
			if (!target) {
				return;
			}
			
			//動作前の処理
			var start = new cc.CallFunc(startFunc, self, {target: target});
			//ターゲットまで移動
			var move = cc.MoveTo.create(duration, cc.p(target.x, target.y));
			//動作後の処理
			var comp = new cc.CallFunc(completeFunc, self);
			self._moveAnim = cc.Sequence.create(start, move, comp);
			self.chara.runAction(self._moveAnim);
			
			return;
		},
		
		
		/**
		 * 2点間の距離
		 */
		_getDistance: function (x1, y1, x2, y2) {
			var x = x1 - x2,
			y = y1 - y2;
			return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		},
		
		
		/**
		 * あたり判定
		 */
		_hitTest: function (config) {
			config = config || {};
			var self = this;
			var target = config.target || null;
			
			if (!target) {
				return false;
			}
			
			if(cc.rectIntersectsRect(self.chara, target)){
				return true;
			}
			
			return false;
		}
		
		
	};
})();