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

  customAjax($SITE_URL+'get/buildingRecapTitleInfo', values, function(data){
    if(data.length === 0) return false;
    Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(building_recapTitleInfo(data));
  });

  customAjax($SITE_URL+'get/buildingTitleInfo', values, function(data){
    if(data.length === 0) return false;
    Rwindow.find('.raiz-window-info').find('.raiz-window-info-body').append(building_titleInfo(data));
  });


  THREE_init(polygons, data, Rwindow);
  Rwindow.show('normal');
}

function setSTCSWindow(polygons, data){
  // console.log(data);
  if ( ! Detector.webgl ) alert('webGL needed');

  // RAIZ WINDOW SETUP
  var header = $('#stat-side-sido').text() + ' ' + $('#stat-side-sgg').text() + ' ' + $('#stat-side-dong').text();
  var STCSwindow = raiz_StcsWindow(header);
  $(document.body).append(STCSwindow);

  // insert3D(STCSwindow, polygon);
  // THREE_init(polygons, data, STCSwindow);

  STCSwindow.find('.stcs-window-title').append(stcs_additag(data,'initdata'));

  console.log(polygons[0].Bb[0][3]);

  var stcsAggList = ['stcsTotaljobs','stcsPopdens','stcsHouseType','stcsTotalHouse','stcsHouseSize'
                    ,'stcsHouseHold','stcsTotalFamily','stcsJobsPop','stcsJobsBiz'];

  for (var i = 0; i < stcsAggList.length; i++) {
    (function(i){
      console.log(stcsAggList[i]);
      customAjax($SITE_URL+'getStcs/'+stcsAggList[i], {currHjstcs:polygons[0].Bb[0][3]}, function(data){
        STCSwindow.find('.stcs-initdata').append(stcs_additag(data,stcsAggList[i]));
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
    polygon.Bb[0] = data['sidoCd'];
    polygon.Bb[1] = data['sidoNm'];

    // console.log(polygon);
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

      $('.stcs-item').remove();
      $('.stcs_label').remove();

    });
  }

  if(type === 'stcsSgg'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
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
      getStcsdong(polygon.Bb[0])
      $('#stat-side-sgg').text(polygon.Bb[1]);
      $('#stat-side-sgg').attr("name", polygon.Bb[0]);

      $('.stcs-item').remove();
      $('.stcs_label').remove();
    });
  }

  if(type === 'stcsDong'){
    // polygon.setOptions( toji_polygon_option );
    polygon.setMap(map);
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
      getStcsaggr(polygon.Bb[0])
      $('#stat-side-dong').text(polygon.Bb[1]);
      $('#stat-side-dong').attr("name", polygon.Bb[0]);

      $('.stcs-item').remove();
      $('.stcs_label').remove();
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

      setSTCSWindow([polygon], polygon.Bb[0]);
      // console.log(aggr_poly);
      // $('.stcs-polygon').remove();
      // $('.stcs_ol').remove();

      new Chart(document.getElementById("houseSizeChart"),{
        "type":"bar",
        "data":{
          "labels":[
            "January","February","March","April","May","June","July"],
          "datasets":[
            {
              "label":"My First Dataset",
              "data":[65,59,80,81,56,55,40],
              "fill":false,
              "backgroundColor":[
                "rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"
                ],
              "borderColor":["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(201, 203, 207)"],
              "borderWidth":1
            }
          ]
        },
        "options":{
          "scales":{
            "yAxes":[
              {"ticks":{"beginAtZero":true}
                }
              ]
            }
          }
        }
      );

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
  qwe = shapes;
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
