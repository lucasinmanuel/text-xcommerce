import IProduct from "@/interfaces/IProduct";
import IUser from "@/interfaces/IUser";

export const getLogin = async (
    email: string, password: string
) => {
    const response = await fetch(`/api/users?email=${email}&password=${password}`, { method: "GET" })
    const json: IUser = await response.json()
    return json;
}
