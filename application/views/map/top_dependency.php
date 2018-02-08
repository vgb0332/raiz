  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">

  <!-- JQUERY -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.css">
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>

  <!-- BOOTSTRAP -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

  <!-- DAUM KAKAO -->
  <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=a85645def53cba1df9f4bc7ada5bd6dd&libraries=clusterer,services,drawing"></script>

  <!-- NAVER -->

  <!-- GOOGLE -->

  <!-- THREE.JS -->
  <script src="<?php echo base_url();?>assets/vendor/three/three.min.js"></script>
  <script src="<?php echo base_url();?>assets/vendor/three/Detector.js"></script>
  <script src="<?php echo base_url();?>assets/vendor/three/controls/OrbitControls.js"></script>
  <script src="<?php echo base_url();?>assets/vendor/three/libs/stats.min.js"></script>
  <script src="<?php echo base_url();?>assets/vendor/three/renderers/Projector.js"></script>

  <style media="screen">
      .no-js #loader { display: none;  }
      .js #loader { display: block; position: absolute; left: 100px; top: 0; }
      .se-pre-con {
      position: fixed;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: url(assets/gif/loading.gif) center no-repeat #fff;
    }
  </style>
</head>
<!-- LOADER -->
<div class="se-pre-con"></div>
<script type="text/javascript">
  $(window).on('load', function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
  });
</script>
