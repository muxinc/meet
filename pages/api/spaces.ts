import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;

const fetchSpaces = async () => {
  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString(
    "base64"
  );
  const response = await fetch(
    `https://api.mux.com/video/v1/spaces?limit=100`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const { data } = await response.json();
  return data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const spaces = await fetchSpaces();
    res.status(StatusCodes.OK).json(spaces);
  } else {
    res.status(StatusCodes.METHOD_NOT_ALLOWED);
  }
}
