import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoService {

  private readonly SECRET_KEY = 'secret-key';

  doEncrypt(source: string) {
    let cipherd = CryptoJS.AES.encrypt(JSON.stringify(source), this.SECRET_KEY);
    let cipherdText = cipherd.toString();
    return cipherdText;
  }

  doDecrypt(cryptedtext): string {
    let bytes = CryptoJS.AES.decrypt(cryptedtext, this.SECRET_KEY);
    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }

}
