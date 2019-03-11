var scale = chrome.extension.getBackgroundPage().scale;
var toUtf8 = chrome.extension.getBackgroundPage().toUtf8;
var code = document.getElementById('code');
var input = document.getElementById('content');

var renderCode = (function() {
	var mQrcode;
	return function(text) {
		input.value = text;
		text = toUtf8(text);
		if (mQrcode) {
			mQrcode.clear();
			mQrcode.makeCode(text);
		} else {
			mQrcode = new QRCode(code, {
				text: text,
				width: 200,
				height: 200,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.H
			});
		}
	};
})();

chrome.tabs.query({ active: true }, function(tab) {
	renderCode(tab[0].url);
});

document.getElementById('render').addEventListener('click', function() {
	renderCode(input.value);
});

document.getElementById('clear').addEventListener('click', function() {
	input.value = '';
	input.focus();
});
