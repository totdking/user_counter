use anchor_lang::prelude::*;

#[error_code]
pub enum Error{
    #[msg("Not signer")]
    NotSigner,
    #[msg("Account is not set active")]
    NotActive,
    #[msg("Account is already active")]
    ActiveAlready,
    #[msg("Account is closed")]
    Closed,
    #[msg("Beyond the limit of counter")]
    Overflow,
    #[msg("You cannot have negative as counter")]
    Underflow,
}