export interface IPaginationMeta {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}

export interface IPaginatedResponse<T> {
    data: T[];
    meta: IPaginationMeta;
}
