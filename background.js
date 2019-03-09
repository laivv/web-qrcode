var scale;
chrome.contextMenus.create({
  id: "text",
  title: "选中的文字:  '%s'",
  type: "normal",
  contexts: ["selection"],
  enabled: true
});
chrome.contextMenus.create({
  id: "link",
  title: "选中链接的URL",
  type: "normal",
  contexts: ["link"],
  enabled: true
});
chrome.contextMenus.create({
  id: "image",
  title: "选中图片的地址",
  type: "normal",
  contexts: ["image"],
  enabled: true
});
chrome.contextMenus.create({
  id: "url",
  title: "当前页面的URL",
  type: "normal",
  contexts: ["all"],
  enabled: true
});
chrome.contextMenus.onClicked.addListener(function (res) {
  console.log(res);
  chrome.tabs.query({ active: true }, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, {
      cmd: res.menuItemId,
      link: res.linkUrl,
      src: res.srcUrl,
      selectionText: res.selectionText
    }, function (res) {
    });
  });
});

function toUtf8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
} 