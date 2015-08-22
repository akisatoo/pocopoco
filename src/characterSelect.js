var lib = lib || new Lib();
var manager = manager || new Manager();
var ui = ui || new UI();
var Scene = Scene || {};

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
			title: 'パーティー編集',
			backScene: CharacterMenuScene
		});
		self.addChild(header);
		
		//スロットに現在のパーティーデータを格納
		var slotData = [];
		self.partyList = manager.getPartyList();
		_.each(self.partyList, function (partyId) {
			slotData.push(manager.charaDataList[partyId]);
			return;
		});

		//選択中のキャラを設定
		manager.currentChara = slotData[0].id;

		//スロット
		self.slotBlock = new Slot({
			slotData: slotData
		});
		self.slotBlock.x = 0;
		self.slotBlock.y = 0;
		self.addChild(self.slotBlock);
		
		//キャラクタのリストここからパーティーを選択
		var list = self._createCharaList();
		self.addChild(list);

		
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
					return;
				}
				
				//パーティー編集の場合
				cc.log('party select');
				
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
	 * パーティーリスト
	 */
	partyList: [],
	
	
	/**
	 * 選択されているキャラクタリストのオブジェクト管理
	 */
	selectCharaList: [],
	
	
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
            manager.charaDataList[1],
            manager.charaDataList[2],
            manager.charaDataList[3],
            manager.charaDataList[4],
            manager.charaDataList[5]
        ];
		
		var x = 0;
		var y = listHeight;
		var margin = 4;
		var charaWidth = 80;
		_.each(charaList, function (charaData, index) {
			var chara = self._createSelectListChara({
				x: x,
				y: y,
				data: charaData
			});
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
	
	
	_createPossessedList: function (config) {
		config = config || {};
		var self = this;
		var size = cc.winSize;
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
					
					if (target.isSelect) {
						return true;
					}
					
					var currIndex = self.slotBlock._instance.currIndex;
					//選択されたキャラをを選択済み状態に
					target.setSelectStatus(true);
					//選択されたキャラと入れ替わるキャラを選択解除
					if (self.selectCharaList[currIndex]) {
						self.selectCharaList[currIndex].setSelectStatus(false);
					}
					//選択されたキャラ入れ替え
					self.selectCharaList[currIndex] = target;
					
					//リストから選択しているキャラをスロットに入れる
					self.slotBlock._instance.slotUpdate(target.data);
					
					self.partyList[self.slotBlock._instance.currIndex] = target.data.id;
					manager.setPartyList(self.partyList);
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
	 * キャラクタを選択する一覧
	 */
	_createSelectListChara: function (config) {
		var self = this;
		var data = config.data || {};
		
		var chara = cc.Sprite(data.image);
		chara.setAnchorPoint(0, 1);
		chara.x = config.x;
		chara.y = config.y;
		chara.data = data;
		//タッチイベント登録
		self._addTouchEvent(chara);
		
		var selectLabel = cc.LabelTTF('SELECT', "Arial-BoldMT", 14);
		selectLabel.setColor(cc.color(255, 0, 0));
		selectLabel.setPosition(chara.width / 2, chara.height / 2);
		selectLabel.setAnchorPoint(0.5, 0.5);
		selectLabel.visible = false;
		chara.addChild(selectLabel);
		
		chara.setSelectStatus = function (isSelect) {
			if (!isSelect) {
				//選択状態解除
				chara.isSelect = false;
				selectLabel.visible = false;
				return;
			}
			
			//選択状態に
			chara.isSelect = true;
			selectLabel.visible = true;
			
			return;
		};
		
		var indexOf = _.indexOf(self.partyList, data.id);
		if (indexOf !== -1) {
			//パーティーに含まれていれば選択状態に
			chara.setSelectStatus(true);
			self.selectCharaList[indexOf] = chara;
		} else {
			//パーティーに含まれていなければ非選択状態に
			chara.setSelectStatus(false);
		}
		
		return chara;
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

Scene['CharacterSelectScene'] = CharacterSelectScene;