<?php

class db {
  private $user = "xxxxxxx" ;
  private $pass = "xxxxxxx";
  private $host = "xxxxxxx";
  private $base = "xxxxxxx";
  private $dbh;

  //logowanie sie do bazy
  function __construct() {
    try {
      $this->dbh = new PDO("pgsql:dbname=".$this->base.";host=".$this->host, $this->user, $this->pass);
      $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $e) {
      die("Connection failed! " . $e->getMessage());
    }
    $this->dbh->exec('SET search_path TO projekt;');
  }

  public function checkSession($sessionid) {
    $sth = $this->dbh->prepare("SELECT uzytkownik.id_uzytkownik, uzytkownik.imie, uzytkownik.nazwisko, uzytkownik.login FROM projekt.uzytkownik JOIN projekt.sesja USING (id_uzytkownik) WHERE sesja.sessionid = :sessionid AND sesja.czas > :czas;");
    $sth->bindParam(':sessionid', $sessionid, PDO::PARAM_STR);
    $date = date('Y-m-d H:i:s');
    $sth->bindParam(':czas', $date);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    if (!$result) {
      $result = array(array('id_uzytkownik' => 0, 'imie' => "", 'nazwisko' => "", 'login' => ""));
    }
    $sth = $this->dbh->prepare("UPDATE projekt.sesja SET czas = :czas WHERE sessionid = :sessionid;");
    $sth->bindParam(':sessionid', $sessionid, PDO::PARAM_STR);
    $expires = date('Y-m-d H:i:s', time() + (2*60*60));
    $sth->bindParam(':czas', $expires);
    $sth->execute();

    return $result;
  }

  public function login($array) {
    $login = $array['login'];
    $password = $array['haslo'];
    $sth = $this->dbh->prepare("SELECT id_uzytkownik, imie, nazwisko FROM projekt.uzytkownik WHERE login = :login AND haslo = :haslo LIMIT 1;");
    $sth->bindParam(':login', $login);
    $sth->bindParam(':haslo', $password);
    $sth->execute();
    $result = $sth->fetch(PDO::FETCH_ASSOC);
    $pracownik_id = $result['id_uzytkownik'];
    if ($pracownik_id) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.sesja (id_uzytkownik, sessionid, czas) VALUES (:id_sesja, :sessionid, :czas);");
      $sth->bindParam(':id_sesja', $pracownik_id, PDO::PARAM_INT);
      $sesid = md5($pracownik_id.md5(time()));
      $sth->bindParam(':sessionid', $sesid, PDO::PARAM_STR);
      $expires = date('Y-m-d H:i:s', time() + (2*60*60));
      $sth->bindParam(':czas', $expires, PDO::PARAM_STR);
      $res = $sth->execute();
      $result = array(array('sessionid' => $sesid, 'id_uzytkownik' => $pracownik_id, 'login' => $login, 'imie' => $result['imie'], 'nazwisko' => $result['nazwisko']));
      return $result;
    }
  }


  public function logout($sessionid) {
    $sth = $this->dbh->prepare("DELETE FROM projekt.sesja WHERE sessionid = :sessionid;");
    $sth->bindParam(':sessionid', $sessionid);
    $sth->execute();
    return array(array('status' => 'ok'));
  }

  
  //Pobranie danych alkoholi
  //Wykorzystanie parametru
  public function getAlkohol() {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, koktajl.nazwa, skladniki.nazwa as \"skladniki\" FROM projekt.koktajl full join projekt.skladniki_koktajlu using (id_koktajl) join projekt.skladniki using (id_skladniki) where koktajl.id_koktajl=:id_koktajl");
    $sth->bindParam(':id_koktajl', $id, PDO::PARAM_INT);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Pobranie danych skladnikow
  public function getDieta() {
    $sth = $this->dbh->prepare("SELECT koktajl.nazwa, koktajl.weganski from projekt.koktajl join projekt.koktajl_srodek using (id_koktajl) join projekt.alkohole using (id_alkohole) join projekt.napoje using (id_napoje) where koktajl.alkohol!='true' and (napoje.kalorie/5) <100;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
     foreach($result as &$koktajl) {
      if($koktajl['weganski'] == true){
        $koktajl['weganski'] = 'tak';
      }
      else 
        $koktajl['weganski'] = '-';
      
      $koktajl['weganski'] = explode(' ', $koktajl['weganski'])[0];
     
    }
    return $result;
  }

  //Pobranie koktajli
  //Zamiana booleanow na wartości przyjemne dla użytkownika
  public function getKoktajl() {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, koktajl.nazwa as \"nazwa\", koktajl.weganski, koktajl.alkohol , rodzaj.nazwa as \"rodzaj\", trudnosc.nazwa as \"trudnosc\", szklanki.nazwa as \"szklanka\" FROM projekt.koktajl join projekt.rodzaj using (id_rodzaj) join projekt.trudnosc using (id_trudnosc) join projekt.szklanki using (id_szklanki) where koktajl.id_rodzaj=rodzaj.id_rodzaj ;");
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

  //Skorzystanie z widoku - wyliczenie wartosci min i maksymalnych
  //Zamiana booleanow na wartości przyjemne dla użytkownika
  public function getMin() {
    $sth = $this->dbh->prepare("SELECT restauracja, min(cena) as cena1, max(cena) as cena2 from projekt.menurest group by restauracja ;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
   
    return $result;
  }

  //Srednia wartość wagi produktów użytych do przgotowania koktajlu
  //Zamiana booleanow na wartości przyjemne dla użytkownika
  public function getWag() {
    $sth = $this->dbh->prepare("SELECT round(avg(waga),2) as waga, koktajl from projekt.sklad_koktajlu group by koktajl ;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
   
    return $result;
  }

  //PObranie części obszaru
  //Funkcja służy do wyszukania obszarów względem $id
  public function getObszarPart($id) {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, obszar.dzielnica as \"obszar\", restauracje.nazwa as \"restauracja\" , restauracje.ocena as \"ocena\", menu.cena FROM projekt.menu JOIN projekt.koktajl using (id_koktajl) join projekt.restauracje using (id_restauracje) join projekt.obszar using (id_obszar) where  koktajl.id_koktajl=:id_koktajl ;");
    $sth->bindParam(':id_koktajl', $id, PDO::PARAM_INT);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Pobranie koktajli do wykorzystania w celu znalezienia obszarow
  public function getObszar() {
    $sth = $this->dbh->prepare("SELECT id_koktajl, nazwa FROM koktajl;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Pobranie produktów
  //Zamiana booleanow na wartości przyjemne dla użytkownika
  public function getProduktPart($id) {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, skladniki.nazwa as \"produkt\", skladniki_koktajlu.waga, skladniki.cena, alergeny.nazwa as \"alergen\", witaminy.nazwa as \"witaminy\", round(skladniki.kalorie*skladniki_koktajlu.waga,0) as kalorie from projekt.koktajl full join projekt.skladniki_koktajlu using (id_koktajl) join projekt.skladniki using (id_skladniki) join projekt.alergeny using (id_alergeny) join projekt.witaminy using (id_witaminy) where  koktajl.id_koktajl=:id_koktajl;");
    $sth->bindParam(':id_koktajl', $id, PDO::PARAM_INT);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
     foreach($result as &$koktajl) {
      if($koktajl['alergen'] == 'brak'){
        $koktajl['alergen'] = '-';
      }
      $koktajl['alergen'] = explode(' ', $koktajl['alergen'])[0];
     }
    return $result;
  }

  //pobranie nazwy i id koktajlów
  public function getProdukt() {
    $sth = $this->dbh->prepare("SELECT id_koktajl, nazwa FROM koktajl;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }



  //Pobranie względem kategorii zdrowia
  //Zamiana booleanow na wartości przyjemne dla użytkownika
  public function getZdrowiePart($id) {
    $sth = $this->dbh->prepare("SELECT skladniki.id_skladniki, alergeny.nazwa as \"alergen\", witaminy.nazwa as \"witaminy\" , koktajl.nazwa as \"koktajl\", koktajl.weganski as \"weganski\" from projekt.skladniki join projekt.alergeny using (id_alergeny) join projekt.witaminy using (id_witaminy) join projekt.skladniki_koktajlu using (id_skladniki) full join projekt.koktajl using (id_koktajl) where skladniki.id_skladniki=:id_skladniki;");
    $sth->bindParam(':id_skladniki', $id, PDO::PARAM_INT);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
     foreach($result as &$koktajl) {
      if($koktajl['alergen'] == 'brak'){
        $koktajl['alergen'] = '-';
      }
      $koktajl['alergen'] = explode(' ', $koktajl['alergen'])[0];
      if($koktajl['weganski'] == true){
        $koktajl['weganski'] = 'tak';
      }
      else 
        $koktajl['weganski'] = '-';
      
      $koktajl['weganski'] = explode(' ', $koktajl['weganski'])[0];


    }
    return $result;
  }

  
  //Pobieranie danych odnośnie restauracji
  public function getRestauracja() {
    $sth = $this->dbh->prepare("SELECT restauracje.nazwa, restauracje.ocena, obszar.dzielnica as \"obszar\" FROM projekt.restauracje join projekt.obszar on restauracje.id_obszar=obszar.id_obszar;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Pobieranie składników koktaji
  //Zamiana booleanow na wartości przyjemne dla użytkownika
  public function getSkladnik() {
    $sth = $this->dbh->prepare("SELECT koktajl.id_koktajl, skladniki.nazwa as \"produkty\", koktajl.nazwa as \"nazwa\", napoje.nazwa as \"napoje\", alkohole.nazwa as \"alkohol\", round(((skladniki.cena*skladniki_koktajlu.waga)+napoje.cena/20+alkohole.cena/20),2) as \"cena\", round((skladniki.kalorie*skladniki_koktajlu.waga+napoje.kalorie/20+alkohole.kalorie/20),0) as \"kcal\", koktajl_srodek.czas_przygotowania, koktajl_srodek.liczba_porcji FROM projekt.koktajl full join projekt.skladniki_koktajlu using (id_koktajl) join projekt.koktajl_srodek using (id_koktajl)  join projekt.skladniki using (id_skladniki) join projekt.napoje using (id_napoje) join projekt.alkohole using (id_alkohole) where  koktajl.id_koktajl=id_koktajl ;");
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

  /*
  * Pobieranie wszystkich danych
  */

  //Pobranie rodzaju
  public function getRodzaj() {
    $sth = $this->dbh->prepare("SELECT * FROM rodzaj;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Pobranie trudnosci
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

  //Wykorzystanie widoku zdrowie
   public function getZdrowie() {
    $sth = $this->dbh->prepare("SELECT * FROM zdrowie;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
     foreach($result as &$koktajl) {
      if($koktajl['nazwa'] == 'brak'){
        $koktajl['nazwa'] = '-';
      }
      $koktajl['nazwa'] = explode(' ', $koktajl['nazwa'])[0];

    }
    return $result;
  }

  //wykorzystanie widoku menuRest
  public function getMenuWsz() {
    $sth = $this->dbh->prepare("SELECT * from menuRest;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //wykorzystanie widoku menuRest
  public function getSklWsz() {
    $sth = $this->dbh->prepare("SELECT sklad_koktajlu.koktajl, sklad_koktajlu.skladnik, sklad_koktajlu.waga from projekt.sklad_koktajlu where sklad_koktajlu.skladnik is not null group by  (sklad_koktajlu.koktajl, sklad_koktajlu.skladnik, sklad_koktajlu.waga) order by sklad_koktajlu.koktajl, sklad_koktajlu.skladnik, sklad_koktajlu.waga ;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    foreach($result as &$koktajl) {
      if($koktajl['waga'] == 'null'){
        $koktajl['waga'] = '-';
      }
      $koktajl['waga'] = explode(' ', $koktajl['waga'])[0];

    }
    return $result;
  }

  //Dodawanie koktajlu
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

   //Dodawanie rejestracji
  public function addUzytkownik($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.uzytkownik (login, haslo, imie, nazwisko, id_restauracje)
        VALUES (:login, :haslo, :imie, :nazwisko, :id_restauracje);");
      $sth->bindParam(":login", $array['login']);
      $sth->bindParam(":haslo", $array['haslo']);
      $sth->bindParam(":imie", $array['imie']);
      $sth->bindParam(":nazwisko", $array['nazwisko']);
      $sth->bindParam(":id_restauracje", $array['id_restauracje'], PDO::PARAM_INT);
      $sth->execute();
      return 'ok';
  }

  //Obszar calosc wyciaganie z tabelei
  public function getObszarTabela() {
    $sth = $this->dbh->prepare("SELECT id_obszar, dzielnica FROM obszar;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //Wyciaganie wszystkich restauracji
  public function getRestauracjaWszystkie() {
    $sth = $this->dbh->prepare("SELECT id_restauracje, nazwa FROM projekt.restauracje;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }


  //wyciaganie wszystkich koktajli
  public function getKoktajlWszystkie() {
    $sth = $this->dbh->prepare("SELECT id_koktajl, nazwa FROM projekt.koktajl;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //wyciaganie wszystkich koktajli
  public function getListSkladnik() {
    $sth = $this->dbh->prepare("SELECT id_skladniki, nazwa FROM projekt.skladniki;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //wyciaganie wszystkich witamin
  public function getWitaminy() {
    $sth = $this->dbh->prepare("SELECT id_witaminy, nazwa FROM projekt.witaminy;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //wyciaganie wszystkich witamin
  public function getAlkohole() {
    $sth = $this->dbh->prepare("SELECT id_alkohole, nazwa FROM projekt.alkohole;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //wyciaganie wszystkich napojow
  public function getNapoje() {
    $sth = $this->dbh->prepare("SELECT id_napoje, nazwa FROM projekt.napoje;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

   //wyciaganie wszystkich napojow do tabeli
  public function selectNapoje() {
    $sth = $this->dbh->prepare("SELECT nazwa, cena, kalorie FROM projekt.napoje;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

   //wyciaganie wszystkich szklanek do tabeli
  public function selectSzklanki() {
    $sth = $this->dbh->prepare("SELECT nazwa, pojemnosc FROM projekt.szklanki;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

   //wyciaganie wszystkich alergenow do tabeli
  public function selectAlergen() {
    $sth = $this->dbh->prepare("SELECT nazwa, pochodzenie FROM projekt.alergeny;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }


   //wyciaganie wszystkich alkoholi do tabeli
  public function selectAlkoh() {
    $sth = $this->dbh->prepare("SELECT nazwa, cena, kalorie FROM projekt.alkohole;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }


  //wyciaganie wszystkich alergenów
  public function getAlergeny() {
    $sth = $this->dbh->prepare("SELECT id_alergeny, nazwa FROM projekt.alergeny;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //wyciaganie wszystkich składników
  public function getLista() {
    $sth = $this->dbh->prepare("SELECT skladniki.nazwa, skladniki.kalorie, skladniki.cena, alergeny.nazwa as id_alergeny, witaminy.nazwa as id_witaminy from projekt.skladniki join projekt.alergeny using (id_alergeny) join projekt.witaminy using (id_witaminy) ;");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    foreach($result as &$koktajl) {
      if($koktajl['id_alergeny'] == 'brak'){
        $koktajl['id_alergeny'] = '-';
      }
      $koktajl['id_alergeny'] = explode(' ', $koktajl['id_alergeny'])[0];

    }
    return $result;
  }

  //wyciaganie wszystkich napojow
  public function mojeNapoje() {
    $sth = $this->dbh->prepare("SELECT koktajl.nazwa as koktajl, koktajl_srodek.czas_przygotowania as czas_przygotowania, koktajl_srodek.liczba_porcji as liczba_porcji, napoje.nazwa as napoj, alkohole.nazwa as alkohol from projekt.koktajl_srodek join projekt.koktajl using (id_koktajl) join projekt.alkohole using (id_alkohole) join projekt.napoje using (id_napoje);");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  //wyciaganie wszystkich ocen
  public function getOcena() {
    $sth = $this->dbh->prepare("SELECT restauracje.nazwa as \"nazwa\", restauracje.ocena as \"ocena\", round(avg(cena),2) as srednia_cena from projekt.menu join projekt.restauracje on restauracje.id_restauracje=menu.id_restauracje group by restauracje.id_restauracje order by ocena desc;");
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

  //dodanie menu
  public function addMenu($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.menu (cena, id_restauracje, id_koktajl)
        VALUES (:cena, :id_restauracje, :id_koktajl);");
      $sth->bindParam(":cena", $array['cena']);
      $sth->bindParam(":id_restauracje", $array['id_restauracje'], PDO::PARAM_INT);
      $sth->bindParam(":id_koktajl", $array['id_koktajl'], PDO::PARAM_INT);
      $sth->execute();
      return 'ok';
  }

   //dodanie napojow
  public function addNNN($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.napoje (nazwa, cena, kalorie)
        VALUES (:nazwa, :cena, :kalorie);");
      $sth->bindParam(":cena", $array['cena']);
      $sth->bindParam(":nazwa", $array['nazwa']);
      $sth->bindParam(":kalorie", $array['kalorie']);
      $sth->execute();
      return 'ok';
  }

  //dodanie szklanek
  public function addSzklanki($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.szklanki (nazwa, pojemnosc)
        VALUES (:nazwa, :pojemnosc);");
      $sth->bindParam(":pojemnosc", $array['pojemnosc']);
      $sth->bindParam(":nazwa", $array['nazwa']);
      $sth->execute();
      return 'ok';
  }

  //dodanie alergenow
  public function addAlergen($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.alergeny (nazwa, pochodzenie)
        VALUES (:nazwa, :pochodzenie);");
      $sth->bindParam(":pochodzenie", $array['pochodzenie']);
      $sth->bindParam(":nazwa", $array['nazwa']);
      $sth->execute();
      return 'ok';
  }

   //dodanie alkoholi
  public function addAlko($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.alkohole (nazwa, cena, kalorie)
        VALUES (:nazwa, :cena, :kalorie);");
      $sth->bindParam(":cena", $array['cena']);
      $sth->bindParam(":nazwa", $array['nazwa']);
      $sth->bindParam(":kalorie", $array['kalorie']);
      $sth->execute();
      return 'ok';
  }

    //dodanie skladnika
  public function addSkladnik($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.skladniki_koktajlu (id_koktajl, id_skladniki, waga)
        VALUES (:id_koktajl, :id_skladniki, :waga);");
      $sth->bindParam(":waga", $array['waga']);
      $sth->bindParam(":id_koktajl", $array['id_koktajl'], PDO::PARAM_INT);
      $sth->bindParam(":id_skladniki", $array['id_skladniki'], PDO::PARAM_INT);
      $sth->execute();
      return 'ok';
  }

    //dodanie menu
  public function addNewProdukt($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.skladniki (nazwa, kalorie, cena, id_alergeny, id_witaminy)
        VALUES (:nazwa, :kalorie, :cena , :id_alergeny, :id_witaminy);");
      $sth->bindParam(":nazwa", $array['nazwa']);
      $sth->bindParam(":kalorie", $array['kalorie']);
      $sth->bindParam(":cena", $array['cena']);
      $sth->bindParam(":id_alergeny", $array['id_alergeny'], PDO::PARAM_INT);
      $sth->bindParam(":id_witaminy", $array['id_witaminy'], PDO::PARAM_INT);
      $sth->execute();
      return 'ok';
  }

   //dodanie napoju
  public function addNapoj($array) {
      $sth = $this->dbh->prepare("INSERT INTO projekt.koktajl_srodek (czas_przygotowania, liczba_porcji, id_napoje, id_alkohole, id_koktajl)
        VALUES (:czas_przygotowania, :liczba_porcji, :id_napoje , :id_alkohole, :id_koktajl);");
      $sth->bindParam(":czas_przygotowania", $array['czas_przygotowania']);
      $sth->bindParam(":liczba_porcji", $array['liczba_porcji']);
      $sth->bindParam(":id_napoje", $array['id_napoje'], PDO::PARAM_INT);
      $sth->bindParam(":id_alkohole", $array['id_alkohole'], PDO::PARAM_INT);
      $sth->bindParam(":id_koktajl", $array['id_koktajl'], PDO::PARAM_INT);
      $sth->execute();
      return 'ok';
  }

}


 ?>