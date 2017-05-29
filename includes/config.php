<?php
// Параметры для подключения
$host = 'localhost';
$user = 'root';
$password = '';
$bd = 'bankir';

//создание переменных
$login = htmlspecialchars($_POST["name"]);
$email = htmlspecialchars($_POST["email"]);
$pass = htmlspecialchars($_POST["pass"]);