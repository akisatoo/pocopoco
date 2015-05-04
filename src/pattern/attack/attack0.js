var App = App || {};
App.pattern = App.pattern || {};
App.pattern.attack = App.pattern.attack || [];

(function () {

	/**
	 * 攻撃パターン
	 * 
	 * 魔法弾
	 * id: 0
	 */
	App.pattern.attack[0] = function (config) {
		config = config || {};
		return;
	};

	App.pattern.attack[0].prototype = {

			id: 0,
			type: 'Shot',
			
			bullets: [],
			attackcount: 0,
			
			/**
			 * 攻撃初期化
			 */
			_initAttack: function (config) {
				config = config || {};
				var self = this;
				self.attackcount = 0;
				self.bullets = [];
				return;
			},
			
			

			/**
			 * 攻撃update
			 */
			_updateAttack: function (config) {
				config = config || {};
				var self = this;
				var target = config.target;
				
				_.each(self.bullets, function (bullet) {
					if (!bullet) {
						return;
					}
					bullet._instance.update();
					return;
				});
				
				if (self.attackcount < 50) {
					self.attackcount++;
					return;
				}
				self.attackcount = 0;

				if (!target) {
					return;
				}
				
				var bullet = new Basebullet({
					targets: self._targets,
					target: target,
					bullets: self.bullets,
					bulletIndex: self.bullets.length
				});
				bullet.x = self.chara.x,
				bullet.y = self.chara.y,
				self.bullets.push(bullet);
				manager.gameStage.addChild(bullet);

				return;
			},

	};
})();