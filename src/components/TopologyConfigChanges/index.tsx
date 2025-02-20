import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { GoDiff } from "react-icons/go";
import { useComponentConfigChanges } from "../../api/query-hooks/useComponentConfigChanges";
import { useGetConfigChangesById } from "../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "../../api/types/configs";
import PillBadge from "../Badge/PillBadge";
import CollapsiblePanel from "../CollapsiblePanel";
import { ConfigDetailChangeModal } from "../ConfigDetailsChanges/ConfigDetailsChanges";
import ConfigLink from "../ConfigLink/ConfigLink";
import EmptyState from "../EmptyState";
import { Icon } from "../Icon";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "../SlidingSideBar";
import Title from "../Title/title";

type Props = {
  topologyID: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function TopologyConfigChanges({ topologyID }: Props) {
  const { data: componentConfigChanges = [], isLoading } =
    useComponentConfigChanges(topologyID);

  const [open, setOpen] = useState(false);

  const [selectedConfigChange, setSelectedConfigChanges] =
    useState<
      Pick<ConfigChange, "change_type" | "id" | "config_id" | "config">
    >();

  const { data: changeDetails } = useGetConfigChangesById(
    selectedConfigChange?.id!,
    selectedConfigChange?.config_id!,
    {}
  );

  return (
    <>
      <div className="flex flex-col ">
        <div className="flex flex-col">
          <div className="flex flex-col pl-2">
            {isLoading ? (
              <TextSkeletonLoader />
            ) : componentConfigChanges.length > 0 ? (
              componentConfigChanges.map((item) => (
                <div className="flex flex-row text-sm mb-2">
                  <ConfigLink config={item.config} />
                  &nbsp;/&nbsp;
                  <span
                    role="button"
                    onClick={() => {
                      setSelectedConfigChanges(item);
                      setOpen(true);
                    }}
                  >
                    <Icon name={item.change_type} />
                    {item.summary ?? item.change_type}
                  </span>
                  <span
                    className="text-right grow text-sm"
                    data-tip={item.created_at}
                  >
                    {dayjs(item.created_at).fromNow()}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
      {changeDetails && (
        <ConfigDetailChangeModal
          open={open}
          setOpen={setOpen}
          changeDetails={changeDetails}
        />
      )}
    </>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({
  isCollapsed,
  onCollapsedStateChange,
  ...props
}: Props) {
  const {
    data: componentConfigChanges = [],
    isRefetching,
    refetch,
    isLoading
  } = useComponentConfigChanges(props.topologyID);

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isRefetching) {
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
          <Title title="Changes" icon={<GoDiff className="w-6 h-auto" />} />
          <PillBadge>{componentConfigChanges?.length ?? 0}</PillBadge>
        </div>
      }
      dataCount={componentConfigChanges.length}
    >
      <div className="flex flex-col">
        <TopologyConfigChanges {...props} />
      </div>
    </CollapsiblePanel>
  );
}
