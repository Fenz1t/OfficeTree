import api from "../api/axios";

const EmployeeService = {

  getById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения сотрудника ${id}: ${error.message}`);
    }
  },

  create: async (employeeData) => {
    try {
      const response = await api.post("/employees", employeeData);
      console.log(response.data);
    } catch (error) {
      throw new Error(`Ошибка создания сотрудника: ${error.message}`);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка удаления сотрудника:${error.message}`);
    }
  },
  update: async (id, employeeData) => {
    try {
      const response = await api.patch(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка обновления сотрудника: ${error.message}`);
    }
  },
};

export default EmployeeService;
