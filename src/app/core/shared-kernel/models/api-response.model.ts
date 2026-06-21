export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface PageMetadata extends Omit<PageResponse<void>, 'content'> {}
export interface ApiPageResponse<T> extends ApiResponse<PageResponse<T>> {}
