/* eslint-disable prettier/prettier */
import { Asset } from "expo-asset";
import * as Print from "expo-print";

export const printDebtors = async (debtors) => {
  // Descargar el recurso del logotipo
  const logoAsset = Asset.fromModule(require("../images/logotwins.png"));
  await logoAsset.downloadAsync();

  // Estilos y estructura del HTML
  let htmlContent = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
      body {
        font-family: 'Montserrat', sans-serif;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f8f8f8;
      }
      .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #e0e0e0;
        text-align: left;
        padding: 12px;
      }
      th {
        background-color: #f2f2f2;
      }
      .centered {
        text-align: center;
      }
      .logo img {
        max-width: 100px;
        max-height: 100px;
        display: block;
        margin: 0 auto;
        border-radius: 50%;
      }
      h1 {
        color: #333;
        text-align: center;
        margin-bottom: 20px;
        font-size: 28px;
        color: #2c3e50;
      }
      .negative {
        color: #e74c3c;
      }
      .zero {
        color: #3498db;
      }
      .positive {
        color: #2ecc71;
      }
      .total {
        font-weight: bold;
        font-size: 18px;
        color: #34495e;
      }
    </style>
    <div class="container">
      <div class="logo">
        <img src="${logoAsset.uri}" alt="Logo" />
      </div>
      <h1 class="centered">MIS DEUDORES</h1>
      <table>
        <tr><th>NOMBRE</th><th>IMPORTE</th></tr>
  `;

  // Calcular el importe total y construir las filas de la tabla
  let totalAmount = 0;
  Object.keys(debtors).forEach((key) => {
    const debtor = debtors[key];
    const amountClass =
      debtor.deudaindividual < 0
        ? "negative"
        : debtor.deudaindividual === 0
          ? "zero"
          : "positive";

    htmlContent += `<tr><td>${
      debtor.nombre
    }</td><td class="${amountClass}">${parseFloat(
      debtor.deudaindividual
    ).toLocaleString(undefined, {
      style: "currency",
      currency: "USD", // Puedes cambiarlo según tu moneda
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td></tr>`;
    totalAmount += debtor.deudaindividual;
  });

  // Calcular la clase de estilo para el importe total
  const totalAmountClass =
    totalAmount < 0 ? "negative" : totalAmount === 0 ? "zero" : "positive";

  // Agregar la tabla del importe total al HTML
  htmlContent += `
      </table>
      <table style="width: 100%;">
        <tr>
          <th class="total centered"><strong>TOTAL</strong></th>
          <td class="total centered"><span class="${totalAmountClass}">${parseFloat(
            totalAmount
          ).toLocaleString(undefined, {
            style: "currency",
            currency: "USD", // Puedes cambiarlo según tu moneda
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</span></td>
        </tr>
      </table>
    </div>
  `;

  // Imprimir el contenido usando la API de impresión
  await Print.printAsync({
    html: htmlContent,
  });
};

export const printMovements = async (debtor, movements) => {
  // Descargar el recurso del logotipo
  const logoAsset = Asset.fromModule(require("../images/logotwins.png"));
  await logoAsset.downloadAsync();

  // Estilos y estructura del HTML para movimientos
  let htmlContent = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
      body {
        font-family: 'Montserrat', sans-serif;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f8f8f8;
      }
      .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #e0e0e0;
        text-align: left;
        padding: 12px;
      }
      th {
        background-color: #f2f2f2;
      }
      .centered {
        text-align: center;
      }
      .logo img {
        max-width: 100px;
        max-height: 100px;
        display: block;
        margin: 0 auto;
        border-radius: 50%;
      }
      h1 {
        color: #333;
        text-align: center;
        margin-bottom: 20px;
        font-size: 28px;
        color: #2c3e50;
      }
      .negative {
        color: #e74c3c;
      }
      .zero {
        color: #3498db;
      }
      .positive {
        color: #2ecc71;
      }
      .total {
        font-weight: bold;
        font-size: 18px;
        color: #34495e;
      }
    </style>
    <div class="container">
      <div class="logo">
        <img src="${logoAsset.uri}" alt="Logo" />
      </div>
      <h1 class="centered">MOVIMIENTOS DEL DEUDOR: ${debtor.nombre.toUpperCase()}</h1>
      <table>
        <tr><th>IMPORTE</th><th>DESCRIPCIÓN</th><th>FECHA</th></tr>
  `;

  let totalAmount = 0;

  // Construir las filas de la tabla de movimientos
  movements.forEach((movement) => {
    const amountClass =
      movement.importe < 0
        ? "negative"
        : movement.importe === 0
          ? "zero"
          : "positive";

    htmlContent += `<tr><td class="${amountClass}">${parseFloat(
      movement.importe
    ).toLocaleString(undefined, {
      style: "currency",
      currency: "USD", // Puedes cambiarlo según tu moneda
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td><td>${movement.descripcion}</td><td>${new Date(
      movement.fecha
    ).toLocaleDateString()}</td></tr>`;
    totalAmount += movement.importe;
  });

  const totalAmountClass =
    totalAmount < 0 ? "negative" : totalAmount === 0 ? "zero" : "positive";

  // Agregar la tabla del importe total al HTML
  htmlContent += `
      </table>
      <table style="width: 100%;">
        <tr>
          <th class="total centered"><strong>TOTAL</strong></th>
          <td class="total centered"><span class="${totalAmountClass}">${parseFloat(
            totalAmount
          ).toLocaleString(undefined, {
            style: "currency",
            currency: "USD", // Puedes cambiarlo según tu moneda
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</span></td>
        </tr>
      </table>
    </div>
  `;
  // Imprimir el contenido usando la API de impresión
  await Print.printAsync({
    html: htmlContent,
  });
};
