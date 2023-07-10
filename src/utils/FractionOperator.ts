import { Fraction } from "../types/math";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default class FractionOperator {
  public static min(a: Fraction, b: Fraction): Fraction {
    return this.lt(a, b) ? a : b;
  }

  public static max(a: Fraction, b: Fraction): Fraction {
    return this.gt(a, b) ? a : b;
  }

  public static equal(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) === this.fractionToDecimal(b);
  }

  public static mod(a: Fraction, b: Fraction, acceptableDenominators: number[] = [1000]): Fraction {
    return this.decimalToFraction(this.fractionToDecimal(a) % this.fractionToDecimal(b), acceptableDenominators);
  }

  public static gt(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) > this.fractionToDecimal(b);
  }

  public static lt(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) < this.fractionToDecimal(b);
  }

  public static gte(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) >= this.fractionToDecimal(b);
  }

  public static lte(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) < this.fractionToDecimal(b);
  }

  public static reduce(fraction: Fraction): Fraction {
    const gcdValue = gcd(fraction.n, fraction.d);
    return { n: fraction.n / gcdValue, d: fraction.d / gcdValue };
  }

  public static add(a: Fraction, b: Fraction): Fraction {
    return { n: a.n * b.d + b.n * a.d, d: a.d * b.d };
  }

  public static subtract(a: Fraction, b: Fraction) {
    return { n: a.n * b.d - b.n * a.d, d: a.d * b.d };
  }

  public static multiply(a: Fraction, b: Fraction): Fraction {
    return { n: a.n * b.n, d: a.d * b.d };
  }

  public static divide(a: Fraction, b: Fraction): Fraction {
    return { n: a.n * b.d, d: a.d * b.n };
  }

  public static fractionToDecimal(fraction: Fraction): number {
    return fraction.n / fraction.d;
  }

  public static decimalToFraction(decimal: number, acceptableDenominators: number[]): Fraction {
    // check if decimal is negative
    const isNegative = decimal < 0;

    // convert to positive
    if (isNegative) {
      decimal = Math.abs(decimal);
    }

    // get whole part and normalize to [0-1) range
    const wholePart = Math.floor(decimal);
    decimal -= wholePart;

    // initialize mininum difference and best denominator option
    let minDifference = Infinity;
    let denominator = 1;

    // find best denominator
    for (let i = 0; i < acceptableDenominators.length; i++) {
      const den = acceptableDenominators[i];
      const diff = Math.abs(den * decimal - Math.round(den * decimal));
      if (diff < minDifference) {
        minDifference = diff;
        denominator = den;
      }
    }

    // get corresponding numerator
    const numerator = Math.round(denominator * decimal);

    // format as fraction
    const fraction = {
      n: (isNegative ? -1 : 1) * (wholePart * denominator) + numerator,
      d: denominator,
    };

    // reduce before returning
    return this.reduce(fraction);
  }
}
