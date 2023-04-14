import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { validationConstants } from "../../lib/constants";
import { VehicleInput } from "../../lib/definitions";
import { newVehicleInput } from "../../lib/helpers";
import ListForm from "../utils/ListForm";
import VehicleForm from "./VehicleForm";

export interface VehicleListFormProps {
  vehicleList: Array<VehicleInput>;
  touched: Array<FormikTouched<VehicleInput>>;
  errors: Array<FormikErrors<VehicleInput>>;
  disabled?: boolean;
  onChange: (updatedVehicleList: Array<VehicleInput>) => void;
  className?: string;
}

const VehicleListForm: React.FC<VehicleListFormProps> = (props) => {
  const { vehicleList, touched, className, errors, disabled, onChange } = props;
  return (
    <ListForm
      label="Vehicle"
      items={vehicleList}
      max={validationConstants.maxVehiclesCount}
      renderItem={(vehicle: VehicleInput, index) => (
        <VehicleForm
          vehicle={vehicle}
          error={errors[index]}
          touched={touched[index]}
          onChange={(updatedVehicle) =>
            onChange(
              vehicleList.map((nextVehicle, i) =>
                index === i ? updatedVehicle : nextVehicle
              )
            )
          }
          disabled={disabled}
        />
      )}
      getItemKey={(vehicle, index) => index}
      onAddItem={() => onChange([...vehicleList, newVehicleInput()])}
      onRemoveItem={(vehicle, index) =>
        onChange(vehicleList.filter((nextVehicle, i) => index !== i))
      }
      isDeletedDisabled={() =>
        /** Cannot delete vehiclees, but update is allowed. */ false
      }
      className={className}
    />
  );
};

export default VehicleListForm;
