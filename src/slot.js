var lib = lib || new Lib();
var manager = manager || new Manager();

var Slot = null;
(function () {

	Slot = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	Slot.prototype = {
			
		/**
		 * スロット数
		 */
		_maxSlot: 4,
		
		/**
		 * スロット管理
		 */
		slotList: [],
		
		selectSlot: null,
		
		_baseAngle: 0,
		currIndex: 0,
		
		_touchThreshold: 100,
		_touchStartPoint: null,
		_touchLastPoint: null,
		_direction: null,

		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			var size = cc.winSize;	//画面サイズ
			
			var slotData = config.slotData || [];	//スロットのデータ
			
			//初期化
			self.slotList = [];
			self.currIndex = 0;
			
			var slotMargin = 20,
				slotWidth = 100,
				slotHeight = 200;
			
			self.baseLayer = cc.Layer();
			//スロットのブロック
			self.slotBlock = cc.Layer();
			
			//slotBlockの高さを決める為に先に定義
			var slotText = cc.LabelTTF('Hero Slots', "Arial-BoldMT", 28);
			//slotTextの設定
			//slotText.setAnchorPoint(0.5, 1);
			//slotText.x = self.slotBlock.width / 2;
			//slotText.y = slotHeight + slotText.height;
			//self.slotBlock.addChild(slotText);

			
			//slotBlockのサイズ設定
			self.slotBlock.width = size.width;
			self.slotBlock.height = slotHeight + slotText.height;
			//slotBlockのアンカーポイントを編集可能に※Layerはアンカーポイントが(1, 1)に固定されているため
			self.slotBlock.ignoreAnchorPointForPosition(false);
			
			self.slotBlock.setAnchorPoint(0.5, 0);
			self.slotBlock.x = size.width / 2;
			
			var r = 150;
			var angle = 360 / self._maxSlot;
			self._baseAngle = angle;
			var count = 0;
			//_.each(manager.charaDataList, function (charaData, key) {
			for (var i = 0; i < self._maxSlot; i++) {
				var ang = angle * count;
				var chara = new Slotcharacter({
					x: (size.width / 2) + (r * Math.sin(ang * Math.PI / 180)),
					y: r * Math.cos(ang * Math.PI / 180),
					data: slotData[i] ? slotData[i] : {type: 'empty'},
					select: i === 0 ? true : false
				});
				chara.rotation = ang;
				self.slotList.push(chara);
				self.slotBlock.addChild(chara);
				
				if (i === 0) {
					//最初のスロットを初期選択に
					self.selectSlot = chara;
				}

				count++;
			}
			
			self.baseLayer.addChild(self.slotBlock);
			//タッチイベント登録
			self._addSwipeEvent(self.baseLayer);

			self.baseLayer._instance = self;
			return self.baseLayer;
		},


		/**
		 * update
		 */
		update: function () {
			return;
		},
		
		/**
		 * スロットの中身変更
		 * キャラ選択時
		 * 
		 * @param config
		 */
		slotUpdate: function (data) {
			data = data || {};
			var self = this;
			
			//受け取ったデータをもとにスロットの中身を更新
			self.selectSlot._instance.slotUpdate(data);
			
			return;
		},


		/**
		 * スワイプイベント
		 */
		_addSwipeEvent: function (layer) {
			var self = this;
			var size = cc.winSize;

			var listner = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: function(touch, event) {
					//var touch = touches[0];
					var size = cc.winSize;
					var loc = touch.getLocation();
					
					var target = event.getCurrentTarget();
					var targetSize = target.getContentSize();
					var rect = cc.rect(0, 0, size.width, self.slotBlock.height);
					var posInScreen = target.convertToNodeSpace(touch.getLocation());
					
					if (!cc.rectContainsPoint(rect, posInScreen)) {
						return false;
					}

					self._touchStartPoint = {
						x: loc.x,
						y: loc.y
					};
					self._touchLastPoint = {
						x: loc.x,
						y: loc.y
					};
					return true;
				},

				onTouchMoved: function(touch, event) {
					
					//var touch = touches[0];
					var loc = touch.getLocation(),
					start = self._touchStartPoint;
					
					if (!start) {
						return true;
					}

					// check for left
					if( loc.x < start.x - self._touchThreshold ) {
						// if direction changed while swiping left, set new base point
						if( loc.x > self._touchLastPoint.x ) {
							start = self._touchStartPoint = {
								x: loc.x,
								y: loc.y
							};
							self._direction = null;
						} else {
							self._direction = 'left';                        
						}
					}

					// check for right
					if( loc.x > start.x + self._touchThreshold ) {
						// if direction changed while swiping right, set new base point
						if( loc.x < self._touchLastPoint.x ) {
							self._touchStartPoint = {
								x: loc.x,
								y: loc.y
							};
							self._direction = null;
						} else {
							self._direction = 'right';                       
						}
					}

					self._touchLastPoint = {
						x: loc.x,
						y: loc.y
					};
					return true;
				},

				onTouchEnded: function(touch, event){
					
					//var touch = touches[0],
					loc = touch.getLocation()

					if (!self._direction) {
						self._touchStartPoint = null;
						self._direction = null;
						return true;
					}
					
					switch (self._direction) {
						case 'left':
							if (self.currIndex >= self._maxSlot - 1) {
								self.currIndex = 0;
							} else {
								self.currIndex++;
							}
							self.slotBlock.runAction(cc.RotateBy(0.3, -self._baseAngle));
							break;
						case 'right':
							if (self.currIndex <= 0) {
								self.currIndex = self._maxSlot - 1;
							} else {
								self.currIndex--;
							}
							
							self.slotBlock.runAction(cc.RotateBy(0.3, self._baseAngle));
							break;
					}
					
					_.each(self.slotList, function (slot, index) {
						var select = false;
						if (self.currIndex === index) {
							select = true;
							var curr = slot._instance._slotData.id;
							if (slot._instance._slotData.type === 'empty') {
								curr = null;
							}
							manager.currentChara = curr;
							self.selectSlot = slot;
						}
						//スロットの選択状態更新
						slot._instance._changeState({
							select: select
						});
						return;
					});
					

					self._touchStartPoint = null;
					self._direction = null;

					return true;
				}
			});
			cc.eventManager.addListener(listner, self.baseLayer);
			return;
		},


	};
})();