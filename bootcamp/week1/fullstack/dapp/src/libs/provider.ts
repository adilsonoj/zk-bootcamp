import { createPublicClient, http } from "viem";
import { anvil } from "viem/chains";

export const provider = createPublicClient({
  chain: anvil,
  transport: http(),
});
