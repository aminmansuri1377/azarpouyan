import { Button } from "../ui";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  //   if (totalPages <= 1) return null;

  return (
    <div className=" mx-auto my-4 flex justify-center gap-4 items-center">
      <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        -
      </Button>

      <span className=" font-peyda-thin ">
        Page {page} of {totalPages}
      </span>

      <Button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        +
      </Button>
    </div>
  );
}
