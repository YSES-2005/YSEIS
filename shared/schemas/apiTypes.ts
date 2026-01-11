export type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export type ApiResponse<T> = {
  data: T;
  pagination?: Pagination;
};
