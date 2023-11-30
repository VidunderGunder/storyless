extern crate serde_json as json;
use std::fs;

fn main() {
    let a_str = fs::read_to_string("src/tests/shallow/example.json");
    match a_str {
        Ok(_) => println!("File read successfully"),
        Err(_) => println!("Error reading file"),
    }
    let a: json::Value = serde_json::from_str(&a_str.unwrap()).unwrap();

    let b_str = fs::read_to_string("src/tests/shallow/example.override.json");
    match b_str {
        Ok(_) => println!("File read successfully"),
        Err(_) => println!("Error reading file"),
    }
    let b: json::Value = serde_json::from_str(&b_str.unwrap()).unwrap();

    // TODO: Override a with b
    let c = json::json!({});
    println!("{}", c);
}
