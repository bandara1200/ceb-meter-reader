import axiosConfig from '../../Config/axiosConfig'


export const fetchAccountsByUser = async (query) => {
    const responce = await axiosConfig.get("/api/v1/accounts/by-user",
        {
            params : {
                username : query
            }
        });
    return responce;
}