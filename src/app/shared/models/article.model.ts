import { Content } from './content.model';

export class Article {
  constructor (
    public slug: string,
    public category: string,
    public contents: Content[],
    public id?: number,
    public createdAt?: string,
    public updatedAt?: string,
  ) {}
}
