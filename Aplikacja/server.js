const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase('http://neo4j:baza@localhost:7474');
const productModel = require('./models/product');
const preservativeModel = require('./models/preservative');
const diseaseModel = require('./models/disease');
const token = 'Z69DWMsps0BIPFr8ccAKfsI6vc7SWPMB';

const app = express();

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });

//middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json())
const urlencodedParser = bodyParser.json({ extended: false });

//routes
app.get('/', function(req, res){
    res.status(200).send('<h1>Knowledge database API</h1>');
});

app.get('/get/all_preservatives', urlencodedParser, function(req,res){

    db.cypher({
        query: 'MATCH (x:Oznaczenie)' +
               'RETURN x',
    }, function (err, results) {

        if (err) {
            console.log(err);
            res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
        }

        res.status(200).send(results);
    })
});

app.get('/get/all_product', urlencodedParser, function(req,res){

    db.cypher({
        query: 'MATCH (x:Nazwa)' +
               'RETURN x',
    }, function (err, results) {

        if (err) {
            console.log(err);
            res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
        }

        res.status(200).send(results);
    })
});

app.get('/get/all_diseases', urlencodedParser, function(req,res){

    db.cypher({
        query: 'MATCH (x:Choroba)' +
               'RETURN x',
    }, function (err, results) {

        if (err) {
            console.log(err);
            res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
        }

        res.status(200).send(results);
    })
});

app.post('/search/product', urlencodedParser, function(req,res){

    var body = req.body;
    var searchValue;
    
    if (typeof body.search === "undefined"){

        let jsonString = JSON.stringify({"search":"query_that_you_want_to_search"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        searchValue = body.search;
        
        var product = new productModel.ProductModel();

        db.cypher({
            query: 'MATCH (x:Nazwa {Nazwa: {productSearch}})' +
                   'RETURN x',
            params: { 
                productSearch: searchValue,
            },
        }, function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }

            var result = results[0];
            if (!result) {
                res.status(204).send();
            } else {

                product.setProductName(results[0].x.properties.Nazwa);
                product.setProductPictureUrl(results[0].x.properties.Url_obrazka);

                db.cypher({
                    query: 'MATCH (x:Nazwa {Nazwa: {preservativesSearch}})' +
                           'MATCH (x)-[r:Zawiera]->(y)' +
                           'RETURN y',
                    params: { 
                        preservativesSearch: results[0].x.properties.Nazwa,
                    },
                }, function (preservativesErr, preservativesResults) {
        
                    if (preservativesErr) {
                        console.log(preservativesErr);
                        res.status(400).send('<h4>Unexpecting error occured ' + preservativesErr + '</h4>');
                    }
        
                    var preservativesResult = preservativesResults[0];
                    if (!preservativesResult) {

                        res.status(200).send('<h4>Product does not contain any preservatives</h4>');
                    
                    } else {

                        let preservativesTempObject = [];
                                                
                        for (let i=0; i<preservativesResults.length; i++){
                            let tempObject = {};
                            for (let preservative in preservativesResults[i].y.properties) {                                                              
                                tempObject[preservative] = preservativesResults[i].y.properties[preservative];
                            };
                            preservativesTempObject.push(tempObject);
                        };

                        let diseasesTempObject = [];
                        
                        

                        function diseasesCallback(_callback, tabLength){

                            for (let preservativeSign in preservativesTempObject){
                                
                                if (preservativesTempObject.hasOwnProperty(preservativeSign)) {

                                    db.cypher({
                                        query: 'MATCH (x:Oznaczenie {Oznaczenie:{diseaseSearch}})' +
                                            'OPTIONAL MATCH (x)-[r:Może_powodować]->(y)' +
                                            'RETURN y',
                                        params: { 
                                            diseaseSearch: preservativesTempObject[preservativeSign].Oznaczenie,
                                        },
                                    }, function (diseasesErr, diseasesResults) {
                            
                                        if (diseasesErr) {
                                            console.log(diseasesErr);
                                            res.status(400).send('<h4>Unexpecting error occured ' + diseasesErr + '</h4>');
                                        }
                            
                                        var diseaseResult = diseasesResults[0];
                                        if (true===false) {
                                            
                                        } else {

                                            let filteredDiseaseResults = [];
                                            
                                            for(let z=0; z<diseasesResults.length; z++){
                                                for(let value in diseasesResults[z]){
                                                    if(diseasesResults[z][value] !== null){
                                                        filteredDiseaseResults.push(diseasesResults[z][value]);
                                                    }
                                                }
                                            }


                                            for(let y=0; y<filteredDiseaseResults.length; y++){
                                                for(let filter in filteredDiseaseResults[y].properties){
                                                    diseasesTempObject.push(filteredDiseaseResults[y].properties[filter]);
                                                    //console.log(diseasesTempObject);
                                                }
                                            }

                                            
                                            tabLength--;
                                            if (tabLength === 0) {
                                                _callback();
                                            }
                                            
                                        }



                                        
                                        }
                                    )};
                                    
                                }

                            }

                            diseasesCallback(function(){

                                //console.log('________________________');
                                //console.log(diseasesTempObject);

                                product.setPreservatives(preservativesTempObject);

                                let uniqueDiseases = []
                                for(let p = 0;p < diseasesTempObject.length; p++){
                                    if(uniqueDiseases.indexOf(diseasesTempObject[p]) == -1){
                                       uniqueDiseases.push(diseasesTempObject[p])
                                    }
                                }

                                product.setDiseases(uniqueDiseases);

                                db.cypher({
                                    query: 'MATCH (x:Nazwa {Nazwa: {ownerSearch}})' +
                                           'MATCH (x)-[:Jest_instancją]->(y)' +
                                           'MATCH (y)<-[:Jest_właścicielem]-(z)' +
                                           'RETURN z' ,
                                    params: { 
                                        ownerSearch: searchValue,
                                    },
                                }, function (ownerErr, ownerResults) {
                        
                                    if (ownerErr) {
                                        console.log(ownerErr);
                                        res.status(400).send('<h4>Unexpecting error occured ' + ownerErr + '</h4>');
                                    }
                        
                                    var ownerResult = ownerResults[0];
                                    if (true===false) {
                                        
                                    } else {
                                        
                                        product.setProductOwner(ownerResults[0].z.properties.Producent);

                                        db.cypher({
                                            query: 'MATCH (x:Nazwa {Nazwa: {typeSearch}})' +
                                                   'MATCH (x)-[:Jest_instancją]->(y)' +
                                                   'MATCH (y)-[:Jest_instancją]->(z)' +
                                                   'RETURN z' ,
                                            params: { 
                                                typeSearch: searchValue,
                                            },
                                        }, function (typeErr, typeResults) {
                                
                                            if (typeErr) {
                                                console.log(typeErr);
                                                res.status(400).send('<h4>Unexpecting error occured ' + typeErr + '</h4>');
                                            }
                                
                                            var typeResult = typeResults[0];
                                            if (true===false) {
                                                
                                            } else {

                                                product.setProductType(typeResults[0].z.properties.Rodzaj);

                                                res.json(product);
                                            }
                                        });
                                    }
                                });

                            },preservativesTempObject.length);
                            
                            

                            
                        }

                }
                )};    
        });
    }   

});

app.post('/search/preservative', urlencodedParser, function(req,res){

    var body = req.body;
    var searchValue;

    if (typeof body.search === "undefined"){

        let jsonString = JSON.stringify({"search":"query_that_you_want_to_search"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        searchValue = body.search;

        var preservative = new preservativeModel.PreservativeModel();

        db.cypher({
            query: 'MATCH (x:Oznaczenie {Oznaczenie: {preservativeSearch}})' +
                   'RETURN x',
            params: { 
                preservativeSearch: searchValue,
            },
        }, function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }

            var result = results[0];
            if (!result) {
                res.status(204).send();
            } else {
                preservative.setPreservativeSign(results[0].x.properties.Oznaczenie);
                preservative.setPreservativeCommonName(results[0].x.properties.Nazwa_zwyczajowa);
                preservative.setPreservativeDescribe(results[0].x.properties.Opis);

                db.cypher({
                    query: 'MATCH (x:Oznaczenie {Oznaczenie: {typeSearch}})' +
                           'MATCH (x)-[:Jest_instancją]->(y)' +
                           'RETURN y',
                    params: { 
                        typeSearch: results[0].x.properties.Oznaczenie,
                    },
                }, function (typeSearchErr, typeSearchResults) {
        
                    if (typeSearchErr) {
                        console.log(typeSearchErr);
                        res.status(400).send('<h4>Unexpecting error occured ' + typeSearchErr + '</h4>');
                    }
        
                    var typeSearchResult = typeSearchResults[0];
                    if (!typeSearchResult) {
                        
                    } else {
                        preservative.setPreservativeType(typeSearchResults[0].y.properties.Typ_dodatku_do_żywności);

                        db.cypher({
                            query: 'MATCH (x:Oznaczenie {Oznaczenie: {diseasesSearch}})' +
                                   'MATCH (x)-[:Może_powodować]->(y)' +
                                   'RETURN y',
                            params: { 
                                diseasesSearch: results[0].x.properties.Oznaczenie,
                            },
                        }, function (diseasesSearchErr, diseasesSearchResults) {
                
                            if (diseasesSearchErr) {
                                console.log(diseasesSearchErr);
                                res.status(400).send('<h4>Unexpecting error occured ' + diseasesSearchErr + '</h4>');
                            }
                
                            var diseasesSearchResult = diseasesSearchResults[0];
                            console.log(diseasesSearchResult);
                            if (!diseasesSearchResult) {
                                let emptyTab = [];
                                preservative.setPreservativeDiseases(emptyTab);

                                db.cypher({
                                    query: 'MATCH (x:Oznaczenie {Oznaczenie: {productsSearch}})' +
                                           'MATCH (x)<-[:Zawiera]-(y)' +
                                           'RETURN y',
                                    params: { 
                                        productsSearch: results[0].x.properties.Oznaczenie,
                                    },
                                }, function (productsSearchErr, productsSearchResults) {
                        
                                    if (productsSearchErr) {
                                        console.log(productsSearchErr);
                                        res.status(400).send('<h4>Unexpecting error occured ' + productsSearchErr + '</h4>');
                                    }
                        
                                    var productsSearchresult = productsSearchResults[0];
                                    if (!productsSearchresult) {
                                        let emptyProductsTab = [];
                                        preservative.setPreservativeProducts(emptyProductsTab);

                                        res.status(200).json(preservative);
                                    } else {
                                        let productsTempTab = [];
                                        for(let i=0; i<productsSearchResults.length; i++){
                                            
                                            productsTempTab.push(productsSearchResults[i].y.properties.Nazwa);        
                                            
                                        }

                                        preservative.setPreservativeProducts(productsTempTab);

                                        res.status(200).json(preservative);

                                    }
                                });

                                
                            } else {
                                let diseasesTempTab = [];

                                for(let i=0; i<diseasesSearchResults.length; i++){
                                    for(let disease in diseasesSearchResults[i].y.properties){
                                        diseasesTempTab.push(diseasesSearchResults[i].y.properties[disease]);        
                                    }
                                }

                                preservative.setPreservativeDiseases(diseasesTempTab);

                                db.cypher({
                                    query: 'MATCH (x:Oznaczenie {Oznaczenie: {productsSearch}})' +
                                           'MATCH (x)<-[:Zawiera]-(y)' +
                                           'RETURN y',
                                    params: { 
                                        productsSearch: results[0].x.properties.Oznaczenie,
                                    },
                                }, function (productsSearchErr, productsSearchResults) {
                        
                                    if (productsSearchErr) {
                                        console.log(productsSearchErr);
                                        res.status(400).send('<h4>Unexpecting error occured ' + productsSearchErr + '</h4>');
                                    }
                        
                                    var productsSearchresult = productsSearchResults[0];
                                    if (!productsSearchresult) {
                                        let emptyProductsTab = [];
                                        preservative.setPreservativeProducts(emptyProductsTab);

                                        res.status(200).json(preservative);
                                    } else {
                                        let productsTempTab = [];
                                        for(let i=0; i<productsSearchResults.length; i++){
        
                                            productsTempTab.push(productsSearchResults[i].y.properties.Nazwa);        
                                            
                                        }

                                        preservative.setPreservativeProducts(productsTempTab);

                                        res.status(200).json(preservative);

                                    }
                                });
                                

                            }
                        });

                    }
                });

                
            }
        });


    }

});

app.post('/search/disease', urlencodedParser, function(req,res){

    var body = req.body;
    var searchValue;

    if (typeof body.search === "undefined"){

        let jsonString = JSON.stringify({"search":"query_that_you_want_to_search"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        searchValue = body.search;

        var disease = new diseaseModel.DiseaseModel();

        db.cypher({
            query: 'MATCH (x:Choroba {Choroba: {diseaseSearch}})' +
                   'RETURN x',
            params: { 
                diseaseSearch: searchValue,
            },
        }, function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }

            var result = results[0];
            if (!result) {
                res.status(204).send();
            } else {
                disease.setDiseaseName(results[0].x.properties.Choroba);

                db.cypher({
                    query: 'MATCH (x:Choroba {Choroba: {diseasePreservativesSearch}})' +
                           'MATCH (x)<-[:Może_powodować]-(y)' +
                           'RETURN y',
                    params: { 
                        diseasePreservativesSearch: results[0].x.properties.Choroba,
                    },
                }, function (diseasePreservativesErr, diseasePreservativesResults) {
        
                    if (diseasePreservativesErr) {
                        console.log(diseasePreservativesErr);
                        res.status(400).send('<h4>Unexpecting error occured ' + diseasePreservativesErr + '</h4>');
                    }
        
                    var diseasePreservativesResult = diseasePreservativesResults[0];
                    if (!diseasePreservativesResult) {
                        let diseasesEmptyTempTab = []
                        disease.setDiseasePreservatives(diseasesEmptyTempTab);
                        res.status(200).json(disease);
                    } else {
                        let diseasesTempTab = [];
                        
                        for(let i=0; i<diseasePreservativesResults.length; i++){
                            let diseaseTempObject = {};
                            diseaseTempObject['Oznaczenie'] = diseasePreservativesResults[i].y.properties.Oznaczenie;
                            diseaseTempObject['NazwaZwyczajowa'] = diseasePreservativesResults[i].y.properties.Nazwa_zwyczajowa;
                            diseaseTempObject['Opis'] = diseasePreservativesResults[i].y.properties.Opis;
                            diseasesTempTab.push(diseaseTempObject);
                        }

                        disease.setDiseasePreservatives(diseasesTempTab);
                        res.status(200).json(disease);
                    }
                });

    
            }
        });

    }

});

app.post('/search/product/hint', urlencodedParser, function(req,res){

    var body = req.body;
    var searchValue;

    if (typeof body.hint === "undefined"){

        let jsonString = JSON.stringify({"hint":"string_that_you_want_to_check_if_any_node_contains"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        searchValue = body.hint;

        let hintArr = [];

        db.cypher({
            query: 'MATCH (x:Nazwa)' +
                   'WHERE x.Nazwa CONTAINS {productHint}' +
                   'RETURN x',
            params: { 
                productHint: searchValue,
            },
        }, function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }

            var result = results[0];
            if (!result) {
                res.status(204).send();
            } else {
                for(let i=0; i<results.length; i++){
                    hintArr.push(results[i].x.properties.Nazwa)
                }
                let hints = {
                    hints: hintArr
                }
                res.status(200).send(hints);

            }
        });

    }

});

app.post('/search/preservative/hint', urlencodedParser, function(req,res){

    var body = req.body;
    var searchValue;

    if (typeof body.hint === "undefined"){

        let jsonString = JSON.stringify({"hint":"string_that_you_want_to_check_if_any_node_contains"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        searchValue = body.hint;

        let hintArr = [];

        db.cypher({
            query: 'MATCH (x:Oznaczenie)' +
                   'WHERE x.Oznaczenie CONTAINS {preservativeHint}' +
                   'RETURN x',
            params: { 
                preservativeHint: searchValue,
            },
        }, function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }

            var result = results[0];
            if (!result) {
                res.status(204).send();
            } else {
                for(let i=0; i<results.length; i++){
                    hintArr.push(results[i].x.properties.Oznaczenie);
                }
                let hints = {
                    hints: hintArr
                }
                res.status(200).send(hints);

            }
        });

    }
    
});

app.post('/search/disease/hint', urlencodedParser, function(req,res){

    var body = req.body;
    var searchValue;

    if (typeof body.hint === "undefined"){

        let jsonString = JSON.stringify({"hint":"string_that_you_want_to_check_if_any_node_contains"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        searchValue = body.hint;

        let hintArr = [];

        db.cypher({
            query: 'MATCH (x:Choroba)' +
                   'WHERE x.Choroba CONTAINS {diseaseHint}' +
                   'RETURN x',
            params: { 
                diseaseHint: searchValue,
            },
        }, function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }

            var result = results[0];
            if (!result) {
                res.status(204).send();
            } else {
                for(let i=0; i<results.length; i++){
                    hintArr.push(results[i].x.properties.Choroba);
                }
                let hints = {
                    hints: hintArr
                }
                res.status(200).send(hints);

            }
        });

    }
    
});

app.post('/add/product', urlencodedParser, async (req, res) => {

    var body = req.body;

    if(typeof body.add === "undefined"){

        let jsonString = JSON.stringify({"token":"API_acces_token","add":"Object_of_product_that_you_want_to_add"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        var ifExistInDatabase = true;

        function checkIfPreservativeExist(preservative) {

            return new Promise(function(resolve,reject){

                db.cypher({

                    query: 'MATCH (x:Oznaczenie)' +
                           'WHERE x.Oznaczenie = {searchValue}' +
                           'RETURN x',
                    params: { 
                        searchValue: preservative,
                    },
                }, function (err, results) {
        
                    if (err) {
                        console.log(err);
                        res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
                    }
        
                    var result = results[0];
                    if (!result) {
                        resolve(false);
                    }else{
                        reject('Preservative exist');
                    }
                });
            });
        };
        

        for(let i=0; i<body.add.productPreservatives.length; i++){
        
            await checkIfPreservativeExist(body.add.productPreservatives[i]).then(function(resolve){
                ifExistInDatabase = resolve;
            }).catch(function(rej){});
        
        }

        if(ifExistInDatabase === false){
            res.status(400).send('<h4>One or more preservative does not exist in database, please add missing preservative first.</h4>');
        } else {

            db.cypher({

                query: 'MERGE (typ:Typ {Typ: "Napój"})' +
                       'MERGE (rodzaj:Rodzaj {Rodzaj: {productType}})' +
                       'MERGE (typ)-[:Hiperonim]->(rodzaj)' +
                       'MERGE (rodzaj)-[:Hiponim]->(typ)' +
                       'MERGE (nazwa_produktu:Nazwa_produktu {Nazwa_produktu: {productFamily}})' +
                       'MERGE (rodzaj)<-[:Jest_instancją]-(nazwa_produktu)' +
                       'MERGE (nazwa:Nazwa {Nazwa: {productName}, Url_obrazka: {productImgUrl}})' +
                       'MERGE (nazwa_produktu)<-[:Jest_instancją]-(nazwa)' +
                       'MERGE (producent:Producent {Producent: {productOwner}})' +
                       'MERGE (producent)-[:Jest_właścicielem]->(nazwa_produktu)',
                params: { 
                    productType: body.add.productType,
                    productFamily: body.add.productFamily,
                    productName: body.add.productName.Name,
                    productImgUrl: body.add.productName.UrlObrazka,
                    productOwner: body.add.productOwner, 
                },
            }, function (err, results) {
    
                if (err) {
                    console.log(err);
                    res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
                }

                body.add.productPreservatives.forEach(function(preservative){
    
                    db.cypher({

                        query: 'MATCH (nazwa:Nazwa {Nazwa: {productName}})' +
                               'MATCH (oznaczenie:Oznaczenie {Oznaczenie: {preservative}})' +
                               'MERGE (nazwa)-[:Zawiera]->(oznaczenie)',
                        params: { 
                            productName: body.add.productName.Name,
                            preservative: preservative, 
                        },
                    }, function (err, results) {
            
                        if (err) {
                            console.log(err);
                            res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
                        }else{
                        
                        }
        
                    });

                }); 
                
                res.status(200).send(true);

            });

        }
    
                
    }
            

});

app.post('/add/preservative', urlencodedParser, (req, res) => {

    var body = req.body;

    if(typeof body.add === "undefined"){

        let jsonString = JSON.stringify({"token":"API_acces_token","add":"Object_of_preservative_that_you_want_to_add"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        db.cypher({

            query: 'MERGE (dodatki_do_żywności:Żywność {Dodatki_do_żywności: "Dodatki do żywności"})' +
                   'MERGE (typ_dodatku_do_żywności:Typ_dodatku_do_żywności {Typ_dodatku_do_żywności: {preservativeType}})' +
                   'MERGE (dodatki_do_żywności)-[:Hiperonim]->(typ_dodatku_do_żywności)' +
                   'MERGE (typ_dodatku_do_żywności)-[:Hiponim]->(dodatki_do_żywności)' +
                   'MERGE (oznaczenie:Oznaczenie {Oznaczenie: {preservativeSign}, Opis: {preservativeDescription}, Nazwa_zwyczajowa: {preservativeCommonName}})' +
                   'MERGE (typ_dodatku_do_żywności)<-[:Jest_instancją]-(oznaczenie)',
            params: { 
                preservativeType: body.add.preservativeType,
                preservativeSign: body.add.preservativeSign,
                preservativeDescription: body.add.preservativeDescription, 
                preservativeCommonName: body.add.preservativeCommonName,
                 
            },
        }, function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>')
            }
            

                for(var i=0; i<body.add.preservativeDiseases.length; i++){

                    db.cypher({

                        query:  'MERGE (choroba:Choroba {Choroba: {preservativeDisease}})' +
                                'MERGE (oznaczenie:Oznaczenie {Oznaczenie: {preservativeSign}})' +
                                'MERGE (oznaczenie)-[:Może_powodować]->(choroba)',                               
                        params: { 
                            preservativeDisease: body.add.preservativeDiseases[i],
                            preservativeSign: body.add.preservativeSign,
                             
                        },
                    }, function (err, results) {
                        
                        if (err) {
                            console.log(err);
                            res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>')
                        }

                    }
                );

            }

                res.status(200).send(true);
            });
            };
});



app.post('/delete/product', urlencodedParser, async (req, res) => {

    var body = req.body;
    var deleteValue;

    if (typeof body.delete === "undefined"){

        let jsonString = JSON.stringify({"delete":"product_that_you_want_to_delete"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        deleteValue = body.delete;

        db.cypher({

            query: 'MATCH (n:Nazwa {Nazwa:{deleteProduct}})' +
                   'DETACH DELETE n',
            params: { 
                deleteProduct: deleteValue
                 
            },
        }, async function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }else{

                res.status(400).send(true);

            }
        
        });

    }

});

app.post('/edit/product', urlencodedParser, async (req, res) => {

    var body = req.body;
    

    if (typeof body.edit === "undefined"){

        let jsonString = JSON.stringify({"edit":"product_that_you_want_to_edit"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        db.cypher({

            query: 'MATCH (n:Nazwa {Nazwa:{oldName}})' +
                   'SET n.Nazwa = {newName}' +
                   'SET n.Url_obrazka = {pictureUrl}',
            params: { 
                oldName: body.edit.oldName,
                newName: body.edit.newName,
                pictureUrl: body.edit.pictureUrl
                 
            },
        }, async function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }else{

                res.status(400).send(true);

            }
        
        });

    }

});

app.post('/delete/preservative', urlencodedParser, async (req, res) => {

    var body = req.body;
    var deleteValue;

    if (typeof body.delete === "undefined"){

        let jsonString = JSON.stringify({"delete":"preservative_that_you_want_to_delete"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        deleteValue = body.delete;

        db.cypher({

            query: 'MATCH (n:Oznaczenie {Oznaczenie:{deletePreservative}})' +
                   'DETACH DELETE n',
            params: { 
                deletePreservative: deleteValue
                 
            },
        }, async function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }else{

                res.status(400).send(true);

            }
        
        });

    }

});

app.post('/edit/preservative', urlencodedParser, async (req, res) => {

    var body = req.body;
    

    if (typeof body.edit === "undefined"){

        let jsonString = JSON.stringify({"edit":"preservative_that_you_want_to_edit"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        db.cypher({

            query: 'MATCH (n:Oznaczenie {Oznaczenie:{oldPreservativeSign}})' +
                   'SET n.Oznaczenie = {newPreservativeSign}' +
                   'SET n.Nazwa_zwyczajowa = {preservativeCommonName}' +
                   'SET n.Opis = {preservativeDescription}',
            params: { 
                oldPreservativeSign: body.edit.oldPreservativeSign,
                newPreservativeSign: body.edit.newPreservativeSign,
                preservativeCommonName: body.edit.preservativeCommonName,
                preservativeDescription: body.edit.preservativeDescription
                 
            },
        }, async function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }else{

                res.status(400).send(true);

            }
        
        });

    }

});

app.post('/delete/disease', urlencodedParser, async (req, res) => {

    var body = req.body;
    var deleteValue;

    if (typeof body.delete === "undefined"){

        let jsonString = JSON.stringify({"delete":"disease_that_you_want_to_delete"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        deleteValue = body.delete;

        db.cypher({

            query: 'MATCH (n:Choroba {Choroba:{deleteDisease}})' +
                   'DETACH DELETE n',
            params: { 
                deleteDisease: deleteValue
                 
            },
        }, async function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }else{

                res.status(400).send(true);

            }
        
        });

    }

});

app.post('/edit/disease', urlencodedParser, async (req, res) => {

    var body = req.body;
    

    if (typeof body.edit === "undefined"){

        let jsonString = JSON.stringify({"edit":"disease_that_you_want_to_edit"});
        let response = 'JSON data are not valid, please provide data in ' + jsonString + ' format';

        res.status(400).send('<h4>' + response + '</h4>');

    }else{

        db.cypher({

            query: 'MATCH (n:Choroba {Choroba:{oldName}})' +
                   'SET n.Choroba = {newName}',
            params: { 
                oldName: body.edit.oldName,
                newName: body.edit.newName
                 
            },
        }, async function (err, results) {

            if (err) {
                console.log(err);
                res.status(400).send('<h4>Unexpecting error occured ' + err + '</h4>');
            }else{

                res.status(400).send(true);

            }
        
        });

    }

});


app.listen(3000, function(err){
        console.log('Server Started on port 3000');
});