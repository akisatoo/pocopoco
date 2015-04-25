var App = App || {};
var lib = lib || new Lib();
var manager = manager || new Manager();

var GameLayer = cc.LayerColor.extend({
	sprite: null,
	ctor: function (config) {
		config = config || {};

		this._super();
		var self = this;
		var size = cc.winSize;
		
		//初期化
		self.princess = null;
		self.heros = [];
		self.enemys = [];

		//背景色
		self.setColor(cc.color(255, 255, 255));

		//背景
		var background = cc.Sprite(res.Background);
		background.x = size.width / 2;
		background.y = size.height / 2;
		self.addChild(background, 0);
		
		//TODO:メニューから選択したものが入る
		var slotData = [
		    manager.charaDataList['hero'],
		    manager.charaDataList['princess'],
		    manager.charaDataList['magician']
		];
		
		//選択中のキャラを設定
		manager.currentChara = slotData[0].name;
		
		//スロット
		var slotBlock = new Slot({
			slotData: slotData
		});
		slotBlock.x = size.width / 2;
		slotBlock.y = slotBlock.height / 2 + 10;
		self.addChild(slotBlock, 9999);
		
		//姫様
		self.princess = new Princess({
			image: res.PrincessRight1
		});
		self.addChild(self.princess);
		
		//敵の生成
		var enemyMax = 10;
		for (var i = 0; i < enemyMax; i++) {
			var enemy = new BaseEnemy(_.extend(manager.enemyDataList['underling'], {
				x: Math.floor(Math.random() * size.width),
				y: i % 2 === 0 ? 0 : size.height,
				target: self.princess
			}));
			self.addChild(enemy);
			self.enemys.push(enemy);
		}

		//タッチイベント登録
		self._addTouchEvent();
		
		//update開始
		self.scheduleUpdate();

		return true;
	},
	
	/**
	 * ヒーローの管理配列
	 */
	heros: [],
	
	/**
	 * 敵の管理配列
	 */
	enemys: [],
	
	/**
	 * アップデート
	 */
	update: function () {
		var self = this;
		
		self.princess._instance.update();	//姫のupdate
		
		_.each(self.enemys, function (enemy, index) {
			if (!enemy) {
				var size = cc.winSize;
				var ene = new BaseEnemy(_.extend(manager.enemyDataList['underling'], {
					x: Math.floor(Math.random() * size.width),
					y: Math.floor(Math.random() * 2) === 0 ? -32 : size.height + 32,
					target: self.princess
				}));
				self.addChild(ene);
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
		   swallowTouches: true,
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
			   var hero = new BaseHero(_.extend(manager.charaDataList[currHero], {
				   x: pos.x,
				   y: pos.y,
				   targets: self.enemys
			   }));
			   self.addChild(hero);
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
		manager.gameStage = layer;
	}
});
