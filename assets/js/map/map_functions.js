"use strict";
var landPolygons = []; //토지 폴리곤
var buildingPolygons = []; //건물 폴리곤
var sil_landPolygons = []; //실토지 폴리곤
var sil_buildingPolygons = []; //실건물 폴리곤
var stcs_landPolygons = []; //통계 지역 폴리곤

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
  console.log(data);
  var landResult = data['land'];
  var buildingResult = data['building'];
  ajax_type = 'sil-toji';
  drawPoly(landResult);
  ajax_type = 'sil-apt-building';
  drawPoly(buildingResult);
}


/*
  drawSinglePoly(param1, param2, param3, ...)
  param: data, points

*/

function drawPoly(data){

  var testPolygon;
  $.each(data, function(index, target){

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
  console.log(data);
  if ( ! Detector.webgl ) alert('webGL needed');

  var windows = $(document.body).find(".raiz-window-container")
                                .find(".raiz-window-top")
                                .find(".header");

  // RAIZ WINDOW SETUP
  var header = data['ldCodeNm'] + ' ' + data['bun'] + ( (data['ji'] === '') ? '' : ('-' + data['ji']) );

  //check if the same window already exists, if does, just copy and show
  $.each(windows, function(index, value){
    if(value.innerHTML === header){
      console.log('이미있어');
      var domToCopy = $(value).parent().parent();
      $(document.body).append(domToCopy);
      return;
    }
  });
  var Rwindow = raiz_window(header);
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

  // customAjax($SITE_URL+'get/buildingRecapTitleInfo', values, function(data){
  //   if(data.length === 0) return false;
  //   Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(building_recapTitleInfo(data));
  // });

  customAjax($SITE_URL+'get/buildingTitleInfo', values, function(data){
    if(data.length === 0) return false;
    Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(building_titleInfo(data));
  });


  THREE_init(polygons, data, Rwindow);
  Rwindow.show('normal');
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
  if(type === 'sil-toji'){

    polygon.setMap(map);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon').addClass('sil-toji-polygon').attr('name', data['pnu']);
    });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      console.log('polygon click activated! : ' , polygon );
      var target_id = polygon.wc[0].id;
      var land_target_name = $("#" + target_id).attr('name');

      var polygons = [];
      polygons.push(polygon);
      //find all bulilding polygons that correspond to their toji.
      $.each(sil_buildingPolygons, function(index, polygon){

         $.each(polygon.wc, function(index, polygon_attr){

           var building_target_id = polygon_attr.id;
           var building_target_name = $("#" + building_target_id).attr('name');
           if(building_target_name === land_target_name){
             polygons.push(polygon);
           }
         });
      });
      console.log(polygons);
      setRWindow(polygons, data);
    });

    sil_landPolygons.push(polygon);
  }

  if(type === 'sil-apt-building'){

    polygon.setMap(map);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id)
      .removeAttr('style').addClass('building-polygon').addClass('sil-apt-building-polygon')
      .attr('name', data['pnu'])
      .attr('data-buildingID',  data['buildingID'])
      .attr('data-sigunguCd' , data['sigunguCd'])
      .attr('data-bjdongCd', data['bjdongCd'])
      .attr('data-bun', data['bun'])
      .attr('data-ji', data['ji'])
      .attr('data-height', data['height']);
    });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
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
    // console.log(polygon);
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

    // console.log(polygon.wc[0].outerHTML);
    // $("#side-tab-svg").append(polygon.wc[0].outerHTML)
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon stcs-item');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      // console.log(polygon.Bb);
      stcs_landPolygons = [];
      beforeNm = polygon.Bb[1];
      getStcsSgg(polygon.Bb[0]);
      $('#stat-side-sido').text(polygon.Bb[1]);
      $('#stat-side-sido').attr("name", polygon.Bb[0]);

      $('.stcs-item').remove();
      $('.stcs_label').remove();

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
        stcs_landPolygons = [];
        getStcsdong(polygon.Bb[0])
        $('#stat-side-sgg').text(polygon.Bb[1]);
        $('#stat-side-sgg').attr("name", polygon.Bb[0]);

        $('.stcs-item').remove();
        $('.stcs_label').remove();
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
        stcs_landPolygons = [];
        getStcsaggr(polygon.Bb[0])
        $('#stat-side-dong').text(polygon.Bb[1]);
        $('#stat-side-dong').attr("name", polygon.Bb[0]);

        $('.stcs-item').remove();
        $('.stcs_label').remove();
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
}

function parseShape(shape){
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
  /*    point : 'point( (poly1) , (poly2) , ...)'   */
  // console.log(point);
  // if (point[0] === 'P') {
  //   // console.log('hi');
  //   point = point.replace(/,/g, ', ');
  //   point = point.toLowerCase();
  // }
  point = point.toLowerCase();
  // console.log(point);
  var points = point.replace('point(', '').replace(')' , '').split(' ');
  // $.each(points, function(index, value){
  //   points[index] = value.replace('(', '').replace(')', '');
  // });
  // qwe = points;
  // console.log(points[0]+','+points[1]);
  return points;
}
