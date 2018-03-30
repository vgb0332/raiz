<?php

Class Sil extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  public function getSilInfo($values) {
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

    if($type === 'aptSil'){

      $this->db->select('년, 월, 일, 아파트 as 이름, 지번, 전용면적, 층, 거래금액');
      $this->db->where('지역코드', $sigunguCd);
      $this->db->where('법정동코드', $bjdongCd);
      $this->db->where('지번', $bunji);
      $this->db->where('년 >=', $last_year);
      $this->db->where('월 >=', $last_month);
      $this->db->order_by('년', 'DESC');
      $result = $this->db->get('getRTMSDataSvcAptTrade')->result_array();
      // $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }
    if($type === 'rhouseSil'){

      $this->db->select('년, 월, 일, 연립다세대 as 이름, 지번, 전용면적, 층, 거래금액');
      $this->db->where('지역코드', $sigunguCd);
      $this->db->where('법정동코드', $bjdongCd);
      $this->db->where('지번', $bunji);
      $this->db->where('년 >=', $last_year);
      $this->db->where('월 >=', $last_month);
      $this->db->order_by('년', 'DESC');
      $result = $this->db->get('getRTMSDataSvcRHTrade')->result_array();
      // $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);

    }
    if($type === 'tojiSil'){

      $this->db->select('substring(YM, 1, 4) as 년, substring(YM, 5, 2) as 월,
                        DAY as 일, YONGDO as 이름,
                        CONCAT(TRIM(LEADING 0 FROM bun_1), '-', TRIM(LEADING 0 FROM ji_1)) as 지번,
                        AREA as 전용면적, PRICE as 거래금액');
      $this->db->where('sigunguCd', $sigunguCd);
      $this->db->where('bjdongCd', $bjdongCd);
      $this->db->where('CONCAT(TRIM(LEADING 0 FROM bun_1), '-', TRIM(LEADING 0 FROM ji_1))', $bunji);
      $this->db->where('substring(YM, 1, 4) >=', $last_year);
      $this->db->where('substring(YM, 5, 2) >=', $last_month);
      $this->db->order_by('substring(YM, 1, 4)', 'DESC');
      $result = $this->db->get('getLandTrade')->result_array();
      // $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);

    }
    if($type === 'storeSil'){

      $this->db->select('substring(계약년월, 1, 4) as 년, substring(계약년월, 5, 2) as 월,
                        계약일 as 일, 용도지역 as 이름,
                        CONCAT(TRIM(LEADING 0 FROM bun_1), '-', TRIM(LEADING 0 FROM ji_1)) as 지번,
                        전용면적, 층, 거래금액');
      $this->db->where('지역코드', $sigunguCd);
      $this->db->where('법정동코드', $bjdongCd);
      $this->db->where('지번', $bunji);
      $this->db->where('년 >=', $last_year);
      $this->db->where('월 >=', $last_month);
      $this->db->order_by('substring(계약년월, 1, 4)', 'DESC');
      $result = $this->db->get('getCommerceBusiness')->result_array();
      // $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);

    }

  }

}
?>
