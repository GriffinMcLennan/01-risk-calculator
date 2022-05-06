/**
 * @param MF: The Margin Fraction
 * @param MMF: The Maintenance Margin Fraction
 */
function getAccountRisk(MF: number, MMF: number): number {
    return Math.abs(Math.log(Math.min(1, MF)) / Math.log(MMF)) * 100;
}

export default getAccountRisk;
