import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { SchemaResourceWithJobStatus } from "../../api/schemaResources";
import { tables } from "../../context/UserAccessContext/permissions";
import { Avatar } from "../Avatar";
import { InfoMessage } from "../InfoMessage";
import JobHistoryStatusColumn from "../JobsHistory/JobHistoryStatusColumn";
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";
import { Age } from "../../ui/Age";
import ConfigScrapperIcon from "./ConfigScrapperIcon";
interface Props {
  items: SchemaResourceWithJobStatus[];
  baseUrl: string;
  table: string;
  isLoading?: boolean;
}

export function SchemaResourceList({
  items,
  baseUrl,
  table,
  isLoading
}: Props) {
  return (
    <div className="max-w-screen-xl mx-auto space-y-6 flex flex-col justify-center">
      <div
        className="flex flex-col overflow-y-auto flex-1 w-full"
        style={{ maxHeight: "calc(100vh - 8rem)" }}
      >
        <table
          className="table-auto table-fixed relative w-full border border-gray-200 rounded-md"
          aria-label="table"
        >
          <thead className={`rounded-md sticky top-0 z-01`}>
            <tr className="border-b border-gray-200 uppercase bg-column-background rounded-t-md items-center">
              <HCell colSpan={2}>Name</HCell>
              <HCell>Source Config</HCell>
              {table === "canaries" && <HCell>Schedule</HCell>}
              <HCell>Created At</HCell>
              <HCell>Updated At</HCell>
              <HCell>Job Status</HCell>
              <HCell>Last Run</HCell>
              <HCell>Created By</HCell>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <SchemaResourceListItem
                table={table}
                key={item.id}
                {...item}
                schedule={item.spec?.schedule}
                baseUrl={baseUrl}
              />
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="flex items-center justify-center px-2 border-b border-gray-300 text-center text-gray-400">
            {isLoading ? (
              <TableSkeletonLoader className="mt-2" />
            ) : (
              <InfoMessage className="my-8 py-20" message="No data available" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface CellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

function HCell({
  children,
  className = "px-3 py-3 text-gray-500 font-medium text-xs text-left",
  colSpan
}: CellProps) {
  return (
    <th colSpan={colSpan ?? 1} className={className}>
      {children}
    </th>
  );
}

function Cell({ children, className, colSpan }: CellProps) {
  return (
    <td
      colSpan={colSpan ?? 1}
      className={clsx("px-3 py-3 text-sm border-b", className)}
    >
      {children}
    </td>
  );
}

function SchemaResourceListItem({
  name,
  created_at,
  updated_at,
  id,
  source,
  baseUrl,
  created_by,
  table,
  schedule,
  job_status,
  job_time_start,
  spec
}: SchemaResourceWithJobStatus & {
  baseUrl: string;
  table: string;
}) {
  const navigate = useNavigate();
  const navigateToDetails = (id: string) => navigate(`${baseUrl}/${id}`);

  return (
    <tr
      className="last:border-b-0 border-b cursor-pointer"
      onClick={() => navigateToDetails(id)}
    >
      <Cell colSpan={2} className="leading-5 text-gray-900 font-medium">
        <div className="flex flex-row gap-2 items-center">
          {table === tables.config_scrapers && (
            <ConfigScrapperIcon spec={spec} />
          )}
          <div> {name}</div>
        </div>
      </Cell>
      <Cell className="shrink-0">
        {!!source && <a href={`${source}`}>Link</a>}
      </Cell>
      {table === "canaries" && <Cell>{schedule}</Cell>}
      <Cell className="text-gray-500">
        <Age from={created_at} suffix={true} />
      </Cell>
      <Cell className="text-gray-500">
        <Age from={updated_at} suffix={true} />
      </Cell>
      <Cell className="text-gray-500 lowercase space-x-2">
        <JobHistoryStatusColumn status={job_status} />
      </Cell>
      <Cell className="text-gray-500">
        <Age from={job_time_start} suffix={true} />
      </Cell>
      <Cell className="text-gray-500">
        {created_by && <Avatar user={created_by} circular />}
      </Cell>
    </tr>
  );
}
