// module externos 

import inquirer from "inquirer";
import chalk from "chalk"; 

// module internos
import fs from "fs";


// invocando  a function  
operation();


function operation() {
    inquirer.prompt([
        {
        type: 'list',
        name: 'action', 
        message: 'o que voce deseja fazer?', 
        choices: [
            "Criar Conta",
            "Consulta saldo",
            "Depositar",
            "Sacar",
            "Sair"
        ]
        }, 

    ]).then((answer) => {
        const action = answer['action']
 
        if (action === "Criar Conta") {
            createAccount(); 
        } else if (action === "Consulta saldo") {
          //   getAccountBalance(); 
        } else if (action === "Depositar") {
        //    deposit();
        } else if ( action ===  "Sacar") {
          //  widthdraw();           
        } else if ( action ===  "Sair") {
            console.log(chalk.bgBlue.black('Obrigado por usr o Accounts!'));
            process.exit();
        } 
        
    }).catch((err) => console.log(err))
}


const createAccount = () => {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso Banco!'));
    buildAccount(); 
}; 


const buildAccount = () => {
     inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Informe seus dados para a criaçao de sua Conta, escolha uma das opçoes: ", 
            choices: [
                 "Crie um nome para sua conta: Ex: joao1234@",
                 "Informe seu nome completo",
                 "Informe sua data de nascimento",
                 "Informe seu CPF",
                 "Crie uma senha para seu acesso, com 4 digitos ****",
                 "Informe o numero de seu cartao", 
            ]
        },
    ]).then((answer) => {

    // qual das açoes o usuario escolheu 
    const action =  answer['action']; 
         
    switch (action) {
    case "Crie um nome para sua conta: Ex: joao1234@":
        createName(); 
      break;
    case "Informe seu nome completo":
        createNameFull(); 
      break;
    case "Informe sua data de nascimento":
        addDate(); 
      break;
    case "Informe seu CPF":
        addCodePerson(); 
      break;
    case "Crie uma senha para seu acesso, com 4 digitos ****":
        createPassWord(); 
      break;  
    case "Informe o numero de seu cartao":
        addCardCode(); 
      break;         
    default:
      console.log(chalk.bgRed.blackBright('Escolha uma das opiçoes de cadastro')); 
      process.exit();
  }

   }).catch((err) => console.log(err)); 
}; 

//  criar o nome da conta 

const createName = () => {
    inquirer.prompt([
        {
            name: "AccountName",
            message: "Digite o nome da sua conta: Ex: joao1234@ "
        }
    ]).then((answer) => {

    const AccountName = answer['AccountName']; 

    // verificaçao para receber o nome
     if (!AccountName) {
        console.log(chalk.bgRed.blackBright('Digite um nome para sua conta...'));
        return createName(); 
     }     

    // verificar diretorio

    if (!fs.existsSync('AccountName')) {
        fs.mkdirSync('AccountName'); 
    } 
 
    // validaçao para ver se a arquivo da conta já existe
    if (fs.existsSync(`AccountName/${AccountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!')); 
          buildAccount();  
            return; 
   } 
             
    // function que cria a function para poder gerar um dado de balanço no na conta 
    fs.writeFileSync(`AccountName/${AccountName}.json`, `{"AccountName": "${AccountName}"}`, function name(err) {
        console.log(err);
      }, 
)
 
  buildAccount(); 
 
    }).catch((err) => { console.log(err)}); 
};  


