LOAD CSV WITH HEADERS FROM 'file:///produktyFinal1.csv' AS line

MERGE (produkt:Produkt {Produkt: 'Produkt'})
MERGE (typ:Typ {Typ: line.Typ})
MERGE (rodzaj:Rodzaj {Rodzaj: line.Rodzaj})
MERGE (nazwa_produktu:Nazwa_produktu {Nazwa_produktu: line.Nazwa_produktu})
MERGE (nazwa:Nazwa {Nazwa: line.Nazwa, Url_obrazka: line.Url_obrazka})
MERGE (producent:Producent {Producent: line.Producent})
MERGE (dodatki_do_�ywno�ci:�ywno�� {Dodatki_do_�ywno�ci: 'Dodatki do �ywno�ci'})
MERGE (typ_dodatku_do_�ywno�ci:Typ_dodatku_do_�ywno�ci {Typ_dodatku_do_�ywno�ci: line.Typ_dodatku_do_�ywno�ci})
MERGE (oznaczenie:Oznaczenie {Oznaczenie: line.Oznaczenie, Opis: line.Opis, Nazwa_zwyczajowa: line.Nazwa_zwyczajowa})


MERGE (produkt)-[:Hiperonim]->(typ)
MERGE (typ)-[:Hiponim]->(produkt)
MERGE (typ)-[:Hiperonim]->(rodzaj)
MERGE (rodzaj)-[:Hiponim]->(typ)
MERGE (rodzaj)<-[:Jest_instancj�]-(nazwa_produktu)
MERGE (nazwa_produktu)<-[:Jest_instancj�]-(nazwa)
MERGE (dodatki_do_�ywno�ci)-[:Hiperonim]->(typ_dodatku_do_�ywno�ci)
MERGE (typ_dodatku_do_�ywno�ci)-[:Hiponim]->(dodatki_do_�ywno�ci)
MERGE (typ_dodatku_do_�ywno�ci)<-[:Jest_instancj�]-(oznaczenie)
MERGE (nazwa)-[:Zawiera]->(oznaczenie)
MERGE (producent)-[:Jest_w�a�cicielem]->(nazwa_produktu)

WITH line, oznaczenie
FOREACH (x IN CASE WHEN line.Choroba IS NULL THEN [] ELSE [1] END |
  MERGE (choroba:Choroba {Choroba: line.Choroba})
  MERGE (oznaczenie)-[:Mo�e_powodowa�]->(choroba)
)