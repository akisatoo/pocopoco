var lib = lib || new Lib();

var HeroCharacter = null;

(function () {

	HeroCharacter = function (config) {
		config = config || {};
		return;
	};

	HeroCharacter.prototype = lib.extend(AttackCharacter.prototype, {


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

			//あたり判定
			if (self._hitTest({target: myTarget})) {
				self._hitRotation({
					complete: function () {
						manager.gameStage.removeChild(self.chara, true);
						self.chara = null;
						return;
					}
				});

				//ターゲット
				myTarget._instance._hitRotation({
					complete: function () {
						manager.gameStage.removeChild(myTarget, true);
						self._targets[targetIndex] = null;
						return;
					}
				});
			}

			//ターゲットまで移動
			self._moveToTarget({
				start: self._changeAnimPattern,	//アニメーションの向きを更新
				target: myTarget
			});

			/*
			//updateで移動
			self._updateMove({
				target: {x: 100, y: 100}//myTarget
			});
			 */

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
})();