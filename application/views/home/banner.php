<!-- BANNER -->
<div id="myCarousel" class="carousel slide" data-ride="carousel">
    <!-- Indicators -->
    <ol class="carousel-indicators">
      <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
      <li data-target="#myCarousel" data-slide-to="1"></li>
      <li data-target="#myCarousel" data-slide-to="2"></li>
      <li data-target="#myCarousel" data-slide-to="3"></li>
    </ol>

    <!-- Wrapper for slides -->
    <div class="carousel-inner" role="listbox">
      <div class="item active">
        <!-- <img src="ny.jpg" alt="New York" width="1200" height="700"> -->
        <img src="<?php echo base_url();?>assets/gif/banner.gif">
        <div class="carousel-caption">
          <h3>REAL ESTATE PLATFORM</h3>
          <!-- <p>The atmosphere in New York is lorem ipsum.</p> -->
        </div>
      </div>

      <div class="item">
        <img src="<?php echo base_url();?>assets/img/banner4.jpg">
        <div class="carousel-caption">
          <h3>REAL ESTATE PLATFORM</h3>
        </div>
      </div>

      <div class="item">
        <img src="<?php echo base_url();?>assets/img/banner5.jpg">
        <div class="carousel-caption">
          <h3>REAL ESTATE PLATFORM</h3>
        </div>
      </div>

      <div class="item">
        <img src="<?php echo base_url();?>assets/img/banner6.jpg">
        <div class="carousel-caption">
          <h3>REAL ESTATE PLATFORM</h3>
        </div>
      </div>
    </div>

    <!-- Left and right controls -->
    <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
</div>
