import { dataSource } from '@graphprotocol/graph-ts';
import { Context } from '../context';
import { createContractEvent } from '../entities/Event';
import { ExchangeMethodCall, ExchangeMethodCall1 } from '../generated/TradingContract';
import { cancelOrder, createTrade } from '../entities/Trade';
import { useAsset } from '../entities/Asset';
import { exchangeMethodSignatureToName } from '../utils/exchangeMethodSignature';
import { ensureExchange } from '../entities/Exchange';

export function handleExchangeMethodCall(event: ExchangeMethodCall): void {
  let context = new Context(dataSource.context(), event);
  let method = exchangeMethodSignatureToName(event.params.methodSignature.toHexString());
  let exchange = ensureExchange(event.params.exchangeAddress, context);

  if (method == 'cancelOrder') {
    cancelOrder(exchange, context);
    return;
  }

  let addresses = event.params.orderAddresses.map<string>((value) => value.toHex());
  let assetSold = useAsset(addresses[3]);
  let assetBought = useAsset(addresses[2]);

  createTrade(method, exchange, assetSold, assetBought, context);
  createContractEvent('Trade', context);
}

export function handleExchangeMethodCall1(event: ExchangeMethodCall1): void {
  let context = new Context(dataSource.context(), event);
  let method = exchangeMethodSignatureToName(event.params.methodSignature.toHexString());
  let exchange = ensureExchange(event.params.exchangeAddress, context);

  if (method == 'cancelOrder') {
    cancelOrder(exchange, context);
    return;
  }

  let addresses = event.params.orderAddresses.map<string>((value) => value.toHex());
  let assetSold = useAsset(addresses[3]);
  let assetBought = useAsset(addresses[2]);

  createTrade(method, exchange, assetSold, assetBought, context);
  createContractEvent('Trade', context);
}
