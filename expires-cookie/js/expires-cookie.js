(function() {
	function ExpiresCookie(elem, params) {
		if (!(this instanceof ExpiresCookie)) {
			return new ExpiresCookie(elem, params);
		}

		var defaults = {
			target: undefined,
			duration: '1d',
			def1: true,
			def2: false,
			def3: null,
			def4: undefined,
			def5: 52,
			def6: "text",
			def7: ["arr1", "arr2"]
		},
		e = this;

		if(elem !== null) {
			// Define Element of ExpiresCookie
			e.elem = typeof elem === "string" ? document.querySelectorAll(elem) : elem;

			if (e.elem.length > 1) {
				var expiresArray = [];
				e.elem.forEach(function(element) {
					expiresArray.push(new ExpiresCookie(element, params));
				});

				return expiresArray;
			}

			e.elem = e.elem.length === undefined ? e.elem : e.elem[0];
		}

		// Assign options to params
		params = params || {};
		for (var def in defaults) {
			if (typeof params[def] === "undefined") {
				params[def] = defaults[def];
			}
			else if (typeof params[def] === "object") {
				for (var deepDef in defaults[def]) {
					if (typeof params[def][deepDef] === "undefined") {
						params[def][deepDef] = defaults[def][deepDef];
					}
				}
			}
		}

		// set duration
		params.duration = e.elem ? (e.elem.getAttribute("data-expires") || params.duration) : params.duration;

		if(elem !== null) {
			// Save instance in elem HTML Element and in data
			e.elem.expires = e;
		}
	}

	// Define prototype
	ExpiresCookie.prototype = {
		get: function() {
			console.log('get!!');
		},

		set: function() {
			console.log('set!!');
		},

		setExpiresDate: function(duration) {
			var isToday,
				seconds = 60,
				minutes = 60,
				hours = 24,
				expiresData;

			if(!duration) {
				duration = 1;
			}else if(duration === 'today') {
				isToday = true;
				expiresData = getRemainToday();
			}else {
				duration = parseInt(duration);
			}

			if(!isToday) {
				expiresData = duration * hours * minutes * seconds;
			}

			Cookies.set(id, 'closed', {
				expires: expiresData
			});
		},

		// return remainTime for today(time unit: seconds)
		getRemainToday: function() {
			var date,
				now,
				gap;

			// set Time
			date = new Date();
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setDate(date.getDate() + 1);
			tomorrow = date.getTime(); // 내일 0시 0분 으로 설정

			now = new Date();
			gap = Math.round((tomorrow - now.getTime()) / 1000);
			return gap;
		}
	};

	window.ExpiresCookie = ExpiresCookie;
})();

/*===========
 AMD Export
 ===========*/
if(typeof(module) !== 'undefined') {
	module.exports = window.ExpiresCookie;
}
else if(typeof define === 'function' && define.amd) {
	define([], function () {
		'use strict';
		return window.ExpiresCookie;
	});
}