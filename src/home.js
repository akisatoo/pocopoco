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
	
		self.setColor(cc.color(100, 100, 100));
	
		var bg = cc.Sprite(res.Background);
		bg.x = size.width / 2;
		bg.y = size.height / 2;
		self.addChild(bg, 0);
		
		// キャラ画面への遷移ボタン
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
		
		// ダンジョン選択画面への遷移ボタン
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
		
		// 設定画面への遷移ボタン
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
	
		/*var tableView = cc.TableView(self, cc.size(size.width, size.height - self.headerHeight - self.margin.height - 80));
		tableView.setColor(cc.color(255, 0, 0));
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setPosition(0, 80);
		tableView.setDelegate(self);
		self.addChild(tableView);
	*/
		var footer = ui.createFooterMenu({
			currScene: 'home'
		});
		self.addChild(footer);
	
		return true;
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
	
	   var itemFont = cc.MenuItemFont(self.homeMenuList[idx].title, func);
	   itemFont.setAnchorPoint(0, 0.5);
	
	   var menu = cc.Menu(itemFont);
	   menu.setColor(cc.color(0, 0, 0));
	   menu.setPosition(50, bgSize.height / 2);
	   bg.addChild(menu);
	
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





