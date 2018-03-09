<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class GetStcs extends CI_Controller {

	/**
	 * Get Page for this controller.
	 *
	 */
  public function __construct() {
   parent::__construct();
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

  public function stcsTotaljobs() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsTotaljobs($code);
  }

  public function stcsHouseType() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsHouseType($code);
  }

  public function stcsTotalHouse() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsTotalHouse($code);
  }

  public function stcsHouseSize() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsHouseSize($code);
  }

  public function stcsHouseHold() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsHouseHold($code);
  }

  public function stcsTotalFamily() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsTotalFamily($code);
  }

  public function stcsJobsPop() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsJobsPop($code);
  }

  public function stcsJobsBiz() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsJobsBiz($code);
  }

  public function stcsSexAge() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsSexAge($code);
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

  public function stcsSupportY() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsSupportY($code);
  }

  public function stcsSupportO() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsSupportO($code);
  }


}
