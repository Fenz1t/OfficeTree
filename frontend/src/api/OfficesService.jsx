import api from "../api/axios";

const OfficesService = {
  getAll: async () => {
    try {
      const response = await api.get("/branches");
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения дерева филиалов: ${error.message}`);
    }
  },
  getAllList: async() =>{
    try {
        const response = await api.get('/branches/list');
        return response.data;
    } catch (error) {
        throw new Error(`Ошибка получения cписка филиалов: ${error.message}`);
    }
  },
  getAllEmployeesByBranch: async (id) => {
    try {
      const response = await api.get(`/branches/${id}/employees`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения cотрудника филиала: ${error.message}`);
    }
  },
  create: async (officeData) => {
    try {
      const response = await api.post("/branches", officeData);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка создания филиала: ${error.message}`);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/branches/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка удаления филиала:${error.message}`);
    }
  },
};
export default OfficesService;
