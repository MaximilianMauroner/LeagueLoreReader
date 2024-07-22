export const Pagination = ({
  paginationInfo,
}: {
  paginationInfo: {
    current: number;
    hasNext: boolean;
    hasPrev: boolean;
    maxPage: number;
  };
}) => {
  const prevHref = paginationInfo.hasPrev
    ? `?page=${paginationInfo.current - 1}`
    : "#";
  const nextHref = paginationInfo.hasNext
    ? `?page=${paginationInfo.current + 1}`
    : "#";

  return (
    <nav className="flex w-full justify-center">
      <ul className="inline-flex h-10 -space-x-px text-base">
        <li>
          {paginationInfo.hasPrev ? (
            <a
              href={prevHref}
              className="ms-0 flex h-10 items-center justify-center rounded-s-lg border border-e-0 border-gray-700 bg-gray-800 px-4 leading-tight text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Previous
            </a>
          ) : (
            <span
              aria-disabled={true}
              className="ms-0 flex h-10 items-center justify-center rounded-s-lg border border-e-0 border-gray-700 bg-gray-900 px-4 leading-tight text-gray-400"
            >
              Previous
            </span>
          )}
        </li>
        <li>
          <span className="ms-0 flex h-10 items-center justify-center border border-gray-700 bg-gray-800 px-4 leading-tight text-gray-400 hover:bg-gray-700 hover:text-white">
            {paginationInfo.current} of total {paginationInfo.maxPage}
          </span>
        </li>
        <li>
          {paginationInfo.hasNext ? (
            <a
              href={nextHref}
              className="ms-0 flex h-10 items-center justify-center rounded-e-lg border border-e-0 border-gray-700 bg-gray-800 px-4 leading-tight text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Next
            </a>
          ) : (
            <span
              aria-disabled={true}
              className="ms-0 flex h-10 items-center justify-center rounded-e-lg border border-e-0 border-gray-700 bg-gray-900 px-4 leading-tight text-gray-400"
            >
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};
