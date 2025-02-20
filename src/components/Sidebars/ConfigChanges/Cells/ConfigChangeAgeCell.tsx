import { CellContext } from "@tanstack/react-table";
import { Age } from "../../../../ui/Age";
import { ConfigChange } from "../../../../api/types/configs";

export default function ConfigChangeAgeCell({
  row,
  column,
  getValue
}: CellContext<ConfigChange, unknown>) {
  return (
    <Age className="whitespace-nowrap pr-2" from={row.original.created_at} />
  );
}
