'use client'

import * as anchor from '@coral-xyz/anchor';
import { getCreateTokenProgram, getCreateTokenProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'


export function useCreateTokenProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCreateTokenProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCreateTokenProgram(provider, programId), [provider, programId])

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createTokenMutation = useMutation({
    mutationFn: async (formData: { name: string; ticker: string; metadataFileUri: string; image: File | null }) => {
      const metadataUri = formData.metadataFileUri; 
      
      if (!provider.wallet) throw new Error("Wallet not connected");

      const tx = await program.methods
        .createToken(
          formData.name,
          formData.ticker,
          metadataUri,
          new anchor.BN(1_000_000 * 10 ** 9) // Adjust supply as needed
        )
        .accounts({
          signer: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      return tx;
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (error) => {
      console.error("Failed to create token:", error);
      // Optional: Add a toast for error notification
    }
  });

  return {
    program,
    programId,
    getProgramAccount,
    createTokenMutation,
  }
}
