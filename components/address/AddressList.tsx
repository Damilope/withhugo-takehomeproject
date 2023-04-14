import type { Address } from "@prisma/client";
import React from "react";
import ItemList from "../utils/ItemList";
import AddressView from "./AddressView";

export interface AddressListProps {
  addressList: Array<Address>;
  className?: string;
}

const AddressList: React.FC<AddressListProps> = (props) => {
  const { addressList, className } = props;
  return (
    <ItemList
      label="Address"
      items={addressList}
      getItemKey={(address, index) =>
        /** Not ideal to use indexes but it's fine for our use case seeing we
         * don't have a long list. Same reason for other places where index is
         * used for keys. */ index
      }
      renderItem={(address) => <AddressView address={address} />}
      className={className}
    />
  );
};

export default AddressList;
