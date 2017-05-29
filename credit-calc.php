<?php
$title = "Кредитный калькулятор";
require_once 'templates/header.php';
?>
    <header class="main-header">
        <nav class="navbar navbar-static-top" role="navigation">
            <ul class="calc">
                <li><i class="fa fa-calculator" aria-hidden="true"></i></li>
                <li><a  href="deposit-calc.php">Депозитный</a></li>
                <li><span>Кредитный</span></li>
            </ul>
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li><a href="/">Мой кабинет</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <div class="container calc-page">

    </div>
</div>
<script src="js/jquery.js"></script>
<script src="js/deposit-calc.js"></script>
</body>
</html>