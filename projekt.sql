
CREATE TABLE projekt.Obszar (
                id_obszar INTEGER NOT NULL,
                dzielnica VARCHAR NOT NULL,
                CONSTRAINT id_obszar PRIMARY KEY (id_obszar)
);


CREATE SEQUENCE projekt.restauracje_id_restauracje_seq;

CREATE TABLE projekt.Restauracje (
                id_restauracje INTEGER NOT NULL DEFAULT nextval('projekt.restauracje_id_restauracje_seq'),
                nazwa VARCHAR NOT NULL,
                ocena NUMERIC(3,2) NOT NULL,
                id_obszar INTEGER NOT NULL,
                CONSTRAINT id_restauracje PRIMARY KEY (id_restauracje)
);


ALTER SEQUENCE projekt.restauracje_id_restauracje_seq OWNED BY projekt.Restauracje.id_restauracje;

CREATE TABLE projekt.Alergeny (
                id_alergeny INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                pochodzenie VARCHAR NOT NULL,
                CONSTRAINT id_alergeny PRIMARY KEY (id_alergeny)
);


CREATE TABLE projekt.Witaminy (
                id_witaminy INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                CONSTRAINT id_witaminy PRIMARY KEY (id_witaminy)
);


CREATE TABLE projekt.Napoje (
                id_napoje INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                cena NUMERIC(5,2) NOT NULL,
                kalorie INTEGER NOT NULL,
                CONSTRAINT id_napoje PRIMARY KEY (id_napoje)
);


CREATE TABLE projekt.Alkohole (
                id_alkohole INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                cena NUMERIC(5,2) NOT NULL,
                kalorie INTEGER NOT NULL,
                CONSTRAINT id_alkohole PRIMARY KEY (id_alkohole)
);


CREATE TABLE projekt.Szklanki (
                id_szklanki INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                pojemnosc INTEGER NOT NULL,
                CONSTRAINT id_szklanki PRIMARY KEY (id_szklanki)
);


CREATE TABLE projekt.Trudnosc (
                id_trudnosc INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                CONSTRAINT id_trudnosc PRIMARY KEY (id_trudnosc)
);


CREATE TABLE projekt.Skladniki (
                id_skladniki INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                kalorie INTEGER NOT NULL,
                cena NUMERIC(5,2) NOT NULL,
                id_alergeny INTEGER DEFAULT 0 NOT NULL,
                id_witaminy INTEGER NOT NULL,
                CONSTRAINT id_skladniki PRIMARY KEY (id_skladniki)
);


CREATE TABLE projekt.Rodzaj (
                id_rodzaj INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                CONSTRAINT id_rodzaj PRIMARY KEY (id_rodzaj)
);


CREATE SEQUENCE projekt.koktajl_id_koktajl_seq_1;

CREATE TABLE projekt.Koktajl (
                id_koktajl INTEGER NOT NULL DEFAULT nextval('projekt.koktajl_id_koktajl_seq_1'),
                nazwa VARCHAR NOT NULL,
                weganski BOOLEAN NOT NULL,
                alkohol BOOLEAN NOT NULL,
                id_rodzaj INTEGER NOT NULL,
                id_trudnosc INTEGER NOT NULL,
                id_szklanki INTEGER NOT NULL,
                CONSTRAINT id_koktajl PRIMARY KEY (id_koktajl)
);


ALTER SEQUENCE projekt.koktajl_id_koktajl_seq_1 OWNED BY projekt.Koktajl.id_koktajl;

CREATE SEQUENCE projekt.koktajl_srodek_id_kok_srodek_seq_1;

CREATE TABLE projekt.Koktajl_srodek (
                id_kok_srodek INTEGER NOT NULL DEFAULT nextval('projekt.koktajl_srodek_id_kok_srodek_seq_1'),
                czas_przygotowania INTEGER NOT NULL,
                liczba_porcji INTEGER NOT NULL,
                id_napoje INTEGER DEFAULT 0 NOT NULL,
                id_alkohole INTEGER DEFAULT 0 NOT NULL,
                id_koktajl INTEGER NOT NULL,
                CONSTRAINT id_kok_srodek PRIMARY KEY (id_kok_srodek)
);


ALTER SEQUENCE projekt.koktajl_srodek_id_kok_srodek_seq_1 OWNED BY projekt.Koktajl_srodek.id_kok_srodek;

CREATE SEQUENCE projekt.menu_id_menu_seq;

CREATE TABLE projekt.Menu (
                id_menu INTEGER NOT NULL DEFAULT nextval('projekt.menu_id_menu_seq'),
                cena NUMERIC(5,2) NOT NULL,
                id_restauracje INTEGER NOT NULL,
                id_koktajl INTEGER NOT NULL,
                CONSTRAINT id_menu PRIMARY KEY (id_menu)
);


ALTER SEQUENCE projekt.menu_id_menu_seq OWNED BY projekt.Menu.id_menu;

CREATE SEQUENCE projekt.skladniki_koktajlu_id_skl_kokt_seq;

CREATE TABLE projekt.Skladniki_koktajlu (
                id_skl_kokt INTEGER NOT NULL DEFAULT nextval('projekt.skladniki_koktajlu_id_skl_kokt_seq'),
                waga NUMERIC(5,2) NOT NULL,
                id_skladniki INTEGER NOT NULL,
                id_koktajl INTEGER NOT NULL,
                CONSTRAINT id_skl_kokt PRIMARY KEY (id_skl_kokt)
);


ALTER SEQUENCE projekt.skladniki_koktajlu_id_skl_kokt_seq OWNED BY projekt.Skladniki_koktajlu.id_skl_kokt;

ALTER TABLE projekt.Restauracje ADD CONSTRAINT obszar_restauracje_fk
FOREIGN KEY (id_obszar)
REFERENCES projekt.Obszar (id_obszar)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Menu ADD CONSTRAINT restauracje_menu_fk
FOREIGN KEY (id_restauracje)
REFERENCES projekt.Restauracje (id_restauracje)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Skladniki ADD CONSTRAINT alergeny_skladniki_fk
FOREIGN KEY (id_alergeny)
REFERENCES projekt.Alergeny (id_alergeny)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Skladniki ADD CONSTRAINT witaminy_skladniki_fk
FOREIGN KEY (id_witaminy)
REFERENCES projekt.Witaminy (id_witaminy)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Koktajl_srodek ADD CONSTRAINT napoje_koktajl_srodek_fk
FOREIGN KEY (id_napoje)
REFERENCES projekt.Napoje (id_napoje)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Koktajl_srodek ADD CONSTRAINT alkohole_koktajl_srodek_fk
FOREIGN KEY (id_alkohole)
REFERENCES projekt.Alkohole (id_alkohole)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Koktajl ADD CONSTRAINT szklanki_koktajl_fk
FOREIGN KEY (id_szklanki)
REFERENCES projekt.Szklanki (id_szklanki)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Koktajl ADD CONSTRAINT trudnosc_koktajl_fk
FOREIGN KEY (id_trudnosc)
REFERENCES projekt.Trudnosc (id_trudnosc)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Skladniki_koktajlu ADD CONSTRAINT skladniki_skladniki_koktajlu_fk
FOREIGN KEY (id_skladniki)
REFERENCES projekt.Skladniki (id_skladniki)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Koktajl ADD CONSTRAINT rodzaj_koktajl_fk
FOREIGN KEY (id_rodzaj)
REFERENCES projekt.Rodzaj (id_rodzaj)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Skladniki_koktajlu ADD CONSTRAINT koktajl_skladniki_koktajlu_fk
FOREIGN KEY (id_koktajl)
REFERENCES projekt.Koktajl (id_koktajl)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Menu ADD CONSTRAINT koktajl_menu_fk
FOREIGN KEY (id_koktajl)
REFERENCES projekt.Koktajl (id_koktajl)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Koktajl_srodek ADD CONSTRAINT koktajl_koktajl_srodek_fk
FOREIGN KEY (id_koktajl)
REFERENCES projekt.Koktajl (id_koktajl)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;
