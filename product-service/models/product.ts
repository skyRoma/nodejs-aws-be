import * as yup from 'yup';

export interface Product {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

export const ProductSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  price: yup.number().integer().positive().required(),
  count: yup.number().integer().positive().required(),
});
