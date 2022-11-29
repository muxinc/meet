import axios from "axios";

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
