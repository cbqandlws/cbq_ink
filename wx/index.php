<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WeChat Article Scraper</title>
</head>
<body>
    <h1>WeChat Article Scraper</h1>
    <form id="scrape-form" method="POST" action="scrape.php">
        <input type="url" name="url" placeholder="Enter WeChat article URL" required />
        <button type="submit">Scrape</button>
    </form>
    <div id="article-content">
        <?php
        if (isset($_GET['content'])) {
            echo $_GET['content'];
        }
        ?>
    </div>
</body>
</html>
