export const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("storageUpdated"));
};

export const removeData = (clave,id) => {
const data = getData(clave);
const updatedData = data.filter((item) => item.id !== id);
saveData(clave, updatedData);
window.dispatchEvent(new Event("storageUpdated"));
}

export const saveDispensas = (key, id, newData) => {
  const data = getData(key);
  const updatedData = data.map((item) =>  
    item.id === id ? { ...item, dispensas:[...item.dispensas,newData] } : item
  );
  saveData(key, updatedData);
  window.dispatchEvent(new Event("storageUpdated"));
}