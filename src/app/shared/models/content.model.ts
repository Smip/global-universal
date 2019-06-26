export class Content {
  constructor (
    public title: string,
    public body: string,
    public lang: string,
    public id?: number,
    public article_content_id?: number,
    public createdAt?: string,
    public updatedAt?: string,
  ) {}
}
