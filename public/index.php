<?php
/**
 * GTR MOTORS - Dynamic Open Graph & Social Link Preview Engine
 * 
 * Works across Hostinger, Apache, LiteSpeed, NGINX, and cPanel environments.
 * Dynamically replaces og:image, og:title, og:description, twitter:image with
 * the vehicle's actual cover photo for WhatsApp, Facebook, Instagram, etc.
 */

// Enable UTF-8 encoding
header('Content-Type: text/html; charset=UTF-8');
header('X-Robots-Tag: index, follow');

// Retrieve vehicle identifier from any common query param or path
$vehicleId = '';
if (isset($_GET['veiculo']) && !empty(trim($_GET['veiculo']))) {
    $vehicleId = trim($_GET['veiculo']);
} elseif (isset($_GET['anuncio']) && !empty(trim($_GET['anuncio']))) {
    $vehicleId = trim($_GET['anuncio']);
} elseif (isset($_GET['id']) && !empty(trim($_GET['id']))) {
    $vehicleId = trim($_GET['id']);
} elseif (isset($_SERVER['REQUEST_URI'])) {
    if (preg_match('#/veiculo/([a-zA-Z0-9_-]+)#', $_SERVER['REQUEST_URI'], $matches)) {
        $vehicleId = $matches[1];
    }
}

$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    // If index.html is missing in this directory, check parent or dist
    if (file_exists(__DIR__ . '/dist/index.html')) {
        $indexPath = __DIR__ . '/dist/index.html';
    } else {
        echo '<!DOCTYPE html><html><head><title>GTR MOTORS</title></head><body><h1>GTR MOTORS</h1></body></html>';
        exit;
    }
}

$html = file_get_contents($indexPath);

if (!empty($vehicleId)) {
    $vehicles = [];
    $manifestPath = __DIR__ . '/vehicles.json';
    if (file_exists($manifestPath)) {
        $json = file_get_contents($manifestPath);
        $vehicles = json_decode($json, true) ?: [];
    }

    $matched = null;
    foreach ($vehicles as $item) {
        if (isset($item['id']) && $item['id'] === $vehicleId) {
            $matched = $item;
            break;
        }
    }

    if ($matched) {
        $brand = htmlspecialchars($matched['brand'] ?? 'GTR', ENT_QUOTES, 'UTF-8');
        $model = htmlspecialchars($matched['model'] ?? 'MOTORS', ENT_QUOTES, 'UTF-8');
        $version = htmlspecialchars($matched['version'] ?? '', ENT_QUOTES, 'UTF-8');
        $year = htmlspecialchars($matched['yearModel'] ?? '', ENT_QUOTES, 'UTF-8');
        $priceNum = isset($matched['price']) ? (float)$matched['price'] : 0;
        $priceFormatted = 'R$ ' . number_format($priceNum, 0, ',', '.');
        
        $title = "{$brand} {$model} {$version} ({$year}) | GTR MOTORS";
        $desc = "Confira este {$brand} {$model} {$version} {$year} por apenas {$priceFormatted} na GTR MOTORS. Veículo revisado com garantia de procedência.";

        $photos = $matched['photos'] ?? [];
        $coverPhoto = (!empty($photos) && is_array($photos)) ? $photos[0] : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop';

        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'] ?? 'gtrmotors.vitrinecars.com.br';
        $fullUrl = $protocol . $host . ($_SERVER['REQUEST_URI'] ?? "/?veiculo=" . urlencode($vehicleId));

        // 1. Replace Title tag
        $html = preg_replace('/<title>.*?<\/title>/is', '<title>' . $title . '</title>', $html);

        // 2. Replace meta description
        $html = preg_replace('/<meta\s+name=["\']description["\']\s+content=["\'].*?["\']\s*\/?>/is', '<meta name="description" content="' . htmlspecialchars($desc, ENT_QUOTES, 'UTF-8') . '" />', $html);

        // 3. Replace og:title
        $html = preg_replace('/<meta\s+property=["\']og:title["\']\s+content=["\'].*?["\']\s*\/?>/is', '<meta property="og:title" content="' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '" />', $html);

        // 4. Replace og:description
        $html = preg_replace('/<meta\s+property=["\']og:description["\']\s+content=["\'].*?["\']\s*\/?>/is', '<meta property="og:description" content="' . htmlspecialchars($desc, ENT_QUOTES, 'UTF-8') . '" />', $html);

        // 5. Replace og:url
        $html = preg_replace('/<meta\s+property=["\']og:url["\']\s+content=["\'].*?["\']\s*\/?>/is', '<meta property="og:url" content="' . htmlspecialchars($fullUrl, ENT_QUOTES, 'UTF-8') . '" />', $html);

        // 6. Replace og:image with comprehensive preview meta tags for WhatsApp / Facebook
        $ogImageTags = '<meta property="og:image" content="' . htmlspecialchars($coverPhoto, ENT_QUOTES, 'UTF-8') . '" />' . "\n" .
                       '    <meta property="og:image:secure_url" content="' . htmlspecialchars($coverPhoto, ENT_QUOTES, 'UTF-8') . '" />' . "\n" .
                       '    <meta property="og:image:type" content="image/jpeg" />' . "\n" .
                       '    <meta property="og:image:width" content="1200" />' . "\n" .
                       '    <meta property="og:image:height" content="630" />' . "\n" .
                       '    <meta property="og:image:alt" content="' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '" />';
        $html = preg_replace('/<meta\s+property=["\']og:image["\']\s+content=["\'].*?["\']\s*\/?>/is', $ogImageTags, $html);

        // 7. Twitter Card tags
        $html = preg_replace('/<meta\s+name=["\']twitter:title["\']\s+content=["\'].*?["\']\s*\/?>/is', '<meta name="twitter:title" content="' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '" />', $html);
        $html = preg_replace('/<meta\s+name=["\']twitter:description["\']\s+content=["\'].*?["\']\s*\/?>/is', '<meta name="twitter:description" content="' . htmlspecialchars($desc, ENT_QUOTES, 'UTF-8') . '" />', $html);
        $html = preg_replace('/<meta\s+name=["\']twitter:image["\']\s+content=["\'].*?["\']\s*\/?>/is', '<meta name="twitter:image" content="' . htmlspecialchars($coverPhoto, ENT_QUOTES, 'UTF-8') . '" />', $html);
    }
}

echo $html;
