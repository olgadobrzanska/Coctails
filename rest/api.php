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

  private function _test() {
    $this->response('ok', 200);
  }


  private function returnStatus($status) {
    $array = array('status' => $status);
    $this->response($this->json($array), 200);
  }

  private function _checkSession() {
    if ($this->get_request_method() != "POST") {
      $this->response('',406);
    }
    if (!empty($this->_request)) {
      try {
        $json_array = json_decode($this->_request, true);
        $json_array['login'] = strtolower($json_array['login']);
        $result = $this->db->checkSession($json_array['sesja']);
        if ($result) {
          $this->response($this->json($result), 200);
        }
        else {
          $this->response('{"id_uzytkownik":"0"}', 200);
        }
      }
      catch (Exception $e) {
        $this->response('', 400);
      }
    }
  }


  private function _login() {
    if ($this->get_request_method() != "POST") {
      $this->response('',406);
    }
    if (!empty($this->_request)) {
      try {
        $json_array = json_decode($this->_request, true);
        $result = $this->db->login($json_array);
        $this->response($this->json($result), 200);
      }
      catch (Exception $e) {
        $this->response('', 400);
      }
    }
  }


  private function _logout() {
    if ($this->get_request_method() != "POST") {
      $this->response('',406);
    }
    if (!empty($this->_request)) {
      try {
        $json_array = json_decode($this->_request, true);
        $result = $this->db->logout($json_array['sesja']);
        $this->response($this->json($result), 200);
      }
      catch (Exception $e) {
        $this->response('', 400);
      }
    }
  }

  /*
  * Funkcje wysylająca polecenie GET do bazy w celu wyciągniecia odpowiednich danych
  */

  //Koktajle - obszar
  private function _getObszar() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getObszar();
    $this->response($this->json($result), 200);
  }

  //Wyciaganie obszarow 
  private function _getObszarTabela() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getObszarTabela();
    $this->response($this->json($result), 200);
  }

  //Wyciaganie wszystkich restauracji  
  private function _getRestauracjaWszystkie() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getRestauracjaWszystkie();
    $this->response($this->json($result), 200);
  }

   //wyciaganie wszystkich menu  
  private function _getMenuWsz() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getMenuWsz();
    $this->response($this->json($result), 200);
  }

   //wyciaganie wszystkich skladnikow  
  private function _getSklWsz() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getSklWsz();
    $this->response($this->json($result), 200);
  }

   //wyciaganie wszystkich skladnikow  
  private function _getLista() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getLista();
    $this->response($this->json($result), 200);
  }

   //wyciaganie wszystkich skladnikow  
  private function _mojeNapoje() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->mojeNapoje();
    $this->response($this->json($result), 200);
  }

  //wyciaganie wszystkich koktajli  
  private function _getKoktajlWszystkie() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getKoktajlWszystkie();
    $this->response($this->json($result), 200);
  }


  //wyciaganie wszystkich skladnikow  
  private function _getListSkladnik() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getListSkladnik();
    $this->response($this->json($result), 200);
  }

  //wyciaganie restauracji 
  private function _getRestauracja() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getRestauracja();
    $this->response($this->json($result), 200);
  }

  //wyciaganie rodzaju
  private function _getRodzaj() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getRodzaj();
    $this->response($this->json($result), 200);
  }

  //wyciaganie trudnosci
  private function _getTrudnosc() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getTrudnosc();
    $this->response($this->json($result), 200);
  }

  //wyciaganie rodzajów szklanek
  private function _getSzklanka() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getSzklanka();
    $this->response($this->json($result), 200);
  }

  //wyciaganie rodzajów alkoholi
  private function _getAlkohol() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getAlkohol();
    $this->response($this->json($result), 200);
  }

  //wyciaganie koktajli 
  private function _getKoktajl() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getKoktajl();
    $this->response($this->json($result), 200);
  }

   //wyciaganie minimum ceny z koktajli 
  private function _getMin() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getMin();
    $this->response($this->json($result), 200);
  }

    //wyciaganie wszystkich alergenow  
  private function _getAlergeny() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getAlergeny();
    $this->response($this->json($result), 200);
  }

  //wyciaganie wszystkich witamin  
  private function _getWitaminy() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getWitaminy();
    $this->response($this->json($result), 200);
  }

  //wyciaganie wszystkich napojów  
  private function _getNapoje() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getNapoje();
    $this->response($this->json($result), 200);
  }

  //wyciaganie wszystkich alkoholi  
  private function _getAlkohole() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getAlkohole();
    $this->response($this->json($result), 200);
  }

    //wyciaganie średniej wagi produktów z koktajli 
  private function _getWag() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getWag();
    $this->response($this->json($result), 200);
  }

  //wyciaganie dietetycznych koktajli 
  private function _getDieta() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getDieta();
    $this->response($this->json($result), 200);
  }

  //Pobranie Oceny restauracji
  private function _getOcena() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getOcena();
    $this->response($this->json($result), 200);
  }

  //Pobranie Skladników
  private function _getSkladnik() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getSkladnik();
    $this->response($this->json($result), 200);
  }

  //Koktajle katogoria
  //Pobranie rekordu ze względu na $id
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


   //Koktajle katogoria
  private function _getProdukt() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getObszar();
    $this->response($this->json($result), 200);
  }

   //Pobranie napojów
  private function _selectNapoje() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->selectNapoje();
    $this->response($this->json($result), 200);
  }

   //Pobranie alergenow
  private function _selectAlergen() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->selectAlergen();
    $this->response($this->json($result), 200);
  }

   //Pobranie szklanek
  private function _selectSzklanki() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->selectSzklanki();
    $this->response($this->json($result), 200);
  }

   //Pobranie napojów
  private function _selectAlkoh() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->selectAlkoh();
    $this->response($this->json($result), 200);
  }

  //Koktajle produktów
  //Pobranie rekordu ze względu na $id
   private function _getProduktPart() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    if (!empty($this->_request)) {
      try {
        $id = intval($this->_args[0]);
        $result = $this->db->getProduktPart($id);
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

  //pobranie danych potrzebnych do nagłówka zdrowie
  private function _getZdrowie() {
    if ($this->get_request_method() != "GET")
      $this->response('', 406);
    $result = $this->db->getZdrowie();
    $this->response($this->json($result), 200);
  }

    /*
  * Dodawanie produktu do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addNewProdukt() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array('nazwa', 'kalorie', 'cena', 'id_alergeny', 'id_witaminy');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!empty($czesc['cena']) && !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['cena']))
          $this->returnStatus('incorrect_data');
         if (!empty($czesc['kalorie']) && !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['kalorie']))
          $this->returnStatus('incorrect_data');
       if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_alergeny']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_witaminy']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addNewProdukt($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }

  /*
  * Dodawanie koktajli do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
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


      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
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

  /*
  * Dodawanie restauracji do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
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
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
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

  /*
  * Dodawanie restauracji do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addUzytkownik() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array('login', 'haslo', 'imie', 'nazwisko', 'id_restauracje');
    
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['imie']))
        $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwisko']))
        $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['login']))
        $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['haslo']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_restauracje']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addUzytkownik($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }


  /*
  * Dodawanie menu do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addMenu() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array( 'id_restauracje', 'id_koktajl', 'cena');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!empty($czesc['cena']) || !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['cena']))
          $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_restauracje']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_koktajl']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addMenu($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }

  /*
  * Dodawanie napoje do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addNNN() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array( 'nazwa', 'cena', 'kalorie');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!empty($czesc['cena']) || !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['cena']))
          $this->returnStatus('incorrect_data');
     if (!empty($czesc['kalorie']) || !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['kalorie']))
          $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addNNN($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }

  /*
  * Dodawanie szklanek do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addSzklanki() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array( 'nazwa', 'pojemnosc');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['pojemnosc']))
        $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addSzklanki($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }

   /*
  * Dodawanie szklanek do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addAlergen() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array( 'nazwa', 'pochodzenie');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
        $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['pochodzenie']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addAlergen($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }

  /*
  * Dodawanie napoje do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addAlko() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array( 'nazwa', 'cena', 'kalorie');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!empty($czesc['cena']) || !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['cena']))
          $this->returnStatus('incorrect_data');
     if (!empty($czesc['kalorie']) || !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['kalorie']))
          $this->returnStatus('incorrect_data');
      if (!preg_match("/^[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]{1,}$/", $json_array['nazwa']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addAlko($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }

  /*
  * Dodawanie menu do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addSkladnik() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array('id_koktajl', 'id_skladniki', 'waga');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!empty($czesc['waga']) || !preg_match("/^\d+(?:\.\d{2})?$/", $json_array['waga']))
          $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_skladniki']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_koktajl']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addSkladnik($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }


 /*
  * Dodawanie produktu do bazy
  * Sprawdzanie, czy wprowadzane dane są prawidłowe
  */
  private function _addNapoj() {
    if ($this->get_request_method() != "PUT") {
      $this->returnStatus("sdf");
    }
    if (empty($this->_request)) {
      $error = array('status' => "incorrect_data");
      $this->response($this->json($error), 400);
    }

    try {
      $json_array = json_decode($this->_request, true);
     
      $neededKeys = array('czas_przygotowania', 'liczba_porcji', 'id_napoje', 'id_alkohole', 'id_koktajl');
      if (!$this->hasNeededKeys($neededKeys, $json_array))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['czas_przygotowania']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['liczba_porcji']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_napoje']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_alkohole']))
        $this->returnStatus('incorrect_data');
      if (!is_numeric($json_array['id_koktajl']))
        $this->returnStatus('incorrect_data');
      
      $this->returnStatus($this->db->addNapoj($json_array));

    }
    catch (Exception $e) {
      $error = array('status' => ".");
      $this->returnStatus('.');
    }

  }



  //funkcja
  private function json($data){
    if(is_array($data)){
      return json_encode($data);
    }
  }
}


$api = new API;
$api->processApi();

?>