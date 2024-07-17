const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

// Definir a rede
const network = bitcoin.networks.testnet

// Caminho de derivação para carteiras HD (o /1 é para testnet e o /0 é para mainnet)
const path = `m/49'/1'/0'/0`

// Criar o mnemonic para a seed (palavras de senha)
let mnemonic = bip39.generateMnemonic()
const seed = bip39.mnemonicToSeedSync(mnemonic)

// Criar a raiz da carteira HD
let root = bip32.fromSeed(seed, network)

// Criar uma conta - par de chaves privada-pública
let account = root.derivePath(path)
let node = account.derive(0).derive(0)

// Gerar endereço P2PKH (Pay-to-PubKey-Hash)
let p2pkhAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
}).address

// Gerar endereço P2WPKH (Pay-to-Witness-PubKey-Hash)
let p2wpkhAddress = bitcoin.payments.p2wpkh({
    pubkey: node.publicKey,
    network: network,
}).address

// Gerar endereço P2SH (Pay-to-Script-Hash) como fallback
let p2shAddress = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
        pubkey: node.publicKey,
        network: network,
    }),
    network: network,
}).address

console.log("Carteira gerada")
console.log("Endereço P2PKH: ", p2pkhAddress)
console.log("Endereço P2WPKH: ", p2wpkhAddress)
console.log("Endereço P2SH: ", p2shAddress)
console.log("Chave privada: ", node.toWIF())
console.log("Seed: ", mnemonic)
