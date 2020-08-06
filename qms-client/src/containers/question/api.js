// @flow
import api from "api";
import configuration from "configuration";

export const get = (id: number) => {
  return api.get(configuration.backend + "/question/" + id);
};

export const save = (question: any, id: number) => {
  return api.put(configuration.backend + "/question/" + id, question);
};

export const exportQuestion = (id: number) => {
  return api.get(configuration.backend + "/question/export/" + id);
};

export const exportAll = () => {
  return api.get(configuration.backend + "/question/export");
};

export const exportFiltered = (data: {}) => {
  return api.post(configuration.backend + "/question/exportFiltered", data);
};

export const importQuestions = configuration.backend + "/question/import";

export const create = (question: any) => {
  return api.post(configuration.backend + "/question", question);
};

export const remove = (id: number) => {
  return api.delete(configuration.backend + "/question/" + id);
};

export const deleteAll = () => {
  return api.delete(configuration.backend + "/question");
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


export const uploadImage = configuration.questionsUrl + "/image";

export const checkSyntax = (codeBody: string) => {
  return api.post(configuration.backend + "/question/checkSyntax", {codeBody: codeBody});
};