import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const initPersons = function () {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = function (object) {
  const request = axios.post(baseUrl, object);
  return request.then((response) => response.data);
};

const del = function (userId) {
  const request = axios.delete(`${baseUrl}/${userId}`);
  request.then((response) => {
    return response.data;
  });
};

const reNum = async function (userId, newNum, name) {
  const request = await axios.put(`${baseUrl}/${userId}`, {
    name: name,
    number: newNum,
  });
  return request.data;
};

export default { initPersons, create, del, reNum };
