export interface PreservativeAddModel {
    token: String;
    add: {
        preservativeType: String;
        preservativeSign: String;
        preservativeDescription: String;
        preservativeCommonName: String;
        preservativeDiseases: String[];
    };
}
