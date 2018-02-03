export class ProductSearch {

    private productName: String;
    private productPictureUrl: String;
    private preservatives: [{
                nazwaZwyczajowa: String;
                oznaczenie: String;
                opis: String;
            }];
    private diseases: [String];
    private productOwner: String;
    private productType: String;

    //

    getProductName() {
        return this.productName;
    }
    setProductName(productName: String) {
        this.productName = productName;
    }
    //
    getProductPictureUrl() {
        return this.productPictureUrl;
    }
    setProductPictureUrl(productPictureUrl: String) {
        this.productPictureUrl = productPictureUrl;
    }
    //
    getPreservatives() {
        return this.preservatives;
    }
    setPreservatives(preservatives: [{nazwaZwyczajowa: String; oznaczenie: String; opis: String}]) {
        this.preservatives = preservatives;
    }
    //
    getDiseases() {
        return this.diseases;
    }
    setDiseases(diseases: [String]) {
        this.diseases = diseases;
    }
    //
    getProductOwner() {
        return this.productOwner;
    }
    setProductOwner(productOwner: String) {
        this.productOwner = productOwner;
    }
    //
    getProductType() {
        return this.productType;
    }
    setProductType(productType: String) {
        this.productType = productType;
    }

}
