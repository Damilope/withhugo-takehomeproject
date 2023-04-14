import { cx } from "@emotion/css";
import { isString } from "lodash";
import React from "react";

export interface LabeledNodeProps {
  label: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
  direction?: "horizontal" | "vertical";
}

const LabeledNode: React.FC<LabeledNodeProps> = (props) => {
  const { label, text, direction, children } = props;
  return (
    <div
      className={cx(
        "flex",
        direction === "horizontal" ? "flex-row" : "flex-col"
      )}
    >
      <div>
        {isString(label) ? (
          <p className="m-0 text-slate-500">{label}:</p>
        ) : (
          label
        )}
      </div>
      <div>
        {text && (
          <p
            className={cx(
              "m-0",
              direction === "horizontal" ? "mx-16" : undefined
            )}
          >
            {text}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default LabeledNode;
