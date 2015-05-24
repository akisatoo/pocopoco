var App = App || {};
App.pattern = App.pattern || {};
App.pattern.move = App.pattern.move || [];

(function() {
	/**
	 * 移動パターン
	 * 
	 * 突進型
	 * id: 4
	 */
	App.pattern.move[4] = function(config) {
		config = config || {};
		return;
	};
	
	App.pattern.move[4].prototype = {
			
		id:4,
		type: 'tackle',
		
		moveFrame: 0, 	// フレームカウント
		isMove: false,	// 移動状態
		spX: 0,
		spY: 0,
		
		/**
		 * 移動法
		 */
		_updateMove: function(config) {
			config = config || {};
			var self = this;
			var target = config.target;
			var speed = 10;
			
			/**
			 * 移動状態を判定する
			 */
			self.moveFrame++;
			if(60 <= self.moveFrame) {
				self.isMove = !self.isMove;
				
				if(self.isMove) {
					// radianを出す
					var rad = Math.atan2(target.y - self.chara.y, target.x - self.chara.x);
					self.spX = speed * Math.cos(rad);
					self.spY = speed * Math.sin(rad);
				}
				
				// フレームカウントをリセット
				self.moveFrame = 0;
			}
			
			if(!self.isMove) {
				return;
			}
			
			// ダメージを受けるとストップ
			if(self._isDamage) {
				self.isMove = false;
				self.moveFrame = 0;
			}
			
			self.chara.x += self.spX;
			self.chara.y += self.spY;
			
			return;
		},
	};
})();