const initial_camera_ratio = 6/7;
const bulding_height_ratio = 0.6;

function THREE_init(polygons, data, Rwindow){
  var container = Rwindow.find('.raiz-window-body');
  var scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  var camera = new THREE.PerspectiveCamera( 90, 1, 1, 2000 );
  camera.position.set( 0, 0, 500 );
  camera.up.set( 0, 0, 1 ); //rotate along z-axes

  scene.add( camera );
  var light = new THREE.PointLight( 0xffffff, 0.8 );
  camera.add( light );
  // var light = new THREE.SpotLight( 0xffffff );
  // camera.add( light );

  // var spotLight = new THREE.SpotLight( 0xffffff );
  // spotLight.position.set( 0, 10, 500 );
  // spotLight.angle = 0.3;
  // spotLight.distance = 600;
  // scene.add( spotLight );
  //
  // var spotLightHelper = new THREE.SpotLightHelper( spotLight );
  // scene.add( spotLightHelper );

  var group = new THREE.Group();
  scene.add( group );

  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( Rwindow.width(), Rwindow.height() );
  container.append( renderer.domElement );
  var stat = new Stats();
  container.append( stat.dom );

  // load a texture, set wrap mode to repeat
  var toji_texture = new THREE.TextureLoader().load( "./assets/img/grass03.png", function(texture){
    console.log('texture loaded');
    renderer.render( scene, camera );
  } );
  toji_texture.wrapS = THREE.RepeatWrapping;
  toji_texture.wrapT = THREE.RepeatWrapping;
  toji_texture.repeat.set( 0.1, 0.1 );

  var building_texture = new THREE.TextureLoader().load( "./assets/img/house_texture.png", function(texture){
    console.log('loaded');
    renderer.render( scene, camera );
  } );
  building_texture.wrapS = THREE.RepeatWrapping;
  building_texture.wrapT = THREE.RepeatWrapping;
  building_texture.repeat.set( 0.05, 0.05 );


  var controls = new THREE.OrbitControls( camera, renderer.domElement );

  controls.addEventListener( 'change', function(e){
    Rwindow.addClass('orbiting');
    // console.log('camera position : ' , camera.position);
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

  }, false ); // remove when using animation loop

  // enable animation loop when using damping or autorotation
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  // controls.enablePan = false;

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


  // POLYGON CREATION PROCESS
  var polyPoints = [];

  var group = new THREE.Group();
  var resetGroup = [];

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

      if(!is_mobile){
        var a = domEvents.addEventListener(toji_mesh, 'click', function(){
          meshClick('toji', Rwindow, toji_mesh);
        }, false);
        domEvents.addEventListener(toji_mesh, 'mouseover', function(){
          meshMouseOver('toji', Rwindow, toji_mesh);
        }, false);
        domEvents.addEventListener(toji_mesh, 'mouseout', function(){
          meshMouseOut('toji', Rwindow, toji_mesh);
        }, false);
      }
      else{
        domEvents.addEventListener(toji_mesh, 'click', function(){
          meshClick('toji', Rwindow, toji_mesh);
        }, false);
      }

    }
    else if(target.hasClass('building-polygon')){
      console.log(target.attr('data-buildingID'));
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

      group.add(building_mesh);
      resetGroup.push(building_mesh);

      if(!is_mobile){
        domEvents.addEventListener(building_mesh, 'click', function(){
          meshClick('building', Rwindow, building_mesh, target);
        }, false);
        domEvents.addEventListener(building_mesh, 'mouseover', function() {
          meshMouseOver('building', Rwindow, building_mesh, target);
        }, false);
        domEvents.addEventListener(building_mesh, 'mouseout', function(){
          meshMouseOut('building', Rwindow, building_mesh, target);
          // building_mesh.position.z = height + 2;
        }, false);
      }
      else{
        // domEvents.addEventListener(mesh, 'mouseover', meshClick, false);
      }
    }
  });
  console.log(group);
  scene.add(group);

  Rwindow.find('canvas').dblclick(function(){
    console.log('dblclick');
    var target = new THREE.Vector3(0, 0, 500);

    animateVector3(new THREE.Vector3(camera.position.x, camera.position.y,  camera.position.z), target, {
      duration: 500,
      easing: TWEEN.Easing.Quadratic.InOut,
      update: function(d){
        // console.log('updating' , d);
        camera.position.x = d.x;
        camera.position.y = d.y;
        camera.position.z = d.z;
        renderer.render(scene, camera);
      },
      callback: function(){
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        controls.reset();
        controls.update();

        for(var i = group.children.length - 1; i >= 0; i--){
          (function(i){
              group.children[i].material.dispose();
              group.children[i].geometry.dispose();
              // delete group.children[i]._3xDomEvent;
              group.children[i]._3xDomEvent = [];
              group.remove(group.children[i]);
              scene.remove(group.children[i]);
          })(i);
        };

        for(var i = resetGroup.length - 1 ; i >= 0; i--){
          (function(i){
            console.log(resetGroup[i]);
            resetGroup[i].material.opacity = 1;
            group.add(resetGroup[i]);
          })(i);
        }

        for(var i = group.children.length - 1; i >= 0; --i){
          (function(i){

            domEvents.addEventListener(group.children[i], 'click', function(){
              meshClick(group.children[i].userData.type, Rwindow, group.children[i], group.children[i].userData.target);
            }, false);
            domEvents.addEventListener(group.children[i], 'mouseover', function() {
              meshMouseOver(group.children[i].userData.type, Rwindow, group.children[i], group.children[i].userData.target);
            }, false);
            domEvents.addEventListener(group.children[i], 'mouseout', function(){
              meshMouseOut(group.children[i].userData.type, Rwindow, group.children[i], group.children[i].userData.target);
              // building_mesh.position.z = height + 2;
            }, false);
          })(i);
        }
        scene.add(group);
        renderer.render(scene, camera);
        domEvents.camera(camera);
        console.log(group);
      }

    });

  });

  var meshClick = function(type, Rwindow, mesh, target){

    if(type === 'toji'){
      console.log('you clicked toji mesh');
      TWEEN.removeAll();
      controls.reset();
      var target = new THREE.Vector3(camera.position.x - 20, camera.position.y - 400, camera.position.z -  200);
      animateVector3(new THREE.Vector3(camera.position.x, camera.position.y,  camera.position.z), target, {
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
          Rwindow.find('.toji-characteristics').fadeIn();
          Rwindow.find('.toji-possession').fadeIn();
          Rwindow.find('.toji-usage').fadeIn();
          Rwindow.find('.toji-indivPrice').fadeIn();
          domEvents.camera(camera);
          console.log(resetGroup);
        }
      });

      var renderOnMouseClick = function(){
          requestAnimationFrame(renderOnMouseClick);
          TWEEN.update();
      };
      requestAnimationFrame(renderOnMouseClick);

    }

    if(type === 'building'){
      console.log('you clicked builiding mesh');
      var buildingID = target.attr('data-buildingID');
      var sigunguCd = target.attr('data-sigunguCd');
      var bjdongCd = target.attr('data-bjdongCd');
      var bun = target.attr('data-bun');
      var ji = target.attr('data-ji');

      if(buildingID === '') {
        alert('정보 없음');
        return;
      }

      customAjax($SITE_URL + 'get/buildingTitleInfo', {
        sigunguCd : sigunguCd,
        bjdongCd : bjdongCd,
        bun : bun,
        ji : ji,
        buildingID : sigunguCd + '-' + buildingID
      }, function(data){
        if(!data.brTitleInfo[0]){           alert('정보없음');   return;      }
        redrawBuilding(data);
      });

      function redrawBuilding(data){

        var building = data.brTitleInfo[0];

        var grndFlrCnt = building['grndFlrCnt'];
        var ugrndFlrCnt = building['ugrndFlrCnt'];
        var totalFlrCnt = grndFlrCnt*1 + ugrndFlrCnt*1;
        var flrOffset = data.flrCnt.length - totalFlrCnt;

        var geometry = mesh.geometry;
        var center = geometry.boundingBox.getCenter();
        var size = geometry.boundingBox.getSize();
        var groupA = new TWEEN.Group();

        for(var i = group.children.length - 1; i >= 0; i--){
          (function(i){
              //disappearing animation with heap garbage collect

              // TWEEN.removeAll();
              var target = {};
              target.opacity = 1;

              var tween = new TWEEN.Tween(target, groupA)
                          .to( { opacity: 0 } , 1000 )
                          .onUpdate(function(){
                            group.children[i].material.opacity = target.opacity;
                            renderer.render(scene, camera);
                          })
                          .onComplete(function(){
                            group.children[i].material.dispose();
                            group.children[i].geometry.dispose();
                            // delete group.children[i]._3xDomEvent;
                            group.children[i]._3xDomEvent = [];
                            group.remove(group.children[i]);
                            if(i === 0){
                              //if end of animation update everytying else
                              groupOnComplete();
                            }
                          })
                          .start();

          })(i);

        };
        controls.reset();
        var target = new THREE.Vector3(camera.position.x - 20, camera.position.y - 200, camera.position.z -  400);
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

        var renderOnMouseClick = function(){
            requestAnimationFrame(renderOnMouseClick);
            TWEEN.update();
            groupA.update();
        };
        requestAnimationFrame(renderOnMouseClick);

        function groupOnComplete(){
          for(var i = 0; i < totalFlrCnt + flrOffset; ++i){
            (function(i){
                var twin = mesh.clone();
                twin.material.dispose();
                twin.geometry.dispose();
                if(i >= totalFlrCnt && flrOffset !== 0){
                  twin.material = new THREE.MeshBasicMaterial( { map: building_texture, transparent: true } );
                }
                else{
                  twin.material = new THREE.MeshPhongMaterial( { map: building_texture, transparent: true } );
                }

                twin.scale.z = 2;
                twin.position.set(-center.x, -center.y, i*8);
                group.add(twin);
            })(i);
          }

          // for(var i = 0; i < flrOffset; ++i){
          //   (function(i){
          //       var twin = mesh.clone();
          //       twin.material.dispose();
          //       twin.geometry.dispose();
          //       twin.material = new THREE.MeshPhongMaterial( { map: building_texture, transparent: true } );
          //
          //       twin.scale.set(1, 1, 1);
          //
          //       var geometry = new THREE.BoxGeometry( size.x / 3, size.y / 3, size.z + 50 );
          //       var material = new THREE.MeshBasicMaterial( { map: building_texture, transparent: true } );
          //       var cube = new THREE.Mesh( geometry, material );
          //       cube.position.z = group.children[group.children.length - 1].position.z + 3 + i * 3;
          //
          //       group.add(cube);
          //       console.log('cube', cube);
          //   })(i);
          // }
          console.log(group.children.length);
          for(var i = group.children.length - 1; i >= 0; --i){
            (function(i){
              domEvents.addEventListener(group.children[i], 'click', function(){
                console.log(group.children[i]);
                var curFlrCnt = i - ugrndFlrCnt;
                curFlrCnt = ( curFlrCnt < 0 ) ? curFlrCnt : curFlrCnt + 1;
                var flrNo = curFlrCnt;
                var flrGbCd = 20;
                if(curFlrCnt > grndFlrCnt){
                  console.log('여기는 옥탑 ' + (curFlrCnt - grndFlrCnt) + '층');
                  flrNo = curFlrCnt - grndFlrCnt;
                  flrGbCd = 30;
                }
                else if(curFlrCnt < 0){
                  console.log('여기는 지하' + curFlrCnt + ' 층');
                  flrGbCd = 10;
                }
                else{
                  console.log('여기는 ' + curFlrCnt + '층임');
                }

                customAjax($SITE_URL + 'get/buildingFlrInfo', {
                    sigunguCd : sigunguCd,
                    bjdongCd : bjdongCd,
                    bun : bun,
                    ji : ji,
                    buildingID : sigunguCd + '-' + buildingID,
                    flrNo : Math.abs(flrNo),
                    flrGbCd : flrGbCd
                  }, function(data){
                    console.log(data);
                  });

              }, false);

              domEvents.addEventListener(group.children[i], 'mouseover', function(){
                console.log('buidling mouseover');
                Rwindow.css('cursor', 'pointer');
                group.children[i].material.opacity = 0.6;
                renderer.render(scene, camera);
              }, false);

              domEvents.addEventListener(group.children[i], 'mouseout', function(){
                console.log('buidling mouseout');
                Rwindow.css('cursor', 'default');
                group.children[i].material.opacity = 1;
                renderer.render(scene, camera);
              }, false);
            })(i);
          }

          group.translateZ(-ugrndFlrCnt * 2);
          controls.update();
          renderer.render(scene, camera);
        };



        // camera.position.y = camera.position.z * 3/10;
        // camera.position.z = 0;
        // mesh.scale.z = 1;
        // console.log(geometry.boundingBox);

      };
    }

  };

  var meshMouseOver = function(type, Rwindow, mesh, target){
    Rwindow.css('cursor', 'pointer');
    // mesh.material.opacity = 0.7;
    console.log(mesh);
    if(type === 'toji'){
      mesh.material.opacity = 0.5;
    }
    if(type === 'building'){
      console.log('building mouseover');
      mesh.material.opacity = 0.5;
      // TWEEN.removeAll();
      // var target = new THREE.Vector3(0, 0, mesh.position.z + 10);
      // animateVector3(new THREE.Vector3(0, 0, mesh.position.z), target, {
      //   duration: 800,
      //   easing: TWEEN.Easing.Quadratic.InOut,
      //   update: function(d){
      //     console.log('updating' , d);
      //     mesh.position.z = d.z;
      //     renderer.render(scene, camera);
      //   }
      // })
      // .repeat(Infinity);
      //
      // var renderOnMouseOver = function(){
      //     requestAnimationFrame(renderOnMouseOver);
      //     TWEEN.update();
      // };
      // requestAnimationFrame(renderOnMouseOver);
    }
  };

  var meshMouseOut = function(type, Rwindow, mesh, target){
    Rwindow.css('cursor', 'default');
    if(type === 'toji'){
      mesh.material.opacity = 1;
    }
    // TWEEN.removeAll();
    if(type === 'building'){
      mesh.material.opacity = 1;
      console.log('mesh mouseout');
      //remove glow
      // if(mesh.children.length > 0){
      //   mesh.children = [];
      // }
      // mesh.position.z = 2;
    }
    renderer.render(scene, camera);
  };

  // animate();
  renderer.render(scene, camera);
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
        .onComplete(function(){
          if(options.callback) options.callback();
        });
    // start the tween
    tweenVector3.start();
    // return the tween in case we want to manipulate it later on
    return tweenVector3;
}

function animate(){
  requestAnimationFrame( animate );
  // render();
}

function degToRad(angle){
  return 3.14 * angle / 360;
}
