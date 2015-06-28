var UI = null;
(function () {

	UI = function (config) {
		config = config || {};
		return;
	};

	UI.prototype = {

			/**
			 * ヘッダ
			 */
			createHeader: function (config) {
				config = config || {};
				var self = this;
				var size = cc.winSize;
				var headerHeight = 120;
				
				var x = config.x;
				var y = config.y;
				var title = config.title || 'title';
				
				var header = cc.LayerColor();
				header.setContentSize(size.width, headerHeight);
				header.setColor(cc.color(236, 236, 236));
				header.x = x;
				header.y = y;
				//Layerはアンカーポイントが(1, 1)に固定されているため無効にする
				header.ignoreAnchorPointForPosition(false);
				header.setAnchorPoint(0, 1);
					
				//画面タイトル名ラベル
				var titlel = cc.LabelTTF(title, "Helvetica", 40);
				titlel.setColor(cc.color(0, 0, 0));
				titlel.setPosition(size.width / 2, headerHeight);
				titlel.setAnchorPoint(0.5, 1);
				header.addChild(titlel);
				
				
				//戻るボタン
				var backItem = new cc.MenuItemImage(
					res.Back,
					res.Back,
					function () {
						cc.director.pushScene(cc.TransitionFade(1.2, new config.backScene()));
						return;
					}, this);
				backItem.attr({
					anchorX: 0,
					anchorY: 1
				});

				var back = new cc.Menu(backItem);
				back.x = 12;
				back.y = headerHeight - 64;
				header.addChild(back);
				
				return header;
			}


	};
})();