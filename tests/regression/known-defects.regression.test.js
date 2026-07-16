const {
  applyFee,
  toCents,
  validateAmount,
  computeInterest,
} = require("../../src/services/money");

//const request = require("supertest");
//const { Pool } = require("pg");
//const { createApp } = require("../../src/app");

//const TEST_DATABASE_URL =
  //process.env.TEST_DATABASE_URL ||
  //"postgres://bankuser:bankpass@localhost:5433/bankdb_test";

//let pool;
//let app;

//beforeAll(() => {
  //pool = new Pool({ connectionString: TEST_DATABASE_URL });
  //app = createApp(pool);
//});

//afterAll(async () => {
  //await pool.end();
//});

//beforeEach(async () => {
  //await pool.query("TRUNCATE TABLE transfers, accounts RESTART IDENTITY CASCADE");
//});


describe("Regresion (defectos historicos que no deben reaparecer)", () => {
  test("BUG-089: applyFee con feeBps=0 ya no produce NaN", () => {
    expect(applyFee(10000, 0)).toBe(10000);
    expect(Number.isNaN(applyFee(10000, 0))).toBe(false);
  });

  test("BUG-104: toCents ya no trunca importes con tres decimales", () => {
    expect(toCents(19.999)).toBe(2000);
  });

  test("BUG-118: validateAmount ya no acepta cadenas numericas como centimos validos", () => {
    expect(() => validateAmount("100")).toThrow("centimos enteros");
  });

  test("BUG-126: computeInterest ya no retorna un valor negativo con tasa cero", () => {
    const interes = computeInterest(100000, 0, 30);
    expect(interes).toBe(0);
  });

  test("BUG-133: applyFee ya no redondea hacia abajo comisiones fraccionarias mayores a 0.5", () => {
    expect(applyFee(1000, 55)).toBe(1006);
  });

  test("BUG-141: validateAmount ya no permite Infinity como monto valido", () => {
    expect(() => validateAmount(Infinity)).toThrow();
  });

  // PRUEBA PROPUESTA 1
  test("BUG-152: toUnits no pierde precision con centimos superiores a diez millones", () => {
    expect(toUnits(10000001)).toBeCloseTo(100000.01, 2);
    expect(toUnits(123456789)).toBeCloseTo(1234567.89, 2);
  });

  // PRUEBA PROPUESTA 2
  test("BUG-160: un titular con espacios al inicio y al final no genera cuentas logicamente duplicadas", async () => {
    const res1 = await request(app).post("/accounts").send({ owner: "  Wendy  " });
    const res2 = await request(app).post("/accounts").send({ owner: "Wendy" });

    expect(res1.body.owner).toBe("Wendy");
    expect(res2.status).toBe(409);
  });

  //test.todo(
    //"BUG-152: verificar que toUnits ya no pierde precision con centimos superiores a 10 millones"
  //);

  //test.todo(
    //"BUG-160: verificar que un titular con espacios al inicio y al final ya no genera cuentas duplicadas logicamente distintas"
  //);
});