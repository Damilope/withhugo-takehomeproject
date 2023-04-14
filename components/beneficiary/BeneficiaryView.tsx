import type { Beneficiary } from "@prisma/client";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import React from "react";
import { ApplicationBeneficiaryRelationship } from "../../lib/definitions";
import LabeledNode from "../utils/LabeledNode";

export interface BeneficiaryViewProps {
  beneficiary: Beneficiary;
}

const BeneficiaryView: React.FC<BeneficiaryViewProps> = (props) => {
  const { beneficiary } = props;
  return (
    <Row gutter={[16, 16]} className="my-4">
      <Col sm={24} md={12}>
        <LabeledNode label="First Name" text={beneficiary.firstName} />
      </Col>
      <Col sm={24} md={12}>
        <LabeledNode label="Last Name" text={beneficiary.lastName} />
      </Col>
      <Col sm={24} md={12}>
        <LabeledNode
          label="Date of Birth"
          text={dayjs(beneficiary.dateOfBirth).format("DD-MM-YYYY")}
        />
      </Col>
      <Col sm={24} md={12}>
        <LabeledNode
          label="Primary Account Holder"
          text={beneficiary.isPrimaryAccountHolder ? "Yes" : "No"}
        />
      </Col>
      {!beneficiary.isPrimaryAccountHolder && (
        <Col sm={24} md={12}>
          <LabeledNode
            label="Relationship"
            text={
              beneficiary.relationship ??
              ApplicationBeneficiaryRelationship.Other
            }
          />
        </Col>
      )}
    </Row>
  );
};

export default BeneficiaryView;
