import { Pedido } from "./Pedido.js";
import { Nota } from "./Nota.js";
import * as fs from "fs";

export class Main {
  pedidos = [];
  notas = [];
  pendentes = [];

  //cria automaticamente um array com todos pedidos e outro com todas notas
  constructor() {
    for (let i = 0; i < 5; i++) {
      this.pedidos[i] = new Pedido(`./Pedidos/P${i + 1}.txt`);
      this.pedidos[i].criarObjetos();
    }
    for (let i = 0; i < 9; i++) {
      this.notas[i] = new Nota(`./Notas/N${i + 1}.txt`);
      this.notas[i].criarObjetos();
    }
  }

  imprimirPedidos() {
    console.log(this.pedidos);
  }

  imprimirNotas() {
    console.log(this.notas);
  }

  imprimirPendentes() {
    console.log(this.pendentes);
  }

  existePedido(pedido) {
    for (let i = 0; i < this.pedidos.length; i++) {
      if (pedido == this.pedidos[i].id) {
        return true;
      }
    }
    return false;
  }

  existeNumeroItem(numItem) {
    for (let i = 0; i < this.pedidos.length; i++) {
      if (this.pedidos[i].items.includes(numItem)) {
        return true;
      }
    }
    return false;
  }

  //verifica se par de id_pedido e número_item de uma nota existe, deletando a nota caso contrário
  checarNotas() {
    for (let i = 0; i < this.notas.length; i++) {
      for (let j = 0; j < this.notas[i].obj.length; j++) {
        if (
          !this.existePedido(this.notas[i].obj[j].id_pedido) ||
          !this.existeNumeroItem(this.notas[i].obj[j].número_item)
        ) {
          console.log(
            `Arquivo N${this.notas[i].id}.txt: Foi informado um id de pedido e/ou número de item não existente.`
          );
          delete this.notas[i].data;
          delete this.notas[i].obj;
          delete this.notas[i].id;
          break;
        }
      }
    }
  }
  //retorna a quantidade disponivel de um item de um pedido
  quantidadeDisponivel(id_pedido, numero_item) {
    for (let i = 0; i < this.pedidos[id_pedido - 1].obj.length; i++) {
      if (this.pedidos[id_pedido - 1].obj[i].número_item == numero_item) {
        return this.pedidos[id_pedido - 1].obj[i].quantidade_produto;
      }
    }
  }

  //retorna o índice do item de um pedido
  encontrarItem(id_pedido, numero_item) {
    for (let i = 0; i < this.pedidos[id_pedido - 1].obj.length; i++) {
      if (this.pedidos[id_pedido - 1].obj[i].número_item == numero_item) {
        return i;
      }
    }
  }

  //checa se há quantidade suficiente de itens para cada nota e atualiza a quantidade caso sim
  checarPedidos() {
    for (let i = 0; i < this.notas.length; i++) {
      for (let j = 0; j < this.notas[i].obj.length; j++) {
        let nova_qtde =
          this.quantidadeDisponivel(
            this.notas[i].obj[j].id_pedido,
            this.notas[i].obj[j].número_item
          ) - this.notas[i].obj[j].quantidade_produto;

        if (nova_qtde >= 0) {
          this.pedidos[this.notas[i].obj[j].id_pedido - 1].obj[
            this.encontrarItem(
              this.notas[i].obj[j].id_pedido,
              this.notas[i].obj[j].número_item
            )
          ].quantidade_produto = nova_qtde;
        } else {
          console.log(
            `Um Produto do Pedido P${this.pedidos[i].id}.txt não tem unidades suficientes para a Nota N${this.notas[i].id}.txt`
          );
        }
      }
    }
  }

  //cria o array de pedidos pendentes
  criarPendentes() {
    for (let i = 0; i < this.pedidos.length; i++) {
      let itens = [];
      let valor_saldo = 0;

      for (let j = 0; j < this.pedidos[i].obj.length; j++) {
        if (this.pedidos[i].obj[j].quantidade_produto > 0) {
          itens.push({
            número_item: this.pedidos[i].obj[j].número_item,
            saldo_qtde: this.pedidos[i].obj[j].quantidade_produto,
          });

          valor_saldo +=
            this.pedidos[i].obj[j].quantidade_produto *
            this.pedidos[i].obj[j].valor_unitário_produto;
        }
      }
      if (itens.length > 0) {
        this.pendentes.push({
          valor_total: this.pedidos[i].valor_total,
          valor_saldo: valor_saldo,
          id_pedido: this.pedidos[i].id,
          itens: itens,
        });
      }
    }
  }

  //exporta os pedidos pendentes para o arquivo pendentes.txt
  escreverPendentes() {
    try {
      fs.writeFileSync(
        "./pendentes.txt",
        JSON.stringify(this.pendentes, null, 2),
        "utf8"
      );
    } catch (err) {
      console.log(err);
    }
  }
}
