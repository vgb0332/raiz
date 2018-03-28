var beforeNm = '';
var stcs_label = [];
var youdong_circle = [];
var youdong_val = [];
// var youdong_code = [];

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
  else if (ajax_type === 'stcsSgg' || ajax_type === 'youdong') {
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
  map.setCenter(new daum.maps.LatLng(37.55018419535014, 126.95256106549972));
  map.setLevel(9);
  $('.legendBox').remove();
  for (var i = 0; i < youdong_circle.length; i++) {
    youdong_circle[i].setMap(null);
  }
  ajax_type = "youdong";
  customAjax($SITE_URL+'getStcs/statscSgg',{sggcode:11},processStcs);
}

function setYoudongCircle(data) {
  youdongLevel();
  var YDformat = {
    "code":"",
    "havetype":[],
    "type":{
      "본조사":{
        "평일":{
          "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
        },
        "주말":{
          "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
        }
      },
      "계절요인조사":{
        "평일":{
          "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
        },
        "주말":{
          "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
        }
      },
      "북촌":{
        "평일":{
          "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
        },
        "주말":{
          "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
        }
      },
      "지하철":{
        "평일":{
          "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
        },
        "주말":{
          "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
        }
      }
    }
  }
  youdong_val = [];
  // var YDformat = {"code":"","data":[]};

  console.log(data);
  var before = data[0]['code'];
  var sum = 0;
  var cnt = 0;
  YDformat["code"] = data[0]['code'];
  bftype = data[0]['type'];
  for (var i = 0; i < data.length; i++) {
    (function(i){
      var cd = data[i]['code'];
      if (before == cd && i+1 != data.length) {
        if (bftype != data[i]['type']) {
          YDformat["havetype"].push(bftype);
          bftype = data[i]['type'];
        }
        sum += data[i]['value']*1;
        cnt++;
        if (data[i]['day'] == '토') {
          YDformat["type"][data[i]['type']]['주말'][data[i]['time']].push(data[i]['value']);
        }
        else {
          YDformat["type"][data[i]['type']]['평일'][data[i]['time']].push(data[i]['value']);
        }
      }
      else {
        YDformat["havetype"].push(bftype);
        bftype = data[i]['type'];
        if (i+1 == data.length) {
          if (data[i]['day'] == '토') {
            YDformat["type"][data[i]['type']]['주말'][data[i]['time']].push(data[i]['value']);
          }
          else {
            YDformat["type"][data[i]['type']]['평일'][data[i]['time']].push(data[i]['value']);
          }
          var pnt = data[i]['point'];
          var nm = data[i]['name'];
          var typ = data[i]['type'];
          sum += data[i]['value']*1;
          cnt++;
        }
        else {
          var pnt = data[i-1]['point'];
          var nm = data[i-1]['name'];
          var typ = data[i-1]['type'];
          before = cd;
        }
        var point = parsePoint(pnt);
        var x = point[0], y = point[1];

        var avg = (sum/cnt).toFixed(0)
        var color;
        var radius;
        if (avg > 100) {
          if (avg > 300) {
            if (avg > 600) {
              if (avg > 1000) {
                color = 'rgb(205, 17, 3)';radius = 30;
              }
              else {color = 'rgb(224, 76, 22)';radius = 25;}
            }
            else {color = 'rgb(230, 116, 48)';radius = 20;}
          }
          else {color = 'rgb(255, 205, 156)';radius = 15;}
        }
        else {color = 'rgb(255, 242, 230)';radius = 10;}
        // youdong_code.push(cd);
        var circle = new daum.maps.Circle({
            // center : new daum.maps.LatLng(33.450701, 126.570667),  // 원의 중심좌표 입니다
            radius: radius, // 미터 단위의 원의 반지름입니다
            strokeWeight: 5, // 선의 두께입니다
            strokeColor: color, // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid', // 선의 스타일 입니다
            fillColor: color, // 채우기 색깔입니다
            fillOpacity: 0.7  // 채우기 불투명도 입니다
        });

        // console.log(circle);

        circle.setPosition(new daum.maps.LatLng(x, y));
        circle.setMap(map);
        // console.log(circle);
        circle.Bb["cd"] = data[i]['code'];
        circle.Bb["nm"] = nm;
        circle.Bb["typ"] = typ;
        circle.Bb["sum"] = sum;
        circle.Bb["avg"] = (sum/cnt).toFixed(0);
        // console.log(data[i]['code']);
        // console.log(circle);

        // console.log(cnt);
        youdong_circle.push(circle);
        var customOverlay = new daum.maps.CustomOverlay({});
        daum.maps.event.addListener(circle, 'mouseover', function(mouseEvent) {
          customOverlay.setContent('<div class="stcs_ol"><div>'+circle.Bb["nm"]+'</br>'+circle.Bb["typ"]+'</br>평균 : '+circle.Bb["avg"]+'명</div>'
                                  +'<canvas id="ydoverlay" class=""></canvas>'
                                  +'</div>');
          customOverlay.setPosition(mouseEvent.latLng);
          customOverlay.setMap(map);
          showYDChart(circle.Bb["cd"]);
        });
        daum.maps.event.addListener(circle, 'mousemove', function(mouseEvent) {
          customOverlay.setPosition(mouseEvent.latLng);
        });
        daum.maps.event.addListener(circle, 'mouseout', function() {
          customOverlay.setMap(null);
        });
        sum = 0;
        cnt = 0;
        sum += data[i]['value']*1;
        cnt++;
        youdong_val.push(YDformat);
        if (i+1 != data.length) {
          YDformat = {
            "code":"",
            "havetype":[],
            "type":{
              "본조사":{
                "평일":{
                  "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
                },
                "주말":{
                  "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
                }
              },
              "계절요인조사":{
                "평일":{
                  "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
                },
                "주말":{
                  "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
                }
              },
              "북촌":{
                "평일":{
                  "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
                },
                "주말":{
                  "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
                }
              },
              "지하철":{
                "평일":{
                  "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
                },
                "주말":{
                  "07~08":[],"08~09":[],"09~10":[],"10~11":[],"11~12":[],"12~13":[],"13~14":[],"14~15":[],"15~16":[],"16~17":[],"17~18":[],"18~19":[],"19~20":[],"20~21":[]
                }
              }
            }
          }
          if (data[i]['day'] == '토') {
            YDformat["type"][data[i]['type']]['주말'][data[i]['time']].push(data[i]['value']);
          }
          else {
            YDformat["type"][data[i]['type']]['평일'][data[i]['time']].push(data[i]['value']);
          }
          YDformat["code"] = cd;
        }
      }


    })(i)
  };
  // for (var i = 0; i < youdong_code.length; i++) {
  //   console.log(youdong_code[i]);
  //   youdong_circle[i].A["cd"] = youdong_code[i];
  // }
  console.log(youdong_val);

}

function showYDChart(code) {
  for (var i = 0; i < youdong_val.length; i++) {
    if (code == youdong_val[i]["code"]) {
      var timeList = Object.keys(youdong_val[i]['type'][youdong_val[i]['havetype'][0]]['평일']);
      var data1 = [];
      var data2 = [];
      var label = [];
      for (var j = 0; j < timeList.length; j++) {
        var sum = 0;
        var num = youdong_val[i]['type'][youdong_val[i]['havetype'][0]]['평일'][timeList[j]].length;
        for (var k = 0; k < num; k++) {
          sum += youdong_val[i]['type'][youdong_val[i]['havetype'][0]]['평일'][timeList[j]][k]*1;
        }
        data1.push(sum/num);
        data2.push(youdong_val[i]['type'][youdong_val[i]['havetype'][0]]['주말'][timeList[j]][0]*1)
      }
      console.log(data2);
      var ctx = $('#ydoverlay').get(0).getContext('2d');
      // ctx.canvas.width = 180;
      // ctx.canvas.height = 60;
      new Chart(ctx, {
          type: 'line',
          data: {
            labels: timeList,
            datasets: [{
              label:'평일',
              data:data1,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor : "rgb(255, 99, 132)"
            },
            {
              label:'주말',
              data:data2,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor : "rgb(75, 192, 192)"
            }]
          },
          options: {
            hover: {
    					mode: 'nearest',
    					intersect: true
    				}
          }
          // options: {
          //     bezierCurve:false, //remove curves from your plot
          //     scaleShowLabels : false, //remove labels
          //     tooltipEvents:[], //remove trigger from tooltips so they will'nt be show
          //     pointDot : false, //remove the points markers
          //     scaleShowGridLines: true //set to false to remove the grids background
          //   }
      });
      break;
    }
  }
}

function youdongLevel() {
  $(document.body).append('<div class="legendBox" id="typeArea_20180321181652550">'
  +  '<ul class="colorbar" id="colorStatus_20180321181652550" style="font-family: Arial;">'
  +    '<li style="background: rgb(205, 17, 3); border: 0px solid rgb(205, 17, 3); height: 31px; line-height: 31px;">'
  +      '<span>1000명 이상</span>'
  +    '</li>'
  +    '<li style="background: rgb(224, 76, 22); border: 0px solid rgb(224, 76, 22); height: 31px; line-height: 31px;">'
  +      '<span>600~1000명</span>'
  +    '</li>'
  +    '<li style="background: rgb(230, 116, 48); border: 0px solid rgb(230, 116, 48); height: 31px; line-height: 31px;">'
  +      '<span>300~600명</span>'
  +    '</li>'
  +    '<li style="background: rgb(255, 205, 156); border: 0px solid rgb(255, 205, 156); height: 31px; line-height: 31px;">'
  +      '<span>100~300명</span>'
  +    '</li>'
  +    '<li style="background: rgb(255, 242, 230); border: 0px solid rgb(255, 242, 230); height: 31px; line-height: 31px;">'
  +      '<span>100명 이하</span>'
  +    '</li>'
  +    '<li style="color:black;background: white; border: 0px solid white; height: 31px; line-height: 31px;">'
  +      '<span>평균 유동인구 수 / 한시간</span>'
  +    '</li>'
  +  '</ul>'
  +'</div>');
}




// var clusterer = new daum.maps.MarkerClusterer({
//   map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
//   averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
//   minLevel: 6, // 클러스터 할 최소 지도 레벨
// });
// var styles = [{
//         width : '53px', height : '52px',
//         backgroundColor : 'rgba(255, 0, 54, 0.6)',
//         color: '#fff',
//         textAlign: 'center',
//         lineHeight: '54px',
//         fillOpacity: 0.5
//     }, {
//         width : '73px', height : '72px',
//         backgroundColor : 'rgba(97, 0, 255, 0.62)',
//         color: '#fff',
//         textAlign: 'center',
//         lineHeight: '74px',
//         fillOpacity: 0.5
//     }
// ];
//
// clusterer.setStyles(styles);

var currentAcode = ['',''];
var currentAcircle = [];


function GM_test() {
  var level = map.getLevel();
  var center = map.getCenter();
  if (level < 6) {
    geocoder.coord2RegionCode(center.getLng(), center.getLat(), function(result, status){
      if (status === daum.maps.services.Status.OK) {
        console.log(result);
        currentAcode[0] = result[0].code.substring(0,5);
        customAjax($SITE_URL+'getStcs/gmtest',{code:result[0].code.substring(0,5)},GM_make);
        if (result[0].code.substring(0,5) != result[1].code.substring(0,5)) {
          customAjax($SITE_URL+'getStcs/gmtest',{code:result[1].code.substring(0,5)},GM_make);
        }

      }

    });

  }
  auction_start();
  // customAjax($SITE_URL+'getStcs/gmtest',0,GM_make);
}

function GM_make(data) {
  if (data.length == 0) {
    return
  }
  // console.log(data);
  var comp = [];
  var AcircleFormat = {'code' : '','circle':[]};
  AcircleFormat['code'] = data[0]['sigunguCd'];
  $.each(data, function(index, target){
      var point = parsePoint(target['point']);
      var x = point[0],y = point[1];

      // console.log(point);

      // return
      var circle = new daum.maps.Circle({
          // center : new daum.maps.LatLng(33.450701, 126.570667),  // 원의 중심좌표 입니다
          radius: 25, // 미터 단위의 원의 반지름입니다
          strokeWeight: 2, // 선의 두께입니다
          strokeColor: 'rgb(255, 255, 255)', // 선의 색깔입니다
          strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid', // 선의 스타일 입니다
          fillColor: 'rgb(255, 84, 84)', // 채우기 색깔입니다
          fillOpacity: 0.7  // 채우기 불투명도 입니다
      });

      // console.log(circle);

      circle.setPosition(new daum.maps.LatLng(x, y));
      circle.setMap(map);


      AcircleFormat['circle'].push(circle);

      // var position = new daum.maps.LatLng(x, y);
      // var marker = new daum.maps.Marker({
      //     position: position // 마커를 표시할 위치
      // });
      // marker.setMap(map);
      // marker.J = [target['addr'],target['면적/특이사항'],target['물건용도'],target['법원명/담당계'],target['진행상태'],target['감정가'],target['최저가율']];
      //
      // var customOverlay = new daum.maps.CustomOverlay({});
      // daum.maps.event.addListener(marker, 'mouseover', function(mouseEvent) {
      //   customOverlay.setContent('<div class="stcs_ol"><div>'+marker.J[0]+'</br>'+marker.J[1]+'</br>용도 : '+marker.J[2]+'</br>법원명 / 담당계 : '
      //                           +marker.J[3]+'</br>진행상태 : '+marker.J[4]+'</br>감정가 : '+marker.J[5]+'</br>최저가율 : '+marker.J[6]+'</div>'
      //                           +'</div>');
      //   customOverlay.setPosition(marker.getPosition());
      //   customOverlay.setMap(map);
      //   // showYDChart(marker.J["cd"]);
      // });
      // daum.maps.event.addListener(marker, 'mousemove', function(mouseEvent) {
      //   customOverlay.setPosition(marker.getPosition());
      // });
      // daum.maps.event.addListener(marker, 'mouseout', function() {
      //   customOverlay.setMap(null);
      // });

  });
  currentAcircle.push(AcircleFormat);
  // console.log(comp);
  // clusterer.addMarkers(comp);
}



function auction_start() {
  daum.maps.event.addListener(map, 'center_changed', function() {

    // 지도의  레벨을 얻어옵니다
    var level = map.getLevel();

    // 지도의 중심좌표를 얻어옵니다
    var center = map.getCenter();

    geocoder.coord2RegionCode(center.getLng(), center.getLat(), function(result, status){

      if (status === daum.maps.services.Status.OK) {
        // console.log(result);
        var temp = [];
        for (var i = 0; i < 2; i++) {
          if (currentAcode[0] != result[i].code.substring(0,5) && currentAcode[1] != result[i].code.substring(0,5)) {
            console.log('change');
            customAjax($SITE_URL+'getStcs/gmtest',result[i].code.substring(0,5),GM_make);
            temp.push(result[i].code.substring(0,5));
          }
          else {
              temp.push(result[i].code.substring(0,5));
          }
        }
        currentAcode = temp;

        for (var i = 0; i < currentAcircle.length; i++) {
          if (currentAcode[0] != currentAcircle[i]['code'] && currentAcode[1] != currentAcircle[i]['code']) {
            console.log(currentAcircle[i]['circle'].length);
            // for (var i = 0; i < currentAcircle[i].circle.length; i++) {
            //   currentAcircle[i]['circle'][i].setMap(null);
            // }
            // currentAcircle.splice(i,1);
          }
        }
      }

    });

    // var message = '<p>지도 레벨은 ' + level + ' 이고</p>';
    // message += '<p>중심 좌표는 위도 ' + latlng.getLat() + ', 경도 ' + latlng.getLng() + '입니다</p>';
    //
    // var resultDiv = document.getElementById('result');
    // resultDiv.innerHTML = message;

  });
}
