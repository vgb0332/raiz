
function THREE_init(polygon, data, Rwindow){
  var container = Rwindow.find('.raiz-window-body');
  var scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  var camera = new THREE.PerspectiveCamera( 90, 1, 1, 2000 );
  camera.position.set( 0, 0, 500 );
  raycaster = new THREE.Raycaster();
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
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', function(){
    renderer.render(scene, camera);
    console.log(camera.position);
  } ); // remove when using animation loop
  // enable animation loop when using damping or autorotation
  //controls.enableDamping = true;
  //controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  scene.add( new THREE.AxesHelper( 20 ) );

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
  var color = 0x46d78f;
  var x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1;
  var geometry = new THREE.ExtrudeGeometry( poly3D, extrudeSettings );
  var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
  var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);
  mesh.scale.set( s, s, s );

  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = geometry.boundingBox.getCenter();
  var size = geometry.boundingBox.getSize();

  var len = size.x > size.y ? size.x : size.y;
  var new_z = 5 * len / 7;
  camera.position.z = new_z;
  mesh.position.set( x - center.x , y - center.y, z  );
  mesh.rotation.set( rx, ry, rz );
  var group = new THREE.Group();
  scene.add(group);
  group.add(mesh);

  domEvents.addEventListener(mesh, 'click', function(event){
    console.log('you clicked on the mesh');
    for(var i = 0; i < 10000000; ++i){
      group.rotation.y += 0.005;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }


  }, false);
  domEvents.addEventListener(mesh, 'mouseover', function(event){
    console.log(mesh);
    Rwindow.css('cursor', 'pointer');
    console.log('you mouse on the mesh');
    mesh.material.color.setHex(0xffffff);
    renderer.render(scene, camera);

  }, false);

  domEvents.addEventListener(mesh, 'mouseout', function(event){
      Rwindow.css('cursor', 'default');
      console.log('you mouse out the mesh');
      mesh.material.color.setHex(0x46d78f);
      renderer.render(scene, camera);
  }, false);

  animate();
  renderer.render(scene, camera);

}

function animate(){
  requestAnimationFrame( animate );
  // render();
}


function onWindowResize(){
  console.log('resziing?');
}
