// module externos 

import inquirer from "inquirer";
import chalk from "chalk"; 

// module internos
import fs from "fs";

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
            getAccountBalance(); 
        } else if (action === "Depositar") {
            deposit();
        } else if ( action ===  "Sacar") {
            widthdraw();           
        } else if ( action ===  "Sair") {
            console.log(chalk.bgBlue.black('Obrigado por usr o Accounts!'));
            process.exit();
        } 
        
    }).catch((err) => console.log(err))
}


//  create accont 
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso Banco!'));
    console.log(chalk.green('Defina as opçoes da sua conta a seguir'));
    buildAccount(); 
}

// nomear a conta 

function buildAccount() {
    inquirer.prompt([
        {
            name: "AccountName", 
            message: 'Digite um nome para a sua conta:'
        }
    ]).then((answer) => {
   
    const AccountName = answer['AccountName'];


    // verificaçao... diretorio onde seria o banco de dado nao existir, o if criar com o metodo mkdir  
    if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts');
    }

    // validaçao para ver se a arquivo da conta já existe
    if (fs.existsSync(`accounts/${AccountName}.json`)) {
         console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!')); 
           buildAccount() 
             return; 
    }
    // 

   fs.writeFileSync(`accounts/${AccountName}.json`, `{"balance": 0 }`, function name(err) {
     console.log(err);
   },
)

console.log(chalk.green('Parabens sua conta foi criada!'));

// e o cliente volta para  o operation

operation()

    }).catch((err) => console.log(err))
}


// add an amount to user account 

function deposit() {
    
    inquirer.prompt([
        {
            name: "accountName",
            message: 'qual o nome da sua conta ?'
        }
    ])
    .then((answer) => {

    const accountName = answer['accountName'];

    if (!checkAccount(accountName)) {
        return deposit(); 
    }

    // soamr o amount
     
    inquirer.prompt([
       {
         name: 'amount', 
         message: 'Quanto voce deseja  depositar ?',  
       }
    ])
    .then((answer) => {

    const amount = answer['amount']; 

    // add an amount 
    addAmount(accountName, amount);
    operation(); 


    } )
    .catch((err) => console.log(err))

}).catch((err) => console.log(err))

}


// checar se tem a conta 

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
       console.log(chalk.bgRed.black('esta conta nao existe, escolha outro nome!')); 
        return false;  
    }

    return true; 
}


// uma function para poder pegar e le a conta no banco de dados... 

// essa function me da os dados da conta em JSON 

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
         encoding: 'utf8', 
         flag: 'r'
    })

   return JSON.parse(accountJSON);

}



// adicionar o valores dno banco  

function addAmount(accountName, amount) {
    
    const accontData = getAccount(accountName); 

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um problema, tente novamente!'));
         return deposit();  
    }

    accontData.balance = parseFloat(amount) + parseFloat(accontData.balance);


    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accontData), function (err) {
        console.log(err);
    });

    console.log(chalk.green(`Foi depositado o valor de R$: ${amount} na sua conta!`));

}

//  show account balance 


function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual é o nome da sua conta ?'
        }
    ]).then((answer)=> {
        
    const accountName = answer['accountName']; 

    // verificy if account exists
    if (!checkAccount(accountName)) {
        return getAccountBalance();    
    }

    // reposta dos dados do banco em json 
    const accontData = getAccount(accountName);

    // mostarndo para o cliente quanto ele tem de saldo...
    console.log(chalk.bgGreen.black(`Olá, o saldo da sua conta é de R${accontData.balance}`));

   // reinicia o operation 
   operation()

    }).catch((err) => console.log(err)); 
}


// removendo o dinherio no caso sacando o dinherio, 
// widthdraw an amount from user account 

function widthdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual é o nome da sua conta ?'
        }
    ]).then((answer)=> {

    const accountName = answer['accountName'];

    // validaçao de conta
    if (!checkAccount(accountName)) {
      return widthdraw();        
    }

    // informaçoes sobre o saque... 

    inquirer.prompt([
        {
            name: 'amount',
            message: 'Quanto voce quer sacar da sua conta ?'
        }
    ]).then((answer) => {
     
    const amount = answer['amount'];


    // validaçao de conta
    if (!checkAccount(accountName)) {
        return widthdraw();        
      }
  

    
    // a function que remove as operaiton 
    removeAmount(accountName,amount);  

     // retornar a operation depois que o cliente ja scou o dinheiro
     //operation();   
    
    })
    .catch((err) => console.log(err));


    })
    .catch((err) => console.log(err));
}


function removeAmount(accountName, amount) {
     
    // pega a conta que esta como acconutName e colocar ela em json com a function ja existente getAccount 

    const accountData = getAccount(accountName); 

    // verificaçao se o usuario coloca um valor a ser sacado... se nao, vai para uma validaçao
    if (!amount) {
        console.log(
            chalk.bgRed.black(`Ocorreu um erro, tente novamente mais tarde!`)
        )
        return widthdraw();
    }

    // checar o valor disponivei de dinheiro 
    if (accountData.balance < amount) {
        console.log(chalk.bgRed.blackBright(`Este valor nao existe em sua conta!`));
          return widthdraw(); 
    }
   

    // operation matematica para poder retirar o valor do balance

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount); 

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), function (err) {
        console.log(err);
    });

    // mensaage de sucesso 


    console.log(chalk.bgGreenBright.black(`Foi efetuado o saque de R${amount} da sua conta!`));

    operation();
}


