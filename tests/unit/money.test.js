const {
  toCents,
  formatMoney,
  validateAmount,
  canWithdraw,
  applyFee,
  computeInterest,
} = require("../../src/services/money");

describe("money (pruebas unitarias)", () => {
  test("toCents convierte unidades a centimos enteros", () => {
    expect(toCents(10.5)).toBe(1050);
    expect(toCents(0.01)).toBe(1);
  });

  test("toCents rechaza valores no numericos", () => {
    expect(() => toCents("100")).toThrow("El monto debe ser un numero");
    expect(() => toCents(NaN)).toThrow("El monto debe ser un numero");
  });

  test("formatMoney presenta el importe con dos decimales y moneda", () => {
    expect(formatMoney(1050, "PEN")).toBe("PEN 10.50");
    expect(formatMoney(5, "USD")).toBe("USD 0.05");
  });

  test("validateAmount acepta enteros positivos y rechaza el resto", () => {
    expect(validateAmount(100)).toBe(true);
    expect(() => validateAmount(0)).toThrow("mayor que cero");
    expect(() => validateAmount(-5)).toThrow("mayor que cero");
    expect(() => validateAmount(10.5)).toThrow("centimos enteros");
  });

  test("canWithdraw permite retirar exactamente el saldo disponible", () => {
    expect(canWithdraw(1000, 1000)).toBe(true);
    expect(canWithdraw(1000, 999)).toBe(true);
    expect(canWithdraw(1000, 1001)).toBe(false);
  });

  test("applyFee suma la comision en puntos basicos al monto", () => {
    expect(applyFee(10000, 50)).toBe(10050);
    expect(applyFee(10000, 0)).toBe(10000);
  });

  /*
  // Prueba propuesta 1
  test("computeInterest calcula el interes simple para 30 dias al 12% anual", () => {
  expect(
    computeInterest(100000, 0.12, 30)
  ).toBe(986);
  });
  */

  // Prueba propuesta 2
  test("toCents redondea 19.999 a 2000", () => {
  expect(toCents(19.999)).toBe(2000);
  });

  // Prueba para eliminar al mutante M4
  test("computeInterest calcula el interes simple para 30 dias al 12% anual", () => {
    expect(computeInterest(100000, 12, 30)).toBe(986);
  });
  
});