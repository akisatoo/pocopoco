var lib = lib || new Lib();
var manager = manager || new Manager();
var ui = ui || new UI();
var Scene = Scene || {};

var CharacterStoreLayer = cc.LayerColor.extend({
	sprite: null,					// スプライト初期化
	currentMoneyLabel: null,		// 所持金のラベルを作成
	partyList: [],					// パーティーリスト
	selectCharaList: [],			// 選択されているキャラクタリストのオブジェクト管理
	
	charaListActiveSwitch: true,	// リストのキャラクタがタッチできるかどうかのスイッチ
	
	ctor: function (config) {
		config = config || {};

		this._super();
		var self = this;
		var size = cc.winSize;
		
		////////////
		// 後で消す!!!!
		////////////
		manager.setFunds(50);
		////////////

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
		
		// 所持金を表示するラベル
		self.currentMoneyLabel = cc.LabelTTF('$ ' + manager.getFunds(), "Arial-BoldMT", 32);
		self.currentMoneyLabel.setColor(cc.color(0, 0, 0));
		self.currentMoneyLabel.setPosition(size.width - self.currentMoneyLabel._getWidth(), size.height / 1.15);
		self.currentMoneyLabel.setAnchorPoint(0.5, 0.5);
		self.addChild(self.currentMoneyLabel, 10);
		
		//スロットに現在のパーティーデータを格納
		var slotData = [];
		self.partyList = manager.getPartyList();
		_.each(self.partyList, function (partyId) {
			slotData.push(manager.charaDataList()[partyId]);
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
		//self.addChild(self.slotBlock);

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
		//self.addChild(decide);

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
		
		var base_delay = cc.DelayTime.create(0.5);
		var base_jump = cc.JumpBy.create(0.5, cc.p(0, 0), 25, 2);
		var base_sequence = cc.Sequence.create(base_delay, base_jump);
		base.runAction(base_sequence);

		var charaList = manager.charaDataList();

		var x = 0;
		var y = listHeight;
		var margin = 4;
		var charaWidth = 80;
		var count = 1;
		_.each(charaList, function (charaData, index) {
			var chara = self._createSelectListChara({
				x: x,
				y: y,
				data: charaData
			});
			
			base.addChild(chara);

			if (count !== 0 && count % ROWMAX === 0) {
				x = 0;
				y -= charaWidth;
			} else {
				x += (charaWidth);
			}
			count++;
			return;
		});

		return base;
	},


	/////////////
	// リストに設置するキャラクタ設定
	/////////////
	_createSelectListChara: function (config) {
		var self = this;
		var data = config.data || {};

		var chara = cc.Sprite(data.image);
		chara.setAnchorPoint(0, 1);
		chara.x = config.x;
		chara.y = config.y;
		chara.data = data;
		chara.value = 10;
		
		// タッチイベント登録
		self._addTouchEvent(chara);

		var selectLabel = cc.LabelTTF('SELECT', "Arial-BoldMT", 14);
		selectLabel.setColor(cc.color(255, 0, 0));
		selectLabel.setPosition(chara.width / 2, chara.height / 2);
		selectLabel.setAnchorPoint(0.5, 0.5);
		selectLabel.visible = false;
		chara.addChild(selectLabel);
		
		var charaDatas = manager.charaDataList();
		var countLabel = cc.LabelTTF('× ' + (charaDatas[data.id].count || 0), "Arial-BoldMT", 14);
		countLabel.setColor(cc.color(0, 0, 0));
		countLabel.setPosition(chara.width / 2, 0);
		countLabel.setAnchorPoint(0.5, 1);
		chara.addChild(countLabel);
		
		chara.updateCount = function(count) {
			countLabel.setString('× ' + count);
			return;
		};

		return chara;
	},
	
	/////////////
	// 購入数を確定するウィンドウを出す
	/////////////
	_createPurchaseCounter: function (config) {
		var self = this;
		var data = config.data || {};
		var size = cc.winSize;
		var purchaseCounter = 0;
		var charaValue = config.data.value;
		var money = manager.getFunds();
		
		// ウィンドウの基本設定
		var base = cc.LayerColor();
		base.ignoreAnchorPointForPosition(false);
		base.setContentSize(size.width - 100, size.width - 100);
		base.setColor(cc.color(0, 236, 236));
		base.setAnchorPoint(0.5, 0);
		base.x = size.width / 2;
		base.y = (size.height / 2) - (base.height / 2);
		
		// ウィンドウの出現アニメーション設定
		var base_delay = cc.DelayTime.create(0);
		var base_jump = cc.JumpBy.create(0.5, cc.p(0, 0), 25, 2);
		var base_sequence = cc.Sequence.create(base_delay, base_jump);
		base.runAction(base_sequence);
		
		// ウィンドウに出すキャラクタの設定
		var charaSprite = cc.Sprite(data.image);
		charaSprite.setScale(1.5, 1.5);
		charaSprite.x = base.width / 2;
		charaSprite.y = base.height / 2;
		base.addChild(charaSprite);
		
		var countLabel = cc.LabelTTF('× ' + purchaseCounter, "Arial-BoldMT", 64);
		countLabel.setColor(cc.color(0, 0, 0));
		countLabel.setPosition(base.width / 2, base.height / 1.25);
		countLabel.setAnchorPoint(0.5, 0.5);
		base.addChild(countLabel);
		
		var valueLabel = cc.LabelTTF('value: ' + charaValue, "Arial-BoldMT", 14);
		valueLabel.setColor(cc.color(0, 0, 0));
		valueLabel.setPosition(charaSprite._getWidth() / 2, 0);
		valueLabel.setAnchorPoint(0.5, 0.5);
		charaSprite.addChild(valueLabel);
		
		// 購入数をあげるボタンを設定する
		var counterUpButton = new cc.MenuItemImage(
				res.DecideNormal,
				res.DecideSelect,
				
				function () {
					
					// 購入数を上げる		
					if(charaValue <= money - (charaValue * purchaseCounter)) {
						purchaseCounter++;
					}
					
					// ラベル表示の変更
					countLabel.setString('× ' + purchaseCounter);
				}, this);
		counterUpButton.setScale(0.5, 0.5);
		counterUpButton.x = 0;
		counterUpButton.y = 0;
		
		// ボタンをメニューに格納して、画面に配置
		var upMenu = new cc.Menu(counterUpButton);
		upMenu.x = base.width - 50;
		upMenu.y = 250;
		base.addChild(upMenu);
		
		// 購入数を下げるボタンを設定する
		var counterDownButton = new cc.MenuItemImage(
				res.DecideNormal,
				res.DecideSelect,

				function () {
					// 購入数を下げる
					if( purchaseCounter > 0) {
						purchaseCounter--;
						
						// ラベル表示の変更
						countLabel.setString('× ' + purchaseCounter);
					}
				}, this);
		counterDownButton.setScale(0.5, 0.5);
		counterDownButton.x = 0;
		counterDownButton.y = 0;

		// ボタンをメニューに格納して、画面に配置
		var downMenu = new cc.Menu(counterDownButton);
		downMenu.x = base.width - 50;
		downMenu.y = 125;
		base.addChild(downMenu);
		
		// 確定ボタンを設定する
		var fixButton = new cc.MenuItemImage(
				res.DecideNormal,
				res.DecideSelect,

				function () {										
					// キャラクタをアクティブにする
					self.charaListActiveSwitch = true;
					
					// 購入額を計算して更新
					money -= charaValue * purchaseCounter;
					manager.setFunds(money);
					
					// 所持金ラベルを更新
					self.currentMoneyLabel.setString('$ ' + manager.getFunds());
					
					//所持数を更新
					var charaDatas = manager.charaDataList();
					charaDatas[data.id].count = charaDatas[data.id].count + purchaseCounter;
					manager.setCharaDataList(charaDatas);
					
					config.updateCount(charaDatas[data.id].count);
					
					// ウィンドウを閉じる
					self.removeChild(base);
					cc.log("購入を確定しました。");
				}, this);
		fixButton.setScale(0.3, 0.3);
		fixButton.x = 0;
		fixButton.y = 0;

		// ボタンをメニューに格納して、画面に配置
		var fixMenu = new cc.Menu(fixButton);
		fixMenu.x = base.width / 1.5;
		fixMenu.y = 50;
		base.addChild(fixMenu);
		
		// ウィンドウを閉じるボタンを設定する
		var backButton = new cc.MenuItemImage(
				res.DecideNormal,
				res.DecideSelect,
				
				function () {
					// キャラクタをアクティブにする
					self.charaListActiveSwitch = true;
					
					// ウィンドウを閉じる
					self.removeChild(base);
					cc.log("購入をキャンセルしました。");
				}, this);
		backButton.setScale(0.3, 0.3);
		backButton.x = 0;
		backButton.y = 0;
		
		// ボタンをメニューに格納して、画面に配置
		var backMenu = new cc.Menu(backButton);
		backMenu.x = base.width / 2.5;
		backMenu.y = 50;
		base.addChild(backMenu);
		
		return base;
	},
	
	
	/////////////
	// 画面がタップされた際のイベント処理
	/////////////
	_addTouchEvent: function (layer) {
		var self = this;
		var size = cc.winSize;

		var listner = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ALL_AT_ONCE,

			//+++ タップされた瞬間の処理 +++//
			onTouchesBegan: function(touches, event) {
				var touch = touches[0];
				var loc = touch.getLocation();
				var target = event.getCurrentTarget();
				var posInScreen = target.convertToNodeSpace(touch.getLocation());
				var targetSize = target.getContentSize();
				var rect = cc.rect(0, 0, targetSize.width, targetSize.height);
				
				// 画面内のキャラクタとの当たり判定をとる
				if(cc.rectContainsPoint(rect, posInScreen)){
					
					// ターゲットのデータがない場合、処理を終える
					if (!target.data) {
						return true;
					}
					
					if (!self.charaListActiveSwitch) {
						return true;
					}
					
					// キャラクタを非アクティブにする
					self.charaListActiveSwitch = false;

					// キャラクタを購入するためのウィンドウを作って設置する
					var counter = self._createPurchaseCounter(layer);
					if(counter) {
						self.addChild(counter);
					}

					return true;
				}

				return false;
			},

			//+++ スワイプ中の処理 +++//
			onTouchesMoved: function(touches, event) {
				var touch = touches[0];
				var loc = touch.getLocation();

			},
			
			//+++ タップが離れた場合の処理 +++//
			onTouchesEnded: function(touches, event){
				var touch = touches[0];
				var loc = touch.getLocation();

			}
		});

		cc.eventManager.addListener(listner, layer);
		return;
	}
});

var CharacterStoreScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
	},

	ctor: function (config) {
		this._super();

		var layer = new CharacterStoreLayer(config);
		this.addChild(layer);

	}
});

Scene['CharacterStoreScene'] = CharacterStoreScene;