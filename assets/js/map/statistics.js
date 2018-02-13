function getStcsSgg() {
  ajax_type = 'stcs';
  customAjax($SITE_URL+'get/statscSgg',0,
            drawPoly);
}

function getStcsdong(dongcode) {
  ajax_type = 'stcsDong';
  customAjax($SITE_URL+'get/statscDong',{dongcode:dongcode},
            drawPoly);
}

function getStcsaggr(aggrcode) {
  ajax_type = 'stcsAggr';
  customAjax($SITE_URL+'get/statscAggr',{aggrcode:aggrcode},
            drawPoly);
}


function processStcs(arr) {
  console.log('called');
  for (var i = 0; i < arr.length; i++) {
    drawPoly(arr[i])
  }
}
