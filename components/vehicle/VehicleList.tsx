import type { Vehicle } from "@prisma/client";
import React from "react";
import ItemList from "../utils/ItemList";
import VehicleView from "./VehicleView";

export interface VehicleListProps {
  vehicleList: Array<Vehicle>;
  className?: string;
}

const VehicleList: React.FC<VehicleListProps> = (props) => {
  const { vehicleList, className } = props;
  return (
    <ItemList
      label="Vehicles"
      items={vehicleList}
      getItemKey={(vehicle: Vehicle) => vehicle.vin}
      renderItem={(vehicle: Vehicle) => <VehicleView vehicle={vehicle} />}
      className={className}
    />
  );
};

export default VehicleList;
