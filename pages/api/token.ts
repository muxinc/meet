import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const { MUX_SIGNING_KEY, MUX_PRIVATE_KEY } = process.env;

type ResponseData = {
  spaceJWT: string;
};

function signJWT(spaceId: string, participantId: string): ResponseData {
  const JWT = jwt.sign(
    {
      kid: MUX_SIGNING_KEY ?? "",
      aud: "rt",
      sub: spaceId,
      participant_id: participantId,
    },
    Buffer.from(MUX_PRIVATE_KEY ?? "", "base64"),
    { algorithm: "RS256", expiresIn: "1h" }
  );
  return { spaceJWT: JWT };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const {
    body: { spaceId, participantId },
    method,
  } = req;
  if (method === "POST") {
    res
      .status(StatusCodes.OK)
      .json(signJWT(spaceId as string, participantId as string));
  } else {
    res.status(StatusCodes.METHOD_NOT_ALLOWED);
  }
}
