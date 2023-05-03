import { generateId } from '../../../utils/helper';

export const getAll = () => {
  return JSON.parse(localStorage.getItem('records') || '[]');
}

export const getById = (id) => {
  const records = getAll();
  return records.find(item => item.id === id);
}

export const save = (data) => {
  const records = getAll();
  if (data.id) {
    // update
    const indexToUpdate = records.findIndex(item => item.id === data.id);
    if (indexToUpdate > -1) {
      records[indexToUpdate] = data;
      localStorage.setItem('records', JSON.stringify(records));
      return true;
    }
  } else {
    // create new
    records.push({ ...data, id: generateId() });
    localStorage.setItem('records', JSON.stringify(records));
    return true;
  }
  return false;
}