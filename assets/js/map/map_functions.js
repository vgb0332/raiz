"use strict";
var landPolygons = []; //토지 폴리곤
var buildingPolygons = []; //건물 폴리곤

function mainActivity(data){
  console.log(data);
  var landResult = data['land'];
  var buildingResult = data['building'];
  ajax_type = 'toji';
  drawPoly(landResult);
  ajax_type = 'building';
  drawPoly(buildingResult);
}

/*
  drawSinglePoly(param1, param2, param3, ...)
  param: data, points

*/
var qwe = '';
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
          setPoly(ajax_type, polygon, target_data, index);
          // // Ghun testing!
          console.log(polygon);
      });
  });
}

/*
* setWindow(data)
* 라이즈 윈도우 띄우는 함수, 새로운 RAIZ-WINDOW-CONTAINER DOM과 함께 3D CANVAS 생성
*
*
*/

function setWindow(polygons, data){
  console.log(data);
  if ( ! Detector.webgl ) alert('webGL needed');

  // RAIZ WINDOW SETUP
  var header = data['ldCodeNm'] + ' ' + data['bun'] + ( (data['ji'] === '') ? '' : ('-' + data['ji']) );
  var Rwindow = raiz_window(header);
  $(document.body).append(Rwindow);

  // insert3D(Rwindow, polygon);
  THREE_init(polygons, data, Rwindow);

  Rwindow.find('.raiz-window-body').append(toji_possession(data));
  Rwindow.show('normal');
}

/*
* setPoly(type, polygon, data)
* 타입에 따른 폴리곤의 이벤트 및 셋팅 함수
*
*/

function setPoly(type, polygon, data, indexing){
  console.log(data);
  if(type === 'toji'){
    polygon.setMap(map);
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon').attr('name', data['pnu']);
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      console.log('polygon mouseover activated! : ' , polygon );
    });

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

      setWindow(polygons, data);
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
      .attr('data-buildingID', data['buildingID'])
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
    console.log(data);
    polygon.Bb[0] = data['sidoCd'];
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      getStcsSgg(polygon.Bb[0])
      $('.stcs-polygon').remove();
    });
  }

  if(type === 'stcsSgg'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
    polygon.Bb[0] = data['sigunguCd'];
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      getStcsdong(polygon.Bb[0])
      $('.stcs-polygon').remove();
    });
  }

  if(type === 'stcsDong'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
    polygon.Bb[0] = data['ADM_CD'];
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      getStcsaggr(polygon.Bb[0])
      $('.stcs-polygon').remove();
    });
  }
  if(type === 'stcsAggr'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
    // console.log(polygon);
    polygon.Bb[0] = [
      data['SHAPE_AREA'],
      data['TOTAL_POP'],
      data['MEDIUM_AGE'],
      data['TOT_REG_CD']
    ];
    var customOverlay = new daum.maps.CustomOverlay({})
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon');
    });

    makeGlobalvalue(polygon,'stcsAggr');

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
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      console.log(aggr_poly);
      // $('.stcs-polygon').remove();
      // $('.stcs_ol').remove();
    });
  }
}

function makeGlobalvalue(data,type){
  if (type === 'stcsAggr') {
    aggr_poly.push(data);
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
  qwe = shapes;
  return shapes;
}
