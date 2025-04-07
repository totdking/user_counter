import React from 'react';
import { SystemProgram } from '@solana/web3.js';

const Counter = ({ program, counterPDA, counterData, setCounterData }) => {
  const handleAdd = async () => {
    if (program && counterPDA) {
      try {
        await program.rpc.add({
          accounts: {
            counter: counterPDA,
          },
        });
        const counterAccount = await program.account.counter.fetch(counterPDA);
        setCounterData(counterAccount.count.toNumber());
      } catch (error) {
        console.error("Error adding to counter:", error);
      }
    }
  };

  const handleSubtract = async () => {
    if (program && counterPDA) {
      try {
        await program.rpc.sub({
          accounts: {
            counter: counterPDA,
          },
        });
        const counterAccount = await program.account.counter.fetch(counterPDA);
        setCounterData(counterAccount.count.toNumber());
      } catch (error) {
        console.error("Error subtracting from counter:", error);
      }
    }
  };

  const handleClose = async () => {
    if (program && counterPDA) {
      try {
        await program.rpc.close({
          accounts: {
            counter: counterPDA,
          },
        });
        setCounterData(0);
      } catch (error) {
        console.error("Error closing counter:", error);
      }
    }
  };

  return (
    <div>
      <h2>Counter: {counterData}</h2>
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleSubtract}>Subtract</button>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Counter;
