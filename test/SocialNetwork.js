const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
	let socialNetwork

	before(async () => {
		socialNetwork = await SocialNetwork.deployed() 
	})

	describe('deployment', async () => {
		it('deploys succesfully', async () => {
			const address = socialNetwork.address
			assert.notEqual(address, "0x0")
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})

		it('has a name', async () => {
			const name = await socialNetwork.name()
			assert.equal(name, 'Dapp University Social Network')
		})
	})

	describe('posts', async () => {
		let result, postCount;

		before(async () => {
			result = await socialNetwork.createPost('this is my first post', {from: author})
			postCount = await socialNetwork.postCount()
		})

		it('creates posts', async () => {
			assert.equal(postCount, 1)
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), postCount.toNumber())
			assert.equal(event.content, 'this is my first post')
			assert.equal(event.tipAmount.toNumber(), 0)
			assert.equal(event.author, author)
		})

		it('creating post with empty content should fail', async () => {
			result = await socialNetwork.createPost('', {from: author}).should.be.rejected;
		})

		it('lists posts', async () => {
			const post = await socialNetwork.posts(postCount)
			assert.equal(post.id.toNumber(), postCount.toNumber())
			assert.equal(post.content, 'this is my first post')
			assert.equal(post.tipAmount.toNumber(), 0)
			assert.equal(post.author, author)
		})

		it('allows users to tip posts', async () => {
			const balanceBeforeTip = new web3.utils.BN(await web3.eth.getBalance(author))

			const tipAmount = web3.utils.toWei('1', 'ether')
			const result = await socialNetwork.tipPost(postCount, {from: tipper, value: tipAmount })
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), postCount)
			assert.equal(event.tipAmount, web3.utils.toWei('1', 'ether'))
			assert.equal(event.author, author)

			const balanceAfterTip = new web3.utils.BN(await web3.eth.getBalance(author))
			const calculatedNewBalance = new web3.utils.BN(balanceBeforeTip).add(new web3.utils.BN(tipAmount))
			assert.equal(calculatedNewBalance.toString(), balanceAfterTip.toString())
		})

		it('tries to tip a post that does not exist', async () => {
			const tipAmount = web3.utils.toWei('1', 'ether')
			const result = await socialNetwork.tipPost(36, {from: tipper, value: tipAmount }).should.be.rejected
		})
	})
})