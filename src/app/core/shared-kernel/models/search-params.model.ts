export interface Searchable {
  page: number;
  size: number;
  search: string;
  active: boolean | null;
  sortBy: string;
  sortDir: string;
}
