<?php

Class Toji extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  public function getTojiInfo($values){
    $type = $values['type'];
    $sigunguCd = $values['sigunguCd'];
    $bjdongCd = $values['bjdongCd'];
    $bun = $values['bun'];
    $ji = $values['ji'];

    if($type === 'possession'){
      // return json_encode($values, JSON_UNESCAPED_UNICODE);
      $this->db->start_cache();
      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', $bun);
      $this->db->where('ji' , $ji);
      $this->db->limit(1);
      $this->db->stop_cache();
      $result = $this->db->get('getPossessionAttr')->result();
      $this->db->flush_cache();
    }

    if($type === 'indivPrice'){
      $this->db->start_cache();
      $this->db->select('pblntfDe');
      $this->db->select('pblntfPclnd');
      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', $bun);
      $this->db->where('ji' , $ji);
      // $this->db->limit(1);
      $this->db->stop_cache();
      $result = $this->db->get('IndvdLandPriceService')->result();
      $this->db->flush_cache();
    }

    if($type === 'usage'){
      $this->db->start_cache();
      $this->db->select('prposAreaDstrcCodeNm');
      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', $bun);
      $this->db->where('ji' , $ji);
      $this->db->group_by('prposAreaDstrcCodeNm');
      // $this->db->limit(1);
      $this->db->stop_cache();
      $result = $this->db->get('getLandUseAttr')->result();
      $this->db->flush_cache();
    }


    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }
}

?>
