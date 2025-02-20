import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { getTopology } from "../api/services/topology";
import { Head } from "../components/Head/Head";
import { InfoMessage } from "../components/InfoMessage";
import { SearchLayout } from "../components/Layout";
import CardsSkeletonLoader from "../components/SkeletonLoader/CardsSkeletonLoader";
import { refreshButtonClickedTrigger } from "../components/SlidingSideBar";
import { toastError } from "../components/Toast/toast";
import { TopologyBreadcrumbs } from "../components/TopologyBreadcrumbs";
import { TopologyCard } from "../components/TopologyCard";
import TopologyFilterBar from "../components/TopologyFilters/TopologyFilterBar";
import { getCardWidth } from "../components/TopologyPopover/topologyPreference";
import {
  getSortLabels,
  getSortedTopology
} from "../components/TopologyPopover/topologySort";
import TopologySidebar from "../components/Topology/Sidebar/TopologySidebar";
import { Topology } from "../api/types/topology";

export const allOption = {
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  }
};

export const saveSortBy = (val: string, sortLabels: any[]) => {
  const sortItem = sortLabels.find((s) => s.value === val);
  if (sortItem?.standard) {
    localStorage.setItem(`topologyCardsSortByStandard`, val);
    localStorage.removeItem(`topologyCardsSortByCustom`);
  } else {
    localStorage.setItem(`topologyCardsSortByCustom`, val);
  }
};

export const saveSortOrder = (val: string) => {
  localStorage.setItem(`topologyCardsSortOrder`, val);
};

export const getSortBy = (sortLabels: any[]) => {
  const val = localStorage.getItem("topologyCardsSortByCustom");
  const sortItem = sortLabels.find((s) => s.value === val);
  if (!sortItem) {
    localStorage.removeItem(`topologyCardsSortByCustom`);
    return localStorage.getItem(`topologyCardsSortByStandard`) || "status";
  }
  return (
    localStorage.getItem("topologyCardsSortByCustom") ||
    localStorage.getItem("topologyCardsSortByStandard") ||
    "status"
  );
};

export const getSortOrder = () => {
  return localStorage.getItem(`topologyCardsSortOrder`) || "asc";
};

export function TopologyPage() {
  const { id } = useParams();

  const [, setTriggerRefresh] = useAtom(refreshButtonClickedTrigger);

  const [searchParams, setSearchParams] = useSearchParams();

  const [topologyCardSize, setTopologyCardSize] = useState(() =>
    getCardWidth()
  );

  const selectedLabel = searchParams.get("labels") ?? "All";
  const team = searchParams.get("team") ?? "All";
  const topologyType = searchParams.get("type") ?? "All";
  const healthStatus = searchParams.get("status") ?? "All";
  const refererId = searchParams.get("refererId") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? undefined;
  const sortOrder = searchParams.get("sortOrder") ?? undefined;
  const hideFilters = searchParams.get("hideFilters") ?? undefined;
  const showHiddenComponents =
    searchParams.get("showHiddenComponents") ?? undefined;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const { data, isLoading, refetch } = useQuery(
    [
      "topologies",
      id,
      healthStatus,
      team,
      selectedLabel,
      topologyType,
      showHiddenComponents,
      sortBy,
      sortOrder
    ],
    () => {
      loadingBarRef.current?.continuousStart();
      const apiParams = {
        id,
        status: healthStatus,
        type: topologyType,
        team: team,
        labels: selectedLabel,
        sortBy,
        sortOrder,
        // only flatten, if topology type is set
        ...(topologyType &&
          topologyType.toString().toLowerCase() !== "all" && {
            flatten: true
          }),
        hidden: showHiddenComponents === "no" ? false : undefined
      };
      return getTopology(apiParams);
    },
    {
      onSettled: () => {
        loadingBarRef.current?.complete();
      }
    }
  );

  const currentTopology = useMemo(() => data?.components?.[0], [data]);

  const topology = useMemo(() => {
    let topologyData: Topology[] | undefined;

    if (id) {
      const x = Array.isArray(data?.components) ? data?.components : [];

      if (x!.length > 1) {
        console.warn("Multiple nodes for same id?");
        toastError("Response has multiple components for the id.");
      }

      topologyData = x![0]?.components;

      if (!topologyData) {
        console.warn("Component doesn't have any child components.");
        topologyData = data?.components;
      }
    } else {
      topologyData = data?.components ?? [];
    }

    let components = topologyData?.filter(
      (item) => (item.name || item.title) && item.id !== id
    );

    if (!components?.length && topologyData?.length) {
      let filtered = topologyData?.find(
        (x: Record<string, any>) => x.id === id
      );
      if (filtered) {
        components = [filtered];
      } else {
        components = [];
      }
    }
    return components;
  }, [data?.components, id]);

  const sortLabels = useMemo(() => {
    if (!topology) {
      return null;
    }
    return getSortLabels(topology);
  }, [topology]);

  const onRefresh = useCallback(() => {
    refetch();
    setTriggerRefresh((prev) => prev + 1);
  }, [refetch, setTriggerRefresh]);

  useEffect(() => {
    if (!sortLabels) {
      return;
    }

    const sortByFromURL = searchParams.get("sortBy");
    const sortOrderFromURL = searchParams.get("sortOrder");

    const sortByFromLocalStorage = getSortBy(sortLabels) || "status";
    const sortOrderFromLocalStorage =
      localStorage.getItem("topologyCardsSortOrder") || "desc";

    if (!sortByFromURL && !sortOrderFromURL) {
      searchParams.set("sortBy", sortByFromLocalStorage);
      searchParams.set("sortOrder", sortOrderFromLocalStorage);
    }

    // this will replace the history, so that the back button will work as expected
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, sortLabels]);

  const sortedTopologies = useMemo(
    () =>
      getSortedTopology(topology, getSortBy(sortLabels || []), getSortOrder()),
    [sortLabels, topology]
  );

  return (
    <>
      <LoadingBar color="#374151" height={4} ref={loadingBarRef} />
      <Head prefix="Topology" />
      <SearchLayout
        title={<TopologyBreadcrumbs topologyId={id} refererId={refererId} />}
        onRefresh={onRefresh}
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex flex-row h-full py-2 overflow-y-auto">
          <div className="flex flex-col flex-1 h-full overflow-y-auto">
            <TopologyFilterBar
              data={data}
              setTopologyCardSize={setTopologyCardSize}
              topologyCardSize={topologyCardSize}
              sortLabels={sortLabels ?? []}
            />
            {isLoading && !topology?.length ? (
              <CardsSkeletonLoader />
            ) : (
              <div className="px-6 py-4 flex leading-1.21rel w-full">
                <div className="flex flex-wrap w-full">
                  {sortedTopologies.map((item) => (
                    <TopologyCard
                      key={item.id}
                      topology={item}
                      size={topologyCardSize}
                      menuPosition="absolute"
                    />
                  ))}
                  {!topology?.length && !isLoading && (
                    <InfoMessage
                      className="my-8"
                      message="There are no components matching this criteria"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {id && (
            <TopologySidebar
              topology={currentTopology}
              refererId={refererId}
              onRefresh={refetch}
            />
          )}
        </div>
      </SearchLayout>
    </>
  );
}
