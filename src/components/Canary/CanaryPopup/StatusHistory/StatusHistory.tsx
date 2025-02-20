import React, { useEffect, useMemo, useState } from "react";
import { format } from "timeago.js";
import { CanaryStatus, Duration } from "../../renderers";
import { HealthCheck, HealthCheckStatus } from "../../../../api/types/health";
import { toastError } from "../../../Toast/toast";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../DataTable";
import clsx from "clsx";
import { useCheckStattiQuery } from "../../../../api/query-hooks/useCheckStattiQuery";
import { StatusHistoryFilters } from "./StatusHistoryFilters";
import { Loading } from "../../../Loading";

type StatusHistoryProps = React.HTMLProps<HTMLDivElement> & {
  check: Pick<Partial<HealthCheck>, "id" | "checkStatuses" | "description">;
  timeRange: string;
};

const columns: ColumnDef<HealthCheckStatus, any>[] = [
  {
    header: "Age",
    id: "age",
    cell: function AgeCell({
      row,
      getValue
    }: CellContext<HealthCheckStatus, any>) {
      const status = row.original;
      return <>{format(`${status.time} UTC`)}</>;
    },
    aggregatedCell: "",
    size: 100,
    accessorKey: "time"
  },
  {
    header: "Duration",
    id: "duration",
    size: 75,
    cell: function DurationCell({
      row,
      getValue
    }: CellContext<HealthCheckStatus, any>) {
      // const duration = row.original.duration;
      return <Duration ms={getValue()} />;
    },
    aggregatedCell: "",
    accessorKey: "duration"
  },
  {
    header: "Message",
    id: "message",
    size: 325,
    cell: function MessageCell({ row }: CellContext<HealthCheckStatus, any>) {
      const status = row.original;
      return (
        <div className="whitespace-normal overflow-x-hidden">
          {/* @ts-expect-error */}
          <CanaryStatus className="" status={status} /> {status.message}{" "}
          {status.error &&
            status.error.split("\n").map((item, index) => (
              <React.Fragment key={index}>
                {item}
                <br />
              </React.Fragment>
            ))}
        </div>
      );
    },
    aggregatedCell: "",
    accessorKey: "message"
  }
];

export function StatusHistory({
  check,
  timeRange,
  className,
  ...props
}: StatusHistoryProps) {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });
  const [filters, setFilters] = useState<{
    duration: string | undefined;
    status: string | undefined;
  }>();

  const { data: response, isLoading } = useCheckStattiQuery(
    {
      start: timeRange,
      checkId: check.id!,
      status: filters?.status,
      duration: filters?.duration
    },
    {
      pageIndex,
      pageSize
    }
  );

  const statii = response?.data || [];
  const totalEntries = response?.totalEntries ?? 0;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading
    };
  }, [pageIndex, pageSize, pageCount, isLoading]);

  useEffect(() => {
    if (response?.error) {
      toastError(response?.error?.message);
    }
  }, [response?.error]);

  const onFiltersChange = (filters: {
    status: string | undefined;
    duration: string | undefined;
  }) => {
    let duration = filters.duration === "All" ? "" : filters.duration;
    let status = filters.status === "All" ? "" : filters.status;
    if (status) {
      status = status === "Healthy" ? "1" : "0";
    }
    if (filters.duration?.includes("ms")) {
      duration = filters.duration.replace("ms", "");
      if (isNaN(+duration)) {
        toastError("duration is allowed only in milli seconds & seconds");
        return;
      }
      duration = parseInt(duration, 10).toString();
    } else if (filters.duration?.includes("s")) {
      duration = filters.duration.replace("s", "");
      if (isNaN(+duration)) {
        toastError("duration is allowed only in milli seconds & seconds");
        return;
      }
      duration = (parseInt(duration, 10) * 1000).toString();
    } else if (duration) {
      toastError("duration is allowed only in milli seconds & seconds");
      return;
    }
    setFilters({
      status: status || undefined,
      duration: duration || undefined
    });
    setPageState({
      pageIndex: 0,
      pageSize: 50
    });
  };

  if (!check) {
    return null;
  }

  return (
    <div
      className={clsx(
        "w-full flex flex-col flex-1 overflow-y-auto bg-white",
        className
      )}
      {...props}
    >
      <StatusHistoryFilters onFiltersChanges={onFiltersChange} />
      <div className="flex flex-col flex-1  overflow-y-auto">
        {statii && statii.length > 0 ? (
          <DataTable
            stickyHead
            columns={columns}
            data={statii}
            tableStyle={{ borderSpacing: "0" }}
            className=""
            pagination={pagination}
            paginationClassName="px-2 pb-2"
            preferencesKey="health-check-status-list"
            savePreferences={false}
          />
        ) : isLoading ? (
          <div
            className={clsx(
              "flex flex-col items-center justify-center text-gray-400 text-md flex-1",
              className
            )}
            {...props}
          >
            <Loading />
          </div>
        ) : (
          <div
            className={clsx(
              "flex flex-col items-center justify-center text-gray-400 text-md flex-1",
              className
            )}
            {...props}
          >
            No status history available
          </div>
        )}
      </div>
    </div>
  );
}
