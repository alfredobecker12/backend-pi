class noDaLista { // Classe utilizada para instanciar "nós" da lista 
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class listaVinculada { // Classe utilizada para instanciar uma lista encadeada
    constructor(head = null) { // Caso não seja informado o nó inicial, o mesmo será nulo
        this.head = head;
    }

    adicionarNo(novoNoDaLista) {
        let noAtual = this.head;

        if (noAtual) { // Caso exista um nó
            while (noAtual.next) {
                noAtual = noAtual.next;
            }
            noAtual.next = novoNoDaLista;
        } else {
            this.head = novoNoDaLista;
        }
    }

    removerPrimeiroNo() {
        let noAtual = this.head;

        if (noAtual) {
            this.head = noAtual.next;
            return "O primeiro nó foi removido.";
        } else {
            return "A lista não possui nós.";
        }
    }

    removerUltimoNo() {
        let noAtual = this.head;

        if (noAtual) {
            if (!noAtual.next) {
                this.head = null;
                return "O último nó foi removido.";
            }

            while (noAtual.next && noAtual.next.next) {
                noAtual = noAtual.next;
            }

            noAtual.next = null;
            return "O último nó foi removido.";
        } else {
            return "A lista não possui nós.";
        }
    }

    imprimirLista() {
        let noAtual = this.head;
        let resultado = '';
        while (noAtual) {
            resultado += noAtual.data + ' -> ';
            noAtual = noAtual.next;
        }
        console.log(resultado + 'null');
    }
}

