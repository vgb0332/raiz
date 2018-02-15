const initial_camera_ratio = 6/7;

function THREE_init(polygon, data, Rwindow){
  var container = Rwindow.find('.raiz-window-body');
  var scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  var camera = new THREE.PerspectiveCamera( 90, 1, 1, 2000 );
  camera.position.set( 0, 0, 500 );

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

        renderer.autoClear = false;
        renderer.setFaceCulling( THREE.CullFaceNone );

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
  controls.enablePan = false;

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

  var polyPoints = [];

  $.each(polygon.Id[0], function(index, target){
      polyPoints.push(new THREE.Vector2(target.ib, target.jb));
  });

  var poly3D = new THREE.Shape(polyPoints);
  var extrudeSettings = { curveSegments : 20, amount: 1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 1, bevelThickness: 3 };
  var color = 0x725428;
  var x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1;
  var geometry = new THREE.ExtrudeGeometry( poly3D, extrudeSettings );
  var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
  var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);
  mesh.scale.set( s, s, s );

  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = geometry.boundingBox.getCenter();
  var size = geometry.boundingBox.getSize();

  var longLen = size.x > size.y ? size.x : size.y;
  var new_z = initial_camera_ratio * longLen;
  camera.position.z = new_z;

  mesh.position.set( x - center.x , y - center.y, z  );
  mesh.rotation.set( rx, ry, rz );
  mesh.material.transparent = true;



  var group = new THREE.Group();
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

  var axesHelper = new THREE.AxesHelper( longLen );
  axesHelper.position.y = 0;
	axesHelper.position.x = 0;
  scene.add( axesHelper );

  group.add(mesh);

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

  if(!is_mobile){
    domEvents.addEventListener(mesh, 'click', meshClick, false);
    domEvents.addEventListener(mesh, 'mouseover', meshMouseOver, false);
    domEvents.addEventListener(mesh, 'mouseout', meshMouseOut, false);
  }
  else{
    domEvents.addEventListener(mesh, 'mouseover', meshClick, false);
  }


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
