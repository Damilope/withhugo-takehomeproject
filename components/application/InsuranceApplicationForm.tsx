import { Alert, Button, Form, Space, Typography } from "antd";
import { FormikErrors } from "formik";
import { isArray, isEmpty, isString } from "lodash";
import React from "react";
import {
  AddressInput,
  BeneficiaryInput,
  ClientsideError,
  InsuranceApplicationInput,
  VehicleInput,
} from "../../lib/definitions";
import {
  newInsuranceApplicationInput,
  toClientsideError,
} from "../../lib/helpers";
import { validationSchemas } from "../../lib/validation";
import AddressListForm from "../address/AddressListForm";
import BeneficiaryListForm from "../beneficiary/BeneficiaryListForm";
import { useExtendedFormik } from "../hooks/useExtendedFormik";
import VehicleListForm from "../vehicle/VehicleListForm";

export interface InsuranceApplicationFormProps {
  showQuoteButton?: boolean;
  isQuoting?: boolean;
  quoteError?: ClientsideError[];
  quote?: number;
  application?: InsuranceApplicationInput;
  onSubmit: (application: InsuranceApplicationInput) => Promise<void>;
  onQuote?: (application: InsuranceApplicationInput) => Promise<void>;
}

const InsuranceApplicationForm: React.FC<InsuranceApplicationFormProps> = (
  props
) => {
  const {
    showQuoteButton,
    isQuoting,
    quoteError,
    quote,
    application,
    onSubmit,
    onQuote,
  } = props;

  const { formik, generalErrors } = useExtendedFormik({
    onSubmit,
    initialValues: application || newInsuranceApplicationInput,
    validationSchema: validationSchemas.insuranceApplication,
  });

  const formDisabled = formik.isSubmitting || isQuoting;
  const errors = generalErrors.concat(toClientsideError(quoteError ?? []));

  return (
    <form onSubmit={formik.handleSubmit}>
      {errors.length ? (
        <Form.Item>
          <Alert
            closable
            type="error"
            description={
              <Space direction="vertical" style={{ width: "100%" }}>
                {errors.map((nextError, index) => (
                  <Typography.Text key={index}>
                    {nextError.message}
                  </Typography.Text>
                ))}
              </Space>
            }
          ></Alert>
        </Form.Item>
      ) : null}
      {quote && (
        <Form.Item>
          <Alert
            closable
            type="info"
            description={
              <Typography.Text>
                Your quote for this current application is{" "}
                <Typography.Text strong>${quote}</Typography.Text>
              </Typography.Text>
            }
          />
        </Form.Item>
      )}
      <Form.Item
        help={
          formik.touched.beneficiaries &&
          isString(formik.errors.beneficiaries) && (
            <Alert
              type="error"
              message={formik.errors.beneficiaries}
              className="mt-2"
            />
          )
        }
      >
        <BeneficiaryListForm
          beneficiaryList={formik.values.beneficiaries}
          touched={formik.touched.beneficiaries ?? []}
          errors={
            (isArray(formik.errors.beneficiaries)
              ? formik.errors.beneficiaries
              : []) as Array<FormikErrors<BeneficiaryInput>>
          }
          onChange={(update) =>
            formik.setValues({ ...formik.values, beneficiaries: update })
          }
          disabled={formDisabled}
        />
      </Form.Item>
      <Form.Item
        help={
          formik.touched.address &&
          isString(formik.errors.address) && (
            <Alert
              type="error"
              message={formik.errors.address}
              className="mt-2"
            />
          )
        }
      >
        <AddressListForm
          addressList={formik.values.address}
          touched={formik.touched.address ?? []}
          errors={
            (isArray(formik.errors.address)
              ? formik.errors.address
              : []) as Array<FormikErrors<AddressInput>>
          }
          onChange={(update) =>
            formik.setValues({ ...formik.values, address: update })
          }
          disabled={formDisabled}
        />
      </Form.Item>
      <Form.Item
        help={
          formik.touched.vehicles &&
          isString(formik.errors.vehicles) && (
            <Alert
              type="error"
              message={formik.errors.vehicles}
              className="mt-2"
            />
          )
        }
      >
        <VehicleListForm
          vehicleList={formik.values.vehicles}
          touched={formik.touched.vehicles ?? []}
          errors={
            (isArray(formik.errors.vehicles)
              ? formik.errors.vehicles
              : []) as Array<FormikErrors<VehicleInput>>
          }
          onChange={(update) =>
            formik.setValues({ ...formik.values, vehicles: update })
          }
          disabled={formDisabled}
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          loading={formik.isSubmitting}
          disabled={isQuoting}
        >
          Submit Application
        </Button>
        {showQuoteButton && onQuote && (
          <Button
            htmlType="button"
            type="default"
            loading={isQuoting}
            disabled={formik.isSubmitting}
            onClick={async () => {
              const errors = await formik.validateForm();
              if (isEmpty(errors)) onQuote(formik.values);
            }}
            className="mx-4"
          >
            Quote Application
          </Button>
        )}
      </Form.Item>
    </form>
  );
};

export default InsuranceApplicationForm;
