"use strict";

/*
  drawSinglePoly(param1, param2, param3, ...)
  param: data, points

*/

function drawPoly(data){
  console.log('drawSinglePoly');
  console.log(data);
  var testPolygon;
  $.each(data, function(index, target){

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
          setPoly(ajax_type, polygon, data);
      });

  });


}

/*
* setPoly(type, polygon, data)
* 타입에 따른 폴리곤의 이벤트 및 셋팅 함수
*
*/
var testPoints = [];
var testShape;

function setPoly(type, polygon, data){
  console.log(polygon);
  $.each(polygon.Id[0], function(index, target){
      testPoints.push(new THREE.Vector2(target.ib, target.jb));
  });

  for( var i = 0; i < testPoints.length; i ++ ) {
    // testPoints[ i ].multiplyScalar( 0.00025 );

    testPoints[i].x = testPoints[i].x;
    testPoints[i].y = testPoints[i].y;
    console.log(testPoints[i]);
  }

  var testShape = new THREE.Shape(testPoints);
  var extrudeSettings = { curveSegments : 20, amount: 1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 1, bevelThickness: 10 };
  addShape( testShape,  extrudeSettings, 0x46d78f, 0, 0, 0, 0, 0, 0, 1 );
  
  animate();

  if(type === 'toji'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
    console.log(polygon);
    var target = polygon.wc;
    $.each(target, function(index, path){
      $("#" + path.id).removeAttr('style').addClass('toji-polygon');
    });

    daum.maps.event.addListener( polygon, 'mouseover', function(mouseEvent) {
      console.log('polygon mouseover activated! : ' , polygon );
    });
  }
}

function parseShape(shape){
  /*    shape : 'polygon( (poly1) , (poly2) , ...)'   */
  var shapes = shape.replace('polygon(', '').replace('))' , ')').split('), ');
  $.each(shapes, function(index, value){
    shapes[index] = value.replace('(', '').replace(')', '');
  });
  return shapes;
}
