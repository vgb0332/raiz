<?php

Class User extends CI_Model {
  // private $ServiceKey = 'v%2FqZ1ZLuZNMdK1lnZX6AR2a%2FA8ml1uGK41%2Bxy%2Bj0v9Nn8MU2fqLbSqbJX4VcsxRxBg8xusYH%2B2mC2gdb1wa7dQ%3D%3D';
	function __construct(){
		parent::__construct();
	}

  function add($option){

		//check for duplicate id
		$this->db->where('email', $option['email']);
		$this->db->where('type', $option['type']);
		$query = $this->db->get('user_test');
		$count = $query -> num_rows();
		if( $count > 0 ){
			return json_encode('duplicate', JSON_UNESCAPED_UNICODE);
		}

		else {
			$this->db->set('email', $option['email']);
			$this->db->set('type', $option['type']);
			$this->db->set('password', $option['password']);
			$this->db->set('nickname', $option['nickname']);
			$this->db->set('birth', $option['birth']);
			$this->db->set('sex', $option['sex']);
			$this->db->set('created', 'NOW()', false);
			$this->db->insert('user_test');
			$result = $this->db->insert_id();

			if($result){
				return json_encode('success', JSON_UNESCAPED_UNICODE);
			}
			else{
				return json_encode('error', JSON_UNESCAPED_UNICODE);
			}
		}
  }

	function getByEmailNType($option){
		$this->db->where('email', $option['email']);
		$this->db->where('type', $option['type']);
    $user = $this->db->get('user_test')->row();
    return $user;
  }

}


?>
