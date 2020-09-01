import { PrivateKey } from "./types";
import { SigningAuthority } from "./Constructor";

// extract the private keys if that's the style used, or return undefined
export const getPrivateKeys = (
  signingAuthority: SigningAuthority
): PrivateKey[] | undefined => {
  if ("privateKeys" in signingAuthority) {
    return signingAuthority.privateKeys;
  } else if ("privateKey" in signingAuthority && signingAuthority.privateKey) {
    return [signingAuthority.privateKey];
  }
};
