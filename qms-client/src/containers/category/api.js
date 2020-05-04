// @flow
import api from "api";
import configuration from "configuration";

export const getAll = () => {
  return api.get(configuration.backend + "/category");
};

export const save = (category: any, id: number) => {
  return api.put(configuration.backend + "/category/" + id, category);
};

export const create = (category: any) => {
  return api.post(configuration.backend + "/category", category);
};

export const deleteCategory = (id: number) => {
  return api.delete(configuration.backend + "/category/" + id);
};

export const deleteAll = () => {
  return api.delete(configuration.backend + "/category");
};

export const exportAll = () => {
  return api.get(configuration.backend + "/category/export");
};

export const importCategories = configuration.backend + "/category/import";
