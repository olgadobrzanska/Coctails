<?php
    
require_once ("rest.php");
require_once ("database.php");
  
class API extends REST {

  public $data = "";


  public function __construct(){
    parent::__construct();
    $this->db = new db() ;
  }


  public function processApi(){

    $func = "_".$this->_endpoint ; 
    if ((int)method_exists($this,$func) > 0) {
      $this->$func();
    }
    else {
      $this->response('Page not found',404);
    }
  }


  private function hasNeededKeys($array, $lookedArray) {
    foreach ($array as $key) {
      if (!array_key_exists($key, $lookedArray))
        return false;
    }
    return true;
  }


  private function returnStatus($status) {
    $array = array('status' => $status);
    $this->response($this->json($array), 200);
  }

private function _getObszar() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getObszar();
    $this->response($this->json($result), 200);
  }

  //wyciaganie obszarow 

  private function _getObszarTabela() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getObszarTabela();
    $this->response($this->json($result), 200);
  }

  //wyciaganie restauracji 

  private function _getRestauracja() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getRestauracja();
    $this->response($this->json($result), 200);
  }

  //rodzaj
  private function _getRodzaj() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getRodzaj();
    $this->response($this->json($result), 200);
  }

  //trudnosc
  private function _getTrudnosc() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getTrudnosc();
    $this->response($this->json($result), 200);
  }

  //szklanka
  private function _getSzklanka() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getSzklanka();
    $this->response($this->json($result), 200);
  }

  //Alkohole
  private function _getAlkohol() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getAlkohol();
    $this->response($this->json($result), 200);
  }

  //Koktajli
  private function _getKoktajl() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getKoktajl();
    $this->response($this->json($result), 200);
  }

  //Skladniki
  private function _getSkladnik() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getSkladnik();
    $this->response($this->json($result), 200);
  }

  //Koktajle katogoria



   private function _getObszarPart() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    if (!empty($this->_request)) {
      try {
        $id = intval($this->_args[0]);
        $result = $this->db->getObszarPart($id);
        $this->response($this->json($result), 200);
      }
      catch (Exception $e) {
        $this->response('', 400) ;
      }
    }
    else {
      $error = array('status' => "Failed", "msg" => "Invalid get data");
      $this->response($this->json($error), 400);
    }
  }


  //Zdrowie kategoria
   private function _getZdrowiePart() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    if (!empty($this->_request)) {
      try {
        $id = intval($this->_args[0]);
        $result = $this->db->getZdrowiePart($id);
        $this->response($this->json($result), 200);
      }
      catch (Exception $e) {
        $this->response('', 400) ;
      }
    }
    else {
      $error = array('status' => "Failed", "msg" => "Invalid get data");
      $this->response($this->json($error), 400);
    }
  }

  private function _getZdrowie() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getZdrowie();
    $this->response($this->json($result), 200);
  }


  ////////dodawanie koktajli
  private function _addKoktajl() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array('nazwa', 'weganski', 'alkohol', 'id_rodzaj', 'id_trudnosc', 'id_szklanki');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');


      if (!preg_match("/^[A-Za-z0-9-ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
        $this->returnStatus('incorrect_data');
      if ($json_array['weganski'] == "1")
          $json_array['weganski'] = true;
        else
          $json_array['weganski'] = false;
        if ($json_array['alkohol'] == "1")
          $json_array['alkohol'] = true;
        else
          $json_array['alkohol'] = false;
      if (!is_numeric($json_array['id_rodzaj']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_trudnosc']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_szklanki']))
        $this->returnStatus('incorrect_data');
      


      $this->returnStatus($this->db->addKoktajl($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }

  ////////dodawanie restauracji
  private function _addRestauracja() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array('nazwa', 'ocena', 'id_obszar');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
        $this->returnStatus('incorrect_data');
      if (!empty($czesc['ocena']) && !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['ocena']))
          $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_obszar']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addRestauracja($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }


   private function _save() {
    if ($this->get_request_method() != "POST") {
      $this->response('',406);
    }

    if (!empty($this->_request) ) {
      try {
        $json_array = json_decode($this->_request,true);
        $res = $this->db->insert($json_array);
        if ( $res ) {
          $result = array('return'=>'ok');
          $this->response($this->json($result), 200);
        }
        else {
          $result = array('return'=>'not added');
          $this->response($this->json($result), 200);
        }
      }
      catch (Exception $e) {
        $this->response('', 400) ;
      }
    }
    else {
      $error = array('status' => "Failed", "msg" => "Invalid send data");
      $this->response($this->json($error), 400);
    }
  }

  private function _list(){
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->select() ;      
    $this->response($this->json($result), 200); 
  }

  private function _delete0() {
    $this->_delete(0);
  }

  private function _delete1() {
     $this->_delete(1);
  }

  private function _delete($flag) {
    if ($this->get_request_method() != "DELETE") {
      $this->response('',406);
    }
    $id = $this->_args[0];
    if (!empty($id)) {
      $res = $this->db->delete($id,$flag);
      if ( $res ) {
        $success = array('status' => "Success", "msg" => "Successfully one record deleted. Record - ".$id);
        $this->response($this->json($success),200);
      }
      else {
        $failed = array('status' => "Failed", "msg" => "No records deleted" );
        $this->response($this->json($failed),200);
      }
    }
    else {
      $failed = array('status' => "No content", "msg" => "No records deleted" );
      $this->response($this->json($failed),204);  // If no records "No Content" status
    }
  }
     
  private function _update0() {
     $this->_update(0);
  }

  private function _update1() {
     $this->_update(1);
  }

  private function _update($flag) {
    if ($this->get_request_method() != "PUT") {
      $this->response('',406);
    }
    $id = $this->_args[0];
    $json_array = json_decode($this->_request,true);;
    if (!empty($id)) {
      $res = $this->db->update($id,$json_array,$flag);
      if ( $res > 0 ) {
        $success = array('status' => "Success", "msg" => "Successfully one record updated.");
        $this->response($this->json($success),200);
      }
      else {
        $failed = array('status' => "Failed", "msg" => "No records updated.");
        $this->response($this->json($failed),200);
      }
 
    }
  }

  private function json($data){
    if(is_array($data)){
      return json_encode($data);
    }
  }
}


$api = new API;
$api->processApi();

?>