document.addEventListener('DOMContentLoaded', () => {
  // 🔹 1. Menu Hambúrguer
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('aberto');
    });
  }

  // 🔹 2. Submenu em Mobile
  document.querySelectorAll('.has-submenu > a').forEach(link => {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.parentElement.classList.toggle('ativo');
      }
    });
  });

  // 🔹 3. Máscaras de Entrada
  const aplicarMascara = (id, formatador) => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', e => {
        e.target.value = formatador(e.target.value);
      });
    }
  };

  aplicarMascara('cpf', valor => {
    let v = valor.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
  });

  aplicarMascara('telefone', valor => {
    let v = valor.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    return v;
  });

  aplicarMascara('cep', valor => {
    let v = valor.replace(/\D/g, '').slice(0, 8);
    v = v.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
    return v;
  });

  // 🔹 4. Estados e Cidades (API IBGE)
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  if (estadoSelect && cidadeSelect) {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then(res => res.json())
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

    estadoSelect.addEventListener("change", () => {
      const uf = estadoSelect.value;
      cidadeSelect.innerHTML = "<option value=''>Carregando cidades...</option>";
      cidadeSelect.disabled = true;

      if (!uf) {
        cidadeSelect.innerHTML = "<option value=''>Selecione o estado primeiro</option>";
        return;
      }

      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(res => res.json())
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
        });
    });
  }

  // 🔹 5. Campo "Outro" visível conforme seleção
  const tipoSelect = document.getElementById('tipo');
  const outroContainer = document.getElementById('outro-container');

  if (tipoSelect && outroContainer) {
    tipoSelect.addEventListener('change', () => {
      outroContainer.style.display = tipoSelect.value === 'outro' ? 'block' : 'none';
    });
  }

  // 🔹 6. Contador de Caracteres
  const mensagem = document.getElementById('mensagem');
  const contador = document.getElementById('contador');
  const limite = 1000;

  if (mensagem && contador) {
    mensagem.addEventListener('input', () => {
      const caracteres = mensagem.value.length;
      contador.textContent = `${caracteres} / ${limite}`;

      const alerta = caracteres >= limite * 0.9;
      mensagem.classList.toggle('alerta', alerta);
      contador.classList.toggle('alerta', alerta);
    });
  }
});