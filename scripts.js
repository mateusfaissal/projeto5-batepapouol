const nome = [];

let mensagens = [{
	from: "",
	to: "",
	text: "",
    time: "",
	type: ""
}];

const nomeUsuario = prompt('Digite seu nome!');

axios.defaults.headers.common['Authorization'] = 'qeRpsB2zNVDv01ukC7PLgfMR';


function perguntaNome() {
    const nome = {name:`${nomeUsuario}`};

    const promessa = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants',nome);
    promessa.then(receberResposta);
    promessa.catch(deuErro);
}
perguntaNome();

function receberResposta(resposta) {
    console.log (resposta);
    buscarMensagens();
}


function deuErro(erro) {
    if (erro.response.status != 200) {
        prompt('Digite outro nome');
        window.location.reload();
    }
    console.log (erro);
}


function buscarMensagens () {
    const promessa = axios.get ('https://mock-api.driven.com.br/api/vm/uol/messages');
    promessa.then(processarMensagens);
    promessa.catch (erroAoBuscarMensagens);
       
}


function processarMensagens (resposta) {

    mensagens = resposta.data;
    
    renderizaMensagens();
}

setInterval(buscarMensagens, 3000);

function erroAoBuscarMensagens(erro) {
    console.log (erro);
}



function renderizaMensagens () {
    const ulMensagens = document.querySelector('.chat');
    ulMensagens.innerHTML = '';

    for (let i = 0; i < mensagens.length; i++) {
        let mensagem = mensagens [i];
        
        ulMensagens.innerHTML += `
        <li data-test="message" class="mensagens"> 
        <p class = "time"> (${mensagem.time}) </p>
        <p class = "from"> ${mensagem.from} </p>
        <p class = "to"> para ${mensagem.to}: </p>
        <p class = "text"> ${mensagem.text}</li> </p>
        `
    }
}

function verificaConexao() {
    const nome = {name:`${nomeUsuario}`};
    const promessa = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', nome);
    promessa.then(response => {
        console.log('Usuário está online');
      })
      promessa.catch(error => {
        console.log('Usuário está offline');
      });
    
} 

setInterval (verificaConexao, 5000);

function enviarMensagens() {
    const campoMensagem = document.querySelector('.mensagem-digitada');

    const minhaMensagem = {
        
            from: `${nomeUsuario}`,
            to: "Todos",
            text: campoMensagem.value,
            type: "message"
        
    }

    
    const promessa = axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', minhaMensagem);
    promessa.then(receberMensagem);
    promessa.catch(naoRecebeMensagem);

}

function receberMensagem (res) {
   
    const promessa = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promessa.then(mensagemChegou);
}

function mensagemChegou (mostrar) {
    mensagens = mostrar.data;
    renderizaMensagens();
}

function naoRecebeMensagem (nao) {
    if (nao.error.code === "ERR_Network") {
        alert('Mensagem não foi salva');
        window.location.reload();
    }
}
