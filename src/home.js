var lib = lib || new Lib();
var manager = manager || new Manager();
var ui = ui || new UI();
var Scene = Scene || {};

var HomeLayer = cc.LayerColor.extend({
	sprite: null,

	ctor: function (config) {
		config = config || {};

		this._super();
		var self = this;
		var size = cc.winSize;
		
		self.isUpdate = true;
		
		self.setColor(cc.color(100, 100, 100));
	
		var bg = cc.Sprite(res.Background);
		bg.x = size.width / 2;
		bg.y = size.height / 2;
		self.addChild(bg, 0);

		//フッターの生成
		var footer = ui.createFooterMenu({
			currScene: 'home'
		});
		
		//===============画面上をキャラが動く処理==========================
		//プレイヤーキャラリストの取得
		var heroListLength = Object.keys(manager.charaDataList()).length;
		self.hero = [];

		//キャラを画面上に生成
		for (var i = 0; i < heroListLength; ++i){
			//
			var xpos = Math.floor(Math.random() * size.width);
			var ypos = footer.height + Math.floor(Math.random() * (size.height - (footer.height + 120)));
			
			self.hero[i] = new MenuHeros(_.extend({}, manager.charaDataList()[i + 1], {
				x: xpos,
				y: ypos,
			}));
			self.addChild(self.hero[i]);
		}

		//self.heros.push(hero);
		//console.log(heroListLength);
		//============================================================
		
		//================キャラ画面への遷移ボタン=======================
		var charaMenu = new cc.MenuItemImage(
				res.CharaMenu,
				res.CharaMenu,
				function () {

					//メインページ
					cc.director.runScene(cc.TransitionFade(1.2, new CharacterMenuScene({
						//level: 1,
						//warfunds: 10000
					})));
				}, this);
		charaMenu.attr({
			x: size.width / 2,
			y: 600,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var chara = new cc.Menu(charaMenu);
		chara.x = 0;
		chara.y = 0;
		self.addChild(chara);
		//============================================================

		//==========ダンジョン選択画面への遷移ボタン=========================
		var dungeonMenu = new cc.MenuItemImage(
				res.DungonMenu,
				res.DungonMenu,
				function () {

					//メインページ
					cc.director.runScene(cc.TransitionFade(1.2, new DungeonSelectScene({
						level: 1,
						warfunds: 10000
					})));

				}, this);
		dungeonMenu.attr({
			x: size.width / 2,
			y: 400,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var dungeon = new cc.Menu(dungeonMenu);
		dungeon.x = 0;
		dungeon.y = 0;
		self.addChild(dungeon);
		//============================================================

		//==============設定画面への遷移ボタン=============================
		var settingMenu = new cc.MenuItemImage(
				res.SettingMenu,
				res.SettingMenu,
				function () {

					//メインページ
					cc.director.runScene(cc.TransitionFade(1.2, new SettingMenuScene({
						//level: 1,
						//warfunds: 10000
					})));

				}, this);
		settingMenu.attr({
			x: size.width / 2,
			y: 200,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var setting = new cc.Menu(settingMenu);
		setting.x = 0;
		setting.y = 0;
		self.addChild(setting);


		var header = ui.createHeader({
			x: 0,
			y: size.height,
			title: 'ホームだよ'
		});
		self.addChild(header);
		//============================================================
		
		//フッターの表示
		self.addChild(footer);
		
		//update開始
		self.scheduleUpdate();
	
		return true;
	},
	/**
	 * アップデート
	 */
	update: function () {
		var self = this;

		if (!self.isUpdate) {
			return;
		}


		_.each(self.hero, function (hero, index) {
			if (!hero) {
				return;
			}
			hero._instance.update();	//ヒーローのupdate
			return;
		});
		/*
		var heroListLength = Object.keys(manager.charaDataList).length;
		for(var i = 0; i < heroListLength; ++i){
			self.hero[i]._instance.update();
		}
		*/
	},
	
	/**
	 * ヘッダーの高さ
	 */
	headerHeight: 120,
	
	/**
	 * cellの高さ
	 */
	celHeight: 80,
	
	/**
	 * マージン
	 */
	margin: {
		width: 10,
		height: 5
	},
	
	/**
	* テーブルヘッダー
	*/

	tableCellAtIndex:function (table, idx) {
	   var self = this;
	   var cell = cc.TableViewCell.create();
	   cell.setContentSize(cc.winSize.width, self.celHeight);
	   cell.data = self.homeMenuList[idx];
	
	   //背景
	   var bg = cc.LayerColor();
	   bg.setColor(cc.color(255, 255, 255));
	   bg.setContentSize(cc.winSize.width - (self.margin.width * 2), self.celHeight - (self.margin.height * 2));
	   bg.setAnchorPoint(0.5, 0.5);
	   bg.setPosition(self.margin.width, self.margin.height);
	   cell.addChild(bg);
	
	   var bgSize = bg.getContentSize();
	
	   var func = function() {
		   self.onTouchedMenu(cell);
	   }
	
	   return cell;
	}, 
	
	
	
	               
	});
	
	
	var HomeScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
	
		var layer = new HomeLayer();
		this.addChild(layer);
	},

});

Scene['HomeScene'] = HomeScene;

