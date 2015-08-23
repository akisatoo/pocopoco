var App = App || {};
App.pattern = App.pattern || {};
App.pattern.move = App.pattern.move || [];

(function () {
	
	/**
	 * 移動パターン
	 * 
	 * 慎重型
	 * id: 5
	 */
	App.pattern.move[5] = function(config) {
		config = config || {};
		return;
	};
	
	App.pattern.move[5].prototype = {
		
		id: 5,
		type: 'carefulless',
		
		/**
		 * 移動法
		 */
		_updateMove: function(config) {
			config = config || {};
			var self = this;
			var target = config.target;
			var speed = self._speed;
			
			// targetとの距離を出す
			var dis = Math.sqrt(Math.pow(target.y - self.chara.y, 2) + Math.pow(target.x - self.chara.x, 2));
			// radianを出す
			var rad = Math.atan2(target.y - self.chara.y, target.x - self.chara.x);
			
			if(dis <= 150) {
				self.chara.x -= speed * Math.cos(rad);
				self.chara.y -= speed * Math.sin(rad);
				
				return
			}
			
			self.chara.x += speed * Math.cos(rad);
			self.chara.y += speed * Math.sin(rad);
			
			return;
		},
	};
})();