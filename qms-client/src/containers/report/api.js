// @flow
import api from "api";
import configuration from "configuration";

export const getAll = () => {
  return api.get(configuration.backend + "/categoryinfo");
};
