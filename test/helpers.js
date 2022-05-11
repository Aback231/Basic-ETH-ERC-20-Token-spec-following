export const EVM_REVERT = 'VM Exception while processing transaction: revert'

export const tokens = (n) => {
	// convert to n decimal places to return big number for our total supply, to be more readable
	return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
}