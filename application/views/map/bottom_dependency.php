
<!-- MDB -->
<link href="<?php echo base_url();?>assets/vendor/mdb/mdb.min.css" rel="stylesheet">
<?php if($browser !== 'Internet Explorer'){ ?>
  <script src="<?php echo base_url();?>assets/vendor/mdb/mdb.min.js"></script>
<?php
 }
 ?>

<!-- DOM4 -->
<script src="<?php echo base_url();?>assets/vendor/dom4/dom4.min.js"></script>
<!-- SVG JS -->

<!-- OWN CSS FILES(FOR OVERRIDDING, ALWAYS AFTER VENDOR CSS, JS FILES PLEASE) -->
<link href="<?php echo base_url();?>assets/css/common.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/map.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/polygon.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/themify-icons.css" rel="stylesheet">

<!-- GHUNCSS -->
<link href="<?php echo base_url();?>assets/css/ghun.css" rel="stylesheet">

<!-- OWN JS FILES -->
<script src="<?php echo base_url();?>assets/js/common/global_variable.js"></script>
<script src="<?php echo base_url();?>assets/js/map/map_variable.js"></script>
<script src="<?php echo base_url();?>assets/js/map/raiz_window.js"></script>
<script src="<?php echo base_url();?>assets/js/map/raiz_controller.js"></script>
<script src="<?php echo base_url();?>assets/js/common/global_functions.js"></script>
<script src="<?php echo base_url();?>assets/js/map/daum_functions.js"></script>
<script src="<?php echo base_url();?>assets/js/map/map_functions.js"></script>
<script src="<?php echo base_url();?>assets/js/map/main_activity.js"></script>
<!-- <script src="<?php echo base_url();?>assets/js/map/3dtest.js"></script> -->
<!-- <script src="<?php echo base_url();?>assets/js/map/3d_functions.js"></script> -->
<script src="<?php echo base_url();?>assets/js/map/3d_functions2.js"></script>
<script src="<?php echo base_url();?>assets/js/map/statistics.js"></script>

<!-- MOBILE CHECK -->
<!-- is_mobile variable can be checked in common/global_variable.js default is false -->
<?php
if($is_mobile){
?>
  <script type="text/javascript">  is_mobile = true; </script>
<?php
}
?>
