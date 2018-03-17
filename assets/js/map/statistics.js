var beforeNm = '';
var stcs_label = [];
$('#stcsOnOff').click(function() {
  $(this).toggleClass('btn-outline-info');
  if( $(this).text() == '통계 Layer 켜기' ) {
    if ($(this).val() == 1) {
      showStcsItem();
    }
    else {
      $(this).val(1);
      initStcs();
    }
    $(this).text('통계 Layer 끄기');

  }
  else {
    $(this).text('통계 Layer 켜기');
    hideStcsItem();
  }
});

$('.btn-toggle').click(function() {
  if ($('#stcsToggle').val() == 0) {          //통계보기 on
    $('#stcsToggle').val(1);
    $('.stcs-polygon').css('fill','#4285f48f')
  }
  else {                                      //통계보기 off
    $('#stcsToggle').val(0);
    $('.stcs-polygon').css('fill','#404040')
  }
  // $(this).find('.btn').toggleClass('active');
  $(this).find('.btn').toggleClass('btn-default');
});

function initStcs() {
    stcs_landPolygons = [];
    map.setCenter(new daum.maps.LatLng(36.28176087772557, 127.38463706757949));
    map.setLevel(12);

    ajax_type = 'stcsSido';
    $('.stcs-item').remove();
    $('.stcs_label').remove();
    customAjax($SITE_URL+'getStcs/statscSido',0,
    processStcs);

}

function processStcs(data) {
  removeStcsPolygon();
  removeStcsLabel();
  drawPoly(data);
  if (ajax_type === 'stcsSido') {
    $.each(data, function(index, target){
      createOverlay(target['sidoNm']);
    });
  }
  else if (ajax_type === 'stcsSgg') {
    $.each(data, function(index, target){
      createOverlay(beforeNm+' '+target['sigunguNm']);
    });
  }
  else if (ajax_type === 'stcsDong') {
    $.each(data, function(index, target){
      createOverlay(beforeNm+' '+target['dongNm']);
    });
  }
}

function removeStcsLabel() {
  for (var i = 0; i < stcs_label.length; i++) {
    stcs_label[i].setMap(null);
  }
  stcs_label = [];
}

function removeStcsPolygon() {
  for (var i = 0; i < stcs_landPolygons.length; i++) {
    stcs_landPolygons[i].setMap(null);
  }
  stcs_landPolygons = [];
}

function showStcsItem() {
  for (var i = 0; i < stcs_landPolygons.length; i++) {
    stcs_landPolygons[i].setMap(map);
    var target = stcs_landPolygons[i].wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon stcs-item');
    });
  }
  for (var i = 0; i < stcs_label.length; i++) {
    stcs_label[i].setMap(map);
  }
}

function hideStcsItem() {
  for (var i = 0; i < stcs_landPolygons.length; i++) {
    stcs_landPolygons[i].setMap(null);
  }
  for (var i = 0; i < stcs_label.length; i++) {
    stcs_label[i].setMap(null);
  }
}

function createOverlay(name) {
  var customOverlay = new daum.maps.CustomOverlay({});
  customOverlay.setContent('<div class="stcs_label">' + name + '</div>');

  var geocoder = new daum.maps.services.Geocoder();

  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(name, function(result, status) {
    // 정상적으로 검색이 완료됐으면
    // console.log(name);
    if (status === daum.maps.services.Status.OK) {
      var coords = new daum.maps.LatLng(result[0].y, result[0].x);
      customOverlay.setPosition(coords);
      // console.log(coords);
    }
  });

  customOverlay.setMap(map);
  stcs_label.push(customOverlay);
}

function getStcsSgg(sggcode) {
  ajax_type = 'stcsSgg';
  customAjax($SITE_URL+'getStcs/statscSgg',{sggcode:sggcode},
  processStcs);
}

function getStcsdong(dongcode) {
  ajax_type = 'stcsDong';
  currHjstcs = dongcode;
  customAjax($SITE_URL+'getStcs/statscDong',{dongcode:dongcode},
  processStcs);
}

function getStcsaggr(aggrcode) {
  ajax_type = 'stcsAggr';
  currHjstcs = aggrcode;
  customAjax($SITE_URL+'getStcs/statscAggr',{aggrcode:aggrcode},
  processStcs);
}

function getStcsOldind() {
  ajax_type = 'stcsOldind';
  customAjax($SITE_URL+'getStcs/stcsOldind',{currHjstcs:currHjstcs},
  setOldindPoly);
}

function getStcsPopdens() {
  ajax_type = 'stcsPopdens';
  customAjax($SITE_URL+'getStcs/stcsPopdens',{currHjstcs:currHjstcs},
  setOldindPoly);
}

function setOldindPoly(data) {
  // console.log(data);
  for (var i = 0; i < data.length; i++) {
    changePolyFill(data[i]['tot_oa_cd'],data[i]['value'],'oldind')
  }
}

function stat_side_btn(code) {
  // console.log(code.length);
  if (code.length == 5) { //sgg 초기화
    $('#stat-side-sgg').text('');
    $('#stat-side-dong').text('');
    $('#stat-side-sgg').attr("name", '');
    $('#stat-side-dong').attr("name", '');

    removeStcsLabel();
    removeStcsPolygon();

    getStcsSgg($('#stat-side-sido').attr("name"));
    // $('.stcs-item').remove();
    // $('.stcs_label').remove();
  }
  else if (code.length == 7) {  //dong 초기화
    $('#stat-side-dong').text('');
    $('#stat-side-dong').attr("name", '');

    removeStcsLabel();
    removeStcsPolygon();

    getStcsdong($('#stat-side-sgg').attr("name"))
    // $('.stcs-item').remove();
    // $('.stcs_label').remove();
  }
  else {
    initStcs();
    $('#stat-side-sido').text('');
    $('#stat-side-sgg').text('');
    $('#stat-side-dong').text('');
    $('#stat-side-sido').attr("name", '');
    $('#stat-side-sgg').attr("name", '');
    $('#stat-side-dong').attr("name", '');
  }
}

function changePolyFill(key,val,type) {
  if (type === 'oldind') {
    var r = 255;
    var g = 255;
    var b = 255;
    // console.log(r,g,b);
    val = val*1;
    for (var i = 0; i < aggr_poly.length; i++) {
      if (aggr_poly[i].Bb[0][3] == key) {
        if (val <= 30 ) {
          r -= (val*2).toFixed(0); g -= (val*2).toFixed(0);
        }
        else {
          if (val > 255) {
            r -= (val/255).toFixed(0) ;g = 0; b = 0;
          }
          else {
            g -= val.toFixed(0); b -= val.toFixed(0);
          }
        }
        // console.log(r,g,b);
        $("#" + aggr_poly[i].wc[0].id).css("fill", "rgb("+r+","+g+","+b+")")
        break;
      }
    }
  }
}


var raiz_StcsWindow = function(title){
  var $container = $(document.createElement('div')).addClass("raiz-window-container stcs-window");
  $container.append("<div class='raiz-window-top'>"
  +  "<div class='column controller'>"
  +     "<span class='ti-minus point-cursor'></span>"
  +      "<span class='ti-layers point-cursor'></span>"
  +      "<span class='ti-close point-cursor'></span>"
  +   "</div>"
  +   "<div class='column header'>" + title + "</div>"
  +  "</div>"
  +  "<div class='raiz-window-body stcs'>"
  +   "<div class='stcs-window-title'>"
  +     "<div class='stcs-initdata'>"
  +     "</div>"
  +   "</div>"
  +  "</div>"
  +  "<div class='raiz-window-footer'></div>"
);


lifeToWindow($container);
$container.removeAttr('style');

return $container;
};


var stcs_initTag = function(target){
  var $container;
  switch (target) {
    case 0:
    $container = $(document.createElement('div')).addClass("row");
    $container.css('color','black');
    $container.css('padding-top','15px');
    $container.append('<div class="col-lg-3 col-md-6 col-sm-12">'
    +        '<div class="card card-text-center">'
    +            '<div class="card-content">'
    +                '<div class="media align-items-stretch">'
    +                    '<div class="p-2 text-center bg-info bg-darken-2">'
    +                        '<span class="icon-camera font-large-2"></span>'
    +                    '</div>'
    +                    '<div class="p-2 bg-gradient-x-info white media-body">'
    +                        '<h5>면적</h5>'
    +                        '<h6 id="stcs-init-area" class="text-bold-400 mb-0"><i class="ft-plus"></i></h6>'
    +                    '</div>'
    +                '</div>'
    +            '</div>'
    +        '</div>'
    +    '</div>'
    +'<div class="col-lg-3 col-md-6 col-sm-12">'
    +        '<div class="card card-text-center">'
    +            '<div class="card-content">'
    +                '<div class="media align-items-stretch">'
    +                    '<div class="p-2 text-center bg-danger bg-darken-2">'
    +                        '<i class="icon-user font-large-2"></i>'
    +                    '</div>'
    +                    '<div class="p-2 bg-gradient-x-danger white media-body">'
    +                        '<h5>총 인구</h5>'
    +                        '<h6 id="stcs-init-pop" class="text-bold-400 mb-0"><i class="ft-arrow-up"></i></h6>'
    +                    '</div>'
    +                '</div>'
    +            '</div>'
    +        '</div>'
    +    '</div>'
    +'<div class="col-lg-3 col-md-6 col-sm-12">'
    +        '<div class="card card-text-center">'
    +            '<div class="card-content">'
    +                '<div class="media align-items-stretch">'
    +                    '<div class="p-2 text-center bg-warning bg-darken-2">'
    +                        '<i class="icon-basket-loaded font-large-2"></i>'
    +                    '</div>'
    +                    '<div class="p-2 bg-gradient-x-warning white media-body">'
    +                        '<h5>평균 나이</h5>'
    +                        '<h6 id="stcs-init-avr" class="text-bold-400 mb-0"><i class="ft-plus"></i></h6>'
    +                    '</div>'
    +                '</div>'
    +            '</div>'
    +        '</div>'
    +    '</div>'
    +'<div class="col-lg-3 col-md-6 col-sm-12">'
    +        '<div class="card card-text-center">'
    +            '<div class="card-content">'
    +                '<div class="media align-items-stretch">'
    +                    '<div class="p-2 text-center bg-success bg-darken-2">'
    +                        '<i class="icon-basket-loaded font-large-2"></i>'
    +                    '</div>'
    +                    '<div class="p-2 bg-gradient-x-success white media-body">'
    +                        '<h5>총 주택수</h5>'
    +                        '<h6 id="stcs-init-tothouse" class="text-bold-400 mb-0"><i class="ft-plus"></i></h6>'
    +                    '</div>'
    +                '</div>'
    +            '</div>'
    +        '</div>'
    +    '</div>'
  );

  break;

  case 1:
  $container = $(document.createElement('div')).addClass("row");
  $container.append('<div class="col-lg-6 col-md-6" col-sm-6">'
  +'<div class="card">'
  +    '<div class="card-header">'
  +        '<h4 id="stcs-totalFaily" class="card-title">세대 구성별 가구 / 총 가구 수 : 300</h4>'
  +    '</div>'
  +    '<div class="card-content px-4">'
  +         '<canvas id="houseHoldChart" class="stchart"></canvas>'
  +    '</div>'
  +'</div>'
  +'</div>'
  +'<div class="col-lg-6 col-md-6" col-sm-6">'
  +'<div class="card">'
  +    '<div class="card-header jobsToggle">'
  +        '<h4 class="card-title">유형별 주택</h4>'
  +    '</div>'
  +    '<div class="card-content px-4">'
  +         '<canvas id="houseTypeChart" class="stchart"></canvas>'
  +    '</div>'
  +'</div>'
  +'</div>'

);
break;

case 2:
$container = $(document.createElement('div')).addClass("row");
$container.append('<div class="col-lg-12 col-md-12" col-sm-12">'
+'<div class="card">'
+    '<div class="card-header">'
+        '<h4 class="card-title">연건평별 주택</h4>'
+    '</div>'
+    '<div class="card-content px-4">'
+         '<canvas id="houseSizeChart" class="stchart"></canvas>'
+    '</div>'
+'</div>'
+'</div>'
);
break;

case 3:
$container = $(document.createElement('div')).addClass("row");
$container.append('<div class="col-lg-6 col-md-6" col-sm-6">'
+'<div class="card">'
+    '<div class="card-header jobsToggle">'
+        '<h4 class="card-title">산업분류별 종사자 수</h4>'
+    '</div>'
+    '<div class="card-content px-4">'
+         '<canvas id="jobsPopChart" class="stchart"></canvas>'
+    '</div>'
+'</div>'
+'</div>'
+'<div class="col-lg-6 col-md-6" col-sm-6">'
+'<div class="card">'
+    '<div class="card-header jobsToggle">'
+        '<h4 class="card-title">산업분류별 사업체 수</h4>'
+    '</div>'
+    '<div class="card-content px-4">'
+         '<canvas id="jobsBizChart" class="stchart"></canvas>'
+    '</div>'
+'</div>'
+'</div>'
);
break;

case 4:
$container = $(document.createElement('div')).addClass("row");
$container.append('<div class="col-lg-12 col-md-12" col-sm-12">'
+'<div class="card">'
+    '<div class="card-header">'
+        '<h4 class="card-title">성 연령별 인구</h4>'
+    '</div>'
+    '<div class="card-content px-4">'
+         '<canvas id="sexAgeChart" class="stchart"></canvas>'
+    '</div>'
+'</div>'
+'</div>'
);
break;

case 5:
$container = $(document.createElement('div')).addClass("row");
$container.append('<div class="col-md-12">'
+'<div class="card">'
+    '<div class="card-content">'
+       '<div class="row">'
+         '<div class="col-xl-3 col-lg-3 col-md-6 border-right-blue-grey border-right-lighten-5">'
+           '<div class="my-1 text-center">'
+              '<div class="card-header mb-2 pt-0">'
+                  '<h5 class="primary">인구밀도</h5>'
+                  '<h3 id="stcs-popDensity" class="stcsbottom text-bold-200">3,261</h3>'
+              '</div>'
+              '<div class="card-content">'
+              '</div>'
+            '</div>'
+         '</div>'
+         '<div class="col-xl-3 col-lg-3 col-md-6 border-right-blue-grey border-right-lighten-5">'
+           '<div class="my-1 text-center">'
+              '<div class="card-header mb-2 pt-0">'
+                  '<h5 class="primary">노령화 지수</h5>'
+                  '<h3 id="stcs-oldIndices" class="stcsbottom text-bold-200">3,261</h3>'
+              '</div>'
+              '<div class="card-content">'
+              '</div>'
+            '</div>'
+         '</div>'
+         '<div class="col-xl-3 col-lg-3 col-md-6 border-right-blue-grey border-right-lighten-5">'
+           '<div class="my-1 text-center">'
+              '<div class="card-header mb-2 pt-0">'
+                  '<h5 class="primary">유년 부양비</h5>'
+                  '<h3 id="stcs-supportYoung" class="stcsbottom text-bold-200">3,261</h3>'
+              '</div>'
+              '<div class="card-content">'
+              '</div>'
+            '</div>'
+         '</div>'
+         '<div class="col-xl-3 col-lg-3 col-md-6 border-right-blue-grey border-right-lighten-5">'
+           '<div class="my-1 text-center">'
+              '<div class="card-header mb-2 pt-0">'
+                  '<h5 class="primary">노년 부양비</h5>'
+                  '<h3 id="stcs-supportOld" class="stcsbottom text-bold-200">3,261</h3>'
+              '</div>'
+              '<div class="card-content">'
+              '</div>'
+            '</div>'
+         '</div>'
+       '</div>'
+     '</div>'
+'</div>'
+'</div>'
);
break;


default:

}


// $stcsWind2.after($stcsWind3);
// $container.after(testTag);

return $container;

// target.append($container);

};

var testFunc = function(data,target){
  $(target).find('#stcs-init-area').text('hi');
}


var stcs_additag = function(target,data,addiType,code){

  var colorarr_fill = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 205, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(201, 203, 207, 0.2)",
    "rgba(154, 95, 15,0.2)",
    "rgba(118, 227, 116,0.2)",
    "rgba(214, 66, 227,0.2)"
  ];

  var colorarr_border = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(201, 203, 207)",
    "rgb(154, 95, 15)",
    "rgb(118, 227, 116)",
    "rgb(214, 66, 227)"
  ];

  var name = [];
  var value = [];

  if (addiType == 'stcsHouseSize' || addiType == 'stcsHouseType' || addiType == 'stcsHouseHold' || addiType == 'stcsJobsPop' || addiType == 'stcsJobsBiz')
  {
    for (var i = 0; i < data.length; i++) {
      if (data[i]['value'] == "0") {
        continue;
      }
      if (addiType == "stcsHouseSize" && String(data[i]['name']).indexOf("~")) {
        name.push(String(data[i]['name']).replace("이하(호)",""));
        value.push(data[i]['value']);
      }
      else{
        name.push(data[i]['name']);
        value.push(data[i]['value']);
      }
    }
  }
  // console.log(addiType);
  switch (addiType) {

    case 'initdata':

    $(target).find('#stcs-init-area').text(numberWithCommas((data[0]*1).toFixed(1))+'㎡');
    $(target).find('#stcs-init-pop').text(numberWithCommas(data[1])+'명');
    $(target).find('#stcs-init-avr').text(numberWithCommas((data[2]*1).toFixed(0))+'세');

    break;

    case 'stcsTotaljobs' :
    if (data.length == 0) {
      break;
    }
    // console.log(data);
    // $container = $(document.createElement('h')).addClass("stcs-initdata-stcsTotaljobs");
    // $container.append(
    //                    " 총괄사업체수 : "+data[0]['value']
    // );
    break;

    case 'stcsHouseType' :
    if (data.length == 0) {
      break;
    }
    new Chart($(target).find('#houseTypeChart'),{
      'type': 'doughnut',
      'data': {
        'labels': name,
        'datasets': [{
          'data': value,
          'backgroundColor':colorarr_border
        }]
      },
      'options': {
        "tooltips": {
          "callbacks": {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var labelset = data.labels[tooltipItem.datasetIndex];
              var currentValue = dataset.data[tooltipItem.index];
              return labelset+':'+comma(currentValue) + '개';
            }}
          }
        }
      });


      // console.log(data);
      // $container = $(document.createElement('h')).addClass("stcs-initdata-stcsHouseType");
      // for (var i = 0; i < data.length; i++) {
      //   $container.append(
      //                      "</br>유형별 주택 : "+data[i]['name']+" / "+data[i]['value']+" 개"
      //   );
      // }

      break;

      case 'stcsTotalHouse' :
      if (data.length == 0) {
        break;
      }
      $(target).find('#stcs-init-tothouse').text(numberWithCommas(data[0]['value'])+'개');
      // console.log(data);
      // $container = $(document.createElement('h')).addClass("stcs-initdata-stcsTotalHouse");
      // $container.append(
      //                    "</br>총 주택 수 : "+data[0]['value']
      // );
      break;

      case 'stcsHouseSize' :
      if (data.length == 0) {
        break;
      }
      new Chart($(target).find('#houseSizeChart'),{
        "type":"bar",
        "data":{
          "labels":name,
          "datasets":[
            {
              "label":"연건평별 주택",
              "data":value,
              "fill":false,
              "backgroundColor":colorarr_fill,
              "borderColor":colorarr_border,
              "borderWidth":1
            }
          ]
        },
        "options":{
          "tooltips": {
            "callbacks": {
              label: function(tooltipItem, data) {
                return comma(tooltipItem.yLabel) + '개';
              },
            }
          },
          "scales":{
            "yAxes":
            [
              {
                "ticks":
                {
                  "beginAtZero":true,
                  userCallback: function(val, index, value) {
                    if (value == 0)
                    return "0개";
                    else
                    return comma(val)+'개';
                  }
                }

              }
            ]
          }
        }
      }
    );

    break;

    case 'stcsHouseHold' :
    if (data.length == 0) {
      break;
    }
    // console.log(data);
    // console.log(name);
    // console.log(value);

    new Chart($(target).find('#houseHoldChart'),{
      'type': 'doughnut',
      'data': {
        'labels': name,
        'datasets': [{
          'data': value,
          'backgroundColor':colorarr_border
        }]
      },
      'options': {
        "tooltips": {
          "callbacks": {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var labelset = data.labels[tooltipItem.datasetIndex];
              var currentValue = dataset.data[tooltipItem.index];
              return labelset+':'+comma(currentValue) + '개';
            }}
          }
        }
    });

    break;

    case 'stcsTotalFamily' :
    if (data.length == 0) {
      break;
    }
    // console.log(data);
    // $container = $(document.createElement('h')).addClass("stcs-initdata-stcsTotalFamily");
    // for (var i = 0; i < data.length; i++) {
    //   $container.append(
    //                      "</br>가구 총괄 : "+data[i]['name']+" / "+data[i]['value']+" 세대"
    //   );
    // }
    $(target).find('#stcs-totalFaily').text('총 가구 수 : '+numberWithCommas(data[0]['value'])+' / 평균 가구원 수 : '+numberWithCommas(data[1]['value']));

    break;

    case 'stcsJobsPop' :
    if (data.length == 0) {
      break;
    }

    // customAjax($SITE_URL+'getStcs/'+stcsAggList[i], {currHjstcs:polygons[0].Bb[0][3]}, function(data){
    //   stcs_additag(STCSwindow,data,stcsAggList[i],polygons[0].Bb[0][3]);

    new Chart($(target).find('#jobsPopChart'),{
      'type': 'radar',
      'data': {
        'labels': name,
        'datasets': [{
          'label': '종사자 수',
          'data': value,
          'backgroundColor': "rgba(255, 99, 132, 0.2)",
          'borderColor': "rgb(255, 99, 132)",
          'pointBackgroundColor': 'red',
        }]
      },
      'options': 'options'
    });

    break;

    case 'stcsJobsBiz' :
    if (data.length == 0) {
      break;
    }
    new Chart($(target).find('#jobsBizChart'),{
      'type': 'radar',
      'data': {
        'labels': name,
        'datasets': [{
          'label': '사업체 수',
          'data': value,
          'backgroundColor': "rgba(255, 99, 132, 0.2)",
          'borderColor': "rgb(255, 99, 132)",
          'pointBackgroundColor': 'red',
        }]
      },
      'options': 'options'
    });

    break;

    case 'stcsSexAge':
    if (data.length == 0) {
      break;
    }

    var labels = ['~9','10~19','20~29','30~39','40~49','50~59','60~69','70~79','80~89','90~99','100~'];
    var dataset1 = [0,0,0,0,0,0,0,0,0,0,0];
    var dataset2 = [0,0,0,0,0,0,0,0,0,0,0];

    for (var i = 0; i < data.length; i++) {
      if (data[i]['item']*1 < 60) {
        if (data[i]['item'] == '31' || data[i]['item'] == '32') {
          dataset1[0] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '33' || data[i]['item'] == '34') {
          dataset1[1] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '35' || data[i]['item'] == '36') {
          dataset1[2] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '37' || data[i]['item'] == '38') {
          dataset1[3] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '39' || data[i]['item'] == '40') {
          dataset1[4] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '41' || data[i]['item'] == '42') {
          dataset1[5] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '43' || data[i]['item'] == '44') {
          dataset1[6] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '45' || data[i]['item'] == '46') {
          dataset1[7] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '47' || data[i]['item'] == '48') {
          dataset1[8] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '49' || data[i]['item'] == '50') {
          dataset1[9] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '51') {
          dataset1[10] += data[i]['value']*1;
        }
      }
      else {
        if (data[i]['item'] == '61' || data[i]['item'] == '62') {
          dataset2[0] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '63' || data[i]['item'] == '64') {
          dataset2[1] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '65' || data[i]['item'] == '66') {
          dataset2[2] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '67' || data[i]['item'] == '68') {
          dataset2[3] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '69' || data[i]['item'] == '70') {
          dataset2[4] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '71' || data[i]['item'] == '72') {
          dataset2[5] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '73' || data[i]['item'] == '74') {
          dataset2[6] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '75' || data[i]['item'] == '76') {
          dataset2[7] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '77' || data[i]['item'] == '78') {
          dataset2[8] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '79' || data[i]['item'] == '80') {
          dataset2[9] += data[i]['value']*1;
        }
        else if (data[i]['item'] == '81') {
          dataset2[10] += data[i]['value']*1;
        }
      }

    }


    var ctx = $(target).find('#sexAgeChart').get(0).getContext('2d');
    ctx.canvas.width = 1000;
    ctx.canvas.height = 300;
    var cfg = {
      type: 'bar',
      data:{
        labels: labels,
        datasets: [{
          label: '남성',
          data: dataset1,
          // type: 'bar',
          pointRadius: 0,
          fill: false,
          lineTension: 0,
          borderWidth: 2,
          backgroundColor: colorarr_fill[4],
          borderColor : colorarr_border[4]
        },{
          label: '여성',
          data: dataset2,
          // type: 'bar',
          pointRadius: 0,
          fill: false,
          lineTension: 0,
          borderWidth: 2,
          backgroundColor: colorarr_fill[0],
          borderColor : colorarr_border[0]
        }
      ]},
      options: {
        "tooltips": {
          "callbacks": {
            label: function(tooltipItem, data) {
              return comma(tooltipItem.yLabel) + '명';
            },
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            distribution: 'series',
            ticks: {
              source: 'labels'
            }
          }],
          yAxes: [{
            "ticks":
            {
              "beginAtZero":true,
              userCallback: function(val, index, value) {
                if (value == 0)
                  return "0개";
                else
                  return comma(val)+'명';
              }
            },
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: '인구 수'
            }
          }]
        }
      }
    };

    var chart = new Chart(ctx, cfg);

    break;


    case 'stcsOldind':
    if (data.length == 0) {
      break;
    }
    // console.log(data);
    $(target).find('#stcs-oldIndices').text(numberWithCommas(data[0]['value']));
    break;



    case 'stcsPopdens':
    if (data.length == 0) {
      break;
    }
    // console.log(data);
    $(target).find('#stcs-popDensity').text(numberWithCommas(data[0]['value']));
    break;

    case 'stcsSupportY':
    if (data.length == 0) {
      break;
    }
    // console.log(data);
    $(target).find('#stcs-supportYoung').text(numberWithCommas(data[0]['value']));
    break;

    case 'stcsSupportO':
    if (data.length == 0) {
      break;
    }
    // console.log(data);
    $(target).find('#stcs-supportOld').text(numberWithCommas(data[0]['value']));
    break;


    default:
    alert('stcs-additag error')

  }
};

function numberWithCommas(x) {
  var temp = x.split('.');
  if (temp.length > 1) {
    return temp[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'.'+temp[1];
  }
  else {
    return temp[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}


function youdongStart() {
  var loading = $(document.createElement('div')).addClass("stcsLoading");
  loading.append('<text class="loading" fill="#fff">Loading...</text>');
  $(document.body).append(loading);
  customAjax($SITE_URL+'getStcs/youdongStart',0,setYoudongCircle);
}

function setYoudongCircle(data) {
  $.each(data, function(index, target) {
      var point = parsePoint(target['point']);
      var x = point[0], y = point[1];

      var circle = new daum.maps.Circle({
          // center : new daum.maps.LatLng(33.450701, 126.570667),  // 원의 중심좌표 입니다
          radius: 10, // 미터 단위의 원의 반지름입니다
          strokeWeight: 5, // 선의 두께입니다
          strokeColor: '#75B8FA', // 선의 색깔입니다
          strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid', // 선의 스타일 입니다
          fillColor: '#CFE7FF', // 채우기 색깔입니다
          fillOpacity: 0.7  // 채우기 불투명도 입니다
      });
      circle.setPosition(new daum.maps.LatLng(x, y));
      circle.setMap(map);
      // console.log(point);
  });
  $(".stcsLoading").remove();
}

// function setYDCircle(circle,) {
//
// }
