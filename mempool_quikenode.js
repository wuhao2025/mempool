require('dotenv').config()
var sd = require('silly-datetime');

const dst = process.env.DST
const fs = require("fs")
const router_address = process.env.UNISWAP_ROUTER_ADDRESS
const router_abi = fs.readFileSync(dst+'/build/contracts/uniswap_router_v3.json');
const base_abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" } ]//process.env.BASE_ABI
const erc20_json = fs.readFileSync(dst+'/build/json/erc20_addr.json');
const price_json = fs.readFileSync(dst+'/build/json/price.json');
const erc20 = JSON.parse(erc20_json.toString());
const price = JSON.parse(price_json.toString());

var Web3 = require("web3");
var urlwss = ""
var url = ""
const InputDataDecoder = require('ethereum-input-data-decoder')
const axios = require("axios");




//const test_abi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"}],"internalType":"struct ISwapRouter.ExactInputParams","name":"params","type":"tuple"}],"name":"exactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct ISwapRouter.ExactInputSingleParams","name":"params","type":"tuple"}],"name":"exactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct ISwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct ISwapRouter.ExactOutputSingleParams","name":"params","type":"tuple"}],"name":"exactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"refundETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowed","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowedIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"sweepToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"feeBips","type":"uint256"},{"internalType":"address","name":"feeRecipient","type":"address"}],"name":"sweepTokenWithFee","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"int256","name":"amount0Delta","type":"int256"},{"internalType":"int256","name":"amount1Delta","type":"int256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"uniswapV3SwapCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"unwrapWETH9","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"feeBips","type":"uint256"},{"internalType":"address","name":"feeRecipient","type":"address"}],"name":"unwrapWETH9WithFee","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
//const decoder = new InputDataDecoder(test_abi);




var options = {
    timeout: 30000,
    clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
        keepalive:true,
        keepaliveInterval:-1
    },
    reconnect: {
        auto: true,
        delay: 1000,
        maxAttempts: 10,
        onTimeout: false,
    },
};


var uniswapInput = {
    "0x414bf389":["exactInputSingle", ['address','address','uint24','address','uint256','uint256','uint256','uint160']],
    "0xdb3e2198":["exactOutputSingle",['address', 'address', 'uint24', 'address', 'uint256', 'uint256', 'uint256','uint160']],
    "0xac9650d8":["multicall",[]],
    "0xc04b8d59":["exactInput", ['bytes', 'address', 'uint256', 'uint256', 'uint256' ]],
    "0x18cbafe5":["swapExactTokensForETH", ['uint256', 'uint256', 'address[]', 'address', 'uint25']],
    "0x791ac947":["swapExactTokensForETHSupportingFeeOnTransferTokens", ['uint256', 'uint256', 'address[]', 'address', 'uint25']],
    "0x8803dbee":["swapTokensForExactTokens", ['uint256','uint256','address[]','address','uint25']],
    "0x38ed1739":["swapExactTokensForTokens", [ 'uint256', 'uint256', 'address[]', 'address', 'uint25' ]],
    "0xb6f9de95":["swapExactETHForTokensSupportingFeeOnTransferTokens", [ 'uint256', 'address[]', 'address', 'uint25']],
    "0xfb3bdb41":["swapETHForExactTokens", ['uint256', 'address[]', 'address', 'uint25']],
    "0x7ff36ab5":["swapExactETHForTokens", ['uint256', 'address[]', 'address', 'uint25']]






};

var web3ws = new Web3(new Web3.providers.WebsocketProvider(urlwss, options));
var web3 = new Web3(new Web3.providers.HttpProvider(url));

//'145000000000000000',
//web3.eth.getBlock('pending').then(console.log)

//web3.eth.getTransaction('0x7cc2c659d309205b359977101e1a1e047af1157038605501eed7b5a023bcd47d').then(console.log)


const subscription = web3ws.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});

async function decode(abi, para) {
    readableinfo = await web3.eth.abi.decodeParameters(abi, para)
    return readableinfo
}

async function selfDecode(code, info) {
    if (code == '0x791ac947' || code == "0x18cbafe5" || code == '0x8803dbee' || code == "0x38ed1739") {
        amountIn = await web3.eth.abi.decodeParameter('uint256', info.slice(10,74)) // amountIn
        //console.log(parseInt(ttt.slice(74,138),16)) // amountOutmin
        recipient = info.slice(226,266) // recipient
        from = '0x'+info.slice(418, 458)
        path_amt = parseInt(info.slice(330,394), 16)
        if (path_amt == 2) {

            to = '0x' + info.slice(482, 522)
        } else if (path_amt == 3) {

            to = '0x' + info.slice(546, 586)
        }

        //var decodedData=new Array(amountIn, recipient, from, to);
        return [amountIn, recipient, from, to]
    } else if (code == '0x7ff36ab5' || code == '0xfb3bdb41' || code == "0xb6f9de95") {
        amountIn = await web3.eth.abi.decodeParameter('uint256', info.slice(10,74))
        recipient = info.slice(162,202)
        from = '0x' + info.slice(354, 394)
        path_amt = parseInt(info.slice(266,330), 16)
        if (path_amt == 2){

            to = '0x' + info.slice(418, 458)
        } else if (path_amt == 3) {
            to = '0x' + info.slice(482, 522)
        }

        return [amountIn, recipient, from, to]
    } else {
        return 0
    }
}
//result = selfDecode('0x791ac947', '0x791ac9470000000000000000000000000000000000000000000000000000000001ecab33000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000a00000000000000000000000005b0b956ecaae0987ed94b8802c38c6eac981e4650000000000000000000000000000000000000000000000000000000063b7904d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000396b284be3c2351b4fa4ab70f08ef4deedd513e3000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
//console.log(result[0])
//console.log(result[1])


var init = function () {
    subscription.on("data", (txHash) => {
        setTimeout(async () => {
            try {
                let tx = await web3ws.eth.getTransaction(txHash);


                //let tx_ = JSON.stringify(tx)
                //console.log(tx)
                //console.log(tx.to.toLowerCase())

                //if (JSON.stringify(tx)  != '{}') {
                    if (tx != null && typeof tx == "object" && tx.to) {
                        const tran_fee = await web3.utils.fromWei(tx.gasPrice, 'gwei')
                        if (tx.to.toLowerCase() == '0x7a250d5630b4cf539739df2c5dacb4c659f2488d' && tran_fee > 2) {
                            //console.log(tx.hash)
                            //console.log(tx)
                            result = await selfDecode(tx.input.slice(0, 10), tx.input)
                            if (result == 0) {
                                console.log(tx.input, tx.hash)
                            }
                            if (uniswapInput.hasOwnProperty(tx.input.slice(0, 10))) {
                                //console.log(tx.input.slice(0, 10))
                                //console.log(tx.input, tx.hash)

                                //console.log(uniswapInput[tx.input.slice(0,10)][1])
                                //console.log('0x'+tx.input.slice(10,tx.input.length))
                                //decode(uniswapInput[tx.input.slice(0,10)][1])
                                if (tx.input.slice(0, 10) == "0x791ac947" || tx.input.slice(0, 10) == "0x18cbafe5"  || tx.input.slice(0, 10) == '0x8803dbee' || tx.input.slice(0,10) == "0x38ed1739") {

                                    //from = '0X' + result[2]
                                    //to = result[3]
                                    //amount = await web3.utils.fromWei(result[0], 'ether')
                                    //console.log(from, to, amount)
                                    var amount = await web3.utils.fromWei(result[0], 'ether')

                                    //console.log(result)
                                    //console.log(amount)
                                    if (erc20.hasOwnProperty(result[2])) {
                                        var from = erc20[result[2]]
                                        /*
                                        if (from == 'tether'){
                                            //amount = amount*10**12
                                            //var value = amount
                                        } else {
                                            //amount = await web3.utils.fromWei(result[0], 'ether')

                                            var value = price[result[2]]*amount
                                        }

                                         */
                                    } else {
                                        var from = result[2]
                                        var value = 'missing'
                                    }

                                    if (erc20.hasOwnProperty(result[3])) {
                                        var to = erc20[result[3]]

                                    } else {
                                        var to = result[2]

                                    }


                                    console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') , from,  "-->" ,to , tx.hash)


                                } else if (tx.input.slice(0, 10) == "0x7ff36ab5" || tx.input.slice(0, 10) == '0xfb3bdb41' || tx.input.slice(0, 10) == "0xb6f9de95") {
                                    //to = '0X' + result[2]
                                    //console.log(result)
                                    var amount = await web3.utils.fromWei(result[0], 'ether')
                                    //console.log(amount)
                                    var value = 0

                                    if (erc20.hasOwnProperty(result[3])) {
                                        var to = erc20[result[3]]
                                        /*
                                        if (to == 'tether'){
                                            amount = amount * 10**12
                                            value = amount
                                        } else {
                                            //amount = await web3.utils.fromWei(result[0], 'ether')
                                            value = price[to]*amount
                                        }

                                         */
                                    } else {
                                        var to = result[3]
                                        var value = 'missing'
                                    }
                                    console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') ,"WETH --> " , to, "hash is:", tx.hash)
                                }
                            }
                            //console.log(typeof tx)
                            //console.log(tx.input)
                            //var data = await abiDecoder.decodeMethod(tx.input)
                            //console.log(typeof data)
                            //console.log(data)
                        } else if (tx.to.toLowerCase() == '0xe592427a0aece92de3edee1f18e0157c05861564' && tran_fee > 2 && 0) {


                                if (uniswapInput.hasOwnProperty(tx.input.slice(0, 10))) {
                                    //console.log(tx.input.slice(0, 10))
                                    //console.log(tx.input)
                                    //console.log(uniswapInput[tx.input.slice(0,10)][1])
                                    //console.log('0x'+tx.input.slice(10,tx.input.length))
                                    //decode(uniswapInput[tx.input.slice(0,10)][1])
                                    if (tx.input.slice(0, 10) == "0x414bf389" || tx.input.slice(0, 10) == "0xdb3e2198") {
                                        //console.log(tx.value)
                                        let value = await web3ws.utils.fromWei(tx.value)
                                        var message = await decode(uniswapInput[tx.input.slice(0, 10)][1], '0x' + tx.input.slice(10, tx.input.length))
                                        //console.log(message)
                                        var trans = await web3ws.utils.fromWei(message['5'])
                                        if (erc20.hasOwnProperty(message['0'].toUpperCase())) {
                                            var from = erc20[message['0'].toUpperCase()]
                                        } else {
                                            var from = message['0'].toUpperCase()
                                        }

                                        if (erc20.hasOwnProperty(message['1'].toUpperCase())) {
                                            var to = erc20[message['1'].toUpperCase()]
                                        } else {
                                            var to = message['1'].toUpperCase()
                                        }
                                        if (value >= 0.0)
                                            console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') ,from, "-->", to, message['2'],"value is: ", trans, "eth. hash is ", tx.hash)

                                        //contract_one = new web3.eth.Contract(base_abi, message['0'])
                                        //contract_two = new web3.eth.Contract(base_abi, message['1'])
                                        //name_one = await contract_one.methods.symbol().call()
                                        //await contract_two.methods.symbol().call().then(console.log)
                                        //console.log(name_two)
                                    } else if (tx.input.slice(0, 10) == "0xc04b8d59"){
                                        //console.log(tx)
                                        //a=1
                                        //console.log(ttt.slice(162,202))
                                        //console.log(parseInt(ttt.slice(202,266),16))
                                        //console.log(parseInt(ttt.slice(266,330),16))
                                        //console.log(parseInt(ttt.slice(330,394),16))

//co
                                        var first = '0X'+tx.input.slice(458,498).toString().toUpperCase()
                                        //console.log(parseInt(ttt.slice(498,504),16))
                                        var second = '0X'+tx.input.slice(504,544).toString().toUpperCase()
                                        //console.log(parseInt(ttt.slice(544,550),16))
                                        var third = '0X'+tx.input.slice(550,590).toString().toUpperCase()
                                        //console.log(parseInt(tx.input.slice(266,330),16))
                                        //console.log(tx.input)
                                        //console.log(tx.hash)
                                        var trans = await web3ws.utils.fromWei(web3.eth.abi.decodeParameter('uint256',tx.input.slice(266,330)))
                                        //console.log(trans)
                                        if (erc20.hasOwnProperty(first)) {
                                            var from = erc20[first]
                                            //let value = await web3ws.utils.fromWei(tx.value)
                                            if (from == 'tether')
                                                var value = price[from] * trans * 10**6
                                            else
                                                var value = price[from] * trans
                                        } else {
                                            var from = first
                                            var value = 0
                                        }

                                        if (erc20.hasOwnProperty(second)) {
                                            var middle = erc20[second]

                                        } else {
                                            var middle = second
                                        }

                                        if (erc20.hasOwnProperty(third)) {
                                            var to = erc20[third]
                                        } else {
                                            var to = third
                                        }
                                        if (value >= 200)
                                            console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') ,from, "-->", middle, "-->", to," value is: ", value, "usd. hash is ", tx.hash)

                                    }
                                }
                                //web3.
                            //}
                        }
                        //}
                        //console.log(typeof tx_)
                        /*
                        for(var key in tx){
                            console.log("key: " + key + " ,value: " + tx[key]);
                        }

                         */

                    }
                } catch (err) {
                console.error(err);
                }
        });
    });
};


init();




/*
a = {
    blockHash: null,
    blockNumber: null,
    from: '0x5E318A0166F1e0B2DCfD8F457517ebCcf87Cbb42',
    gas: 36101,
    gasPrice: '16644477986',
    maxFeePerGas: '16644477986',
    maxPriorityFeePerGas: '1500000000',
    hash: '0x78ce8d4bfc2c76aac72e896ea6d7423120179f7e4d2960577f4df6079b13c2fd',
    input: '0x063d11de0000000000000000000000000000000000000000000000492f037764b9580000',
    nonce: 260,
    to: '0x967ea106144FF482ca13d1ab1F7e3747fF590531',
    transactionIndex: null,
    value: '0',
    type: 2,
    accessList: [],
    chainId: '0x1',
    v: '0x0',
    r: '0xb6707629730a7500c2dc9b2704826f04801234b4704e9c06932d68e3a9941ae',
    s: '0x71351944fddcd719d137b2e7a587df7856eba4f2a028d18294e86f709fcb44f5'
}


 */
//console.log(a['s'])


