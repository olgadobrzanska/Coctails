var request;
var objJSON;
var id_mongo;
var userID=0;
var userData = {};
var baseURL = "http://cos/bazy/rest/";
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



/*
* Koktajle
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
          <td width="30%">nazwa</td>
          <td width="15%">weganski</td>
          <td width="15%">alkohol</td>
          <td width="15%">rodzaj</td>
          <td width="15%">Trudnosc</td>
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
* Alkohole
*/

function _listaAlkoholi() {
  document.getElementById('result').innerHTML = '';
  request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table class="alkoholTable">
        <thead><tr>
          <td width="33%">nazwa</td>
          <td width="33%">weganski</td>
          <td width="33%">alkohol</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['nazwa']+`</td>
          <td>`+obj['cena']+`</td>
          <td>`+obj['kalorie']+`</td>
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




function _createVehiclesSelectValues(selectId) {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = ``;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `<option value='`+obj['nazwa']+`'>`+obj['cena']+` `+obj['kalorie']+`)</option>`;
      }
      document.getElementById(selectId).innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getVehicles");
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
      for (var id_witaminy in objJSON) {
        txt += "<option value='"+objJSON[id_witaminy]['id_witaminy']+"'>"+objJSON[id_witaminy]['nazwa']+"</option>";
      }
      txt += `</select>
      </form>`;

      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getZdrowie");
  request.send(null);

}

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
          <td width="40%">Skladnik</td>
          <td width="10%">Witaminy</td>
          <td width="10%">Alergeny</td>
        </tr></thead>
      `;
      for (var id_koktajl in objJSON) {
        obj = objJSON[id_koktajl];
        txt += `
        <tr>
          <td>`+obj['skladnik']+`</td>
          <td>`+obj['koktajl']+`</td>
          <td>`+obj['alergen']+`</td>
          <td>`+obj['weganski']+`</td>
          <td>`+obj['alkohol']+`</td>
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
* Skladniki
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
          <td width="25%">Nazwa</td>
          <td width="15%">Napoje</td>
          <td width="10%">Alkohol</td>
          <td width="15%">Produkty</td>
          <td width="10%">Srednia cena</td>
          <td width="10%">Liczba kcal</td>
          <td width="15%">Szkło</td>
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
          <td>`+obj['cena']+` zł</td>
          <td>`+obj['kcal']+` kcal</td>
          <td>`+obj['szklo']+`</td>
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

function _panel() {
  document.getElementById('data').innerHTML = `
  <div style="margin: auto; width: 400px; align: center;">
  <table class="loginForm" style="width: 100%; text-align: center;">
  <thead><tr><td colspan="2">Co chcesz zrobic?</td></tr></thead>
    <form method='post'>
      <tr>
        <td width="50%"><button onclick="_addNewKoktajl();" value="Dodaj">Dodaj koktajl</button></td>
        <td width="50%"><button onclick="_addNewRestauracja();" value="Dodaj">Dodaj restauracje</button></td>
      </tr>
     <tr>
        <td width="50%"><button onclick="_addNewKoktajl();" value="Dodaj">Dodaj koktajl do resta</button></td>
        <td width="50%"><button onclick="_addNewRestauracja();" value="Dodaj">Dodaj restauracje</button></td>
      </tr>
      
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
        <td><input type="text" value="" pattern="[A-Za-z-ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50"></td>
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
        <button type="button" onclick="_addKoktajl()">Dodaj</button>
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


function _addNewRestauracja() {
  document.getElementById('result').innerHTML = `
  <table class="addRestauracjaTable" style="width: 75%;">
      <thead><tr><td colspan="2">Dane Restauracji</td></tr></thead>
      <form method="post">
      <tr>
        <td class="leftColumn">Nazwa restauracji</td>
        <td><input type="text" value="" pattern="[A-Za-z-ąćęłńóśźżĄĘŁŃÓŚŹŻ]+" name="nazwa" id="nazwa" size="50" required></td>
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
        <button type="button" onclick="_addRestauracja()">Dodaj</button>
        </td>
      </tr>
    </table>
  </form>
  <span id="status"></span>
  `;

  _getObszarTabela();
}

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
* Koktajle
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
