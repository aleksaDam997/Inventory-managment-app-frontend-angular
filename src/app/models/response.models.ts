export interface CreateApiResponse<T> {
  data: T | null;
  message: string;
  status: string;
}