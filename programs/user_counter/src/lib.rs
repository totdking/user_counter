use anchor_lang::prelude::*;

pub mod error;
pub mod state;
pub mod instructions;

use instructions::{
    initialize::*, 
    activate:: *, 
    add::*, 
    sub::*, 
    close::*, 
};

declare_id!("2JzRQy8oxEXnp4K63FqVTBaqESazr89fuvvkoMEADMpg");

#[program]
pub mod user_counter {

    use super::*;

    pub fn initialize(ctx: Context<InitializeUser>) -> Result<()> {
        _initialize(ctx)
    }

    pub fn activate(ctx: Context<Activate>) -> Result<()> {
        _activate(ctx)
    }
    pub fn add(ctx: Context<AddUser>) -> Result<()> {
        _add_user(ctx)
    }
    pub fn sub(ctx: Context<SubUser>) -> Result<()> {
        _sub_user(ctx)
    }
    pub fn close(ctx: Context<CloseUser>) -> Result<()> {
        _close(ctx)
    }
}
