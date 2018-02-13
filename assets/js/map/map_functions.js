"use strict";

/*
  drawSinglePoly(param1, param2, param3, ...)
  param: data, points

*/

function drawPoly(data){
  console.log(data);
  var testPolygon;
  $.each(data, function(index, target){
      // console.log(target);
      var polygon = target['polygon'];
      var target = parseShape(polygon);

      $.each(target, function(i, iv){

          var points = iv.split(', ');
          var polyPath = [];
          var polygon = new daum.maps.Polygon({  });

          $.each(points, function(j, jv){

              var point = jv.split(' ');
              var x = point[0], y = point[1];
              polyPath.push(new daum.maps.LatLng(x, y));

          });
          polygon.setPath(polyPath);
          setPoly(ajax_type, polygon, data, index);
          // // Ghun testing!
          console.log(polygon);
          // stcs_arr.push([polygon,data[index]['sigunguCd']])
      });
  });
  // console.log(stcs_arr);
}

/*
* setWindow(data)
* 라이즈 윈도우 띄우는 함수, 새로운 RAIZ-WINDOW-CONTAINER DOM과 함께 3D CANVAS 생성
*
*
*/

function setWindow(polygon, data){
  if ( ! Detector.webgl ) alert('webGL needed');
  var container, stats;
  var camera, scene, renderer, raycaster;
  var group, controls;

  var header = data[0]['ldCodeNm'] + ' ' + data[0]['bun'] + '-' + data[0]['ji'];
  var Rwindow = raiz_window(header);
  $(document.body).append(Rwindow);
  // insert3D(Rwindow, polygon);
  THREE_init(polygon, data, Rwindow);
  Rwindow.show('normal');
}

/*
* setPoly(type, polygon, data)
* 타입에 따른 폴리곤의 이벤트 및 셋팅 함수
*
*/


function setPoly(type, polygon, data, indexing){

  if(type === 'mark'){
    polygon.setMap(map);
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      console.log('polygon mouseover activated! : ' , polygon );
    });

    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      console.log('polygon click activated! : ' , polygon );
      setWindow(polygon, data);
    });
  }



  if(type === 'toji'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
  }

  if(type === 'stcs'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
    polygon.Bb[0] = data[indexing]['sigunguCd'];
    // console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {
      console.log(polygon.Bb[0]);
      getStcsdong(polygon.Bb[0])
      $('.stcs-polygon').remove();
    });
  }

  if(type === 'stcsDong'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
    polygon.Bb[0] = data[indexing]['ADM_CD'];
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
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('stcs-polygon');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      // console.log('polygon mouseover activated! : ' , polygon );
    });
    daum.maps.event.addListener( polygon, 'click', function(mouseEvent) {

      $('.stcs-polygon').remove();
    });
  }
}

function parseShape(shape){
  /*    shape : 'polygon( (poly1) , (poly2) , ...)'   */
  // console.log(shape);
  var shapes = shape.replace('polygon(', '').replace('))' , ')').split('), ');
  $.each(shapes, function(index, value){
    shapes[index] = value.replace('(', '').replace(')', '');
  });
  return shapes;
}
