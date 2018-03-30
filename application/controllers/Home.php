<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {
	public function __construct() {
	 parent::__construct();
	 $this->load->helper('url');
	}

	public function index()	{
		$this->load->view('home/head');
		$this->load->view('home/dependency');
		$this->load->view('home/body');
		$this->load->view('home/navbar');
		$this->load->view('home/banner');
		$this->load->view('home/intro');
		// $this->load->view('home/section_notitle');
		$this->load->view('home/contact');
		$this->load->view('common/login');
		$this->load->view('common/signup');
		// $this->load->view('common/flash_modal');
		$this->load->view('home/footer');
	}
}

?>
