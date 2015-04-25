var lib = lib || new Lib();
var manager = manager || new Manager();

var Magician = null;
(function () {

	Magician = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	Magician.prototype = lib.extend(HeroCharacter.prototype, {

		_targets: null,	//ターゲット
		_magicBullets: [],	//魔法弾の管理配列

		/**
		 * アニメーションパターン作成
		 */
		_animPattern: {
			normal: [res.MagicianRight1, res.MagicianRight2],
			right: [res.MagicianRight1, res.MagicianRight2],
			left: [res.MagicianLeft1, res.MagicianLeft2]
		},


		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			self.chara = this.superclass.__construct.call(this, config);

			//初期化
			self.isUpdate = false;
			self._beforeType = null;
			self._targets = config.targets || [];	//ターゲットの配列を格納
			self._magicBullets = [];	//魔法弾の管理配列

			//バウンドアニメーション
			self._animBounds();

			return self.chara;
		},
		
		/**
		 * update
		 */
		framecount: 0,
		isUpdate: false,
		update: function () {
			var self = this;
			
			//衝突判定
			self._hitCheck();

			if (self.framecount < 50) {
				self.framecount++;
				return;
			}
			self.framecount = 0;

			//updateの準備がOKか
			if (!self.isUpdate) {
				return;
			}
			
			_.each(self._magicBullets, function (bullet) {
				if (!bullet) {
					return;
				}
				bullet._instance.update();
				return;
			});

			//魔法弾を打つ
			self._shotMagicBullet();

			return;
		},
		
		
		
		/**
		 * 魔法を打つ
		 */
		_shotMagicBullet: function (config) {
			config = config || {};
			var self = this;
			
			var myTarget = null,	//最短のターゲット
			targetIndex = null,	//ターゲットの添字
			distMin = null;	//最短距離

			//最短ターゲット検索
			_.each(self._targets, function (target, index) {

				if (!target || !self.chara) {
					return;
				}

				//ターゲットとの距離
				var distance = self._getDistance(self.chara.x, self.chara.y, target.x, target.y);

				//最短(distMin)よりも離れているか
				if (distMin !== null && distance > distMin) {
					return;
				}
				myTarget = target;
				targetIndex = index;
				distMin = distance;
			});
			
			if (!myTarget) {
				return;
			}
			
			var magicBullet = new Magicbullet({
				targets: self._targets,
				target: myTarget,
				bullets: self._magicBullets,
				bulletIndex: self._magicBullets.length
			});
			magicBullet.x = self.chara.x,
			magicBullet.y = self.chara.y,
			self._magicBullets.push(magicBullet);
			manager.gameStage.addChild(magicBullet);
			
			return;
		},
		
		
		/**
		 * 衝突判定
		 */
		_hitCheck: function (config) {
			config = config || {};
			var self = this;
			
			if (!self.chara) {
				self.isUpdate = false;
				return;
			}
			
			_.each(self._targets, function (target) {
			
				//あたり判定
				if (self._hitTest({target: target})) {
					self._hitRotation({
						complete: function () {
							manager.gameStage.removeChild(self.chara, true);
							self.chara = null;
							return;
						}
					});
				}
				
				return;
			});
			
			return;
		}

	});

	App.magician = Magician;
})();