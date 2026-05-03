<?php

declare(strict_types=1);

const ROOT_DIR = __DIR__;
const DATA_DIR = ROOT_DIR . DIRECTORY_SEPARATOR . 'data';
const DB_FILE = DATA_DIR . DIRECTORY_SEPARATOR . 'db.json';

$defaultDb = [
    'users' => [],
    'session' => null,
    'settings' => ['theme' => 'dark'],
    'inventory' => [
        ['id' => '1', 'model' => 'iPhone 14 Pro', 'brand' => 'Apple Inc.', 'specs' => '256GB, Space Black', 'quantity' => 42],
        ['id' => '2', 'model' => 'Samsung Galaxy S24', 'brand' => 'Samsung Electronics', 'specs' => '256GB, Phantom Black', 'quantity' => 26],
        ['id' => '3', 'model' => 'Redmi Note 13', 'brand' => 'Xiaomi', 'specs' => '256GB, Midnight Black', 'quantity' => 58],
        ['id' => '4', 'model' => 'Vivo V30', 'brand' => 'Vivo', 'specs' => '128GB, Elegant Black', 'quantity' => 15],
        ['id' => '5', 'model' => 'OnePlus 12', 'brand' => 'OnePlus', 'specs' => '256GB, Silky Black', 'quantity' => 0],
    ],
];

function ensureDb(array $defaultDb): void
{
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0777, true);
    }

    if (!file_exists(DB_FILE)) {
        file_put_contents(DB_FILE, json_encode($defaultDb, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }
}

function readDb(array $defaultDb): array
{
    ensureDb($defaultDb);
    $contents = file_get_contents(DB_FILE);
    $decoded = json_decode($contents ?: '', true);
    return is_array($decoded) ? $decoded : $defaultDb;
}

function writeDb(array $db): void
{
    file_put_contents(DB_FILE, json_encode($db, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function publicUser(?array $user): ?array
{
    if (!$user) {
        return null;
    }

    unset($user['pass']);
    return $user;
}

function jsonResponse(mixed $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET,POST,PATCH,DELETE,OPTIONS');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function emptyResponse(int $status = 204): void
{
    http_response_code($status);
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET,POST,PATCH,DELETE,OPTIONS');
    exit;
}

function requestBody(): array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '', true);
    return is_array($decoded) ? $decoded : [];
}

function requestPath(): string
{
    return parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
}

function serveStatic(string $path): void
{
    $relative = ltrim(urldecode($path), '/');
    if ($relative === '') {
        $relative = 'index.html';
    }

    $filePath = realpath(ROOT_DIR . DIRECTORY_SEPARATOR . $relative);
    if ($filePath === false || strncmp($filePath, ROOT_DIR, strlen(ROOT_DIR)) !== 0 || is_dir($filePath)) {
        $filePath = ROOT_DIR . DIRECTORY_SEPARATOR . 'index.html';
    }

    if (!file_exists($filePath)) {
        http_response_code(404);
        echo 'Not found';
        exit;
    }

    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $mime = match ($extension) {
        'css' => 'text/css; charset=utf-8',
        'js' => 'application/javascript; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'png' => 'image/png',
        'jpg', 'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        default => 'text/html; charset=utf-8',
    };

    header('Content-Type: ' . $mime);
    readfile($filePath);
    exit;
}

$path = requestPath();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    emptyResponse();
}

if ($path === '/api/health') {
    jsonResponse(['ok' => true]);
}

$db = readDb($defaultDb);

if ($path === '/api/bootstrap') {
    jsonResponse([
        'session' => publicUser($db['session'] ?? null),
        'settings' => $db['settings'] ?? ['theme' => 'dark'],
        'inventory' => $db['inventory'] ?? [],
        'users' => array_map('publicUser', $db['users'] ?? []),
    ]);
}

if ($path === '/api/settings' && $method === 'GET') {
    jsonResponse($db['settings'] ?? ['theme' => 'dark']);
}

if ($path === '/api/inventory' && $method === 'GET') {
    jsonResponse($db['inventory'] ?? []);
}

if ($path === '/api/signup' && $method === 'POST') {
    $body = requestBody();
    $name = trim((string)($body['name'] ?? ''));
    $email = trim((string)($body['email'] ?? ''));
    $password = (string)($body['pass'] ?? '');

    if ($name === '' || $email === '' || $password === '') {
        jsonResponse(['error' => 'Missing required fields.'], 400);
    }

    foreach ($db['users'] as $user) {
        if (strcasecmp((string)$user['email'], $email) === 0) {
            jsonResponse(['error' => 'Email already exists.'], 409);
        }
    }

    $newUser = [
        'name' => $name,
        'email' => $email,
        'pass' => $password,
        'theme' => $db['settings']['theme'] ?? 'dark',
    ];

    $db['users'][] = $newUser;
    $db['session'] = $newUser;
    writeDb($db);

    jsonResponse(['user' => publicUser($newUser), 'session' => publicUser($newUser)], 201);
}

if ($path === '/api/login' && $method === 'POST') {
    $body = requestBody();
    $email = (string)($body['email'] ?? '');
    $password = (string)($body['pass'] ?? '');

    if ($email === '' || $password === '') {
        jsonResponse(['error' => 'Missing credentials.'], 400);
    }

    foreach ($db['users'] as $user) {
        if (($user['email'] ?? '') === $email && ($user['pass'] ?? '') === $password) {
            $db['session'] = $user;
            writeDb($db);
            jsonResponse(['user' => publicUser($user), 'session' => publicUser($user)]);
        }
    }

    jsonResponse(['error' => 'Invalid email or password.'], 401);
}

if ($path === '/api/logout' && $method === 'POST') {
    $db['session'] = null;
    writeDb($db);
    jsonResponse(['ok' => true]);
}

if ($path === '/api/session' && $method === 'PATCH') {
    if (!is_array($db['session'])) {
        jsonResponse(['error' => 'No active session.'], 404);
    }

    $body = requestBody();
    $updated = array_merge($db['session'], $body);
    $db['session'] = $updated;

    foreach ($db['users'] as $index => $user) {
        if (($user['email'] ?? '') === ($updated['email'] ?? '')) {
            $db['users'][$index] = array_merge($user, $body);
        }
    }

    writeDb($db);
    jsonResponse(['session' => publicUser($updated)]);
}

if ($path === '/api/settings' && $method === 'PATCH') {
    $body = requestBody();
    $db['settings'] = array_merge($db['settings'] ?? [], $body);
    writeDb($db);
    jsonResponse($db['settings']);
}

if ($path === '/api/inventory' && $method === 'POST') {
    $body = requestBody();
    $model = trim((string)($body['model'] ?? ''));
    $brand = trim((string)($body['brand'] ?? ''));
    $specs = trim((string)($body['specs'] ?? ''));

    if ($model === '' || $brand === '' || $specs === '') {
        jsonResponse(['error' => 'Missing product data.'], 400);
    }

    $item = [
        'id' => (string)round(microtime(true) * 1000),
        'model' => $model,
        'brand' => $brand,
        'specs' => $specs,
        'quantity' => (int)($body['quantity'] ?? 0),
    ];

    array_unshift($db['inventory'], $item);
    writeDb($db);
    jsonResponse($item, 201);
}

if (preg_match('#^/api/inventory/([^/]+)$#', $path, $matches) === 1) {
    $itemId = $matches[1];

    if ($method === 'PATCH') {
        $body = requestBody();
        foreach ($db['inventory'] as $index => $item) {
            if (($item['id'] ?? '') === $itemId) {
                $db['inventory'][$index] = array_merge($item, $body);
                writeDb($db);
                jsonResponse($db['inventory'][$index]);
            }
        }

        jsonResponse(['error' => 'Item not found.'], 404);
    }

    if ($method === 'DELETE') {
        $before = count($db['inventory']);
        $db['inventory'] = array_values(array_filter(
            $db['inventory'],
            fn (array $item): bool => ($item['id'] ?? '') !== $itemId
        ));

        if (count($db['inventory']) === $before) {
            jsonResponse(['error' => 'Item not found.'], 404);
        }

        writeDb($db);
        jsonResponse(['ok' => true]);
    }
}

if ($path !== '/' && str_starts_with($path, '/api/')) {
    jsonResponse(['error' => 'Not found'], 404);
}

serveStatic($path);