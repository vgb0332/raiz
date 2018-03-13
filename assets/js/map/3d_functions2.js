const initial_camera_ratio = 6/7;
const bulding_height_ratio = 0.6;

function THREE_init(polygons, data, Rwindow){
  var container = Rwindow.find(" .raiz-window-body ");

  var scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf2f2f2 );

  var camera = new THREE.PerspectiveCamera( 90, 1, 1, 2000 );
  camera.position.set( 0, 0, 500 );
  camera.up.set( 0, 0, 1 );

  scene.add( camera );
  var light = new THREE.PointLight( 0xffffff, 0.8 );
  camera.add( light );

  var group = new THREE.Group();
  scene.add( group );

  var renderer = new THREE.WebGLRenderer( { antialias : true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( Rwindow.width(),  Rwindow.height() - 30 );

  container.append( renderer.domElement );

  var toji_texture = new THREE.TextureLoader()
                    .load( "./assets/img/grass03.png",
                      function(texture){
                        console.log('toji texture loaded');
                        renderer.render( scene, camera );
                      } );

  toji_texture.wrapS = THREE.RepeatWrapping;
  toji_texture.wrapT = THREE.RepeatWrapping;
  toji_texture.repeat.set( 0.1, 0.1 );

  var building_texture = new THREE.TextureLoader()
                        .load( "./assets/img/house_texture.png",
                          function(texture){
                            console.log('loaded');
                            renderer.render( scene, camera );
                        } );
  building_texture.wrapS = THREE.RepeatWrapping;
  building_texture.wrapT = THREE.RepeatWrapping;
  building_texture.repeat.set( 0.05, 0.05 );

  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableZoom = true;

  // POLYGON CREATION PROCESS
  var polyPoints = [];

  var group = new THREE.Group();
  var resetGroup = [];
  var axesHelper = new THREE.AxesHelper( 200 );

  var Xoffset, Yoffset;

  var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);

  $.each(polygons, function(index, polygon){

    var target_id = polygon.wc[0].id;
    var target = $("#" + target_id);

    if(target.hasClass('toji-polygon')){
      polyPoints = [];
      $.each(polygon.Id[0], function(index, target){
          polyPoints.push(new THREE.Vector2(target.ib, target.jb));
      });

      var poly3D = new THREE.Shape(polyPoints);
      var extrudeSettings = { curveSegments : 20, amount: 1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 1, bevelThickness: 2 };
      var color = 0x725428;
      var x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1;
      var geometry = new THREE.ExtrudeGeometry( poly3D, extrudeSettings );
      var toji_mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { map: toji_texture } ) );

      toji_mesh.scale.set( s, s, s );

      var geometry = toji_mesh.geometry;
      geometry.computeBoundingBox();
      var center = geometry.boundingBox.getCenter();
      var size = geometry.boundingBox.getSize();

      var longLen = size.x > size.y ? size.x : size.y;

      Xoffset = x - center.x;
      Yoffset = y - center.y;

      toji_mesh.translateX(Xoffset);
      toji_mesh.translateY(Yoffset);
      toji_mesh.rotation.set( rx, ry, rz );
      toji_mesh.material.transparent = true;

      var axesHelper = new THREE.AxesHelper( longLen );
      axesHelper.position.y = 0;
      axesHelper.position.x = 0;
      scene.add( axesHelper );
      group.scale.set( camera.position.z / longLen, camera.position.z / longLen, camera.position.z / longLen);
      toji_mesh.userData = {
        'type' : 'toji',
        'target' : target
      };
      group.add(toji_mesh);
      resetGroup.push(toji_mesh);

    }
    else if(target.hasClass('building-polygon')){
      polyPoints = [];
      $.each(polygon.Id[0], function(index, target){
          polyPoints.push(new THREE.Vector2(target.ib, target.jb));
      });

      var height = parseInt(target.attr('data-height'));
      height = (height === 0) ? 2 : height * bulding_height_ratio;

      var poly3D = new THREE.Shape(polyPoints);

      var extrudeSettings = { curveSegments : 20, amount: 1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 1, bevelThickness: 1 };
      var color = 0x189AD3;
      var x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1;
      var geometry = new THREE.ExtrudeGeometry( poly3D, extrudeSettings );
      var building_mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { map: building_texture } ) );
      building_mesh.castShadow = true;

      var geometry = building_mesh.geometry;
      geometry.computeBoundingBox();
      var center = geometry.boundingBox.getCenter();
      var size = geometry.boundingBox.getSize();

      building_mesh.scale.set( s, s, height );
      // building_mesh.position.set( Xoffset , Yoffset, z  );
      building_mesh.translateX(Xoffset);
      building_mesh.translateY(Yoffset);
      building_mesh.rotation.set( rx, ry, rz );
      building_mesh.translateZ(height + 2);
      building_mesh.userData = {
        'type' : 'building',
        'target' : target
      };
      building_mesh.material.transparent = true;
      building_mesh.material.opacity = 0.7;

      group.add(building_mesh);
      resetGroup.push(building_mesh);
    }
  });

  scene.add( group );
  //copy initial group for reset clone fucking doesn't work;
  var resetGroup = [];
  $.each(group.children, function(index, mesh){
    resetGroup.push(mesh);
  });

  renderer.render(scene, camera);

  /* event listeners */

  controls.addEventListener( 'change', function(e){
    // console.log(camera.position);
    domEvents.camera(camera);
    renderer.render(scene, camera);
    var angle = 60 + controls.getAzimuthalAngle() * 180 / Math.PI;
    Rwindow.find(".raiz-compass-pointer").css({
      '-webkit-transform' : 'rotate(' + angle + 'deg)',
      '-moz-transform'    : 'rotate(' + angle + 'deg)',
      '-ms-transform'     : 'rotate(' + angle + 'deg)',
      '-o-transform'      : 'rotate(' + angle + 'deg)',
      'transform'         : 'rotate(' + angle + 'deg)'
    });

  }, false );

  Rwindow.resize(function( event ){
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    if(!Rwindow.find(".raiz-window-info").is(":visible")){
      renderer.setSize( Rwindow.width() , Rwindow.height() - 20 );
    }
    else{
      renderer.setSize( Rwindow.width() - 300 , Rwindow.height() - 20 );
    }
    renderer.render( scene, camera );
    domEvents.camera(camera);
  });

  Rwindow.find(".raiz-reset").on("click", function(e){
    try{
      var type_check = group.children[0].userData['type'];
    }catch(err){
      return false;
    }

    //initial animation
    TWEEN.removeAll();
    controls.reset();
    var target = new THREE.Vector3(5, -370, 330);
    var camera_tween = animateVector3(
              new THREE.Vector3(camera.position.x, camera.position.y,  camera.position.z), target, {
              duration: 1200,
              easing: TWEEN.Easing.Quadratic.InOut,
              update: function(d){
                // console.log('updating' , d);
                camera.position.x = d.x;
                camera.position.y = d.y;
                camera.position.z = d.z;
                controls.update();
                renderer.render(scene, camera);
              },
              callback: function(){
                console.log('camera job done');
                domEvents.camera(camera);
              }
            });

    if(type_check !== 'floor') {
        camera_tween.start();
    }
    else{

      TWEEN.removeAll();
      controls.reset();
      $.each(group.children, function(index, mesh){
        mesh.material.dispose();
        mesh.geometry.dispose();
      });

      group.children = [];
      $.each(resetGroup, function(index, mesh){
        mesh.material.opacity = 1;
        group.add(mesh);
      });
      group.position.z = 0;
      camera_tween.start();
      // renderer.render(scene, camera);

    }

  });

  //for timing issue, all ajax requests for data should be done first before event trigger is assigned.
  $(document).ajaxStop(function(){
    var building_titleInfo = Rwindow.find('.raiz-window-body').find('.raiz-window-info')
                             .find('.raiz-window-info-body').find('.building-titleInfo')
                             .find('.building-titleInfo-body').find('.building-titleInfo-body-title');

    var building_recapTitleInfo = Rwindow.find('.raiz-window-body').find('.raiz-window-info')
                             .find('.raiz-window-info-body').find('.building-recapTitleInfo')
                             .find('.building-recapTitleInfo-body').find('.building-recapTitleInfo-body-title');

    var building_flrInfo = Rwindow.find('.raiz-window-body').find('.raiz-window-info')
                             .find('.raiz-window-info-body').find('.building-titleInfo')
                             .find('.building-titleInfo-body').find('.building-titleInfo-body-info')
                             .find('.flrInfo').find('.flr3d');

    var building_pubInfo = Rwindow.find('.raiz-window-body').find('.raiz-window-info')
                             .find('.raiz-window-info-body').find('.building-titleInfo')
                             .find('.building-titleInfo-body').find('.building-titleInfo-body-info')
                             .find('.pubInfo').find('.flr3d');

    var building_flr = Rwindow.find('.raiz-window-body').find('.raiz-window-info')
                            .find('.raiz-window-info-body').find('.building-titleInfo')
                            .find('.building-titleInfo-body').find('.building-titleInfo-body-info')
                            .find('.flrInfo').find('.flr');

    var building_pubFlr = Rwindow.find('.raiz-window-body').find('.raiz-window-info')
                            .find('.raiz-window-info-body').find('.building-titleInfo')
                            .find('.building-titleInfo-body').find('.building-titleInfo-body-info')
                            .find('.pubInfo').find('.flr');

    var target = building_titleInfo.add(building_recapTitleInfo);

    building_flr.add(building_pubFlr).on('mouseover', function(e){
      stopTWEEN();
      var target_flrGbCd = $(this).attr('data-flrGbCd');
      var target_flrNo = $(this).attr('data-flrNo');

      $.each(group.children, function(index, mesh){
        if(mesh.userData.type !== 'floor') return false;

        var mesh_flrGbCd = mesh.userData['flrGbCd'];
        var mesh_flrNo = mesh.userData['flrNo'];

        if(target_flrGbCd === mesh_flrGbCd && target_flrNo ===  mesh_flrNo){

        var mouseover_tween = new TWEEN.Tween({opacity : 1})
                      .to( {opacity: 0.3}, 500)
                      .onUpdate(function(e){
                        mesh.material.opacity = e.opacity;
                        renderer.render(scene, camera);
                      })
                      .onStop(function(){
                        mesh.material.opacity = 1;
                      })
                      .onComplete(function(e){

                      })
                      .start()
                      .repeat(Infinity);
        }

      });
    });

    building_flr.add(building_pubFlr).on('mouseout', function(e){
      stopTWEEN();
    });

    building_flrInfo.add(building_pubInfo).on('click', function(e){
        console.log('I want 3d floors');
        console.log(group.position);
        var target_buildingID = $(this).parent().parent().attr('data-buildingID');
        var target_flrNo = $(this).siblings('.flr').length;
        var floors = $(this).siblings('.flr');

        try{
          var type_check = group.children[0].userData['type'];
        }catch(err){
          return false;
        }

        if(type_check === 'floor'){
          console.log('right?');
          TWEEN.removeAll();
          controls.reset();
          $.each(group.children, function(index, mesh){
            mesh.material.dispose();
            mesh.geometry.dispose();
          });

          group.children = [];
          $.each(resetGroup, function(index, mesh){
            mesh.material.opacity = 1;
            group.add(mesh);
          });
          group.position.z = 0;
          // camera_tween.start();

        };

        $.each(group.children, function(index, mesh){

          var sigunguCd =  mesh.userData.target.attr('data-sigunguCd');
          var buildingID = mesh.userData.target.attr('data-buildingID');

          var target = sigunguCd + '-' + buildingID;

          if(target === target_buildingID){
            var geometry = mesh.geometry;
            var center = geometry.boundingBox.getCenter();

            var delete_tween = new TWEEN.Tween({opacity : 1})
                        .to( {opacity: 0}, 500)
                        .onUpdate(function(e){
                          $.each(group.children, function(index, mesh){
                            mesh.material.opacity = e.opacity;
                          });
                          renderer.render(scene, camera);
                        })
                        .onComplete(function(e){

                          $.each(group.children, function(index, mesh){
                            mesh.material.dispose();
                            mesh.geometry.dispose();
                          });

                          group.children = [];
                          onComp();

                        })
                        .start();
              function onComp(){

                var z = 0;
                for(var i = floors.length - 1; i >= 0; --i){

                    var floor = floors[i];
                    var flrGbCd = $(floor).attr('data-flrGbCd');
                    var flrNo = $(floor).attr('data-flrNo');
                    var color = '#54ff9f';
                    //지하는 블랙, 옥탑은 파랑색, 보통은 노랑색
                    if(flrGbCd === '10'){
                      color = '#8b8b83';
                    }
                    else if(flrGbCd === '30'){
                      color = '#c9e1ff';
                    }

                    var twin = mesh.clone();
                    twin.material.dispose();
                    twin.geometry.dispose();

                    twin.material = new THREE.MeshPhongMaterial( { color: color, transparent: true } );
                    twin.scale.z = 2;
                    twin.position.set(-center.x, -center.y, (z++) * 5);
                    twin.material.opacity = 1;

                    twin.userData = {
                      'type' : 'floor',
                      'flrGbCd' : flrGbCd,
                      'flrNo' : flrNo
                    };
                    group.add(twin);
                    if(i === 0){
                      group.translateZ(-twin.position.z / 2);
                    }
                    // group.translateZ(-(target_flrNo - 1) / 2);
                    renderer.render(scene, camera);

                };

              }

              controls.reset();
              var target = new THREE.Vector3(-66, -387, 23);
              var camera_tween = animateVector3(new THREE.Vector3(camera.position.x, camera.position.y,  camera.position.z), target, {
                duration: 800,
                easing: TWEEN.Easing.Quadratic.InOut,
                update: function(d){
                  // console.log('updating' , d);
                  camera.position.x = d.x;
                  camera.position.y = d.y;
                  camera.position.z = d.z;
                  controls.update();
                  renderer.render(scene, camera);
                },
                callback: function(){
                  console.log('camera job done');
                  domEvents.camera(camera);
                }
              });
              delete_tween.chain(camera_tween);
          }

        });

    });

    target.on("mouseover", function(e){
        stopTWEEN();
        var type_check = group.children[0].userData['type'];
        if(type_check === 'floor') return false;
        var mesh_target = $(this).attr('data-buildingID');
        $.each(group.children, function(index, mesh){


          var sigunguCd =  mesh.userData.target.attr('data-sigunguCd');
          var buildingID = mesh.userData.target.attr('data-buildingID');

          var target = sigunguCd + '-' + buildingID;

          if(mesh_target === target){
            console.log('say yes!');
            mesh.material.opacity = 0.7;
            var target_vector = new THREE.Vector3(0, 0, mesh.position.z + 10);
            var original_position_z = mesh.position.z;
            animateVector3(new THREE.Vector3(0, 0, mesh.position.z), target_vector, {
              duration: 600,
              easing: TWEEN.Easing.Quadratic.InOut,
              update: function(d){
                // console.log('updating' , d);
                mesh.position.z = d.z;
                renderer.render(scene, camera);
              },
              stop: function(){

                mesh.position.z = original_position_z;
                mesh.material.opacity = 1;
                renderer.render(scene, camera);
              },
              callback : function(){

                mesh.material.opacity = 1;
                mesh.position.z = original_position_z;
                renderer.render(scene, camera);
              }
            })
            .start()
            .repeat(Infinity);

            // var renderOnMouseOver = function(){
            //     requestAnimationFrame(renderOnMouseOver);
            //     TWEEN.update();
            // };
            // requestAnimationFrame(renderOnMouseOver);
          }

      });
    });

    target.on('mouseout', function(e){
      stopTWEEN();
    });

    building_titleInfo.on('click', function(e){
      stopTWEEN();
      var mesh_target = $(this).attr('data-buildingID');
      var type_check = group.children[0].userData['type'];
      if(type_check === 'floor') return false;

      $.each(group.children, function(index, mesh){


        var sigunguCd =  mesh.userData.target.attr('data-sigunguCd');
        var buildingID = mesh.userData.target.attr('data-buildingID');

        var target = sigunguCd + '-' + buildingID;

        if(mesh_target === target){
          var mesh_position = mesh.position;
          var geometry = mesh.geometry;
          geometry.computeBoundingBox();
          var center = geometry.boundingBox.getCenter();
          var size = geometry.boundingBox.getSize();

          console.log(size);
          console.log(center);
        }

      });

      if($(this).hasClass('isOpen')){
        console.log('closing');

      }
      else{
        console.log('opneing');
      }

    });

  });

  //initial animation
  TWEEN.removeAll();
  controls.reset();
  var target = new THREE.Vector3(5, -370, 330);
  var camera_tween = animateVector3(
    new THREE.Vector3(camera.position.x, camera.position.y,  camera.position.z), target, {
    duration: 1200,
    easing: TWEEN.Easing.Quadratic.InOut,
    update: function(d){
      // console.log('updating' , d);
      camera.position.x = d.x;
      camera.position.y = d.y;
      camera.position.z = d.z;
      controls.update();
      renderer.render(scene, camera);
    },
    callback: function(){
      console.log('camera job done');
      domEvents.camera(camera);
    }
  }).start();

  var renderOnMouseClick = function(){
      requestAnimationFrame(renderOnMouseClick);
      TWEEN.update();
  };
  requestAnimationFrame(renderOnMouseClick);


}

function stopTWEEN(){
  var tweenIds = Object.keys(TWEEN._tweens);
  for(var i = 0; i < tweenIds.length; ++i){
    var tween = TWEEN._tweens[tweenIds[i]];
    tween.stop();
    TWEEN.remove(tween);
  }
}

/* Animates a Vector3 to the target */
function animateVector3(vectorToAnimate, target, options){
    options = options || {};
    // get targets from options or set to defaults
    var to = target || THREE.Vector3(),
        easing = options.easing || TWEEN.Easing.Quadratic.In,
        duration = options.duration || 2000;
    // create the tween
    var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
        .to({ x: to.x, y: to.y, z: to.z, }, duration)
        .easing(easing)
        .onUpdate(function(d) {
            if(options.update){
                options.update(d);
            }
         })
        .onStop(function(){
           if(options.stop){ options.stop(); }
         })
        .onComplete(function(){
          if(options.callback) options.callback();
        });
    // start the tween
    // tweenVector3.start();
    // return the tween in case we want to manipulate it later on
    return tweenVector3;
}
