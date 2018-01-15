<?php

class db {
  private $user = "x" ;
  private $pass = "x";
  private $host = "x";
  private $base = "x";
  private $dbh;


  function __construct() {
    try {
      $this->dbh = new PDO("pgsql:dbname=".$this->base.";host=".$this->host, $this->user, $this->pass);
    }
    catch (PDOException $e) {
      die("Connection failed! " . $e->getMessage());
    }
    $this->dbh->exec('SET search_path TO projekt;');
  }

  //Alkohole
  public function getAlkohol() {
    $sth = $this->dbh->prepare("SELECT nazwa, cena, kalorie FROM alkohole ;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Koktajl
  public function getKoktajl() {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, koktajl.nazwa as \"nazwa\", koktajl.weganski, koktajl.alkohol , rodzaj.nazwa as \"rodzaj\", trudnosc.nazwa as \"trudnosc\" FROM projekt.koktajl join projekt.rodzaj using (id_rodzaj) join projekt.trudnosc using (id_trudnosc) where koktajl.id_rodzaj=rodzaj.id_rodzaj ;");
    $sth->bindParam(':id_rodzaj', $id, PDO::PARAM_INT);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    foreach($result as &$koktajl) {
      if($koktajl['weganski'] == true){
        $koktajl['weganski'] = 'tak';
      }
      else 
        $koktajl['weganski'] = '-';
      
      $koktajl['weganski'] = explode(' ', $koktajl['weganski'])[0];
      if($koktajl['alkohol'] == true){
        $koktajl['alkohol'] = 'tak';
      }
      else 
        $koktajl['alkohol'] = '-';
      $koktajl['alkohol'] = explode(' ', $koktajl['alkohol'])[0];
    }
    return $result;
  }

  //Obszar
  public function getObszarPart($id) {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, obszar.dzielnica as \"obszar\", restauracje.nazwa as \"restauracja\" , restauracje.ocena as \"ocena\", menu.cena FROM projekt.menu JOIN projekt.koktajl using (id_koktajl) join projekt.restauracje using (id_restauracje) join projekt.obszar using (id_obszar) where  koktajl.id_koktajl=:id_koktajl ;");
    $sth->bindParam(':id_koktajl', $id, PDO::PARAM_INT);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  public function getObszar() {
    $sth = $this->dbh->prepare("SELECT id_koktajl, nazwa FROM koktajl;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }


  //Zdrowie kategorie
  public function getZdrowiePart($id) {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, koktajl.nazwa as \"koktajl\"  FROM projekt.koktajl full join projekt.skladniki_koktajlu using (id_koktajl) join projekt.skladniki using (id_skladniki) where koktajl.id_koktajl=skladniki_koktajlu.id_koktajl;");
    $sth->bindParam(':id_koktajl', $id, PDO::PARAM_INT);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  /*
SELECT koktajl.id_koktajl, koktajl.nazwa as \"koktajl\", skladniki.nazwa as \"skladnik\", koktajl.alkohol as \"alkohol\", alergeny.nazwa as \"alergen\", koktajl.weganski FROM projekt.koktajl  join projekt.skladniki_koktajlu using (id_koktajl)  join projekt.skladniki using (id_skladniki)  join projekt.alergeny using (id_alergeny)  join projekt.witaminy using (id_witaminy) where  koktajl.id_koktajl=:id_koktajl;");
  */

   public function getZdrowie() {
    $sth = $this->dbh->prepare("SELECT id_skladniki, nazwa FROM skladniki;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Restauracja
  public function getRestauracja() {
    $sth = $this->dbh->prepare("SELECT restauracje.nazwa, restauracje.ocena, obszar.dzielnica as \"obszar\" FROM projekt.restauracje join projekt.obszar on restauracje.id_obszar=obszar.id_obszar;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Skladnik
  public function getSkladnik() {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, koktajl.nazwa as \"nazwa\", szklanki.nazwa as \"szklo\", skladniki.nazwa as \"produkty\", napoje.nazwa as \"napoje\", alkohole.nazwa as \"alkohol\", round(((skladniki.cena*skladniki_koktajlu.waga)+napoje.cena/20+alkohole.cena/20),2) as \"cena\", round((skladniki.kalorie*skladniki_koktajlu.waga+napoje.kalorie/20+alkohole.kalorie/20),0) as \"kcal\" FROM projekt.koktajl full join projekt.skladniki_koktajlu using (id_koktajl) join projekt.szklanki using (id_szklanki) join projekt.koktajl_srodek using (id_koktajl)  join projekt.skladniki using (id_skladniki) join projekt.napoje using (id_napoje) join projekt.alkohole using (id_alkohole) where  koktajl.id_koktajl=id_koktajl;");
    $sth->bindParam(':id_koktajl', $id, PDO::PARAM_INT);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    foreach($result as &$koktajl) {
      if($koktajl['alkohol'] == 'brak'){
        $koktajl['alkohol'] = '-';
      }
      $koktajl['alkohol'] = explode(' ', $koktajl['alkohol'])[0];

    }
    return $result;
  }

  //pobranie rodzaju

  public function getRodzaj() {
    $sth = $this->dbh->prepare("SELECT * FROM rodzaj;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //pobranie trudnosci

  public function getTrudnosc() {
    $sth = $this->dbh->prepare("SELECT * FROM trudnosc;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //pobranie szklanki

  public function getSzklanka() {
    $sth = $this->dbh->prepare("SELECT * FROM szklanki;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //dodanie koktajlu

  public function addKoktajl($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.koktajl (nazwa, weganski, alkohol, id_rodzaj, id_trudnosc, id_szklanki)
        VALUES (:nazwa, :weganski, :alkohol, :id_rodzaj, :id_trudnosc, :id_szklanki);");
      $sth->bindParam(":nazwa", $array['nazwa']);
      $sth->bindParam(":weganski", $array['weganski'], PDO::PARAM_BOOL);
      $sth->bindParam(":alkohol", $array['alkohol'], PDO::PARAM_BOOL);
      $sth->bindParam(":id_rodzaj", $array['id_rodzaj'], PDO::PARAM_INT);
      $sth->bindParam(":id_trudnosc", $array['id_trudnosc'], PDO::PARAM_INT);
      $sth->bindParam(":id_szklanki", $array['id_szklanki'], PDO::PARAM_INT);
      $sth->execute();
      return 'ok';
  }

  //obszar calosc wyciaganie z tablei
  public function getObszarTabela() {
    $sth = $this->dbh->prepare("SELECT id_obszar, dzielnica FROM obszar;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //dodanie restauracji

  public function addRestauracja($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.restauracje (nazwa, ocena, id_obszar)
        VALUES (:nazwa, :ocena, :id_obszar);");
      $sth->bindParam(":nazwa", $array['nazwa']);
      $sth->bindParam(":ocena", $array['ocena']);
      $sth->bindParam(":id_obszar", $array['id_obszar'], PDO::PARAM_INT);
      $sth->execute();
      return 'ok';
  }



}


 ?>
