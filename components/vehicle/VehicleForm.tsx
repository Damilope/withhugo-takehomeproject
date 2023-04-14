import { Alert, Col, Form, Input, Row } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { VehicleInput } from "../../lib/definitions";

export interface VehicleFormProps {
  vehicle: VehicleInput;
  touched?: FormikTouched<VehicleInput>;
  error?: FormikErrors<VehicleInput>;
  disabled?: boolean;
  onChange: (input: VehicleInput) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = (props) => {
  const { vehicle, touched, error, disabled, onChange } = props;
  return (
    <Row gutter={16}>
      <Col sm={24} md={12}>
        <Form.Item
          label="VIN"
          help={
            touched?.vin &&
            error?.vin && (
              <Alert type="error" message={error.vin} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={vehicle.vin}
            onChange={(evt) => onChange({ ...vehicle, vin: evt.target.value })}
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12}>
        <Form.Item
          label="Manufacturer"
          help={
            touched?.make &&
            error?.make && (
              <Alert type="error" message={error.make} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={vehicle.make}
            onChange={(evt) => onChange({ ...vehicle, make: evt.target.value })}
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12}>
        <Form.Item
          label="Model"
          help={
            touched?.model &&
            error?.model && (
              <Alert type="error" message={error.model} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={vehicle.model}
            onChange={(evt) =>
              onChange({ ...vehicle, model: evt.target.value })
            }
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12}>
        <Form.Item
          label="Manufacture Year"
          help={
            touched?.year &&
            error?.year && (
              <Alert type="error" message={error.year} className="mt-2" />
            )
          }
          labelCol={{ span: 24 }}
        >
          <Input
            value={vehicle.year}
            onChange={(evt) =>
              onChange({ ...vehicle, year: parseInt(evt.target.value) })
            }
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default VehicleForm;
