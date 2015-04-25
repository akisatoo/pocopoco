var lib = lib || new Lib();
var manager = manager || new Manager();

var Magicbullet = null;
(function () {

	Magicbullet = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	Magicbullet.prototype = lib.extend(AttackCharacter.prototype, {

		_targets: null,	//ターゲット
		
		_animPattern: {
			normal: [res.Magicbullet1, res.Magicbullet2],
			explosion: [res.Explosion1, res.Explosion2, res.Explosion3, res.Explosion4, res.Explosion5, res.Explosion6, res.Explosion7]
		},


		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			config.image = res.Magicbullet1;
			self.chara = this.superclass.__construct.call(this, config);

			//初期化
			self.isUpdate = true;
			self._moveAnim = null;
			self._targets = config.targets || [];	//ターゲットの配列を格納
			self._target = config.target || {};	//ターゲット本体
			self._targetIndex = config.targetIndex;
			
			self._bullets = config.bullets;
			self._bulletIndex = config.bulletIndex;

			//アニメーション開始
			self._animStart({
				type: 'normal',
				delay: 0.1
			});
			
			//最短のターゲットを見つける
			self._moveToTarget({
				duration: 1,
				target: self._target,
				complete: self._bulletExplosion
			});
			
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

			

			return;
		},
		
		/**
		 * アニメーションの変更
		 * 魔法弾にはアニメーションはないので空でオーバーライド
		 */
		_changeAnimPattern: function () {},
		
		
		/**
		 * 爆発とのあたり判定
		 */
		_hitRect: function (config) {
			config = config || {};
			var self = this;
			var rect = config.rect || null;
			var target = config.target || null;

			if (!rect || !target) {
				return false;
			}

			if(cc.rectIntersectsRect(rect, target)){
				return true;
			}

			return false;
		},
		
		
		/**
		 * 爆発の処理
		 */
		_bulletExplosion: function (config) {
			config = config || {};
			var self = this;
			
			if (!self.chara) {
				return;
			}
			
			var explosionRect = cc.rect(self.chara.x, self.chara.y, self.chara.width, self.chara.height);
			
			//敵とのあたり判定
			_.each(self._targets, function (target, index) {
				if (!target) {
					return;
				}
				if (self._hitRect({
					rect: explosionRect,
					target: target
				})) {
					manager.gameStage.removeChild(target, true);
					target = null;
					self._targets[index] = null;
				};
				return;
			});
			
			//爆発アニメーション
			self._explosionAnim();
			
			return;
		},
		
		
		/**
		 * 爆発アニメーション
		 */
		_explosionAnim: function (config) {
			config = config || {};
			var self = this;
			
			if (self._animAction) {
				//アニメーションの初期化
				self.chara.stopAction(self._animAction);
				self._animAction = null;
			}
			
			var animation = new cc.Animation();
			//アニメーションフレーム登録
			_.each(self._animPattern['explosion'], function (pattern) {
				animation.addSpriteFrameWithFile(pattern);
			});

			//Delayを設定
			animation.setDelayPerUnit(0.1);
			
			//remove処理
			var removeFunc = function () {
				manager.gameStage.removeChild(self.chara);
				self.chara = null;
				self._bullets[self._bulletIndex] = null;
				return;
			};

			var anim = new cc.Animate(animation);
			var removeCall = cc.CallFunc.create(removeFunc, self);
			//繰り返しアニメーション
			self._animAction = cc.Sequence.create(anim, removeCall);
			self.chara.runAction(self._animAction);
			
			return;
		}
	});

})();