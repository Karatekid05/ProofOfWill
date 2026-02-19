# Deploy Checklist — Pronto para Produção

## ✅ O que já está feito

- ✅ Contrato `DualConsensusVault` implementado (one-deposit + both-deposit, accept, resolve)
- ✅ Frontend completo: criar acordo, dashboard com "Awaiting your action", share link `/agreements/[id]`
- ✅ Hooks e integração wagmi/Rainbow Kit
- ✅ Deploy script atualizado (deploya os 3 contratos)

## 📋 O que falta fazer

### 1. Deploy dos contratos na Arc Testnet

**Importante:** Com `--broadcast` tens de passar a tua chave privada com `--private-key`. Sem isso o Foundry usa um sender de teste e o deploy falha.

```bash
# No diretório do projeto
cd ~/ProofOfWill

# Deploy (substitui 0xTUA_PRIVATE_KEY pela tua chave; ⚠️ nunca commites nem partilhes)
forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast --private-key 0xTUA_PRIVATE_KEY -vvv
```

A wallet cuja chave usares precisa de USDC na Arc Testnet para gas (na Arc o gas é pago em USDC). Pede na [Circle Faucet](https://faucet.circle.com) (Arc Testnet).

**O script vai outputar 3 endereços:**
- `CommitmentVault deployed at 0x...`
- `CommitmentFactory deployed at 0x...`
- `DualConsensusVault deployed at 0x...` ← **Este é o mais importante para agreements**

### 2. Configurar `.env.local`

Criar/editar `.env.local` com os endereços:

```bash
# Para agreements (two-party) - OBRIGATÓRIO
NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS=0x...  # Endereço do DualConsensusVault

# Para commitments (legacy single verifier) - OPCIONAL
NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS=0x...     # Ou usar vault abaixo
NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS=0x...      # Fallback se factory não usado
```

### 3. Testar localmente

```bash
pnpm dev
```

Abrir `http://localhost:3000`:
1. Conectar wallet (Arc Testnet)
2. Ir a "New agreement"
3. Criar acordo (testar one-deposit primeiro)
4. Copiar link `/agreements/[id]`
5. Abrir noutra janela/browser com outra wallet
6. Aceitar o acordo
7. Ambos submeter resolução (mesmo outcome)
8. Verificar que o dinheiro saiu

### 4. Deploy na Vercel (produção)

1. Push para GitHub (se ainda não tiveres)
2. Vercel → Add Project → importar repo
3. **Environment Variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` = endereço do DualConsensusVault
   - `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` = endereço do Factory (opcional)
4. Deploy

### 5. Obter USDC de teste

- [Circle Faucet](https://faucet.circle.com) → selecionar **Arc Testnet**
- Request USDC para a tua wallet
- Precisas de USDC para:
  - Criar agreements (depositar)
  - Gas fees (Arc usa USDC como gas)

## 🐛 Troubleshooting

**"No vault configured" no dashboard:**
- Verifica que `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` está definido em `.env.local`
- Reinicia o dev server (`pnpm dev`)

**"Invalid counter-party address":**
- Endereço deve começar com `0x` e ter 42 caracteres
- Exemplo: `0x1234567890123456789012345678901234567890`

**"USDC transfer failed":**
- Verifica que tens USDC suficiente na wallet
- Verifica que aprovaste USDC antes de criar (o form faz isso automaticamente)

**Build Next.js falha (Google Fonts):**
- Problema conhecido em alguns ambientes
- App funciona na mesma com `pnpm dev`
- Em produção (Vercel) geralmente funciona

## ✨ Próximos passos (opcional)

- [ ] Adicionar timeout/disputa (se não houver consenso após X dias)
- [ ] Melhorar copy/UI para explicar melhor o fluxo
- [ ] Adicionar notificações (email quando há acordo à espera)
- [ ] Taxa do protocolo (pequena % na resolução)
