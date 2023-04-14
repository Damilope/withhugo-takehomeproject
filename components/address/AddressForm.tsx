import { Alert, Col, Form, Input, Row } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { AddressInput } from "../../lib/definitions";

export interface AddressFormProps {
  address: AddressInput;
  touched?: FormikTouched<AddressInput>;
  error?: FormikErrors<AddressInput>;
  disabled?: boolean;
  onChange: (input: AddressInput) => void;
}

const AddressForm: React.FC<AddressFormProps> = (props) => {
  const { address, touched, error, disabled, onChange } = props;
  return (
    <Row gutter={16}>
      <Col sm={24} md={24}>
        <Form.Item
          label="Street Address"
          help={
            touched?.street &&
            error?.street && (
              <Alert type="error" message={error.street} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input.TextArea
            value={address.street}
            autoSize={{ minRows: 2, maxRows: 5 }}
            autoComplete="street-address"
            onChange={(evt) =>
              onChange({ ...address, street: evt.target.value })
            }
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={8}>
        <Form.Item
          label="State"
          help={
            touched?.state &&
            error?.state && (
              <Alert type="error" message={error.state} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={address.state}
            autoComplete="address-level1"
            onChange={(evt) =>
              onChange({ ...address, state: evt.target.value })
            }
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={8}>
        <Form.Item
          label="City"
          help={
            touched?.city &&
            error?.city && (
              <Alert type="error" message={error.city} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={address.city}
            autoComplete="address-level2"
            onChange={(evt) => onChange({ ...address, city: evt.target.value })}
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={8}>
        <Form.Item
          label="Zip Code"
          help={
            touched?.zipCode &&
            error?.zipCode && (
              <Alert type="error" message={error.zipCode} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={address.zipCode}
            autoComplete="postal-code"
            onChange={(evt) =>
              onChange({ ...address, zipCode: evt.target.value })
            }
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default AddressForm;
