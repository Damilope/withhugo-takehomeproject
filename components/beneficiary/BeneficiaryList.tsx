import type { Beneficiary } from "@prisma/client";
import React from "react";
import ItemList from "../utils/ItemList";
import BeneficiaryView from "./BeneficiaryView";

export interface BeneficiaryListProps {
  beneficiaryList: Array<Beneficiary>;
  className?: string;
}

const BeneficiaryList: React.FC<BeneficiaryListProps> = (props) => {
  const { beneficiaryList, className } = props;
  return (
    <ItemList
      label="Beneficiaries"
      items={beneficiaryList}
      getItemKey={(beneficiary, index) =>
        /** Not ideal to use indexes but it's fine for our use case seeing we
         * don't have a long list. Same reason for other places where index is
         * used for keys. */ index
      }
      renderItem={(beneficiary: Beneficiary) => (
        <BeneficiaryView beneficiary={beneficiary} />
      )}
      className={className}
    />
  );
};

export default BeneficiaryList;
