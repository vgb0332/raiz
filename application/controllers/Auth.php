<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {
  public function __construct() {
   parent::__construct();
   $this->load->helper('url');
  }

  public function raiz_login() {

    $this->load->model('user');
    $user = $this->user->getByEmailNType(
        array(
          'email' => $this->input->post('email'),
          'type' => 'raiz'
        )
    );


    if($this->input->post('email') == $user->email && password_verify($this->input->post('password'), $user->password)){

      $this->session->set_userdata('is_login', true);
      $this->session->set_userdata('type', 'raiz');
      $this->session->set_userdata('email', $user->email);
      $this->session->set_userdata('nickname', $user->nickname);
      $this->load->library('user_agent');
      echo json_encode('success');

    }
    else{
      echo json_encode('error');
    }

  }

	public function raiz_register() {

    if(!function_exists('password_hash')){
        $this->load->helper('password');
    }

    $hash = password_hash($this->input->post('password'), PASSWORD_BCRYPT);

    $this->load->model('user');

    $result = $this->user->add(array(
        'type' => 'raiz',
        'email' => $this->input->post('email'),
        'password' => $hash,
        'nickname'=>$this->input->post('nickname'),
        'birth' => $this->input->post('birth'),
        'sex' => $this->input->post('sex')
    ));

    echo $result;
  }

  public function sns_login() {
    $this->load->model('user');
    $USER_INFO = json_decode($_POST['user'], true);
    $type = $_POST['type'];

    $email = '';
    $nickname = '';
    $password = '';
    $birth = '';
    $sex = '';
    $profile_image = '';

    if($type === 'kakao'){
      $email = $USER_INFO['kaccount_email'];
      $nickname = $USER_INFO['properties']['nickname'];
      $profile_image = $USER_INFO['properties']['profile_image'];
    }

    if($type === 'facebook') {
      $email = $USER_INFO['email'];
      $nickname = $USER_INFO['name'];
      $profile_image = $USER_INFO['picture_small']['data']['url'];
    }

    if($type === 'google') {
      $email = $USER_INFO['email'];
      $nickname = $USER_INFO['nickname'];
      $profile_image = $USER_INFO['profile_image'];
    }
    //check if user exists first, if not add it in Database
    if($this->user->getByEmailNType(array( 'email' =>$email, 'type' => $type))){

    }
    else{

      $result = $this->user->add(array(
          'type' => $type,
          'email' => $email,
          'password' => $password,
          'nickname'=> $nickname,
          'birth' => $birth,
          'sex' => $sex
      ));

      if(!$result){
        echo json_encode('error');
        return;
      }

    }

		$this->session->set_userdata('is_login', true);
		$this->session->set_userdata('type', $type);
		$this->session->set_userdata('email', $email);
		$this->session->set_userdata('nickname', $nickname);
		$this->session->set_userdata('profile_image', $profile_image);
    echo json_encode('success');
  }

  public function logout(){
    echo json_encode($this->session->sess_destroy());
  }

  public function is_login(){
    echo json_encode($this->session->userdata('is_login'));
  }
}
