const initial_camera_ratio = 6/7;

function THREE_init(polygon, data, Rwindow){
  var container = Rwindow.find('.raiz-window-body');
  var scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0x000000 );

  var camera = new THREE.PerspectiveCamera( 90, 1, 1, 2000 );
  camera.position.set( 0, 0, 500 );

  scene.add( camera );
  var light = new THREE.PointLight( 0xffffff, 0.8 );
  camera.add( light );

        var cameraCube = new THREE.PerspectiveCamera( 90, 1, 1, 2000 );
        var sceneCube = new THREE.Scene();
        // Textures
				var r = "assets/img/3dtest/";
				var urls = [ r + "posx.jpg", r + "negx.jpg",
							 r + "posy.jpg", r + "negy.jpg",
							 r + "posz.jpg", r + "negz.jpg" ];
				textureCube = new THREE.CubeTextureLoader().load( urls );
				textureCube.format = THREE.RGBFormat;
				textureCube.mapping = THREE.CubeReflectionMapping;
				var textureLoader = new THREE.TextureLoader();
				textureEquirec = textureLoader.load( "assets/img/3dtest/2294472375_24a3b8ef46_o.jpg" );
				textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
				textureEquirec.magFilter = THREE.LinearFilter;
				textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;
				// textureSphere = textureLoader.load( "textures/metal.jpg" );
				// textureSphere.mapping = THREE.SphericalReflectionMapping;
        // Materials
				var equirectShader = THREE.ShaderLib[ "equirect" ];
				var equirectMaterial = new THREE.ShaderMaterial( {
					fragmentShader: equirectShader.fragmentShader,
					vertexShader: equirectShader.vertexShader,
					uniforms: equirectShader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );
				equirectMaterial.uniforms[ "tEquirect" ].value = textureEquirec;
				var cubeShader = THREE.ShaderLib[ "cube" ];
				var cubeMaterial = new THREE.ShaderMaterial( {
					fragmentShader: cubeShader.fragmentShader,
					vertexShader: cubeShader.vertexShader,
					uniforms: cubeShader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );
				cubeMaterial.uniforms[ "tCube" ].value = textureCube;
				// Skybox
				cubeMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 100, 100, 100 ), cubeMaterial );
				sceneCube.add( cubeMesh );

        var geometry = new THREE.SphereBufferGeometry( 400.0, 48, 24 );
				sphereMaterial = new THREE.MeshLambertMaterial( { envMap: textureCube } );
				sphereMesh = new THREE.Mesh( geometry, sphereMaterial );
				scene.add( sphereMesh );



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
    console.log(controls.getAzimuthalAngle() * 180 / Math.PI);
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

  var longLen = size.x > size.y ? size.x : size.y;
  var new_z = initial_camera_ratio * longLen;
  camera.position.z = new_z;

  mesh.position.set( x - center.x , y - center.y, z  );
  mesh.rotation.set( rx, ry, rz );

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

  domEvents.addEventListener(mesh, 'click', function(event){
    console.log('you clicked on the mesh');
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
      console.log('function called', flagX, flagY, flagZ);
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

  }, false);
  domEvents.addEventListener(mesh, 'mouseover', function(event){
    console.log(mesh);
    Rwindow.css('cursor', 'pointer');
    console.log('you mouse on the mesh');
    mesh.material.color.setHex(0xd9fceb);
    renderer.render(scene, camera);

  }, false);

  domEvents.addEventListener(mesh, 'mouseout', function(event){
      Rwindow.css('cursor', 'default');
      console.log('you mouse out the mesh');
      mesh.material.color.setHex(0x46d78f);
      renderer.render(scene, camera);
  }, false);

  // animate();
  renderer.render(scene, camera);

        renderer.render( sceneCube, cameraCube );

}

function animate(){
  requestAnimationFrame( animate );
  // render();
}


function onWindowResize(){
  console.log('resziing?');
}

function degToRad(angle){
  return 3.14 * angle / 360;
}
