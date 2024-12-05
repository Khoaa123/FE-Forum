import { useQuery } from "@tanstack/react-query";
const fetchUser = async (userId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/GetUser?userId=${userId}`
  );
  const data = await res.json();
  return data.data;
};

const useFetchUser = (userId: string) => {
  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
};

export default useFetchUser;
