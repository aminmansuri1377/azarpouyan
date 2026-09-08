import { Button } from "../ui";

type Props = {
  page: number;
  withBg?: boolean;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, withBg, totalPages, onPageChange }: Props) {
  //   if (totalPages <= 1) return null;

  return (
    <div className={` mx-auto my-4 flex justify-center gap-4 items-center `}>
      <div className={`${withBg ? "bg-gray-100" : ""} rounded-2xl px-1 py-1`}>
        <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          -
        </Button>

        <span className=" font-peyda-thin mx-2 ">
          Page {page} of {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );
}
