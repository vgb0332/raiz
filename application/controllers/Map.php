<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Map extends CI_Controller {
  public function __construct() {
   parent::__construct();
   $this->load->helper('url');
   $this->load->library('user_agent');
  }

	public function index() {
    if ($this->agent->is_mobile()) {
      //if mobile
      echo 'mobile ^^';
    }
    else {
      //if web
      $this->load->view('home/head');
      $this->load->view('map/top_dependency');
      $this->load->view('map/daum_map');
      $this->load->view('home/navbar');
      $this->load->view('map/raiz_side_tab');
      $this->load->view('map/raiz_controller');
      $this->load->view('map/map_controller');
      $this->load->view('map/raiz_window');
      $this->load->view('map/map_footer');
      $this->load->view('map/bottom_dependency');
    }
	}
}
