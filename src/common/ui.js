var Scene = Scene || {};

var UI = null;
(function () {

	UI = function (config) {
		config = config || {};
		return;
	};

	UI.prototype = {
			
			
			/**
			 * フッターに表示するデータ
			 */
			footerData: [
				{
					type: 'home',
					title: 'ホーム',
					scene: 'HomeScene'
				},
				{
					type: 'chara',
					title: 'キャラ',
					scene: 'CharacterMenuScene'
				},
				{
					type: 'dungeon',
					title: 'ダンジョン',
					scene: 'DungeonSelectScene'
				},
				{
					type: 'setting',
					title: '設定',
					scene: 'SettingMenuScene'
				}
			],
			

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
				var titleText = config.title || 'title';
				
				var header = cc.LayerColor();
				header.setContentSize(size.width, headerHeight);
				header.setColor(cc.color(236, 236, 236));
				header.x = x;
				header.y = y;
				//Layerはアンカーポイントが(1, 1)に固定されているため無効にする
				header.ignoreAnchorPointForPosition(false);
				header.setAnchorPoint(0, 1);
					
				//画面タイトル名ラベル
				var title = cc.LabelTTF(titleText, "Helvetica", 40);
				title.setColor(cc.color(0, 0, 0));
				title.setPosition(size.width / 2, headerHeight);
				title.setAnchorPoint(0.5, 1);
				header.addChild(title);
				
				if (config.backScene) {
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
				}
				
				return header;
			},
			
			
			
			/**
			 * フッターメニュ
			 * 
			 * @param config
			 * @returns {___anonymous1662_1667}
			 */
			createFooterMenu: function (config) {
				config = config || {};
				var self = this;
				var size = cc.winSize;
				var footerHeight = 80;
				
				var currScene = config.currScene || 'home';
				
				var footer = cc.LayerColor();
				footer.setContentSize(size.width, footerHeight);
				footer.setColor(cc.color(236, 236, 236));
				footer.x = size.width / 2;
				footer.y = 0;
				//Layerはアンカーポイントが(1, 1)に固定されているため無効にする
				footer.ignoreAnchorPointForPosition(false);
				footer.setAnchorPoint(0.5, 0);
				
				var menuWidth = size.width / self.footerData.length;
				
				_.each(self.footerData, function (data, index) {
					
					var menu = self._createMenu({
						isCurrScene: currScene === data.type ? true : false,
						title: data.title,
						x: menuWidth * index,
						width: menuWidth,
						height: footerHeight,
						data: data
					});
					footer.addChild(menu);
					
					self._addTouchEvent(menu);
					
					return;
				});
				
				return footer;
			},
			
			
			
			/**
			 * フッター用のメニューアイコン
			 * 
			 * @param config
			 * @returns {___anonymous2803_2806}
			 */
			_createMenu: function (config) {
				config = config || {};
				var self = this;
				
				var color = cc.color(236, 236, 0);
				if (config.isCurrScene) {
					color = cc.color(236, 0, 0);
				}
				
				var menu = cc.LayerColor();
				menu.setContentSize(config.width, config.height);
				menu.setColor(color);
				menu.x = config.x;
				menu.y = 0;
				//Layerはアンカーポイントが(1, 1)に固定されているため無効にする
				menu.ignoreAnchorPointForPosition(false);
				menu.setAnchorPoint(0, 0);
				
				menu.data = config.data || {};
				
				//画面タイトル名ラベル
				var title = cc.LabelTTF(config.title, "Helvetica", 18);
				title.setColor(cc.color(0, 0, 0));
				title.setPosition(config.width / 2, 4);
				title.setAnchorPoint(0.5, 0);
				menu.addChild(title);
				
				return menu;
			},
			
			
			

			/**
			 * タッチイベント
			 */
			_addTouchEvent: function (layer) {
				var self = this;
				var size = cc.winSize;

				var listner = cc.EventListener.create({
					event: cc.EventListener.TOUCH_ALL_AT_ONCE,

					onTouchesBegan: function(touches, event) {
						var touch = touches[0];
						var loc = touch.getLocation();
						var target = event.getCurrentTarget();
						var posInScreen = target.convertToNodeSpace(touch.getLocation());
						var targetSize = target.getContentSize();
						var rect = cc.rect(0, 0, targetSize.width, targetSize.height);

						if(cc.rectContainsPoint(rect, posInScreen)){

							if (!target.data || !Scene[target.data.scene]) {
								return true;
							}
							
							//該当のページに遷移する
							cc.director.runScene(cc.TransitionFade(1.2, new Scene[target.data.scene]()));
							return true;
						}

						return false;
					}

				});
				cc.eventManager.addListener(listner, layer);
				return;
			},


	};
})();