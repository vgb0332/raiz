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

    if($type === 'brPubInfo'){
      $buildingID = $values['buildingID'];
      $dongNm = $values['dongNm'];
      // return json_encode($values, JSON_UNESCAPED_UNICODE);
      $this->db->select('dongNm');
      $this->db->select('hoNm');
      $this->db->select('flrGbCd');
      $this->db->select('flrNo');
      $this->db->select('area');
      $this->db->select('strctCdNm');
      $this->db->select('exposPubuseGbCdNm');
      $this->db->select('mainAtchGbCdNm');

      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', str_pad($bun, 4, '0', STR_PAD_LEFT));
      $this->db->where('ji' , str_pad($ji, 4, '0', STR_PAD_LEFT));
      $this->db->where('dongNm', $dongNm);

      // return json_encode($this->db->last_query());
      $result = $this->db->get('getBrExposPubuseAreaInfo')->result();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    if($type === 'brSingleFlrInfo'){
      $buildingID = $values['buildingID'];
      $flrNo = $values['flrNo'];
      $flrGbCd = $values['flrGbCd'];

      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', str_pad($bun, 4, '0', STR_PAD_LEFT));
      $this->db->where('ji' , str_pad($ji, 4, '0', STR_PAD_LEFT));
      $this->db->where('mgmBldrgstPk', $buildingID);

      $this->db->where('flrGbCd', $flrGbCd);
      $this->db->where('flrNo', $flrNo);
      $result = $this->db->get('getBrFlrOulnInfo')->result();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    if($type === 'brFlrInfo'){
      $buildingID = $values['buildingID'];

      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', str_pad($bun, 4, '0', STR_PAD_LEFT));
      $this->db->where('ji' , str_pad($ji, 4, '0', STR_PAD_LEFT));
      $this->db->where('mgmBldrgstPk', $buildingID);

      $result = $this->db->get('getBrFlrOulnInfo')->result();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    if($type === 'brTitleInfo'){
      $this->db->start_cache();
      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', str_pad($bun, 4, '0', STR_PAD_LEFT));
      $this->db->where('ji' , str_pad($ji, 4, '0', STR_PAD_LEFT));
      $this->db->stop_cache();

      $result = $this->db->get('getBrTitleInfo')->result();
      return json_encode($result, JSON_UNESCAPED_UNICODE);

    }

    if($type === 'brRecapTitleInfo'){
      $this->db->start_cache();
      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('bun', str_pad($bun, 4, '0', STR_PAD_LEFT));
      $this->db->where('ji' , str_pad($ji, 4, '0', STR_PAD_LEFT));
      $this->db->stop_cache();

      $result = $this->db->get('getBrRecapTitleInfo')->result();
      return json_encode($result, JSON_UNESCAPED_UNICODE);

    }

    // if($type === 'brTitleInfo'){
    //   $buildingID = $values['buildingID'];
    //   $this->db->start_cache();
    //   $this->db->where('sigunguCd', $sigunguCd);
    //   $this->db->where('bjdongCd', $bjdongCd);
    //   $this->db->where('bun', str_pad($bun, 4, '0', STR_PAD_LEFT));
    //   $this->db->where('ji' , str_pad($ji, 4, '0', STR_PAD_LEFT));
    //   $this->db->where('mgmBldrgstPk', $buildingID);
    //   $this->db->stop_cache();
    //   $title_result = $this->db->get('getBrTitleInfo')->result();
    //
    //   $this->db->select('COUNT(*)');
    //   $this->db->group_by('flrGbCd, flrNo');
    //   $floor_result = $this->db->get('getBrFlrOulnInfo')->result();
    //
    //   return json_encode(array(
    //     'brTitleInfo' => $title_result,
    //     'flrCnt' => $floor_result
    //   ), JSON_UNESCAPED_UNICODE);
    // }
    // return json_encode($this->db->last_query());
    // return json_encode($values);
    // return json_encose($floor_result, JSON_UNESCAPED_UNICODE);

  }
}

?>
