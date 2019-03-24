const OriginalToken = artifacts.require("OriginalToken");

contract('OriginalToken', function(accounts) {
  it("should assert true", function(done) {
    var original_token_test = OriginalToken.deployed();
    assert.isTrue(true);
    done();
  });

  it("...should put 100RYT in the first account.", async () => {
    const original_token = await OriginalToken.deployed();

    let balance = await original_token.balanceOf(accounts[0]);
    balance = web3.utils.fromWei(balance, "ether");

    assert.equal(balance, 100, "First account don't have 100 RYT.");
  });
});
