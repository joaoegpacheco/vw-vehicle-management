# Teste Técnico - Desenvolvedor FullStack de gerenciamento de veículos do grupo VolksWagen.

## Back-End

In the project /backend directory, you can run:

```
node-red
```

> In the navigator, import json to menu at node-red:

```
[
    {
      "id": "auth-login",
      "type": "http in",
      "name": "Login",
      "url": "/login",
      "method": "post",
      "wires": [["process-login"]]
    },
    {
      "id": "process-login",
      "type": "function",
      "name": "Process Login",
      "func": "// Verifica credenciais e gera JWT"
    },
    {
      "id": "verify-token",
      "type": "function",
      "name": "Verify Token",
      "func": "// Middleware para validar JWT em todas as rotas protegidas"
    },
    {
      "id": "create-user",
      "type": "http in",
      "name": "Create User",
      "url": "/users",
      "method": "post",
      "wires": [["verify-token", "process-create-user"]]
    },
    {
      "id": "process-create-user",
      "type": "function",
      "name": "Process Create User",
      "func": "// Cria novo usuário e armazena no Context Storage"
    },
    {
      "id": "create-vehicle",
      "type": "http in",
      "name": "Create Vehicle",
      "url": "/vehicles",
      "method": "post",
      "wires": [["verify-token", "process-create-vehicle"]]
    },
    {
      "id": "process-create-vehicle",
      "type": "function",
      "name": "Process Create Vehicle",
      "func": "// Armazena veículo no Context Storage e gera log"
    },
    {
      "id": "get-vehicles",
      "type": "http in",
      "name": "Get Vehicles",
      "url": "/vehicles",
      "method": "get",
      "wires": [["verify-token", "process-get-vehicles"]]
    },
    {
      "id": "process-get-vehicles",
      "type": "function",
      "name": "Process Get Vehicles",
      "func": "// Retorna lista de veículos com paginação"
    },
    {
      "id": "delete-vehicle",
      "type": "http in",
      "name": "Delete Vehicle",
      "url": "/vehicles/:id",
      "method": "delete",
      "wires": [["verify-token", "process-delete-vehicle"]]
    },
    {
      "id": "process-delete-vehicle",
      "type": "function",
      "name": "Process Delete Vehicle",
      "func": "// Remove veículo e gera log"
    },
    {
      "id": "upload-image",
      "type": "http in",
      "name": "Upload Image",
      "url": "/upload",
      "method": "post",
      "wires": [["verify-token", "process-upload-image"]]
    },
    {
      "id": "process-upload-image",
      "type": "function",
      "name": "Process Upload Image",
      "func": "// Salva imagem no servidor e retorna path"
    }
  ]
```

## Front-End

In the project /frontend directory, you can run:

```
npm-start
```
