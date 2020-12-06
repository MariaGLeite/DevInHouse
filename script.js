let idUltimaAtividadeGerada = 0;

document.addEventListener('keyup', function(event) {
  if (event.key === "Enter") {
    const nomeNovaAtividade = document.getElementsByClassName("inputInsert")[0].children[0].value;
    criaNovaAtividade(nomeNovaAtividade);
  }
});

function alternaStatusAtividade(idAtividade) {
  const atividadesLocalstorage = transformaStringEmArray(window.localStorage.getItem('atividades'));
  let isAtividadeChecked = false;

  atividadesLocalstorage.map( (atividade) => {
    if(atividade.id === idAtividade) {
      const novoAtributoChecked = !atividade.checked;
      isAtividadeChecked = novoAtributoChecked;
      atividade.checked = novoAtributoChecked;
      return;
    }
  })

  window.localStorage.setItem('atividades', transformaArrayEmString(atividadesLocalstorage));
  
  const label = document.getElementById(idAtividade).children[0].children[1];
  
  if(isAtividadeChecked) {
    label.style.textDecoration = 'line-through';
    return;
  }

  labelInput.style.textDecoration = 'none';
}

function removeAtividadeListagem(idAtividade) {
  if(!confirm("Você tem certeza que deseja remover este item?")) return;

  const atividadesLocalstorage = transformaStringEmArray(window.localStorage.getItem('atividades'));
  const novoArray = geraArraySemAtividade(atividadesLocalstorage, idAtividade);

  if(novoArray.length < 1) {
    document.getElementById('listaAtividades').style.display = 'flex';
    const listaVaziaWarn = document.createElement("span");
    listaVaziaWarn.setAttribute("id", "semAtividades")
    listaVaziaWarn.textContent = "Não há atividades cadastradas.";
    
    document.getElementById("listaAtividades").appendChild(listaVaziaWarn);
  }

  window.localStorage.setItem('atividades', transformaArrayEmString(novoArray));
  document.getElementById(idAtividade).remove();
}

function criaNovaAtividade(nomeAtividade) {
  if(nomeAtividade == null || nomeAtividade.trim() === "") return;

  const novaAtividade = {
    id: ++idUltimaAtividadeGerada,
    description: nomeAtividade,
    checked: false
  };

  if(document.getElementById("semAtividades")) {
    document.getElementById('listaAtividades').style.display = 'list-item';
    document.getElementById("semAtividades").remove();
  }

  document.getElementsByClassName("inputInsert")[0].children[0].value = null;
  let atividadesLocalstorage = transformaStringEmArray(window.localStorage.getItem('atividades'));

  if(atividadesLocalstorage === null) {
    atividadesLocalstorage = [];
  }

  atividadesLocalstorage.push(novaAtividade);

  window.localStorage.setItem('atividades', transformaArrayEmString(atividadesLocalstorage));
  document.getElementById('listaAtividades').appendChild(geraAtividadeLocalstorage(novaAtividade));
}

function carregaAtividadesDoLocalstorage() {
  let atividades = transformaStringEmArray(window.localStorage.getItem('atividades'));

  if(atividades === null) {
    atividades = [];
  }

  const lista = document.getElementById('listaAtividades');
  
  if(atividades.length < 1) {
    lista.style.display = 'flex';

    const listaVaziaWarn = document.createElement("span");
    listaVaziaWarn.setAttribute("id", "semAtividades")
    listaVaziaWarn.textContent = "Não há atividades cadastradas.";
    
    lista.appendChild(listaVaziaWarn);
    return;
  }

  atividades.map( (atividade) => {
    lista.appendChild(geraAtividadeLocalstorage(atividade));
    idUltimaAtividadeGerada = atividade.id;
  })
}

function geraAtividadeLocalstorage(atividade) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const input = document.createElement('input');
  const labelInput = document.createElement('label');
  const buttonRemove = document.createElement('button');
  const imgButton = document.createElement('img');

  if(atividade.checked) {
    labelInput.style.textDecoration = 'line-through';
    input.defaultChecked = true;
  }
  
  imgButton.setAttribute('src', './svgs/x.svg');
  imgButton.setAttribute('alt', `Remover Item ${atividade.id}`)

  buttonRemove.addEventListener('click', () => removeAtividadeListagem(atividade.id));
  buttonRemove.appendChild(imgButton);
  
  labelInput.setAttribute("for", `item${atividade.id}`)
  labelInput.innerText = atividade.description;
  
  input.setAttribute('type', 'checkbox');
  input.setAttribute('name', `item${atividade.id}`);
  input.setAttribute('id', `item${atividade.id}`);
  input.addEventListener('click', () => alternaStatusAtividade(atividade.id));

  buttonRemove.appendChild(imgButton);
  
  span.appendChild(input);
  span.appendChild(labelInput);

  li.appendChild(span);
  li.appendChild(buttonRemove);
  li.setAttribute("id", atividade.id);

  return li;
}

function geraArraySemAtividade(array, id) {
  return array.filter( (elemento) => elemento.id !== id );
}

function transformaArrayEmString(array) {
  return JSON.stringify(array);
}

function transformaStringEmArray(string) {
  return JSON.parse(string);
}