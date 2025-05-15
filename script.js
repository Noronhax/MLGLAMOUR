function mostrarCategoria(id) {
  document.querySelectorAll('.categoria').forEach(cat => cat.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
}

let carrinho = [];
let total = 0;

function adicionarAoCarrinho(nome, preco, categoria) {
  const existente = carrinho.find(item => item.nome === nome);
  if (existente) {
    existente.qtd += 1;
  } else {
    carrinho.push({ nome, preco, qtd: 1 });
  }
  atualizarCarrinho();
}

function alterarQtd(index, delta) {
  carrinho[index].qtd += delta;
  if (carrinho[index].qtd <= 0) {
    carrinho.splice(index, 1);
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("itens-carrinho");
  const qtd = document.getElementById("qtd-carrinho");
  const totalCarrinho = document.getElementById("total-carrinho");
  lista.innerHTML = "";
  total = 0;
  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.qtd} = R$ ${subtotal.toFixed(2)}<br/>
      <button onclick="alterarQtd(${index}, -1)">➖</button>
      <button onclick="alterarQtd(${index}, 1)">➕</button>
    `;
    lista.appendChild(li);
  });
  qtd.textContent = carrinho.reduce((sum, item) => sum + item.qtd, 0);
  totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function toggleCarrinho() {
  const carrinhoDiv = document.getElementById("carrinho");
  carrinhoDiv.style.display = carrinhoDiv.style.display === "none" ? "block" : "none";
}

function aplicarCupom() {
  const cupom = document.getElementById("cupom").value.toUpperCase();
  if (cupom === "MARI10") total *= 0.9;
  if (cupom === "MARI20") total *= 0.8;
  if (cupom === "MARI5") total *= 0.95;
  if (cupom === "100FRETE") total -= 10;
  if (cupom === "VESTIDOS10") {
    carrinho = carrinho.map(item => {
      if (item.nome.toLowerCase().includes("vestido")) {
        return { ...item, preco: item.preco * 0.9 };
      }
      return item;
    });
  }
  atualizarCarrinho();
}

function simularFrete() {
  const cep = document.getElementById("cep").value;
  const resultado = document.getElementById("resultado-frete");
  if (cep.length >= 8 && /^[0-9]+$/.test(cep)) {
    resultado.textContent = "Frete estimado: R$ 15,00 - Entrega em 5 dias úteis";
  } else {
    resultado.textContent = "CEP inválido";
  }
}

function abrirCheckout() {
  document.getElementById("modal-checkout").style.display = "block";
  document.getElementById("resumoCheckout").innerHTML = carrinho.map(item => 
    `<p>${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.qtd}</p>`
  ).join("") + `<p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>`;
}

function fecharCheckout() {
  document.getElementById("modal-checkout").style.display = "none";
}

function confirmarCompra() {
  alert("Pedido confirmado! Obrigado por comprar na Loja Mari.");
  carrinho = [];
  atualizarCarrinho();
  fecharCheckout();
}

function alterarQuantidade(botao, delta) {
  const span = botao.parentElement.querySelector("span");
  let quantidade = parseInt(span.textContent);
  quantidade += delta;
  if (quantidade < 1) quantidade = 1;
  span.textContent = quantidade;
}
function finalizarNoWhatsapp() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "*Pedido - Loja Mari*%0A%0A";
  carrinho.forEach(item => {
    mensagem += `• ${item.nome} - ${item.qtd}x - R$ ${(item.preco * item.qtd).toFixed(2)}%0A`;
  });

  const totalPedido = carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0);
  mensagem += `%0A*Total:* R$ ${totalPedido.toFixed(2)}%0A`;
  mensagem += `%0AFinalizando pedido via WhatsApp.`

  // Substitua com seu número real com DDI (ex: 55 para Brasil)
  const numero = "5571997312681"; // Substitua aqui
  const url = `https://wa.me/${numero}?text=${mensagem}`;

  window.open(url, "_blank");
}
