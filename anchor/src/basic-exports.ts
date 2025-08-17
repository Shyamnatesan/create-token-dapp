// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CreateTokenIDL from '../target/idl/create_token.json';
import type { CreateToken } from '../target/types/create_token'

// Re-export the generated IDL and type
export { CreateToken, CreateTokenIDL }

// The programId is imported from the program IDL.
export const CREATE_TOKEN_PROGRAM_ID = new PublicKey(CreateTokenIDL.address)

export function getCreateTokenProgram(provider: AnchorProvider, address?: PublicKey): Program<CreateToken> {
  return new Program({ ...CreateTokenIDL, address: address ? address.toBase58() : CreateTokenIDL.address } as CreateToken, provider)
}


export function getCreateTokenProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      return new PublicKey('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'mainnet-beta':
    default:
      return CREATE_TOKEN_PROGRAM_ID
  }
}
