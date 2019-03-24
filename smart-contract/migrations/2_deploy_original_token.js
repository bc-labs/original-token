const OriginalToken = artifacts.require("OriginalToken");

module.exports = function(deployer, network, accounts) {
  // Use deployer to state migration tasks.
  const name = "RyusukeeeeToken";
  const symbol = "RYT";
  const decimals = 18;
  const initSupply = web3.utils.toBN(100*(10**decimals));

  return deployer.then(()=>{
    return deployer.deploy(
      OriginalToken,
      name,
      symbol,
      decimals,
      initSupply
    );
  });
};
