import * as fs from "fs";
import * as path from "path";

export class Nota {
  data = []; //dados brutos importados dos arquivos de texto (serão deletados depois)
  obj = []; //objetos JSON
  id; //numero do arquivo de texto

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

  imprimirObjetos() {
    console.log(this.obj);
  }

  criarObjetos() {
    for (let i = 0; i < this.data.length; i++) {
      let temp = JSON.parse(this.data[i]);

      //verifica se o tipo dos dados estão corretos
      if (
        this.ehAlfanumerico(temp.id_pedido) &&
        temp.número_item > 0 &&
        temp.quantidade_produto > 0
      ) {
        this.obj.push(temp);
        this.obj[i]["id"] = this.id;
      } else {
        console.log("Tipo de dado errado.");
        return;
      }
    }
    delete this.data;
  }
}
