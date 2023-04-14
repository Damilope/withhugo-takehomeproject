import assert from "assert";
import Link from "next/link";
import React from "react";
import { frontendRoutes } from "../../lib/constants";
import { CompletePrismaInsuranceApplication } from "../../lib/definitions";

export interface InsuranceApplicationListItemProps {
  application: CompletePrismaInsuranceApplication;
}

const InsuranceApplicationListItem: React.FC<
  InsuranceApplicationListItemProps
> = (props) => {
  const { application } = props;
  const primaryBeneficiary = React.useMemo(
    () =>
      application.beneficiaries.find(
        (nextBeneficiary) => nextBeneficiary.isPrimaryAccountHolder
      ),
    [application]
  );
  assert(primaryBeneficiary);

  return (
    <Link href={frontendRoutes.application(application.id)}>
      <div className="block my-2">
        <p className="m-0">
          {primaryBeneficiary.lastName}, {primaryBeneficiary.firstName}
        </p>
        <div>
          <p className="inline-block m-0 text-slate-500 w-2/4">
            {application.beneficiaries.length}{" "}
            {application.beneficiaries.length > 1
              ? "Beneficiaries"
              : "Beneficiary"}
          </p>
          <p className="inline-block m-0 text-slate-500 w-2/4">
            {application.vehicles.length}{" "}
            {application.vehicles.length > 1 ? "Vehicles" : "Vehicle"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default InsuranceApplicationListItem;
