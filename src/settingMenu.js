var lib = lib || new Lib();
var manager = manager || new Manager();
var ui = ui || new UI();
var Scene = Scene || {};

var SettingMenuLayer = cc.LayerColor.extend({
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
			title: '設定',
			backScene: TitleScene
		});
		self.addChild(header);

		var tableView = cc.TableView(self, cc.size(size.width, size.height - self.headerHeight - self.margin.height - 80));
		tableView.setColor(cc.color(255, 0, 0));
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setPosition(0, 80);
		tableView.setDelegate(self);
		self.addChild(tableView);

		return true;
	},
	
	settingMenuList:[
     {
		title: 'サウンド'
     },
     {
    	 title: 'クレジット'
     }
    ],
		

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
	/*tableCellAtIndex:function (table, idx) {
		var self = this;
		var cell = cc.TableViewCell.create();
		cell.setContentSize(cc.winSize.width, self.celHeight);
		cell.data = manager.dungeonList[idx];

		//背景
		var bg = cc.LayerColor();
		bg.setColor(cc.color(255, 255, 255));
		bg.setContentSize(cc.winSize.width - (self.margin.width * 2), self.celHeight - (self.margin.height * 2));
		bg.setAnchorPoint(0.5, 0.5);
		bg.setPosition(self.margin.width, self.margin.height);
		cell.addChild(bg);

		var bgSize = bg.getContentSize();
		//ダンジョン名
		var label = cc.LabelTTF(manager.dungeonList[idx].name, "Helvetica", 30);
		label.setColor(cc.color(0, 0, 0));
		label.setPosition(50, bgSize.height / 2);
		label.setAnchorPoint(0, 0.5);
		bg.addChild(label);

		return cell;
	},*/

	/**
	 * Returns number of cells in a given table view.
	 * @param {cc.TableView} table table to hold the instances of Class
	 * @return {Number} number of cells
	 */
	/*numberOfCellsInTableView:function (table) {
		return manager.dungeonList.length;
	},*/

	/**
	 * cellのタップ時
	 * @param table
	 * @param cell
	 * @returns {Boolean}
	 */
	/*tableCellTouched: function (table, cell) {
		cc.log('DungeonName: ' + cell.data.name);

		//キャラクター選択シーンに飛ばす
		cc.director.runScene(cc.TransitionFade(1.2, new CharacterSelectScene({
			level: 1,
			pageType: 'dungeon',
			dungeonData: cell.data
		})));
		return true;
	}*/
});

var SettingMenuScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var layer = new SettingMenuLayer();
		this.addChild(layer);
	}
});

Scne['SettingMenuScene'] = SettingMenuScene;
