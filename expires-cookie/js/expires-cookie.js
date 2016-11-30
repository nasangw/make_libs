(function() {
	function ExpiresCookie(elem, params) {
		if (!(this instanceof ExpiresCookie)) {
			return new ExpiresCookie(elem, params);
		}

		var defaults = {
			target: undefined,
			duration: '1d'
		},
		e = this;

		if(elem !== null) {
			// When define element

			/* e.elem = typeof elem === "string" ? document.querySelectorAll(elem) : elem;

			if (e.elem.length > 1) {
				var expiresArray = [];
				e.elem.forEach(function(el) {
					expiresArray.push(new ExpiresCookie(el, params));
				});

				return expiresArray;
			}
			e.elem = e.elem.length !== undefined ? e.elem : e.elem[0]; */

			// Define Element of ExpiresCookie
			e.elem = document.querySelector(elem);

			// Save instance in elem HTML Element and in data
			e.elem.expires = e;

			// Set event of element
			e.elemEvent = e.elem.nodeName === "INPUT" && (e.elem.type === ("checkbox" || "radio")) ? "change" : "click";
		}else{
			// When no element
			e.elemEvent = "click";
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

		if(!params.target) {
			if(e.elem.getAttribute("data-expires-target")) {
				params.target = e.elem.getAttribute("data-expires-target");
			}else{
				return;
			}
		}

		// Set duration
		params.duration = e.elem ? (e.elem.getAttribute("data-expires-duration") || params.duration) : params.duration;

		// Set params
		e.params = params;

		// Set prototype
		e.setExpiresDate = this.setExpiresDate;

		// Set element of target
		e.elemTarget = document.querySelectorAll(params.target);

		if(elem !== null) {
			// Bind event to element
			e.elem.addEventListener(e.elemEvent, function(ev){
				ev.preventDefault();
				e.elemTarget.forEach(function(el, idx) {
					el.style.display = "none";
				});
				e.setExpiresDate(params.duration);
			}, false);
		}else{
			e.elemTarget.forEach(function(el, idx) {
				el.style.display = "none";
			});
			e.setExpiresDate(params.duration);
		}
	}

	// Define prototype
	ExpiresCookie.prototype = {
		setExpiresDate: function(duration) {
			var extractDuration,
				attribute = {
					duration: this.params.duration || this.elem.getAttribute("data-expires-duration"),
					target: this.params.target || this.elem.getAttribute("data-expires-target")
				},
				regExp = {
					check: /^[0-9\.]{1,10}[a-zA-Z]{1}$/,
					isInt: /^[0-9\.]{1,}/,
					isStr: /[a-zA-z]{1}$/
				};

			if(attribute.duration === "today") {
				extractDuration = this.getRemainToday();
			}else{
				var date = new Date(),
					hours = 24,
					cookieValue = "close",
					durationDefault = "1d",
					checkValidateDuration = regExp.check.test(attribute.duration),
					extractDurationInt = parseFloat(regExp.isInt.exec(attribute.duration)[0]),
					extractDurationStr = regExp.isStr.exec(attribute.duration)[0];

				if(!checkValidateDuration) {
					return;
				}

				if(!attribute.duration) {
					attribute.duration = durationDefault;
				}

				switch(extractDurationStr) {
					case 'h':
						extractDuration = (1 / hours) * extractDurationInt;
						break;
					case 'd':
						extractDuration = extractDurationInt;
						break;
					case 'w':
						extractDuration = extractDurationInt * 7;
						break;
					case 'm':
						extractDuration = new Date(date.setMonth(date.getMonth() + extractDurationInt));
						break;
					case 'y':
						extractDuration = new Date(date.setYear(date.getFullYear() + extractDurationInt));
						break;
				}
				isToday = false;
			}

			Cookies.set(attribute.target, cookieValue, {
				expires: extractDuration
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
			tomorrow = date.getTime();

			now = new Date();
			gap = (tomorrow - now.getTime()) / (1000 * 60 * 60 * 24);
			return gap;
		}
	};

	function showExpiresContents(target) {
		if(!target || !Cookies) {
			return;
		}
		if(!Cookies.get(target)) {
			var elem = document.querySelectorAll(target);
			elem.forEach(function(el, idx) {
				el.style.display = "block";
			});
		}
	}

	window.ExpiresCookie = ExpiresCookie;
	window.showExpiresContents = showExpiresContents;
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