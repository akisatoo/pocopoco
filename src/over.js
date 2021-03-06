
var OverLayer = cc.LayerColor.extend({
	sprite: null,
	ctor: function (config) {
		config = config || {};

		this._super();
		var self = this;
		var size = cc.winSize;

		self.setColor(cc.color(255, 255, 255));
		
		var overImage = cc.Sprite(res.GameoverImage);
		overImage.x = size.width / 2;
		overImage.y = size.height / 2;
		self.addChild(overImage);

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


var OverScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var layer = new OverLayer();
		this.addChild(layer);
	}
});
