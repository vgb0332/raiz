"use strict"


if ( ! Detector.webgl ) alert('webGL needed');
var container, stats;
var camera, scene, renderer, raycaster;
var group;
// var controls;
// var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;

// polygon_init(Rwindow);
// animate();
function polygon_init(Rwindow) {
    container = Rwindow;
    console.log(container.width(), container.height());
  	scene = new THREE.Scene();
  	scene.background = new THREE.Color( 0xffffff );
  	camera = new THREE.PerspectiveCamera( 90, 1, 1, 2000 );
  	camera.position.set( 0, 0, 500 );
    raycaster = new THREE.Raycaster();
  	scene.add( camera );
  	var light = new THREE.PointLight( 0xffffff, 0.8 );
  	camera.add( light );
  	group = new THREE.Group();
  	// group.position.y = -100;
    // group.position.x = 100;
  	scene.add( group );

  	renderer = new THREE.WebGLRenderer( { antialias: true } );
  	renderer.setPixelRatio( window.devicePixelRatio );
  	renderer.setSize( container.width() - 10, container.height() - 10 );
  	container.append( renderer.domElement );
  	stats = new Stats();
  	container.append( stats.dom );
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
  	controls.addEventListener( 'change', render ); // remove when using animation loop
  	// enable animation loop when using damping or autorotation
  	//controls.enableDamping = true;
  	//controls.dampingFactor = 0.25;
  	controls.enableZoom = true;
  	// Rwindow.on( 'resize', onWindowResize, false );
}

function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
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

function onWindowResize(e) {
  console.log('window resizing');
  console.log(e);
	camera.aspect = 1;
	camera.updateProjectionMatrix();
	renderer.setSize( Rwindo, 500 );
}

function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}
function render() {

	renderer.render( scene, camera );
}
