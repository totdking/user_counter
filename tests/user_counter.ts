import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { UserCounter } from "../target/types/user_counter";
import {Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL} from "@solana/web3.js";
import {assert} from "chai";

describe("user_counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const program = anchor.workspace.UserCounter as Program<UserCounter>;
  
  const ownerKp = Keypair.generate();
  const seed = [Buffer.from("user"), ownerKp.publicKey.toBuffer()];
  let user: PublicKey;

  before(async () => {
    console.log("put a little sol in admin for gas")
    const airdropAmount = anchor.web3.LAMPORTS_PER_SOL; // 0.002 SOL(you can edit how many lamports you desire here)
    const airdropTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.payer.publicKey,
        toPubkey: ownerKp.publicKey,
        lamports: airdropAmount,
      })
    );
    //sign and send the transaction
    const airdropSignature = await anchor.web3.sendAndConfirmTransaction(connection, airdropTx, [wallet.payer, ownerKp]);

    user = await PublicKey.findProgramAddressSync(seed, program.programId)[0];
    console.log("derive pda: " , user.toBase58());

    console.log("Airdrop Signature: ", airdropSignature, "\n \n owner balance is now : ", (await connection.getBalance(ownerKp.publicKey)/ LAMPORTS_PER_SOL).toString(), "SOL");
  })

  it("Is initialized!", async () => {
    // Add your test here.

    let tx = await program.methods
    .initialize()
    .accounts({
      owner: ownerKp.publicKey,
      userAccount: user,
    })
    .signers([ownerKp])
    .rpc({commitment: "confirmed"});

    console.log("Your transaction signature", tx);
    console.log("user pda : ", user.toBase58());
    console.log("owner account : ", ownerKp.publicKey.toBase58());
    // const txInfo = await provider.connection.getTransaction(tx, { commitment: "confirmed" });
    // console.log("Transaction Details:", txInfo); // Inspect the transaction details for errors

    const accState = await program.account.user.fetch(user, "confirmed");
    console.log ("counter: ", accState.counter.toString());
    console.log ("address: ", accState.owner.toBase58());
    console.log ("active: ", accState.active.valueOf());
    
  });

  it("activate!", async () => {
    let tx = await program.methods.activate()
    .accounts({
      owner: ownerKp.publicKey,
      userAccount: user,
    })
    .signers([ownerKp])
    .rpc({commitment: "confirmed"});

    const accState = await program.account.user.fetch(user);
    console.log ("counter: ", accState.counter.toString());
    console.log ("address: ", accState.owner.toBase58());
    console.log ("active: ", accState.active.valueOf());
  });

  //ADD TO 1
  it("add!", async () => {
    let tx = await program.methods.add()
    .accounts({
      owner: ownerKp.publicKey,
      userAccount: user,
    })
    .signers([ownerKp])
    .rpc({commitment: "confirmed"});

    const accState = await program.account.user.fetch(user);
    console.log ("counter: ", accState.counter.toString());
    console.log ("address: ", accState.owner.toBase58());
    console.log ("active: ", accState.active.valueOf());
  });

  //ADD TO 2
  it("add!", async () => {
    let tx = await program.methods.add()
    .accounts({
      owner: ownerKp.publicKey,
      userAccount: user,
    })
    .signers([ownerKp])
    .rpc({commitment: "confirmed"});

    const accState = await program.account.user.fetch(user);
    console.log ("counter: ", accState.counter.toString());
    console.log ("address: ", accState.owner.toBase58());
    console.log ("active: ", accState.active.valueOf());
  });

  // add to 3
  it("add!", async () => {
    let tx = await program.methods.add()
    .accounts({
      owner: ownerKp.publicKey,
      userAccount: user,
    })
    .signers([ownerKp])
    .rpc({commitment: "confirmed"});

    const accState = await program.account.user.fetch(user);
    console.log ("counter: ", accState.counter.toString());
    console.log ("address: ", accState.owner.toBase58());
    console.log ("active: ", accState.active.valueOf());
  });

  // minus
  it("substract!", async () => {
    let tx = await program.methods.sub()
    .accounts({
      owner: ownerKp.publicKey,
      userAccount: user,
    })
    .signers([ownerKp])
    .rpc({commitment: "confirmed"});

    const accState = await program.account.user.fetch(user);
    console.log ("counter: ", accState.counter.toString());
    console.log ("address: ", accState.owner.toBase58());
    console.log ("active: ", accState.active.valueOf());
  });

  //minus
  it("subtract!", async () => {
    let tx = await program.methods.sub()
    .accounts({
      owner: ownerKp.publicKey,
      userAccount: user,
    })
    .signers([ownerKp])
    .rpc({commitment: "confirmed"});

    const accState = await program.account.user.fetch(user);
    console.log ("counter: ", accState.counter.toString());
    console.log ("address: ", accState.owner.toBase58());
    console.log ("active: ", accState.active.valueOf());
  });


  it("close!", async () => {
    let tx = await program.methods.close()
    .accounts({
      owner: ownerKp.publicKey,
      userAccount: user,
    })
    .signers([ownerKp])
    .rpc({commitment: "confirmed", skipPreflight: true});

    // const txInfo = await provider.connection.getTransaction(tx, { commitment: "confirmed" });
    // console.log("Transaction Details:", txInfo); // Inspect the transaction details for errors

    const accState = await program.account.user.fetch(user,"confirmed");
    console.log ("counter: ", accState.counter.toString());
    console.log ("address: ", accState.owner.toBase58());
    console.log ("active: ", accState.active.valueOf());
  });

});
