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
  console.log(code.length);
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
    console.log(r,g,b);
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
        console.log(r,g,b);
        $("#" + aggr_poly[i].wc[0].id).css("fill", "rgb("+r+","+g+","+b+")")
        break;
      }

    }
  }
}


var raiz_StcsWindow = function(title){
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
                    +  "<div class='raiz-window-body stcs'>"
                    +   "<div class='stcs-window-title'>"
                    +   "</div>"
                    +  "</div>"
                    +  "<div class='raiz-window-footer'></div>"
                  );
  lifeToWindow($container);
  $container.removeAttr('style');
  return $container;
}

var stcs_additag = function(data,addiType){
  var $container;
  console.log(addiType);
  switch (addiType) {

    case 'initdata':
      $container = $(document.createElement('div')).addClass("stcs-initdata").css('display', 'block');
      $container.css('color','black');
      $container.css('padding-top','15px');
      $container.css('padding-bottom','15px');
      $container.append(
                          "<h class='stcs-initdata-area'>"
                        + "면적 : "+data[0]
                        + "</h>"
                        +  "<h class='stcs-initdata-pop'>"
                        + " 총 인구 : "+data[1]
                        + "</h>"
                        +  "<h class='stcs-initdata-age'>"
                        + " 평균 나이 : "+data[2]
                        + "</h>"
      );
      break;

    case 'stcsTotaljobs' :
      if (data.length == 0) {
        break;
      }
      console.log(data);
      $container = $(document.createElement('h')).addClass("stcs-initdata-stcsTotaljobs");
      $container.append(
                         " 총괄사업체수 : "+data[0]['value']
      );
      break;

    case 'stcsPopdens' :
      if (data.length == 0) {
        break;
      }
      console.log(data);
      $container = $(document.createElement('h')).addClass("stcs-initdata-stcsPopdens");
      $container.append(
                         " 인구밀도 : "+data[0]['value']
      );
      break;

    case 'stcsHouseType' :
      if (data.length == 0) {
        break;
      }
      console.log(data);
      $container = $(document.createElement('h')).addClass("stcs-initdata-stcsHouseType");
      for (var i = 0; i < data.length; i++) {
        $container.append(
                           "</br>유형별 주택 : "+data[i]['name']+" / "+data[i]['value']+" 개"
        );
      }

      break;

    case 'stcsTotalHouse' :
      if (data.length == 0) {
        break;
      }
      console.log(data);
      $container = $(document.createElement('h')).addClass("stcs-initdata-stcsTotalHouse");
      $container.append(
                         "</br>총 주택 수 : "+data[0]['value']
      );
      break;

      case 'stcsHouseSize' :
        if (data.length == 0) {
          break;
        }
        console.log(data);
        $container = $(document.createElement('h')).addClass("stcs-initdata-stcsHouseSize");
        for (var i = 0; i < data.length; i++) {
          $container.append(
                             "</br>연건평별 주택 : "+data[i]['name']+" / "+data[i]['value']+" 개"
          );
        }

        break;

      case 'stcsHouseHold' :
        if (data.length == 0) {
          break;
        }
        console.log(data);
        $container = $(document.createElement('h')).addClass("stcs-initdata-stcsHouseHold");
        for (var i = 0; i < data.length; i++) {
          $container.append(
                             "</br>세대구성별 가구 : "+data[i]['name']+" / "+data[i]['value']+" 세대"
          );
        }

        break;

      case 'stcsTotalFamily' :
        if (data.length == 0) {
          break;
        }
        console.log(data);
        $container = $(document.createElement('h')).addClass("stcs-initdata-stcsTotalFamily");
        for (var i = 0; i < data.length; i++) {
          $container.append(
                             "</br>가구 총괄 : "+data[i]['name']+" / "+data[i]['value']+" 세대"
          );
        }

        break;

      case 'stcsJobsPop' :
        if (data.length == 0) {
          break;
        }
        console.log(data);
        $container = $(document.createElement('h')).addClass("stcs-initdata-stcsJobsPop");
        for (var i = 0; i < data.length; i++) {
          $container.append(
                             "</br>산업 분류별 종사자수 : "+data[i]['name']+" / "+data[i]['value']+" 명"
          );
        }

        break;

      case 'stcsJobsBiz' :
        if (data.length == 0) {
          break;
        }
        console.log(data);
        $container = $(document.createElement('h')).addClass("stcs-initdata-stcsJobsBiz");
        for (var i = 0; i < data.length; i++) {
          $container.append(
                             "</br>산업 분류별 사업체수 : "+data[i]['name']+" / "+data[i]['value']+" 개"
          );
        }

        break;

    default:
      alert('stcs-additag error')

  }

  // console.log(data);
  return $container;
};
