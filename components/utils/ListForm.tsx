import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { cx } from "@emotion/css";
import { Button } from "antd";
import { isString } from "lodash";
import React from "react";

export interface ListFormProps<T = any> {
  label: React.ReactNode;
  max: number;
  items: Array<T>;
  disabled?: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  onAddItem: () => void;
  onRemoveItem: (item: T, index: number) => void;
  getItemKey: (item: T, index: number) => string | number;
  isDeletedDisabled: (item: T, index: number) => boolean;
  className?: string;
}

const ListForm: React.FC<ListFormProps> = (props) => {
  const {
    label,
    max,
    items,
    disabled,
    className,
    renderItem,
    onAddItem,
    onRemoveItem,
    getItemKey,
    isDeletedDisabled,
  } = props;

  return (
    <div className={className}>
      <div className="flex bg-white py-2 border-b border-black">
        <div className="grow">
          {isString(label) ? <h4 className="m-0 font-bold">{label}</h4> : label}
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={() => onAddItem()}
          disabled={items.length >= max || disabled}
          className="flex-none"
        />
      </div>
      <div>
        {items.map((nextItem, index) => (
          <div
            key={getItemKey(nextItem, index)}
            className={cx(
              "flex",
              "space-x-4",
              "my-4",
              index < items.length - 1 && "border-b border-black"
            )}
          >
            <div className="grow">{renderItem(nextItem, index)}</div>
            <div className="flex-none">
              <Button
                icon={<DeleteOutlined />}
                onClick={() => onRemoveItem(nextItem, index)}
                disabled={isDeletedDisabled(nextItem, index) || disabled}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListForm;
