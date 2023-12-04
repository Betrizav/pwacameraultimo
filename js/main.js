//Array para armazenar as URLs das florzinhas
const florzinhas = [];

// registrando a service worker
if ('serviceWorker' in navigator) {
window.addEventListener('load', async () => {
  try {
    let reg;
    reg = await navigator.serviceWorker.register('/sw.js', { type: 'module' });

    console.log('Service worker registrada! 😎', reg);
  } catch (err) {
    console.log('😥 Service worker registro falhou: ', err);
  }
});
}

// configurando as constraintes do video stream
var constraints = { video: { facingMode: 'user' }, audio: false };

// capturando os elementos em tela
const cameraView = document.querySelector('#camera--view'),
cameraOutput = document.querySelector('#camera--output'),
cameraSensor = document.querySelector('#camera--sensor'),
cameraTrigger = document.querySelector('#camera--trigger'),
listar = document.getElementById('listar'),
galeria = document.getElementById('galeria'),
nome = document.getElementById('nome'),
data = document.getElementById('data');

// Estabelecendo o acesso à câmera e inicializando a visualização
function cameraStart() {
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (stream) {
    let track = stream.getTracks()[0]; // Correção: getTracks é uma função
    cameraView.srcObject = stream;
  })
  .catch(function (error) {
    console.error('Ocorreu um Erro.', error);
  });
}

// Função para tirar foto
cameraTrigger.onclick = function () {
cameraSensor.width = cameraView.videoWidth;
cameraSensor.height = cameraView.videoHeight;
cameraSensor.getContext('2d').drawImage(cameraView, 0, 0);
cameraOutput.src = cameraSensor.toDataURL('image/webp');
cameraOutput.classList.add('taken');



// Adiciona a URL da foto ao array
florzinhas.push({ url: cameraOutput.src, nome: nome.value });

// Limpa o campo de descrição
nome.value = '';
};

// Função para salvar a foto
listar.onclick = function () {
// Limpa a div antes de adicionar as novas imagens
galeria.innerHTML = '';

// Verifica se há pelo menos uma foto tirada
if (florzinhas.length > 0) {
  const Flor = florzinhas[florzinhas.length - 1];

   // Adiciona a descrição como um parágrafo abaixo da foto
   const nomeElement = document.createElement('p');
   nomeElement.textContent = `Nome Da Flor: - ${Flor.nome}`;
   galeria.appendChild(nomeElement);
 
  // Cria elemento de imagem para a última foto
  const imgElement = document.createElement('img');
  imgElement.src = Flor.url;
  galeria.appendChild(imgElement);

 
} 
};


// Função para buscar e processar as fotos
function lista(fotoFlor){
// Exibe os dados no console
console.log(fotoFlor);

// Se existirem fotos, gera HTML para exibição
if(fotoFlor){
  const divLista = fotoFlor.map(flores => {
    return `<div>
        <p>Anotação</p>
        <p>${flores.nome} - ${flores.data}</p>
        <img src="${flores.Imagens}"/>
      </div>`;
  });
  
  // Chama a função listagem para exibir os resultados no DOM
  listagem(divLista.join(''));
}
}

// Função para exibir os resultados no DOM
function listagem(text){
// Exibe os resultados no console
console.log(text);
};  

// Carrega imagem da câmera quando a janela carregar
window.addEventListener('load', cameraStart, false);