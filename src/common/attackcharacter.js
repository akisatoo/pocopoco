var lib = lib || new Lib();

var AttackCharacter = null;

(function () {

	AttackCharacter = function (config) {
		config = config || {};
		return;
	};

	AttackCharacter.prototype = lib.extend(BaseCharacter.prototype, {
		
		
		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			self.chara = AttackCharacter.prototype.superclass.__construct.call(this, config);
			return self.chara;
		},
		
		
		/**
		 * アニメーションの向きを変更
		 */
		_beforeType: null,	//以前のアニメーションパターンタイプ
		_changeAnimPattern: function (selector, config) {
			config = config || {};
			var self = this;
			var type = self._beforeType;
			var target = config.target || null;

			if (!self.chara || !target) {
				return;
			}

			//アニメーションの更新
			if (target.x > self.chara.x) {
				//右向きアニメーション
				type = 'right';
			} else if (target.x < self.chara.x) {
				//左向きアニメーション
				type = 'left';
			}
			
			//以前の状態と同じか
			if (self._beforeType === type) {
				return;
			}
			
			//アニメーション開始
			self._animStart({
				type: type,
				delay: 0.4
			});
			
			//以前のタイプとして保存
			self._beforeType = type;
			
			return;
		},
		
		
		/**
		 * 衝突時処理(はじかれる時)
		 */
		_hitReaction: function (config) {
			config = config || {};
			
			var self = this;
			var target = config.target || null;

			if (!self.chara || !target) {
				return;
			}
			
			//移動アニメーションがあれば停止、初期化
			if (self._moveAnim) {
				self.chara.stopAction(self._moveAnim);
				self._moveAnim = null;
			}

			//はじかれる時の方向
			if (target.x > self.chara.x) {
				//右向き
				var directionX = -200;
			} else if (target.x < self.chara.x) {
				//左向き
				var directionX = 200;
			}
			
			//console.log( "hoge" );
			
			var jump = cc.JumpBy.create(1, cc.p(Math.floor(Math.random() * directionX), 20), 20, 1);
			//var seq = cc.Sequence.create(spawn, comp);
			self.chara.runAction(jump);
			
			return;
		},
		

		/**
		 * 衝突時処理
		 */
		_hitRotation: function (config) {
			config = config || {};
			var self = this;
			var completeFunc = config.complete || function () {};

			var directionX = Math.floor(Math.random() * 2);
			if(directionX == 0){
				directionX = -100;
			} else {
				directionX = 100;
			}
			
			var jump = cc.JumpBy.create(1, cc.p(Math.floor(Math.random() * directionX), 20), 20, 1);
			var rotation = cc.RotateTo.create(0.5, 840);
			var comp = new cc.CallFunc(completeFunc, self);
			var spawn = cc.Spawn.create(jump, rotation);
			var seq = cc.Sequence.create(spawn, comp);
			
			self.chara.runAction(seq);

			return;
		},
	});
})();