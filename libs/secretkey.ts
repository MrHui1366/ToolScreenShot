declare module CryptoJS {
    export class AES {
        //  var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
        //  var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
        static encrypt( message, key, data?);
        static decrypt( ciphertext, key, data?);
    }
    export class enc {
        static Utf8: any;
    }
    export class mode {
        static CBC: any;
    }

    export class pad {
        static Pkcs7: any;
    }
}
