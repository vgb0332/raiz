<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Get extends CI_Controller {

	/**
	 * Get Page for this controller.
	 *
	 */
  public function __construct() {
   parent::__construct();
  }

  public function singlePolygon() {
    /*
      it takes POST variable - bjdongCd, lat, lng
    */
    $this->load->model('Polygon');
    $data = array (
      'type' => 'single',
      'bjdongCd' => $this->input->post('bjdongCd'),
      'lat' => $this->input->post('lat'),
      'lng' => $this->input->post('lng')
    );

    echo $this->Polygon->getPolyInfo($data);
  }
}
