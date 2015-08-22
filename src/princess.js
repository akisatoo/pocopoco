var App = App || {};
var lib = lib || new Lib();
var manager = manager || new Manager();

var Princess = null;
(function () {

	Princess = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	Princess.prototype = lib.extend(Character.prototype, {
		
		/**
		 * アニメーションパターン作成
		 */
		_animPattern: {
			normal: [res.PrincessRight1, res.PrincessRight2]
		},
		
		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			var size = cc.winSize;	//画面サイズ
			var animType = config.animType || 'normal';
			self.sceneType = config.sceneType || 'game';
			
			//スーパークラスのコンストレクタ実行
			self.chara = this.superclass.__construct.call(this, config);
			
			var dungeonType = config.dungeonType || null;
			var startPos = {};
			var goalPos = {};
			
			switch (dungeonType) {
				case 'vertical':
					//スタート地点
					startPos.x = size.width / 2 - self.chara.width;
					startPos.y = self.chara.height / 2;
					//ゴール地点
					goalPos.x = size.width / 2 + self.chara.width;
					goalPos.y = size.height - self.chara.height / 2;
					break;
				case 'horizontal':
					//スタート地点
					startPos.x = self.chara.width / 2;
					startPos.y = size.height / 2;
					//ゴール地点
					goalPos.x = size.width - self.chara.width / 2;
					goalPos.y = size.height / 2;
					break;
				default:
					//スタート地点
					startPos.x = size.width / 2 - self.chara.width;
					startPos.y = self.chara.height / 2;
					//ゴール地点
					goalPos.x = size.width / 2 + self.chara.width;
					goalPos.y = size.height - self.chara.height / 2;
					break;
			};
			
			self.chara.x = config.x || startPos.x;
			self.chara.y = config.y || startPos.y;

			//アニメーション開始
			self._animPattern = {
				normal: [res.PrincessRight1, res.PrincessRight2]
			};
			self._animStart({
				test: 'princess',
				type: animType
			});
			
			//ターゲット
			self._target = config.target || goalPos;

			return self.chara;
		},
		
		
		/**
		 * update
		 */
		update: function () {
			return;
		},
		
		/**
		 * 移動開始
		 */
		moveStart: function () {
			var self = this;

			//ターゲットまで移動
			self._moveToTarget({
				target: self._target,
				duration: 5,
				complete: function () {
					if (self.sceneType === 'title') {
						return;
					}
					//return;
					
					//ゲームシーンのupdateを止める
					manager.gameStage.stopUpdate();
					// TODO: ボス戦、次ステージ、クリア、オーバー画面で処理を切り分け
					if (manager.gameStage.myLevel < manager.gameStage.dungeonData.level) {
						//ゲームシーン
						cc.director.runScene(cc.TransitionSlideInB(1.2, new GameScene({
							level: manager.gameStage.myLevel + 1,
							dungeonData: manager.gameStage.dungeonData
						})));
						return;
					}
					
					//リザルトシーン
					cc.director.runScene(cc.TransitionTurnOffTiles(1.2, new ResultScene()));
					
					return;
				}
			});
		},
		
		
		/**
		 * 移動ストップ
		 */
		moveStop: function (config) {
			config = config || {};
			var self = this;
			
			//移動アニメーションがあれば停止、初期化
			if (self._moveAnim) {
				self.chara.stopAction(self._moveAnim);
				self._moveAnim = null;
			}
			
			return;
		}
		

	});
	
	App.princess = Princess;
})();