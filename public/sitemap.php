<?php

$backendBase = rtrim(getenv('RESUME_SATHI_BACKEND_BASE') ?: 'https://api.resumesathi.com', '/');
$frontendBase = rtrim(getenv('RESUME_SATHI_FRONTEND_BASE') ?: 'https://www.resumesathi.com', '/');

header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

function fetch_json($url)
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_TIMEOUT => 12,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
            CURLOPT_USERAGENT => 'ResumeSathi-Sitemap/1.0',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
        ]);

        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);

        if ($status >= 200 && $status < 300 && is_string($body) && trim($body) !== '') {
            $decoded = json_decode($body, true);
            return is_array($decoded) ? $decoded : null;
        }
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Accept: application/json\r\nUser-Agent: ResumeSathi-Sitemap/1.0\r\n",
            'timeout' => 12,
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
    $decoded = is_string($body) ? json_decode($body, true) : null;

    return is_array($decoded) ? $decoded : null;
}

function xml_escape($value)
{
    return htmlspecialchars((string) $value, ENT_XML1 | ENT_COMPAT, 'UTF-8');
}

function slug_from($item)
{
    $raw = $item['slug'] ?? $item['url_name'] ?? $item['canonical_tag'] ?? $item['id'] ?? '';
    $parts = array_values(array_filter(explode('/', (string) $raw)));
    $value = $parts ? end($parts) : $raw;
    $value = strtolower(trim((string) $value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    return trim($value, '-');
}

function normalize_items($payload)
{
    if (!is_array($payload)) {
        return [];
    }

    if (isset($payload['data']) && is_array($payload['data'])) {
        return $payload['data'];
    }

    if (isset($payload['items']) && is_array($payload['items'])) {
        return $payload['items'];
    }

    if (isset($payload['results']) && is_array($payload['results'])) {
        return $payload['results'];
    }

    return $payload;
}

function category_slug_from($category)
{
    if (!is_array($category)) {
        return '';
    }

    $raw = $category['course_url']
        ?? $category['course_name']
        ?? $category['article_name']
        ?? $category['name']
        ?? $category['title']
        ?? '';

    $value = strtolower(trim((string) $raw));
    $value = str_replace('&', ' and ', $value);
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    $value = trim($value, '-');

    return $value === 'railways' ? 'railway' : $value;
}

function iso_date($item)
{
    $raw = $item['updated_at'] ?? $item['created_at'] ?? 'now';
    try {
        return (new DateTime($raw))->setTimezone(new DateTimeZone('UTC'))->format(DateTime::ATOM);
    } catch (Exception $e) {
        return (new DateTime('now', new DateTimeZone('UTC')))->format(DateTime::ATOM);
    }
}

function add_url(&$routes, &$seen, $loc, $lastmod, $changefreq, $priority)
{
    if (isset($seen[$loc])) {
        return;
    }

    $seen[$loc] = true;
    $routes[] = [
        'loc' => $loc,
        'lastmod' => $lastmod,
        'changefreq' => $changefreq,
        'priority' => $priority,
    ];
}

$now = (new DateTime('now', new DateTimeZone('UTC')))->format(DateTime::ATOM);
$routes = [];
$seen = [];

$staticRoutes = [
    ['/', 'weekly', '1.0'],
    ['/blog/', 'weekly', '0.95'],
    ['/jobs/', 'daily', '0.95'],
    ['/resume/', 'weekly', '0.9'],
    ['/resume/resume-type/', 'weekly', '0.85'],
    ['/resume/upload-resume/', 'weekly', '0.8'],
    ['/bio-data/', 'weekly', '0.9'],
    ['/bio-data/resume-type/', 'weekly', '0.85'],
    ['/templates/', 'weekly', '0.9'],
    ['/templates/software-developer-resume-template/', 'monthly', '0.82'],
    ['/templates/fresh-graduate-resume-template/', 'monthly', '0.82'],
    ['/templates/operations-executive-resume-template/', 'monthly', '0.82'],
    ['/templates/sales-resume-template/', 'monthly', '0.82'],
    ['/templates/teacher-resume-template/', 'monthly', '0.82'],
    ['/templates/ui-designer-resume-template/', 'monthly', '0.82'],
    ['/templates/accounting-resume-template/', 'monthly', '0.82'],
    ['/templates/hr-coordinator-resume-template/', 'monthly', '0.82'],
    ['/templates/project-coordinator-resume-template/', 'monthly', '0.82'],
    ['/tools/', 'weekly', '0.85'],
    ['/tools/ats-checker/', 'weekly', '0.82'],
    ['/tools/merge-pdf/', 'weekly', '0.8'],
    ['/tools/split-pdf/', 'weekly', '0.8'],
    ['/tools/pdf-remove/', 'weekly', '0.8'],
    ['/tools/pdf-compressor/', 'weekly', '0.8'],
    ['/tools/docx-to-pdf/', 'weekly', '0.78'],
    ['/tools/image-to-pdf/', 'weekly', '0.78'],
    ['/tools/signature-cropper/', 'weekly', '0.76'],
    ['/tools/age-calculator/', 'weekly', '0.76'],
    ['/typing/', 'weekly', '0.8'],
    ['/typing/practice/', 'weekly', '0.8'],
    ['/typing/learn/', 'weekly', '0.8'],
    ['/typing/learn/lesson/', 'weekly', '0.7'],
    ['/typing/learn/lesson/home-row/', 'monthly', '0.72'],
    ['/typing/learn/lesson/top-row/', 'monthly', '0.72'],
    ['/typing/learn/lesson/bottom-row/', 'monthly', '0.72'],
    ['/typing/learn/lesson/numbers/', 'monthly', '0.72'],
    ['/typing/learn/lesson/punctuation/', 'monthly', '0.72'],
    ['/typing/learn/lesson/capitals/', 'monthly', '0.72'],
    ['/typing/learn/lesson/common-words/', 'monthly', '0.72'],
    ['/typing/learn/lesson/combined/', 'monthly', '0.72'],
    ['/typing/stats/', 'weekly', '0.8'],
    ['/about/', 'monthly', '0.7'],
    ['/contact/', 'monthly', '0.65'],
    ['/privacy-policy/', 'yearly', '0.5'],
    ['/terms-and-conditions/', 'yearly', '0.5'],
    ['/disclaimer/', 'yearly', '0.5'],
];

foreach ($staticRoutes as [$path, $changefreq, $priority]) {
    add_url($routes, $seen, $frontendBase . $path, $now, $changefreq, $priority);
}

$articlesPayload = fetch_json($backendBase . '/api/articles?limit=500');
$articles = normalize_items($articlesPayload);
foreach ($articles as $article) {
    $slug = is_array($article) ? slug_from($article) : '';
    if ($slug) {
        add_url($routes, $seen, $frontendBase . '/blog/' . rawurlencode($slug) . '/', iso_date($article), 'monthly', '0.8');
    }
}

$categoriesPayload = fetch_json($backendBase . '/api/course-categories');
$categories = normalize_items($categoriesPayload);
foreach ($categories as $category) {
    $slug = category_slug_from($category);
    if ($slug) {
        add_url($routes, $seen, $frontendBase . '/jobs/' . rawurlencode($slug) . '/', iso_date($category), 'daily', '0.9');
    }
}

$jobsPayload = fetch_json($backendBase . '/api/courses?limit=500');
$jobs = normalize_items($jobsPayload);
foreach ($jobs as $job) {
    $slug = is_array($job) ? slug_from($job) : '';
    if ($slug) {
        add_url($routes, $seen, $frontendBase . '/jobs/' . rawurlencode($slug) . '/', iso_date($job), 'daily', '0.85');
    }
}

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($routes as $route): ?>
  <url>
    <loc><?= xml_escape($route['loc']) ?></loc>
    <lastmod><?= xml_escape($route['lastmod']) ?></lastmod>
    <changefreq><?= xml_escape($route['changefreq']) ?></changefreq>
    <priority><?= xml_escape($route['priority']) ?></priority>
  </url>
<?php endforeach; ?>
</urlset>
