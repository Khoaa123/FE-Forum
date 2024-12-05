import { useCookies } from "next-client-cookies";
import { DecodeToken } from "./UserType";
import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  if (accessToken) {
    const decode: DecodeToken = jwtDecode(accessToken);
    return decode.nameid;
  }

  return null;
};
