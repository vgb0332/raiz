<nav class="navbar raiz-navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#" onclick="javascript:window.location.reload();">
        <img src="<?php echo base_url();?>assets/img/Logo.png" alt="RAIZ">
      </a>
    </div>
    <div class="collapse navbar-collapse" id="raizNavbar">
      <ul class="nav navbar-nav navbar-right">
        <li><a href="<?php echo base_url();?>">HOME</a></li>
        <li><a href="<?php echo base_url();?>map">MAP</a></li>
        <!-- <li><a href="#search">검색</a></li>
        <li><a href="#community">커뮤니티</a></li> -->
        <!-- <li><a href="#contact">CONTACT</a></li> -->
        <li><a href="#signup" >회원가입</a></li>
        <li><a href="#login" data-toggle="modal" data-target="#modalLoginForm">로그인</a></li>
        <!-- <li class="dropdown">
          <a class="dropdown-toggle" data-toggle="dropdown" href="#"> MORE <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="#">Merchandise</a></li>
            <li><a href="#">Extras</a></li>
            <li><a href="#">Media</a></li>
          </ul>
        </li> -->
        <!-- <li><a href="#"><span class="glyphicon glyphicon-search"></span></a></li> -->
      </ul>
    </div>
  </div>
</nav>
