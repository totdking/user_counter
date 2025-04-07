use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct User{
    pub owner: Pubkey,
    pub counter: u64,
    pub active: bool,
}
#[event]
pub struct Event{
    pub owner: Pubkey,
    pub counter: u64,
    pub active: bool,
    pub timestamp: u64,
}