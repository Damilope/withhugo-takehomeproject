import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import React from "react";
import { frontendRoutes } from "../../lib/constants";
import {
  CompletePrismaInsuranceApplication,
  InsuranceApplicationInput,
  NewInsuranceApplicationEndpoint,
  QuoteInsuranceApplicationEndpoint,
  apiPaths,
} from "../../lib/definitions";
import { callEndpoint, getApplicationIdFromRoute } from "../../lib/helpers";
import { useRequest } from "../hooks/useRequest";
import ItemList from "../utils/ItemList";
import InsuranceApplicationForm from "./InsuranceApplicationForm";
import InsuranceApplicationListItem from "./InsuranceApplicationListItem";

export interface InsuranceApplicationListProps {
  applications: CompletePrismaInsuranceApplication[];
}

const InsuranceApplicationList: React.FC<InsuranceApplicationListProps> = (
  props
) => {
  const { applications } = props;
  const [showForm, setShowForm] = React.useState(false);

  const handleAddNewApplication = React.useCallback(
    async (application: InsuranceApplicationInput) => {
      const result = await callEndpoint<NewInsuranceApplicationEndpoint>({
        path: apiPaths.newInsuranceApplication,
        method: "post",
        body: application,
      });
      const applicationId = getApplicationIdFromRoute(result.route);
      setTimeout(
        () => window.open(frontendRoutes.application(applicationId)),
        0
      );
    },
    []
  );
  const handleQuoteApplication = React.useCallback(
    async (application: InsuranceApplicationInput) => {
      return await callEndpoint<QuoteInsuranceApplicationEndpoint>({
        path: apiPaths.quoteInsuranceApplication,
        method: "post",
        body: application,
      });
    },
    []
  );

  const quoteRequest = useRequest(handleQuoteApplication);

  return (
    <React.Fragment>
      <ItemList
        label="Insurance Applications"
        items={applications}
        getItemKey={(application: CompletePrismaInsuranceApplication) =>
          application.id
        }
        renderItem={(application: CompletePrismaInsuranceApplication) => (
          <InsuranceApplicationListItem application={application} />
        )}
        buttons={
          <Button icon={<PlusOutlined />} onClick={() => setShowForm(true)} />
        }
      />
      {showForm && (
        <Drawer
          closable
          destroyOnClose
          title="Insurance Application"
          placement="right"
          onClose={() => setShowForm(false)}
          open={!!showForm}
          width={500}
        >
          <InsuranceApplicationForm
            showQuoteButton
            isQuoting={quoteRequest.loading}
            quote={quoteRequest.result?.quote}
            quoteError={quoteRequest.error}
            onSubmit={handleAddNewApplication}
            onQuote={quoteRequest.handler}
          />
        </Drawer>
      )}
    </React.Fragment>
  );
};

export default InsuranceApplicationList;
