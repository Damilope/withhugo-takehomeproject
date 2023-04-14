import type { Address } from "@prisma/client";
import { Col, Row } from "antd";
import React from "react";
import LabeledNode from "../utils/LabeledNode";

export interface AddressViewProps {
  address: Address;
}

const AddressView: React.FC<AddressViewProps> = (props) => {
  const { address } = props;
  return (
    <Row gutter={[16, 16]} className="my-4">
      <Col sm={24} md={24}>
        <LabeledNode label="Street Address" text={address.street} />
      </Col>
      <Col sm={24} md={8}>
        <LabeledNode label="State" text={address.state} />
      </Col>
      <Col sm={24} md={8}>
        <LabeledNode label="City" text={address.city} />
      </Col>
      <Col sm={24} md={8}>
        <LabeledNode label="Zip Code" text={address.zipCode} />
      </Col>
    </Row>
  );
};

export default AddressView;
