// @flow
import api from "api";
import configuration from "configuration";

export const getAll = () => {
  return api.get(configuration.backend + "/language");
};

export const save = (lang: any, id: number) => {
  return api.put(configuration.backend + "/language/" + id, lang);
};

export const create = (lang: any) => {
  return api.post(configuration.backend + "/language", lang);
};

export const deleteLanguage = (id: number) => {
  return api.delete(configuration.backend + "/language/" + id);
};

export const deleteAll = () => {
  return api.delete(configuration.backend + "/language");
};

export const exportAll = () => {
  return api.get(configuration.backend + "/language/export");
};

export const importLanguages = configuration.backend + "/language/import";
