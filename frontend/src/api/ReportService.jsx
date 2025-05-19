import api from "./axios";

const ReportService = {
    generate: async() =>{
        try {
            const response = await api.get('/reports')
            return(response.data)
        } catch (error) {
            throw new Error(`Ошибка получения отчета:${error.message}`)
        }
    }
}

export default ReportService;