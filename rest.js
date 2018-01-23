var request;
var objJSON;
var id_mongo;
var userID=0;
var userData = {};
var baseURL = window.location.href;
baseURL = baseURL.substr(0, baseURL.lastIndexOf("/")) + "/rest/";
var websiteName = "Koktajle";
function getRequestObject() {
  if ( window.ActiveXObject) {
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  }
  else if (window.XMLHttpRequest) {
    return (new XMLHttpRequest());
  }
  else {
    return (null);
  }
}




function writeCookie(value) {
  document.cookie = "sesja=" + value + "; path=/";
}

function readCookie() {
  var i, c, ca, nameEQ = "sesja=";
  ca = document.cookie.split(';');
  for(i=0;i < ca.length;i++) {
    c = ca[i];
    while (c.charAt(0)==' ') {
      c = c.substring(1,c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length,c.length);
    }
  }
  return '';
}

function checkSession(isAccessingUserPanel = false) {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      if (userID != parseInt(objJSON[0]['id_uzytkownik'])) {
        userID = parseInt(objJSON[0]['id_uzytkownik']);
        userData = objJSON[0];
      }
      if (isAccessingUserPanel) {
        if (userID == 0) {
          _showLoginPanel();
        }
        else {
          _panel();
        }
      }
    }
  }
  var req = {};
  req.sesja = readCookie();
  sesja = JSON.stringify(req);
  request.open("POST", baseURL+"checkSession", true);
  // request.timeout
  request.send(sesja);
}


/**
* User panel functions
*/

function _userPanel() {
  document.getElementById('result').innerHTML = '';
  checkSession(true);
  

}


function _showLoginPanel() {
  document.title = websiteName + " - Logowanie";
  document.getElementById('data').innerHTML = `
  <div style="margin-left: 360px; width: 400px; align: center;">
  <table class="loginForm" style="width: 100%; text-align: center;">
  <thead><tr><td colspan="2">Logowanie</td></tr></thead>
    <form method='post'>
      <tr><td width="40%">Login:</td><td><input type='text' value='' name='login' id='login' /></td></tr>
      <tr><td>Hasło:</td><td><input type='password' value='' name='password' id='password' /></td></tr>
      <tr><td colspan="2"><input type='submit' name='submitLogin' class="button button3" onclick='_login(this.form);' value='Zaloguj' /></td></tr>
      <thead><tr><td colspan="2">Nie masz konta?</td></tr></thead>
      
      
      <tr><td colspan="2"><button type="button" class="button button3" onclick="_rejestr();">Zarejestruj się</button></td></tr>
    </form>
  </table></div>
  `;

 
}

function _showLoginPanel2() {
  document.title = websiteName + " - Logowanie";
  document.getElementById('data').innerHTML = `
  <div style="margin-left: 360px; width: 400px; align: center;">
  <table class="loginForm" style="width: 100%; text-align: center;">
  <thead><tr><td colspan="2">Logowanie</td></tr></thead>
    <form method='post'>
      <tr><td width="40%">Login:</td><td><input type='text' value='' name='login' id='login' /></td></tr>
      <tr><td>Hasło:</td><td><input type='password' value='' name='password' id='password' /></td></tr>
      <tr><td colspan="2"><input type='submit' name='submitLogin' onclick='_login(this.form);' value='Zaloguj' /></td></tr>
    </form>
  </table></div>
  `;

 
}

function _rejestr() {
  document.title = websiteName + " - Rejestracja";
  document.getElementById('data').innerHTML = `
  <div style="margin-left: 360px; width: 400px; align: center;">
  <table class="rejestrForm" style="width: 100%; text-align: center;">
  <thead><tr><td colspan="2">Rejestracja</td></tr></thead>
    <form method='post'>
      <tr><td width="40%">Imię:</td><td><input type='text' value='' name='imie' id='imie' /></td></tr>
      <tr><td width="40%">Nazwisko:</td><td><input type='text' value='' name='nazwisko' id='nazwisko' /></td></tr>
      <tr><td width="40%">Login:</td><td><input type='text' value='' name='login' id='login' /></td></tr>
      <tr><td>Hasło:</td><td><input type='password' value='' name='haslo' id='haslo' /></td></tr>
      <tr><td>Restauracja:</td><td>
      <select name="id_restauracje" id="id_restauracje"><option value="0" selected>---</option></select>
      &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz restauracje</span></span>
      </td>
      </tr>
      
      <tr><td><button type="button" class="button button3" onclick="_rejestracja();">Zarejestruj</button></td></tr>
    </form>
  </table></div>
  `;

  _getRestauracjaWszystkie();
}

//rejestracja
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)
function _rejestracja() {

  var addRejestracja = {};
  addRejestracja.imie = document.getElementById('imie');
  addRejestracja.nazwisko = document.getElementById('nazwisko');
  addRejestracja.login = document.getElementById('login');
  addRejestracja.haslo = document.getElementById('haslo');
  addRejestracja.id_restauracje = document.getElementById('id_restauracje');
  status.innerHTML = '';

  
  var rejestracja = {};
  rejestracja.imie = addRejestracja.imie.value;
  rejestracja.nazwisko = addRejestracja.nazwisko.value;
  rejestracja.login = addRejestracja.login.value;
  rejestracja.haslo = addRejestracja.haslo.value;
  rejestracja.id_restauracje = addRejestracja.id_restauracje[addRejestracja.id_restauracje.selectedIndex].value;
  

  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
        _showLoginPanel2();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano użytkownika!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addUzytkownik");
  request.send(JSON.stringify(rejestracja));
}

function delay(ms) {
  var cur_d = new Date();
  var cur_ticks = cur_d.getTime();
  var ms_passed = 0;
  while(ms_passed < ms) {
    var d = new Date();
    var ticks = d.getTime();
    ms_passed = ticks - cur_ticks;
  }
}

function _login(form) {
  login = document.getElementById('login').value;
  password = document.getElementById('password').value;
  if (login == "" || password == "") {
    document.getElementById('result').innerHTML = "Uzupełnij wszystkie pola!";
    return;
  }
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      writeCookie(objJSON[0]['sessionid']);
      delete objJSON[0]['sessionid'];
      userData = objJSON[0];
      userID = parseInt(objJSON[0]['id_uzytkownik']);
      if (userID != 0) {
        document.getElementById('result').innerHTML = "Pomyślnie zalogowano!";
        _panel();
      }
      else{
        document.getElementById('result').innerHTML = "Niepoprawny login lub hasło!";
      
      }
    }
  }
  var req = {};
  req.login = login;
  req.haslo = password;
  input = JSON.stringify(req);
  request.open("POST", baseURL+"login", true);
  request.send(input);
}


function _logout() {
  var sessionId = readCookie();
  if (sessionId.length > 0) {
    var request = getRequestObject();
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        writeCookie('0');
        document.getElementById('result').innerHTML = 'Pomyślnie wylogowano.';
        _showLoginPanel();
      }
    }
    var req = {};
    // req.sesja = sessionId;
    // sesja = JSON.stringify(req);
    request.open("POST", baseURL+"logout", true);
    request.send(null);
  }
}

/*
* Funkcja do pierwszej zakładki Koktajle
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getKoktajl
*/

function _listaKoktajli() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="koktajlTable">
        <thead><tr>
          <td width="30%">Nazwa</td>
          <td width="10%">Weganski</td>
          <td width="10%">Alkohol</td>
          <td width="10%">Rodzaj</td>
          <td width="10%">Trudnosc</td>
          <td width="20%">Szklanka</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['nazwa']+`</td>
          <td>`+obj['weganski']+`</td>
          <td>`+obj['alkohol']+`</td>
          <td>`+obj['rodzaj']+`</td>
          <td>`+obj['trudnosc']+`</td>
          <td>`+obj['szklanka']+`</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getKoktajl");
  request.send(null);
}

/*
* Funkcja do pokazania koktajli o najniższych cenach 
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getKoktajl
*/

function _listaMin() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="minTable">
        <thead><tr>
          <td width="30%">Restauracja</td>
          <td width="20%">Cena minimalna</td>
          <td width="10%">Cena maksymalna</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['restauracja']+`</td>
          <td>`+obj['cena1']+` zł</td>
          <td>`+obj['cena2']+` zł</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getMin");
  request.send(null);
}

/*
* Funkcja do pokazania koktajli o najniższych wagach produktow 
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getKoktajl
*/

function _listaWag() {
 document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="wagTable">
        <thead><tr>
          <td width="30%">Koktajl</td>
          <td width="20%">Srednia waga produktów</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['koktajl']+`</td>
          <td>`+obj['waga']+` kg</td>
        </tr>
         `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getWag");
  request.send(null);
}

/*
* Funkcja do zakładki Dieta
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getKoktajl
*/

function _listaDiet() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="dietlTable">
    <h3 text-align="center">  Koktajle bez alkoholu z kalorycznością < 100 </h3>
        <thead><tr>
          <td width="30%">Koktajl</td>
          <td width="10%">Weganski</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['nazwa']+`</td>
          <td>`+obj['weganski']+`</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getDieta");
  request.send(null);
}

/*
* Funkcja do zakładki Wykaz restauracji - oceny
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getOcena
*/

function _listaOcen() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="OcenyTable">
        <thead><tr>
          <td width="50%">Restauracja</td>
          <td width="25%">Ocena</td>
          <td width="25%">Średnia cena</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['nazwa']+`</td>
          <td>`+obj['ocena']+`</td>
          <td>`+obj['srednia_cena']+` zł</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getOcena");
  request.send(null);
}


/*
* Funkcja sworzona do rozbudowy aplikacji
* Nie została wykorzystana ze względu na to, iż na ten moment nie jest konieczna
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getAlkohol
*/

function _listaAlkoholi() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="alkoholTable">
        <thead>
          <tr>
            <td class="leftColumn">Skladniki</td>
            <td class="leftColumn">Nazwa</td>
            
          </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
            <td>`+obj['skladniki']+`</td>
            <td>`+obj['nazwa']+`</td>
          </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getAlkohol");
  request.send(null);
}

/*
Obszary i restauracje
*/

function _listaObszarow() {
  document.getElementById('data').innerHTML = '';
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <form method="post">
      <select name="categoryID" id="categoryID" onchange='_listaObszarowPart();'><option value='0' selected>---</option>
      `;
      for (var id_koktajl in objJSON) {
        txt += "<option value='"+objJSON[id_koktajl]['id_koktajl']+"'>"+objJSON[id_koktajl]['nazwa']+"</option>";
      }
      txt += `</select>
      </form>`;

      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getObszar");
  request.send(null);

}

//lista kotajli do skladnikow
function _listaProduktow() {
  document.getElementById('data').innerHTML = '';
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <form method="post">
      <select name="categoryID" id="categoryID" onchange='_listaProduktowPart();'><option value='0' selected>---</option>
      `;
      for (var id_koktajl in objJSON) {
        txt += "<option value='"+objJSON[id_koktajl]['id_koktajl']+"'>"+objJSON[id_koktajl]['nazwa']+"</option>";
      }
      txt += `</select>
      </form>`;

      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getProdukt");
  request.send(null);

}

/*
* Funkcja do zakładki Znajdz swoj koktajl
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getObszarPart
*/

function _listaObszarowPart() {
  var e = document.getElementById("categoryID");
  if (e == null)
    return;
  id = e.options[e.selectedIndex].value;
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="Znajdz restauracje">
        <thead><tr>
          <td width="20%">Obszar Krakowa</td>
          <td width="40%">Restauracja</td>
          <td width="20%">Ocena</td>
          <td width="20%">Cena</td>
        </tr></thead>
      `;
      for (var id_koktajl in objJSON) {
        obj = objJSON[id_koktajl];
        txt += `
        <tr>
          <td>`+obj['obszar']+`</td>
          <td>`+obj['restauracja']+`</td>
          <td>`+obj['ocena']+`</td>
          <td>`+obj['cena']+` zł</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('result').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getObszarPart/"+id);
  request.send(null);

}

/*
* Funkcja do zakładki Produkty do koktajlu
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getProduktPart
*/

function _listaProduktowPart() {
  var e = document.getElementById("categoryID");
  if (e == null)
    return;
  id = e.options[e.selectedIndex].value;
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="Produkt">
        <thead><tr>
          <td width="25%">Produkty</td>
          <td width="10%">Waga</td>
          <td width="10%">Cena za kg</td>
          <td width="10%">Kalorie</td>
          <td width="25%">Alergen</td>
          <td width="25%">Witaminy</td>
        </tr></thead>
      `;
      for (var id_koktajl in objJSON) {
        obj = objJSON[id_koktajl];
        txt += `
        <tr>
          <td>`+obj['produkt']+`</td>
          <td>`+obj['waga']+` kg</td>
          <td>`+obj['cena']+` zł</td>
          <td>`+obj['kalorie']+` kcal</td>
          <td>`+obj['alergen']+`</td>
          <td>`+obj['witaminy']+`</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('result').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getProduktPart/"+id);
  request.send(null);

}

/*
Lista zdrowia
*/

function _listaZdrowia() {
  document.getElementById('data').innerHTML = '';
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <form method="post">
      <select name="categoryID" id="categoryID" onchange='_listaZdrowiaPart();'><option value='0' selected>---</option>
      `;
      for (var id_skladniki in objJSON) {
        txt += "<option value='"+objJSON[id_skladniki]['id_skladniki']+"'>"+objJSON[id_skladniki]['nazwa']+"</option>";
      }
      txt += `</select>
      
      </form>`;

      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getZdrowie");
  request.send(null);

}

/*
* Funkcja do zakładki Zdrowie
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getZdrowiePart
*/

function _listaZdrowiaPart() {
  var e = document.getElementById("categoryID");
  if (e == null)
    return;
  id = e.options[e.selectedIndex].value;
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="zdrowieTable">
        <thead><tr>
          <td width="40%">Koktajl</td>
          <td width="25%">Witaminy</td>
          <td width="20%">Alergeny</td>
          <td width="15%">Weganski</td>
        </tr></thead>
      `;
      for (var id_koktajl in objJSON) {
        obj = objJSON[id_koktajl];
        txt += `
        <tr>
          
          <td>`+obj['koktajl']+`</td>
          <td>`+obj['witaminy']+`</td>
          <td>`+obj['alergen']+`</td>
          <td>`+obj['weganski']+`</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('result').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getZdrowiePart/"+id);
  request.send(null);

}

/*
* Funkcja do zakładki Składniki
* Tworzy tabelę, w której wpisywane są później wygenerowane wartości
* Jest w niej zawarta funkcja getSkladnik
*/

function _listaSkladnikow() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="SkladnikTable">
        <thead><tr>
          <td width="15%">Nazwa</td>
          <td width="10%">Napoje</td>
          <td width="10%">Alkohol</td>
          <td width="10%">Składniki</td>
          <td width="15%">Czas przygotowania</td>
          <td width="10%">Liczba porcji</td>
          <td width="10%">Srednia cena</td>
          <td width="10%">Liczba kcal</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['nazwa']+`</td>
          <td>`+obj['napoje']+`</td>
          <td>`+obj['alkohol']+`</td>
          <td>`+obj['produkty']+`</td>
          <td>`+obj['czas_przygotowania']+` min</td>
          <td>`+obj['liczba_porcji']+` szt</td>
          <td>`+obj['cena']+` zł</td>
          <td>`+obj['kcal']+` kcal</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getSkladnik");
  request.send(null);
}

/*
* Panel użytkownika
* znajdują się tu przyciski do generacji formularzy
*/

function _panel() {
  document.getElementById('data').innerHTML = `
  <div style="margin: auto; width: 500px; align: center;">
  <table class="loginForm" style="width: 100%; text-align: center;">
  
 <thead><tr><td colspan="2"> Co chcesz zrobic `+userData['imie']+' '+userData['nazwisko']+`?</td></tr></thead>
    <form method='post'>
      <tr>
        <td width="50%"><button class="button button3" onclick="_addNewKoktajl();" value="Dodaj">Dodaj nowy koktajl do bazy</button></td>
        <td width="50%"><button class="button button3" onclick="_addNewRestauracja();" value="Dodaj">Dodaj nową restauracje do bazy</button></td>
      </tr>
     <tr>
        <td width="50%"><button class="button button3" onclick="_addNewMenu();" value="Dodaj">Dodaj koktajl do restauracji</button></td>
        <td width="50%"><button class="button button3" onclick="_addNewSkladnik();" value="Dodaj">Dodaj składniki do koktajlu</button></td>
      </tr>
      <tr>
        <td width="50%"><button class="button button3" onclick="_addNapojNowy();" value="Dodaj">Dodaj napoje oraz/lub alkohol do koktajlu</button></td>
        <td width="50%"><button class="button button3" onclick="_addProdukt();" value="Dodaj">Dodaj nowe składniki do bazy</button></td>
      </tr>
      <tr>
        <td width="50%"><button class="button button3" onclick="_addNapojeee();" value="Dodaj">Dodaj nowy napoj do bazy </button></td>
        <td width="50%"><button class="button button3" onclick="_addAlkohol();" value="Dodaj">Dodaj nowy alkohol do bazy </button></td>
      </tr>
      <tr>
        <td width="50%"><button class="button button3" onclick="_addSzklanki();" value="Dodaj">Dodaj nowe szklanki do bazy </button></td>
        <td width="50%"><button class="button button3" onclick="_addAlergeny();" value="Dodaj">Dodaj nowe alergeny do bazy </button></td>
      </tr>
      <thead><tr><td colspan="2">Sprawdź</td></tr></thead>
      <tr>
        <td width="50%"><button class="button button3" onclick="_listaMin();" value="Dodaj">Cena min/maks koktajli w restauracjach</button></td>
        <td width="50%"><button class="button button3" onclick="_listaWag();" value="Dodaj">Srednia waga produktów koktajlu</button></td>
      </tr>
     <tr> <td colspan="2"><input type='submit' class="button button3" name='logout' onclick='_logout();' value='Wyloguj' /></td></tr>
     
    </form>
  </table></div>
  `;
}

/*
Tworzenie panelu do dodawania koktajli
*/

function _addNewKoktajl() {
  document.getElementById('result').innerHTML = `
  <table class="addKoktajlTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dane koktajlu</td></tr></thead>
      <form method="post">
      <tr>
        <td class="leftColumn">Nazwa koktajlu</td>
        <td><input type="text" value="" pattern="[A-Za-z-0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50"></td>
      </tr>
      <tr>
        <td class="leftColumn">Wegański</td>
        <td><select name="weganski" id="weganski"><option value="0">Nie</option><option value="1">Tak</option></select> &nbsp;&nbsp;&nbsp;<span class="tooltip"></span></td>
      </tr>
      <tr>
        <td class="leftColumn">Alkohol</td>
        <td><select name="alkohol" id="alkohol"><option value="0">Nie</option><option value="1">Tak</option></select> &nbsp;&nbsp;&nbsp;<span class="tooltip"></span></td>
      </tr>
      <tr>
        <td class="leftColumn">Rodzaj koktajlu</td>
        <td>
          <select name="id_rodzaj" id="id_rodzaj"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz rodzaj koktajlu</span></span>
        </td>
     </tr>
     <tr>
        <td class="leftColumn">Trudność</td>
        <td>
          <select name="id_trudnosc" id="id_trudnosc"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz trudność koktajlu</span></span>
        </td>
     </tr>
     <tr>
        <td class="leftColumn">Szklanka</td>
        <td>
          <select name="id_szklanki" id="id_szklanki"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz odpowiednią szklankę nadającą się do wprowadzanego koktajlu</span></span>
        </td>
     </tr>
      
      <tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addKoktajl()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

  _getRodzaj();
  _getTrudnosc();
  _getSzklanka();
}

//dodawanie do składników do nowego koktajlu
function _addProdukt() {
  document.getElementById('result').innerHTML = `
  <table class="addMenuTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dodaj nowe składniki do bazy</td></tr></thead>
      <form method="post">
      <tr>
        <td class="leftColumn">Nazwa Składnika</td>
          <td><input type="text" value="" pattern="[A-Za-z-0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50"></td>
      </tr>
      
      <tr>
        <td class="leftColumn">Kalorie</td><td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="kalorie" id="kalorie" required /> kcal
        &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Waga składnika potrzebnego do przygotowania koktajlu</span></span>
        </td>
      </tr>
      <tr>
        <td class="leftColumn">Cena</td><td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="cena" id="cena" required /> zł
        </td>
      </tr>
       <tr>
        <td class="leftColumn">Alergeny</td>
        <td>
          <select name="id_alergeny" id="id_alergeny"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz alergen z listy</span></span>
        </td>
      </tr> 
       <tr>
        <td class="leftColumn">Witaminy</td>
        <td>
          <select name="id_witaminy" id="id_witaminy"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz witaminę z listy</span></span>
        </td>
      </tr> 
      <tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addNewProdukt()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

  _getListSkladnik();
  _getWitaminy();
  _getAlergeny();
}

//funkcje potrzebne do stworzenia rozwijalnej listy w panelu do dodawania koktajlów



//witaminy
function _getWitaminy() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_witaminy in objJSON) {
        txt += "<option value='"+objJSON[id_witaminy]['id_witaminy']+"'>"+objJSON[id_witaminy]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_witaminy').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getWitaminy", true);
  request.send(null);
}

//alergeny
function _getAlergeny() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_alergeny in objJSON) {
        txt += "<option value='"+objJSON[id_alergeny]['id_alergeny']+"'>"+objJSON[id_alergeny]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_alergeny').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getAlergeny", true);
  request.send(null);
}




//rodzaj
function _getRodzaj() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_rodzaj in objJSON) {
        txt += "<option value='"+objJSON[id_rodzaj]['id_rodzaj']+"'>"+objJSON[id_rodzaj]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_rodzaj').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getRodzaj", true);
  request.send(null);
}

//trudnosc
function _getTrudnosc() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_trudnosc in objJSON) {
        txt += "<option value='"+objJSON[id_trudnosc]['id_trudnosc']+"'>"+objJSON[id_trudnosc]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_trudnosc').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getTrudnosc", true);
  request.send(null);
}

//szklanki
function _getSzklanka() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_szklanki in objJSON) {
        txt += "<option value='"+objJSON[id_szklanki]['id_szklanki']+"'>"+objJSON[id_szklanki]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_szklanki').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getSzklanka", true);
  request.send(null);
}

//dodawanie rekordów do koktajli
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)
function _addKoktajl() {

  var addKoktajl = {};
  addKoktajl.nazwa = document.getElementById('nazwa');
  addKoktajl.weganski = document.getElementById('weganski');
  addKoktajl.alkohol = document.getElementById('alkohol');
  addKoktajl.id_rodzaj = document.getElementById('id_rodzaj');
  addKoktajl.id_trudnosc = document.getElementById('id_trudnosc');
  addKoktajl.id_szklanki = document.getElementById('id_szklanki');
  status.innerHTML = '';

  
  var koktajl = {};
  koktajl.nazwa = addKoktajl.nazwa.value;
  koktajl.weganski = addKoktajl.weganski.value;
  koktajl.alkohol = addKoktajl.alkohol.value;
  koktajl.id_rodzaj = addKoktajl.id_rodzaj[addKoktajl.id_rodzaj.selectedIndex].value;
  koktajl.id_trudnosc = addKoktajl.id_trudnosc[addKoktajl.id_trudnosc.selectedIndex].value;
  koktajl.id_szklanki = addKoktajl.id_szklanki[addKoktajl.id_szklanki.selectedIndex].value;
  

  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
        _listaKoktajli();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addKoktajl");
  request.send(JSON.stringify(koktajl));
}

//dodawanie rekorów do menu
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)

function _addNewProdukt() {

  var addProdukt = {};
  addProdukt.nazwa = document.getElementById('nazwa');
  addProdukt.kalorie = document.getElementById('kalorie');
  addProdukt.cena = document.getElementById('cena');
  addProdukt.id_witaminy = document.getElementById('id_witaminy');
  addProdukt.id_alergeny = document.getElementById('id_alergeny');
  status.innerHTML = '';

  
  var produkt = {};
  produkt.nazwa = addProdukt.nazwa.value;
  produkt.kalorie = addProdukt.kalorie.value;
  produkt.cena = addProdukt.cena.value;
  produkt.id_witaminy = addProdukt.id_witaminy[addProdukt.id_witaminy.selectedIndex].value;
  produkt.id_alergeny = addProdukt.id_alergeny[addProdukt.id_alergeny.selectedIndex].value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
         _lista();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addNewProdukt");
  request.send(JSON.stringify(produkt));
}

//arkusz dodawania restauracji

function _addNewRestauracja() {
  document.getElementById('result').innerHTML = `
  <table class="addRestauracjaTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dane Restauracji</td></tr></thead>
      <form method="post">
      <tr>
        <td class="leftColumn">Nazwa restauracji</td>
        <td><input type="text" value="" pattern="[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50" required></td>
      </tr>
      <tr>
        <td class="leftColumn">Ocena</td>
        <td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="ocena" id="ocena" required />
        &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Od 0 do 5 (2 liczby po przecinku)</span></span>
        </td>
      </tr>
      <tr>
        <td class="leftColumn">Obszar</td>
        <td>
          <select name="id_obszar" id="id_obszar"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz obszar, na którym znajduje się restauracja</span></span>
        </td>
      </tr>
      
      
      <tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addRestauracja()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

  _getObszarTabela();
}

//obszary
function _getObszarTabela() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_obszar in objJSON) {
        txt += "<option value='"+objJSON[id_obszar]['id_obszar']+"'>"+objJSON[id_obszar]['dzielnica']+"</option>";
      }
      txt += ``;
      document.getElementById('id_obszar').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getObszarTabela", true);
  request.send(null);
}

//dodawanie rekorów do restauracji
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)
function _addRestauracja() {

  var addRestauracja = {};
  addRestauracja.nazwa = document.getElementById('nazwa');
  addRestauracja.ocena = document.getElementById('ocena');
  addRestauracja.id_obszar = document.getElementById('id_obszar');
  status.innerHTML = '';

  
  var obszar = {};
  obszar.nazwa = addRestauracja.nazwa.value;
  obszar.ocena = addRestauracja.ocena.value;
  obszar.id_obszar = addRestauracja.id_obszar[addRestauracja.id_obszar.selectedIndex].value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
        _listaRestauracji();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addRestauracja");
  request.send(JSON.stringify(obszar));
}

/*
* Tworzenie tabeli w celu wydruku listy restauracji
*/

function _listaRestauracji() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="RestauracjeTable">
        <thead><tr>
          <td width="50%">Nazwa</td>
          <td width="25%">Ocena</td>
          <td width="25%">Obszar</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['nazwa']+`</td>
          <td>`+obj['ocena']+`</td>
          <td>`+obj['obszar']+`</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getRestauracja");
  request.send(null);
}

//dodawanie do restauracji nowego koktajlu
function _addNewMenu() {
  document.getElementById('result').innerHTML = `
  <table class="addMenuTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dodaj koktajl do restauracji</td></tr></thead>
      <form method="post">
      
      <tr>
        <td class="leftColumn">Restauracja</td>
        <td>
          <select name="id_restauracje" id="id_restauracje"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz restauracje</span></span>
        </td>
      </tr>
      <tr>
        <td class="leftColumn">Koktajl</td>
        <td>
          <select name="id_koktajl" id="id_koktajl"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz koktajl z listy</span></span>
        </td>
      </tr>  

      <tr>
        <td class="leftColumn">Cena</td>
        <td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="cena" id="cena" required /> zł
        
        </td>
      </tr>
      <tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addMenu()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

  _getRestauracjaWszystkie();
  _getKoktajlWszystkie();
}

//dodawanie dnowego napoju
function _addNapojeee() {
  document.getElementById('result').innerHTML = `
  <table class="addMenuTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dodaj napój do bazy</td></tr></thead>
      <form method="post">
      
      <tr>
        <td class="leftColumn">Nazwa</td>
        <td>
          <input type="text" value="" pattern="[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50" required>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz restauracje</span></span>
        </td>
      </tr>
      <tr>
       
      <tr>
        <td class="leftColumn">Cena</td>
        <td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="cena" id="cena" required /> zł
        
        </td>
      </tr>
      <tr>
        <td class="leftColumn">Kalorie</td>
        <td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="kalorie" id="kalorie" required /> kcal
        
        </td>
      </tr>
      <tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addNowyNapoj()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

}

//dodawanie dnowej szklanki
function _addSzklanki() {
  document.getElementById('result').innerHTML = `
  <table class="addMenuTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dodaj szklankę do bazy</td></tr></thead>
      <form method="post">
      
      <tr>
        <td class="leftColumn">Nazwa</td>
        <td>
          <input type="text" value="" pattern="[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50" required>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wpisz nazwę szklanki</span></span>
        </td>
      </tr>
      <tr>
       
      <tr>
        <td class="leftColumn">Pojemnność</td>
        <td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="pojemnosc" id="pojemnosc" required /> ml
        
        </td>
      </tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addNowySzklanki()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

}

//dodawanie dnowego napoju
function _addAlergeny() {
  document.getElementById('result').innerHTML = `
  <table class="addMenuTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dodaj alergen do bazy</td></tr></thead>
      <form method="post">
      
      <tr>
        <td class="leftColumn">Nazwa</td>
        <td>
          <input type="text" value="" pattern="[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50" required>
        </td>
      </tr>
      <tr>
       
      <tr>
        <td class="leftColumn">Pochodzenie</td>
        <td>
        <input type="text" value="" pattern="[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="pochodzenie" id="pochodzenie" size="50" required>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wprowadź pochodzenie alergenu</span></span>
        </td>
      </tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addNowyAlergen()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

}

//dodawanie dnowego alkoholu
function _addAlkohol() {
  document.getElementById('result').innerHTML = `
  <table class="addMenuTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dodaj alkohol do bazy</td></tr></thead>
      <form method="post">
      
      <tr>
        <td class="leftColumn">Nazwa</td>
        <td>
          <input type="text" value="" pattern="[A-Za-z0-9-._ ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50" required>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz restauracje</span></span>
        </td>
      </tr>
      <tr>
       
      <tr>
        <td class="leftColumn">Cena</td>
        <td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="cena" id="cena" required /> zł
        
        </td>
      </tr>
      <tr>
        <td class="leftColumn">Kalorie</td>
        <td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="kalorie" id="kalorie" required /> kcal
        
        </td>
      </tr>
      <tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addNowyAlkohol()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

}

//restauracje
function _getRestauracjaWszystkie() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_restauracje in objJSON) {
        txt += "<option value='"+objJSON[id_restauracje]['id_restauracje']+"'>"+objJSON[id_restauracje]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_restauracje').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getRestauracjaWszystkie", true);
  request.send(null);
}


//koktajle
function _getKoktajlWszystkie() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_koktajl in objJSON) {
        txt += "<option value='"+objJSON[id_koktajl]['id_koktajl']+"'>"+objJSON[id_koktajl]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_koktajl').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getKoktajlWszystkie", true);
  request.send(null);
}

//dodawanie rekorów do menu
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)

function _addMenu() {

  var addMenu = {};
  addMenu.cena = document.getElementById('cena');
  addMenu.id_restauracje = document.getElementById('id_restauracje');
  addMenu.id_koktajl = document.getElementById('id_koktajl');
  status.innerHTML = '';

  
  var obszar = {};
  obszar.cena = addMenu.cena.value;
  obszar.id_restauracje = addMenu.id_restauracje[addMenu.id_restauracje.selectedIndex].value;
  obszar.id_koktajl = addMenu.id_koktajl[addMenu.id_koktajl.selectedIndex].value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
         _listaMenu();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addMenu");
  request.send(JSON.stringify(obszar));
}

//dodawanie rekorów do menu
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)

function _addNowyAlkohol() {

  var addNN = {};
  addNN.cena = document.getElementById('cena');
  addNN.nazwa = document.getElementById('nazwa');
  addNN.kalorie = document.getElementById('kalorie');
  status.innerHTML = '';

  
  var napojjj = {};
  napojjj.cena = addNN.cena.value;
  napojjj.nazwa = addNN.nazwa.value;
  napojjj.kalorie = addNN.kalorie.value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
        _selectAlkoh();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addAlko");
  request.send(JSON.stringify(napojjj));
}

//dodawanie rekorów do menu
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)

function _addNowyNapoj() {

  var addNN = {};
  addNN.cena = document.getElementById('cena');
  addNN.nazwa = document.getElementById('nazwa');
  addNN.kalorie = document.getElementById('kalorie');
  status.innerHTML = '';

  
  var napojjj = {};
  napojjj.cena = addNN.cena.value;
  napojjj.nazwa = addNN.nazwa.value;
  napojjj.kalorie = addNN.kalorie.value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
        _selectNapoje();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addNNN");
  request.send(JSON.stringify(napojjj));
}

//dodawanie rekorów do szklanek
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)

function _addNowySzklanki() {

  var addNN = {};
  addNN.nazwa = document.getElementById('nazwa');
  addNN.pojemnosc = document.getElementById('pojemnosc');
  status.innerHTML = '';

  
  var szklanki = {};
  szklanki.nazwa = addNN.nazwa.value;
  szklanki.pojemnosc = addNN.pojemnosc.value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
        _selectNapoje();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addSzklanki");
  request.send(JSON.stringify(szklanki));
}

//dodawanie rekorów do alergenow
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)

function _addNowyAlergen() {

  var addNN = {};
  addNN.nazwa = document.getElementById('nazwa');
  addNN.pochodzenie = document.getElementById('pochodzenie');
  status.innerHTML = '';

  
  var alergen = {};
  alergen.nazwa = addNN.nazwa.value;
  alergen.pochodzenie = addNN.pochodzenie.value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
        _selectAlergen();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addAlergen");
  request.send(JSON.stringify(alergen));
}



/*
* Tworzenie tabeli do menu
*/

function _listaMenu() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="MenuTable">
        <thead><tr>
        <td width="35%">Restauracja</td>
          <td width="50%">Koktajl</td>
          <td width="15%">Cena</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
        <td>`+obj['restauracja']+`</td>
          <td>`+obj['koktajl']+`</td>
          <td>`+obj['cena']+` zł</td>

        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getMenuWsz");
  request.send(null);
}

/*
* Tworzenie tabeli do menu
*/

function _selectNapoje() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="napojeTable">
        <thead><tr>
        <td width="35%">Nazwa</td>
          <td width="20%">Cena</td>
          <td width="20%">Kalorie</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
        <td>`+obj['nazwa']+`</td>
          <td>`+obj['cena']+` zł</td>
          <td>`+obj['kalorie']+` kcal</td>

        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"selectNapoje");
  request.send(null);
}

/*
* Tworzenie tabeli do menu
*/

function _selectAlergen() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="napojeTable">
        <thead><tr>
        <td width="35%">Nazwa</td>
          <td width="20%">Pochodzenie</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
        <td>`+obj['nazwa']+`</td>
          <td>`+obj['pochodzenie']+`</td>

        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"selectAlergen");
  request.send(null);
}

/*
* Tworzenie tabeli do menu
*/

function _selectSzklanki() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="napojeTable">
        <thead><tr>
        <td width="35%">Nazwa</td>
          <td width="20%">Pojemność</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
        <td>`+obj['nazwa']+`</td>
          <td>`+obj['pojemnosc']+` ml</td>

        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"selectSzklanki");
  request.send(null);
}

/*
* Tworzenie tabeli do alkoholi
*/

function _selectAlkoh() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="napojeTable">
        <thead><tr>
        <td width="35%">Nazwa</td>
          <td width="20%">Cena</td>
          <td width="20%">Kalorie</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
        <td>`+obj['nazwa']+`</td>
          <td>`+obj['cena']+` zł</td>
          <td>`+obj['kalorie']+` kcal</td>

        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"selectAlkoh");
  request.send(null);
}

//dodawanie do składników do nowego koktajlu
function _addNewSkladnik() {
  document.getElementById('result').innerHTML = `
  <table class="addMenuTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dodaj skladnik do koktajlu</td></tr></thead>
      <form method="post">
      <tr>
        <td class="leftColumn">Koktajl</td>
        <td>
          <select name="id_koktajl" id="id_koktajl"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz koktajl z listy</span></span>
        </td>
      </tr> 
      <tr>
        <td class="leftColumn">Nazwa Składnika</td>
        <td>
          <select name="id_skladniki" id="id_skladniki"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz Składnik</span></span>
        </td>
      </tr>
      
      <tr>
        <td class="leftColumn">Waga</td>
        <td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="waga" id="waga" required /> kg
        &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Waga składnika potrzebnego do przygotowania koktajlu</span></span>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3"  onclick="_addSkladnik()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

  _getListSkladnik();
  _getKoktajlWszystkie();
}

//skladniki
function _getListSkladnik() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_skladniki in objJSON) {
        txt += "<option value='"+objJSON[id_skladniki]['id_skladniki']+"'>"+objJSON[id_skladniki]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_skladniki').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getListSkladnik", true);
  request.send(null);
}

//dodawanie rekorów do menu
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)

function _addSkladnik() {

  var addNSKladnik = {};
  addNSKladnik.id_koktajl = document.getElementById('id_koktajl');
  addNSKladnik.waga = document.getElementById('waga');
  addNSKladnik.id_skladniki = document.getElementById('id_skladniki');
  status.innerHTML = '';

  
  var skladnik = {};
  skladnik.waga = addNSKladnik.waga.value;
  skladnik.id_skladniki = addNSKladnik.id_skladniki[addNSKladnik.id_skladniki.selectedIndex].value;
  skladnik.id_koktajl = addNSKladnik.id_koktajl[addNSKladnik.id_koktajl.selectedIndex].value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
         _lista();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addSkladnik");
  request.send(JSON.stringify(skladnik));
}

//dodawanie do składników napojów i alkoholi
function _addNapojNowy() {
  document.getElementById('result').innerHTML = `
  <table class="addMenuTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dodaj do koktajlu</td></tr></thead>
      <form method="post">
      <tr>
        <td class="leftColumn">Czas przygotowania</td><td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="czas_przygotowania" id="czas_przygotowania" required /> min
        </td>
      </tr>
      <tr>
        <td class="leftColumn">Liczba porcji</td><td>
        <input type="text" value="" pattern="[0-9]+(\\.[0-9][0-9])?" name="liczba_porcji" id="liczba_porcji" required /> szt.
        &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Waga składnika potrzebnego do przygotowania koktajlu</span></span>
        </td>
      </tr>
       <tr>
        <td class="leftColumn">Napój</td>
        <td>
          <select name="id_napoje" id="id_napoje"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz napój z listy</span></span>
        </td>
      </tr> 
       <tr>
        <td class="leftColumn">Alkohol</td>
        <td>
          <select name="id_alkohole" id="id_alkohole"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz alkohol z listy</span></span>
        </td>
      </tr> 
       <tr>
        <td class="leftColumn">Koktajl</td>
        <td>
          <select name="id_koktajl" id="id_koktajl"><option value="0" selected>---</option></select>
          &nbsp;<span class="tooltip">&#9432;<span class="tooltiptext">Wybierz koktajl z listy</span></span>
        </td>
      </tr> 
       <tr>
        <td colspan="2" class="leftColumn">
        <button type="button" class="button button3" onclick="_addNapoj()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;
  _getNapoje();
  _getKoktajlWszystkie();
  _getAlkohole();
}

//napoje
function _getNapoje() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_napoje in objJSON) {
        txt += "<option value='"+objJSON[id_napoje]['id_napoje']+"'>"+objJSON[id_napoje]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_napoje').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getNapoje", true);
  request.send(null);
}

//alkohole
function _getAlkohole() {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id_alkohole in objJSON) {
        txt += "<option value='"+objJSON[id_alkohole]['id_alkohole']+"'>"+objJSON[id_alkohole]['nazwa']+"</option>";
      }
      txt += ``;
      document.getElementById('id_alkohole').innerHTML += txt;
    }
  }
  request.open("GET", baseURL+"getAlkohole", true);
  request.send(null);
}


//dodawanie rekorów do napoju
//funkcja przechwytująca wpisywane wartości i wrzucająca je go kolejnej funkcji denerującej zapytanie (database.php)

function _addNapoj() {

  var addNapoj = {};
  addNapoj.czas_przygotowania = document.getElementById('czas_przygotowania');
  addNapoj.liczba_porcji = document.getElementById('liczba_porcji');
  addNapoj.id_napoje = document.getElementById('id_napoje');
  addNapoj.id_alkohole = document.getElementById('id_alkohole');
  addNapoj.id_koktajl = document.getElementById('id_koktajl');
  status.innerHTML = '';

  
  var napoj_N = {};
  napoj_N.czas_przygotowania = addNapoj.czas_przygotowania.value;
  napoj_N.liczba_porcji = addNapoj.liczba_porcji.value;
  napoj_N.id_napoje = addNapoj.id_napoje[addNapoj.id_napoje.selectedIndex].value;
  napoj_N.id_alkohole = addNapoj.id_alkohole[addNapoj.id_alkohole.selectedIndex].value;
  napoj_N.id_koktajl = addNapoj.id_koktajl[addNapoj.id_koktajl.selectedIndex].value;
  
  var request = getRequestObject();
  request.onreadystatechange = function() {
     if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      status = objJSON['status'];
      if (status == 'ok') {
         _mojeNapoje();
        document.getElementById('result').innerHTML = 'Pomyślnie dodano koktajl!';
      }
      else if (status == 'already_exists') {
        document.getElementById('status').innerHTML = 'Rekord już istnieje!';
      }
      else if (status == 'no_permissions') {
        document.getElementById('status').innerHTML = 'Brak uprawnień';
      }
      else if (status == 'incorrect_data')
        document.getElementById('status').innerHTML = 'Niepoprawne dane!';
      else
        document.getElementById('status').innerHTML = 'Coś poszło nie tak, spróbuj ponownie.';
    }
  }
  request.open("PUT", baseURL+"addNapoj");
  request.send(JSON.stringify(napoj_N));
}

/*
* Tworzenie tabeli do menu
*/

function _lista() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="MenuTable">
        <thead><tr>
          <td width="30%">Nazwa</td>
          <td width="10%">Kalorie</td>
          <td width="10%">Cena</td>
          <td width="15%">Alergen</td>
          <td width="15%">Witaminy</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['nazwa']+`</td>
          <td>`+obj['kalorie']+` kcal</td>
          <td>`+obj['cena']+` zł</td>
          <td>`+obj['id_alergeny']+`</td>
          <td>`+obj['id_witaminy']+`</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getLista");
  request.send(null);
}

/*
* Tworzenie tabeli do menu
*/


function _mojeNapoje() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="MenuTable">
        <thead><tr>
          <td width="30%">Czas sprzygotowania</td>
          <td width="10%">Liczba porcji</td>
          <td width="10%">Napój</td>
          <td width="15%">Alkohol</td>
          <td width="15%">Koktajl</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['czas_przygotowania']+` min</td>
          <td>`+obj['liczba_porcji']+` szt.</td>
          <td>`+obj['napoj']+`</td>
          <td>`+obj['alkohol']+`</td>
          <td>`+obj['koktajl']+`</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"mojeNapoje");
  request.send(null);
}

