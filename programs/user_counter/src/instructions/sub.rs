use anchor_lang::prelude::*;
use crate::error::Error;
use crate::state::User;

#[derive(Accounts)]
pub struct SubUser<'info>{
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [b"user".as_ref(), owner.key().as_ref()],
        bump,
        has_one = owner @ Error::NotSigner,
    )]
    pub user_account: Account<'info, User>,
    pub system_program: Program<'info, System>,
}

pub fn _sub_user(ctx: Context<SubUser>) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    require!(user_account.active == true, Error::NotActive);

    if user_account.counter == 0{
        return Err(Error::Underflow.into());
    }
    // user_account.counter.checked_sub(1).ok_or(Error::Underflow)?;
    user_account.counter -=1;
    
    Ok(())
}