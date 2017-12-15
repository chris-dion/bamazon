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

var options = [
	{
      type: 'list',
      name: 'opt',
      message: 'What type of information are you wanting to view.',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
      filter: function(val) {
        return val.toLowerCase();
      }
    }
];

var add_inven_questions = [
	{
		type: "input",
		name: "choose_item",
		message: "What item do you want to add more of? (type item_id): "
	},
	{
		type: "input",
		name: "add_inventory",
		message: "How much do you want to add? :"
	}
];

var add_product = [
	{
		type: "input",
		name: "new_name",
		message: "What is the name of the product? :"
	},
	{
		type: "input",
		name: "new_department",
		message: "What department does this item belong to? : "
	},
	{
		type: "input",
		name: "new_price",
		message: "How much does this item cost? : "
	},
	{
		type: "input",
		name: "new_stock",
		message: "How do you have in stock? : "
	}
];


var inventory = function (){
	var query = "";


	 inquirer
    .prompt(options).then(function(answer){

    	if(answer.opt === "view products for sale"){
    		query = "SELECT * FROM products";
			connection.query(query, function(err, res) {
				for(var i = 0; i<res.length; i++){
					console.log("\n\nitem_id: "+res[i].item_id+" || product_name: "+res[i].product_name+" || department_name: " + res[i].department_name + " || price: " + res[i].price + " || stock_quanity: " + res[i].stock_quantity + "\n");
				}
			});

    	}else if(answer.opt === "view low inventory"){
    		query = "SELECT * FROM products WHERE stock_quantity <= 5";
			connection.query(query, function(err, res) {
				for(var i = 0; i<res.length; i++){
					console.log("\n\nitem_id: "+res[i].item_id+" || product_name: "+res[i].product_name+" || department_name: " + res[i].department_name + " || price: " + res[i].price + " || stock_quanity: " + res[i].stock_quantity + "\n");
				}
			});

    	}else if(answer.opt === "add to inventory"){

			inquirer
		    .prompt(add_inven_questions).then(function(answer2){
		    	var choose_item = answer2.choose_item;
		    	var add_inventory = answer2.add_inventory;

	    		query = "SELECT * FROM products WHERE ?";
				connection.query(query, {item_id: choose_item}, function(err, res) {
					var new_amount = parseInt(res[0].stock_quantity) + parseInt(add_inventory);
					console.log(new_amount);
					query = "UPDATE products SET ? WHERE ?"
					connection.query(query, [{stock_quantity: new_amount}, {item_id: choose_item}], function(err2, res2){

					}); 
				});

		    });

    	}else if(answer.opt === "add new product"){
    		inquirer
		    .prompt(add_product).then(function(answer3){
		    	var new_name = answer3.new_name;
		    	var new_department = answer3.new_department;
		    	var new_price = answer3.new_price;
		    	var new_stock = answer3.new_stock;
		    	query = "INSERT INTO products ( product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";
		    	connection.query(query, [new_name, new_department, new_price, new_stock], function(err2, res2){

				}); 
		    });
    	}else{
    		console.log("error");
    	}
    });
}