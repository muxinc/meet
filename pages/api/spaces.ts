import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { TEMPORARY_SPACE_PASSTHROUGH } from "lib/constants";
import { NextApiRequest, NextApiResponse } from "next";

import { muxClient } from "../../server-lib/services";

type Space = {
  id: string;
  type: string;
  created_at: string;
  status: "active" | "idle";
  passthrough?: string;
};

const fetchSpaces = async (): Promise<Space[]> => {
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

const createSpace = async () => {
  let response;

  try {
    response = await muxClient.post(`/video/v1/spaces`, {
      passthrough: TEMPORARY_SPACE_PASSTHROUGH,
    });
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
  if (req.method === "POST") {
    const activeSpaceLimit = process.env.ACTIVE_SPACE_LIMIT;
    if (activeSpaceLimit) {
      const limit = parseInt(activeSpaceLimit, 10);
      const spaces = await fetchSpaces();
      const activeSpaces = spaces.filter(({ status }) => status === "active");
      if (activeSpaces.length >= limit) {
        return res.status(StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE).end();
      }
    }

    try {
      const space = await createSpace();
      res.status(StatusCodes.OK).json(space);
    } catch (error) {
      const message = (error as Error).message as string;
      if (message.includes("401")) {
        res.status(StatusCodes.UNAUTHORIZED).end();
      }
    }
  } else {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}
