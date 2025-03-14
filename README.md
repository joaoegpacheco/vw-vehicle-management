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
        "id": "b8b6a01e78378677",
        "type": "tab",
        "label": "Flow 2",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "7a21863977466117",
        "type": "junction",
        "z": "b8b6a01e78378677",
        "x": 580,
        "y": 360,
        "wires": [
            []
        ]
    },
    {
        "id": "auth-login",
        "type": "http in",
        "z": "b8b6a01e78378677",
        "name": "Login",
        "url": "/login",
        "method": "post",
        "x": 90,
        "y": 360,
        "wires": [
            [
                "process-login"
            ]
        ]
    },
    {
        "id": "process-login",
        "type": "function",
        "z": "b8b6a01e78378677",
        "name": "Process Login",
        "func": "// Importa as bibliotecas globais\nconst jwt = global.get(\"jwt\");\nconst bcrypt = global.get(\"bcrypt\");\n\n// Verifica se os dados foram enviados corretamente\nif (!msg.payload || !msg.payload.name || !msg.payload.password) {\n    msg.payload = { error: \"Nome e senha são obrigatórios\" };\n    msg.statusCode = 400;\n    return msg;\n}\n\n// Dados da requisição\nconst { name, password } = msg.payload;\n\n// Simulação de banco de dados no Context Storage\nconst users = flow.get(\"users\") || [];\n\n// Buscar usuário no banco simulado\nconst user = users.find(u => u.name === name);\nif (!user) {\n    msg.payload = { error: \"Usuário não encontrado\" };\n    msg.statusCode = 401;\n    return msg;\n}\n\n// Verificar senha com bcrypt\nconst isMatch = bcrypt.compareSync(password, user.password);\nif (!isMatch) {\n    msg.payload = { error: \"Senha incorreta\" };\n    msg.statusCode = 401;\n    return msg;\n}\n\n// Gerar JWT Token\nconst token = jwt.sign(\n    { uuid: user.uuid, name: user.name, isRoot: user.isRoot }, \n    \"secreta\", \n    { expiresIn: \"1h\" }\n);\n\nmsg.payload = { token };\nmsg.statusCode = 200;\nreturn msg;\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 560,
        "y": 360,
        "wires": [
            [
                "4c4a3fc96befa010"
            ]
        ]
    },
    {
        "id": "verify-token",
        "type": "function",
        "z": "b8b6a01e78378677",
        "name": "Verify Token",
        "func": "// Middleware para validar JWT em todas as rotas protegidas",
        "outputs": 1,
        "x": 370,
        "y": 440,
        "wires": [
            []
        ]
    },
    {
        "id": "create-user",
        "type": "http in",
        "z": "b8b6a01e78378677",
        "name": "Create User",
        "url": "/users",
        "method": "post",
        "x": 110,
        "y": 60,
        "wires": [
            [
                "process-create-user"
            ]
        ]
    },
    {
        "id": "process-create-user",
        "type": "function",
        "z": "b8b6a01e78378677",
        "name": "Process Create User",
        "func": "// Importa as bibliotecas globais\nconst bcrypt = global.get(\"bcrypt\");\n\n// Verifica se os dados foram enviados corretamente\nif (!msg.payload || !msg.payload.name || !msg.payload.password) {\n    msg.payload = { error: \"Nome e senha são obrigatórios\" };\n    msg.statusCode = 400;\n    return msg;\n}\n\n// Extrai os dados do payload\nconst { name, password, isRoot, isActived } = msg.payload;\n\n// Recupera a lista de usuários armazenados no Context Storage\nlet users = flow.get(\"users\") || [];\n\n// Verifica se o usuário já existe\nconst userExists = users.find(u => u.name === name);\nif (userExists) {\n    msg.payload = { error: \"Usuário já existe\" };\n    msg.statusCode = 400;\n    return msg;\n}\n\n// Criar novo usuário com senha criptografada\nconst newUser = {\n    uuid: Math.random().toString(36).substr(2, 9), // Gera um UUID aleatório simples\n    name,\n    password: bcrypt.hashSync(password, 10), // Criptografa a senha\n    isRoot: isRoot || false,\n    isActived: isActived !== undefined ? isActived : true\n};\n\n// Adiciona o usuário ao banco simulado\nusers.push(newUser);\nflow.set(\"users\", users); // Salva os usuários atualizados no Context Storage\n\n// Retorna a resposta de sucesso\nmsg.payload = { message: \"Usuário criado com sucesso\", user: newUser };\nmsg.statusCode = 201;\nreturn msg;\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 580,
        "y": 60,
        "wires": [
            [
                "5e3dbc1df4eb0c7e"
            ]
        ]
    },
    {
        "id": "create-vehicle",
        "type": "http in",
        "z": "b8b6a01e78378677",
        "name": "Create Vehicle",
        "url": "/vehicles",
        "method": "post",
        "x": 110,
        "y": 120,
        "wires": [
            [
                "verify-token",
                "process-create-vehicle"
            ]
        ]
    },
    {
        "id": "process-create-vehicle",
        "type": "function",
        "z": "b8b6a01e78378677",
        "name": "Process Create Vehicle",
        "func": "// Importa as bibliotecas globais\nconst jwt = global.get(\"jwt\");\n\n// Verifica se os dados foram enviados corretamente\nif (!msg.payload || !msg.payload.creationUserName || !msg.payload.model || !msg.payload.color || !msg.payload.year || !msg.payload.imagePath) {\n    msg.payload = { error: \"Todos os campos são obrigatórios (creationUserName, model, color, year, imagePath)\" };\n    msg.statusCode = 400;\n    return msg;\n}\n\n// Extrai os dados do payload\nconst { creationUserName, model, color, year, imagePath } = msg.payload;\n\n// Simulação de banco de dados no Context Storage\nlet vehicles = flow.get(\"vehicles\") || [];\n\n// Criar novo veículo\nconst newVehicle = {\n    uuid: Math.random().toString(36).substr(2, 9), // Gera um UUID aleatório simples\n    creationUserName,\n    updatedUserName: creationUserName, // Inicialmente, o mesmo usuário que criou\n    creationDate: new Date().toISOString(),\n    updatedDate: new Date().toISOString(),\n    model,\n    color,\n    year,\n    imagePath\n};\n\n// Adiciona o veículo ao banco simulado\nvehicles.push(newVehicle);\nflow.set(\"vehicles\", vehicles); // Salva os veículos atualizados no Context Storage\n\n// Gera um log do evento\nlet logs = flow.get(\"logs\") || [];\nlogs.push(`[${new Date().toISOString()}][${creationUserName}][POST /vehicles]: ${JSON.stringify(newVehicle)}`);\nflow.set(\"logs\", logs);\n\n// Retorna a resposta de sucesso\nmsg.payload = { message: \"Veículo cadastrado com sucesso\", vehicle: newVehicle };\nmsg.statusCode = 201;\nreturn msg;\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 590,
        "y": 120,
        "wires": [
            [
                "b612b942098ccf58"
            ]
        ]
    },
    {
        "id": "get-vehicles",
        "type": "http in",
        "z": "b8b6a01e78378677",
        "name": "Get Vehicles",
        "url": "/vehicles",
        "method": "get",
        "x": 110,
        "y": 180,
        "wires": [
            [
                "verify-token",
                "process-get-vehicles"
            ]
        ]
    },
    {
        "id": "process-get-vehicles",
        "type": "function",
        "z": "b8b6a01e78378677",
        "name": "Process Get Vehicles",
        "func": "// Recupera os veículos armazenados no Context Storage\nlet vehicles = flow.get(\"vehicles\") || [];\n\n// Obtém parâmetros opcionais de filtragem e paginação\nlet { page, limit, search, sortBy, order } = msg.req.query;\n\n// Filtragem por texto (busca)\nif (search) {\n    const searchLower = search.toLowerCase();\n    vehicles = vehicles.filter(v =>\n        v.model.modeName.toLowerCase().includes(searchLower) ||\n        v.color.colorName.toLowerCase().includes(searchLower) ||\n        v.creationUserName.toLowerCase().includes(searchLower)\n    );\n}\n\n// Ordenação\nif (sortBy) {\n    const orderFactor = order === \"desc\" ? -1 : 1;\n    vehicles.sort((a, b) => (a[sortBy] > b[sortBy] ? orderFactor : -orderFactor));\n}\n\n// Paginação\npage = parseInt(page) || 1;\nlimit = parseInt(limit) || 10;\nconst startIndex = (page - 1) * limit;\nconst endIndex = startIndex + limit;\nconst paginatedVehicles = vehicles.slice(startIndex, endIndex);\n\n// Retorna a resposta\nmsg.payload = {\n    total: vehicles.length,\n    page,\n    limit,\n    vehicles: paginatedVehicles\n};\nmsg.statusCode = 200;\nreturn msg;\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 580,
        "y": 180,
        "wires": [
            [
                "bf37cfdcb63ab08d"
            ]
        ]
    },
    {
        "id": "delete-vehicle",
        "type": "http in",
        "z": "b8b6a01e78378677",
        "name": "Delete Vehicle",
        "url": "/vehicles/:id",
        "method": "delete",
        "x": 110,
        "y": 240,
        "wires": [
            [
                "verify-token",
                "process-delete-vehicle"
            ]
        ]
    },
    {
        "id": "process-delete-vehicle",
        "type": "function",
        "z": "b8b6a01e78378677",
        "name": "Process Delete Vehicle",
        "func": "// Obtém o ID do veículo a ser excluído\nconst vehicleId = msg.req.params.id;\n\n// Recupera a lista de veículos armazenados no Context Storage\nlet vehicles = flow.get(\"vehicles\") || [];\n\n// Encontra o veículo\nconst vehicleIndex = vehicles.findIndex(v => v.uuid === vehicleId);\nif (vehicleIndex === -1) {\n    msg.payload = { error: \"Veículo não encontrado\" };\n    msg.statusCode = 404;\n    return msg;\n}\n\n// Captura o nome do usuário que fez a requisição (simulação)\nconst requestingUser = msg.req.headers[\"x-user\"] || \"desconhecido\";\n\n// Remove o veículo\nconst deletedVehicle = vehicles.splice(vehicleIndex, 1)[0];\nflow.set(\"vehicles\", vehicles);\n\n// Gera um log do evento\nlet logs = flow.get(\"logs\") || [];\nlogs.push(`[${new Date().toISOString()}][${requestingUser}][DELETE /vehicles]: ${JSON.stringify(deletedVehicle)}`);\nflow.set(\"logs\", logs);\n\n// Retorna a resposta de sucesso\nmsg.payload = { message: \"Veículo excluído com sucesso\", vehicle: deletedVehicle };\nmsg.statusCode = 200;\nreturn msg;\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 580,
        "y": 240,
        "wires": [
            [
                "03cb7ad042f44929"
            ]
        ]
    },
    {
        "id": "upload-image",
        "type": "http in",
        "z": "b8b6a01e78378677",
        "name": "Upload Image",
        "url": "/upload",
        "method": "post",
        "x": 110,
        "y": 300,
        "wires": [
            [
                "verify-token",
                "process-upload-image"
            ]
        ]
    },
    {
        "id": "process-upload-image",
        "type": "function",
        "z": "b8b6a01e78378677",
        "name": "Process Upload Image",
        "func": "// Verifica se os dados da imagem foram recebidos corretamente\nif (!msg.payload || !msg.payload.filename || !msg.payload.data) {\n    msg.payload = { error: \"Imagem não recebida ou inválida\" };\n    msg.statusCode = 400;\n    return msg;\n}\n\n// Extrai os dados da imagem do payload\nconst { filename, data } = msg.payload;\n\n// Diretório onde as imagens serão armazenadas (altere conforme necessário)\nconst uploadDir = '/path/to/upload/directory'; // Altere para o diretório desejado\n\n// Verifica se o diretório de upload existe\nconst fs = require('fs');\nconst path = require('path');\nconst filePath = path.join(uploadDir, filename);\n\n// Cria o diretório se não existir\nif (!fs.existsSync(uploadDir)) {\n    fs.mkdirSync(uploadDir, { recursive: true });\n}\n\n// Salva a imagem no diretório especificado\nfs.writeFile(filePath, data, (err) => {\n    if (err) {\n        // Caso haja erro no salvamento, retorna erro 500\n        msg.payload = { error: 'Erro ao salvar a imagem' };\n        msg.statusCode = 500;\n    } else {\n        // Se o arquivo for salvo com sucesso, retorna o caminho da imagem\n        msg.payload = { \n            message: 'Imagem salva com sucesso',\n            filePath: filePath // Retorna o caminho completo da imagem salva\n        };\n        msg.statusCode = 200;\n    }\n});\n\nreturn msg;\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 580,
        "y": 300,
        "wires": [
            []
        ]
    },
    {
        "id": "4c4a3fc96befa010",
        "type": "http response",
        "z": "b8b6a01e78378677",
        "name": "",
        "statusCode": "",
        "headers": {},
        "x": 790,
        "y": 360,
        "wires": []
    },
    {
        "id": "5e3dbc1df4eb0c7e",
        "type": "http response",
        "z": "b8b6a01e78378677",
        "name": "",
        "statusCode": "",
        "headers": {},
        "x": 810,
        "y": 60,
        "wires": []
    },
    {
        "id": "b612b942098ccf58",
        "type": "http response",
        "z": "b8b6a01e78378677",
        "name": "",
        "statusCode": "",
        "headers": {},
        "x": 810,
        "y": 120,
        "wires": []
    },
    {
        "id": "bf37cfdcb63ab08d",
        "type": "http response",
        "z": "b8b6a01e78378677",
        "name": "",
        "statusCode": "",
        "headers": {},
        "x": 810,
        "y": 180,
        "wires": []
    },
    {
        "id": "03cb7ad042f44929",
        "type": "http response",
        "z": "b8b6a01e78378677",
        "name": "",
        "statusCode": "",
        "headers": {},
        "x": 810,
        "y": 240,
        "wires": []
    }
]
```

## Front-End

In the project /frontend directory, you can run:

```
npm-start
```
