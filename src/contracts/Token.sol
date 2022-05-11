pragma solidity ^0.5.16;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
	using SafeMath for uint;

	string public name = "ADD Token";
	string public symbol = "ADD";
	uint256 public decimals = 18;
	uint256 public totalSupply;

	// Track balances
	mapping(address => uint256) public balanceOf;
	
	// Events
	event Transfer(address indexed from, address indexed to, uint256 value);

	constructor() public{
		totalSupply = 1000000 * (10 ** decimals);
		// msg.sender is person who deployed the smart contract
		balanceOf[msg.sender] = totalSupply;
	}

	// sending tokens to someone
	function transfer(address _to, uint256 _value) public returns (bool success){
		// sending to non existent address
		require(_to != address(0));	
		// if require "require(false)" everything beneath it will not execute, but we get an EXception 'VM Exception while processing transaction: revert'
		require(balanceOf[msg.sender] >= _value);
		// decrease senders balance first
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(msg.sender, _to, _value);
		return true;
	}
}