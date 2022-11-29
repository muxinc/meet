import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { muxClient } from "server-lib/services";
import axios from "axios";

const fetchSpace = async (id: string) => {
  let response;

  try {
    response = await muxClient.get(`/video/v1/spaces/${id}`);
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
  if (req.method === "GET" && typeof req.query.id === "string") {
    const space = await fetchSpace(req.query.id);
    res.status(StatusCodes.OK).json(space);
  } else {
    res.status(StatusCodes.METHOD_NOT_ALLOWED);
  }
}

export { fetchSpace };
