

class  NegociacaoController{

        constructor(){
            let $ = document.querySelector.bind(document);
            this._inputData = $('#data');
            this._inputQuantidade = $('#quantidade');
            this._inputValor = $('#valor');

            this._listaNegociacoes = new Bind (new ListaNegociacoes(),
                                     new  NegociacoesView($('#negociacoesView')),
                                     'adiciona', 'esvazia');
      
            this._mensagem =new Bind( new Mensagem(),
                                     new MensagemView($('#mensagemView')),
                                     'texto');  
        }

    adiciona(event){   
        
                event.preventDefault(); 
                this._listaNegociacoes.adiciona(this._criaNegociacao());
                this._mensagem.texto ='Negociacao adicionada com sucesso';
                this._limpaFormulario();  

                }

    apaga(){
                this._listaNegociacoes.esvazia();
                this._mensagem.texto='Negociações apagadas com sucesso';
    }

    _criaNegociacao(){
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value);
     }


        importaNegociacoes(){
         let  xhr = new XMLHttpRequest();

         /* configurações*/
         xhr.open('GET','negociacoes/semana');

                        /* Estado Possiveis de uma requisição AJAX
                        0: requisição ainda não iniciada
                        1: conexão com o servidor estabelecida
                        2: requisição recebida
                        3: processando requisição
                        4: requisição está concluída e a resposta está pronta                  
                        */
          xhr.onreadystatechange =() => {
            if(xhr.readyState == 4){

                if(xhr.status == 200){
                    console.log('Obtendo as negociações do servidor.');
                   
                    JSON.parse(xhr.responseText)
                    .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
                    .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                    this._mensagem.texto = 'Negociacoes Importadas';       
              
                } else {
             
                    console.log(xhr.responseText);
                    this._mensagem.texto = 'Não foi possivel obter as negociacoes';
                }
            }
          }             


         /* executa */
         xhr.send();

     }

    _limpaFormulario()
    {
        this._inputData.value = '';
        this._inputQuantidade.value =1;
        this._inputValor.value =0.0;

        this._inputData.focus();
    }
}
