import { Injectable } from '@nestjs/common';
import { LotPhoto } from './lot-photo.entity';

@Injectable()
export class LotPhotoService {
  bulkCreateByKeys(keys: string[], userId: number): Promise<LotPhoto[]> {
    const drafts = keys.map((key) => ({ key, user: userId }));
    return LotPhoto.save(drafts);
  }
}
