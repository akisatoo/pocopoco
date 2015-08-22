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

});


var ResultScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var layer = new ResultLayer();
		this.addChild(layer);
	}
});
