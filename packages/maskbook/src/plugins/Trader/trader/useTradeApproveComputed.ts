import { useMemo } from 'react'
import { useChainId } from '../../../web3/hooks/useChainState'
import { createEtherToken, createERC20Token } from '../../../web3/helpers'
import { SwapQuoteResponse, TradeComputed, TradeProvider } from '../types'
import type { ERC20TokenDetailed, EtherTokenDetailed } from '../../../web3/types'
import { useConstant } from '../../../web3/hooks/useConstant'
import { TRADE_CONSTANTS } from '../constants'
import { safeUnreachable } from '../../../utils/utils'

export function useTradeApproveComputed(
    trade: TradeComputed<unknown> | null,
    provider: TradeProvider,
    token?: EtherTokenDetailed | ERC20TokenDetailed,
) {
    const chainId = useChainId()
    const UNISWAP_V2_ROUTER_ADDRESS = useConstant(TRADE_CONSTANTS, 'UNISWAP_V2_ROUTER_ADDRESS')
    const SUSHISWAP_ROUTER_ADDRESS = useConstant(TRADE_CONSTANTS, 'SUSHISWAP_ROUTER_ADDRESS')

    return useMemo(() => {
        if (!trade || !token)
            return {
                approveToken: undefined,
                approveAmount: '0',
                approveAddress: '',
            }
        return {
            approveToken:
                token.name === 'ETH'
                    ? createEtherToken(chainId)
                    : createERC20Token(
                          chainId,
                          token.address,
                          token.decimals ?? 0,
                          token.name ?? '',
                          token.symbol ?? '',
                      ),
            approveAmount: trade.maximumSold.toFixed(),
            approveAddress: (() => {
                switch (provider) {
                    case TradeProvider.UNISWAP:
                        return UNISWAP_V2_ROUTER_ADDRESS
                    case TradeProvider.SUSHISWAP:
                        return SUSHISWAP_ROUTER_ADDRESS
                    case TradeProvider.ZRX:
                        return trade.trade_ ? (trade.trade_ as SwapQuoteResponse).allowanceTarget : ''
                    default:
                        safeUnreachable(provider)
                        return ''
                }
            })(),
        }
    }, [chainId, trade, provider, token])
}
