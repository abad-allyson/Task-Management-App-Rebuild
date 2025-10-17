export function paginate({
  items = [],
  page = 1,
  limit = 10,
  length = 0,
} = {}) {
  if (length === 0) {
    return { items: [], totalPages: 0, currentPage: 0, totalItems: 0 };
  }

  const startIndex = page * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, length);
  return {
    items,
    pages: Math.ceil(length / limit),
    pageRange: `${startIndex}-${endIndex} of ${length}`,
  };
}
