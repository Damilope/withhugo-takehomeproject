import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { validationConstants } from "../../lib/constants";
import { BeneficiaryInput } from "../../lib/definitions";
import { newBeneficiaryInput } from "../../lib/helpers";
import ListForm from "../utils/ListForm";
import BeneficiaryForm from "./BeneficiaryForm";

export interface BeneficiaryListFormProps {
  beneficiaryList: Array<BeneficiaryInput>;
  touched: Array<FormikTouched<BeneficiaryInput>>;
  errors: Array<FormikErrors<BeneficiaryInput>>;
  disabled?: boolean;
  onChange: (updatedBeneficiaryList: Array<BeneficiaryInput>) => void;
  className?: string;
}

const BeneficiaryListForm: React.FC<BeneficiaryListFormProps> = (props) => {
  const { beneficiaryList, touched, errors, disabled, className, onChange } =
    props;
  return (
    <ListForm
      label="Beneficiaries"
      items={beneficiaryList}
      max={validationConstants.maxBeneficiariesCount}
      renderItem={(beneficiary: BeneficiaryInput, index) => (
        <BeneficiaryForm
          beneficiary={beneficiary}
          error={errors[index]}
          touched={touched[index]}
          onChange={(updatedBeneficiary) =>
            onChange(
              beneficiaryList.map((nextBeneficiary, i) =>
                index === i ? updatedBeneficiary : nextBeneficiary
              )
            )
          }
          disabled={disabled}
          isPrimaryAccountHolder={
            beneficiary.isPrimaryAccountHolder ?? index === 0
          }
        />
      )}
      getItemKey={(beneficiary, index) =>
        /** Not ideal to use indexes but it's fine for our use case seeing we
         * don't have a long list. Same reason for other places where index is
         * used for keys. */ index
      }
      onAddItem={() =>
        onChange([
          ...beneficiaryList,
          newBeneficiaryInput(
            /** isPrimaryAccountHolder */ beneficiaryList.length === 0
              ? true
              : false
          ),
        ])
      }
      onRemoveItem={(beneficiary, index) =>
        onChange(beneficiaryList.filter((nextBeneficiary, i) => index !== i))
      }
      isDeletedDisabled={(beneficiary: BeneficiaryInput) =>
        !!beneficiary.isPrimaryAccountHolder
      }
      className={className}
    />
  );
};

export default BeneficiaryListForm;
