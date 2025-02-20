import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import { HTTPHealthFormEditor } from "../Forms/Health/HTTPHealthFormEditor";
import { FaCog } from "react-icons/fa";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";
import { FolderHealthFormEditor } from "../Forms/Health/FolderHealthFormEditor";
import { ICMPHealthFormEditor } from "../Forms/Health/ICMPHealthFormEditor";
import { ExecHealthFormEditor } from "../Forms/Health/ExecHealthFormEditor";
import { ElasticsearchHealthFormEditor } from "../Forms/Health/ElasticsearchHealthFormEditor";
import { TCPHealthFormEditor } from "../Forms/Health/TCPHealthFormEditor";
import { AlertmanagerHealthFormEditor } from "../Forms/Health/AlertmanagerHealthFormEditor";
import { RedisHealthFormEditor } from "../Forms/Health/RedisHealthFormEditor";
import { MongoHealthFormEditor } from "../Forms/Health/MongoHealthFormEditor";

type HealthSpecEditorProps = {
  resourceValue?: {
    id?: string;
    name?: string;
    namespace?: string;
    spec?: Record<string, any>;
    [key: string]: any;
  };
  onSubmit?: (spec: Record<string, any>) => void;
  resourceInfo: SchemaResourceType;
};

export default function HealthSpecEditor({
  resourceValue,
  onSubmit = () => {},
  resourceInfo
}: HealthSpecEditorProps) {
  const configTypes = useMemo(
    () =>
      [
        {
          name: "http",
          label: "HTTP",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "http",
          configForm: HTTPHealthFormEditor,
          specsMapField: "http.0",
          rawSpecInput: false,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/http"
        },
        {
          name: "awsConfigRule",
          label: "AWS Config Rule",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "aws",
          configForm: null,
          specsMapField: "awsConfigRule.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/aws-config-rule"
        },
        {
          name: "awsConfig",
          label: "AWS Config",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "aws-config",
          configForm: null,
          specsMapField: "awsConfig.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/aws-config"
        },
        {
          name: "github",
          label: "GitHub",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "github",
          configForm: null,
          specsMapField: "github.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary"
        },
        {
          name: "ec2",
          label: "EC2",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "ec2",
          configForm: null,
          specsMapField: "ec2.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/ec2"
        },
        {
          name: "ldap",
          label: "LDAP",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "ldap",
          configForm: null,
          specsMapField: "ldap.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/ldap"
        },
        {
          name: "pod",
          label: "Pod",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "pod",
          configForm: null,
          specsMapField: "pod.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/pod"
        },
        {
          name: "exec",
          label: "Exec",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "console",
          configForm: ExecHealthFormEditor,
          specsMapField: "exec.0",
          rawSpecInput: false,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/exec"
        },
        {
          name: "alertManager",
          label: "Alert Manager",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "alertManager",
          configForm: AlertmanagerHealthFormEditor,
          specsMapField: "alertManager.0",
          rawSpecInput: false,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/alert-manager"
        },
        {
          name: "cloudwatch",
          label: "Cloud Watch",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "cloudwatch",
          configForm: null,
          specsMapField: "cloudwatch.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/cloudwatch"
        },
        {
          name: "elasticsearch",
          label: "Elasticsearch",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "elasticsearch",
          configForm: ElasticsearchHealthFormEditor,
          specsMapField: "elasticsearch.0",
          rawSpecInput: false,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/elasticsearch"
        },
        {
          name: "redis",
          label: "Redis",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "redis",
          configForm: RedisHealthFormEditor,
          specsMapField: "redis.0",
          rawSpecInput: false,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/redis"
        },
        {
          name: "mongo",
          label: "Mongo DB",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "mongo",
          configForm: MongoHealthFormEditor,
          specsMapField: "mongo.0",
          rawSpecInput: false,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/mongo"
        },
        {
          name: "dns",
          label: "DNS",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "dns",
          configForm: null,
          specsMapField: "dns.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/dns"
        },
        {
          name: "ping",
          label: "ICMP Ping",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "icmp",
          configForm: ICMPHealthFormEditor,
          specsMapField: "icmp.0",
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/icmp"
        },
        {
          name: "gcs",
          label: "GCS",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "gcp",
          configForm: null,
          specsMapField: "gcs.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/gcs-bucket"
        },
        {
          name: "s3",
          label: "AWS S3",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "aws-s3-bucket",
          configForm: null,
          specsMapField: "s3.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/s3-bucket"
        },
        {
          name: "smb",
          label: "SMB",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "smb",
          configForm: null,
          specsMapField: "smb.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/smb"
        },
        {
          name: "sftp",
          label: "SFTP",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "sftp",
          configForm: null,
          specsMapField: "sftp.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/sftp"
        },
        {
          name: "folder",
          label: "Folder",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "folder",
          configForm: FolderHealthFormEditor,
          specsMapField: "folder.0",
          rawSpecInput: false,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/folder"
        },
        {
          name: "prometheus",
          label: "Prometheus",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "prometheus",
          configForm: null,
          specsMapField: "prometheus.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/prometheus"
        },
        {
          name: "kubernetes",
          label: "Kubernetes",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "kubernetes",
          configForm: null,
          specsMapField: "kubernetes.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/kubernetes"
        },
        {
          name: "sql",
          label: "SQL Query",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "postgres",
          configForm: null,
          specsMapField: "sql.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/postgres"
        },
        {
          name: "configDB",
          label: "Mission Control Catalog",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "config",
          configForm: null,
          specsMapField: "configDB.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/configdb"
        },
        {
          name: "azureDevops",
          label: "Azure DevOps",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "azure-devops",
          configForm: null,
          specsMapField: "azureDevops.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/azure-devops"
        },
        {
          name: "jmeter",
          label: "JMeter",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "jmeter",
          configForm: null,
          specsMapField: "jmeter.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/jmeter"
        },
        {
          name: "junit",
          label: "JUnit",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "junit",
          configForm: null,
          specsMapField: "junit.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/junit"
        },
        {
          name: "dynatrace",
          label: "Dynatrace",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "dynatrace",
          configForm: null,
          specsMapField: "dynatrace.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary"
        },
        {
          name: "namespace",
          label: "Kubernetes Namespace",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "namespace",
          configForm: null,
          specsMapField: "namespace.0",
          rawSpecInput: true,
          schemaFilePrefix: "canary",
          docsLinks: "https://canarychecker.io/reference/kubernetes"
        },
        {
          name: "tcp",
          label: "TCP",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: "network",
          configForm: TCPHealthFormEditor,
          specsMapField: "tcp.0",
          rawSpecInput: false,
          schemaFilePrefix: "canary",
          docsLink: "https://canarychecker.io/reference/tcp"
        },
        {
          name: "custom",
          label: "Custom",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: FaCog,
          configForm: null,
          specsMapField: "spec",
          rawSpecInput: true,
          schemaFilePrefix: "canary"
        }
      ].sort((a, b) => a.label.localeCompare(b.label)) as SpecType[],
    [onSubmit, resourceValue]
  );

  // there should only be one spec, so we can just grab the first key that isn't schedule
  const selectedSpec = resourceValue?.spec
    ? Object.keys(resourceValue?.spec).filter((key) => key !== "schedule")[0]
    : undefined;

  const canEdit = !!!resourceValue?.source;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      selectedSpec={selectedSpec}
      resourceInfo={resourceInfo}
      canEdit={canEdit}
    />
  );
}
