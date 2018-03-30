<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Email extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->helper('url');
    $this->load->library('email');

    $config = array(
    	'protocol' => "smtp",
    	'smtp_host' => "ssl://smtp.gmail.com",
    	'smtp_port' => "465",//"587", // 465 나 587 중 하나를 사용
    	'smtp_user' => "rego3338@gmail.com",
    	'smtp_pass' => "7982dydtjr",
    	'charset' => "utf-8",
    	'mailtype' => "html",
    	'smtp_timeout' => 10,
    );
    $this->email->initialize($config);
    // $this->email->set_mailtype("html");
	}

  public function request(){
    $sender_name = $this->input->post('name');
    $sender_email = $this->input->post('email');
    $sender_comments = $this->input->post('comments');

    $this->email->set_newline("\r\n");
    $this->email->from('rego3338@gmail.com', $sender_email . ' ' . $sender_name);
    $this->email->to('rego3338@gmail.com');
    $this->email->cc('vgb000123@gmail.com');
    $this->email->cc('raiz.help@gmail.com');
		$this->email->cc('jooyee7348@gmail.com');
    // $this->email->bcc('them@their-example.com');

    $this->email->subject($sender_name . ' ' . $sender_email);
    $this->email->message($sender_comments);
    //
    if($this->email->send()) {
      echo json_encode('success');
    } else {
    	echo json_encode('fail');
    }
    //
    // $this->session->set_flashdata('request_message', $message);
    // $this->load->library('user_agent');
    // redirect($this->agent->referrer());
  }
}

?>
