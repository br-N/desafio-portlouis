import * as fs from "fs";
import * as path from "path";

export class Pedido {
  data = []; //dados brutos importados dos arquivos de texto (serão deletados depois)
  obj = []; //objetos JSON
  id; //numero do arquivo de texto
  items = []; //array com o número de todos os itens
  valor_total = 0; //soma dos valores totais de todos os itens

  constructor(file_path) {
    this.id = Number(path.parse(file_path).name.slice(-1));
    this.data = fs.readFileSync(file_path, "utf8").trim().split("\n");
  }

  ehAlfanumerico(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)
      ) {
        // lower alpha (a-z)
        return false;
      }
    }
    return true;
  }

  //converte o preço para padrão float
  converterPreco(str) {
    return Number(parseFloat(str.replace(",", ".")).toFixed(2));
  }

  //ordena de forma crescente os objetos pelo número do item
  ordenarObjetos() {
    this.obj.sort((a, b) => a.número_item - b.número_item);
  }

  //checa se todos números de item estão corretos e deleta o pedido caso contrário
  checarItens() {
    if (this.obj[this.obj.length - 1].número_item != this.obj.length) {
      console.log("Existe um número de item incorreto.");
      delete this.data;
      delete this.obj;
      delete this.items;
      delete this.id;
      return;
    }
  }

  imprimirObjetos() {
    console.log(this.obj);
  }

  criarObjetos() {
    for (let i = 0; i < this.data.length; i++) {
      let temp = JSON.parse(this.data[i]);

      temp.valor_unitário_produto = this.converterPreco(
        temp.valor_unitário_produto
      );

      if (this.items.indexOf(temp.número_item) !== -1) {
        console.log("Número de item repetido.");
        return;
      }
      this.items.push(temp.número_item);

      //verifica se o tipo dos dados estão corretos
      if (
        temp.número_item > 0 &&
        this.ehAlfanumerico(temp.código_produto) &&
        temp.quantidade_produto > 0 &&
        temp.valor_unitário_produto >= 0
      ) {
        this.obj.push(temp);
        this.obj[i]["id"] = this.id;
        this.valor_total +=
          this.obj[i].quantidade_produto * this.obj[i].valor_unitário_produto;
      } else {
        console.log("Tipo de dado errado.");
        return;
      }
    }
    this.ordenarObjetos();
    this.checarItens();
    delete this.data;
  }
}
