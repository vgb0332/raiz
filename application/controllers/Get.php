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

  public function storeSilPolygon(){
    $this->load->model('Polygon');
    $data = array (
      'type' => 'storeSil',
      'bjdongCd' => $this->input->post('bjdongCd'),
      'filter_type' => $this->input->post('filter_type'),
      'filter_value' => $this->input->post('filter_value')
    );

    echo $this->Polygon->getPolyInfo($data);
  }

  public function tojiSilPolygon(){
    $this->load->model('Polygon');
    $data = array (
      'type' => 'tojiSil',
      'bjdongCd' => $this->input->post('bjdongCd'),
      'filter_type' => $this->input->post('filter_type'),
      'filter_value' => $this->input->post('filter_value')
    );

    echo $this->Polygon->getPolyInfo($data);
  }

  public function rhouseSilPolygon(){
    $this->load->model('Polygon');
    $data = array (
      'type' => 'rhouseSil',
      'bjdongCd' => $this->input->post('bjdongCd'),
      'filter_type' => $this->input->post('filter_type'),
      'filter_value' => $this->input->post('filter_value')
    );

    echo $this->Polygon->getPolyInfo($data);
  }

  public function aptSilPolygon(){
    $this->load->model('Polygon');
    $data = array (
      'type' => 'aptSil',
      'bjdongCd' => $this->input->post('bjdongCd'),
      'filter_type' => $this->input->post('filter_type'),
      'filter_value' => $this->input->post('filter_value')
    );

    echo $this->Polygon->getPolyInfo($data);
  }

  public function buildingSingleFlrInfo(){
    $this->load->model('Building');
    $data = array (
      'type' => 'brSingleFlrInfo',
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

  public function buildingFlrInfo(){
    $this->load->model('Building');
    $data = array (
      'type' => 'brFlrInfo',
      'sigunguCd' => $this->input->post('sigunguCd'),
      'bjdongCd' => $this->input->post('bjdongCd'),
      'bun' => $this->input->post('bun'),
      'ji' => $this->input->post('ji'),
      'buildingID' => $this->input->post('buildingID'),
    );

    echo $this->Building->getBuildingInfo($data);
  }

  public function buildingPubInfo(){
    $this->load->model('Building');
    $data = array (
      'type' => 'brPubInfo',
      'sigunguCd' => $this->input->post('sigunguCd'),
      'bjdongCd' => $this->input->post('bjdongCd'),
      'bun' => $this->input->post('bun'),
      'ji' => $this->input->post('ji'),
      'buildingID' => $this->input->post('buildingID'),
      'dongNm' => $this->input->post('dongNm')
    );

    echo $this->Building->getBuildingInfo($data);
  }

  public function buildingRecapTitleInfo(){
    $this->load->model('Building');
    $data = array (
      'type' => 'brRecapTitleInfo',
      'sigunguCd' => $this->input->post('sigunguCd'),
      'bjdongCd' => $this->input->post('bjdongCd'),
      'bun' => $this->input->post('bun'),
      'ji' => $this->input->post('ji'),
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
