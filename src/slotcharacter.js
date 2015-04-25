var lib = lib || new Lib();
var manager = manager || new Manager();

var Slotcharacter = null;
(function () {

	Slotcharacter = function (config) {
		config = config || {};
		return this.__construct(config);
	};

	Slotcharacter.prototype = lib.extend(BaseCharacter.prototype, {
		
		/**
		 * 選択中かどうか
		 */
		_isSelect: false,

		/**
		 * アニメーションパターン作成
		 */
		_animPattern: {},
		
		/**
		 * スロットデータ
		 */
		_slotData: {},

		/**
		 * コンストラクタ
		 */
		__construct: function (config) {
			config = config || {};
			var self = this;
			var size = cc.winSize;	//画面サイズ
			var animType = 'normal';
			
			var data = config.data || {};
			self._slotData = data;	//スロットデータを保存
			self._isSelect = config.select;	//選択中か
			
			var slotImg = res.SlotframeNormal;
			if (self._isSelect === true) {
				slotImg = res.SlotframeSelect;
			}
			
			//スロットの枠(ベース)
			self.slot = new cc.Sprite(slotImg);
			self.slot.x = config.x || 0;
			self.slot.y = config.y || 0;
			self.slot.setAnchorPoint(0, 1);

			//キャラ生成
			self.chara = new cc.Sprite(data.image);
			self.chara.x = self.slot.width / 2;
			self.chara.y = self.slot.height / 2;
			self.slot.addChild(self.chara);
			
			//アニメーションパターンの設定
			self._animPattern = data.animPattern || {};

			//アニメーション開始
			self._animStart({
				type: animType
			});
			
			//インスタンスにthisを設定
			self.slot._instance = self;

			return self.slot;
		},


		/**
		 * update
		 */
		update: function () {
			return;
		},
		
		/**
		 * 選択状態の切り替え
		 */
		_changeState: function (config) {
			config = config || {};
			var self = this;
			var select = config.select;
			
			if (select === true) {
				var texture = cc.textureCache.addImage(res.SlotframeSelect);
				self.slot.setTexture(texture);
			} else {
				var texture = cc.textureCache.addImage(res.SlotframeNormal);
				self.slot.setTexture(texture);
			}
			
			return;
		},

	});
})();