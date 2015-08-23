var App = App || {};
App.pattern = App.pattern || {};
App.pattern.move = App.pattern.move || [];

(function () {

	/**
	 * 移動パターン
	 * 
	 * 追尾型
	 * id: 0
	 */
	App.pattern.move[0] = function (config) {
		config = config || {};
		return;
	};

	App.pattern.move[0].prototype = {
		
		id: 0,
		type: 'homing',

		_updateMove: function (config) {
			config = config || {};
			var self = this;
			var target = config.target;
			var speed = self._speed;

			//radianをだす
			var rad = Math.atan2(target.y - self.chara.y, target.x - self.chara.x);
			self.chara.x += speed * Math.cos(rad);
			self.chara.y += speed * Math.sin(rad);


			return;
		},

	};
})();