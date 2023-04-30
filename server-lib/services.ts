import axios from "axios";

const MUX_TOKEN_ID = "7a0dbb49-b442-406e-99e3-9e8bf5188b9b";
const MUX_TOKEN_SECRET = "W1QuAq+/bboAG3W74dCjPQBkebKEsxwBDMz0W1GpeI30yW8YTK2Gm6Y+/PKOpgG8JXDVtPDaJOH";


const {
  MUX_TOKEN_ID,
  MUX_TOKEN_SECRET,
  MUX_API_HOST = "api.mux.com",
} = process.env;

const muxOptions = {
  auth: { username: MUX_TOKEN_ID ?? "", password: MUX_TOKEN_SECRET ?? "" },
  baseURL: `https://${MUX_API_HOST}`,
};

const muxClient = axios.create(muxOptions);

export { muxClient };
