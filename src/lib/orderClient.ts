import {
  apiPost,
  apiPostAuth,
  getAccountToken,
} from "@/lib/clientApi";

export const postCheckoutOrder = <T>(path: string, body: unknown) => {
  if (getAccountToken()) {
    return apiPostAuth<T>("/ecommerce/orders/create-order", body);
  }

  return apiPost<T>(path, body);
};
