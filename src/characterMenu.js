var lib = lib || new Lib();
var manager = manager || new Manager();
var Scene = Scene || {};

var CharacterMenuLayer = cc.LayerColor.extend({
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
			title: 'Character Select'
		});
		self.addChild(header);
	
		var tableView = cc.TableView(self, cc.size(size.width, size.height - self.headerHeight - self.margin.height - 80));
		tableView.setColor(cc.color(255, 0, 0));
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setPosition(0, 80);
		tableView.setDelegate(self);
		self.addChild(tableView);
		
		var footer = ui.createFooterMenu({
			currScene: 'chara'
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
	menuList: [{
	        	   id: 1,
	        	   title: 'パーティ編集',
	        	   scene: 'CharacterSelectScene'
	           },
	           
	           {
	        	   id: 2,
	        	   title: '勇者一覧',
	        	   scene: 'CharacterSelectScene'
	           },
	           
	           {
	        	   id: 3,
	        	   title: '勇者を雇う',
	        	   scene: 'CharacterSelectScene'
	           }],
	
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
		cell.data = self.menuList[idx];
		
		// セルの背景スプライトを生成
		var sprite = cc.Sprite(res.MenuCell);
		sprite.setContentSize(cc.winSize.width - (self.margin.width * 2), self.celHeight - (self.margin.height * 2));
		sprite.setAnchorPoint(0.0, 0.5);
		sprite.setPosition(self.margin.width, self.margin.height);
		cell.addChild(sprite);
		
		//背景
		/*
		var bg = cc.LayerColor();
		bg.setColor(cc.color(255, 0, 0));
		bg.setContentSize(cc.winSize.width - (self.margin.width * 2), self.celHeight - (self.margin.height * 2));
		bg.setAnchorPoint(0, 0);
		bg.setPosition(self.margin.width, self.margin.height);
		cell.addChild(bg);
		*/
		
		var bgSize = sprite.getContentSize();
		
		var func = function() {
			self.onTouchedMenu(cell);
		};
		
		var itemFont = cc.MenuItemFont(self.menuList[idx].title, func);
		itemFont.setAnchorPoint(0, 0.0);
		
		var menu = cc.Menu(itemFont);
		menu.setColor(cc.color(0, 0, 0));
		menu.setPosition(50, bgSize.height / 2);
		sprite.addChild(menu);
	
		return cell;
	},
	
	
	numberOfCellsInTableView:function (table) {
		return this.menuList.length;
	},
	
	tableCellTouched: function (table, cell) {
	},
	
	onTouchedMenu: function(cell) {
		cc.log('MenuTitle: ' + cell.data.title);
		
		cc.director.runScene(cc.TransitionFade(1.2, new Scene[cell.data.scene]({
			level: 1,
			pageType: 'dungeon',
			dungeonData: cell.data
		})));
	}
	});
	
	
	var CharacterMenuScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
	
		var layer = new CharacterMenuLayer();
		this.addChild(layer);
	}
});

Scene['CharacterMenuScene'] = CharacterMenuScene;