var App = App || {};
App.pattern = App.pattern || {};
App.pattern.move = App.pattern.move || [];

(function () {

	/**
	 * 移動パターン
	 * 
	 * 敵を追尾（加速つき）
	 * id: 1
	 */
	App.pattern.move[1] = function (config) {
		config = config || {};
		return;
	};

	App.pattern.move[1].prototype = {

			id: 1,
			type:  'homing_acceleration',
			addSpeed: 0,
			speedMax: 8,

			_updateMove: function (config) {
				config = config || {};
		
				var self = this;
				var target = config.target;
				var speed = self._speed;
				//var addSpeed = speed;
				//var speedMax = 10;

				//radianをだす
				var rad = Math.atan2(target.y - self.chara.y, target.x - self.chara.x);
				
				if(self.addSpeed <= self.speedMax){
					self.addSpeed += speed * 0.05;
				} else {
					self.addSpeed = self.speedMax;
				}
				console.log(self.addSpeed);
				
				self.chara.x += speed * Math.cos(rad) * self.addSpeed;
				self.chara.y += speed * Math.sin(rad) * self.addSpeed;	

				return;
			},


	};
})();