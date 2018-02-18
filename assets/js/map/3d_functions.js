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

  var group = new THREE.Group();
  scene.add( group );

  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( Rwindow.width(), Rwindow.height() - 20 );
  container.append( renderer.domElement );
  var stat = new Stats();
  container.append( stat.dom );

  // load a texture, set wrap mode to repeat
  var toji_texture = new THREE.TextureLoader().load( "./assets/img/grass03.png", function(texture){
    console.log('loaded');
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
  controls.addEventListener( 'change', function(){
    renderer.render(scene, camera);
    var angle = 60 + controls.getAzimuthalAngle() * 180 / Math.PI;
    Rwindow.find(".raiz-compass-pointer").css({
      '-webkit-transform' : 'rotate(' + angle + 'deg)',
      '-moz-transform'    : 'rotate(' + angle + 'deg)',
      '-ms-transform'     : 'rotate(' + angle + 'deg)',
      '-o-transform'      : 'rotate(' + angle + 'deg)',
      'transform'         : 'rotate(' + angle + 'deg)'
    });
  } ); // remove when using animation loop
  // enable animation loop when using damping or autorotation
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  // controls.enablePan = false;

  Rwindow.resize(function(){
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize( Rwindow.width(), Rwindow.height() );
    renderer.render( scene, camera );
  });

  Rwindow.draggable({
    stop: function(event, ui){
      $(this).removeClass("opac");
      $(this).removeClass("full-screen");
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize( Rwindow.width(), Rwindow.height() );
      renderer.render( scene, camera );
    }
  });

  // POLYGON CREATION PROCESS
  console.log(polygons);
  var polyPoints = [];
  // $.each(polygon.Id[0], function(index, target){
  //     polyPoints.push(new THREE.Vector2(target.ib, target.jb));
  // });

  var group = new THREE.Group();
  var toji_mesh, building_mesh;
  var Xoffset, Yoffset;

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
      toji_mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { map: toji_texture } ) );
      var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);
      toji_mesh.scale.set( s, s, s );

      var geometry = toji_mesh.geometry;
      geometry.computeBoundingBox();
      var center = geometry.boundingBox.getCenter();
      var size = geometry.boundingBox.getSize();

      var longLen = size.x > size.y ? size.x : size.y;
      var new_z = initial_camera_ratio * longLen;
      camera.position.z = new_z;
      Xoffset = x - center.x;
      Yoffset = y - center.y;
      toji_mesh.position.set( x - center.x , y - center.y, z  );
      toji_mesh.rotation.set( rx, ry, rz );
      toji_mesh.material.transparent = true;

      var axesHelper = new THREE.AxesHelper( longLen );
      axesHelper.position.y = 0;
      axesHelper.position.x = 0;
      scene.add( axesHelper );

      group.add(toji_mesh);

      // if(!is_mobile){
      //   domEvents.addEventListener(mesh, 'click', meshClick, false);
      //   domEvents.addEventListener(mesh, 'mouseover', meshMouseOver, false);
      //   domEvents.addEventListener(mesh, 'mouseout', meshMouseOut, false);
      // }
      // else{
      //   domEvents.addEventListener(mesh, 'mouseover', meshClick, false);
      // }

    }
    else if(target.hasClass('building-polygon')){
      polyPoints = [];
      $.each(polygon.Id[0], function(index, target){
          polyPoints.push(new THREE.Vector2(target.ib, target.jb));
      });

      var height = parseInt(target.attr('data-height'));
      height = (height === 0) ? 2 : height * bulding_height_ratio;
      console.log(height);
      var poly3D = new THREE.Shape(polyPoints);
      var extrudeSettings = { curveSegments : 20, amount: 1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 1, bevelThickness: height };
      var color = 0x189AD3;
      var x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1;
      var geometry = new THREE.ExtrudeGeometry( poly3D, extrudeSettings );
      building_mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { map: building_texture } ) );
      var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);

      var geometry = building_mesh.geometry;
      geometry.computeBoundingBox();
      var center = geometry.boundingBox.getCenter();
      var size = geometry.boundingBox.getSize();
      console.log(Xoffset);
      building_mesh.scale.set( s, s, s );
      building_mesh.position.set( Xoffset , Yoffset, z  );
      building_mesh.rotation.set( rx, ry, rz );
      building_mesh.translateZ(height + 2);
      building_mesh.material.transparent = true;

      group.add(building_mesh);

      if(!is_mobile){
        domEvents.addEventListener(building_mesh, 'click', function(){
          console.log(height);
        }, false);
        // domEvents.addEventListener(mesh, 'mouseover', meshMouseOver, false);
        // domEvents.addEventListener(mesh, 'mouseout', meshMouseOut, false);
      }
      else{
        // domEvents.addEventListener(mesh, 'mouseover', meshClick, false);
      }
    }
  });

  scene.add(group);

  // var gridHelper = new THREE.GridHelper( 400, 40, 0xffffff, 0xffffff );
	// gridHelper.position.y = 0;
	// gridHelper.position.x = 0;
	// scene.add( gridHelper );
  //
  // var polarGridHelper = new THREE.PolarGridHelper( 200, 16, 8, 64, 0x0000ff, 0x808080 );
	// polarGridHelper.position.y = 0;
	// polarGridHelper.position.x = 0;
	// scene.add( polarGridHelper );

  var meshClick = function(event){
    console.log('you clicked on the mesh', mesh);
    Rwindow.find('.toji-possession').fadeIn();
    var initial_x = 0;
    var initial_y = 0;
    var initial_z = new_z;
    var target_y = initial_z * Math.tan(degToRad(-90));
    var flagX = false, flagY = false, flagZ = false;

    var delta_x = camera.position.x - initial_x;
    var delta_y = camera.position.y - target_y;
    var delta_z = camera.position.z - initial_z;
    var frames = 100;

    controls.enabled = false;
    var renderOnClick = function(){
      if(flagX == true && flagY == true && flagZ == true){
        controls.enabled = true;
        return false;
      }
      requestAnimationFrame(renderOnClick);
      // controls.update();
      if(Math.trunc(camera.position.x) === Math.trunc(initial_x)){
        flagX = true;
      }
      else if(!flagX){
        camera.position.x -= ( delta_x / frames );
      }

      if(Math.trunc(camera.position.y) === Math.trunc(target_y)){
        flagY = true;
      }
      else if(!flagY){
        camera.position.y -= ( delta_y / frames );
      }

      if(Math.trunc(camera.position.z) === Math.trunc(initial_z)){
        flagZ = true;
      }
      else if(!flagZ){
        camera.position.z -= ( delta_z / frames );
      }

      camera.lookAt(scene.position);
      controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(function(){
      requestAnimationFrame(renderOnClick);
      renderOnClick();
    });
  };

  var meshMouseOver = function(event){
    Rwindow.css('cursor', 'pointer');
    console.log('you mouse on the mesh');
    // mesh.material.color.setHex(0xd9fceb);
    mesh.material.opacity = 0.7;
    renderer.render(scene, camera);
  };

  var meshMouseOut = function(event){
    Rwindow.css('cursor', 'default');
    console.log('you mouse out the mesh');
    // mesh.material.color.setHex(0x46d78f);
    mesh.material.opacity = 1;
    renderer.render(scene, camera);
  };

  // animate();
  renderer.render(scene, camera);
}

function animate(){
  requestAnimationFrame( animate );
  // render();
}

function degToRad(angle){
  return 3.14 * angle / 360;
}
