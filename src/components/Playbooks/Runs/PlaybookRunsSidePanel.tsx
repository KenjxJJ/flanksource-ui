import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getPlaybookRuns } from "../../../api/services/playbooks";
import PillBadge from "../../Badge/PillBadge";
import CollapsiblePanel from "../../CollapsiblePanel";
import EmptyState from "../../EmptyState";
import { InfiniteTable } from "../../InfiniteTable/InfiniteTable";
import TextSkeletonLoader from "../../SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "../../SlidingSideBar";
import Title from "../../Title/title";
import { Age } from "../../../ui/Age";
import { PlaybookRun } from "../../../api/types/playbooks";
import { PlaybookStatusIcon } from "../../Icon/PlaybookStatusIcon";

type TopologySidePanelProps = {
  panelType: "topology";
  componentId: string;
} & Props;

type ConfigSidePanelProps = {
  panelType: "config";
  configId: string;
} & Props;

type Props = {
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

const runsColumns: ColumnDef<PlaybookRun, any>[] = [
  {
    header: "Name",
    id: "name",
    size: 80,
    cell: ({ row }) => {
      const name = row.original.playbooks?.name;
      return (
        <span>
          <PlaybookStatusIcon status={row.original.status} /> {name}
        </span>
      );
    }
  },
  {
    header: "Age",
    id: "age",
    cell: ({ row }) => {
      return (
        <Age
          from={row.original.start_time}
          className="text-xs text-slate-500 pr-2"
        />
      );
    },
    size: 20
  }
];

export function PlaybookRunsSidePanel({
  isCollapsed,
  onCollapsedStateChange,
  ...props
}: ConfigSidePanelProps | TopologySidePanelProps) {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });

  const { data, isLoading, refetch, isFetching } = useQuery(
    ["componentTeams", props],
    () =>
      getPlaybookRuns({
        pageIndex,
        pageSize,
        componentId:
          props.panelType === "topology" ? props.componentId : undefined,
        configId: props.panelType === "config" ? props.configId : undefined
      })
  );

  const totalEntries = data?.totalEntries ?? 0;

  const playbookRuns = data?.data ?? [];

  const navigate = useNavigate();

  const canGoNext = () => {
    const pageCount = Math.ceil(totalEntries / pageSize);
    return pageCount >= pageIndex + 1;
  };

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  const columns = useMemo(() => runsColumns, []);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title
            title="Playbooks"
            icon={<AiOutlineTeam className="w-6 h-auto" />}
          />
          <PillBadge>{playbookRuns?.length ?? 0}</PillBadge>
        </div>
      }
      dataCount={playbookRuns?.length}
    >
      <div className="flex flex-col space-y-4 py-2 w-full">
        {isLoading ? (
          <TextSkeletonLoader />
        ) : playbookRuns && playbookRuns.length > 0 ? (
          <div className="flex flex-col overflow-y-hidden">
            <InfiniteTable
              isLoading={isLoading}
              allRows={playbookRuns}
              columns={columns}
              isFetching={isFetching}
              loaderView={<TextSkeletonLoader className="w-full my-2" />}
              totalEntries={totalEntries}
              fetchNextPage={() => {
                if (canGoNext()) {
                  setPageState({
                    pageIndex: pageIndex + 1,
                    pageSize
                  });
                }
              }}
              virtualizedRowEstimatedHeight={40}
              columnsClassName={{
                age: "text-right"
              }}
              onRowClick={(row) => {
                navigate(`/playbooks/runs/${row.original.id}`);
              }}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </CollapsiblePanel>
  );
}
