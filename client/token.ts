import axios from "axios";

interface TokenParams {
  spaceId: string;
  participantId: string;
}

interface TokenResponse {
  spaceJWT: string;
}

export const createToken = async (
  params: TokenParams
): Promise<TokenResponse> => {
  return axios.post(`/api/token`, params).then(({ data }) => data);
};
