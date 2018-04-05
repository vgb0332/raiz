<?php

Class Junwal extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  public function getJunwalInfo($values) {
    $type = $values['type'];
    $sigunguCd = substr($values['bjdongCd'], 0, 5);
    $bjdongCd = substr($values['bjdongCd'], 5, 5);
    $bunji = $values['bunji'];

    $filter_type = $values['filter_type'];
    $filter_value = $values['filter_value'];

    $current_time = date("Y-m");
    $last_time = date("Y-m", strtotime('-' . $filter_value . ' ' . $filter_type));
    $last_year = explode("-", $last_time)[0];
    $last_month = explode("-", $last_time)[1];
    // return json_encode($last_year, JSON_UNESCAPED_UNICODE);
    if($type === 'aptJunwal'){

      $this->db->select('년, 월, 일, 아파트 as 이름, 지번, 전용면적, 층, 보증금액, 월세금액');
      $this->db->where('지역코드', $sigunguCd);
      $this->db->where('법정동코드', $bjdongCd);
      $this->db->where('지번', $bunji);
      $this->db->where('년 >=', $last_year);
      $this->db->where('월 >=', $last_month);
      $this->db->order_by('년', 'DESC');
      $result = $this->db->get('getRTMSDataSvcAptRent')->result_array();
      // $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);

    }
    if($type === 'rhouseJunwal'){

      $this->db->select('년, 월, 일, 연립다세대 as 이름, 지번, 전용면적, 층, 보증금액, 월세금액');
      $this->db->where('지역코드', $sigunguCd);
      $this->db->where('법정동코드', $bjdongCd);
      $this->db->where('지번', $bunji);
      $this->db->where('년 >=', $last_year);
      $this->db->where('월 >=', $last_month);
      $this->db->order_by('년', 'DESC');
      $result = $this->db->get('getRTMSDataSvcRHRent')->result_array();
      // $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);

    }
    if($type === 'tojiJunwal'){



    }
    if($type === 'storeJunwal'){



    }

  }

}
?>
