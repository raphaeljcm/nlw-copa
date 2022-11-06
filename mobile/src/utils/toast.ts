import { IToastProps } from "native-base";

export const TOAST_ERROR_KEY = 'toast_error';
export const TOAST_ERROR_VALUE = {
  placement: 'top',
  bgColor: 'red.500'
}

export const TOAST_SUCCESS_KEY = 'toast_success';
export const TOAST_SUCCESS_VALUE = {
  placement: 'top',
  bgColor: 'green.500'
}

const TOAST_MAP = new Map([
  [TOAST_ERROR_KEY, TOAST_ERROR_VALUE],
  [TOAST_SUCCESS_KEY, TOAST_SUCCESS_VALUE]
]);

export const getToast = (title: string, key?: string) => {
  const toast = TOAST_MAP.get(key);

  if(toast) return { ...toast, title } as IToastProps;

  return { ...TOAST_MAP.get(TOAST_ERROR_KEY), title } as IToastProps;
}
