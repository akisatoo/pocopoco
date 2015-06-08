var App = App || {};
App.pattern = App.pattern || {};
App.pattern.move = App.pattern.move || [];

(function () {

	/**
	 * 移動パターン
	 * 
	 * 敵を追尾(減速つき)
	 * id: 2
	 */
	App.pattern.move[2] = function (config) {
		config = config || {};
		return;
	};

	App.pattern.move[2].prototype = {

			id: 2,
			type:  'homing',
			addSpeed: 3,
			speedMin: 0.5,

			/**
			 ** 移動法
			 */
			_updateMove: function (config) {
				config = config || {};
		
				var self = this;
				var target = config.target;
				var speed = 4;
				//var addSpeed = speed;
				//var speedMin = 1;

				//radianをだす
				var rad = Math.atan2(target.y - self.chara.y, target.x - self.chara.x);

				if(self.addSpeed >= self.speedMin){
					self.addSpeed -= self.addSpeed * 0.03;
				} else {
					self.addSpeed = self.speedMin;
				}
				console.log(self.addSpeed);	
				self.chara.x += speed * Math.cos(rad) * self.addSpeed;
				self.chara.y += speed * Math.sin(rad) * self.addSpeed;	

				return;
			},
	};
})();