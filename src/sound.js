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
			title: 'クレジット',
			backScene: SettingMenuScene
		});
		self.addChild(header);

		return true;
	}


});

var SoundScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var layer = new SoundLayer();
		this.addChild(layer);
	}
});

Scne['SoundScene'] = SoundScene;
