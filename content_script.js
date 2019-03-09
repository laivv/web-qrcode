function append(node,html){
  var fragment = document.createDocumentFragment();
  fragment.append(document.createElement('div'));
  fragment.childNodes[0].innerHTML = html;
  var nodeHtml = fragment.childNodes[0].childNodes[0];
  node.append(nodeHtml);
  return nodeHtml;
}

function init() {
  var template = "<div id='chrome-extension-qrcode' style='display:none'>"
    + "<div id='chrome-extension-qrcode-inner'>"
    + "<div id='chrome-extension-qrcode-content'>"
    + "</div>"
    + "</div>"
    + '<div>';

  var rootNode = append(document.body,template)
  document.addEventListener('click', function () {
    rootNode.style.display = 'none';
  });
  return rootNode;
}

var renderCode = function () {
  var mQrcode;
  var rootNode;
  return function (text) {
    text = toUtf8(text);
    if (mQrcode) {
      mQrcode.clear();
      mQrcode.makeCode(text);
    }
    else {
      rootNode = init();
      mQrcode = new QRCode(document.getElementById("chrome-extension-qrcode-content"), {
        text: text,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      })
    }
    rootNode.style.display = 'block';
  }
}();

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResopnse) {
  switch (request.cmd) {
    case "text":
      var txt = request.selectionText;
      if (txt) {
        if (txt.length <= 150) {
          renderCode(txt)
        }
        else {
          alert("选中内容不能超过150个字！");
        }
      }
      break;
    case "link":
      var href = request.link;
      if (href) {
        renderCode(href);
      }
      else {
        alert("没有找到链接!");
      }
      break;
    case "image":
      var imgsrc = request.src;
      if (imgsrc) {
        renderCode(imgsrc);
      }
      else {
        alert("没有发现图片地址!");
      }
      break;
    case "url":
      renderCode(location.href);
      break;
  }
});