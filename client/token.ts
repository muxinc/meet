import axios from "axios";

interface TokenParams {
  spaceId: string;
  participantId: string;
}

interface TokenResponse {
  spaceJWT: string;
}

export const tokenPOST = async (
  params: TokenParams
): Promise<TokenResponse> => {
  return axios.post(`/api/token`, params).then(({ data }) => data);
};
