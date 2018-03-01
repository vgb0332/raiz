"use strict"

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new daum.maps.LatLng(37.56642102997891, 126.97877971258067), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
        disableDoubleClickZoom: true,
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new daum.maps.Map(mapContainer, mapOption);

var geocoder = new daum.maps.services.Geocoder();

var categoryOverlay = new daum.maps.CustomOverlay({});

/*
  ajax_type => DB에서 데이터를 요청할 때, 타입을 지정해주어 폴리곤의 형태를 정한다.
            => toji : 토지
            => building : 건물
            => toji_sil : 토지 실거래
  ** 각 타입에 맞는 폴리곤도 지정해주세요
  ** Default: 'toji'
*/
var ajax_type = 'toji';
var currHjstcs = '';
var aggr_poly = [];

var raiz_window = function(title){
  var $container = $(document.createElement('div')).addClass("raiz-window-container");
  // $container.append(
  //                    `
  //                     <div class="raiz-window-top">
  //                       <div class="column controller">
  //                         <span class="ti-minus point-cursor"></span>
  //                         <span class="ti-layers point-cursor"></span>
  //                         <span class="ti-close point-cursor"></span>
  //                       </div>
  //                       <div class="column header">${title}</div>
  //                     </div>
  //                     <div class="raiz-window-body">
  //
  //                     </div>
  //                     <div class="raiz-window-footer"></div>
  //                   `
  //                 );
  $container.append("<div class='raiz-window-top'>"
                    +  "<div class='column controller'>"
                    +     "<span class='ti-minus point-cursor'></span>"
                    +      "<span class='ti-layers point-cursor'></span>"
                    +      "<span class='ti-close point-cursor'></span>"
                    +   "</div>"
                    +   "<div class='column header'>" + title + "</div>"
                    +  "</div>"
                    +  "<div class='raiz-window-body'>"
                    +     "<div class='raiz-mouse-control'>"
                    +       "<span class='ti-mouse-alt'></span>"
                    +     "</div>"
                    +     "<div class='raiz-mouse-control-info'>"
                    +         "<div class='raiz-mouse-control-img'>"
                    +           "<img alt='mouse left click' width=40 height=40 src='./assets/img/mouse-left-click.png' title='mouse_left_click'>"
                    +           "<img alt='mouse left click' width=40 height=40 src='./assets/img/mouse-right-click.png' title='mouse_left_click'>"
                    +           "<img alt='mouse left click' width=40 height=40 src='./assets/img/mouse-scroll.png' title='mouse_left_click'>"
                    +           "<img alt='mouse left click' width=40 height=40 src='./assets/img/mouse-double-click.png' title='mouse_left_click'>"
                    +         "</div>"
                    +         "<div class=raiz-mouse-control-text>"
                    +            "<p> 회전 </p>"
                    +            "<p> 이동 </p>"
                    +            "<p> 확대/축소 </p>"
                    +            "<p> 초기화 </p>"
                    +         "</div>"
                    +     "</div>"

                    +     "<div class='raiz-compass'>"
                    +       "<span>" + "N" + "</span>"
                    +       "<span>" + "E" + "</span>"
                    +       "<span>" + "S" + "</span>"
                    +       "<span>" + "W" + "</span>"
                    +       "<div class='raiz-compass-pointer'></div>"
                    +     "</div>"
                    +  "</div>"
                    +  "<div class='raiz-window-footer'></div>"
                  );

  $container.find('.raiz-window-body').append(raiz_window_info($container));
  $container.find('.raiz-window-body').append(toji_info_icon($container));
  $container.find('.raiz-window-body').append(building_info_icon($container));
  lifeToWindow($container);
  $container.trigger('resize');
  $container.removeAttr('style');
  return $container;
}

var raiz_window_info = function(Rwindow){
  var $container = $(document.createElement('div'))
                    .addClass("raiz-window-info");

  var $header = $(document.createElement('div'))
                    .addClass("raiz-window-info-header");

  $header.append(
                    $(document.createElement('span'))
                    .addClass("ti-arrow-circle-right")
                    .addClass("raiz-window-info-return")
                )
         .append(
                    $(document.createElement('div'))
                    .addClass("raiz-window-info-title")

                );

  var $body = $(document.createElement('div'))
                    .addClass("raiz-window-info-body");

  $container.append($header);
  $container.append($body);

  return $container;
}

var toji_info_icon = function(Rwindow){
  var $container = $(document.createElement('div'))
                  .addClass("raiz-info-icon")
                  .addClass("toji-info-icon")
                  .addClass("ti-layout");

  $container.tooltip({
    'animation': true,
    'title' : '토지정보',
    'placement' : 'left'
  });

  $container.on("mouseover", function(e){
    $(this).tooltip();
  });

  $container.on("click", function(e){
    var title = '토지정보';
    Rwindow.find(".raiz-window-info")
          .find(".raiz-window-info-header")
          .find(".raiz-window-info-title")
          .text(title);

    Rwindow.find('.toji-info').fadeIn();
    Rwindow.find('.building-info').hide();

  });

  return $container;
};

var building_info_icon = function(Rwindow){
  var $container = $(document.createElement('div'))
                  .addClass("raiz-info-icon")
                  .addClass("building-info-icon")
                  .addClass("ti-layout-column3-alt");

  $container.tooltip({
    'animation': true,
    'title' : '건물정보',
    'placement' : 'left'
  });

  $container.on("mouseover", function(e){
    $(this).tooltip();
  });

  $container.on("click", function(e){
    var title = '건물정보';
    Rwindow.find(".raiz-window-info")
          .find(".raiz-window-info-header")
          .find(".raiz-window-info-title")
          .text(title);

    Rwindow.find('.toji-info').hide();
    Rwindow.find('.building-info').fadeIn();
  });

  return $container;
};

var building_titleInfo = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("building-titleInfo")
                  .addClass("building-info")
                  .css('display', 'none');

  $container.append(
                      "<div class='building-titleInfo-header'>"
                    +   '표제부  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='building-titleInfo-body' style='display:none;'>"
                    + "</div>"
                    + "<div class='building-titleInfo-footer' style='display:none;'>"
                    + "</div>"
                  );

  var data_attr = [ "bldNm", "mainPurpsCdNm", "heit", "strctCdNm",
                    "hoCnt", "archArea", "fmlyCnt", "totArea",
                    "hhldCnt", "bcRat", "etcPurps", "vlRat", "engrGrade",
                    "gnBldGrade", "pmsDay", "useAprDay"
                  ];

  var data_index = [ "건물명", "주용도명", "높이", "구조명",
                    "호수" , "건축면적", "가구수","연면적",
                    "세대수", "건폐율", "기타용도", "용적률",
                    "에너지효율등급", "친환경건축물등급", "허가일", "사용승인일"
                  ];


  $.each(data, function(index, value){

    var inside = '';
    for(var i = 0; i < data_attr.length; ++i){
      inside +=     "<div>" + data_index[i] + "</div>"
             +       "<div>" + ( (value[data_attr[i]] === undefined) ? '-' : value[data_attr[i]] ) + "</div>"
    }
    $container.find(".building-titleInfo-body").append(
        "<div class = 'building-titleInfo-body-title' data-buildingID = " + value['mgmBldrgstPk'] + ">"
      +    ( (value['mgmBldrgstPk'] === '') ? 'UNKNOWN' : value['mgmBldrgstPk'] )
      +    "<span class='ti-angle-double-down'></span>"
      + "</div>"
      + "<div class='building-titleInfo-body-info' style='display:none;'>"
      +    inside
      + "</div>"
    );
  });

  $container.find('.building-titleInfo-body-title').on('click', function(e){
    var clickedDiv = $(this);
    if(!$(this).next().is(":visible")){
      $(this).find('span').removeClass('ti-angle-double-down').addClass('ti-angle-double-up');
    }
    else{
      $(this).find('span').removeClass('ti-angle-double-up').addClass('ti-angle-double-down');
    }
    $(this).next().toggle('fast', 'linear');
  });

  $container.find('.building-titleInfo-header').on('click', function(e){

    if($container.find('.building-titleInfo-body').is(":visible")){
      $container.find('.building-titleInfo-header').find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
    }
    else{
      $container.find('.building-titleInfo-header').find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    }
    $container.find('.building-titleInfo-body').toggle('fast', 'linear');
  });

  return $container;
};

var building_recapTitleInfo = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("building_recapTitleInfo")
                  .addClass("building-info")
                  .css('display', 'none');

  $container.append(
                      "<div class='building-recapTitleInfo-header'>"
                    +   '총괄표제부  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='building-recapTitleInfo-body' style='display:none;'>"
                    + "</div>"
                    + "<div class='building-recapTitleInfo-footer' style='display:none;'>"
                    + "</div>"
                  );

  var data_attr = [ "bldNm", "platArea", "mainPurpsCdNm", "archArea",
                      "mainBldCnt", "totArea", "atchBldCnt", "vlRatEstmTotArea",
                      "hoCnt", "bcRat", "totPkngCnt", "vlRat", "bylotCnt",
                      "gnBldGrade", "pmsDay", "useAprDay"
                      ];

  var data_index = ["건물명", "대지면적", "주용도명", "건축면적",
                    "주건축물수", "연면적", "부속건축물수", "용적률산정연면적",
                    "총호수", "건폐율", "총주차대수", "용적률",
                    "에너지효율등급", "친환경건축물등급",
                    "외필지수", "사용승인일"
                    ];

  $.each(data, function(index, value){
    var inside = '';
    for(var i = 0; i < data_attr.length; ++i){
      inside +=     "<div>" + data_index[i] + "</div>"
             +       "<div>" + ( (value[data_attr[i]] === undefined) ? '-' : value[data_attr[i]] ) + "</div>"
    }

    $container.find(".building-recapTitleInfo-body").append(
        "<div class='building-recapTitleInfo-body-title' data-buildingID = " + value['mgmBldrgstPk'] + ">"
      +     value['mgmBldrgstPk']
      +    "<span class='ti-angle-double-down'></span>"
      + "</div>"
      + "<div class='building-recapTitleInfo-body-info' style='display:none;'>"
      +    inside
      + "</div>"
    );
  });

  $container.find('.building-recapTitleInfo-body-title').on('click', function(e){
    var clickedDiv = $(this);
    if(!$(this).next().is(":visible")){
      $(this).find('span').removeClass('ti-angle-double-down').addClass('ti-angle-double-up');
    }
    else{
      $(this).find('span').removeClass('ti-angle-double-up').addClass('ti-angle-double-down');
    }
    $(this).next().toggle('fast', 'linear');
  });

  $container.find('.building-recapTitleInfo-header').on('click', function(e){

    if($container.find('.building-recapTitleInfo-body').is(":visible")){
      $container.find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
    }
    else{
      $container.find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    }
    $container.find('.building-recapTitleInfo-body').toggle('fast', 'linear');
  });
  return $container;
};

var toji_characteristics = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("toji-characteristics")
                  .addClass("toji-info")
                  .css('display', 'none');
  $container.append(
                      "<div class='toji-characteristics-header'>"
                    +   '토지특성정보  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='toji-characteristics-body' style='display:none;'>"
                    + "</div>"
                    + "<div class='toji-characteristics-footer' style='display:none;'>"
                    + "</div>"
  );
  console.log(data);

  // var data_index = [
  //   '공유인수', '공시지가', '지목',
  //   '토지면적', '소유구분', '국가기관구분',
  //   '소유권변동원인', '소유권변동일자'
  // ];
  //
  // var data_attr = [
  //   'cnrsPsnCo', 'pblntfPclnd', 'lndcgrCodeNm',
  //   'lndpclAr', 'posesnSeCodeNm', 'nationInsttSeCodeNm',
  //   'ownshipChgCauseCodeNm', 'ownshipChgDe'
  // ];
  var data_index = [
    '용도지역명', '토지이용상황', '지형높이', '지형형상', '도로접면', '데이터기준일자'
  ];

  var data_attr =[
    'prposArea1Nm', 'ladUseSittnNm', 'tpgrphHgCodeNm',
    'tpgrphFrmCodeNm', 'roadSideCodeNm', 'lastUpdtDt'
  ];
  var index_len = data_index.length;
  var content = $(document.createElement('div')).addClass('toji-characteristics-table');
  for(var i = 0; i < index_len; ++i){
    content.append(
        "<div>" + data_index[i] + "</div>"
      + "<div>" + ( (data[data_attr[i]] === undefined) ? '-' : data[data_attr[i]] ) + "</div>"
    );
  }

  $container.find('.toji-characteristics-body').append(content);

  $container.find('.toji-characteristics-header').on('click', function(e){

    if($container.find('.toji-characteristics-body').is(":visible")){
      $container.find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
    }
    else{
      $container.find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    }
    $container.find('.toji-characteristics-body').toggle('fast', 'linear');
  });
  return $container;
};

var toji_possession = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("toji-possession")
                  .addClass("toji-info")
                  .css('display', 'none');
  $container.append(
                      "<div class='toji-possession-header'>"
                    +   '토지소유정보  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='toji-possession-body' style='display:none;'>"
                    + "</div>"
                    + "<div class='toji-possession-footer' style='display:none;'>"
                    + "</div>"
  );
  console.log(data);
  var data_index = [
    '공유인수', '공시지가', '지목',
    '토지면적', '소유구분', '국가기관구분',
    '소유권변동원인', '소유권변동일자'
  ];

  var data_attr = [
    'cnrsPsnCo', 'pblntfPclnd', 'lndcgrCodeNm',
    'lndpclAr', 'posesnSeCodeNm', 'nationInsttSeCodeNm',
    'ownshipChgCauseCodeNm', 'ownshipChgDe'
  ];

  var index_len = data_index.length;
  var content = $(document.createElement('div')).addClass('toji-possession-table');

  $.each(data, function(index, value){

    for(var i = 0; i < index_len; ++i){
      content.append(
          "<div>" + data_index[i] + "</div>"
        + "<div>" + ( (value[data_attr[i]] === undefined) ? '-' : value[data_attr[i]] ) + "</div>"
      );
    }

  });

  $container.find('.toji-possession-body').append(content);

  $container.find('.toji-possession-header').on('click', function(e){

    if($container.find('.toji-possession-body').is(":visible")){
      $container.find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
    }
    else{
      $container.find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    }
    $container.find('.toji-possession-body').toggle('fast', 'linear');
  });
  return $container;
};

var toji_usage = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("toji-usage")
                  .addClass("toji-info")
                  .css('display', 'none');
  $container.append(
                      "<div class='toji-usage-header'>"
                    +   '토지이용계획  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='toji-usage-body' style='display:none;'>"
                    + "</div>"
                    + "<div class='toji-usage-footer' style='display:none;'>"
                    + "</div>"
  );

  var content = $(document.createElement('div')).addClass('toji-usage-table');
  $.each(data, function(index, value){
    var target = value['prposAreaDstrcCodeNm'];
    content.append(
                        "<div>" + target + "</div>"
                  );
  });
   $container.find('.toji-usage-body').prepend(content);

  $container.find('.toji-usage-header').on('click', function(e){

    if($container.find('.toji-usage-body').is(":visible")){
      $container.find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
    }
    else{
      $container.find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    }
    $container.find('.toji-usage-body').toggle('fast', 'linear');
  });
  return $container;
};

var toji_indivPrice = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("toji-indivPrice")
                  .addClass("toji-info")
                  .css('display', 'none');
  $container.append(
                      "<div class='toji-indivPrice-header'>"
                    +   '개별공시지가  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='toji-indivPrice-body' style='display:none;'>"
                    +   "<canvas id='toji-indivPrice-canvas' width=300 height=400></canvas>"
                    + "</div>"
                    + "<div class='toji-indivPrice-footer' style='display:none;'>"
                    + "</div>"
  );

  var content = $(document.createElement('div')).addClass('toji-indivPrice-table');
  var labels = [], values = [];
  $.each(data, function(index, value){
    labels.push(value['pblntfDe'].split('-')[0] + '년');
    values.push(value['pblntfPclnd']);
  });
  console.log(labels, values);
  // var canvas = $container.find("#toji-indivPrice-canvas");
  var ctx = $container.find("#toji-indivPrice-canvas");
  var indivPriceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: '개별공시지가',
            data: values,
            backgroundColor: '#41c980',
            borderColor: '#41c980',
            fill: false,
            borderWidth: 1
        }]
    },
    responsive: true,
    options: {
        legend: {
          display: false
        },
        responsive: true,
        hover: {
          mode: false,
          intersect: false
        },
        tooltips: {
          callbacks: {
               label: function(tooltipItem, data) {
                   return comma(tooltipItem.yLabel) + '원';
               },
           }
        },
        scales: {
            yAxes: [{
              ticks: {
                  fontSize: 12,
                  beginAtZero: false,
                  padding: 0,
                  userCallback: function(value, index, values) {
                      if (value == 0)
                          return "0원";
                      else
                          return comma(value)+'원';
                  }
              }
            }]
        },
        animation: {
          onComplete: function(e){
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
            ctx.fillStyle = this.chart.config.options.defaultFontColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function (dataset) {
              // console.log(dataset);
              var percentage = [];
              for(var i = 1; i < dataset['data'].length; ++i){
                percentage.push( (dataset['data'][i] - dataset['data'][i-1])/dataset['data'][i-1] * 100 );
              }
                var index = Object.keys(dataset['_meta']);
                var points = dataset['_meta'][index]['dataset']['_children'];
                for(var i = 1; i < points.length; ++i){
                  var x = points[i]['_view']['x'];
                  var y = points[i]['_view']['y'];
                  if(percentage[i-1] > 0) {
                    ctx.fillText('+' + percentage[i-1].toFixed(1) + '%', x, y);
                  }
                  else{
                    ctx.fillText(percentage[i-1].toFixed(1) + '%', x, y);
                  }
                }
            });
          }
        }
    }
  });

  $container.find('.toji-indivPrice-header').on('click', function(e){

    if($container.find('.toji-indivPrice-body').is(":visible")){
      $container.find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
    }
    else{
      $container.find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    }
    $container.find('.toji-indivPrice-body').toggle('fast', 'linear');
  });
  return $container;

};
