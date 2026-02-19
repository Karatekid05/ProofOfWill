# Como obter fundos na Arc Testnet

## Problema

O deploy falhou com "insufficient funds for gas". Na **Arc**, o gas é pago em **USDC** (é a moeda nativa da rede, não ETH).

## Solução: Circle Faucet

1. Vai a https://faucet.circle.com
2. Seleciona **Arc Testnet**
3. Cola o endereço da tua wallet (podes ver com `cast wallet address --private-key 0xTUA_KEY` ou na MetaMask)
4. Pede **USDC**
5. Espera alguns minutos até os fundos aparecerem

## Verificar saldo

```bash
# Saldo nativo (USDC usado para gas) na Arc
cast balance TUA_WALLET_ADDRESS --rpc-url https://rpc.testnet.arc.network
```

Ou usa o [Arcscan](https://testnet.arcscan.app) e procura pelo teu endereço.

## Depois de ter USDC

Corre novamente o deploy:

```bash
forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast --private-key 0xTUA_KEY -vvv
```

**Nota:** O deploy de 3 contratos precisa de ~0.12 USDC (na Arc o gas é em USDC). Pede fundos suficientes no faucet.
