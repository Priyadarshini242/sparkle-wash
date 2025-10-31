import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export const startVehiclePackage = async (customerId, vehicleId) => {
    try {
        const response = await axios.post(`${API}/customer/${customerId}/vehicles/${vehicleId}/start-package`);
        return response.data;
    } catch (error) {
        throw error;
    }
};