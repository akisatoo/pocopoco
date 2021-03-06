var App = App || {};
var lib = lib || new Lib();
var manager = manager || new Manager();
var ui = ui || new UI();
var Scene = Scene || {};

var GameLayer = cc.LayerColor.extend({
	sprite: null,
	playCountDown: null,
	
	ctor: function (config) {
		config = config || {};

		this._super();
		var self = this;
		var size = cc.winSize;
		
		self.myLevel = config.level || 1;
		self.dungeonData = config.dungeonData || {};
		
		//初期化
		self.princess = null;
		self.heros = [];
		self.enemys = [];

		//背景色
		self.setColor(cc.color(255, 255, 255));

		//背景
		var background = cc.Sprite(res.DungeonBackground);
		background.x = size.width / 2;
		background.y = size.height / 2;
		self.addChild(background, 0);
		
		var gameStage = this;
		//gameStage.setCascadeOpacityEnabled(true);
		manager.gameStage = this;
		
		//スロットデータの取得と整形
		self.slotData = [];
		self.partyList = manager.getPartyList();
		_.each(self.partyList, function (partyId) {
			self.slotData.push(manager.charaDataList()[partyId]);
			return;
		});
		
		//選択中のキャラを設定
		manager.currentChara = self.slotData[0].id;
		
		//スロット
		self.slotBlock = new Slot({
			slotData: self.slotData
		});
		self.slotBlock.x = 0;
		self.slotBlock.y = 0;//slotBlock.height / 2;
		gameStage.addChild(self.slotBlock, 9999);
		
		//姫様
		if(self.dungeonData.type !== 'rescue') {
			self.princess = new Princess({
				dungeonType: self.dungeonData.type,
				image: res.PrincessRight1
			});
			gameStage.addChild(self.princess);
		}
		
		if(self.dungeonData.type !== "rescue") {
			//敵の生成
			var enemyMax = 10;
			for (var i = 0; i < enemyMax; i++) {
				var enemy = new BaseEnemy(_.extend({}, manager.enemyDataList["underling"], {
					dungeonType: self.dungeonData.type,
					target: self.princess
				}));
				gameStage.addChild(enemy);
				self.enemys.push(enemy);
			}
		}
		
		//ゲームスタートまでのカウントダウン
		self.countDown = 3;
		
		self.defenceCount = 30;
		
		switch(self.dungeonData.type) {
		case 'defence':						
			//ゲーム中のカウント
			self.playCountDown = cc.LabelTTF(self.defenceCount, "MisakiGthic", 80);
			self.playCountDown.setColor(cc.color(0, 0, 0));
			self.playCountDown.setPosition(size.width / 2, size.height);
			self.playCountDown.setAnchorPoint(0.5, 1.0);
			manager.gameStage.addChild(self.playCountDown);

			break;
		case 'rescue':
			var princessCaught = new PrincessCaugth(_.extend({}, manager.enemyDataList["caughtprincess"], {
				dungeonType: self.dungeonData.type,
				x: size.width / 2,
				y: size.height
			}));
			gameStage.addChild(princessCaught);
			break;
		};
		
		//アップデートの処理を制限しない
		self.isUpdate = true;
		
		//カウントダウンラベル
		var countLabel = cc.LabelTTF(self.countDown, "MisakiGothic", 80);
		countLabel.setColor(cc.color(0, 0, 0));
		countLabel.setPosition(size.width / 2, size.height / 2);
		countLabel.setAnchorPoint(0.5, 0.5);
		gameStage.addChild(countLabel);
		
		//3秒カウントダウン
		setTimeout(function () {
			self.startCountDown(countLabel);
		}, 1000);

		//タッチイベント登録
		self._addTouchEvent();
		
		//update開始
		self.scheduleUpdate();

		return true;
	},
	
	slotBlock: null,
	slotData: [],
	
	myLevel: 1,
	dungeonData: null,	//ダンジョン情報
	heros: [],			//ヒーローの管理配列
	enemys: [],			//敵の管理配列
	countDown: 0,		//開始までのカウントダウン
	defenceCount: 0,	//ゲーム中のカウント
	
	/**
	 * カウントダウン開始
	 */
	startCountDown: function (label) {
		var self = this;
		var size = cc.winSize;
		var countInterval = setInterval(function () {
			self.countDown -= 1;

			if (self.countDown <= 0) {				
				clearInterval(countInterval);
				
				label.setString('GO!!');
				
				if(self.dungeonData.type === 'defence') {
					self.startDefenceCount(self.playCountDown);
				}

				var fadeout = cc.FadeOut(2);
				//動作後の処理
				var comp = new cc.CallFunc(function () {					
					self.removeChild(label);
					label = null;
					
					return;
				}, self);
				
				var seq = cc.Sequence.create(fadeout, comp);
				label.runAction(seq);
				
				if(self.princess != null) {
					self.princess._instance.moveStart();
				}
				return;
			}
			label.setString(self.countDown);
			return;
		}, 1000);
		return;
	},
	
	/**
	 * アップデート
	 */
	update: function () {
		var self = this;
		
		if (!self.isUpdate) {
			return;
		}
		
		if (self.countDown > 0 || self.defenceCount < 0) {
			return;
		}
		
		if(self.princess != null) {
			self.princess._instance.update();	//姫のupdate
		}
		
		_.each(self.enemys, function (enemy, index) {
			if (!enemy) {
				var size = cc.winSize;
				var ene = new BaseEnemy(_.extend(manager.enemyDataList['underling'], {
					dungeonType: self.dungeonData.type,
					target: self.princess
				}));
				manager.gameStage.addChild(ene);
				self.enemys[index] = ene;
				return;
			}
			enemy._instance.update();	//敵のupdate
			return;
		});
		
		_.each(self.heros, function (hero) {
			if (!hero) {
				return;
			}
			hero._instance.update();	//ヒーローのupdate
			return;
		});
		
	},
	
	
	startDefenceCount: function(label) {
		var self = this;
		
		var defenceInterval = setInterval(function(){
			self.defenceCount--;
			if(self.defenceCount <= 0) {
				clearInterval(defenceInterval);
				
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
			}
			label.setString(self.defenceCount);
			
			return;
		}, 1000);
		
		return;
	},
	
	
	/**
	 * updateを止める
	 */
	stopUpdate: function () {
		var self = this;
		self.isUpdate = false;
		return;
	},


   /**
    * キャラクタ移動用タッチイベント
    */
   _touchCount: 0,
   _addTouchEvent: function (config) {
	   config = config || {};
	   var self = this;
	   var size = cc.winSize;
	   
	   var listner = cc.EventListener.create({
		   data: {},
		   event: cc.EventListener.TOUCH_ONE_BY_ONE,
		   swallowTouches: false,
		   onTouchBegan: function (touch, e) {
			   var pos = touch.getLocation();
			   var rect = cc.rect(pos.x, pos.y, 40, 40);
			   
			   var isAdd = true;
			   _.each(self.enemys, function (ene) {
				   
				   if (!ene) {
					   return;
				   }
				   
				   //敵上に生成しようとしているか
				   if (cc.rectIntersectsRect(rect, ene)) {
					   isAdd = false;
				   }
				   return;
			   });
			   
			   //敵上だったらヒーローを生成しない
			   if (!isAdd) {
				   return true;
			   }
			   
			   //ヒーロー生成
			   var currHero = manager.currentChara;
			   if (!currHero) {
				   //選択中のスロットが空か
				   return true;
			   }
			  
			   var currIndex = self.slotBlock._instance.currIndex;
			   var hero = new BaseHero(_.extend(self.slotData[currIndex], {
				   x: pos.x,
				   y: pos.y,
				   targets: self.enemys,
				   princess: self.princess
			   }));
			   manager.gameStage.addChild(hero);
			   self.heros.push(hero);
			   
			   return true;
		   }
	   });
	   cc.eventManager.addListener(listner, this);
	   return;
   }

});


var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
	},
	
	ctor: function (config) {
		this._super();

		var layer = new GameLayer(config);
		this.addChild(layer);
		
	}
});

Scene['GameScene'] = GameScene;
