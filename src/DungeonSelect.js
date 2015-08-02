var lib = lib || new Lib();
var manager = manager || new Manager();
var ui = ui || new UI();
var Scene = Scene || {};

var DungeonSelectLayer = cc.LayerColor.extend({
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
			title: 'ダンジョン',
		});
		self.addChild(header);
		
		var tableView = cc.TableView(self, cc.size(size.width, size.height - self.headerHeight - self.margin.height - 80));
		tableView.setColor(cc.color(255, 0, 0));
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setPosition(0, 80);
		tableView.setDelegate(self);
		self.addChild(tableView);
		
		var footer = ui.createFooterMenu({
			currScene: 'dungeon'
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
	
	
	tableCellSizeForIndex:function(table, idx){
		return this.cellSizeForTable(table);
	},
	
     /**
      * cell height for a given table.
      *
      * @param {cc.TableView} table table to hold the instances of Class
      * @return {cc.Size} cell size
      */
     cellSizeForTable:function (table) {
    	 return cc.size(cc.winSize.width, this.celHeight);
     },
 
     /**
      * a cell instance at a given index
      * @param {cc.TableView} table table to hold the instances of Class
      * @param idx index to search for a cell
      * @return {cc.TableView} cell found at idx
      */
     tableCellAtIndex:function (table, idx) {
    	 var self = this;
    	 var cell = cc.TableViewCell.create();
    	 cell.setContentSize(cc.winSize.width, self.celHeight);
    	 cell.data = manager.dungeonList[idx];
    	 
    	 // セルの背景スプライトを生成
    	 var sprite = cc.Sprite(res.MenuCell);
    	 sprite.setContentSize(cc.winSize.width - (self.margin.width * 2), self.celHeight - (self.margin.height * 2));
    	 sprite.setAnchorPoint(0.0, 0.5);
    	 sprite.setPosition(self.margin.width, self.margin.height);
    	 cell.addChild(sprite);
    	 
    	 //背景
		 /*var bg = cc.LayerColor();
		 bg.setColor(cc.color(255, 255, 255));
		 bg.setContentSize(cc.winSize.width - (self.margin.width * 2), self.celHeight - (self.margin.height * 2));
		 bg.setAnchorPoint(0.5, 0.5);
		 bg.setPosition(self.margin.width, self.margin.height);
		 cell.addChild(bg);*/
		 
    	 var bgSize = sprite.getContentSize();
		 //ダンジョン名
		 var label = cc.LabelTTF(manager.dungeonList[idx].name, "Helvetica", 30);
		 label.setColor(cc.color(0, 0, 0));
		 label.setPosition(50, bgSize.height / 2);
		 label.setAnchorPoint(0, 0.5);
		 sprite.addChild(label);
		 
    	 return cell;
     },
 
     /**
      * Returns number of cells in a given table view.
      * @param {cc.TableView} table table to hold the instances of Class
      * @return {Number} number of cells
      */
     numberOfCellsInTableView:function (table) {
         return manager.dungeonList.length;
     },
     
     /**
      * cellのタップ時
      * @param table
      * @param cell
      * @returns {Boolean}
      */
     tableCellTouched: function (table, cell) {
    	 cc.log('DungeonName: ' + cell.data.name);
    	 
    	 //キャラクター選択シーンに飛ばす
    	 cc.director.runScene(cc.TransitionFade(1.2, new CharacterSelectScene({
    		 level: 1,
    		 pageType: 'dungeon',
    		 dungeonData: cell.data
    	 })));
    	 return true;
     }
});

var DungeonSelectScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var layer = new DungeonSelectLayer();
		this.addChild(layer);
	}
});

Scene['DungeonSelectScene'] = DungeonSelectScene;
