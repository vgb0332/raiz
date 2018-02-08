"use strict"


if ( ! Detector.webgl ) alert('webGL needed');
var container, stats;
var camera, scene, renderer;
var group, controls;

polygon_init();
animate();
function polygon_init() {
    container = $(".raiz-window-body");
  	scene = new THREE.Scene();
  	scene.background = new THREE.Color( 0x000000 );
  	camera = new THREE.PerspectiveCamera( 90, 1, 1, 1000 );
  	camera.position.set( 0, 0, 500 );
    // camera.lookAt(scene.position);

  	scene.add( camera );
  	var light = new THREE.PointLight( 0xffffff, 0.8 );
  	camera.add( light );
  	group = new THREE.Group();
  	// group.position.y = -100;
    // group.position.x = 100;
  	scene.add( group );
  	// var loader = new THREE.TextureLoader();
  	// var texture = loader.load( "textures/UV_Grid_Sm.jpg" );
  	// it's necessary to apply these settings in order to correctly display the texture on a shape geometry
  	// texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  	// texture.repeat.set( 0.008, 0.008 );

  	// California
  	var californiaPts = [];
  	californiaPts.push( new THREE.Vector2( 610, 320 ) );
  	californiaPts.push( new THREE.Vector2( 450, 300 ) );
  	californiaPts.push( new THREE.Vector2( 392, 392 ) );
  	californiaPts.push( new THREE.Vector2( 266, 438 ) );
  	californiaPts.push( new THREE.Vector2( 190, 570 ) );
    californiaPts.push( new THREE.Vector2( 610, 320 ) );
  	// californiaPts.push( new THREE.Vector2( 190, 600 ) );
  	// californiaPts.push( new THREE.Vector2( 160, 620 ) );
  	// californiaPts.push( new THREE.Vector2( 160, 650 ) );
  	// californiaPts.push( new THREE.Vector2( 180, 640 ) );
  	// californiaPts.push( new THREE.Vector2( 165, 680 ) );
  	// californiaPts.push( new THREE.Vector2( 150, 670 ) );
  	// californiaPts.push( new THREE.Vector2(  90, 737 ) );
  	// californiaPts.push( new THREE.Vector2(  80, 795 ) );
  	// californiaPts.push( new THREE.Vector2(  50, 835 ) );
  	// californiaPts.push( new THREE.Vector2(  64, 870 ) );
  	// californiaPts.push( new THREE.Vector2(  60, 945 ) );
  	// californiaPts.push( new THREE.Vector2( 300, 945 ) );
  	// californiaPts.push( new THREE.Vector2( 300, 743 ) );
  	// californiaPts.push( new THREE.Vector2( 600, 473 ) );
  	// californiaPts.push( new THREE.Vector2( 626, 425 ) );
  	// californiaPts.push( new THREE.Vector2( 600, 370 ) );
  	// californiaPts.push( new THREE.Vector2( 610, 320 ) );

  	for( var i = 0; i < californiaPts.length; i ++ ) {
      californiaPts[ i ].multiplyScalar( 0.25 );
      console.log(californiaPts[i]);
    }
    //
  	var californiaShape = new THREE.Shape( californiaPts );
  	var extrudeSettings = { amount: 1, bevelEnabled: true, bevelSegments: 1, steps: 2, bevelSize: 10, bevelThickness: 1 };
  	// addShape( californiaShape,  extrudeSettings, 0x46d78f, 0, 0, 0, 0, 0, 0, 1 );

  	renderer = new THREE.WebGLRenderer( { antialias: true } );
  	renderer.setPixelRatio( window.devicePixelRatio );
  	renderer.setSize( 500, 500 );
  	container.append( renderer.domElement );
  	stats = new Stats();
  	container.append( stats.dom );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
  	controls.addEventListener( 'change', render ); // remove when using animation loop
  	// enable animation loop when using damping or autorotation
  	//controls.enableDamping = true;
  	//controls.dampingFactor = 0.25;
  	controls.enableZoom = true;

    // var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    // var helper = new THREE.CameraHelper( camera );
    // helper.pointMap = true;
    // scene.add( helper );
    var axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

  	window.addEventListener( 'resize', onWindowResize, false );
}

function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
  console.log('shape:' ,shape);
  // flat shape
  shape.moveTo(0,0,0);
	var geometry = new THREE.ShapeBufferGeometry( shape );
	var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } ) );
	mesh.position.set( x - 120 , y - 37, z );
	mesh.rotation.set( rx, ry, rz );
	mesh.scale.set( s, s, s );
  // camera.lookAt(mesh.position);
	// scene.add( mesh );

  console.log(mesh);
  // addLineShape( shape, color, x, y, z, rx, ry, rz, s );

  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
  mesh.position.set( x - 500 , y - 370, z  );
  mesh.rotation.set( rx, ry, rz );
  mesh.scale.set( s, s, s );
  console.log('mesh position: ' , mesh.position);
  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = geometry.boundingBox.getCenter();
  console.log(center);
  scene.add(mesh);




  // addLineShape( shape, color, x, y, z, rx, ry, rz, s );
}
function addLineShape( shape, color, x, y, z, rx, ry, rz, s ) {
  // lines
  shape.autoClose = true;
  var points = shape.getPoints();
  var spacedPoints = shape.getSpacedPoints( 50 );
  var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
  var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );
  // solid line
  var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: color, linewidth: 3 } ) );
  line.position.set( x, y, z - 25 );
  line.rotation.set( rx, ry, rz );
  line.scale.set( s, s, s );
  group.add( line );
  // line from equidistance sampled points
  var line = new THREE.Line( geometrySpacedPoints, new THREE.LineBasicMaterial( { color: color, linewidth: 3 } ) );
  line.position.set( x, y, z + 25 );
  line.rotation.set( rx, ry, rz );
  line.scale.set( s, s, s );
  group.add( line );
  // vertices from real points
  var particles = new THREE.Points( geometryPoints, new THREE.PointsMaterial( { color: color, size: 4 } ) );
  particles.position.set( x, y, z + 75 );
  particles.rotation.set( rx, ry, rz );
  particles.scale.set( s, s, s );
  group.add( particles );
  // equidistance sampled points
  var particles = new THREE.Points( geometrySpacedPoints, new THREE.PointsMaterial( { color: color, size: 4 } ) );
  particles.position.set( x, y, z + 125 );
  particles.rotation.set( rx, ry, rz );
  particles.scale.set( s, s, s );
  group.add( particles );
}

function onWindowResize() {
	camera.aspect = 1;
	camera.updateProjectionMatrix();
	renderer.setSize( 500, 500 );
}

function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}
function render() {
	// group.rotation.y +=  0.05;
  // console.log(camera.position);
	renderer.render( scene, camera );
}
