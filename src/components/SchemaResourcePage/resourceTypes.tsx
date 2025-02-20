import { UserGroupIcon } from "@heroicons/react/solid";
import React from "react";
import { IconType } from "react-icons";
import { tables } from "../../context/UserAccessContext/permissions";
import { features } from "../../services/permissions/features";
import { AlarmIcon } from "../Icons/AlarmIcon";
import { HealthIcon } from "../Icons/HealthIcon";
import { SearchInListIcon } from "../Icons/SearchInListIcon";
import { TopologyIcon } from "../Icons/TopologyIcon";

export type SchemaResourceType = {
  name:
    | "Teams"
    | "Rules"
    | "Catalog Scraper"
    | "Health Check"
    | "Search"
    | "Topology"
    | "Connections"
    | "Log Backends"
    | "Notifications"
    | "Feature Flags";
  table:
    | "teams"
    | "incident_rules"
    | "config_scrapers"
    | "canaries"
    | "topologies"
    | "connections"
    | "logging_backends"
    | "notifications"
    | "properties";
  api: "incident-commander" | "canary-checker" | "config-db";
  featureName: string;
  resourceName: string;
  icon: React.ComponentType<any> | IconType;
  subNav: {
    label: string;
    value: string;
  }[];
  fields: {
    name: "name" | "spec" | "icon" | "labels" | "namespace" | "schedule";
    default?: any;
    hidden?: boolean;
  }[];
};

export type SchemaResourceTypes = SchemaResourceType[];

export type SchemaBackends = SchemaResourceType["api"];

export type SchemaApi = Pick<SchemaResourceType, "api" | "table" | "name">;

export const schemaResourceTypes: SchemaResourceType[] = [
  {
    name: "Teams",
    table: "teams",
    api: "incident-commander",
    icon: UserGroupIcon,
    featureName: features["settings.teams"],
    resourceName: tables.database,
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Members",
        value: "manageTeam"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: false
      },
      {
        name: "spec",
        default: {}
      },
      {
        name: "icon",
        default: "group"
      }
    ]
  },
  {
    name: "Rules",
    table: "incident_rules",
    api: "incident-commander",
    icon: AlarmIcon,
    featureName: features["incidents"],
    resourceName: tables.database,
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: false
      },
      {
        name: "spec",
        default: {}
      }
    ]
  },
  {
    name: "Catalog Scraper",
    table: "config_scrapers",
    api: "config-db",
    icon: SearchInListIcon,
    featureName: features["settings.config_scraper"],
    resourceName: tables.config_scrapers,
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: false
      },
      {
        name: "spec",
        default: {}
      }
    ]
  },
  {
    name: "Topology",
    table: "topologies",
    api: "canary-checker",
    icon: TopologyIcon,
    featureName: features["settings.topology"],
    resourceName: tables.topologies,
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: false
      },
      {
        name: "namespace",
        default: "default"
      },
      {
        name: "labels",
        default: {}
      },
      {
        name: "spec",
        default: {}
      }
    ]
  },
  {
    name: "Health Check",
    table: "canaries",
    api: "canary-checker",
    icon: HealthIcon,
    featureName: features["settings.health"],
    resourceName: tables.canaries,
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: true
      },
      {
        name: "namespace",
        default: "default"
      },
      // {
      //   name: "schedule",
      //   default: undefined
      // },
      {
        name: "labels",
        default: {}
      },
      {
        name: "spec",
        default: {}
      }
    ]
  }
];
