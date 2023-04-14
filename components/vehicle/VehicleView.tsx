import type { Vehicle } from "@prisma/client";
import { Col, Row } from "antd";
import React from "react";
import LabeledNode from "../utils/LabeledNode";

export interface VehicleViewProps {
  vehicle: Vehicle;
}

const VehicleView: React.FC<VehicleViewProps> = (props) => {
  const { vehicle } = props;
  return (
    <Row gutter={[16, 16]} className="my-4">
      <Col sm={24} md={24}>
        <LabeledNode label="VIN" text={vehicle.vin} />
      </Col>
      <Col sm={24} md={8}>
        <LabeledNode label="Manufacturer" text={vehicle.make} />
      </Col>
      <Col sm={24} md={8}>
        <LabeledNode label="Model" text={vehicle.model} />
      </Col>
      <Col sm={24} md={8}>
        <LabeledNode label="Year" text={vehicle.year.toString()} />
      </Col>
    </Row>
  );
};

export default VehicleView;
