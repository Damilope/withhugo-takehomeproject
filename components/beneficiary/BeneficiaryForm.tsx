import { Alert, Col, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import {
  ApplicationBeneficiaryRelationship,
  ClientsideBeneficiaryInput,
} from "../../lib/definitions";

export interface BeneficiaryFormProps {
  beneficiary: ClientsideBeneficiaryInput;
  isPrimaryAccountHolder: boolean;
  touched?: FormikTouched<ClientsideBeneficiaryInput>;
  error?: FormikErrors<ClientsideBeneficiaryInput>;
  disabled?: boolean;
  onChange: (input: ClientsideBeneficiaryInput) => void;
}

const BeneficiaryForm: React.FC<BeneficiaryFormProps> = (props) => {
  const {
    beneficiary,
    isPrimaryAccountHolder,
    touched,
    error,
    disabled,
    onChange,
  } = props;

  return (
    <Row gutter={16}>
      <Col sm={24} md={12}>
        <Form.Item
          label="First Name"
          help={
            touched?.firstName &&
            error?.firstName && (
              <Alert type="error" message={error.firstName} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={beneficiary.firstName}
            autoComplete="given-name"
            onChange={(evt) =>
              onChange({ ...beneficiary, firstName: evt.target.value })
            }
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12}>
        <Form.Item
          label="Last Name"
          help={
            touched?.lastName &&
            error?.lastName && (
              <Alert type="error" message={error.lastName} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={beneficiary.lastName}
            autoComplete="family-name"
            onChange={(evt) =>
              onChange({ ...beneficiary, lastName: evt.target.value })
            }
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12}>
        <Form.Item
          label="Date of Birth"
          help={
            touched?.dateOfBirth &&
            error?.dateOfBirth && (
              <Alert
                type="error"
                message={error.dateOfBirth}
                className="mt-2"
              />
            )
          }
          labelCol={{ span: 24 }}
        >
          <DatePicker
            autoComplete="bday"
            value={
              beneficiary.dateOfBirth
                ? dayjs(beneficiary.dateOfBirth)
                : undefined
            }
            onChange={(value) =>
              value &&
              onChange({ ...beneficiary, dateOfBirth: value.toISOString() })
            }
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      {isPrimaryAccountHolder && (
        <Col sm={24} md={12}>
          <Form.Item label="Primary Account Holder">Yes</Form.Item>
        </Col>
      )}
      {!isPrimaryAccountHolder && (
        <Col sm={24} md={12}>
          <Form.Item
            label="Relationship to Primary Account Holder"
            help={
              touched?.relationship &&
              error?.relationship && (
                <Alert
                  type="error"
                  message={error.relationship}
                  className="mt-2"
                />
              )
            }
            labelCol={{ span: 24 }}
          >
            <Select
              value={beneficiary.relationship}
              style={{ width: 120 }}
              onChange={(value) =>
                value && onChange({ ...beneficiary, relationship: value })
              }
              options={[
                {
                  value: ApplicationBeneficiaryRelationship.Friend,
                  label: "Friend",
                },
                {
                  value: ApplicationBeneficiaryRelationship.Parent,
                  label: "Parent",
                },
                {
                  value: ApplicationBeneficiaryRelationship.Sibling,
                  label: "Sibling",
                },
                {
                  value: ApplicationBeneficiaryRelationship.Spouse,
                  label: "Spouse",
                },
                {
                  value: ApplicationBeneficiaryRelationship.Other,
                  label: "Other",
                },
              ]}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};

export default BeneficiaryForm;
