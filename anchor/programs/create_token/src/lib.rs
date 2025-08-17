use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3,
        mpl_token_metadata::types::{Creator, DataV2},
        sign_metadata, CreateMetadataAccountsV3, Metadata, SignMetadata,
    },
    token_interface::{mint_to, Mint, MintTo, TokenAccount, TokenInterface},
};

declare_id!("Ad6HcceZRDnvSTcksUDrUEdnxuuF8HQDvr5Ru1YZscMN");

#[program]
pub mod create_token {

    use super::*;

    pub fn create_token(
        ctx: Context<InitializeToken>,
        name: String,
        symbol: String,
        uri: String,
        amount: u64,
    ) -> Result<()> {
        mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.signer.to_account_info(),
                },
            ),
            amount,
        )?;
        let cpi_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            mint_authority: ctx.accounts.signer.to_account_info(),
            payer: ctx.accounts.signer.to_account_info(),
            update_authority: ctx.accounts.signer.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };

        let data = DataV2 {
            name: name,
            symbol: symbol,
            uri: uri,
            seller_fee_basis_points: 0,
            creators: Some(vec![Creator {
                address: ctx.accounts.signer.key(),
                verified: false,
                share: 100,
            }]),
            collection: None,
            uses: None,
        };

        msg!("Creating metadata account");
        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.token_metadata_program.to_account_info(),
                cpi_accounts,
            ),
            data,
            true,
            true,
            None,
        )?;

        sign_metadata(CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            SignMetadata {
                creator: ctx.accounts.signer.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
            },
        ))?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        mint::decimals = 6,
        mint::authority = signer,
        mint::freeze_authority = signer,
        seeds = [b"johny_mint", signer.key().as_ref()],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program,

    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            mint.key().as_ref(),
        ],
        bump,
        seeds::program = token_metadata_program.key() 
    )]
    /// CHECK: This account is checked by the above smart contract
    pub metadata: UncheckedAccount<'info>,

    pub token_metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    pub token_program: Interface<'info, TokenInterface>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}
