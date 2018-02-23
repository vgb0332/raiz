var beforeNm = '';

function initStcs() {
  console.log('called');
  ajax_type = 'stcsSido';
  $('.stcs-item').remove();
  $('.stcs_label').remove();
  customAjax($SITE_URL+'get/statscSido',0,
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
  customAjax($SITE_URL+'get/statscSgg',{sggcode:sggcode},
            processStcs);
}

function getStcsdong(dongcode) {
  ajax_type = 'stcsDong';
  currHjstcs = dongcode;
  customAjax($SITE_URL+'get/statscDong',{dongcode:dongcode},
            processStcs);
}

function getStcsaggr(aggrcode) {
  ajax_type = 'stcsAggr';
  currHjstcs = aggrcode;
  customAjax($SITE_URL+'get/statscAggr',{aggrcode:aggrcode},
            drawPoly);
}

function getStcsOldind() {
  ajax_type = 'stcsOldind';
  customAjax($SITE_URL+'get/stcsOldind',{currHjstcs:currHjstcs},
            setOldindPoly);
}

function getStcsPopdens() {
  ajax_type = 'stcsPopdens';
  customAjax($SITE_URL+'get/stcsPopdens',{currHjstcs:currHjstcs},
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
        if (30 >= val) {
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
                    +  "<div class='raiz-window-body'>"
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
  switch (addiType) {

    case 'initdata':
      $container = $(document.createElement('div')).addClass("stcs-initdata").css('display', 'block');
      $container.css('color','black');
      $container.css('margin-top','15px');
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

    case 'totaljobs' :
      if (data.length == 0) {
        break;
      }
      console.log(data);
      $container = $(document.createElement('h')).addClass("stcs-initdata-totaljobs");
      $container.append(
                         " 총괄사업체수 : "+data[0]['value']
      );
      break;

    case 'popdens' :
      if (data.length == 0) {
        break;
      }
      console.log(data);
      $container = $(document.createElement('h')).addClass("stcs-initdata-popdens");
      $container.append(
                         " 인구밀도 : "+data[0]['value']
      );
      break;

    default:
      alert('stcs-additag error')

  }

  // console.log(data);
  return $container;
};
