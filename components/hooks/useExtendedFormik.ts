import { FormikConfig, FormikHelpers, FormikValues, useFormik } from "formik";
import { set } from "lodash";
import React from "react";
import { ClientsideError } from "../../lib/definitions";
import { toClientsideError } from "../../lib/helpers";

export function useExtendedFormik<Values extends FormikValues = FormikValues>(
  props: Omit<FormikConfig<Values>, "initialValues"> & {
    initialValues: Values | (() => Values);
  }
) {
  const { onSubmit: inputOnSubmit } = props;
  const [initialValues] = React.useState(props.initialValues);
  const [generalErrors, setGeneralErrors] = React.useState<ClientsideError[]>(
    []
  );

  const onSubmit = React.useCallback(
    async (values: Values, helpers: FormikHelpers<Values>) => {
      try {
        await inputOnSubmit(values, helpers);
      } catch (error: unknown) {
        const endpointErrors = toClientsideError(error);
        const validationErrors = endpointErrors.filter(
          (nextError) => !!nextError.path
        );
        const generalErrors = endpointErrors.filter(
          (nextError) => !nextError.path
        );
        const formikErrors = errorListToMap(validationErrors);
        helpers.setErrors(formikErrors);
        setGeneralErrors(generalErrors);
      }
    },
    [inputOnSubmit]
  );

  const formik = useFormik<Values>({ ...props, initialValues, onSubmit });
  return { formik, generalErrors };
}

function errorListToMap(errorList: ClientsideError[]) {
  return errorList.reduce((map, nextError) => {
    if (nextError.path) set(map, nextError.path, nextError.message);
    return map;
  }, {} as Record<string, any>);
}
