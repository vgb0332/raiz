"use strict"

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new daum.maps.LatLng(37.498206, 127.027610), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
        disableDoubleClickZoom: true,
    };

var current_containment = 'map';
// var small_map = new daum.maps.Map(document.getElementById('small_map'),
//                 {
//                   center: new daum.maps.LatLng(37.56642102997891, 126.97877971258067), // 지도의 중심좌표
//                   level: 3, // 지도의 확대 레벨
//                   disableDoubleClickZoom: true,
//                 }
//               );

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new daum.maps.Map(mapContainer, mapOption);

var geocoder = new daum.maps.services.Geocoder();

var categoryOverlay = new daum.maps.CustomOverlay({});

// 장소 검색 객체를 생성합니다
var ps = new daum.maps.services.Places(map);

// /둥둥이
function MapWalker(position){

    //커스텀 오버레이에 사용할 map walker 엘리먼트
    var content = document.createElement('div');
    var figure = document.createElement('div');
    var angleBack = document.createElement('div');

    //map walker를 구성하는 각 노드들의 class명을 지정 - style셋팅을 위해 필요
    content.className = 'MapWalker';
    figure.className = 'figure';
    angleBack.className = 'angleBack';

    content.appendChild(angleBack);
    content.appendChild(figure);

    //커스텀 오버레이 객체를 사용하여, map walker 아이콘을 생성
    var walker = new daum.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1
    });

    this.walker = walker;
    this.content = content;
}

//로드뷰의 pan(좌우 각도)값에 따라 map walker의 백그라운드 이미지를 변경 시키는 함수
//background로 사용할 sprite 이미지에 따라 계산 식은 달라 질 수 있음
MapWalker.prototype.setAngle = function(angle){

    var threshold = 22.5; //이미지가 변화되어야 되는(각도가 변해야되는) 임계 값
    for(var i=0; i<16; i++){ //각도에 따라 변화되는 앵글 이미지의 수가 16개
        if(angle > (threshold * i) && angle < (threshold * (i + 1))){
            //각도(pan)에 따라 아이콘의 class명을 변경
            var className = 'm' + i;
            this.content.className = this.content.className.split(' ')[0];
            this.content.className += (' ' + className);
            break;
        }
    }
};

//map walker의 위치를 변경시키는 함수
MapWalker.prototype.setPosition = function(position){
    this.walker.setPosition(position);
};

//map walker를 지도위에 올리는 함수
MapWalker.prototype.setMap = function(map){
    this.walker.setMap(map);
};


var mapWalker = new MapWalker();

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

var first_polygon_click = true;
var first_window_open = true;

var currentCode;
var currentAddress;
var currentSilTab;
var needSilRefresh = true;
var sil_currentCode;
var sil_ajax;

var currentJunwalTab;
var needJunwalRefresh = true;
var junwal_currentCode;
var junwal_ajax;

var landPolygons = []; //토지 폴리곤
var buildingPolygons = []; //건물 폴리곤
var sil_landPolygons = []; //실토지 폴리곤
var sil_buildingPolygons = []; //실건물 폴리곤
var junwal_landPolygons = []; //전월세토지 폴리곤
var junwal_buildingPolygons = []; //전월세건물 폴리곤
var stcs_landPolygons = []; //통계 지역 폴리곤

var overlays = [];

var zoom_start, zoom_end;

var drawingFlag = false; // 선이 그려지고 있는 상태를 가지고 있을 변수입니다
var moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다
var clickLine // 마우스로 클릭한 좌표로 그려질 선 객체입니다
var distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
var dots = {}; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.

var search_result = function(type, data){
  console.log(type, data);
  if(type === 'jibun'){
    var $container = $(document.createElement('li'));
    $container.append(  "<h5 class='place_name'>"
                      +   data['address']['address_name'] + ' (' + data['address']['zip_code'] + ')'
                      + "</h5>"
                      + "<h6 class='address_name'>"
                      +   "도로명: " + (data['road_address'] == null ? '-' : data['road_address'])
                      + "</h6>"
                      );

    $container.attr('data-id', data['id']);
    $container.attr('data-x', data['x']);
    $container.attr('data-y', data['y']);
    $container.on('click', function(e) {

        map.panTo(new daum.maps.LatLng(data['y'], data['x']));

    });
  }
  if(type === 'keyword'){
    var $container = $(document.createElement('li'));
    $container.append(  "<h4 class='place_name'>"
                      +   data['place_name']
                      + "</h4>"
                      + "<h5 class='road_address_name'>"
                      +   data['road_address_name']
                      + "</h5>"
                      + "<h6 class='address_name'>"
                      +   "지번: " + data['address_name']
                      + "</h6>"
                      + "<h6 class='phone'>"
                      +   data['phone']
                      + "</h6>"
                      );

    $container.attr('data-id', data['id']);
    $container.attr('data-x', data['x']);
    $container.attr('data-y', data['y']);
    $container.on('click', function(e) {

        map.panTo(new daum.maps.LatLng(data['y'], data['x']));

    });
  }

  $container.removeAttr('style');
  return $container;
};

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
                    // +           "<img alt='mouse left click' width=40 height=40 src='./assets/img/mouse-double-click.png' title='mouse_left_click'>"
                    +         "</div>"
                    +         "<div class=raiz-mouse-control-text>"
                    +            "<p> 회전 </p>"
                    +            "<p> 이동 </p>"
                    +            "<p> 확대/축소 </p>"
                    // +            "<p> 초기화 </p>"
                    +         "</div>"
                    +     "</div>"

                    +     "<div class='raiz-info-icon raiz-reset'>"
                    +       "<span class='ti-reload'></span>"
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
  $container.find('.raiz-window-body').append(paticBiz_info_icon($container));


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
    Rwindow.find('.biz-info').hide();

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
    Rwindow.find('.biz-info').hide();
    Rwindow.find('.building-info').fadeIn();
  });

  return $container;
};

var paticBiz_info_icon = function(Rwindow){
  var $container = $(document.createElement('div'))
                  .addClass("raiz-info-icon")
                  .addClass("biz-info-icon")
                  .addClass("ti-layers");

  $container.tooltip({
    'animation': true,
    'title' : '상권정보',
    'placement' : 'left'
  });

  $container.on("mouseover", function(e){
    $(this).tooltip();
  });

  $container.on("click", function(e){
    var title = '상권정보';
    Rwindow.find(".raiz-window-info")
          .find(".raiz-window-info-header")
          .find(".raiz-window-info-title")
          .text(title);

    Rwindow.find('.toji-info').hide();
    Rwindow.find('.building-info').hide();
    Rwindow.find('.biz-info').fadeIn();
  });

  return $container;
};

var paticBiz_info = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("biz-titleInfo")
                  .addClass("biz-info")
                  .css('display', 'none');

  $container.append(
                      "<div class='biz-titleInfo-header' sytle='display:none;'>"
                    // +   '표제부  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='biz-titleInfo-body'>"
                    + "</div>"
                  );

  var data_key = Object.keys(data[0]);

  let flr = [];

  for (var i = 0; i < data.length; i++) {
    flr.push(data[i]['층정보']);
  }

  flr = flr.slice().sort(function(a,b){return a - b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);

  var inhtml = '<div class="btn-group-vertical" role="group" aria-label="Vertical button group">';

  // inhtml += '<button type="button" class="btn btn-amber ml-0">Button</button>';
  // +  '<button type="button" class="btn btn-amber">Button</button>'
  // +  '<button type="button" class="btn btn-amber">Button</button>'
  // +  '<button type="button" class="btn btn-amber">Button</button>'
  // +  '<button type="button" class="btn btn-amber">Button</button>'
  // +  '<button type="button" class="btn btn-amber">Button</button>'
  // +'</div>');

  for (var i = flr.length-1; i >= 0; i--) {
    inhtml += '<button type="button" class="btn btn-indigo  ml-0">'+flr[i]+'층</button>';
  }
  inhtml += '</div>';
  $container.find(".biz-titleInfo-body").append(inhtml);

  return $container;

}

var building_titleInfo = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("building-titleInfo")
                  .addClass("building-info")
                  .css('display', 'none');

  $container.append(
                      "<div class='building-titleInfo-header' sytle='display:none;'>"
                    // +   '표제부  ' + "<span class='ti-angle-down'></span>"
                    + "</div>"
                    + "<div class='building-titleInfo-body'>"
                    + "</div>"
                  );

  var data_attr = [ "bldNm", "mainPurpsCdNm","etcPurps",
                    "strctCdNm", "archArea", "totArea",
                    "bcRat", "vlRat", "useAprDay"
                  ];

  var data_index = [ "건물이름", "주용도", "기타용도",
                    "구조",    "건축면적", "연면적",
                    "건폐율",  "용적률",   "사용승인일"
                   ];


  $.each(data, function(index, value){

    var inside = '';
    for(var i = 0; i < data_attr.length; ++i){

      var value_index = data_index[i];
      var content = value[data_attr[i]];
      if(content === null)        continue;
      if($.isNumeric(content)){

        if(content*1 == 0)         continue;
        if(data_attr[i] === "useAprDay"){
          //날짜
          content = content.substring(0, 4) + '-' + content.substring(4, 6) + '-' + content.substring(6, 8);
        }
        else{
          content = (content*1).toFixed(2) + 'm<sup>2</sup>';
        }
      }

      inside +=       "<p>"
             +              "<strong>" + value_index + "</strong>"
             +              " <span> " + content + "</span>"
             +        "</p>";


    }

    //층별정보 데스네
    inside += "<div class='flrInfo-lookup' data-buildingId=" + value['mgmBldrgstPk'] + ">"
           +      "<div class='flrInfo-header'>"
           +          "층별정보"
           +          "<span class='ti-arrow-down'></span>"
           +      "</div>"
           +      "<div class='flrInfo'>"

           +      "</div>"
           +   "</div>" ;

    if(value['regstrGbCd'] === '2'){
      //집합정보는 전유부 필!
      inside += "<div class='pubInfo-lookup' data-buildingId=" + value['mgmBldrgstPk'] + ">"
             +      "<div class='pubInfo-header'>"
             +          "전유부"
             +          "<span class='ti-arrow-down'></span>"
             +      "</div>"
             +      "<div class='pubInfo'>"

             +      "</div>"
             +   "</div>" ;
    }

    $container.find(".building-titleInfo-body").append(
        "<div href=#building-info-" + index + " class='building-titleInfo-body-title' data-buildingID = " + value['mgmBldrgstPk'] + ">"
      +    ( (value['dongNm'] === null) ? ( ( value['bldNm']=== null ? value['mgmBldrgstPk'].split('-')[0] + '-' : value['bldNm'] ) + value['mgmBldrgstPk'].split('-')[1] ) : value['dongNm']  )
      +    "<span class='ti-angle-double-down'></span>"
      + "</div>"
      + "<div id=building-info-" + index + " class='building-titleInfo-body-info' style='display:none;'>"
      +     inside
      + "</div>"
    );

    var values = {
      'type' : 'brFlrInfo',
      'sigunguCd' : value['sigunguCd'],
      'bjdongCd' : value['bjdongCd'],
      'bun' : value['bun'],
      'ji' : value['ji'],
      'buildingID' : value['mgmBldrgstPk'],
    };

    $container.find(".pubInfo-lookup[data-buildingId="+ value['mgmBldrgstPk'] + "]").find('.pubInfo-header').on('click', function(e){

        var currentDom = $(this);
        if(!currentDom.parent().find(".pubInfo").is(":visible")){

          currentDom.find('span').removeClass('ti-arrow-down').addClass('ti-arrow-up');

        }
        else{

          currentDom.find('span').removeClass('ti-arrow-up').addClass('ti-arrow-down');

        }
        currentDom.parent().find(".pubInfo").toggle('fast', 'linear');

        if(currentDom.parent().find(".pubInfo div").length < 1){
          values.type = 'brPubInfo';
          values.dongNm = value['dongNm'];
          console.log(values);
          customAjax($SITE_URL+'get/buildingPubInfo', values, function(data){

            if(data.length <= 0){
              currentDom.parent().find(".pubInfo").append($('<div>', {'text': '정보없음'}));
              return;
            }
            data.sort(
              function(a, b){
                if(a['flrGbCd'] == '10'){
                  return b['flrGbCd'] - a['flrGbCd'] || a['flrNo'] - b['flrNo'];
                }
                else{
                  return b['flrGbCd'] - a['flrGbCd'] || b['flrNo'] - a['flrNo'];
                }
              }
            );

            currentDom.parent().find(".pubInfo").append($('<div>', {'text': '3D랑 같이 보기', 'class' : 'flr3d'}));

            $.each(data, function(index, value){

                  // var info = document.createElement('div', { style : 'border-bottom: 1px solid #333'});
                  var info = $('<div>').css('border-bottom', '1px solid #333');
                  var meter = $('<sup>', {'text' : '2'});

                  info.append($('<p>')
                      .append($('<strong>', {'text' : '호'}))
                      .append($('<span>', {'text' : value['hoNm']} ))
                      .css({'text-align' : 'left', 'margin' : '0'}));

                  info.append($('<p>')
                      .append($('<strong>', {'text' : '면적'}))
                      .append($('<span>', {'text' : (value['area']*1).toFixed(2)+'m' }).append(meter))
                      .css( {'text-align' : 'left', 'margin' : '0'} ));


                  info.append($('<p>')
                      .append($('<strong>', {'text' : '주/부속'}))
                      .append($('<span>', {'text' : value['mainAtchGbCdNm']} ))
                      .css({'text-align' : 'left', 'margin' : '0'}));

                  info.append($('<p>')
                      .append($('<strong>', {'text' : '전용/공유'}))
                      .append($('<span>', {'text' : value['exposPubuseGbCdNm']} ))
                      .css({'text-align' : 'left', 'margin' : '0'}));

                  info.append($('<p>')
                      .append($('<strong>', {'text' : '구조'}))
                      .append($('<span>', {'text' : value['strctCdNm']} ))
                      .css({'text-align' : 'left', 'margin' : '0'}));


                  var checkDup = false;
                  currentDom.parent().find(".pubInfo div").each(function(e){

                    var flrGbCd = $(this).attr('data-flrGbCd');
                    var flrNo = $(this).attr('data-flrNo');

                    if(value['flrGbCd'] === flrGbCd && value['flrNo'] === flrNo){
                        var target = $(this).siblings(  "[data-flrGbcd=" + flrGbCd + "][data-flrNo=" + flrNo + "]");
                        target.append(info);
                        checkDup = true;
                        return false;
                    };
                  });
                  if(!checkDup){
                    var color = '#54ff9f';
                    //지하는 블랙, 옥탑은 파랑색, 보통은 노랑색
                    if(value['flrGbCd'] === '10'){
                      color = '#8b8b83';
                    }
                    else if((value['flrGbCd']) === '30'){
                      color = '#c9e1ff';
                    }

                    currentDom.parent().find(".pubInfo")
                    .append($('<div>', {
                        'class' : 'flr',
                        'data-flrGbCd': value['flrGbCd'],
                        'data-flrNo': value['flrNo'],
                        'text': value['flrNo'].replace(/층/g,'').replace(/지/g,'B') + '층'
                    })
                    .on('click', function(e){
                      e.preventDefault();
                      var flrGbCd = $(e.target).attr('data-flrGbCd');
                      var flrNo = $(e.target).attr('data-flrNo');

                      $(e.target).siblings(
                        "[data-flrGbcd=" + flrGbCd + "][data-flrNo=" + flrNo + "]"
                      ).toggle('fast', 'linear');
                    })
                    .css('background-color', color)
                    .tooltip({
                        'animation': true,
                        'title' :  value['hoNm'],
                        'placement' : 'right'
                    }))

                    .append($('<div>', {
                        'id' : value['mgmBldrgstPk']+'-'+value['flrGbCd']+'-'+value['flrNo'],
                        'data-flrGbCd': value['flrGbCd'],
                        'data-flrNo': value['flrNo'],
                      }).css({ 'width' : '100%', 'display' : 'none' })
                      .append(    info   )
                    );

                    currentDom.parent().find(".flrInfo").toggle('fast', 'linear');
                  }
                  else{

                    currentDom.parent().find(".flrInfo").toggle('fast', 'linear');

                  }

            });

            console.log(data);
          });

        }

    });

    $container.find(".flrInfo-lookup[data-buildingId="+ value['mgmBldrgstPk'] + "]").find('.flrInfo-header').on('click', function(e){
        var currentDom = $(this);
        if(!currentDom.parent().find(".flrInfo").is(":visible")){

          currentDom.find('span').removeClass('ti-arrow-down').addClass('ti-arrow-up');

        }
        else{

          currentDom.find('span').removeClass('ti-arrow-up').addClass('ti-arrow-down');

        }


        if(currentDom.parent().find(".flrInfo div").length < 1){

          customAjax($SITE_URL+'get/buildingFlrInfo', values, function(data){
              var t0 = performance.now();
              if(data.length <= 0){
                currentDom.parent().find(".flrInfo").append($('<div>', {'text': '정보없음'}));
                return;
              }
              data.sort(
                function(a, b){
                  if(a['flrGbCd'] == '10'){
                    return b['flrGbCd'] - a['flrGbCd'] || a['flrNo'] - b['flrNo'];
                  }
                  else{
                    return b['flrGbCd'] - a['flrGbCd'] || b['flrNo'] - a['flrNo'];
                  }
                }
              );

              currentDom.parent().find(".flrInfo").append($('<div>', {'text': '3D랑 같이 보기', 'class' : 'flr3d'}));

              $.each(data, function(index, value){

                var info = $('<div>').css('border-bottom', '1px solid #333');
                // info.append($('<p>')
                //           .append($('<strong>', {'text' : '동명'}))
                //           .append($('<span>', {'text' : value['dongNm']} )));
                var meter = $('<sup>', {'text' : '2'});

                info.append($('<p>')
                    .append($('<strong>', {'text' : '면적'}))
                    .append($('<span>', {'text' : value['area']+'m' }).append(meter))
                    .css( {'text-align' : 'left', 'margin' : '0'} ));


                info.append($('<p>')
                    .append($('<strong>', {'text' : '구조'}))
                    .append($('<span>', {'text' : value['strctCdNm']} ))
                    .css({'text-align' : 'left', 'margin' : '0'}));

                var checkDup = false;
                currentDom.parent().find(".flrInfo div").each(function(e){

                  var flrGbCd = $(this).attr('data-flrGbCd');
                  var flrNo = $(this).attr('data-flrNo');
                  if(value['flrGbCd'] === flrGbCd && value['flrNo'] === flrNo){
                    var target = $(this).siblings(  "[data-flrGbcd=" + flrGbCd + "][data-flrNo=" + flrNo + "]");
                    target.append(info);
                    checkDup = true;
                    return false;
                  };
                });

                if(!checkDup){
                  var color = '#54ff9f';
                  //지하는 블랙, 옥탑은 파랑색, 보통은 노랑색
                  if(value['flrGbCd'] === '10'){
                    color = '#8b8b83';
                  }
                  else if((value['flrGbCd']) === '30'){
                    color = '#c9e1ff';
                  }

                  currentDom.parent().find(".flrInfo")
                  .append($('<div>', {
                      'class' : 'flr',
                      'data-flrGbCd': value['flrGbCd'],
                      'data-flrNo': value['flrNo'],
                      'text': value['flrNoNm'].replace(/층/g,'').replace(/지/g,'B') + '층'
                  })
                  .on('click', function(e){
                    e.preventDefault();
                    var flrGbCd = $(e.target).attr('data-flrGbCd');
                    var flrNo = $(e.target).attr('data-flrNo');

                    $(e.target).siblings(
                      "[data-flrGbcd=" + flrGbCd + "][data-flrNo=" + flrNo + "]"
                    ).toggle('fast', 'linear');
                  })
                  .css('background-color', color)
                  .tooltip({
                      'animation': true,
                      'title' :  value['mainPurpsCdNm'],
                      'placement' : 'right'
                  }))

                  .append($('<div>', {
                      'id' : value['mgmBldrgstPk']+'-'+value['flrGbCd']+'-'+value['flrNo'],
                      'data-flrGbCd': value['flrGbCd'],
                      'data-flrNo': value['flrNo'],
                    }).css({ 'width' : '100%', 'display' : 'none' })
                    .append(    info   )
                  );
                }
              });

              currentDom.parent().find(".flrInfo").toggle('fast', 'linear');
              var t1 = performance.now();
              console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
              console.log(data);
          });
        }
        else{
          currentDom.parent().find(".flrInfo").toggle('fast', 'linear');
        }

    });

  });


  $container.find('.building-titleInfo-body-title').on('click', function(e){

    if(!$(this).next().is(":visible")){
      $(this).removeClass('isOpen');
      $(this).find('span').removeClass('ti-angle-double-down').addClass('ti-angle-double-up');
    }
    else{
      $(this).addClass('isOpen');
      $(this).find('span').removeClass('ti-angle-double-up').addClass('ti-angle-double-down');
    }
    $(this).next().toggle('fast', 'linear');
  });

  // $container.find('.building-titleInfo-header').on('click', function(e){
  //
  //   if($container.find('.building-titleInfo-body').is(":visible")){
  //     $container.find('.building-titleInfo-header').find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
  //   }
  //   else{
  //     $container.find('.building-titleInfo-header').find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
  //   }
  //   $container.find('.building-titleInfo-body').toggle('fast', 'linear');
  // });

  return $container;
};

var building_recapTitleInfo = function(data){
  var $container = $(document.createElement('div'))
                  .addClass("building-recapTitleInfo")
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

    inside += "<div class='flrInfo-lookup' data-buildingId=" + value['mgmBldrgstPk'] + ">"
           +       "층별정보 보기&nbsp;"
           +      "<span class='ti-arrow-up'></span>"
           +   "</div>";

    $container.find(".building-recapTitleInfo-body").append(
        "<div class='building-recapTitleInfo-body-title' data-buildingID = " + value['mgmBldrgstPk'] + ">"
      +    ( (value['dongNm'] === null) ? ( value['mainPurpsCdNm'] + ' ' + value['mgmBldrgstPk'].split('-')[1] ) : value['dongNm']  )
      +    "<span class='ti-angle-double-down'></span>"
      + "</div>"
      + "<div class='building-recapTitleInfo-body-info' style='display:none;'>"
      +    inside
      + "</div>"
    );
  });

  $container.find('.building-recapTitleInfo-body-title').on('click', function(e){

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

  var content = $(document.createElement('div')).addClass('toji-characteristics-body-info');
  for(var i = 0; i < index_len; ++i){
    content.append(
        "<p>"
      +    "<strong>" + data_index[i] + "</strong>"
      +    "<span>" + ( (data[data_attr[i]] === undefined) ? 'N/A' : data[data_attr[i]] ) + "</span>"
      + "</p>"
    );
  }

  $container.find('.toji-characteristics-body').append(content);

  $container.find('.toji-characteristics-header').on('click', function(e){

    if($container.find('.toji-characteristics-body').is(":visible")){
      $container.find('ti-angle-up').removeClass('ti-angle-up').addClass('ti-angle-down');
    }
    else{
      $container.find('ti-angle-down').removeClass('ti-angle-down').addClass('ti-angle-up');
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
  var content = $(document.createElement('div')).addClass('toji-possession-body-info');

  $.each(data, function(index, value){

    for(var i = 0; i < index_len; ++i){
      var index = data_index[i]
      var text = value[data_attr[i]];

      if(index === '공시지가'){
        text = price_format(text , '일원') + '원';
      }
      if(index === '토지면적'){

        text = comma( Math.floor(text*1).toFixed(0) ) + '.' + ( (text*1 - Math.floor(text*1)).toFixed(2)*100 )+ 'm<sup>2</sup> (' + comma( (text*0.3025).toFixed(0) ) + '평)';
      }

      content.append(
          "<p>"
        +    "<strong>" + index + "</strong>"
        +    "<span>" + ( (text === undefined) ? 'N/A' : text ) + "</span>"
        + "</p>"

      );
    }

  });

  $container.find('.toji-possession-body').append(content);

  $container.find('.toji-possession-header').on('click', function(e){

    if($container.find('.toji-possession-body').is(":visible")){
      $container.find('ti-angle-up').removeClass('ti-angle-up').addClass('ti-angle-down');
    }
    else{
      $container.find('ti-angle-down').removeClass('ti-angle-down').addClass('ti-angle-up');
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
                          return price_format(value, '일원');
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
