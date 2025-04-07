use anchor_lang::prelude::*;
use crate::state::User;

#[derive(Accounts)]
pub struct InitializeUser<'info>{
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init, 
        space = 8 + User::INIT_SPACE,
        payer = owner,
        seeds = [b"user".as_ref(), owner.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, User>,
    pub system_program: Program<'info, System>,
}
#[event]
pub struct Event{
    pub owner: Pubkey,
    pub counter: u64,
    pub active: bool,
    pub timestamp: u64,
}
pub fn _initialize(ctx: Context<InitializeUser>) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    let recent = Clock::get()?.unix_timestamp as u64;
    
    user_account.owner = *ctx.accounts.owner.key;
    user_account.counter = 0;
    user_account.active = false;

    emit!(
        Event{
            owner: user_account.owner,
            counter: user_account.counter,
            active: user_account.active,
            timestamp: recent,
        }
    );

    Ok(())
}