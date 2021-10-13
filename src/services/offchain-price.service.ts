import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BigNumber } from 'ethers';

import { ChainId } from '@/types';
import { DAI_ADDRESS } from '@/constants';
import { ProviderService } from '@/services';
import { toWei } from '@/utilities';

@Injectable()
export class OffchainPriceService {
  private readonly chainId: number;

  constructor(private configService: ConfigService, private providerService: ProviderService) {
    this.chainId = ChainId.MAINNET;
  }

  async getDaiEthPrice() {
    const contract = this.providerService.getOffChainOracle();

    const rate = await contract.callStatic.getRateToEth(DAI_ADDRESS, false);

    const numerator = BigNumber.from(toWei('1'));
    const denominator = BigNumber.from(toWei('1'));

    // price = rate * "token decimals" / "eth decimals" (dai = eth decimals)
    return BigNumber.from(rate).mul(numerator).div(denominator);
  }
}
