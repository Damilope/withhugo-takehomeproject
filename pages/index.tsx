import { GetServerSideProps, NextPage } from "next";
import InsuranceApplicationList from "../components/application/InsuranceApplicationList";
import PageLayout from "../components/utils/PageLayout";
import {
  CompletePrismaInsuranceApplication,
  GetAllInsuranceApplicationsEndpoint,
  apiPaths,
} from "../lib/definitions";
import { callEndpoint } from "../lib/helpers";

interface InsuranceApplicationListPageProps {
  applications: CompletePrismaInsuranceApplication[];
}

const InsuranceApplicationsPage: NextPage<InsuranceApplicationListPageProps> = (
  props
) => {
  const { applications } = props;
  return (
    <PageLayout>
      <InsuranceApplicationList applications={applications} />
    </PageLayout>
  );
};

export default InsuranceApplicationsPage;

export const getServerSideProps: GetServerSideProps<
  InsuranceApplicationListPageProps
> = async (context) => {
  const { applications } =
    await callEndpoint<GetAllInsuranceApplicationsEndpoint>({
      path: apiPaths.getAllInsuranceApplications,
      method: "get",
    });
  return {
    props: { applications }, // will be passed to the page component as props
  };
};
