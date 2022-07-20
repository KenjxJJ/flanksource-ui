import {
  MouseEventHandler,
  useMemo,
  useState,
  useCallback,
  useEffect
} from "react";
import clsx from "clsx";
import {
  BsBraces,
  BsFillBarChartFill,
  BsFillChatSquareTextFill
} from "react-icons/bs";
import { VscTypeHierarchy } from "react-icons/vsc";
import { deleteHypothesis, Hypothesis } from "../../../api/services/hypothesis";
import { AvatarGroup } from "../../AvatarGroup";
import { EvidenceType } from "../../../api/services/evidence";
import { IconBaseProps, IconType } from "react-icons/lib";
import { useQueryClient } from "react-query";
import { createIncidentQueryKey } from "../../query-hooks/useIncidentQuery";
import { HypothesisBarDeleteDialog } from "./HypothesisBarDeleteDialog";
import { StatusDropdownContainer } from "../StatusDropdownContainer";
import { EditableText } from "../../EditableText";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { ChevronRightIcon } from "@heroicons/react/outline";

enum CommentInfo {
  Comment = "comment"
}

type InfoType = CommentInfo | EvidenceType;

interface InfoIconProps extends IconBaseProps {
  icon: InfoType;
  key: string;
}

const ICON_MAP: { [key in InfoType]: IconType } = {
  comment: BsFillChatSquareTextFill,
  config: BsBraces,
  log: BsFillBarChartFill,
  topology: VscTypeHierarchy
};

type IconCounts = { [k in InfoType]: number };

const InfoIcon: React.FC<InfoIconProps> = ({
  icon,
  ...props
}: InfoIconProps) => {
  const Component = ICON_MAP[icon];
  return <Component size={24} {...props} />;
};

interface HypothesisBarProps {
  hypothesis: Hypothesis;
  onTitleClick: MouseEventHandler<HTMLSpanElement>;
  api: { [k: string]: any };
  showExpand: boolean;
  expanded: boolean;
  onToggleExpand: (expand: boolean) => void;
  onDisprove: () => void;
}

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export const HypothesisBar: React.FunctionComponent<HypothesisBarProps> = ({
  hypothesis,
  api,
  showExpand,
  expanded,
  onToggleExpand,
  onDisprove: onDisproveCb
}: HypothesisBarProps) => {
  const { title = "", created_by: createdBy, evidence, comment } = hypothesis;

  const [deleting, setDeleting] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const handleApiUpdate = useMemo(
    () =>
      debounce((params) => {
        if (api?.updateMutation && hypothesis.id) {
          api.updateMutation.mutate({ id: hypothesis.id, params });
        }
      }, 1000),
    [hypothesis, api]
  );

  const { watch, getValues, setValue } = useForm({
    defaultValues: { title }
  });

  watch();

  useEffect(() => {
    const subscription = watch((value) => {
      handleApiUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, handleApiUpdate]);

  const infoIcons = (evidence || [])
    .map((e): InfoType => e.type)
    .concat(comment?.length ? [CommentInfo.Comment] : [])
    .filter((i) => ICON_MAP[i])
    .reduce<Partial<IconCounts>>((acc, i) => {
      return {
        ...acc,
        [i]: (acc[i] || 0) + 1
      };
    }, {});

  const counts = Object.entries(infoIcons) as Entries<IconCounts>[];

  const commentsMap = new Map(
    (comment || []).map((c) => [c?.created_by?.id, c?.created_by])
  );

  createdBy && commentsMap.delete(createdBy.id);
  const involved = [createdBy].concat(Array.from(commentsMap.values()));

  const onDelete = useCallback(() => {
    setDeleting(true);
    const delHypo = async () => {
      try {
        setShowConfirm(false);
        await deleteHypothesis(hypothesis.id);
        const key = createIncidentQueryKey(hypothesis.incident_id);
        await queryClient.invalidateQueries(key);
        setDeleting(false);
      } catch (e) {
        setShowConfirm(false);
        setDeleting(false);
        console.error("Error while deleting", e);
      }
    };
    delHypo();
  }, [hypothesis, queryClient]);

  const onDisprove = () => {
    onDisproveCb();
    setShowConfirm(false);
  };

  return (
    <div
      className={clsx(
        "relative w-full flex justify-between shadow-lg rounded-8px border focus:outline-none bg-zinc-100 cursor-pointer",
        deleting && "pointer-events-none cursor-not-allowed blur-[2px]"
      )}
    >
      <div className="flex flex-grow-0 items-center space-x-2 w-full">
        {showExpand && (
          <button
            className="ml-2 py-2 flex flex-row items-center"
            onClick={() => onToggleExpand && onToggleExpand(!expanded)}
            type="button"
          >
            <ChevronRightIcon
              className={`h-5 w-5 transform ${expanded && "rotate-90"}`}
            />
          </button>
        )}
        <StatusDropdownContainer
          nodeId={hypothesis?.id}
          status={hypothesis?.status}
          updateMutation={api?.updateMutation}
        />
        <EditableText
          value={getValues("title")}
          sharedClassName="font-semibold text-gray-900"
          onChange={(value: string) => {
            setValue("title", value);
          }}
        />
      </div>
      <div className="flex items-center pr-3 space-x-4">
        <div className="flex flex-row items-center">
          {counts.map(([typ, count], idx: number) => (
            <>
              <InfoIcon
                key={`${typ}-${idx}`}
                icon={typ}
                className="px-1 text-dark-blue"
              />
              {count > 1 && (
                <span className="-ml-1 font-bold mr-1 mt-3 text-gray-500 text-xs">
                  {count}
                </span>
              )}
            </>
          ))}
        </div>
        <div>
          {createdBy && <AvatarGroup maxCount={5} users={involved} size="sm" />}
        </div>
        <div className="flex pt-1">
          <HypothesisBarDeleteDialog
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onDelete={onDelete}
            onDisprove={onDisprove}
            onOpen={() => setShowConfirm(true)}
          />
        </div>
      </div>
    </div>
  );
};
