import { Button, Drawer } from "antd";
import Link from "next/link";
import React from "react";
import { frontendRoutes } from "../../lib/constants";
import {
  CompletePrismaInsuranceApplication,
  InsuranceApplicationInput,
  UpdateInsuranceApplicationEndpoint,
  apiPaths,
} from "../../lib/definitions";
import { callEndpoint, toUpdateApplicationBody } from "../../lib/helpers";
import AddressList from "../address/AddressList";
import BeneficiaryList from "../beneficiary/BeneficiaryList";
import VehicleList from "../vehicle/VehicleList";
import InsuranceApplicationForm from "./InsuranceApplicationForm";

export interface InsuranceApplicationViewProps {
  application: CompletePrismaInsuranceApplication;
}

const InsuranceApplicationView: React.FC<InsuranceApplicationViewProps> = (
  props
) => {
  const { application: initialApplication } = props;
  const [showForm, setShowForm] = React.useState(false);
  const [application, setApplication] = React.useState(initialApplication);

  const handleUpdateApplication = React.useCallback(
    async (update: InsuranceApplicationInput) => {
      const updatedApplication =
        await callEndpoint<UpdateInsuranceApplicationEndpoint>({
          path: apiPaths.updateInsuranceApplication,
          method: "put",
          body: toUpdateApplicationBody(application, update),
        });
      setApplication(updatedApplication);
      setShowForm(false);
    },
    [application]
  );

  return (
    <div>
      <div className="flex py-2 border-b border-black space-x-4">
        <Link href={frontendRoutes.baseUrl} className="flex-none text-sky-500">
          Home
        </Link>
        <h1 className="grow font-bold">Insurance Application</h1>
        <Button className="flex-none" onClick={() => setShowForm(true)}>
          Update Application
        </Button>
      </div>
      <BeneficiaryList beneficiaryList={application.beneficiaries} />
      <AddressList addressList={application.address} className="my-8" />
      <VehicleList vehicleList={application.vehicles} className="my-8" />
      <Drawer
        closable
        destroyOnClose
        title="Insurance Application"
        placement="right"
        onClose={() => setShowForm(false)}
        open={!!showForm}
        width={700}
      >
        <InsuranceApplicationForm
          application={application}
          onSubmit={handleUpdateApplication}
        />
      </Drawer>
    </div>
  );
};

export default InsuranceApplicationView;
