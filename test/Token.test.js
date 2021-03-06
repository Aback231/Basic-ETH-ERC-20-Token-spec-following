import { tokens, EVM_REVERT } from './helpers'

const Token = artifacts.require('./Token')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', ([deployer, receiver])=> {

	const name = 'ADD Token'
	const symbol = "ADD"
	const decimals = "18"
	const totalSupply = tokens(1000000).toString()
 	let token

	// grab token (beforeEach is moca lib) so we don't grab it each time
	beforeEach(async () => {
		token = await Token.new()
	})

	describe('deployment', ()=>{
		it('tracks the name', async ()=> {
			// REad TOken name and check it
			const result = await token.name()
			result.should.equal(name)
		})
		it('tracks the symbol', async ()=> {
			const result = await token.symbol()
			result.should.equal(symbol)
		})

		it('tracks the decimals', async ()=> {
			const result = await token.decimals()
			result.toString().should.equal(decimals)
		})

		it('tracks the total supply', async ()=> {	
			const result = await token.totalSupply()
			result.toString().should.equal(totalSupply.toString())
		})

		it('assigns the total supply to the deployer', async ()=> {
			const result = await token.balanceOf(deployer)
			result.toString().should.equal(totalSupply.toString())
		})
	})

	describe('sending tokens', ()=>{
		let amount
		let result

		describe('success', async()=>{

			// transfer
		beforeEach(async ()=> {
			amount = tokens(100)
			result = await token.transfer(receiver, amount, { from: deployer })
		})

		it('transfers token balances', async()=>{
			let balanceOf

			// before transfer
			balanceOf = await token.balanceOf(deployer)
			console.log("deployer balance", balanceOf.toString())
			balanceOf = await token.balanceOf(receiver)
			console.log("receiver balance", balanceOf.toString())
			
			// after transfer
			balanceOf = await token.balanceOf(deployer)
			balanceOf.toString().should.equal(tokens(999900).toString())
			console.log("deployer balance after transfer", balanceOf.toString())
			balanceOf = await token.balanceOf(receiver)
			balanceOf.toString().should.equal(tokens(100).toString())
			console.log("receiver balance after transfer", balanceOf.toString())
		})	

		it('emits a transfer event', async()=> {
			const log = result.logs[0]
			log.event.should.equal('Transfer')
			const event = log.args
			event.from.toString().should.equal(deployer, 'from is correct')
			event.to.should.equal(receiver, 'to is correct')
			event.value.toString().should.equal(amount.toString(), 'amount is correct')
		})

		})

		describe('failure', async()=>{
			it('rejects insufficient bakances', async()=> {
				let invalidAmount

				invalidAmount = tokens(100000000) // 100 mil - greater than total supply
				await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);

				invalidAmount = tokens(10) // recipient has no tokens
				await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
			})

			it('rejects invalid recipients', async() => {
				await token.transfer(0x0, amount, { from: deployer }).should.be.rejected;
			})
		})

		
	})
})