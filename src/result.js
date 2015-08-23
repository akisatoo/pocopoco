var lib = lib || new Lib();
var manager = manager || new Manager();

var ResultLayer = cc.LayerColor.extend({
	sprite: null,
	ctor: function (config) {
		config = config || {};

		this._super();
		var self = this;
		var size = cc.winSize;

		self.setColor(cc.color(255, 255, 255));
		
		var titleText = cc.LabelTTF('リザルト', 'Meiryo', 42);
		titleText.setColor(cc.color(0, 0, 0));
		titleText.setAnchorPoint(cc.p(0.5, 0.5));
		titleText.textAlign = cc.TEXT_ALIGNMENT_CENTER;
		titleText.x = size.width / 2;
		titleText.y = size.height - 40;
		self.addChild(titleText);
		
		var expResultView = self._createExpResultView();
		self.addChild(expResultView);
		
		var closeItem = new cc.MenuItemImage(
			res.TitleNormal,
			res.TitleSelect,
			function () {

				//タイトル
				cc.director.runScene(cc.TransitionFade(1.2, new HomeScene()));

			}, this);
		closeItem.attr({
			x: size.width / 2,
			y: closeItem.height / 2 + 20,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var menu = new cc.Menu(closeItem);
		menu.x = 0;
		menu.y = 0;
		self.addChild(menu);

		return true;
	},
	
	
	_createExpResultView: function(config) {
		config = config || {};
		var self = this;
		var size = cc.winSize;
		var layerWidth = 0;
		var layerHeight = size.height - 400;
		var charaWidth = 0;
		var layerMargin = 10;

		var layer = cc.LayerColor();
		layer.ignoreAnchorPointForPosition(false);
		layer.setColor(cc.color(236, 236, 236));
		layer.setAnchorPoint(0.5, 1);
		layer.x = size.width / 2;
		layer.y = size.height - 140;
		
		var titleText = cc.LabelTTF('経験値獲得', 'Meiryo', 30);
		titleText.setColor(cc.color(0, 0, 0));
		titleText.setAnchorPoint(cc.p(0.5, 0.5));
		titleText.textAlign = cc.TEXT_ALIGNMENT_CENTER;
		titleText.y = layerHeight - 40;
		layer.addChild(titleText);
		

		//スロットに現在のパーティーデータを格納
		var slotData = [];
		var partyList = manager.getPartyList();
		var count = 0;
		var margin = 20;
		_.each(partyList, function (partyId) {
			if (!partyId) {
				return;
			}

			slotData.push(manager.charaDataList()[partyId]);
			var chara = self._createExpResultChara(manager.charaDataList()[partyId]);
			chara.x = (count * (chara.width + margin) + chara.width / 2) + layerMargin;
			chara.y = layerHeight - 140;
			layer.addChild(chara);
			
			charaWidth = chara.width;
			layerWidth = count * (chara.width + margin);
			count++;
			return;
		});
		layerWidth += charaWidth + (layerMargin * 2);

		layer.setContentSize(layerWidth , layerHeight);
		
		titleText.x = layerWidth / 2;

		return layer;
	},
	
	
	
	/**
	 * 経験値の獲得
	 * 
	 * @param config
	 * @returns
	 */
	_createExpResultChara: function(config) {
		config = config || {};
		var self = this;
		var size = cc.winSize;
		
		var chara = cc.Sprite(config.image);

		var progressFrame = cc.Sprite(res.ExpProgressFrame);
		progressFrame.setPosition(4, 0);
		progressFrame.setAnchorPoint(0, 1);
		chara.addChild(progressFrame);
		
		var progressBar = cc.Sprite(res.ExpProgress);
		progressBar.setAnchorPoint(0, 0.5);
		progressBar.setPosition(1, 0);
		progressBar.y = progressFrame.height / 2;
		progressBar.scaleX = config.exp / 100;
		progressFrame.addChild(progressBar);
		
		return chara;
	},

});


var ResultScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var layer = new ResultLayer();
		this.addChild(layer);
	}
});
