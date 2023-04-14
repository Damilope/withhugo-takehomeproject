import React from "react";
import { appMessages } from "../../lib/constants";
import { ClientsideError } from "../../lib/definitions";
import { toClientsideError } from "../../lib/helpers";

export function useRequest<Fn extends (...args: any) => Promise<any>>(fn: Fn) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ClientsideError[] | undefined>(
    undefined
  );
  const [result, setResult] = React.useState<
    Awaited<ReturnType<Fn>> | undefined
  >();

  const handler = React.useCallback(
    async (...params: Parameters<Fn>) => {
      try {
        setLoading(true);
        const result = await fn(...params);
        setResult(result);
      } catch (error: unknown) {
        setError(toClientsideError(error, appMessages.errors.unknownError));
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  return { handler, loading, error, result };
}
