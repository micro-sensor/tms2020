// @flow
import api from "api";
import configuration from "configuration";

export const get = (id: number) => {
  return api.get(configuration.backend + "/question/" + id);
};

export const save = (question: any, id: number) => {
  return api.put(configuration.backend + "/question/" + id, question);
};

export const create = (question: any) => {
  return api.post(configuration.backend + "/question", question);
};

export const remove = (id: number) => {
  return api.delete(configuration.backend + "/question/" + id);
};
export const search = (id: number, text: string) => {
  if (id == -1) {
    return api.get(configuration.backend + "/question?name=" + text);
  } else {
    return api.get(
      configuration.backend + "/question?categoryId=" + id + "&name=" + text
    );
  }
};
