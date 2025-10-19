// Info: bcrypt-ts 라이브러리 사용 암호화, 복호화

import * as bcrypt from 'bcrypt-ts';

export class BcryptHasher {
  static async hash(password: string) {
    return await bcrypt.hash(password, 10);
  }
  static async compare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
