const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getInput(mensagem) {
  return new Promise((resolve, reject) => {
    rl.question(mensagem, (dado) => resolve(dado));
  });
}

async function pegarDados() {
  const clientes = [];
  let resposta = "";
  do {
    const dadoDoUsuario = await getInput(
      "Digite o nome da empresa e a quantidade comprada (Exemplo: Supermercado Tal; 300): "
    );
    let splitDados = dadoDoUsuario.split("; ");
    clientes.push(splitDados);
    resposta = await getInput(
      "Deseja inserir um novo cliente? (s = sim; n = não) "
    );
  } while (resposta == "s");
  return clientes;
}

function calcularImpostos(valorSemImposto) {
  let icms = valorSemImposto * 0.18;
  let ipi = valorSemImposto * 0.04;
  let pis = valorSemImposto * 0.0186;
  let cofins = valorSemImposto * 0.0854;

  return { icms, ipi, pis, cofins };
}

async function main() {
  const clientes = await pegarDados();

  let valorUnitário = 4.5;
  let totalDeImpostos = 0;
  let totalSemImposto = 0;
  let totalGeral = 0;

  for (let i = 0; i < clientes.length; i++) {
    let [cliente, quantidadeComprada] = clientes[i];
    quantidadeComprada = parseInt(quantidadeComprada);
    let valorSemImpostoDoCliente = valorUnitário * quantidadeComprada;
    let { icms, ipi, pis, cofins } = calcularImpostos(valorSemImpostoDoCliente);

    let totalDeImpostosDoCliente = icms + ipi + pis + cofins;

    let totalDoCliente = 0;

    // cálculo de 5% de desconto para grandes compras
    if (quantidadeComprada >= 450) {
      totalDoCliente =
        totalDeImpostosDoCliente +
        (valorSemImpostoDoCliente - valorSemImpostoDoCliente * 0.05);
    } else {
      totalDoCliente = totalDeImpostosDoCliente + valorSemImpostoDoCliente;
    }

    totalDeImpostos += totalDeImpostosDoCliente;
    totalSemImposto += valorSemImpostoDoCliente;
    totalGeral += totalDoCliente;

    console.log(`\nCliente: ${cliente}`);
    console.log(`Quantidade Comprada: ${quantidadeComprada}`);
    console.log("\n");
    console.log(`ICMS: R$ ${icms.toFixed(2)}`);
    console.log(`IPI: R$ ${ipi.toFixed(2)}`);
    console.log(`PIS: R$ ${pis.toFixed(2)}`);
    console.log(`COFINS: R$ ${cofins.toFixed(2)}`);
    console.log(`Total: R$ ${totalDoCliente.toFixed(2)}`);
    console.log("\n");

    rl.close();
  }

  console.log(`Total Impostos: R$ ${totalDeImpostos.toFixed(2)}`);
  console.log(`Total Mercadorias: R$ ${totalSemImposto.toFixed(2)}`);
  console.log(`Total Geral: R$ ${totalGeral.toFixed(2)}`);
}

main();
