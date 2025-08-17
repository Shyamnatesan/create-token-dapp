import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { CreateToken } from '../target/types/create_token'
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';




describe('creating token test suite', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.CreateToken as Program<CreateToken>

  it('should create token', async () => {


    const tx = await program.methods
      .createToken(
        "Johny",              // name
        "JON",                        // symbol
         "https://raw.githubusercontent.com/Shyamnatesan/metadata/refs/heads/main/metadata.json",    // uri
        new anchor.BN(1_000_000 * 10 ** 9)      // initial supply
      )
      .accounts({
        signer: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .rpc()

    console.log("✅ Token created, tx:", tx);   
  })
})
