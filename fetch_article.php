<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $url = $_POST['url'];

    // 使用cURL获取网页内容
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $html = curl_exec($ch);
    curl_close($ch);

    if ($html === false) {
        echo "Failed to fetch the page.";
        exit;
    }

    // 使用DOMDocument和DOMXPath解析HTML内容
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML($html);
    libxml_clear_errors();

    $xpath = new DOMXPath($doc);

    // 提取文章标题
    $titleNode = $xpath->query("//h1[contains(@class, 'rich_media_title')]");
    $title = $titleNode->item(0) ? trim($titleNode->item(0)->textContent) : "No Title";

    // 提取文章内容
    $contentNode = $xpath->query("//div[contains(@class, 'rich_media_content')]");
    $content = $contentNode->item(0) ? $doc->saveHTML($contentNode->item(0)) : "No Content";

    // 生成HTML格式内容
    $htmlContent = "<html><head><meta charset='utf-8'><title>$title</title></head><body>$content</body></html>";

    // 保存HTML文件
    $filename = "w.html";
    file_put_contents($filename, $htmlContent);

    echo "Article saved as $filename";
}
?>