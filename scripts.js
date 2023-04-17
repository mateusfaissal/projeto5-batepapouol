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

function buscarMensagens () {
    const promessa = axios.get ('https://mock-api.driven.com.br/api/vm/uol/messages');
    promessa.then(processarMensagens);
    promessa.catch (erroAoBuscarMensagens);
       
}
buscarMensagens();

function processarMensagens (resposta) {
    console.log(resposta);

    mensagens = resposta.data;
    console.log (mensagens);

    renderizaMensagens();
}

//setInterval(processarMensagens, 3000);

function erroAoBuscarMensagens(erro) {
    console.log ('deu ruim')
}



function renderizaMensagens () {
    const ulMensagens = document.querySelector('.chat');
    ulMensagens.innerHTML = '';

    for (let i = 0; i < mensagens.length; i++) {
        let mensagem = mensagens [i];
        
        ulMensagens.innerHTML += `
        <li data-test="message" class="mensagens">(${mensagem.time})  <strong>${mensagem.from}</strong>
        para ${mensagem.to}:${mensagem.text}</li>
        `
    }
}

function perguntaNome() {
    const nome = {name:`${nomeUsuario}`};
    console.log (nome);

    const promessa = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants',nome);
    promessa.then(receberResposta);
    promessa.catch(deuErro);
}
perguntaNome();

function receberResposta(resposta) {
    console.log ("O nome foi cadastrado com sucesso!");
    console.log (resposta);
}


function deuErro(erro) {
    if (erro.response.status != 200) {
        prompt('Digite outro nome');
    }
    console.log("deu algum problema");
    console.log (erro);
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
    console.log('mensagem foi salva');

    const promessa = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promessa.then(mensagemChegou);
}

function mensagemChegou (mostrar) {
    mensagens = mostrar.data;
    renderizaMensagens();
}

function naoRecebeMensagem (nao) {
    console.log('mensagem nao foi salva');
}