var Lib = null;

(function () {
	Lib = function () {
		return;
	};
	
	Lib.prototype = {
		
		/**
		 * extend（継承）
		 */
		extend: function (base, child) {
			//親
			child.superclass = base;
			
			//プロトタイプを拡張
			child.prototype = _.extend({}, base, child);
			
			return child.prototype;
		},
		
		
		/**
		 * パターンのextend
		 */
		extendPattern: function (config) {
			config = config || {};
			var base = config.base;
			var patterns = config.patterns || {};

			_.each(patterns, function (pattern) {
				if (!pattern) {
					return;
				}
				base = _.extend(base, pattern.prototype);
				return;
			});
			
			return base;
		}
	};
	

})();


