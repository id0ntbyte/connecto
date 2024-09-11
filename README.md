# Connecto

Connecto is a Linktree clone that has been written using Vue JS and PHP.

## Installation

To Install, make sure you have apache and mysql installed and just clone the repo and move it to the www folder in your apache server

```bash
git clone https://github.com/id0ntbyte/connecto
```
You can also use the database.sql file provided to create the database required for the project to work properly by importing it in PhpMyAdmin or from the terminal by running
```
mysql -u username -p < /path/to/database.sql
```
Make sure to replace username to your Mysql username

Lastly rename `config.php.example` to `config.php` and update the all data to your mysql server and messaging endpoint

## Usage
To use Connecto, insert a new user into the database or you can also test the application with `12345678900` as the phone number as well

## Features

- Fully customize links styling on hover and regular view
- Unlimited Links
- Cross Platform
- Realtime Update

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)