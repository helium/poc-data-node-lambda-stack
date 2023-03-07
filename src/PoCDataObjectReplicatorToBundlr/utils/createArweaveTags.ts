import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { decodeUTF8 } from "tweetnacl-util";
import * as bs58 from "bs58";

const { SOLANA_KEY } = process.env;

export const createArweaveTags = ({
  fileType,
  filename,
  isoDateComponents,
  MD5
}: {
  fileType: string;
  filename: string;
  isoDateComponents: string[];
  MD5: string;
}) => {
  const [year, month, day] = isoDateComponents;

  const keypair = Keypair.fromSecretKey(
    bs58.decode(SOLANA_KEY || "")
  );
  const message = MD5;
  const messageBytes = decodeUTF8(message);

  const signatureUint8 = nacl.sign.detached(messageBytes, keypair.secretKey);
  const signatureB64 = Buffer.from(signatureUint8).toString('base64');

  return [
    { name: "year", value: year },
    { name: "month", value: month },
    { name: "day", value: day },
    { name: "md5", value: MD5 },
    { name: "signature", value: signatureB64 },
    { name: "filename", value: filename },
    { name: "file-type", value: fileType },
    { name: "application", value: "helium-poc" }
  ]
};