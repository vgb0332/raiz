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

  public function statscSido() {
    $this->load->model('Statistics');
    echo $this->Statistics->getStcsSido();
  }

  public function statscSgg() {
    $this->load->model('Statistics');
    $code = $this->input->post('sggcode');
    echo $this->Statistics->getStcsSgg($code);
  }

  public function statscDong() {
    $this->load->model('Statistics');
    $code = $this->input->post('dongcode');
    echo $this->Statistics->getStcsDong($code);
  }

  public function statscAggr() {
    $this->load->model('Statistics');
    $code = $this->input->post('aggrcode');
    echo $this->Statistics->getStcsAggr($code);
  }

  public function stcsOldind() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsOldind($code);
  }

  public function stcsPopdens() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsPopdens($code);
  }

  public function stcsTotaljobs() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsTotaljobs($code);
  }


}
