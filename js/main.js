// Array para armazenar as URLs das florzinhas
const florzinhas = [];

// Nome da base de dados do IndexedDB
const dbName = 'florzinhasDB';
// Nome da store do IndexedDB
const storeName = 'florzinhasStore';

// Função para criar a base de dados do IndexedDB
function criarDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { autoIncrement: true, keyPath: 'id' });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Função para adicionar uma florzinha ao IndexedDB
async function adicionarAnotacao() {
  const db = await criarDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  const flor = { url: florzinhas[florzinhas.length - 1].url, nome: florzinhas[florzinhas.length - 1].nome };
  store.add(flor);

  transaction.oncomplete = () => {
    console.log('Florzinha adicionada ao IndexedDB');
  };

  transaction.onerror = (event) => {
    console.error('Erro ao adicionar florzinha ao IndexedDB', event.target.error);
  };
}

// Função para buscar todas as anotações no IndexedDB
async function buscarTodasAnotacoes() {
  const db = await criarDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);

  const request = store.getAll();

  request.onsuccess = () => {
    const florzinhasNoIndexedDB = request.result;

    // Aqui você pode processar as florzinhas obtidas do IndexedDB conforme necessário
    lista(florzinhasNoIndexedDB);
  };

  request.onerror = (event) => {
    console.error('Erro ao buscar florzinhas no IndexedDB', event.target.error);
  };
}

// Função para listar as florzinhas na página
function lista(fotoFlor) {
  const galeria = document.getElementById('galeria');
  galeria.innerHTML = '';

  if (fotoFlor.length > 0) {
    fotoFlor.forEach((flor) => {
      const nomeElement = document.createElement('p');
      nomeElement.textContent = `Nome Da Flor: ${flor.nome}`;
      galeria.appendChild(nomeElement);

      const imgElement = document.createElement('img');
      imgElement.src = flor.url;
      galeria.appendChild(imgElement);
    });
  }
}

// Estabelecendo o acesso à câmera e inicializando a visualização
function cameraStart() {
  const constraints = { video: { facingMode: 'user' }, audio: false };
  const cameraView = document.getElementById('camera--view');
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error('Ocorreu um Erro.', error);
    });
}

// Carrega imagem da câmera quando a janela carregar
window.addEventListener('load', cameraStart, false);

// Event listener para o botão de adicionar anotação
document.getElementById('camera--trigger').addEventListener('click', () => {
  const cameraView = document.getElementById('camera--view');
  const cameraSensor = document.getElementById('camera--sensor');
  const cameraOutput = document.getElementById('camera--output');
  const nome = document.getElementById('nome');

  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext('2d').drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL('image/webp');
  cameraOutput.classList.add('taken');

  florzinhas.push({ url: cameraOutput.src, nome: nome.value });

  // Adiciona a anotação ao IndexedDB
  adicionarAnotacao();

  // Limpa o campo de descrição
  nome.value = '';
});

// Event listener para o botão de listar anotações
document.getElementById('listar').addEventListener('click', () => {
  // Busca todas as anotações no IndexedDB
  buscarTodasAnotacoes();
});
