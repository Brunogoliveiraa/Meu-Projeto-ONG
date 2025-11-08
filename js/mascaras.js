// Máscara para CPF
document.getElementById('cpf').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});

// Máscara para telefone
document.getElementById('telefone').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  e.target.value = value;
});

// Máscara para CEP
document.getElementById('cep').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  value = value.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  e.target.value = value;
}); 

// Submenu em mobile
document.querySelectorAll('.has-submenu > a').forEach(link => {
  link.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = this.parentElement;
      parent.classList.toggle('ativo');
    }
  });
});


// Populando cidades com base no estado selecionado
document.addEventListener("DOMContentLoaded", () => {
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  // 🔹 1. Carrega os estados automaticamente da API do IBGE
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
    .then(response => response.json())
    .then(estados => {
      estadoSelect.innerHTML = "<option value=''>Selecione o estado</option>";
      estados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.sigla;
        option.textContent = `${estado.nome} (${estado.sigla})`;
        estadoSelect.appendChild(option);
      });
    })
    .catch(() => {
      estadoSelect.innerHTML = "<option value=''>Erro ao carregar estados</option>";
    });

  // 🔹 2. Quando o estado muda, carrega as cidades correspondentes
  estadoSelect.addEventListener("change", () => {
    const uf = estadoSelect.value;
    cidadeSelect.innerHTML = "<option value=''>Carregando cidades...</option>";
    cidadeSelect.disabled = true;

    if (!uf) {
      cidadeSelect.innerHTML = "<option value=''>Selecione o estado primeiro</option>";
      cidadeSelect.disabled = true;
      return;
    }

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => response.json())
      .then(cidades => {
        cidadeSelect.innerHTML = "<option value=''>Selecione a cidade</option>";
        cidades.forEach(cidade => {
          const option = document.createElement("option");
          option.value = cidade.nome;
          option.textContent = cidade.nome;
          cidadeSelect.appendChild(option);
        });
        cidadeSelect.disabled = false;
      })
      .catch(() => {
        cidadeSelect.innerHTML = "<option value=''>Erro ao carregar cidades</option>";
        cidadeSelect.disabled = true;
      });
  });
}



  const tipoSelect = document.getElementById('tipo');
  const outroContainer = document.getElementById('outro-container');

  tipoSelect.addEventListener('change', () => {
    if (tipoSelect.value === 'outro') {
      outroContainer.style.display = 'block';
    } else {
      outroContainer.style.display = 'none';
    }
  });


  // Contador de caracteres para a mensagem
  const mensagem = document.getElementById('mensagem');
  const contador = document.getElementById('contador');
  const limite = 1000;

  mensagem.addEventListener('input', () => {
    const caracteres = mensagem.value.length;
    contador.textContent = `${caracteres} / ${limite}`;

    if (caracteres >= limite * 0.9) {
      // Quando ultrapassa 900 caracteres (90% do limite)
      mensagem.classList.add('alerta');
      contador.classList.add('alerta');
    } else {
      mensagem.classList.remove('alerta');
      contador.classList.remove('alerta');
    }
  });



