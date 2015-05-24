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
			 ** 移動法
			 */
			_updateMove: function (config) {
				config = config || {};

				//console.log(disPos);			
				var self = this;
				var target = config.target;
				var disX = target.x - self.chara.x;
				var disY = target.y - self.chara.y;
				
				//=======================================================
				//		敵を追尾する（加速つき）
				//=======================================================
				var aRotSpeed = 0.1;	// 弾の回転加速度
				var RotSpeedMax = 100;	// 弾の最高回転速度

				var _x = self.chara.x;
				var _y = self.chara.y;

				// ターゲットとのラジアンを求める
				var rad = Math.atan2(target.y - _y,target.x - _x);

				var rot = rad * 180 / Math.PI;	// ラジアンから角度に変換
				var _rotation = rot;		// 回転

				var RotSpeed = 10;	// 回転速度
				var Speed = 6;		// スピード

				// 的と弾の角度
				rad = Math.atan2(target.y - _y, target.x - _x);
				rot = rad * 180 / Math.PI;	// ラジアンに変換

				// 角度を丸める
				if (_rotation - 180 > rot) {
					rot += 360;
				}
				if (_rotation + 180 < rot) {
					rot -= 360;
				}

				// 現在の角度と比較して近い方に少し回転
				if (_rotation - rot > RotSpeedMax) {
					RotSpeed -= aRotSpeed;
				} else if (_rotation - rot < -RotSpeedMax) {
					RotSpeed += aRotSpeed;
				} else {
					RotSpeed *= 0.5;	// 減速
				}

				// 回転速度のリミッタ
				if (RotSpeed > RotSpeedMax)	RotSpeed = RotSpeedMax;
				if (-RotSpeed < -RotSpeedMax)	RotSpeed = RotSpeedMax;

				// 角度に回転速度を加算  
				_rotation += RotSpeed;

				Speed = Speed * 2.05;	// スピードを加速

				// 的と弾の角度
				var rad2 = _rotation * Math.PI / 180;

				// 移動量を計算
				var dx = Math.cos(rad2) * Speed;
				var dy = Math.sin(rad2) * Speed;


				if (disX > 0) {
					//ターゲットが右
					self.chara.y += dy;
				} else if (disX < 0) {
					//ターゲットが左
					self.chara.y -= dy;
				}

				if (disX > 0) {
					//ターゲットが右
					self.chara.x += dx;
				} else if (disX < 0) {
					//ターゲットが左
					self.chara.x -= dx;
				}
				
				
				
				
				

				//アニメーションの変更
				self._changeAnimPattern({}, {target: target});

				return;
			},


	};
})();