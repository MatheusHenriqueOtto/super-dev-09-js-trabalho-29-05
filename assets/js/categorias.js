const botaoSalvar = document.getElementsByClassName("botao-salvar")[0];

botaoSalvar.addEventListener("click", salvarCategoria);

const campoNome = document.getElementById("campo-nome");
const campoDescricao = document.getElementById("campo-descricao");

const corpoTabela = document.getElementById("categorias");

const urlBase = "https://api.franciscosensaulas.com/api/v1/locadora/categorias";

let idParaEditar = -1;

function salvarCategoria(evento) {

    evento.preventDefault();

    const nome = campoNome.value.trim();
    const descricao = campoDescricao.value.trim();

    if (nome.length < 3) {
        alert("Digite uma categoria válida");
        return;
    }

    if (idParaEditar === -1) {
        cadastrarCategoria(nome, descricao);
    }
    else {
        editarCategoria(nome, descricao);
    }
}

function limparCampos() {

    campoNome.value = "";
    campoDescricao.value = "";

    idParaEditar = -1;
}

function cadastrarCategoria(nome, descricao) {

    const dados = {
        nome: nome,
        descricao: descricao
    };

    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
        .then(response => {

            if (response.ok) {

                alert("Categoria cadastrada");

                limparCampos();

                listarCategorias();
            }
            else {
                alert("Erro ao cadastrar");
            }
        })
        .catch(error => {

            console.error(error);

            alert("Erro ao cadastrar");
        });
}

function editarCategoria(nome, descricao) {

    const dados = {
        nome: nome,
        descricao: descricao
    };

    fetch(`${urlBase}/${idParaEditar}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
        .then(response => {

            if (response.ok) {

                alert("Categoria alterada");

                limparCampos();

                listarCategorias();
            }
            else {
                alert("Erro ao alterar");
            }
        })
        .catch(error => {

            console.error(error);

            alert("Erro ao alterar");
        });
}

function listarCategorias() {

    corpoTabela.innerHTML = "";

    fetch(urlBase)
        .then(response => response.json())
        .then(categorias => {

            for (let i = 0; i < categorias.length; i++) {

                criarLinha(categorias[i]);
            }

            adicionarCliqueBotoesLinhas();
        })
        .catch(error => {

            console.error(error);

            alert("Erro ao listar categorias");
        });
}

function criarLinha(categoria) {

    const linha = `
        <tr>
            <td>${categoria.id}</td>
            <td>${categoria.nome}</td>
            <td>${categoria.descricao}</td>
            <td>
                <button class="botao-editar" data-id="${categoria.id}">
                    Editar
                </button>

                <button class="botao-apagar" data-id="${categoria.id}">
                    Apagar
                </button>
            </td>
        </tr>
    `;

    corpoTabela.innerHTML += linha;
}

function adicionarCliqueBotoesLinhas() {

    const botoesEditar =
        document.getElementsByClassName("botao-editar");

    for (let i = 0; i < botoesEditar.length; i++) {

        botoesEditar[i].addEventListener(
            "click",
            preencherCamposParaEditar
        );
    }

    const botoesApagar =
        document.getElementsByClassName("botao-apagar");

    for (let i = 0; i < botoesApagar.length; i++) {

        botoesApagar[i].addEventListener(
            "click",
            apagarCategoria
        );
    }
}

function preencherCamposParaEditar(evento) {

    idParaEditar =
        evento.target.getAttribute("data-id");

    fetch(`${urlBase}/${idParaEditar}`)
        .then(response => response.json())
        .then(categoria => {

            campoNome.value = categoria.nome;
            campoDescricao.value = categoria.descricao;
        });
}

function apagarCategoria(evento) {

    const id =
        evento.target.getAttribute("data-id");

    const confirmar =
        confirm("Deseja apagar esta categoria?");

    if (confirmar !== true) {
        return;
    }

    fetch(`${urlBase}/${id}`, {
        method: "DELETE"
    })
        .then(response => {

            if (response.ok) {

                alert("Categoria apagada");

                listarCategorias();
            }
            else {
                alert("Erro ao apagar");
            }
        });
}

listarCategorias();