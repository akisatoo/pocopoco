var lib = lib || new Lib();
var manager = manager || new Manager();



var MenuHeros = null;
(function () {

	MenuHeros = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	MenuHeros.prototype = lib.extend(BaseCharacter.prototype, {

		//_targets: null,	//ターゲット
		moveCount: 0,		//移動用フレームカウント
		moveCountMax: 60,	//移動用フレームカウントの最大値
		moveVector: 0,		//移動方向用変数
		oldMoveVector: 0,	//アニメーション判定用変数

		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			self.chara = MenuHeros.prototype.superclass.__construct.call(this, config);

			//初期化
			self.isUpdate = false;
			self._beforeType = null;
			
			//キャラクターのアニメーションパターン設定
			self._animPattern = config.animPattern || {};

			//バウンドアニメーション
			self._animBounds();

			return self.chara;
		},

		/**
		 * update
		 */
		isUpdate: false,
		update: function () {
			var self = this;

			
			
			//updateの準備がOKか
			if (!self.isUpdate) {
				return;
			}
			self._updateMove();

			return;
		},


		/**
		 * バウンド
		 */
		_animBounds: function (config) {
			config = config || {};
			var self = this;

			//updateを開始
			var updateStart = function () {
				self.isUpdate = true;

				//アニメーション開始
				self._animStart({
					type: 'normal',
					delay: 0.4
				});
				

				return;
			};

			var jump = cc.JumpBy.create(1, cc.p(0, 0), 20, 2);
			var updateCall = cc.CallFunc.create(updateStart, self);
			var seq = cc.Sequence.create(jump, updateCall);
			self.chara.runAction(seq);

			return;
		},


		/**
		 * 最短のターゲットを検索し移動
		 * 
		 * patternでオーバライドすることでターゲットを選択できるようになっている
		 */
		_searchTarget: function () {
			var self = this;

			var myTarget = null,	//最短のターゲット
			targetIndex = null,	//ターゲットの添字
			distMin = null;	//最短距離

			//updateで移動
			self._updateMove({
			});

			//キャラのアニメーション向きを更新
			self._changeAnimPattern({}, {target: myTarget});

			return;
		},


		/**
		 * updateでの移動法
		 * 
		 * patternのmoveでオーバライドして使用
		 */
		_updateMove: function (config) {
			config = config || {};
			var self = this;
			
			self.moveCount++;
			
			// 移動方向を変更する
			if(self.moveCount >= self.moveCountMax){
				self.moveVector = Math.floor(Math.random() * 5);
				self.moveCount = 0;
			}
			
			switch(self.moveVector){
			//停止
			case 0:
				break;
			//上移動	
			case 1:
				if(self.chara.y < cc.winSize.height - 150){
					self.chara.y++;
				}else{
					self.moveVector = 0;
				}
				break;
			//下移動
			case 2:
				if(self.chara.y > 100 ){
					self.chara.y--;
				}else{
					self.moveVector = 0;
				}
				break;
			//左移動
			case 3:
				if(self.chara.x > 0 ){
					self.chara.x--;
					
					// アニメーションの方向を変更
					if(self.moveVector != self.oldMoveVector){
						self._animStart({
							type: 'left',
							delay: 0.4
						});
					}
					
				}else{
					self.moveVector = 0;
				}
				break;
			//右移動
			case 4:
				if(self.chara.x < cc.winSize.width ){
					self.chara.x++;
					
					// アニメーションの方向を変更
					if(self.moveVector != self.oldMoveVector){
						self._animStart({
							type: 'right',
							delay: 0.4
						});
					}
					
				}else{
					self.moveVector = 0;
				}
				break;
			}
			
			// アニメーション判定用に代入する
			self.oldMoveVector = self.moveVector;
			
			return;
		},


	});

	App.menuheros = MenuHeros;
})();