var links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(event) {
    event.preventDefault();
  });
}

// 添加点击事件监听器
document.addEventListener('click', function(event) {
  var clickedElement = event.target;
  let xpathtype = $("base:eq(0)").attr('xpathtype') || '用户名';
  // 添加或移除 `ac` 类属性
  if ('用户名' === xpathtype ) {
      if (clickedElement.classList.contains('tuwenstr')) {
        clickedElement.classList.remove('tuwenstr');
      } else {
        clickedElement.classList.add('tuwenstr');
      }
  }else if ('内容' === xpathtype ) {
      if (clickedElement.classList.contains('linkstr')) {
        clickedElement.classList.remove('linkstr');
      } else {
        clickedElement.classList.add('linkstr');
      }
  }

//console.clear();
  /*var userCSSElements = document.querySelectorAll('.tuwenstr');
  var userCSSXPaths = [];
  for (var i = 0; i < userCSSElements.length; i++) {
    let xpath = '/html/'+ getPath(userCSSElements[i]);
    userCSSXPaths.push(xpath);
  }
  var userCSSXPathString = userCSSXPaths.join(' | ');
  console.log('User CSS XPaths:', userCSSXPathString);

  var contentCSSElements = document.querySelectorAll('.linkstr');
  var contentCSSXPaths = [];
  for (var j = 0; j < contentCSSElements.length; j++) {
    let xpath = '/html/'+ getPath(contentCSSElements[j]);
    contentCSSXPaths.push(xpath);
  }
  var contentCSSXPathString = contentCSSXPaths.join(' | ');
  console.log('Content CSS XPaths:', contentCSSXPathString);*/
  

});

function getxpathstr(){
  var userCSSElements = document.querySelectorAll('.tuwenstr');
  var userCSSXPaths = [];
  for (var i = 0; i < userCSSElements.length; i++) {
    let xpath = '/html/'+ getPath(userCSSElements[i]);
    userCSSXPaths.push(xpath);
  }
  var userCSSXPathString = userCSSXPaths.join(' | ');

  var contentCSSElements = document.querySelectorAll('.linkstr');
  var contentCSSXPaths = [];
  for (var j = 0; j < contentCSSElements.length; j++) {
    let xpath = '/html/'+ getPath(contentCSSElements[j]);
    contentCSSXPaths.push(xpath);
  }
  var contentCSSXPathString = contentCSSXPaths.join(' | ');
  
  return[userCSSXPathString,contentCSSXPathString];
}

function getPath(element) {
  /*if (element.id !== '') {
    return 'id("' + element.id + '")';
  }*/
  if (element === document.body) {
    return element.tagName.toLowerCase();
  }

  var siblings = element.parentNode.childNodes;
  var count = 1;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === element) {
      return getPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + count + ']';
    }
    if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === element.tagName) {
      count++;
    }
  }
}
