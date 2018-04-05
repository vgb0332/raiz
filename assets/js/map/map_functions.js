"use strict";

function mainActivity(data){
  console.log(data);
  var landResult = data['land'];
  var buildingResult = data['building'];
  ajax_type = 'toji';
  drawPoly(landResult);
  ajax_type = 'building';
  drawPoly(buildingResult);

}

function silActivity(data){

  var landResult = data['land'];
  var buildingResult = data['building'];
  ajax_type = 'sil-toji';
  drawPoly(landResult);
  ajax_type = 'sil-building';
  drawPoly(buildingResult);

}

function junwalActivity(data){

  var landResult = data['land'];
  var buildingResult = data['building'];
  ajax_type = 'junwal-toji';
  drawPoly(landResult);
  ajax_type = 'junwal-building';
  drawPoly(buildingResult);

}


/*
  drawSinglePoly(param1, param2, param3, ...)
  param: data, points

*/

function drawMarker(data){
  $.each(data, function(index, target){
    var point = parsePoint(target['point']);
    var marker = new daum.maps.Marker({
        position: new daum.maps.LatLng(point[0], point[1])
    });
    marker.setMap(map);
  });
}

function drawPoly(data){

  var testPolygon;
  $.each(data, function(index, target){
      // console.log(target);
      var polygon = target['polygon'];
      var target_polygon = parseShape(polygon);
      var target_data = target;

      $.each(target_polygon, function(i, iv){

          var points = iv.split(', ');
          var polyPath = [];
          var polygon = new daum.maps.Polygon({  });

          $.each(points, function(j, jv){

              var point = jv.split(' ');
              var x = point[0], y = point[1];
              polyPath.push(new daum.maps.LatLng(x, y));

          });
          polygon.setPath(polyPath);
          setPoly(ajax_type, polygon, target_data);
          // // Ghun testing!
          // console.log(polygon);
      });
  });
}

/*
* setWindow(data)
* 라이즈 윈도우 띄우는 함수, 새로운 RAIZ-WINDOW-CONTAINER DOM과 함께 3D CANVAS 생성
*
*
*/

function setRWindow(polygons, data){

  if ( ! Detector.webgl ) {
    toaster('webGL이 필요합니다 익스플로러를 구글 혹은 파이어폭스를 사용해보세요!', 'warning');
    return false;
  }

  var windows = $(document.body).find(".raiz-window-container")
                                .find(".raiz-window-top")
                                .find(".header");

  // RAIZ WINDOW SETUP
  var header = data['ldCodeNm'] + ' ' + data['bun'] + ( (data['ji'] === '') ? '' : ('-' + data['ji']) );

  //check if the same window already exists, if does, just copy and show
  $.each(windows, function(index, value){
    if(value.innerHTML === header){

      var domToCopy = $(value).parent().parent();
      $(document.body).append(domToCopy);
      return;
    }
  });
  var Rwindow = raiz_window(header);
  Rwindow.draggable( "option", "containment", $( "#" +  current_containment ) );
  $(document.body).append(Rwindow);

  var values = {
      sigunguCd : data['sigunguCd'],
      bjdongCd : data['bjdongCd'],
      bun : data['bun'],
      ji : data['ji']
  };

  Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(toji_characteristics(data));

  customAjax($SITE_URL+'get/tojiPossession', values, function(data){
    if(data.length === 0) return false;
    Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(toji_possession(data));
  });

  customAjax($SITE_URL+'get/tojiUsage', values, function(data){
    if(data.length === 0) return false;
    Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(toji_usage(data));
  });

  customAjax($SITE_URL+'get/tojiIndivPrice', values, function(data){
    if(data.length === 0) return false;
    Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(toji_indivPrice(data));
  });

  customAjax($SITE_URL+'get/buildingTitleInfo', values, function(data){
    if(data.length === 0) return false;
    Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(building_titleInfo(data));
  });


  THREE_init(polygons, data, Rwindow);
  Rwindow.show('normal' , function(e) {

    // user info for the first timers
    if(first_window_open){
      $(".raiz-info-icon, .raiz-mouse-control").trigger('mouseover');
      setTimeout(function(){
        $(".raiz-info-icon, .raiz-mouse-control").trigger('mouseout');
      }, 5000);
      first_window_open = false;
    }

  });


}

function setSTCSWindow(polygons, data, type){
  // console.log(data);
  if ( ! Detector.webgl ) alert('webGL needed');

  // RAIZ WINDOW SETUP
  var header = type+' 통계 - '+$('#stat-side-sido').text() + ' ' + $('#stat-side-sgg').text() + ' ' + $('#stat-side-dong').text();

  var stcsAggList = ['stcsTotaljobs','stcsPopdens','stcsHouseType','stcsTotalHouse','stcsHouseSize'
                    ,'stcsHouseHold','stcsTotalFamily','stcsJobsPop','stcsJobsBiz','stcsSexAge','stcsOldind','stcsPopdens','stcsSupportY','stcsSupportO'];

  if (type == '집계구') {
    var code = data[3];
  }
  else if (type == '읍면동') {
    var code = data[0];
    header += ' '+data[1];
  }
  else if (type == '시군구') {
    var code = data[0];
    header += ' '+data[1];
  }


  var STCSwindow = raiz_StcsWindow(header);
  $(document.body).append(STCSwindow);

  // insert3D(STCSwindow, polygon);
  // THREE_init(polygons, data, STCSwindow);

  for (var i = 0; i < 6; i++) {
    STCSwindow.find('.stcs-initdata').append(stcs_initTag(i));
  }

  // testFunc(data,STCSwindow);
  if (type == '집계구') {
    stcs_additag(STCSwindow,data,'initdata',code);
  }
  else if (type == '읍면동') {
    customAjax($SITE_URL+'getStcs/stcsAggrSum', {currHjstcs:code}, function(data){
      stcs_additag(STCSwindow,[data[0]['SHAPE_AREA'],data[0]['TOTAL_POP'],data[0]['MEDIUM_AGE']],'initdata',code);
    });
  }
  else if (type == '시군구') {
    customAjax($SITE_URL+'getStcs/stcsAggrSum', {currHjstcs:code}, function(data){
      stcs_additag(STCSwindow,[data[0]['SHAPE_AREA'],data[0]['TOTAL_POP'],data[0]['MEDIUM_AGE']],'initdata',code);
    });
  }

  // STCSwindow.resize(function(e){
  //   STCSwindow.find('.stcsNlabel').height(STCSwindow.find('#houseSizeChart').height());
  // });
  for (var i = 0; i < stcsAggList.length; i++) {
    (function(i){
      // console.log(stcsAggList[i]);
      customAjax($SITE_URL+'getStcs/'+stcsAggList[i], {currHjstcs:code,type:type}, function(data){
        stcs_additag(STCSwindow,data,stcsAggList[i],data[3]);
      });
    })(i)
  }
  STCSwindow.show('normal');
}

/*
* setPoly(type, polygon, data)
* 타입에 따른 폴리곤의 이벤트 및 셋팅 함수
*
*/

function setPoly(type, polygon, data){
  if(type === 'junwal-toji'){

    polygon.setMap(map);
    var target = polygon.wc;

    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon').addClass('junwal-toji-polygon')
                      .attr('data-sigunguCd' , data['지역코드'])
                      .attr('data-bjdongCd', data['법정동코드'])
                      .attr('data-bunji', data['지번']);
    });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {

      daum.maps.event.preventMap();
      daum.maps.event.trigger(map, trigger_by, mouseEvent);

    });

    daum.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
       var target_dom = $(".raiz-junwal-tab .raiz-side-tab-content li:visible");

       // console.log(target_dom.siblings('.sil-result-item'));

       $.each( target_dom.siblings('.junwal-result-item'), function(index, item) {

         var poly_bunji = $("#" + polygon.wc[0].id).attr('data-bunji');
         var item_bunji = $(item).attr('data-bunji');
         // console.log($(".raiz-side-tab-container").scrollTop(300));
         if( poly_bunji === item_bunji ){

           $(".raiz-side-tab-container").animate({
             scrollTop: $(item).position().top
           }, 500, function(){

             $(item).addClass('list-mouseover');

           });

         }

       });
    });

    daum.maps.event.addListener(polygon, 'mouseout', function(mouseEvent) {

      var target_dom = $(".raiz-junwal-tab .raiz-side-tab-content li:visible");
      target_dom.siblings('.list-mouseover').removeClass('list-mouseover');

    });

    completeOverlay('junwal', data['point'], data);
    junwal_landPolygons.push(polygon);
  }

  if(type === 'junwal-building'){

    polygon.setMap(map);
    var target = polygon.wc;
    var class_name = 'junwal-apt-building-polygon';
    if(currentSilTab === 'apt-junwal'){
      class_name = 'junwal-apt-building-polygon';
    }
    else if(currentSilTab === 'rhouse-junwal'){
      class_name = 'junwal-rhouse-building-polygon';

    }
    else if(currentSilTab === 'store-junwal') {
      class_name = 'junwal-store-building-polygon';
    }

    $.each(target, function(index, path){
      $("#" + path.id)
      .removeAttr('style').addClass('building-polygon').addClass(class_name)
      .attr('name', data['pnu'])
      .attr('data-buildingID',  data['buildingID'])
      .attr('data-sigunguCd' , data['sigunguCd'])
      .attr('data-bjdongCd', data['bjdongCd'])
      .attr('data-bun', data['bun'])
      .attr('data-ji', data['ji'])
      .attr('data-height', data['height']);
    });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      daum.maps.event.preventMap();
      var building_target_name = $("#" + polygon.wc[0].id).attr('name');

      $.each(sil_landPolygons, function(index, polygon){

        $.each(polygon.wc, function(index, polygon_attr){

            var toji_target_id = polygon_attr.id;
            var toji_target_name = $("#" + toji_target_id).attr('name');
            if(toji_target_name === building_target_name ){
              daum.maps.event.trigger(polygon, 'click');
            }
        });

      });
    });

    junwal_buildingPolygons.push(polygon);
  }

  if(type === 'sil-toji'){

    polygon.setMap(map);
    var target = polygon.wc;

    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon')
                      .addClass('sil-toji-polygon')
                      .attr('data-sigunguCd' , data['지역코드'])
                      .attr('data-bjdongCd', data['법정동코드'])
                      .attr('data-bunji', data['지번']);
    });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {

      daum.maps.event.preventMap();
      daum.maps.event.trigger(map, trigger_by, mouseEvent);

    });

    daum.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
       var target_dom = $(".raiz-sil-tab .raiz-side-tab-content li:visible");

       // console.log(target_dom.siblings('.sil-result-item'));

       $.each( target_dom.siblings('.sil-result-item'), function(index, item) {

         var poly_bunji = $("#" + polygon.wc[0].id).attr('data-bunji');
         var item_bunji = $(item).attr('data-bunji');
         // console.log($(".raiz-side-tab-container").scrollTop(300));
         if( poly_bunji === item_bunji ){

           $(".raiz-side-tab-container").animate({
             scrollTop: $(item).position().top
           }, 500, function(){

             $(item).addClass('list-mouseover');

           });

         }

       });
    });

    daum.maps.event.addListener(polygon, 'mouseout', function(mouseEvent) {

      var target_dom = $(".raiz-sil-tab .raiz-side-tab-content li:visible");
      target_dom.siblings('.list-mouseover').removeClass('list-mouseover');

    });

    completeOverlay('sil', data['point'], data);

    sil_landPolygons.push(polygon);
  }

  if(type === 'sil-building'){

    polygon.setMap(map);
    var target = polygon.wc;
    var class_name = 'sil-apt-building-polygon';
    if(currentSilTab === 'apt-sil'){
      class_name = 'sil-apt-building-polygon';
    }
    else if(currentSilTab === 'rhouse-sil'){
      class_name = 'sil-rhouse-building-polygon';

    }
    else if(currentSilTab === 'store-sil') {
      class_name = 'sil-store-building-polygon';
    }
    else if(currentSilTab === 'toji-sil'){
      class_name = 'sil-toji-building-polygon';
    }
    // console.log('here', data);
    $.each(target, function(index, path){
      $("#" + path.id)
      .removeAttr('style').addClass('building-polygon').addClass(class_name)
      .attr('name', data['pnu'])
      .attr('data-buildingID',  data['buildingID'])
      .attr('data-sigunguCd' , data['sigunguCd'])
      .attr('data-bjdongCd', data['bjdongCd'])
      .attr('data-bun', data['bun'])
      .attr('data-ji', data['ji'])
      .attr('data-height', data['height']);
    });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      daum.maps.event.preventMap();
      var building_target_name = $("#" + polygon.wc[0].id).attr('name');

      $.each(sil_landPolygons, function(index, polygon){

        $.each(polygon.wc, function(index, polygon_attr){

            var toji_target_id = polygon_attr.id;
            var toji_target_name = $("#" + toji_target_id).attr('name');
            if(toji_target_name === building_target_name ){
              daum.maps.event.trigger(polygon, 'click');
            }
        });

      });
    });

    sil_buildingPolygons.push(polygon);
  }

  if(type === 'toji'){
    polygon.setMap(map);
    console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon').attr('name', data['pnu']);
    });

    // daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
    //   console.log('polygon mouseover activated! : ' , polygon );
    // });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      console.log('polygon click activated! : ' , polygon );
      var target_id = polygon.wc[0].id;
      var land_target_name = $("#" + target_id).attr('name');

      var polygons = [];
      polygons.push(polygon);
      //find all bulilding polygons that correspond to their toji.
      $.each(buildingPolygons, function(index, polygon){

         $.each(polygon.wc, function(index, polygon_attr){

           var building_target_id = polygon_attr.id;
           var building_target_name = $("#" + building_target_id).attr('name');
           if(building_target_name === land_target_name){
             polygons.push(polygon);
           }

         });

      });

      setRWindow(polygons, data);
    });

    landPolygons.push(polygon);
  }

  if(type ==='building'){

    polygon.setMap(map);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id)
      .removeAttr('style').addClass('building-polygon')
      .attr('name', data['pnu'])
      .attr('data-buildingID',  data['buildingID'])
      .attr('data-sigunguCd' , data['sigunguCd'])
      .attr('data-bjdongCd', data['bjdongCd'])
      .attr('data-bun', data['bun'])
      .attr('data-ji', data['ji'])
      .attr('data-height', data['height']);
    });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      daum.maps.event.preventMap();
      var building_target_name = $("#" + polygon.wc[0].id).attr('name');

      $.each(landPolygons, function(index, polygon){

        $.each(polygon.wc, function(index, polygon_attr){

            var toji_target_id = polygon_attr.id;
            var toji_target_name = $("#" + toji_target_id).attr('name');
            if(toji_target_name === building_target_name ){
              daum.maps.event.trigger(polygon, 'click');
            }
        });

      });
    });

    buildingPolygons.push(polygon);
  }

  if(type === 'stcsSido'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
    // console.log(data);

    stcs_landPolygons.push(polygon);

    polygon.Bb[0] = data['sidoCd'];
    polygon.Bb[1] = data['sidoNm'];


    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon stcs-item');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      // console.log(polygon.Bb);
      beforeNm = polygon.Bb[1];
      getStcsSgg(polygon.Bb[0]);
      $('#stat-side-sido').text(polygon.Bb[1]);
      $('#stat-side-sido').attr("name", polygon.Bb[0]);

      // $('.stcs-item').remove();
      // $('.stcs_label').remove();

    });
  }

  if(type === 'stcsSgg'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);

    stcs_landPolygons.push(polygon);

    polygon.Bb[0] = data['sigunguCd'];
    polygon.Bb[1] = data['sigunguNm'];
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon stcs-item');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      if ($('#stcsToggle').val() == 0) {
        getStcsdong(polygon.Bb[0])
        $('#stat-side-sgg').text(polygon.Bb[1]);
        $('#stat-side-sgg').attr("name", polygon.Bb[0]);

        // $('.stcs-item').remove();
        // $('.stcs_label').remove();
      }
      else {
        setSTCSWindow([polygon],polygon.Bb,"시군구");
      }
    });
  }

  if(type === 'stcsDong'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);

    stcs_landPolygons.push(polygon);

    polygon.Bb[0] = data['dongCd'];
    polygon.Bb[1] = data['dongNm'];
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon stcs-item');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      if ($('#stcsToggle').val() == 0) {
        getStcsaggr(polygon.Bb[0])
        $('#stat-side-dong').text(polygon.Bb[1]);
        $('#stat-side-dong').attr("name", polygon.Bb[0]);

        // $('.stcs-item').remove();
        // $('.stcs_label').remove();
      }
      else {
        setSTCSWindow([polygon],polygon.Bb,"읍면동");
      }
    });
  }
  if(type === 'stcsAggr'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);

    stcs_landPolygons.push(polygon);

    // console.log(polygon);
    polygon.Bb[0] = [
      data['SHAPE_AREA'],
      data['TOTAL_POP'],
      data['MEDIUM_AGE'],
      data['TOT_REG_CD']
    ];

    // var target = polygon.wc;
    // $.each(target, function(index, path){
    //   $("#" + path.id).removeAttr('style').addClass('stcs-polygon');
    // });

    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon stcs-item').attr('name', data['TOT_REG_CD']);
    });

    var customOverlay = new daum.maps.CustomOverlay({});
    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );

      customOverlay.setContent('<div class="stcs_ol">면적 : ' + polygon.Bb[0][0] + ' m<sup>2</sup></br>총 인구 : ' + polygon.Bb[0][1] + ' 명</br>평균 연령 : ' + polygon.Bb[0][2] + ' 세</div>');
      customOverlay.setPosition(mouseEvent.latLng);
      customOverlay.setMap(map);
    });
    daum.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
      customOverlay.setPosition(mouseEvent.latLng);
    });
    daum.maps.event.addListener(polygon, 'mouseout', function() {
      customOverlay.setMap(null);
    });
    daum.maps.event.addListener(polygon, 'click', function(mouseEvent) {

      setSTCSWindow([polygon], polygon.Bb[0],"집계구");
      // console.log(aggr_poly);
      // $('.stcs-polygon').remove();
      // $('.stcs_ol').remove();

    });
  }

  if(type === 'youdong'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);

    stcs_landPolygons.push(polygon);

    polygon.Bb[0] = data['sigunguCd'];
    polygon.Bb[1] = data['sigunguNm'];
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon stcs-item');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      removeStcsPolygon();
      removeStcsLabel();
      customAjax($SITE_URL+'getStcs/youdongPoint',{sggcode:polygon.Bb[0]},setYoudongCircle);
      // console.log(polygon.Bb[0].substring(2,4));
      //
      // customAjax($SITE_URL+'getStcs/youdongValue',{code:polygon.Bb[0]},youdongProcessing);
    });
  }
}

function parseShape(shape){
  // console.log(shape);
  /*    shape : 'polygon( (poly1) , (poly2) , ...)'   */
  // console.log(shape);
  if (shape[0] === 'P') {
    // console.log('hi');
    shape = shape.replace(/,/g, ', ');
    shape = shape.toLowerCase();
  }

  // console.log(shape);
  var shapes = shape.replace('polygon(', '').replace('))' , ')').split('), ');
  $.each(shapes, function(index, value){
    shapes[index] = value.replace('(', '').replace(')', '');
  });

  return shapes;
}

function parsePoint(point){
  point = point.toLowerCase().replace(',',' ');
  var points = point.replace('point(', '').replace(')' , '').split(' ');
  return points;
}

function completeOverlay(type, point, data){
  // console.log(data);
  var customOverlay = new daum.maps.CustomOverlay({});
  var price = price_format_short(data['거래금액']);

  var target_type = type.split('-')[1];
  if(type === 'junwal'){
    var price = data['월세금액'];
    var label_name = '월';
    var label_color = 'blue';
    if(data['월세금액'] === '0'){
      price = data['보증금액'];
      label_name = '전';
      label_color = 'red';
    }
    price = price_format_short(price);
    var label = '<span style=color:'+ label_color + ';>' + label_name + '</span>';
    price = label + price;
  }

  customOverlay.setContent(
                              '<div class="sil-overlay ' + type + '-overlay">'
                              +   '<div class=overlay-header>'
                              +       data['이름'] + '<br>'
                              +   '</div>'
                              +   '<strong>'
                              +       price
                              +   '</strong>'
                              +   '(' + (data['전용면적']*.3025).toFixed(0) + '평)'
                              +     '| '
                              +   '<span class=overlay-info>'
                              +       data['년'].slice(-2) + '-' + data['월']
                              +   '</span>'
                              + '</div>'
                            );

  try{
     var point = parsePoint(data['point']);
  }catch(e){
     return true;
  }
  customOverlay.setPosition(new daum.maps.LatLng(point[0], point[1]));
  customOverlay.setMap(map);

  var mapLevel = map.getLevel();
  var font_size = '12px';
  var header_font_size = '14px';
  if(mapLevel === 2){
    font_size = '10px';
    header_font_size = '12px';
  }
  else if(mapLevel === 3){
    font_size = '7px';
    header_font_size = '9px';
  }
  else if(mapLevel === 4){
    font_size = '4px';
    header_font_size = '6px';
  }

  $(".sil-overlay, .junwal-overlay").css('font-size', font_size);
  $(".overlay-header").css('font-size', header_font_size);

  overlays.push(customOverlay);

}

function removeOverlay(){
  // console.log(overlays);
  $.each(overlays, function(index, overlay){

    overlay.setMap(null);

  });
  overlays = [];
}

function removePolygons(){

  if(junwal_landPolygons.length > 0){
    $.each(junwal_landPolygons, function(index, polygon){
      polygon.setMap(null);
      junwal_landPolygons = [];
    });
  }

  if(junwal_buildingPolygons.length > 0){
    $.each(junwal_buildingPolygons, function(index, polygon){
      polygon.setMap(null);
      junwal_buildingPolygons = [];
    });
  }

  if(sil_landPolygons.length > 0){
    $.each(sil_landPolygons, function(index, polygon){
      polygon.setMap(null);
      sil_landPolygons = [];
    });
  }

  if(sil_buildingPolygons.length > 0 ){
    $.each(sil_buildingPolygons, function(index, polygon){
      polygon.setMap(null);
      sil_buildingPolygons = [];
    });
  }

  if(landPolygons.length > 0){
    $.each(landPolygons, function(index, polygon){
      polygon.setMap(null);
      landPolygons = [];
    });
  }

  if(buildingPolygons.length > 0){
    $.each(buildingPolygons, function(index, polygon){
      polygon.setMap(null);
      buildingPolygons = [];
    });
  }

  if(stcs_landPolygons.length > 0){
    $.each(stcs_landPolygons, function(index, polygon){
      polygon.setMap(null);
      stcs_landPolygons = [];
    });
  }

}
