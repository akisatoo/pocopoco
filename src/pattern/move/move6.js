var App = App || {};
App.pattern = App.pattern || {};
App.pattern.move = App.pattern.move || [];

(function () {
	
	/**
	 * 移動パターン
	 * 
	 * 守備型
	 * id: 6
	 */
	App.pattern.move[6] = function(config) {
		config = config || {};
		return;
	};
	
	App.pattern.move[6].prototype = {
		
		id: 6,
		type: 'defence',
		
		rot: 0,
		rotDis: 0,
		rotSpeed: 0.1,
		firstFrame: true,
		
		/**
		 * 移動法
		 */
		_updateMove: function (config) {
			config = config || {};
			var self = this;
			var target = self.princess;
			var speed = self._speed;
			var rad = Math.atan2(target.y - self.chara.y, target.x - self.chara.x);
			
			if(self.firstFrame) {
				/**
				 * 初期値設定
				 */
				self.rotDis = Math.sqrt(Math.pow(target.y - self.chara.y, 2) + Math.pow(target.x - self.chara.x, 2));
				
				self.firstFrame = false;
				return;
			}
			
			if(self._isDamage) {
				self.rotDis = Math.sqrt(Math.pow(target.y - self.chara.y, 2) + Math.pow(target.x - self.chara.x, 2));;

				return;
			}
			
			

			if(100 <= self.rotDis) {
				self.rotDis -= speed;
			} else {
				self.rotDis += speed;
			}
			
			var x = target.x + (Math.cos(rad + self.rotSpeed) * self.rotDis);
			var y = target.y + (Math.sin(rad + self.rotSpeed) * self.rotDis);
			
			self.chara.x = x;
			self.chara.y = y;
			cc.log("x: " + x + ", y: " + y);
			
			return;
		},
	};
})();