import Mux from "@mux/mux-node";
import { StatusCodes } from "http-status-codes";
import { TEMPORARY_SPACE_PASSTHROUGH } from "lib/constants";
import { NextApiRequest, NextApiResponse } from "next";

import { muxClient } from "server-lib/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers = req.headers;
  const muxSignature = headers["mux-signature"] as string;
  const secret = process.env.WEBHOOK_SECRET;

  if (!secret) {
    console.error("WEBHOOK_SECRET not specified");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }

  if (
    req.method === "POST" &&
    Mux.Webhooks.verifyHeader(JSON.stringify(req.body), muxSignature, secret)
  ) {
    const { body } = req;

    if (
      body.type === "video.space.idle" &&
      body.data.passthrough.startsWith(TEMPORARY_SPACE_PASSTHROUGH)
    ) {
      try {
        await muxClient.delete(`/video/v1/spaces/${body.data.id}`);
        return res.status(StatusCodes.OK).end();
      } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
    }

    return res.status(StatusCodes.OK).end();
  }

  return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
}
