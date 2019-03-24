<template>
  <div>
    <div>
      <h1>{{From.balanceEth}} ETH</h1>
      <h1>{{From.balanceMt}} MT</h1>
    </div>
    <form @submit.prevent="SendToken">
      TO:
      <div>
        <select v-model="To.address" @change="getBalanceMt(To)">
          <option v-for="(account, index) in Accounts" v-if="account.toLowerCase() != From.address" :key="index">{{account}}</option>
        </select>
      </div>
      <h1>{{To.balanceMt}} MT</h1>
      <div>
        <input type="number" v-model="Value"/>MT
        <input type="submit" value="Send"/>
      </div>
    </form>
  </div>
</template>

<script>
  import web3 from '@/web3.js'
  import artifact from '../contracts/OriginalToken.json'

  export default {
    data () {
      return {
        From: {
          address: null,
          balanceEth: 0,
          balanceMt: 0
        },
        To: {
          address: null,
          balanceMt: 0
        },
        Accounts: [],
        Value: 0,
        tokenContract: null,
        currentBlock: 0,
        transactionCount: 0,
      }
    },
    beforeMount () {
      this.tokenContract = new web3.eth.Contract(artifact.abi, artifact.networks[5777].address)
      web3.eth.getAccounts().then(accounts => {
        this.Accounts = accounts
      })
      web3.eth.getCoinbase().then(address => {
        this.From.address = address
        web3.eth.getBalance(address).then(balance => {
          this.From.balanceEth = Math.round(balance / 1e18 * 100) / 100
        })
        this.tokenContract.methods.balanceOf(address).call({from: artifact.networks[5777].address}, (error, balance) => {
          this.From.balanceMt = Math.round(balance / 1e18 * 100) / 100
        })
      })
    },
    methods: {
      getBalanceMt(account) {
        this.tokenContract.methods.balanceOf(account.address).call({from: artifact.networks[5777].address}, (error, balance) => {
          account.balanceMt = Math.round(balance / 1e18 * 100) / 100
        })
      },
      SendToken() {
        this.tokenContract.methods.transfer(this.To.address, web3.utils.toWei(this.Value))
          .send({
            from: this.From.address,
            gasPrice: 500000,
            gas: 300000
          }, (error, transactionHash) => {
            this.getBalanceMt(this.To)
            this.getBalanceMt(this.From)
          })
      }
    }
  }
</script>
