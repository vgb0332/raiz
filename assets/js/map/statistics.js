function getStcsPop() {
  customAjax($SITE_URL+'get/statscPop',0,
            drawPoly);
}

function processStcs(arr) {
  console.log('called');
  for (var i = 0; i < arr.length; i++) {
    drawPoly(arr[i])
  }
}
