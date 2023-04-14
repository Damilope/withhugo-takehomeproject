import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { validationConstants } from "../../lib/constants";
import { AddressInput } from "../../lib/definitions";
import { newAddressInput } from "../../lib/helpers";
import ListForm from "../utils/ListForm";
import AddressForm from "./AddressForm";

export interface AddressListFormProps {
  addressList: Array<AddressInput>;
  touched: Array<FormikTouched<AddressInput>>;
  errors: Array<FormikErrors<AddressInput>>;
  disabled?: boolean;
  onChange: (updatedAddressList: Array<AddressInput>) => void;
  className?: string;
}

const AddressListForm: React.FC<AddressListFormProps> = (props) => {
  const { addressList, touched, errors, disabled, className, onChange } = props;
  return (
    <ListForm
      label="Address"
      items={addressList}
      max={validationConstants.maxAddressCount}
      renderItem={(address, index) => (
        <AddressForm
          address={address}
          error={errors[index]}
          touched={touched[index]}
          onChange={(updatedAddress) =>
            onChange(
              addressList.map((nextAddress, i) =>
                index === i ? updatedAddress : nextAddress
              )
            )
          }
          disabled={disabled}
        />
      )}
      getItemKey={(address, index) =>
        /** Not ideal to use indexes but it's fine for our use case seeing we
         * don't have a long list. Same reason for other places where index is
         * used for keys. */ index
      }
      onAddItem={() => onChange([...addressList, newAddressInput()])}
      onRemoveItem={(address, index) =>
        onChange(addressList.filter((nextAddress, i) => index !== i))
      }
      isDeletedDisabled={() =>
        /** Cannot delete addresses, but update is allowed. */ false
      }
      className={className}
    />
  );
};

export default AddressListForm;
