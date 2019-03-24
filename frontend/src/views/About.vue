<template>
  <div class="about">
    <div>
      <select v-model="address" @change="getTransactionAddress(address)">
        <option v-for="(account, index) in Accounts" :key="index">{{account}}</option>
      </select>
    </div>
    <div class="content has-text-centered">
      <h1>Transaction history</h1>
      <b-table striped hover :items="transactionList" />
    </div>
  </div>
</template>

<script>
  import web3 from '@/web3.js'
  import artifact from '../contracts/OriginalToken.json'
  import BTable from 'bootstrap-vue/src/components/table/table'

  export default {
    components: {BTable},
    data () {
      return {
        tokenContract: null,
        Accounts: [],
        balance: 0,
        address: null,
        currentBlock: 0,
        transactionList: []
      }
    },
    beforeMount () {
      this.tokenContract = new web3.eth.Contract(artifact.abi, artifact.networks[5777].address)
      web3.eth.getAccounts().then(accounts => {
        this.Accounts = accounts
      })
      web3.eth.getBlockNumber().then(blockNumber => {
        this.currentBlock = blockNumber
      })
    },
    methods: {
      getTransactionAddress(address) {
        const transactionList = []
        web3.eth.getTransactionCount(address).then(transactionCount => {
          for (let i=this.currentBlock; i >= 0 && transactionCount > 0; --i) {
            web3.eth.getBlock(i, true).then(block => {
              if (block && block.transactions) {
                block.transactions.forEach(e => {
                  if (address == e.from && e.from != e.to) {
                    transactionList.push({'blockNumber':i,'from':e.from,'to':"0x" + e.input.substring(34,74),'amount':(parseInt(e.input.substring(75,138),16) / 1e18 * 100) / 100})
                    --transactionCount
                  }
                  if (address == e.to) {
                    transactionList.push({'blockNumber':i,'from':e.from,'to':e.to,'amount':e.value.toString(10)})
                  }
                })
              }
            })
          }
          this.transactionList = transactionList
        })
      }
    }
  }
</script>