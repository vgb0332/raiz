var beforeNm = '';

function initStcs() {
  console.log('called');
  ajax_type = 'stcsSido';
  $('.stcs-item').remove();
  $('.stcs_label').remove();
  customAjax($SITE_URL+'getStcs/statscSido',0,
            processStcs);
  map.setCenter(new daum.maps.LatLng(36.28176087772557, 127.38463706757949));

  map.setLevel(12);
  // map.setLevel(12, {
  //   animate: {
  //       duration: 2000
  //   }
  // });
}

function processStcs(data) {
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
            drawPoly);
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
    getStcsSgg($('#stat-side-sido').attr("name"));

    $('.stcs-item').remove();
    $('.stcs_label').remove();
  }
  else if (code.length == 7) {  //dong 초기화
    $('#stat-side-dong').text('');
    $('#stat-side-dong').attr("name", '');
    getStcsdong($('#stat-side-sgg').attr("name"))

    $('.stcs-item').remove();
    $('.stcs_label').remove();
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
  var $container = $(document.createElement('div')).addClass("raiz-window-container");
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
                    +                        '<h5 id="stcs-init-area" class="text-bold-400 mb-0"><i class="ft-plus"></i></h5>'
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
                    +                        '<h5 id="stcs-init-pop" class="text-bold-400 mb-0"><i class="ft-arrow-up"></i></h5>'
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
                    +                        '<h5 id="stcs-init-avr" class="text-bold-400 mb-0"><i class="ft-plus"></i></h5>'
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
                    +                        '<h5 id="stcs-init-tothouse" class="text-bold-400 mb-0"><i class="ft-plus"></i></h5>'
                    +                    '</div>'
                    +                '</div>'
                    +            '</div>'
                    +        '</div>'
                    +    '</div>'
      );

      break;

    case 1:
      $container = $(document.createElement('div')).addClass("row");
      $container.append('<div class="col-lg-4 col-md-4" col-sm-4>'
                    +'<div class="card">'
                    +    '<div class="card-header">'
                    +        '<h4 class="card-title">유형별 주택</h4>'
                    +    '</div>'
                    +    '<div class="card-content px-4 stcsNlabel">'
                    +        '<div class="media-list">'
                    +             '<div class="media-body w-100">'
                    +                 '<h6 class="list-group-item-heading">아파트<span id="ho_gb_003" class="font-medium-4 float-right pt-1"></span></h6>'
                    +             '</div>'
                    +         '</div>'
                    +        '<div class="media-list">'
                    +             '<div class="media-body w-100">'
                    +                 '<h6 class="list-group-item-heading">단독 주택<span id="ho_gb_002" class="font-medium-4 float-right pt-1"></span></h6>'
                    +             '</div>'
                    +         '</div>'
                    +        '<div class="media-list">'
                    +             '<div class="media-body w-100">'
                    +                 '<h6 class="list-group-item-heading">다세대<span id="ho_gb_001" class="font-medium-4 float-right pt-1"></span></h6>'
                    +             '</div>'
                    +         '</div>'
                    +        '<div class="media-list">'
                    +             '<div class="media-body w-100">'
                    +                 '<h6 class="list-group-item-heading">연립 주택<span id="ho_gb_004" class="font-medium-4 float-right pt-1"></span></h6>'
                    +             '</div>'
                    +         '</div>'
                    +        '<div class="media-list">'
                    +             '<div class="media-body w-100">'
                    +                 '<h6 class="list-group-item-heading">주택 이외 거처<span id="ho_gb_006" class="font-medium-4 float-right pt-1"></span></h6>'
                    +             '</div>'
                    +         '</div>'
                    +        '<div class="media-list">'
                    +             '<div class="media-body w-100">'
                    +                 '<h6 class="list-group-item-heading">영업용 건물 내 주택<span id="ho_gb_005" class="font-medium-4 float-right pt-1"></span></h6>'
                    +             '</div>'
                    +         '</div>'
                    +        '<div class="media-list">'
                    +             '<div class="media-body w-100">'
                    +                 '<h6 class="list-group-item-heading">자료 없는 집계구<span id="ho_gb_999" class="font-medium-4 float-right pt-1"></span></h6>'
                    +             '</div>'
                    +         '</div>'
                    +    '</div>'
                    +'</div>'
                    +'</div>'
                    +'<div class="col-lg-8 col-md-8" col-sm-8">'
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

      case 2:
        $container = $(document.createElement('div')).addClass("row");
        $container.append('<div class="col-lg-6 col-md-6" col-sm-6">'
                      +'<div class="card">'
                      +    '<div class="card-header jobsToggle">'
                      +        '<h4 class="card-title">산업분류별 사업체 수 / 종사자 수</h4>'
                      +    '</div>'
                      +    '<div class="card-content px-4">'
                      +         '<canvas id="jobsChart" class="stchart"></canvas>'
                      +    '</div>'
                      +'</div>'
                      +'</div>'
                      +'<div class="col-lg-6 col-md-6" col-sm-6">'
                      +'<div class="card">'
                      +    '<div class="card-header">'
                      +        '<h4 id="stcs-totalFaily" class="card-title">세대 구성별 가구 / 총 가구 수 : 300</h4>'
                      +    '</div>'
                      +    '<div class="card-content px-4">'
                      +         '<canvas id="houseHoldChart" class="stchart"></canvas>'
                      +    '</div>'
                      +'</div>'
                      +'</div>'
                    );
        break;

        case 3:
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
  // console.log(addiType);
  switch (addiType) {

    case 'initdata':
      $(target).find('#stcs-init-area').text((data[0]*1).toFixed(1));
      $(target).find('#stcs-init-pop').text(data[1]);
      $(target).find('#stcs-init-avr').text(data[2]);

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

    case 'stcsPopdens' :
      if (data.length == 0) {
        break;
      }
      // console.log(data);
      // $container = $(document.createElement('h')).addClass("stcs-initdata-stcsPopdens");
      // $container.append(
      //                    " 인구밀도 : "+data[0]['value']
      // );
      break;

    case 'stcsHouseType' :
      if (data.length == 0) {
        break;
      }
      for (var i = 0; i < data.length; i++) {
        $(target).find('#'+data[i]['item']).text(data[i]['value']);
      }
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
      $(target).find('#stcs-init-tothouse').text(data[0]['value']);
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
            "scales":{
              "yAxes":[
                {"ticks":{"beginAtZero":true}
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
            'options': 'options'
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
        $(target).find('#stcs-totalFaily').text('세대 구성별 가구 / 총 가구 수 : '+data[0]['value']);

        break;

      case 'stcsJobsPop' :
        if (data.length == 0) {
          break;
        }
        console.log(data);
        console.log(name);
        console.log(value);
        new Chart($(target).find('#jobsChart'),{
            'type': 'radar',
            'data': {
                  'labels': name,
                  'datasets': [{
                      'data': value,
                      'backgroundColor': "rgba(255, 99, 132, 0.2)",
            					'borderColor': "rgb(255, 99, 132)",
            					'pointBackgroundColor': 'red',
                  }]
              },
            'options': 'options'
        });
        var temp = '<a onclick="#" style="position:absolute;z-index:1" class="btn btn-sm btn-primary mr-1"><i class="icon-bar-chart"></i></a>';
        $(target).find('.jobsToggle').append(temp);

        break;

      case 'stcsJobsBiz' :
        if (data.length == 0) {
          break;
        }
        // console.log(data);
        // $container = $(document.createElement('h')).addClass("stcs-initdata-stcsJobsBiz");
        // for (var i = 0; i < data.length; i++) {
        //   $container.append(
        //                      "</br>산업 분류별 사업체수 : "+data[i]['name']+" / "+data[i]['value']+" 개"
        //   );
        // }

        break;

    default:
      alert('stcs-additag error')

  }

  // console.log(data);

};
