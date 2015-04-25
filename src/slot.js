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
		_maxSlot: 3,
		
		/**
		 * スロット管理
		 */
		_slots: [],

		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			var size = cc.winSize;	//画面サイズ
			
			var slotData = config.slotData || [];	//スロットのデータ
			
			//初期化
			self._slots = [];
			
			var slotMargin = 20,
				slotWidth = 100,
				slotHeight = 100;
			
			//スロットのブロック
			self.slotBlock = cc.Layer();
			//self.slotBlock.setColor(cc.color(255, 255, 255));
			
			//slotBlockの高さを決める為に先に定義
			var slotText = cc.LabelTTF('Hero Slots', "Arial-BoldMT", 28);
			
			//slotBlockのサイズ設定
			self.slotBlock.width = (slotWidth * self._maxSlot) + (self._maxSlot - 1) * slotMargin;
			self.slotBlock.height = slotHeight + slotText.height;
			//slotBlockのアンカーポイントを編集可能に※Layerはアンカーポイントが(1, 1)に固定されているため
			self.slotBlock.ignoreAnchorPointForPosition(false);
			
			//slotTextの設定
			slotText.setAnchorPoint(0.5, 1);
			slotText.x = self.slotBlock.width / 2;
			slotText.y = slotHeight + slotText.height;
			self.slotBlock.addChild(slotText);
			
			//スロットの設置
			for (var i = 0; i < self._maxSlot; i++) {
				var margin = i === 0 ? 0 : slotMargin;
				//スロット
				var slot = new Slotcharacter({
					data: slotData[i],
					select: i === 0 ? true : false
				});
				slot.x = (i * slotWidth) + (slotMargin * i);
				slot.y = slotHeight;
				self.slotBlock.addChild(slot, 0);
				self._slots.push(slot);
			}
			
			//タッチイベントを設定
			self._addTouchEvent();
			
			return self.slotBlock;
		},


		/**
		 * update
		 */
		update: function () {
			return;
		},


		/**
		 * タッチイベント
		 */
		_addTouchEvent: function () {
			var self = this;

			var listner = cc.EventListener.create({
				data: {},
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: function(touch, event) {
					//タッチ座標（ワールド座標）
					var pos = touch.getLocation();
					//ローカル座標に変換
					var localPos = self.slotBlock.convertToNodeSpace(pos);
					
					//スロットをタッチしたか
					var isTouch = false;
					//選択中のインデックス
					var selectIndex = null;
					
					//タッチ座標と各スロットのあたり判定
					_.each(self._slots, function (slot, index) {
						
						//各スロットの矩形(アンカーポイントの修正で高さがずれているので調整)
						var rect = cc.rect(slot.x, slot.y - slot.height, slot.width, slot.height);
						if (cc.rectContainsPoint(rect, localPos)) {
							cc.log(slot._instance._slotData.name);
							manager.currentChara = slot._instance._slotData.name;
							selectIndex = index;
							isTouch = true;
						}
						
						return;
					});
					
					//スロットをタッチしていればtrueをreturn（falseだとヒーロー生成の処理が実行されるため）
					if (isTouch === true) {
						_.each(self._slots, function (slot, index) {
							var select = false;
							if (selectIndex === index) {
								select = true;
							}
							
							//スロットの選択状態を更新
							slot._instance._changeState({
								select: select
							});
							return;
						});
						return true;
					}
					//その他のタッチイベントが発火
					return false;
				}
			});
			cc.eventManager.addListener(listner, self.slotBlock);
		},


	};
})();