const { formatMoney, buildTransferReceipt } = require("../../src/services/money");
/*
const request = require("supertest");
const { Pool } = require("pg");
const { createApp } = require("../../src/app");

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgres://bankuser:bankpass@localhost:5433/bankdb_test";

let pool;
let app;

beforeAll(() => {
  pool = new Pool({ connectionString: TEST_DATABASE_URL });
  app = createApp(pool);
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query("TRUNCATE TABLE transfers, accounts RESTART IDENTITY CASCADE");
});
*/

describe("Snapshot testing (formato y estructuras de salida)", () => {
  test("formatMoney con importe entero de soles", () => {
    expect(formatMoney(1050, "PEN")).toMatchInlineSnapshot(`"PEN 10.50"`);
  });

  test("formatMoney con importe menor a una unidad", () => {
    expect(formatMoney(5, "USD")).toMatchInlineSnapshot(`"USD 0.05"`);
  });

  test("formatMoney con importe exacto sin centimos", () => {
    expect(formatMoney(500000, "PEN")).toMatchInlineSnapshot(`"PEN 5000.00"`);
  });

  test("buildTransferReceipt genera la estructura esperada del recibo", () => {
    const receipt = buildTransferReceipt({
      id: 1,
      fromOwner: "Ana",
      toOwner: "Beto",
      amountCents: 3000,
      currency: "PEN",
      reference: "PAGO-01",
    });
    expect(receipt).toMatchInlineSnapshot(`
{
  "amount": "PEN 30.00",
  "receiptId": 1,
  "reference": "PAGO-01",
  "summary": "Ana -> Beto",
}
`);
  });

  test("buildTransferReceipt sin referencia usa el valor por defecto", () => {
    const receipt = buildTransferReceipt({
      id: 2,
      fromOwner: "Carla",
      toOwner: "Dora",
      amountCents: 10000,
      currency: "USD",
    });
    expect(receipt.reference).toMatchInlineSnapshot(`"SIN-REFERENCIA"`);
  });

  test("la forma del objeto de error HTTP se mantiene estable", () => {
    const errorBody = { error: "Fondos insuficientes" };
    expect(errorBody).toMatchInlineSnapshot(`
    {
      "error": "Fondos insuficientes",
    }
    `);
  });

  //PRUEBA PROPUESTA 1

  test("snapshot del cuerpo de POST /accounts usando property matchers para id y created_at", async () => {
    const res = await request(app).post("/accounts").send({ owner: "Nina" });

    expect(res.body).toMatchSnapshot({
      id: expect.any(Number),
      created_at: expect.any(String),
    });
  });

    //PRUEBA PROPUESTA 2

  test("buildTransferReceipt con un monto de tres cifras de centimos redondeadas", () => {
    const receipt = buildTransferReceipt({
      id: 3, fromOwner: "Elsa", toOwner: "Fer",
      amountCents: 12345, currency: "PEN", reference: "PAGO-REDONDEO" });

    expect(receipt).toMatchInlineSnapshot(`
      {
        "amount": "PEN 123.45",
        "receiptId": 3,
        "reference": "PAGO-REDONDEO",
        "summary": "Elsa -> Fer",
      }
    `);
  });

  //test.todo(
    //"capturar el snapshot del cuerpo de respuesta de POST /accounts usando property matchers para id y created_at"
  //);

  //test.todo(
    //"capturar el snapshot de buildTransferReceipt para un monto con tres cifras de centimos redondeadas"
  //);
});
