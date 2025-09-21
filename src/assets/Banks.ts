export const Banks = [
  // physics banks
  { code: "341", name: "Itaú", image: "/banks/itau.png" },
  { code: "001", name: "Banco do Brasil", image: "/banks/bancobrasil.png" },
  { code: "237", name: "Bradesco", image: "/banks/bradesco.png" },
  { code: "104", name: "Caixa", image: "/banks/caixa.jpg" },
  { code: "033", name: "Santander", image: "/banks/santander.jpg" },
  { code: "208", name: "BTG Pactual", image: "/banks/btg.jpg" },
  { code: "748", name: "Sicredi", image: "/banks/sicredi.webp" },
  { code: "756", name: "Sicoob", image: "/banks/sicoob.png" },
  { code: "422", name: "Banco Safra", image: "/banks/safra.jpg" },
  { code: "745", name: "Citibank", image: "/banks/citibank.gif" },
  { code: "399", name: "HSBC", image: "/banks/hsbc.png" },
  { code: "389", name: "Mercantil", image: "/banks/mercantil.png" },
  { code: "637", name: "Sofisa", image: "/banks/sofisa.png" },
  { code: "655", name: "Banco Votorantim", image: "/banks/bv.png" },
  { code: "007", name: "BNDES", image: "/banks/bndes.jpeg" },

  // digital banks
  { code: "336", name: "C6 Bank", image: "/banks/c6.png" },
  { code: "260", name: "Nubank", image: "/banks/nubank.png" },
  { code: "077", name: "Inter", image: "/banks/inter.png" },
  { code: "735", name: "Neon", image: "/banks/neon.jpeg" },
  { code: "290", name: "PagBank", image: "/banks/pagbank.png" },
  { code: "212", name: "Original", image: "/banks/original.jpeg" },
  { code: "237-1", name: "Next", image: "/banks/next.jpg" },
  { code: "380", name: "PicPay", image: "/banks/picpay.png" },
  { code: "332", name: "Banco XP", image: "/banks/xp.png" },
  { code: "318", name: "Banco BMG", image: "/banks/bmg.png" },
  { code: "610", name: "Banco VR", image: "/banks/vr.png" },
  { code: "623", name: "Banco PAN", image: "/banks/pan.jpg" },

  // external banks
  { code: "901", name: "American Express", image: "/banks/american.svg" },
  { code: "902", name: "UBS", image: "/banks/ubs.png" },
  { code: "903", name: "Credit Suisse", image: "/banks/creditsuisse.jpeg" },
  { code: "904", name: "J.P. Morgan", image: "/banks/jpmorgan.jpg" },
  { code: "905", name: "Bank of America", image: "/banks/bankofamerica.png" },
  { code: "906", name: "Deutsche Bank", image: "/banks/deutschebank.jpg" },

  // other payment methods
  { code: "801", name: "Porto Bank", image: "/banks/portobank.png" },
  { code: "802", name: "Infinity Pay", image: "/banks/infinitypay.jpg" },
  { code: "803", name: "PayPal", image: "/banks/paypal.jpg" },
  { code: "804", name: "Mercado Pago", image: "/banks/mercadopago.webp" },
  { code: "805", name: "PagSeguro", image: "/banks/pagseguro.svg" },
  { code: "806", name: "Elo", image: "/banks/elo.png" },
  { code: "807", name: "Efí Bank", image: "/banks/efibank.png" },
  { code: "808", name: "Cielo", image: "/banks/cielo.png" },
  { code: "809", name: "Adyen", image: "/banks/adyen.png" },
  { code: "810", name: "Transfeera", image: "/banks/transfeera.png" },
  { code: "811", name: "Shopify", image: "/banks/shopify.png" },
  { code: "812", name: "Asaas", image: "/banks/asaas.png" },
  { code: "813", name: "Stripe", image: "/banks/stripe.jpeg" },
  { code: "814", name: "Iugu", image: "/banks/iugu.png" },
  { code: "815", name: "Pagarme", image: "/banks/pagarme.png" },
  { code: "816", name: "Stone", image: "/banks/stone.png" },
  { code: "817", name: "Nuvemshop", image: "/banks/nuvemshop.png" },
  { code: "818", name: "GetNet", image: "/banks/getnet.png" },
  { code: "819", name: "Sumup", image: "/banks/sumup.jpg" },
  { code: "820", name: "Ebanx", image: "/banks/ebanx.png" },
];

export const BanksSafely = Banks.filter(function (bank) {
  return Boolean(bank.code);
}) as {
  code: string;
  name: string;
}[];
