var lib = lib || new Lib();
var manager = manager || new Manager();
var ui = ui || new UI();

var CharacterSelectLayer = cc.LayerColor.extend({
	sprite: null,
	ctor: function (config) {
		config = config || {};

		this._super();
		var self = this;
		var size = cc.winSize;

		self.setColor(cc.color(100, 100, 100));

		var bg = cc.Sprite(res.Background);
		bg.x = size.width / 2;
		bg.y = size.height / 2;
		self.addChild(bg, 0);
		
		var header = ui.createHeader({
			x: 0,
			y: size.height,
			title: 'Character Select',
			backScene: DungeonSelectScene
		});
		self.addChild(header);
		
		var list = self._createCharaList();
		self.addChild(list);
		
		//上部にスロット表示
		//TODO:メニューから選択したものが入る
		var slotData = [
	        manager.charaDataList['hero'],
	        manager.charaDataList['princess'],
	        manager.charaDataList['magician']
        ];

		//選択中のキャラを設定
		manager.currentChara = slotData[0].name;

		//スロット
		self.slotBlock = new Slot({
			slotData: slotData
		});
		self.slotBlock.x = 0;
		self.slotBlock.y = 0;
		self.addChild(self.slotBlock);
		
		//決定ボタン
		var decideItem = new cc.MenuItemImage(
			res.DecideNormal,
			res.DecideSelect,
			function () {
				//出撃時であればダンジョンへ進む
				//パーティー編成のみであれば前の画面に戻る
				if (config.pageType === 'dungeon') {
					//ゲームシーンに飛ばす
					cc.director.runScene(cc.TransitionFade(1.2, new GameScene({
						level: 1,
						dungeonData: config.dungeonData
					})));
				}
				
			}, this);
		decideItem.attr({
			x: size.width / 2,
			y: 0,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var decide = new cc.Menu(decideItem);
		decide.x = 0;
		decide.y = 0;
		self.addChild(decide);

		return true;
	},
	
	
	/**
	 * キャラクター一覧
	 * 
	 * @param config
	 * @returns {___anonymous1994_1997}
	 */
	_createCharaList: function (config) {
		config = config || {};
		var self = this;
		var size = cc.winSize;
		var listHeight = size.height - 350;
		var ROWMAX = 5;

		var base = cc.LayerColor();
		base.ignoreAnchorPointForPosition(false);
		base.setContentSize(size.width - 16, listHeight);
		base.setColor(cc.color(236, 236, 236));
		base.setAnchorPoint(0.5, 0);
		base.x = size.width / 2;
		base.y = 220;
		
		var charaList = [
            manager.charaDataList['hero'],
            manager.charaDataList['princess'],
            manager.charaDataList['magician']
        ];
		
		var x = 0;
		var y = listHeight;
		var margin = 4;
		var charaWidth = 80;
		_.each(charaList, function (charaData, index) {
			var chara = cc.Sprite(charaData.image);
			chara.setAnchorPoint(0, 1);
			chara.x = x;
			chara.y = y;
			chara.data = charaData;
			base.addChild(chara);
			//タッチイベント登録
			self._addTouchEvent(chara);
			
			if (index !== 0 && index % ROWMAX === 0) {
				x = 0;
				y -= charaWidth;
			} else {
				x += (charaWidth);
			}
			return;
		});
		
		
		return base;
	},
	
	
	/**
	 * タッチイベント
	 */
	_addTouchEvent: function (layer) {
		var self = this;
		var size = cc.winSize;

		var listner = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ALL_AT_ONCE,

			onTouchesBegan: function(touches, event) {
				var touch = touches[0];
				var loc = touch.getLocation();
				var target = event.getCurrentTarget();
				var posInScreen = target.convertToNodeSpace(touch.getLocation());
				var targetSize = target.getContentSize();
				var rect = cc.rect(0, 0, targetSize.width, targetSize.height);

				if(cc.rectContainsPoint(rect, posInScreen)){
					
					if (!target.data) {
						return true;
					}
					//リストから選択しているキャラをスロットに入れる
					self.slotBlock._instance.slotUpdate(target.data);
					return true;
				}

				return false;
			},

			onTouchesMoved: function(touches, event) {
				var touch = touches[0];
				var loc = touch.getLocation();
				
			},

			onTouchesEnded: function(touches, event){
				var touch = touches[0];
				var loc = touch.getLocation();
				
			}
		});
		cc.eventManager.addListener(listner, layer);
		return;
	},
	
	
	/**
	 * 選択するキャラクター
	 * 
	 * @param config
	 * @returns {___anonymous3017_3020}
	 */
	_charaBox: function (config) {
		config + config || {};
		var image = config.image;
		var angle = config.angle;
		var r = config.r;
		var self = this;
		
		var base = cc.Sprite(image);
		base.x = r * Math.sin(angle * Math.PI / 180);
		base.y = r * Math.cos(angle * Math.PI / 180);
		base.rotation = angle;
		base.name = config.name;
		
		return base;
	},
	
	
	/**
	 * キャラクタ選択時イベント
	 */
	_selectEvent: function (touches, event) {
		var self = this;
		var touch = touches[0];
		var loc = touch.getLocation();
		var target = event.getCurrentTarget();
		var posInScreen = target.convertToNodeSpace(touch.getLocation());
		var Size = target.getContentSize();
		var rect = cc.rect(0, 0, Size.width, Size.height);

		if(cc.rectContainsPoint(rect, posInScreen)){
			
			if (!target.data) {
				return true;
			}
			//リストから選択しているキャラをスロットに入れる
			self.slotBlock._instance.slotUpdate(target.data);
			return true;
		}

		return false;
	},

});

var CharacterSelectScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
	},
	
	ctor: function (config) {
		this._super();

		var layer = new CharacterSelectLayer(config);
		this.addChild(layer);

	}
});
