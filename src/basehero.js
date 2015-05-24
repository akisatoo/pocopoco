var lib = lib || new Lib();
var manager = manager || new Manager();

var BaseHero = null;
(function () {

	BaseHero = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	BaseHero.prototype = lib.extend(Character.prototype, {

		_targets: null,	//ターゲット

		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			self.chara = BaseHero.prototype.superclass.__construct.call(this, config);
			
			//初期化
			self.isUpdate = false;
			self._beforeType = null;
			self._targets = config.targets || [];	//ターゲット(敵)の配列を格納
			self.princess = config.princess || null;	//守るターゲット

			//攻撃
			self._initAttack();
			
			//バウンドアニメーション
			self._animBounds();

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
		 * バウンド
		 */
		_animBounds: function (config) {
			config = config || {};
			var self = this;

			//updateを開始
			var updateStart = function () {
				self.isUpdate = true;

				//アニメーション開始
				self._animStart({
					type: 'normal',
					delay: 0.4
				});

				return;
			};

			var jump = cc.JumpBy.create(1, cc.p(0, 0), 20, 2);
			var updateCall = cc.CallFunc.create(updateStart, self);
			var seq = cc.Sequence.create(jump, updateCall);
			self.chara.runAction(seq);

			return;
		},


		/**
		 * 最短のターゲットを検索し移動
		 * 
		 * patternでオーバライドすることでターゲットを選択できるようになっている
		 */
		_searchTarget: function () {
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

			//ターゲットがいない場合、動かさない
			if (self._targets.length === 0 || !myTarget) {
				return;
			}
			
			//ダメージ状態ならあたり判定は飛ばす
			if (self._isDamage === true) {
				return;
			}
			
			//攻撃
			self._updateAttack({
				target: myTarget
			});

			//あたり判定
			if (self._hitTest({target: myTarget})) {
				
				self._isDamage = true;	//ダメージ状態に
				
				//HPを減らす
				self._hitpoint = self._hitpoint - myTarget._instance._attack;
				if (self._hitpoint <= 0) {
					// キャラが消える処理の実行
					self._hitRotation({
						complete: function () {
							manager.gameStage.removeChild(self.chara, true);
							self.chara = null;
							return;
						}
					});

				} else {
					//キャラが跳ね返る動きの実行
					self._hitReaction({
						target: myTarget,
						complete: function () {
							//ダメージ状態から通常状態に戻す
							self._isDamage = false;
							return;
						}
					});
				}

				//ターゲット
				//ダメージ状態に
				myTarget._instance._isDamage = true;
				//HPを減らす
				myTarget._instance._hitpoint = myTarget._instance._hitpoint - self._attack;
				if(myTarget._instance._hitpoint <= 0){
					myTarget._instance._hitRotation({
						complete: function () {
							manager.gameStage.removeChild(myTarget, true);
							self._targets[targetIndex] = null;
							return;
						}
					});
				} else {
					//キャラが跳ね返る動きの実行
					myTarget._instance._hitReaction({
						target: self.chara,
						complete: function () {
							//ダメージ状態から通常状態に戻す
							myTarget._instance._isDamage = false;
							return;
						}
					});
				}
			}
			/*
			//ターゲットまで移動
			self._moveToTarget({
				start: self._changeAnimPattern,	//アニメーションの向きを更新
				target: myTarget
			});
			 */

			//updateで移動
			self._updateMove({
				target: myTarget
			});
			
			//キャラのアニメーション向きを更新
			self._changeAnimPattern({}, {target: myTarget});

			return;
		},


		/**
		 * updateでの移動法
		 * 
		 * patternのmoveでオーバライドして使用
		 */
		_updateMove: function (config) {
			config = config || {};
			var self = this;
			var target = config.target;
			return;
		},
		
		/**
		 * 攻撃初期化
		 * 
		 * patternでオーバライドする
		 */
		_initAttack: function (config) {},



		/**
		 * 攻撃update
		 * 
		 * patternでオーバライドする
		 */
		_updateAttack: function (config) {},
		
		
	});

	App.basehero = BaseHero;
})();