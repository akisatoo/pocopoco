var App = App || {};
var manager = manager || new Manager();
var ui = ui || new UI();

var TitleLayer = cc.LayerColor.extend({
	sprite: null,
	ctor: function (config) {
		config = config || {};

		this._super();
		var self = this;
		var size = cc.winSize;
		self.setColor(cc.color(255, 255, 255));
		
		var funds = 0;
		//資金を取得
		if (!manager.getFunds()) {
			manager.setFunds(0);
			funds = 0;
		} else {
			funds = manager.getFunds();
		}
		
		//資金のテキスト
		var moneyText = cc.LabelTTF('funds: $' + funds, "Meiryo", 28);
		moneyText.setColor(cc.color(0, 0, 0));
		moneyText.setAnchorPoint(cc.p(1, 1));
		moneyText.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
		moneyText.x = size.width - 20;
		moneyText.y = size.height - 10;
		self.addChild(moneyText);
		
		//スタートボタン
		var closeItem = new cc.MenuItemImage(
			res.StartNormal,
			res.StartSelect,
			function () {
				
				//メインページ
				cc.director.runScene(cc.TransitionFade(1.2, new HomeScene({
					level: 1,
					warfunds: 10000
				})));
				
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

		self._addTouchEvent();

		return true;
	},


	_titlePoints: [
       //プ
       {x: 100, y: 350},
       {x: 120, y: 350},
       {x: 140, y: 350},
       {x: 160, y: 350},
       {x: 180, y: 350},
       {x: 200, y: 350},
       {x: 220, y: 350},
       {x: 220, y: 330},
       {x: 210, y: 310},
       {x: 200, y: 290},
       {x: 190, y: 270},
       {x: 180, y: 250},
       {x: 170, y: 230},
       {x: 250, y: 400},
       //リ
       {x: 290, y: 340},
       {x: 290, y: 320},
       {x: 290, y: 300},
       {x: 290, y: 280},
       {x: 380, y: 340},
       {x: 380, y: 320},
       {x: 380, y: 300},
       {x: 380, y: 280},
       {x: 375, y: 260},
       {x: 370, y: 240},
       {x: 365, y: 220},
       {x: 360, y: 200},
       {x: 355, y: 180},
       //プ
       {x: 450, y: 350},
       {x: 470, y: 350},
       {x: 490, y: 350},
       {x: 510, y: 350},
       {x: 530, y: 350},
       {x: 550, y: 350},
       {x: 570, y: 350},
       {x: 570, y: 330},
       {x: 560, y: 310},
       {x: 550, y: 290},
       {x: 540, y: 270},
       {x: 530, y: 250},
       {x: 520, y: 230},
       {x: 600, y: 400},
       //リ
       {x: 640, y: 340},
       {x: 640, y: 320},
       {x: 640, y: 300},
       {x: 640, y: 280},
       {x: 730, y: 340},
       {x: 730, y: 320},
       {x: 730, y: 300},
       {x: 730, y: 280},
       {x: 725, y: 260},
       {x: 720, y: 240},
       {x: 715, y: 220},
       {x: 710, y: 200},
       {x: 705, y: 180},
   ],


   /**
    * キャラクタ移動用タッチイベント
    */
   _touchCount: 0,
   _addTouchEvent: function (config) {
	   config = config || {};
	   var self = this;
	   var size = cc.winSize;
	   var listner = cc.EventListener.create({
		   data: {},
		   event: cc.EventListener.TOUCH_ONE_BY_ONE,
		   swallowTouches: true,
		   onTouchBegan: function(touch, e) {
			   var pos = touch.getLocation();

			   var chara = new Princess({
				   x: pos.x,
				   y: pos.y,
				   image: res.PrincessRight1,
				   sceneType: 'title'
			   });
			   self.addChild(chara);
			   
			   return true;
		   },
		   onTouchEnded: function(touch, e) {
		   }
	   });
	   cc.eventManager.addListener(listner, this);
	   return;
   }

});


var TitleScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var layer = new TitleLayer();
		this.addChild(layer);
	}
});
