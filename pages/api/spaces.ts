import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { muxClient } from "server-lib/services";
import { NextApiRequest, NextApiResponse } from "next";

const fetchSpaces = async () => {
  let response;

  try {
    response = await muxClient.get(`/video/v1/spaces?limit=100`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error: ${error.response?.status}`);
    }

    throw new Error("Unknown error");
  }

  return response.data.data;
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
