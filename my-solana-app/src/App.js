import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import idl from './idl.json';
import Counter from './components/Counter';
import './App.css';
import './index.css';

const { SystemProgram } = web3;

const network = "https://api.devnet.solana.com";

const wallets = [
  new PhantomWalletAdapter(),
];

// Helper function to get the program
const getProgram = (provider) => {
  if (!idl || !idl.metadata || !idl.metadata.address) {
    console.error("Invalid idl.json: missing metadata or address");
    return null;
  }
  let programID;
  try {
    programID = new PublicKey(idl.metadata.address);
  } catch (error) {
    console.error("Error creating PublicKey from idl.metadata.address:", error);
    return null;
  }
  return new Program(idl, programID, provider);
};

// Helper function to get the counter PDA
const getCounterPDA = async (program, userPublicKey) => {
  if (!program || !userPublicKey) return null;
  const [counterPDA, _] = await PublicKey.findProgramAddress(
    [Buffer.from("counter"), userPublicKey.toBuffer()],
    program.programId
  );
  return counterPDA;
};

// Helper function to fetch counter data
const fetchCounterData = async (program, counterPDA) => {
  if (!program || !counterPDA) return null;
  try {
    const counterAccount = await program.account.counter.fetch(counterPDA);
    return counterAccount.count.toNumber();
  } catch (error) {
    console.error("Error fetching counter data:", error);
    return 0;
  }
};

const App = () => {
  const wallet = useWallet();
  const [provider, setProvider] = useState(null);
  const [counterPDA, setCounterPDA] = useState(null);
  const [counterData, setCounterData] = useState(null);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    console.log("wallet.connected:", wallet.connected);
    console.log("wallet:", wallet);
    if (wallet.connected) {
      const connection = new Connection(network, "processed");
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });
      setProvider(provider);
      const newProgram = getProgram(provider);
      setProgram(newProgram);
    }
  }, [wallet.connected]);

  useEffect(() => {
    const findPDA = async () => {
      const newCounterPDA = await getCounterPDA(program, wallet.publicKey);
      setCounterPDA(newCounterPDA);
    };
    findPDA();
  }, [program, wallet.publicKey]);

  useEffect(() => {
    const fetchData = async () => {
      const newCounterData = await fetchCounterData(program, counterPDA);
      setCounterData(newCounterData);
    };
    fetchData();
  }, [program, counterPDA]);

  const handleActivate = async () => {
    if (program && counterPDA) {
      try {
        await program.rpc.activate({
          accounts: {
            counter: counterPDA,
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        });
        console.log("Program activated successfully!");
      } catch (error) {
        console.error("Error activating program:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Solana Counter DApp</h1>
      <WalletMultiButton />
      {wallet.connected ? (
        <div>
          <button onClick={handleActivate}>Activate</button>
          {counterData !== null && (
            <Counter
              program={program}
              counterPDA={counterPDA}
              counterData={counterData}
              setCounterData={setCounterData}
            />
          )}
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
};

const WrappedApp = () => {
  return (
    <WalletProvider wallets={wallets} autoConnect>
      <App />
    </WalletProvider>
  );
};

export default WrappedApp;
