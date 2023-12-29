import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { resolve } from "path";
import { getErrorMessage, getErrorName } from "./errorHandler";
import logging from "../config/logging.config";
import { User } from "../modules/interfaces/user.interface";
import config from "../config/config";
import { AuthenticationError } from "./errorTypes";
import { DecodedJWTObj } from "../modules/interfaces/authRequest.interface";
import { getOneUser } from "../modules/lib/db_query/user";

dotenv.config({ path: resolve(__dirname, "../../../../.env") });

/**
 * Variable to store namespace for logging.
 */
const NAMESPACE = "Auth/JWT-helpers";

/**
 * Function helps to sign the JWT signature for a specific user and returns the signed token.
 *
 * @param user A user object containing user data.
 * @param tokenType A string specifying the type of token to be signed. (Access or Refresh tokens)
 * @returns Either a string containing the signed token or an error should the signing fail.
 */
const signJWT = (user: User, tokenType: string): string | Error => {
  logging.info(
    NAMESPACE,
    `Attempting to sign ${tokenType} for ${user.name}...`
  );
  const tokenUsed =
    tokenType == "accessPrivateKey"
      ? config.server.token.accessPrivateKey
      : config.server.token.refreshPrivateKey;
  const privateKey = Buffer.from(tokenUsed, "base64").toString("ascii");

  try {
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      privateKey,
      {
        issuer: config.server.token.issuer,
        algorithm: "RS256",
        expiresIn: tokenType == "accessPrivateKey" ? "12h" : "1d", // TODO: change back the access token time to 15mins after testing
      }
    );
    logging.info(
      NAMESPACE,
      `Signing ${tokenType} for ${user.name} successful!`
    );
    return token;
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    throw new AuthenticationError(
      `Error while signing ${tokenType} jwt.`,
      "401"
    );
  }
};

/**
 * The function verifies if a token is valid or not.
 *
 * @param token A string containing the token that needs verification.
 * @param tokenType A string specifying the type of token to be verified. (Access or Refresh token)
 * @returns A decoded jwt payload containing the information about verification results.
 */
const verifyJWT = async (token: string, tokenType: string) => {
  logging.info(NAMESPACE, `Attempting to verify ${tokenType}...`);
  const tokenUsed =
    tokenType == "accessPublicKey"
      ? config.server.token.accessPublicKey
      : config.server.token.refreshPublicKey;
  const publicKey = Buffer.from(tokenUsed, "base64").toString("ascii");
  jwt.verify(token, publicKey, (error) => {
    if (error) {
      throw error;
    }
  });
  const decoded = jwt.decode(token) as DecodedJWTObj;
  const id = decoded.id;
  const user = await getOneUser(id);
  // have to multiply by 1000 because the issued at time is in seconds but getTime() returns in milliseconds
  if (user[0].updatedAt.getTime() > decoded.iat * 1000) {
    logging.info(NAMESPACE, "updated at time: ", user[0].updatedAt.getTime());
    logging.info(NAMESPACE, "decoded is time: ", decoded.iat * 1000);
    const e = new AuthenticationError(
      "User details updated, token invalidated.",
      "403"
    );
    throw e;
  }
  logging.info(NAMESPACE, "user obj: ", user);
  logging.info(NAMESPACE, `${tokenType} validated.`);
  return decoded;
};

export { signJWT, verifyJWT };
