"use strict"

// var container, stats;
// var camera, scene, renderer;
// var group;

function insert3D(Rwindow, polygon){
  var container = Rwindow.find(".raiz-window-body");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 90, 1, 1, 2000 );
  var light = new THREE.PointLight( 0xffffff, 0.8 );
  var group = new THREE.Group();

  scene.background = new THREE.Color( 0xffffff );
  camera.position.set( 0, 0, 500 );
  scene.add( camera );
  camera.add( light );
  scene.add( group );

  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( 500, 500 );
  container.append( renderer.domElement );
  var stats = new Stats();
  container.append( stats.dom );
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render ); // remove when using animation loop
  // enable animation loop when using damping or autorotation
  //controls.enableDamping = true;
  //controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  console.log(Rwindow);
  Rwindow.on( 'resize', onWindowResize);

  var polyPoints = [];

  $.each(polygon.Id[0], function(index, target){
      polyPoints.push(new THREE.Vector2(target.ib, target.jb));
  });

  var poly3D = new THREE.Shape(polyPoints);
  var extrudeSettings = { curveSegments : 20, amount: 1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 1, bevelThickness: 3 };
  addShape( scene, camera, renderer, poly3D,  extrudeSettings, 0x46d78f, 0, 0, 0, 0, 0, 0, 1 );
  animate(renderer, scene, camera);
}


function addShape( scene, camera, renderer, shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
  var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);
  // mesh.position.set( x - 500 , y - 600, z  );
  // mesh.rotation.set( rx, ry, rz );
  mesh.scale.set( s, s, s );

  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = geometry.boundingBox.getCenter();
  mesh.position.set( x - center.x , y - center.y, z  );
  mesh.rotation.set( rx, ry, rz );
  domEvents.addEventListener(mesh, 'click', function(event){
    console.log('you clicked on the mesh');

  }, false);
  domEvents.addEventListener(mesh, 'mouseover', function(event){
    $(".raiz-window-body").css('cursor', 'pointer');
    console.log('you mouse on the mesh');
    mesh.material.color.setHex(0x123456);
  }, false);

  domEvents.addEventListener(mesh, 'mouseout', function(event){
    $(".raiz-window-body").css('cursor', 'default');
    console.log('you mouse on the mesh');
    mesh.material.color.setHex(0x46d78f);
  }, false);
  scene.add(mesh);
}

function onWindowResize() {
	camera.aspect = 1;
	camera.updateProjectionMatrix();
	renderer.setSize( Rwindow.width(), Rwindow.height() );
}

function animate(renderer, scene, camera) {
	requestAnimationFrame( animate );
	render( renderer, scene, camera);
	stats.update();
}

function render( renderer , scene, camera ) {
  console.log(renderer);
	renderer.render( scene, camera );
}
