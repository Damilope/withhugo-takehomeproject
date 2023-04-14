import assert from "assert";
import { GetServerSideProps, NextPage } from "next";
import InsuranceApplicationView from "../../components/application/InsuranceApplicationView";
import PageLayout from "../../components/utils/PageLayout";
import { appMessages } from "../../lib/constants";
import {
  CompletePrismaInsuranceApplication,
  GetInsuranceApplicationEndpoint,
  apiPaths,
} from "../../lib/definitions";
import { callEndpoint } from "../../lib/helpers";

interface InsuranceApplicationPageProps {
  application: CompletePrismaInsuranceApplication;
}

type PagePathParams = {
  id: string;
};

const InsuranceApplicationPage: NextPage<InsuranceApplicationPageProps> = (
  props
) => {
  const { application } = props;
  return (
    <PageLayout>
      <InsuranceApplicationView application={application} />
    </PageLayout>
  );
};

export default InsuranceApplicationPage;

export const getServerSideProps: GetServerSideProps<
  InsuranceApplicationPageProps,
  PagePathParams
> = async (context) => {
  const id = context.params?.id;
  assert(id, appMessages.errors.emptyApplicationId);

  const applicationId = parseInt(id);
  assert(!Number.isNaN(applicationId), appMessages.errors.invalidApplicationId);
  const application = await callEndpoint<GetInsuranceApplicationEndpoint>({
    path: apiPaths.getInsuranceApplication,
    method: "get",
    query: { applicationId },
  });
  return {
    props: { application }, // will be passed to the page component as props
  };
};
