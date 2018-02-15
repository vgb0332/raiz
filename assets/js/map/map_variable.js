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
  // $container.append(`
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
  lifeToWindow($container);
  $container.removeAttr('style');
  return $container;
}

var toji_possession = function(data){
  var $container = $(document.createElement('div')).addClass("toji-possession").css('display', 'none');
  $container.append(
                      "<div class='toji-possession-header'>"
                    +   '토지특성정보  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='toji-possession-body' style='display:none;'>"
                    + "</div>"
                    + "<div class='toji-possession-footer' style='display:none;'>"
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
  var content = $(document.createElement('div')).addClass('toji-possession-table');
  for(var i = 0; i < index_len; ++i){
    content.append(
        "<div>" + data_index[i] + "</div>"
      + "<div>" + ( (data[0][data_attr[i]] === undefined) ? '-' : data[0][data_attr[i]] ) + "</div>"
    );
  }

  $container.find('.toji-possession-body').append(content);

  $container.find('.toji-possession-header').on('click', function(){
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
