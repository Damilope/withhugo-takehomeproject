import { cx } from "@emotion/css";
import { isString } from "lodash";
import React from "react";

export interface ItemListProps<T = any> {
  label: React.ReactNode;
  buttons?: React.ReactNode;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T, index: number) => string | number;
  className?: string;
}

const ItemList: React.FC<ItemListProps> = (props) => {
  const { label, items, buttons, className, renderItem, getItemKey } = props;
  return (
    <div className={className}>
      <div className="flex sticky top-0 bg-white py-2 border-b border-black">
        <div className="grow">
          {isString(label) ? <h4 className="m-0 font-bold">{label}</h4> : label}
        </div>
        {buttons && <div className="flex-none">{buttons}</div>}
      </div>
      <div>
        {items.map((nextItem, index) => (
          <div
            key={getItemKey(nextItem, index)}
            className={cx(index < items.length - 1 && "border-b border-black")}
          >
            {renderItem(nextItem, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
