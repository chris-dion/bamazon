var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "192837465RooT!",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  inventory();
});

var questions = [
	{
    	type: "input",
    	name: "itemID",
    	message: "What is the ID of the item you want to buy? : ",
    },
    {
    	type: "input",
    	name: "num_item",
    	message: "How much do you want to buy of this item? :"
    }
]

function inventory(){

	 inquirer
    .prompt(questions).then(function(answer){
    	var id = answer.itemID;
    	var purchase = parseInt(answer.num_item);
    	var query = "SELECT * FROM products WHERE ?";
    	connection.query(query, { item_id: id }, function(err2, res2) {
    		var amount = parseInt(res2[0].stock_quantity);
    		var price = parseInt(res2[0].price);

    		if(purchase <= amount){
    			amount = amount - purchase;
    			var update = "UPDATE products SET ? WHERE ?";
				connection.query(update, [{stock_quantity: amount}, {item_id: id}], function(err3, res3){
				});
				console.log("your total comes to : " + (purchase * price));
    		}else{
    			console.log("We don't have enough "+res2[0].product_name + " for your order.")
    		}

    		//console.log(res2);
    	});
    });
}