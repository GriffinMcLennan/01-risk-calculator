/**
 * @param totalAccountValue: The total value of the collateral in the account TODO: check this definition
 * @param totalPositionNotional: The total value of the account including all open positions
 */
function getMarginFraction(totalAccountValue: number, totalPositionNotional: number): number {
    return totalAccountValue / totalPositionNotional;
}

export default getMarginFraction;
