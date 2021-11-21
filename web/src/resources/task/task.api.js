import api from 'services/api.service';
import faker from 'faker';

export const list = () => {
  return api.get('/task');
};

export const create = () => {
  return api.post('/task', {
    description: faker.commerce.productDescription(),
    jira_id: `${faker.datatype.number()}`,
    title: faker.animal.bird(),
  });
};

export const shuffle = () => {
  return api.post('/task/shuffle');
};

export const close = (id) => {
  return api.post(`/task/close/${id}`);
};