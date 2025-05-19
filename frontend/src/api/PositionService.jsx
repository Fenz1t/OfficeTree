import api from '../api/axios';

const PositionService = {
  getAll: async () => {
    try {
      const response = await api.get('/positions');
      return(response.data)
    } catch (error) {
      throw new Error(`Ошибка получения должностей: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/positions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения должности ${id}: ${error.message}`);
    }
  },

  create: async (positionData) => {
    try {
      const response = await api.post('/positions', positionData);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка создания должности: ${error.message}`);
    }
  },
  delete: async(id) =>{
    try {
        const response = await api.delete(`/positions/${id}`)
        return response.data
    } catch (error) {
      throw new Error(`Ошибка удаления должонсти:${error.message}`);  
    }
  },
  update: async (id, positionData) => {
    try {
      const response = await api.patch(`/positions/${id}`, positionData);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка обновления должности: ${error.message}`);
    }
  },
};

export default PositionService;