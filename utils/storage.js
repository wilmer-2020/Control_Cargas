export const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  // Dispara un evento personalizado para que otros componentes se actualicen
  window.dispatchEvent(new Event("storageUpdated"));
};
