<?php

Class Building extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  public function getBuildingInfo($values){
    $type = $values['type'];
    $sigunguCd = $values['sigunguCd'];
    $bjdongCd = $values['bjdongCd'];
    $bun = $values['bun'];
    $ji = $values['ji'];

    if($type === 'brTitleInfo'){
      $buildingID = $values['buildingID'];

      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', str_pad($bun, 4, '0', STR_PAD_LEFT));
      $this->db->where('ji' , str_pad($ji, 4, '0', STR_PAD_LEFT));
      $this->db->where('mgmBldrgstPk', $buildingID);
      $result = $this->db->get('getBrTitleInfo')->result();
    }
    // return json_encode($this->db->last_query());
    // return json_encode($values);
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }
}

?>
