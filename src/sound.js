var lib = lib || new Lib();
var manager = manager || new Manager();
var ui = ui || new UI();
var Scene = Scene || {};

var SoundLayer = cc.LayerColor.extend({
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
			title: 'サウンド'
		});
		self.addChild(header);
		
		if(manager.getBgm() == "on"){
			// onの時の画像
			var on = res.BgmOn2;
			var on2 = res.BgmOn;
			// offの時の画像
			var off = res.BgmOff;
			var off2 = res.BgmOff2;
		} else {
			// onの時の画像
			var on = res.BgmOn;
			var on2 = res.BgmOn2;
			// offの時の画像
			var off = res.BgmOff2;
			var off2 = res.BgmOff;
		}

		//==========BGM切り替えボタン／ON=========================
		var bgmOn = new cc.MenuItemImage(
				on,
				on2,
				function () {
					//BGM判定用のフラグを変更
					var bgmState = "on";
					manager.setBgm(bgmState);
					
					//BGMをオンにする
					cc.audioEngine.setMusicVolume(1);// 音量の設定 0 ~ 1の範囲
					cc.audioEngine.playMusic(res.MainBgm, true);
					
					//設定ページへ戻る
					cc.director.runScene(cc.TransitionFade(1.2, new SettingMenuScene({})));

				}, this);

		bgmOn.attr({
			x: size.width / 2,
			y: 400,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var bgmOnButton = new cc.Menu(bgmOn);
		bgmOnButton .x = 0;
		bgmOnButton .y = 0;
		self.addChild(bgmOnButton);
		//============================================================
		
		//==========BGM切り替えボタン／OFF=========================
		var bgmOff = new cc.MenuItemImage(
				off,
				off2,
				function () {
					//BGM判定用のフラグを変更
					var bgmState = "off";
					manager.setBgm(bgmState);
					
					//BGMをオフにする
					cc.audioEngine.stopMusic(res.MainBgm);
					
					//設定ページへ戻る
					cc.director.runScene(cc.TransitionFade(1.2, new SettingMenuScene({})));

				}, this);
		
		bgmOff.attr({
			x: size.width / 2,
			y: 200,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var bgmOffButton = new cc.Menu(bgmOff);
		bgmOffButton .x = 0;
		bgmOffButton .y = 0;
		self.addChild(bgmOffButton);
		//============================================================
		var footer = ui.createFooterMenu({
			currScene: 'setting'
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

	//+++ メニューデータ +++//
	settingMenuList: [
	                  {
	                	  id: 1,
	                	  title: 'サウンド',
	                	  scene: 'SoundScene'
	                  },
	                  /*{
	                	  id: 2,
	                	  title: 'クレジット',
	                	  scene: 'CreditScene'
	                  }*/
	                  ],

	                  /**
	                   * テーブルヘッダー
	                   */
	                  createTableHeader: function (config) {
	                	  config = config || {};
	                	  var self = this;
	                	  var title = config.title || 'タイトル';
	                	  var height = config.height || self.headerHeight;
	                	  var color = config.color || cc.color(255, 255, 255)

	                	  var layer = cc.LayerColor();
	                	  layer.setPosition(0, cc.winSize.height - height);
	                	  layer.setContentSize(cc.winSize.width, height);
	                	  layer.setColor(color);

	                	  var text = cc.LabelTTF(title, "Helvetica", 30);
	                	  text.setColor(cc.color(0, 0, 0));
	                	  text.setPosition(cc.winSize.width / 2, height / 2);
	                	  text.setAnchorPoint(0.5, 0.5);
	                	  layer.addChild(text);

	                	  return layer;
	                  },

	                  tableCellSizeForIndex:function(table, idx){
	                	  return this.cellSizeForTable(table);
	                  },

	                  cellSizeForTable:function (table) {
	                	  return cc.size(cc.winSize.width, this.celHeight);
	                  },

	                  tableCellAtIndex:function (table, idx) {
	                	  var self = this;
	                	  var cell = cc.TableViewCell.create();
	                	  cell.setContentSize(cc.winSize.width, self.celHeight);
	                	  cell.data = self.settingMenuList[idx];

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

	                	  var itemFont = cc.MenuItemFont(self.settingMenuList[idx].title, func);
	                	  itemFont.setAnchorPoint(0, 0.5);

	                	  var menu = cc.Menu(itemFont);
	                	  menu.setColor(cc.color(0, 0, 0));
	                	  menu.setPosition(50, bgSize.height / 2);
	                	  bg.addChild(menu);

	                	  return cell;
	                  },


	                  numberOfCellsInTableView:function (table) {
	                	  return this.settingMenuList.length;
	                  },

	                  tableCellTouched: function (table, cell) {
	                  },

	                  onTouchedMenu: function(cell) {
	                	  cc.log('sound: ' + cell.data.title);

	                	  cc.director.runScene(cc.TransitionFade(1.2, new Scene[cell.data.scene]({
	                		  level: 1,
	                		  pageType: 'dungeon',
	                		  dungeonData: cell.data
	                	  })));

	                  }
});



var SoundScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		
		var layer = new SoundLayer();
		this.addChild(layer);
	}
});

Scene['SoundScene'] = SoundScene;

