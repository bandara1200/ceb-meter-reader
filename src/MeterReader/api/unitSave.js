import axiosConfig from '../../Config/axiosConfig';

export const unitSave = async (query) => {
    console.log(query);
    const responce = axiosConfig.post("/api/v1/units",{
            query
    });
    return responce;
}