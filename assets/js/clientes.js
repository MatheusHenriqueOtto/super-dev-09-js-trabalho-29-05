const urlBase = "https://api.franciscosensaulas.com/api/v1/locadora/clientes"
const botaoAdicionar = document.getElementById("botao-adicionar");
botaoAdicionar.addEventListener("click", adicionarCliente);
const botaoPesquisar = document.getElementById("botao-pesquisar");
botaoPesquisar.addEventListener("click", pesquisarCliente);
const caixaTabela = document.getElementById("caixa-tabela-apresentacao");
const corpoTabela = document.getElementById("corpo-tabela");

const campoNome = document.getElementById("input-nome");
const campoId = document.getElementById("input-id");
const campoCpf = document.getElementById("input-cpf");
let idParaEditar = -1;

function adicionarCliente(){
    const nome = campoNome.value.trim();
    const cpf = campoCpf.value.trim();

    if (nome.length <= 2){
        alert("Nome inválido, tem que ter mais que dois caracteres");
        campoNome.value = "";
        return;
    } else if (cpf.length === 0){
        alert("Valor do campo CPF inválido");
        campoCpf.value = "";
        return;
    }
    
    const dados = {
        nome: nome,
        cpf: cpf
    }

    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(async response => {
        console.log("Status recebido:", response.status);
        
        if (response.status === 201 || response.status === 200) {
            alert("Cliente cadastrado com sucesso");
            limparCampos();
        } else {
            const textoErro = await response.text();
            console.error("Conteúdo detalhado do Erro 500:", textoErro);
            alert(`Erro do servidor (${response.status}): Não foi possível cadastrar o cliente.`);
        }
    })
    .catch(error => {
        console.error("Erro na requisição HTTP: " + error);
    });

    limparCampos();
    listarClientes();

}


function limparCampos(){
    campoNome.value = "";
    campoId.value = "";
    campoCpf.value = "";
}

function pesquisarCliente(){
    const id = campoId.value.trim();
    if (id === "") {
        listarClientes();
        return;
    }

    const url = `${urlBase}/${id}`;
    corpoTabela.innerHTML = "";

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Cliente não encontrado");
            return response.json();
        })
        .then(cliente => {
            if (cliente) {
                criarLinha(cliente);
                adicionarCliqueBotoesLinhas();
            } else {
                alert("Cliente não encontrado.");
                listarClientes();
            }
        })
        .catch(error => {
            console.error("Erro ao pesquisar cliente: " + error);
            alert("Cliente não encontrado ou erro na pesquisa.");
            listarClientes();
        });
}


function listarClientes() {
    corpoTabela.innerHTML = "";


    fetch(urlBase)
        .then(response => response.json())
        .then(clientes => {
            for (let i = 0; i < clientes.length; i++) {
                const cliente = clientes[i];
                criarLinha(cliente);
            }
            adicionarCliqueBotoesLinhas();
        })
        .catch(error => {
            console.error("Erro ao listar clientes: " + error);
            alert("Ocorreu um erro ao tentar listar os clientes");
        })
}

function criarLinha(clientes) {
    const linha = `<tr>
        <td>${clientes.id}</td>
        <td>${clientes.nome}</td>
        <td>${clientes.cpf}</td>
        <td>
            <button class="botao-editar" data-id="${clientes.id}">Editar</button>
            <button class="botao-apagar" data-id="${clientes.id}">Apagar</button>
        </td>
    </tr>`
    corpoTabela.innerHTML = corpoTabela.innerHTML + linha;
}

function adicionarCliqueBotoesLinhas() {
    const botoesApagar = document.getElementsByClassName("botao-apagar");
    for (let i = 0; i < botoesApagar.length; i++) {
        const botaoApagar = botoesApagar[i];
        botaoApagar.addEventListener("click", apagarCliente);
    }
    
    const botoesEditar = document.getElementsByClassName("botao-editar");
    for (let i = 0; i < botoesEditar.length; i++) {
        const botaoEditar = botoesEditar[i];
        botaoEditar.addEventListener("click", preencherCamposParaEditar);
    }
}

function preencherCamposParaEditar(evento) {
    const botaoEditar = evento.target;
    idParaEditar = botaoEditar.getAttribute("data-id");
    const url = `${urlBase}/${idParaEditar}`;

    fetch(url)
        .then(response => response.json())
        .then(cliente => {
            campoNome.value = cliente.nome;
            campoCpf.value = cliente.cpf;
        })
        .catch(error => {
            console.error("Erro ao buscar cliente para edição: " + error);
            alert("Ocorreu um erro ao tentar buscar o cliente");
        })
}

function apagarCliente(evento) {
    const botaoApagar = evento.target;
    const idParaApagar = botaoApagar.getAttribute("data-id");
    const confirmacaoApagar = confirm("Deseja realmente apagar?");
    if(confirmacaoApagar !== true){
        return;
    }
    const url = `${urlBase}/${idParaApagar}`
    fetch(url, {
        method: "DELETE"
    })
        .then(response => {
            if (response.status === 204) {
                alert("Cliente apagado com sucesso");
                listarClientes();
            } else {
                alert("Não foi possível apagar o cliente");
            }
        })
        .catch(error => {
            console.error("Erro ao apagar cliente: " + error);
            alert("Ocorreu um erro ao tentar apagar o cliente");
        })
}

listarClientes();