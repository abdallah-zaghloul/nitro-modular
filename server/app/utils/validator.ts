import { ZodTypeAny } from "zod";
import { H3Event } from "h3";

export function useValidator<T>(
  schema: ZodTypeAny,
  data: T,
  catcher?: Function
): T {
  const res = schema.safeParse(data);
  if (!res.success)
    return catcher
      ? catcher()
      : useSendError({
          data: res.error.flatten().fieldErrors,
          httpStatus: "UNPROCESSABLE_ENTITY",
        });

  return res.data;
}

export async function useValidReqBody<T>(
  schema: ZodTypeAny,
  {
    event = useEvent(),
    catcher,
  }: {
    event?: H3Event;
    catcher?: Function;
  } = {}
): Promise<T> {
  return useValidator<T>(schema, await readBody<T>(event), catcher);
}

export function useValidReqQuery<T>(
  schema: ZodTypeAny,
  {
    event = useEvent(),
    catcher,
  }: {
    event?: H3Event;
    catcher?: Function;
  } = {}
) {
  return useValidator<T>(schema, getQuery(event), catcher);
}

export function useValidRouteParam(
  schema: ZodTypeAny,
  name: string,
  {
    event = useEvent(),
    catcher,
  }: {
    event?: H3Event;
    catcher?: Function;
  } = {}
) {
  return useValidator<string>(schema, getRouterParam(event, name), catcher);
}

export function useValidHeader(
  schema: ZodTypeAny,
  name: string,
  {
    event = useEvent(),
    catcher,
  }: {
    event?: H3Event;
    catcher?: Function;
  } = {}
) {
  return useValidator<string>(schema, getHeader(event, name), catcher);
}
