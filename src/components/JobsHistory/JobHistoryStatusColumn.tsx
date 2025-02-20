import { useMemo } from "react";
import { JobHistoryStatus, classNameMaps } from "./JobsHistoryTable";
import { FaDotCircle } from "react-icons/fa";

type Props = {
  status?: JobHistoryStatus;
  onClick?: () => void;
};

export default function JobHistoryStatusColumn({ status, onClick }: Props) {
  const className = useMemo(() => {
    if (status) {
      return classNameMaps.get(status);
    }
  }, [status]);

  if (!status) {
    return null;
  }

  return (
    <div
      className="flex flex-row gap-2"
      role="button"
      onClick={(e) => {
        if (!onClick) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <FaDotCircle className={`${className}`} />
      <span className="">{status}</span>
    </div>
  );
}
