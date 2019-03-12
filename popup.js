var background = chrome.extension.getBackgroundPage();
var scale = background.popupScale || 1;
var toUtf8 = chrome.extension.getBackgroundPage().toUtf8;
var code = document.getElementById('code');
var input = document.getElementById('content');
var container = document.getElementById('container');
var scales = [
	{ w: 200, h: 200 },
	{ w: 250, h: 250 },
	{ w: 300, h: 300 },
	{ w: 350, h: 350 },
	{ w: 400, h: 400 },
	{ w: 450, h: 450 }
];

var renderCode = (function() {
	var lastText;
	return function(text) {
		var scaleOption = scales[scale - 1];
		if (text) {
			input.value = text;
			lastText = toUtf8(text);
		}
		container.style.width = scaleOption.w + 'px';
		code.innerHTML = '';
		new QRCode(code, {
			text: lastText,
			width: scaleOption.w,
			height: scaleOption.h,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H
		});
	};
})();

var scaleUpdown = function(n) {
	scale = scale + n;
	scale = scale < 1 ? 1 : scale;
	scale = scale > scales.length ? scales.length : scale;
	background.popupScale = scale;
	renderCode();
};

var actionTypes = {
	GENERATE: function() {
		renderCode(input.value);
	},
	CLEAR: function() {
		input.value = '';
		input.focus();
	},
	UP: function() {
		scaleUpdown(1);
	},
	DOWN: function() {
		scaleUpdown(-1);
	}
};

chrome.tabs.query({ active: true }, function(tab) {
	renderCode(tab[0].url);
});

document.addEventListener('click', function(e) {
	var action = e.target.dataset.action;
	action && actionTypes[action]();
});
