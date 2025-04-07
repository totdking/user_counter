use anchor_lang::prelude::*;
use crate::state::User;
use crate::error::Error;

#[derive(Accounts)]
pub struct CloseUser<'info>{
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        has_one = owner,
        seeds = [b"user".as_ref(), owner.key().as_ref()],
        bump,
        mut,
        close = owner
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

pub fn _close(ctx: Context<CloseUser>) -> Result<()>{
    let user_account = &mut ctx.accounts.user_account;
    require!(user_account.active == true, Error::NotActive);
    let recent = Clock::get()?.unix_timestamp as u64;

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