import { useQuery } from "@tanstack/react-query";
import { isEmpty, map } from "lodash";
import { useMemo } from "react";
import { BsCardList } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getComponentsTopology } from "../../api/services/topology";
import { isCostsEmpty } from "../../api/types/configs";
import { Topology } from "../../api/types/topology";
import CollapsiblePanel from "../CollapsiblePanel";
import ConfigCostValue from "../ConfigCosts/ConfigCostValue";
import { DescriptionCard } from "../DescriptionCard";
import EmptyState from "../EmptyState";
import { Icon } from "../Icon";
import Title from "../Title/title";
import { FormatProperty } from "../TopologyCard/Property";
import { TopologyLink } from "../TopologyLink";

type Props = {
  topology?: Topology;
  refererId?: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export default function TopologyDetails({
  topology,
  refererId,
  isCollapsed = true,
  onCollapsedStateChange = () => {}
}: Props) {
  const { data } = useQuery({
    queryFn: () => getComponentsTopology(topology!.id),
    enabled: topology != null,
    queryKey: ["components", "topology", topology?.id],
    select: (data) => data?.topologies
  });

  const items = useMemo(() => {
    if (topology == null) {
      return [];
    }

    const items = [];

    if (
      refererId != null &&
      topology.parent_id != null &&
      topology.parent_id !== refererId
    ) {
      items.push({
        label: "Parent",
        value: <TopologyLink size="sm" topologyId={topology.parent_id} />
      });
    }

    if (!isCostsEmpty(topology)) {
      items.push({
        label: "Costs",
        value: <ConfigCostValue config={topology} />
      });
    }

    const topologyProperties = topology?.properties ?? [];

    for (var property of topologyProperties) {
      items.push({
        label: isEmpty(property.label) ? property.name : property.label,
        value: (
          <>
            <Icon
              className="pr-1 w-5"
              name={property.icon}
              secondary={property.name}
            />
            <FormatProperty property={property} />
          </>
        )
      });
    }

    if (topology.labels != null && Object.entries(topology.labels).length > 0) {
      items.push({
        label: "Labels",
        value: (
          <div className="flex flex-col">
            {map(topology.labels, (v, k) => (
              <div
                data-tip={`${k}: ${v}`}
                className="max-w-full overflow-hidden text-ellipsis  mb-1 rounded-md text-gray-600 font-semibold text-sm"
                key={k}
              >
                {k}: <span className="text-sm font-light">{v}</span>
              </div>
            ))}
          </div>
        )
      });
    }

    if (data != null) {
      items.push({
        label: "Topology",
        value: (
          <Link
            to={{
              pathname: `/settings/topologies/${data.id}`
            }}
            className="flex flex-nowrap hover:text-gray-500 my-auto"
          >
            {data.name}
          </Link>
        )
      });
    }
    return items;
  }, [data, refererId, topology]);

  if (topology == null) {
    return null;
  }

  return (
    <CollapsiblePanel
      Header={
        <Title title="Details" icon={<BsCardList className="w-6 h-auto" />} />
      }
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
    >
      {Boolean(items.length) ? (
        <DescriptionCard items={items} labelStyle="top" />
      ) : (
        <EmptyState />
      )}
    </CollapsiblePanel>
  );
}
