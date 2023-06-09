const form = document.getElementById("novoItem"); //cria uma variável carregando o formulário
const lista = document.getElementById('lista');
//const itens = [] //array criado para armazenar os itens que serão inseridos na mochila
//const itens = localStorage.getItem("itens") || [] //se houver itens no localStorage, cria um array com esses itens, caso contrário, cria um array vazio
const itens = JSON.parse(localStorage.getItem("itens")) || [] //JSON.parse() => transforma os strings armazenados em itens do array para que possam ser exibidos

//para ver os elementos armazenados no localStorage:
//itens.forEach((elemento) => {
  //  console.log(elemento.nome, elemento.quantidade);
//})
/*
Toda vez que recarrega a página, procura no localStorage todos os elementos que já estão armazenados em si e chama o método "criaElemento()", 
passando o nome e a quantidade que estão armazenados em "elemento" para montar a página com os elementos já existentes 
*/
itens.forEach((elemento) => {
   criaElemento(elemento);
})


// os dados são enviados quando ocorre o evento "submit"
/* 
Vamos ficar ouvindo o evento submit, e quando ele ocorrer, será executada uma função anônima (arrow function).
Queremos interromper o comportamento normal do evento "submit", que é enviar os dados do formulário para ele mesmo. Para isso passamos à
função anônima o "evento" a ser capturado, e modificamos seu comportamento
*/

form.addEventListener("submit", (evento) => {
    evento.preventDefault(evento); //modificando o comportamento do evento (submit), para que ele execute essa função anônima (arrow function)
    //console.log("funcionou");
    //o parâmetro "evento" possui todos os dados enviados pelo formulário, logo, contém as informações que precisamos, que estão nas tags input "nome" e input "quantidade"
    //console.log(evento); //para ver o conteúdo do "evento"
   const nome = evento.target.elements['nome'];
   const quantidade =  evento.target.elements['quantidade'];

  /*Criamos a constante "Existe" para verificar se o item digitado já existe 
  na lista,  para atualizar a tela.
  Está buscando no array (elemento.nome), algum elemento que coincida com o
  nome do item que foi digitado na caixa de texto (nome.value) */
  const existe = itens.find(elemento => elemento.nome === nome.value)

  //console.log(existe);


    // uma das formas de se chegar  nas informações que precisamos
    //console.log(evento.target[0].value);
    //console.log(evento.target[1].value);
    // Mas essa não é a melhor forma de se obter os valores, pois o formulário pode ser alterado, e adicionados novos campos.
    // a melhor forma é usar o "elements" que também está dentro do "Target". Assim não precisamos navegar usando números, podemos pegar o nome.
    //    console.log(evento.target.elements['nome'].value);
    //    console.log(evento.target.elements['quantidade'].value);
 const itemAtual = {
         "nome":nome.value,
         "quantidade":quantidade.value,
    }
   
/* vamos criar um elemento de controle dos itens.
ver  "function criaElemento()"
*/
if (existe){ //se já existe o elemento na lista 
  itemAtual.id = existe.id;
  //console.log(existe.id);
  //se já existe, tem que atualizar a quantidade desse item
  // logo, precisamos atualizar a "quantidade" deste item na nossa lista
  // para isso, criamos essa função abaixo:
  atualizaElemento(itemAtual);

  //para atualizar o localStorage, sobrescrevemos o valor anterior pelo novo
  // procura o elemento, para, em seguida, atualizar
  itens(itens.findIndex(elemento => elemento.id === id)) = itemAtual;

  } else{
    /*se o elemento não existe, 
    o id desse novo elemento será o tamanho do array existente -- essa solução 
    foi alterada, pois agora podemos também retirar itens do array, 
    e assim podemos ter os ids dos itens duplicados
    */
   //itemAtual.id = itens.length; //foi modificado, pois quando removemos itens da lista, e adicionamos novos itens, o id pode ser duplicado
   /* Se o item não existe, para definir seu "id" devemos encontrar o ÚLTIMO 
   item do array, e somarmos 1 ao id deste item.
   se ele for o primeiro item a ser adicionado ao array, atribuimos o valor
   0 (zero) ao id. Caso contrário, seu id será o id do último item do array
   mais 1.
   Verificamos se o array não está vazio antes, se estiver, o id inicial é 0 (zero).
   */
    /* operador ternário -
    Se for positivo realiza a primeira parte da operação que é encontrar o 
    ÚLTIMO elemento do array e somar 1 ao seu ID, 
    caso contrário,   o id inicial será ZERO.
    */
   itemAtual.id = itens[itens.length - 1]? (itens[itens.length-1]).id + 1 :0;



   /* chama a função que cria novos elementos dentro da Lista, 
   passando para ela os dados: nome e quantidade (armazenados em "itemAtual")
   */
    criaElemento(itemAtual);
    /* para inserir o item em um array chamado 'itens' 
    (declarado no início do código)*/
    itens.push(itemAtual);

  }


    //armazenamento do item no localStorage --> neste caso, armazena apenas um item
        //localStorage.setItem("nome",nome);
        //localStorage.setItem("quantidade",quantidade);

        //precisamos transformar o OBJETO em string, para isso usamos o método 'JSON.stringify()'
        localStorage.setItem("itens",JSON.stringify(itens));
        //limpa as caixas de texto do formulário
        nome.value='';
        quantidade.value='';
}
)

    //Agora precisamos criar mais um elemento dentro da Lista, para exibirmos a informação que foi capturada anteriormente.
    function criaElemento(item){
        //exemplo de um item da lista, que está no código html:
        // <li class="item"><strong>3</strong>Casaco</li>
        // temos um item <li class="item">   e dentro deste, um <strong>

        const novoItem = document.createElement("li"); //criei um item <li>. Contudo está sem o class "item". 
        //adicionando a class "item"
        novoItem.classList.add("item");
        //agora precisamos de um elemento com o <strong>
        const numeroItem = document.createElement("strong");
        //agora passamos a quantidade para essa const
        numeroItem.innerHTML = item.quantidade;
        //para verificar se está funcionando
        //console.log(numeroItem);


      /* criamos, usando javascript,um elemento HTML, para termos controle 
        sobre os itens que são adicionados a lista. 
        Esse elemento será usado para verificar se o item já existe
        ou não na lista de itens. (ver linha 57)
        Para isso será criado um DATA_ATTRIBUTE
      */
      numeroItem.dataset.id = item.id;

        // novoItem.innerHTML = numeroItem + nome; --> se for adicionar um novo elemento, dentro de outro, usando innerHTML, será criado um "Object". E trabalhar com "object" não é trivial. 
        // Logo, ao invés do innerHTML, usamos o "append":
        novoItem.appendChild(numeroItem);
        novoItem.innerHTML += item.nome;

        //adiciona o botão para deletar o elemento da mochila
      novoItem.appendChild(botaoDeleta(item.id));  //item.id --> é a posição, no array "itens", do elemento que queremos remover do localStorage


        //console.log(novoItem); --> innerHTML: "<strong>10</strong>camisa"
        //Agora que já temos o elemento criado, temos que adicioná-lo à Lista, para que apareça no browser.
        // Modificou o HTML atribuindo um ID para a lista. Javascript trabalhando com ids e CSS com class
        
        // const lista = document.getElementById('lista'); essa declaração foi colocada no início do código
        lista.appendChild(novoItem);

        //armazenamento do item no localStorage --> neste caso, armazena apenas um item
        //localStorage.setItem("nome",nome);
        //localStorage.setItem("quantidade",quantidade);

        //como estamos salvando 2 elementos (poderia ser mais elementos), vamos criar um objeto (dicionário) para armazenar esses elementos
       // const itemAtual = {
       //     "nome":nome,
       //     "quantidade":quantidade
       // }

        //para inserir o item em um array chamado 'itens' (declarado no início do código)
       // itens.push(itemAtual);


        //precisamos transformar o OBJETO em string, para isso usamos o método 'JSON.stringify()'
       // localStorage.setItem("itens",JSON.stringify(itens));


    }

//função para atualizar a quantidade do item da lista
function atualizaElemento(item){
  //console.log(document.querySelector("[data-id='"+item.id+"']"));
  document.querySelector("[data-id='"+item.id+"']").innerHTML= item.quantidade;
}

//função que cria um botão na lista de itens da mochila
function botaoDeleta(id){  //id --> é a posição, no array, do elemento que queremos remover do localStorage
  const elementoBotao = document.createElement("button");
  elementoBotao.innerText="X";

  /* como esse botão está sendo criado dinamicamente, para 
    capturar o evento "click", temos que adicionar,nele, o
    escutador de eventos.
    Poderíamos usar uma "arrow function", mas ela não nos permitiria
    saber qual o elemento que foi clicado, pois não carrega 
    o elemento "this" para frente.  
  
   elementoBotao.addEventListener("click", () => {
    console.log("click");
  })
  */
  /*então, usaremos uma função, para conhecer qual o elemento 
  foi clicado, através do this. */
  elementoBotao.addEventListener("click", function() {
    //console.log(this);
    //chama a função que irá deletar o item clicado
    //deletaElemento(this); se usar assim, será deletado apenas o botão, e não todo o item
    deletaElemento(this.parentNode, id); //para deletar a tag pai do botão deletar // id é a posição do item no array do localStorage
  })

  return elementoBotao;
}

function deletaElemento(tag, id){
  tag.remove(); //remove o item da lista html

  /* agora temos que remover o item do localStorage
    para isso temos que remover o item do array "itens" e 
    escrever (atualizar) o localStorage
  */

    //itens.splice("o que queremos remover","quantidade de itens");
    // findIndex(elemento => elemento.id === id) --> procura, no vetor, o item (elemento.id) que foi clicado (id)
    itens.splice(itens.findIndex(elemento => elemento.id === id),1);
    //console.log(itens); //vetor sem o elemento que foi excluído
    //agora falta escrever (atualizar) o localStorage
    localStorage.setItem("itens",JSON.stringify(itens));

}



