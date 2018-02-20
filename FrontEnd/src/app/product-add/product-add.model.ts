export interface ProductAddModel {
    token: String;
    add: {
        productType: String;
        productFamily: String;
        productName: {
            Name: String;
            UrlObrazka: String;
        },
        productOwner: String;
        productPreservatives: String[];
    };
}
