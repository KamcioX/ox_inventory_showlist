<?php
$luaFile = __DIR__ . '/ox_inventory/data/items.lua'; // tutaj dodaj ścieżke

if (!file_exists($luaFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Plik items.lua nie istnieje.']);
    exit;
}

$luaContent = file_get_contents($luaFile);


$luaContent = preg_replace('/--.*$/m', '', $luaContent);


preg_match_all("/\\['(.*?)'\\]\\s*=\\s*\\{(.*?)\\},/s", $luaContent, $matches, PREG_SET_ORDER);

$items = [];

foreach ($matches as $match) {
    $itemName = $match[1];
    $itemDataRaw = trim($match[2]);

    $item = [];


    preg_match_all("/(\\w+)\\s*=\\s*(true|false|\".*?\"|'.*?'|[0-9]+)/", $itemDataRaw, $fields, PREG_SET_ORDER);

    foreach ($fields as $field) {
        $key = $field[1];
        $value = $field[2];


        if ($value === 'true') {
            $item[$key] = true;
        } elseif ($value === 'false') {
            $item[$key] = false;
        } elseif (is_numeric($value)) {
            $item[$key] = (int)$value;
        } else {

            $item[$key] = trim($value, "\"'");
        }
    }

    $items[$itemName] = $item;
}


header('Content-Type: application/json; charset=utf-8');
echo json_encode($items, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
