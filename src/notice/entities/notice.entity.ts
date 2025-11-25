export class NoticeEntity {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly content: string,
    public readonly author_id: number,
    public readonly is_pinned: boolean,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}
}