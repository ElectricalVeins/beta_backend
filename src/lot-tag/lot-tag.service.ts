// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { LotTag } from './lot-tag.entity';

@Injectable()
export class LotTagService {
  async bulkCreateOrFindTags(tagNames: string[]): Promise<LotTag[]> {
    const foundTags = await LotTag.find({ where: { name: In(tagNames) } });
    const foundTagNames = foundTags.map(({ name }) => name);
    const drafts = tagNames.filter((tag) => !foundTagNames.includes(tag)).map((name) => ({ name }));
    const createdTags = await LotTag.save(drafts as any);
    return [...foundTags, ...createdTags];
  }
}
