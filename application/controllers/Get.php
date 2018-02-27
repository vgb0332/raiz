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

  public function buildingFlrInfo(){
    $this->load->model('Building');
    $data = array (
      'type' => 'brFlrInfo',
      'sigunguCd' => $this->input->post('sigunguCd'),
      'bjdongCd' => $this->input->post('bjdongCd'),
      'bun' => $this->input->post('bun'),
      'ji' => $this->input->post('ji'),
      'buildingID' => $this->input->post('buildingID'),
      'flrNo' => $this->input->post('flrNo'),
      'flrGbCd' => $this->input->post('flrGbCd')
    );

    echo $this->Building->getBuildingInfo($data);
  }

  public function buildingTitleInfo(){
    $this->load->model('Building');
    $data = array (
      'type' => 'brTitleInfo',
      'sigunguCd' => $this->input->post('sigunguCd'),
      'bjdongCd' => $this->input->post('bjdongCd'),
      'bun' => $this->input->post('bun'),
      'ji' => $this->input->post('ji'),
      'buildingID' => $this->input->post('buildingID')
    );

    echo $this->Building->getBuildingInfo($data);
  }

  public function tojiIndivPrice() {
    $this->load->model('Toji');
    $data = array (
      'type' => 'indivPrice',
      'sigunguCd' => $this->input->post('sigunguCd'),
      'bjdongCd' => $this->input->post('bjdongCd'),
      'bun' => $this->input->post('bun'),
      'ji' => $this->input->post('ji')
    );

    echo $this->Toji->getTojiInfo($data);
  }

  public function tojiUsage(){
    $this->load->model('Toji');
    $data = array (
      'type' => 'usage',
      'sigunguCd' => $this->input->post('sigunguCd'),
      'bjdongCd' => $this->input->post('bjdongCd'),
      'bun' => $this->input->post('bun'),
      'ji' => $this->input->post('ji')
    );

    echo $this->Toji->getTojiInfo($data);
  }

  public function tojiPossession() {
    $this->load->model('Toji');
    $data = array (
      'type' => 'possession',
      'sigunguCd' => $this->input->post('sigunguCd'),
      'bjdongCd' => $this->input->post('bjdongCd'),
      'bun' => $this->input->post('bun'),
      'ji' => $this->input->post('ji')
    );

    echo $this->Toji->getTojiInfo($data);
  }

}
