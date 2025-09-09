import { privateAxios } from "./helper";

export const loadAllCategories = () => {
    return privateAxios.get("/categories").then((response) => response.data);
};
