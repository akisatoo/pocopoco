var App = App || {};
App.pattern = App.pattern || {};
App.pattern.move = App.pattern.move || [];

(function () {

	/**
	 * 移動パターン
	 * 
	 * 直進型
	 * id: 0
	 */
	App.pattern.move[0] = function (config) {
		config = config || {};
		return;
	};

	App.pattern.move[0].prototype = {
		
		straight: 'Straight',
		
		/**
		 * 移動法
		 */
		_updateMove: function (config) {
			config = config || {};
			var self = this;
			var target = config.target;
/*
			var disX = target.x - self.chara.x;
			var disY = target.y - self.chara.y;

			self._changeAnimPattern({}, {target: target});

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
*/
			return;
		},

	};
})();