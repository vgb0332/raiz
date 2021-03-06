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

  public function stcsAggrSum() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsAggrSum($code);
  }

  public function stcsTotaljobs() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    echo $this->Statistics->getStcsTotaljobs($code);
  }

  public function stcsHouseType() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsHouseType($code,$type);
  }

  public function stcsTotalHouse() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsTotalHouse($code,$type);
  }

  public function stcsHouseSize() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsHouseSize($code,$type);
  }

  public function stcsHouseHold() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsHouseHold($code,$type);
  }

  public function stcsTotalFamily() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsTotalFamily($code,$type);
  }

  public function stcsJobsPop() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsJobsPop($code,$type);
  }

  public function stcsJobsBiz() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsJobsBiz($code,$type);
  }

  public function stcsSexAge() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsSexAge($code,$type);
  }

  public function stcsOldind() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsOldind($code,$type);
  }

  public function stcsPopdens() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsPopdens($code,$type);
  }

  public function stcsSupportY() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsSupportY($code,$type);
  }

  public function stcsSupportO() {
    $this->load->model('Statistics');
    $code = $this->input->post('currHjstcs');
    $type = $this->input->post('type');
    echo $this->Statistics->getStcsSupportO($code,$type);
  }

        // 서울시 유동인구
  public function youdongPoint() {
    $this->load->model('Statistics');
    $code = $this->input->post('sggcode');
    echo $this->Statistics->getYoudongPoint($code);
  }

  public function youdongValue() {
    $this->load->model('Statistics');
    $code = $this->input->post('code');
    echo $this->Statistics->getYoudongValue($code);
  }

  public function gmtest() {
    $this->load->model('Statistics');
    $code = $this->input->post('code');
    echo $this->Statistics->gmtest($code);
  }

  public function gmSig() {
    $this->load->model('Statistics');
    $code = $this->input->post('code');
    echo $this->Statistics->gmSig($code);
  }

  public function getBJDongPoly() {
    $this->load->model('Statistics');
    $code = $this->input->post('code');
    echo $this->Statistics->getBJDongPoly($code);
  }

  public function getParticBiz() {
    $this->load->model('Statistics');
    $bjdcode = $this->input->post('bjdcode');
    $sggcode = $this->input->post('sggcode');
    echo $this->Statistics->getParticBiz($bjdcode,$sggcode);
  }

  public function getFindArea() {
    $this->load->model('Statistics');
    $code1 = $this->input->post('code1');
    $code2 = $this->input->post('code2');
    $poly = $this->input->post('poly');
    echo $this->Statistics->getFindArea($code1,$code2,$poly);
  }

  public function getFindArea2() {
    $this->load->model('Statistics');
    $code1 = $this->input->post('code1');
    $code2 = $this->input->post('code2');
    $poly = $this->input->post('poly');
    echo $this->Statistics->getFindArea2($code1,$code2,$poly);
  }

  public function getFindArea3() {
    $this->load->model('Statistics');
    $code1 = $this->input->post('code1');
    $code2 = $this->input->post('code2');
    $poly = $this->input->post('poly');
    echo $this->Statistics->getFindArea3($code1,$code2,$poly);
  }

}
