<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $url = $_POST['url'];

    if (filter_var($url, FILTER_VALIDATE_URL)) {
        $html = file_get_contents($url);
        if ($html === FALSE) {
            echo "Failed to retrieve the URL.";
            exit;
        }

        // 使用 DOMDocument 和 DOMXPath 解析 HTML
        $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML($html);
        libxml_clear_errors();
        
        $xpath = new DOMXPath($doc);
        
        // 假设文章内容在 class 为 'rich_media_content' 的 div 中
        $nodes = $xpath->query("//*[contains(@class, 'rich_media_content')]");
        if ($nodes->length > 0) {
            $articleContent = $doc->saveHTML($nodes->item(0));
        } else {
            echo "Article content not found.";
            exit;
        }

        // 重定向回首页并显示内容
        header('Location: index.php?content=' . urlencode($articleContent));
        exit;
    } else {
        echo "Invalid URL.";
    }
} else {
    echo "Invalid request method.";
}
?>
